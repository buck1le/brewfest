import 'package:flutter/material.dart';
import '../repositories/mock_drink_repository.dart';
import '../repositories/api_inventory_repository.dart';
import '../repositories/mock_vendor_repository.dart';
import '../repositories/vendor_repository.dart';
import '../repositories/favorites_repository.dart';
import '../widgets/drink_card.dart';
import '../widgets/vendor_detail_sheet.dart';
import '../widgets/live_indicator.dart';
import '../theme/app_theme.dart';

enum DrinkFilter { all, ipa, stout, paleAle, sour, other }

enum DrinkSortOption { featured, name, abv, price }

class DrinksScreen extends StatefulWidget {
  const DrinksScreen({super.key});

  @override
  State<DrinksScreen> createState() => _DrinksScreenState();
}

class _DrinksScreenState extends State<DrinksScreen> {
  final DrinkRepository _repository = MockDrinkRepository();
  final VendorRepository _vendorRepository = MockVendorRepository();
  final FavoritesRepository _favoritesRepository = FavoritesRepository();
  List<Drink> _drinks = [];
  List<Drink> _filteredDrinks = [];
  Set<String> _favoriteDrinkIds = {};
  bool _isLoading = true;
  String _searchQuery = '';
  DrinkFilter _selectedFilter = DrinkFilter.all;
  DrinkSortOption _sortOption = DrinkSortOption.featured;

  @override
  void initState() {
    super.initState();
    _loadDrinks();
  }

  Future<void> _loadDrinks() async {
    if (!mounted) return;
    setState(() => _isLoading = true);
    final drinks = await _repository.getDrinks();
    final favorites = await _favoritesRepository.getFavorites();
    if (!mounted) return;
    setState(() {
      _drinks = drinks;
      _favoriteDrinkIds = favorites.where((id) => id.startsWith('drink_')).toSet();
      _applyFiltersAndSort();
      _isLoading = false;
    });
  }

  Future<void> _toggleFavorite(String drinkId) async {
    final favoriteId = 'drink_$drinkId';
    await _favoritesRepository.toggleFavorite(favoriteId);
    final favorites = await _favoritesRepository.getFavorites();
    if (!mounted) return;
    setState(() {
      _favoriteDrinkIds = favorites.where((id) => id.startsWith('drink_')).toSet();
    });
  }

  void _applyFiltersAndSort() {
    var filtered = _drinks;

    // Apply filter
    switch (_selectedFilter) {
      case DrinkFilter.ipa:
        filtered = filtered.where((d) => d.style.toLowerCase().contains('ipa')).toList();
        break;
      case DrinkFilter.stout:
        filtered = filtered.where((d) => d.style.toLowerCase().contains('stout')).toList();
        break;
      case DrinkFilter.paleAle:
        filtered = filtered.where((d) => d.style.toLowerCase().contains('pale')).toList();
        break;
      case DrinkFilter.sour:
        filtered = filtered.where((d) => d.style.toLowerCase().contains('sour')).toList();
        break;
      case DrinkFilter.other:
        filtered = filtered.where((d) {
          final style = d.style.toLowerCase();
          return !style.contains('ipa') &&
              !style.contains('stout') &&
              !style.contains('pale') &&
              !style.contains('sour');
        }).toList();
        break;
      case DrinkFilter.all:
        break;
    }

    // Apply search
    if (_searchQuery.isNotEmpty) {
      filtered = filtered.where((d) {
        final query = _searchQuery.toLowerCase();
        return d.name.toLowerCase().contains(query) ||
            d.description.toLowerCase().contains(query) ||
            d.vendorName.toLowerCase().contains(query) ||
            d.style.toLowerCase().contains(query);
      }).toList();
    }

    // Apply sort
    switch (_sortOption) {
      case DrinkSortOption.featured:
        filtered.sort((a, b) {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.compareTo(b.name);
        });
        break;
      case DrinkSortOption.name:
        filtered.sort((a, b) => a.name.compareTo(b.name));
        break;
      case DrinkSortOption.abv:
        filtered.sort((a, b) {
          final aAbv = double.tryParse(a.abv.replaceAll('%', '')) ?? 0;
          final bAbv = double.tryParse(b.abv.replaceAll('%', '')) ?? 0;
          return bAbv.compareTo(aAbv); // Descending
        });
        break;
      case DrinkSortOption.price:
        filtered.sort((a, b) {
          final aPrice = a.price ?? 0;
          final bPrice = b.price ?? 0;
          return aPrice.compareTo(bPrice); // Ascending
        });
        break;
    }

    setState(() {
      _filteredDrinks = filtered;
    });
  }

