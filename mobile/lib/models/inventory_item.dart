enum InventoryCategory {
  beer,
  cider,
  wine,
  spirits,
  nonAlcoholic,
  food,
  merchandise;

  String toJson() {
    switch (this) {
      case InventoryCategory.beer:
        return 'beer';
      case InventoryCategory.cider:
        return 'cider';
      case InventoryCategory.wine:
        return 'wine';
      case InventoryCategory.spirits:
        return 'spirits';
      case InventoryCategory.nonAlcoholic:
        return 'non_alcoholic';
      case InventoryCategory.food:
        return 'food';
      case InventoryCategory.merchandise:
        return 'merchandise';
    }
  }

  static InventoryCategory fromJson(String value) {
    switch (value) {
      case 'beer':
        return InventoryCategory.beer;
      case 'cider':
        return InventoryCategory.cider;
      case 'wine':
        return InventoryCategory.wine;
      case 'spirits':
        return InventoryCategory.spirits;
      case 'non_alcoholic':
        return InventoryCategory.nonAlcoholic;
      case 'food':
        return InventoryCategory.food;
      case 'merchandise':
        return InventoryCategory.merchandise;
      default:
        throw ArgumentError(
          'Invalid category "$value". Valid options: beer, cider, wine, spirits, non_alcoholic, food, merchandise',
        );
    }
  }

  String get displayName {
    switch (this) {
      case InventoryCategory.beer:
        return 'Beer';
      case InventoryCategory.cider:
        return 'Cider';
      case InventoryCategory.wine:
        return 'Wine';
      case InventoryCategory.spirits:
        return 'Spirits';
      case InventoryCategory.nonAlcoholic:
        return 'Non-Alcoholic';
      case InventoryCategory.food:
        return 'Food';
      case InventoryCategory.merchandise:
        return 'Merchandise';
    }
  }
}

class InventoryItem {
  final int id;
  final String name;
  final InventoryCategory category;
  final int vendorId;
  final int eventId;
  final String? thumbnail;

  const InventoryItem({
    required this.id,
    required this.name,
    required this.category,
    required this.vendorId,
    required this.eventId,
    this.thumbnail,
  });

  factory InventoryItem.fromJson(Map<String, dynamic> json) {
    return InventoryItem(
      id: json['id'] as int,
      name: json['name'] as String,
      category: InventoryCategory.fromJson(json['category'] as String),
      vendorId: json['vendor_id'] as int,
      eventId: json['event_id'] as int,
      thumbnail: json['thumbnail'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'category': category.toJson(),
      'vendor_id': vendorId,
      'event_id': eventId,
      'thumbnail': thumbnail,
    };
  }

  InventoryItem copyWith({
    int? id,
    String? name,
    InventoryCategory? category,
    int? vendorId,
    int? eventId,
    String? thumbnail,
  }) {
    return InventoryItem(
      id: id ?? this.id,
      name: name ?? this.name,
      category: category ?? this.category,
      vendorId: vendorId ?? this.vendorId,
      eventId: eventId ?? this.eventId,
      thumbnail: thumbnail ?? this.thumbnail,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is InventoryItem &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          category == other.category &&
          vendorId == other.vendorId &&
          eventId == other.eventId &&
          thumbnail == other.thumbnail;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      category.hashCode ^
      vendorId.hashCode ^
      eventId.hashCode ^
      thumbnail.hashCode;

  @override
  String toString() {
    return 'InventoryItem(id: $id, name: $name, category: ${category.displayName}, vendorId: $vendorId, eventId: $eventId, thumbnail: $thumbnail)';
  }
}
