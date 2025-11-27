enum VendorType {
  brewery,
  food,
}

class Vendor {
  final String id;
  final String name;
  final VendorType type;
  final String booth;
  final String description;
  final String imageUrl;
  final List<String> tags;
  final bool isFeatured;
  final String? location;
  final List<String> images;
  final List<MenuItem> menuItems;

  const Vendor({
    required this.id,
    required this.name,
    required this.type,
    required this.booth,
    required this.description,
    required this.imageUrl,
    required this.tags,
    this.isFeatured = false,
    this.location,
    this.images = const [],
    this.menuItems = const [],
  });

  String get typeLabel => type == VendorType.brewery ? 'Brewery' : 'Food';
}

class MenuItem {
  final String name;
  final String? style;
  final String? abv;
  final String? ibu;
  final String description;
  final bool isFeatured;

  const MenuItem({
    required this.name,
    this.style,
    this.abv,
    this.ibu,
    required this.description,
    this.isFeatured = false,
  });
}