  int get _totalDrinkCount => _drinks.length;

  int get _ipaCount => _drinks.where((d) => d.style.toLowerCase().contains('ipa')).length;

  int get _stoutCount => _drinks.where((d) => d.style.toLowerCase().contains('stout')).length;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.backgroundColor,
      body: Column(
        children: [
          _buildHeader(),
          Expanded(
            child: SafeArea(
              top: false,
              child: Column(
                children: [
                  _buildSearchBar(),
                  _buildFilterChips(),
                  _buildDrinkListHeader(),
                  Expanded(
                    child: _isLoading
                        ? const Center(child: CircularProgressIndicator())
                        : _buildDrinkList(),
                  ),
                ],
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
          hintText: 'Search drinks, types, prices...',
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
            label: 'All Drinks',
            icon: Icons.local_drink,
            count: _totalDrinkCount,
            isSelected: _selectedFilter == DrinkFilter.all,
            onTap: () {
              setState(() {
                _selectedFilter = DrinkFilter.all;
                _applyFiltersAndSort();
              });
            },
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            label: 'IPA',
            icon: Icons.sports_bar,
            count: _ipaCount,
            isSelected: _selectedFilter == DrinkFilter.ipa,
            onTap: () {
              setState(() {
                _selectedFilter = DrinkFilter.ipa;
                _applyFiltersAndSort();
              });
            },
          ),
          const SizedBox(width: 8),
          _buildFilterChip(
            label: 'Stout',
            icon: Icons.sports_bar,
            count: _stoutCount,
            isSelected: _selectedFilter == DrinkFilter.stout,
            onTap: () {
              setState(() {
                _selectedFilter = DrinkFilter.stout;
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

  Widget _buildDrinkListHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Festival Drinks',
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
                      '${_filteredDrinks.length} available',
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

  String _getSortOptionLabel(DrinkSortOption option) {
    switch (option) {
      case DrinkSortOption.featured:
        return 'Featured';
      case DrinkSortOption.name:
        return 'Name (A-Z)';
      case DrinkSortOption.abv:
        return 'ABV';
      case DrinkSortOption.price:
        return 'Price';
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
              _buildSortOption(context, label: 'Featured', option: DrinkSortOption.featured),
              _buildSortOption(context, label: 'Name (A-Z)', option: DrinkSortOption.name),
              _buildSortOption(context, label: 'ABV', option: DrinkSortOption.abv),
              _buildSortOption(context, label: 'Price', option: DrinkSortOption.price),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSortOption(BuildContext context,
      {required String label, required DrinkSortOption option}) {
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

  Widget _buildDrinkList() {
    if (_filteredDrinks.isEmpty) {
      return Center(
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
              'No drinks found',
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    color: AppTheme.textSecondary,
                  ),
            ),
          ],
        ),
      );
    }

    return ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: _filteredDrinks.length,
      itemBuilder: (context, index) {
        final drink = _filteredDrinks[index];
        return DrinkCard(
          drink: drink,
          isFavorited: _favoriteDrinkIds.contains('drink_${drink.id}'),
          onTap: () => _showVendorDetailFromDrink(drink),
          onFavoriteToggle: () => _toggleFavorite(drink.id),
        );
      },
    );
  }

  Future<void> _showVendorDetailFromDrink(Drink drink) async {
    final vendor = await _vendorRepository.getVendorById(drink.vendorId);
    if (vendor != null && mounted) {
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
}
