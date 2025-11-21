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

  const Vendor({
    required this.id,
    required this.name,
    required this.type,
    required this.booth,
    required this.description,
    required this.imageUrl,
    required this.tags,
    this.isFeatured = false,
  });

  String get typeLabel => type == VendorType.brewery ? 'Brewery' : 'Food';
}
