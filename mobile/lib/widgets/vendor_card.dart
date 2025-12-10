import 'package:flutter/material.dart';
import '../models/vendor.dart';
import '../theme/app_theme.dart';

class VendorCard extends StatelessWidget {
  final Vendor vendor;
  final bool isFavorited;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteToggle;

  const VendorCard({
    super.key,
    required this.vendor,
    this.isFavorited = false,
    this.onTap,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.fromLTRB(16, 6, 16, 6),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Vendor image with featured indicator
              SizedBox(
                width: 120,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    vendor.thumbnail != null
                        ? Image.network(
                            vendor.thumbnail!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) {
                              return Container(
                                color: Colors.grey[300],
                                child: const Icon(Icons.image, color: Colors.grey),
                              );
                            },
                          )
                        : Container(
                            color: Colors.grey[300],
                            child: const Icon(Icons.image, color: Colors.grey),
                          ),
                    if (vendor.isFeatured)
                      Positioned(
                        top: 8,
                        left: 8,
                        child: Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppTheme.accentOrange,
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Icon(
                            Icons.star,
                            color: Colors.white,
                            size: 16,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
                // Vendor info
                Expanded(
                  child: Stack(
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(12),
                        child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                        // Name
                        Padding(
                          padding: const EdgeInsets.only(right: 32),
                          child: Text(
                            vendor.name,
                            style: Theme.of(context).textTheme.titleLarge,
                          ),
                        ),
                        const SizedBox(height: 4),
                        // Category and booth
                        Row(
                          children: [
                            if (vendor.category != null)
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: AppTheme.backgroundColor,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  vendor.category!.toUpperCase(),
                                  style: Theme.of(context).textTheme.labelMedium,
                                ),
                              ),
                            if (vendor.category != null && vendor.booth != null)
                              const SizedBox(width: 8),
                            if (vendor.booth != null)
                              Text(
                                '• Booth ${vendor.booth}',
                                style: Theme.of(context).textTheme.bodyMedium,
                              ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        // Description
                        Text(
                          vendor.description,
                          style: Theme.of(context).textTheme.bodyMedium,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        // Tags
                        Wrap(
                          spacing: 6,
                          runSpacing: 4,
                          children: vendor.tags.map((tag) {
                            return Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: AppTheme.backgroundColor,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.borderColor),
                              ),
                              child: Text(
                                tag,
                                style: Theme.of(context).textTheme.labelMedium?.copyWith(
                                  color: AppTheme.textPrimary,
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ],
                    ),
                      ),
                      // Favorite button - positioned in top right
                      Positioned(
                        top: 0,
                        right: 0,
                        child: IconButton(
                          icon: Icon(
                            isFavorited ? Icons.star : Icons.star_border,
                          ),
                          color: isFavorited ? AppTheme.accentOrange : AppTheme.textSecondary,
                          onPressed: onFavoriteToggle,
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }
}
