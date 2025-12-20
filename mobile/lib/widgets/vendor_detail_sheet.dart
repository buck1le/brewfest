import 'package:flutter/material.dart';
import 'package:carousel_slider/carousel_slider.dart';
import '../models/vendor.dart';
import '../theme/app_theme.dart';

class VendorDetailSheet extends StatefulWidget {
  final Vendor vendor;

  const VendorDetailSheet({
    super.key,
    required this.vendor,
  });

  @override
  State<VendorDetailSheet> createState() => _VendorDetailSheetState();
}

class _VendorDetailSheetState extends State<VendorDetailSheet> {
  int _currentImageIndex = 0;

  List<String> get _displayImages {
    // Use images array if available, otherwise fall back to thumbnail
    if (widget.vendor.images.isNotEmpty) {
      return widget.vendor.images;
    } else if (widget.vendor.thumbnail != null) {
      return [widget.vendor.thumbnail!];
    }
    return [];
  }

  @override
  Widget build(BuildContext context) {
    final hasImages = _displayImages.isNotEmpty;
    final showDots = _displayImages.length > 1;

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // Drag handle
          const SizedBox(height: 8),
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),

          // Content
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Image carousel
                  SizedBox(
                    height: 300,
                    width: double.infinity,
                    child: hasImages
                        ? Stack(
                            children: [
                              CarouselSlider(
                                options: CarouselOptions(
                                  height: 300,
                                  viewportFraction: 1.0,
                                  enableInfiniteScroll: _displayImages.length > 1,
                                  autoPlay: false,
                                  onPageChanged: (index, reason) {
                                    setState(() {
                                      _currentImageIndex = index;
                                    });
                                  },
                                ),
                                items: _displayImages.map((imageUrl) {
                                  return Builder(
                                    builder: (BuildContext context) {
                                      return Image.network(
                                        imageUrl,
                                        fit: BoxFit.cover,
                                        width: double.infinity,
                                        errorBuilder: (context, error, stackTrace) {
                                          return Container(
                                            color: Colors.grey[300],
                                            child: const Icon(
                                              Icons.broken_image,
                                              size: 64,
                                              color: Colors.grey,
                                            ),
                                          );
                                        },
                                        loadingBuilder: (context, child, loadingProgress) {
                                          if (loadingProgress == null) return child;
                                          return Container(
                                            color: Colors.grey[200],
                                            child: Center(
                                              child: CircularProgressIndicator(
                                                value: loadingProgress.expectedTotalBytes != null
                                                    ? loadingProgress.cumulativeBytesLoaded /
                                                        loadingProgress.expectedTotalBytes!
                                                    : null,
                                              ),
                                            ),
                                          );
                                        },
                                      );
                                    },
                                  );
                                }).toList(),
                              ),
                              // Image counter in top right (Airbnb-style)
                              if (showDots)
                                Positioned(
                                  top: 16,
                                  right: 16,
                                  child: Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 12,
                                      vertical: 6,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.black.withValues(alpha: 0.6),
                                      borderRadius: BorderRadius.circular(16),
                                    ),
                                    child: Text(
                                      '${_currentImageIndex + 1} / ${_displayImages.length}',
                                      style: const TextStyle(
                                        color: Colors.white,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w500,
                                      ),
                                    ),
                                  ),
                                ),
                              // Page indicator dots at bottom
                              if (showDots)
                                Positioned(
                                  bottom: 16,
                                  left: 0,
                                  right: 0,
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: _displayImages.asMap().entries.map((entry) {
                                      return Container(
                                        width: 8,
                                        height: 8,
                                        margin: const EdgeInsets.symmetric(horizontal: 4),
                                        decoration: BoxDecoration(
                                          shape: BoxShape.circle,
                                          color: _currentImageIndex == entry.key
                                              ? Colors.white
                                              : Colors.white.withValues(alpha: 0.4),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                            ],
                          )
                        : Container(
                            color: Colors.grey[300],
                            child: const Center(
                              child: Icon(Icons.image, size: 64, color: Colors.grey),
                            ),
                          ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Vendor name
                        Text(
                          widget.vendor.name,
                          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                                fontSize: 28,
                                fontWeight: FontWeight.bold,
                              ),
                        ),
                        const SizedBox(height: 8),

                        // Category and booth
                        Row(
                          children: [
                            if (widget.vendor.category != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 10,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.backgroundColor,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  widget.vendor.category!.toUpperCase(),
                                  style: Theme.of(context).textTheme.labelMedium,
                                ),
                              ),
                            if (widget.vendor.category != null && widget.vendor.booth != null)
                              const SizedBox(width: 12),
                            if (widget.vendor.booth != null)
                              Text(
                                'Booth ${widget.vendor.booth}',
                                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                      color: AppTheme.textSecondary,
                                    ),
                              ),
                          ],
                        ),

                        // Operating out of (location)
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(
                              Icons.location_on,
                              size: 18,
                              color: AppTheme.textSecondary,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              widget.vendor.operatingOutOf,
                              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                    color: AppTheme.textSecondary,
                                  ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 20),

                        // About section
                        Text(
                          'About',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w700,
                                fontSize: 20,
                              ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          widget.vendor.description,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                                height: 1.5,
                              ),
                        ),

                        // Tags
                        if (widget.vendor.tags.isNotEmpty) ...[
                          const SizedBox(height: 20),
                          Text(
                            'Specialties',
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w700,
                                  fontSize: 20,
                                ),
                          ),
                          const SizedBox(height: 12),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: widget.vendor.tags.map((tag) {
                              return Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 16,
                                  vertical: 8,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.backgroundColor,
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: AppTheme.borderColor),
                                ),
                                child: Text(
                                  tag,
                                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                        color: AppTheme.textPrimary,
                                        fontWeight: FontWeight.w500,
                                      ),
                                ),
                              );
                            }).toList(),
                          ),
                        ],

                        // Contact info
                        const SizedBox(height: 20),
                        Text(
                          'Contact',
                          style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                fontWeight: FontWeight.w700,
                                fontSize: 20,
                              ),
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            const Icon(Icons.email, size: 18, color: AppTheme.textSecondary),
                            const SizedBox(width: 8),
                            Text(
                              widget.vendor.email,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            const Icon(Icons.phone, size: 18, color: AppTheme.textSecondary),
                            const SizedBox(width: 8),
                            Text(
                              widget.vendor.phone,
                              style: Theme.of(context).textTheme.bodyMedium,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Close button
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () => Navigator.pop(context),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.primaryNavy,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                  child: const Text(
                    'Close',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
