class Drink {
  final String id;
  final String name;
  final String vendorName;
  final String vendorId;
  final String description;
  final String style;
  final String abv;
  final String ibu;
  final double? price;
  final bool isFeatured;
  final bool isSeasonal;

  const Drink({
    required this.id,
    required this.name,
    required this.vendorName,
    required this.vendorId,
    required this.description,
    required this.style,
    required this.abv,
    required this.ibu,
    this.price,
    this.isFeatured = false,
    this.isSeasonal = false,
  });
}
