class Event {
  final int id;
  final String name;
  final String description;
  final DateTime startDate;
  final DateTime endDate;
  final double latitude;
  final double longitude;
  final String city;
  final String state;
  final String address;
  final String? thumbnail;

  const Event({
    required this.id,
    required this.name,
    required this.description,
    required this.startDate,
    required this.endDate,
    required this.latitude,
    required this.longitude,
    required this.city,
    required this.state,
    required this.address,
    this.thumbnail,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'] as int,
      name: json['name'] as String,
      description: json['description'] as String,
      startDate: DateTime.parse(json['start_date'] as String),
      endDate: DateTime.parse(json['end_date'] as String),
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      city: json['city'] as String,
      state: json['state'] as String,
      address: json['address'] as String,
      thumbnail: json['thumbnail'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'start_date': _formatDate(startDate),
      'end_date': _formatDate(endDate),
      'latitude': latitude,
      'longitude': longitude,
      'city': city,
      'state': state,
      'address': address,
      'thumbnail': thumbnail,
    };
  }

  /// Formats DateTime to YYYY-MM-DD format (matching Rust's NaiveDate)
  String _formatDate(DateTime date) {
    return '${date.year.toString().padLeft(4, '0')}-'
        '${date.month.toString().padLeft(2, '0')}-'
        '${date.day.toString().padLeft(2, '0')}';
  }

  Event copyWith({
    int? id,
    String? name,
    String? description,
    DateTime? startDate,
    DateTime? endDate,
    double? latitude,
    double? longitude,
    String? city,
    String? state,
    String? address,
    String? thumbnail,
  }) {
    return Event(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      city: city ?? this.city,
      state: state ?? this.state,
      address: address ?? this.address,
      thumbnail: thumbnail ?? this.thumbnail,
    );
  }

  /// Returns the duration of the event in days
  int get durationInDays {
    return endDate.difference(startDate).inDays + 1;
  }

  /// Returns true if the event is currently happening
  bool get isActive {
    final now = DateTime.now();
    return now.isAfter(startDate) && now.isBefore(endDate.add(const Duration(days: 1)));
  }

  /// Returns true if the event is in the past
  bool get isPast {
    return DateTime.now().isAfter(endDate.add(const Duration(days: 1)));
  }

  /// Returns true if the event is in the future
  bool get isFuture {
    return DateTime.now().isBefore(startDate);
  }

  /// Returns formatted location string (e.g., "Portland, OR")
  String get locationShort {
    return '$city, $state';
  }

  /// Returns full formatted location including address
  String get locationFull {
    return '$address, $city, $state';
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Event &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          description == other.description &&
          startDate == other.startDate &&
          endDate == other.endDate &&
          latitude == other.latitude &&
          longitude == other.longitude &&
          city == other.city &&
          state == other.state &&
          address == other.address &&
          thumbnail == other.thumbnail;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      description.hashCode ^
      startDate.hashCode ^
      endDate.hashCode ^
      latitude.hashCode ^
      longitude.hashCode ^
      city.hashCode ^
      state.hashCode ^
      address.hashCode ^
      thumbnail.hashCode;

  @override
  String toString() {
    return 'Event(id: $id, name: $name, location: $locationShort, dates: ${_formatDate(startDate)} to ${_formatDate(endDate)})';
  }
}
