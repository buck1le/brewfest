class Vendor {
  final int id;
  final String name;
  final String email;
  final String phone;
  final DateTime createdAt;
  final String operatingOutOf;
  final String description;
  final String? vendorType;
  final DateTime updatedAt;
  final double latitude;
  final double longitude;
  final int eventId;
  final String? category;
  final String? thumbnail;
  final String? booth;
  final bool isFeatured;
  final List<String> tags;
  final List<String> images;

  const Vendor({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.createdAt,
    required this.operatingOutOf,
    required this.description,
    this.vendorType,
    required this.updatedAt,
    required this.latitude,
    required this.longitude,
    required this.eventId,
    this.category,
    this.thumbnail,
    this.booth,
    required this.isFeatured,
    required this.tags,
    this.images = const [],
  });

  factory Vendor.fromJson(Map<String, dynamic> json) {
    try {
      print('📝 [Vendor] Parsing JSON: ${json.keys.join(', ')}');

      return Vendor(
        id: json['id'] as int,
        name: json['name'] as String? ?? '',
        email: json['email'] as String? ?? '',
        phone: json['phone'] as String? ?? '',
        createdAt: json['created_at'] != null
            ? DateTime.parse(json['created_at'] as String)
            : DateTime.now(),
        operatingOutOf: json['operating_out_of'] as String? ?? '',
        description: json['description'] as String? ?? '',
        vendorType: json['vendor_type'] as String?,
        updatedAt: json['updated_at'] != null
            ? DateTime.parse(json['updated_at'] as String)
            : DateTime.now(),
        latitude: (json['latitude'] as num?)?.toDouble() ?? 0.0,
        longitude: (json['longitude'] as num?)?.toDouble() ?? 0.0,
        eventId: json['event_id'] as int? ?? 0,
        category: json['category'] as String?,
        thumbnail: json['thumbnail'] as String?,
        booth: json['booth'] as String?,
        isFeatured: json['is_featured'] as bool? ?? false,
        tags: (json['tags'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
        images: (json['images'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      );
    } catch (e, stackTrace) {
      print('💥 [Vendor] Error parsing JSON: $e');
      print('💥 [Vendor] JSON was: $json');
      print('💥 [Vendor] Stack: $stackTrace');
      rethrow;
    }
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'created_at': createdAt.toIso8601String(),
      'operating_out_of': operatingOutOf,
      'description': description,
      'vendor_type': vendorType,
      'updated_at': updatedAt.toIso8601String(),
      'latitude': latitude,
      'longitude': longitude,
      'event_id': eventId,
      'category': category,
      'thumbnail': thumbnail,
      'booth': booth,
      'is_featured': isFeatured,
      'tags': tags,
      'images': images,
    };
  }

  Vendor copyWith({
    int? id,
    String? name,
    String? email,
    String? phone,
    DateTime? createdAt,
    String? operatingOutOf,
    String? description,
    String? vendorType,
    DateTime? updatedAt,
    double? latitude,
    double? longitude,
    int? eventId,
    String? category,
    String? thumbnail,
    String? booth,
    bool? isFeatured,
    List<String>? tags,
    List<String>? images,
  }) {
    return Vendor(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      phone: phone ?? this.phone,
      createdAt: createdAt ?? this.createdAt,
      operatingOutOf: operatingOutOf ?? this.operatingOutOf,
      description: description ?? this.description,
      vendorType: vendorType ?? this.vendorType,
      updatedAt: updatedAt ?? this.updatedAt,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      eventId: eventId ?? this.eventId,
      category: category ?? this.category,
      thumbnail: thumbnail ?? this.thumbnail,
      booth: booth ?? this.booth,
      isFeatured: isFeatured ?? this.isFeatured,
      tags: tags ?? this.tags,
      images: images ?? this.images,
    );
  }

  /// Returns a short location description
  String get locationShort => operatingOutOf;

  /// Returns booth number with prefix if available
  String? get boothDisplay => booth != null ? 'Booth $booth' : null;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Vendor &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          email == other.email &&
          phone == other.phone &&
          createdAt == other.createdAt &&
          operatingOutOf == other.operatingOutOf &&
          description == other.description &&
          vendorType == other.vendorType &&
          updatedAt == other.updatedAt &&
          latitude == other.latitude &&
          longitude == other.longitude &&
          eventId == other.eventId &&
          category == other.category &&
          thumbnail == other.thumbnail &&
          booth == other.booth &&
          isFeatured == other.isFeatured;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      email.hashCode ^
      phone.hashCode ^
      createdAt.hashCode ^
      operatingOutOf.hashCode ^
      description.hashCode ^
      vendorType.hashCode ^
      updatedAt.hashCode ^
      latitude.hashCode ^
      longitude.hashCode ^
      eventId.hashCode ^
      category.hashCode ^
      thumbnail.hashCode ^
      booth.hashCode ^
      isFeatured.hashCode;

  @override
  String toString() {
    return 'Vendor(id: $id, name: $name, location: $operatingOutOf, booth: $booth)';
  }
}
