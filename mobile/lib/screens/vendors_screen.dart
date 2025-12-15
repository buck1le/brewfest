import 'package:flutter/material.dart';
import '../models/vendor.dart';
import '../repositories/vendor_repository.dart';
import '../repositories/favorites_repository.dart';
import '../widgets/vendor_card.dart';
import '../widgets/live_indicator.dart';
import '../widgets/vendor_detail_sheet.dart';
import '../theme/app_theme.dart';

enum VendorFilter { all, beverage, food, merchandise }

enum SortOption { featured, name, booth }

class VendorsScreen extends StatefulWidget {
  const VendorsScreen({super.key});

  @override
  State<VendorsScreen> createState() => _VendorsScreenState();
}

class _VendorsScreenState extends State<VendorsScreen> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true; // Keeps state alive when switching tabs

  final VendorRepository _repository = ApiVendorRepository(
    baseUrl: 'http://localhost:8080/api/v1',
    eventId: 1, // TODO: Make this dynamic based on the selected event
  );
  final FavoritesRepository _favoritesRepository = FavoritesRepositoryImpl();
  List<Vendor> _vendors = [];
  List<Vendor> _filteredVendors = [];
  Set<String> _favoriteIds = {};
  bool _isLoading = true;
  String? _errorMessage;
  String _searchQuery = '';
  VendorFilter _selectedFilter = VendorFilter.all;
  SortOption _sortOption = SortOption.featured;

  @override
  void initState() {
    super.initState();
    print('🚀 [VendorsScreen] initState called - this should only happen ONCE!');
    _loadVendors();
  }

  @override
  void dispose() {
    print('💀 [VendorsScreen] dispose called - screen is being destroyed');
    super.dispose();
  }

  Future<void> _loadVendors() async {
    if (!mounted) return;
    print('📥 [VendorsScreen] Loading vendors...');
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final vendors = await _repository.getVendors();
      final favorites = await _favoritesRepository.getFavorites();
      if (!mounted) return;
      print('✅ [VendorsScreen] Loaded ${vendors.length} vendors');
      setState(() {
        _vendors = vendors;
        _favoriteIds = favorites;
        _applyFiltersAndSort();
        _isLoading = false;
      });
    } catch (e) {
      print('❌ [VendorsScreen] Error loading vendors: $e');
      if (!mounted) return;
      setState(() {
        _errorMessage = 'Failed to load vendors: $e';
        _isLoading = false;
      });
    }
  }

  Future<void> _toggleFavorite(int vendorId) async {
    await _favoritesRepository.toggleFavorite(vendorId.toString());
    final favorites = await _favoritesRepository.getFavorites();
    if (!mounted) return;
    setState(() {
      _favoriteIds = favorites;
    });
  }

  void _applyFiltersAndSort() {
    var filtered = _vendors;

    // Apply filter
    switch (_selectedFilter) {
      case VendorFilter.beverage:
        filtered = filtered.where((v) => v.category?.toLowerCase() == 'beverage').toList();
        break;
      case VendorFilter.food:
        filtered = filtered.where((v) => v.category?.toLowerCase() == 'food').toList();
        break;
      case VendorFilter.merchandise:
        filtered = filtered.where((v) => v.category?.toLowerCase() == 'merchandise').toList();
        break;
      case VendorFilter.all:
        break;
    }

    // Apply search
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((v) {
        final query = _searchQuery.toLowerCase();
        return v.name.toLowerCase().contains(query) ||
            v.description.toLowerCase().contains(query) ||
            v.tags.any((tag) => tag.toLowerCase().contains(query));
      }).toList();
    }

    // Apply sort
    switch (_sortOption) {
      case SortOption.featured:
        filtered.sort((a, b) {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.compareTo(b.name);
        });
        break;
      case SortOption.name:
        filtered.sort((a, b) => a.name.compareTo(b.name));
        break;
      case SortOption.booth:
        filtered.sort((a, b) {
          if (a.booth == null && b.booth == null) return 0;
          if (a.booth == null) return 1;
          if (b.booth == null) return -1;
          return a.booth!.compareTo(b.booth!);
        });
        break;
    }

    setState(() {
      _filteredVendors = filtered;
    });
  }

  int get _totalVendorCount => _vendors.length;

  int get _beverageCount => _vendors.where((v) => v.category?.toLowerCase() == 'beverage').length;

  int get _foodCount => _vendors.where((v) => v.category?.toLowerCase() == 'food').length;

  int get _merchandiseCount => _vendors.where((v) => v.category?.toLowerCase() == 'merchandise').length;

  @override
  Widget build(BuildContext context) {
    super.build(context); // Required for AutomaticKeepAliveClientMixin

    return Scaffold(
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SafeArea(
              top: false,
              child: RefreshIndicator(
                onRefresh: _loadVendors,
                child: Column(
                  children: [
                    _buildSearchBar(),
                    _buildFilterChips(),
                    _buildVendorListHeader(),
                    Expanded(
                      child: _isLoading
                          ? const Center(child: CircularProgressIndicator())
                          : _buildVendorList(),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            AppTheme.primaryNavy,
            AppTheme.secondaryNavy,
          ],
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            // Main header content
            Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // Logo
                  ClipRRect(
                    borderRadius: BorderRadius.circular(40),
                    child: Image.asset(
                      'assets/WWBF-KATYImage.png',
                      width: 60,
                      height: 60,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(width: 12),
                  // Event info
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Wild West Brewfest',
                          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                                fontSize: 20,
                              ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Katy, TX • Oct 20',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Colors.white70,
                              ),
                        ),
                        const SizedBox(height: 8),
                        // Live indicator
                        const LiveIndicator(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            // Notification bell - positioned absolutely in top right
            Positioned(
              top: 16,
              right: 16,
              child: Stack(
                clipBehavior: Clip.none,
                children: [
                  Icon(
                    Icons.notifications_outlined,
                    color: Colors.white,
                    size: 28,
                  ),
                  Positioned(
                    top: 2,
                    right: 2,
                    child: Container(
                      width: 10,
                      height: 10,
                      decoration: BoxDecoration(
                        color: AppTheme.accentOrange,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: AppTheme.primaryNavy,
                          width: 2,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSearchBar() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 12),
      child: TextField(
        decoration: const InputDecoration(
          hintText: 'Search vendors, food, styles...',
          prefixIcon: Icon(Icons.search, color: AppTheme.textSecondary),
        ),
        onChanged: (value) {
          setState(() {
            _searchQuery = value;
            _applyFiltersAndSort();
          });
        },
      ),
    );
  }

  Widget _buildFilterChips() {
    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      child: Row(
        children: [
          _buildFilterChip(
            label: 'All Vendors',
            icon: Icons.local_drink,
            count: _totalVendorCount,
            isSelected: _selectedFilter == VendorFilter.all,
            onTap: () {
              setState(() {
                _selectedFilter = VendorFilter.all;
                _applyFiltersAndSort();
              });
            },
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            label: 'Beverage',
            icon: Icons.sports_bar,
            count: _beverageCount,
            isSelected: _selectedFilter == VendorFilter.beverage,
            onTap: () {
              setState(() {
                _selectedFilter = VendorFilter.beverage;
                _applyFiltersAndSort();
              });
            },
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            label: 'Food',
            icon: Icons.restaurant,
            count: _foodCount,
            isSelected: _selectedFilter == VendorFilter.food,
            onTap: () {
              setState(() {
                _selectedFilter = VendorFilter.food;
                _applyFiltersAndSort();
              });
            },
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            label: 'Merchandise',
            icon: Icons.shopping_bag,
            count: _merchandiseCount,
            isSelected: _selectedFilter == VendorFilter.merchandise,
            onTap: () {
              setState(() {
                _selectedFilter = VendorFilter.merchandise;
                _applyFiltersAndSort();
              });
            },
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip({
    required String label,
    required IconData icon,
    int? count,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppTheme.primaryNavy : Colors.white,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(
            color: isSelected ? AppTheme.primaryNavy : AppTheme.borderColor,
            width: isSelected ? 0 : 1,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 20,
              color: isSelected ? Colors.white : AppTheme.textPrimary,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w600,
                color: isSelected ? Colors.white : AppTheme.textPrimary,
              ),
            ),
            if (count != null) ...[
              const SizedBox(width: 8),
              Container(
                constraints: const BoxConstraints(minWidth: 28),
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: isSelected ? AppTheme.accentOrange : AppTheme.backgroundColor,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(
                    count.toString(),
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? Colors.white : AppTheme.textPrimary,
                    ),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildVendorListHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Event Vendors',
                style: Theme.of(context).textTheme.headlineMedium,
              ),
              _isLoading
                  ? SizedBox(
                      height: 20,
                      child: Row(
                        children: [
                          SizedBox(
                            height: 12,
                            width: 12,
                            child: CircularProgressIndicator(
                              strokeWidth: 2,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            'Loading...',
                            style: Theme.of(context).textTheme.bodyMedium,
                          ),
                        ],
                      ),
                    )
                  : Text(
                      '${_filteredVendors.length} available',
                      style: Theme.of(context).textTheme.bodyMedium,
                    ),
            ],
          ),
          GestureDetector(
            onTap: () => _showSortMenu(context),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: AppTheme.backgroundColor,
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    'Sort by: ',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          color: AppTheme.textSecondary,
                          fontSize: 13,
                        ),
                  ),
                  Text(
                    _getSortOptionLabel(_sortOption),
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                  ),
                  const SizedBox(width: 4),
                  const Icon(
                    Icons.unfold_more,
                    size: 16,
                    color: AppTheme.textSecondary,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  String _getSortOptionLabel(SortOption option) {
    switch (option) {
      case SortOption.featured:
        return 'Featured';
      case SortOption.name:
        return 'Name (A-Z)';
      case SortOption.booth:
        return 'Booth Number';
    }
  }

  void _showSortMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        decoration: const BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
        ),
        child: SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 8),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: Colors.grey[300],
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 20),
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    'Sort by:',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          fontWeight: FontWeight.w600,
                          fontSize: 18,
                        ),
                  ),
                ),
              ),
              const SizedBox(height: 12),
              _buildSortOption(
                context,
                label: 'Featured',
                option: SortOption.featured,
              ),
              _buildSortOption(
                context,
                label: 'Name (A-Z)',
                option: SortOption.name,
              ),
              _buildSortOption(
                context,
                label: 'Booth Number',
                option: SortOption.booth,
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSortOption(BuildContext context, {required String label, required SortOption option}) {
    final isSelected = _sortOption == option;

    return InkWell(
      onTap: () {
        setState(() {
          _sortOption = option;
          _applyFiltersAndSort();
        });
        Navigator.pop(context);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              label,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                  ),
            ),
            if (isSelected)
              const Icon(
                Icons.check,
                color: AppTheme.primaryNavy,
                size: 24,
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildVendorList() {
    if (_filteredVendors.isEmpty) {
      // Wrap in ListView to make it scrollable for RefreshIndicator
      return ListView(
        children: [
          SizedBox(
            height: 400,
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.search_off,
                    size: 64,
                    color: AppTheme.textSecondary.withValues(alpha: 0.5),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _errorMessage ?? 'No vendors found',
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(
                          color: AppTheme.textSecondary,
                        ),
                    textAlign: TextAlign.center,
                  ),
                  if (_errorMessage != null) ...[
                    const SizedBox(height: 16),
                    Text(
                      'Pull down to retry',
                      style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: AppTheme.textSecondary,
                          ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ],
      );
    }

    return ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: _filteredVendors.length,
      itemBuilder: (context, index) {
        final vendor = _filteredVendors[index];
        return VendorCard(
          vendor: vendor,
          isFavorited: _favoriteIds.contains(vendor.id.toString()),
          onTap: () => _showVendorDetail(vendor),
          onFavoriteToggle: () => _toggleFavorite(vendor.id),
        );
      },
    );
  }

  void _showVendorDetail(Vendor vendor) {
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.9,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => VendorDetailSheet(
          vendor: vendor,
        ),
      ),
    );
  }
}
