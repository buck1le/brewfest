import 'package:flutter/material.dart';
import '../models/drink.dart';
import '../theme/app_theme.dart';

class DrinkCard extends StatelessWidget {
  final Drink drink;
  final bool isFavorited;
  final VoidCallback? onTap;
  final VoidCallback? onFavoriteToggle;

  const DrinkCard({
    super.key,
    required this.drink,
    this.isFavorited = false,
    this.onTap,
    this.onFavoriteToggle,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.fromLTRB(16, 6, 16, 6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header row with name, featured badge, seasonal badge, and favorite
              Row(
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        Flexible(
                          child: Text(
                            drink.name,
                            style: Theme.of(context).textTheme.titleLarge?.copyWith(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 18,
                                ),
                          ),
                        ),
                        if (drink.isFeatured) ...[
                          const SizedBox(width: 6),
                          const Icon(
                            Icons.star,
                            color: AppTheme.accentOrange,
                            size: 18,
                          ),
                        ],
                        if (drink.isSeasonal) ...[
                          const SizedBox(width: 8),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 8,
                              vertical: 2,
                            ),
                            decoration: BoxDecoration(
                              color: Colors.green[50],
                              borderRadius: BorderRadius.circular(4),
                              border: Border.all(
                                color: Colors.green[600]!,
                                width: 1,
                              ),
                            ),
                            child: Text(
                              'Seasonal',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: Colors.green[700],
                              ),
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  IconButton(
                    icon: Icon(
                      isFavorited ? Icons.star : Icons.star_border,
                    ),
                    color: isFavorited ? AppTheme.accentOrange : AppTheme.textSecondary,
                    onPressed: onFavoriteToggle,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(),
                  ),
                ],
              ),
              const SizedBox(height: 4),

              // Vendor name
              Text(
                drink.vendorName,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.textSecondary,
                    ),
              ),
              const SizedBox(height: 12),

              // Description
              Text(
                drink.description,
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      height: 1.4,
                    ),
              ),
              const SizedBox(height: 12),

              // Stats row
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
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
                          drink.style,
                          style: Theme.of(context).textTheme.labelMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                                fontSize: 12,
                              ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Text(
                        'ABV ${drink.abv}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppTheme.textSecondary,
                              fontSize: 13,
                            ),
                      ),
                      const SizedBox(width: 8),
                      Text(
                        '• IBU ${drink.ibu}',
                        style: Theme.of(context).textTheme.bodySmall?.copyWith(
                              color: AppTheme.textSecondary,
                              fontSize: 13,
                            ),
                      ),
                    ],
                  ),
                  if (drink.price != null)
                    Text(
                      '\$${drink.price!.toStringAsFixed(0)}',
                      style: Theme.of(context).textTheme.titleMedium?.copyWith(
                            fontWeight: FontWeight.w700,
                            fontSize: 18,
                          ),
                    ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
