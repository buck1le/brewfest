class DeviceToken {
  final int id;
  final String token;
  final String platform;
  final String? deviceId;
  final int? userId;
  final bool isActive;
  final DateTime? lastUsedAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  const DeviceToken({
    required this.id,
    required this.token,
    required this.platform,
    this.deviceId,
    this.userId,
    required this.isActive,
    this.lastUsedAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory DeviceToken.fromJson(Map<String, dynamic> json) {
    return DeviceToken(
      id: json['id'] as int,
      token: json['token'] as String,
      platform: json['platform'] as String,
      deviceId: json['deviceId'] as String?,
      userId: json['userId'] as int?,
      isActive: json['isActive'] as bool? ?? true,
      lastUsedAt: json['lastUsedAt'] != null
          ? DateTime.parse(json['lastUsedAt'] as String)
          : null,
      createdAt: DateTime.parse(json['createdAt'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'token': token,
      'platform': platform,
      'deviceId': deviceId,
      'userId': userId,
      'isActive': isActive,
      'lastUsedAt': lastUsedAt?.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }
}

class DeviceTokenRequest {
  final String token;
  final String platform;
  final String? deviceId;
  final int? userId;

  const DeviceTokenRequest({
    required this.token,
    required this.platform,
    this.deviceId,
    this.userId,
  });

  Map<String, dynamic> toJson() {
    return {
      'token': token,
      'platform': platform,
      if (deviceId != null) 'device_id': deviceId,
      if (userId != null) 'user_id': userId,
    };
  }
}

class EventSubscriptionRequest {
  final int deviceTokenId;
  final int eventId;

  const EventSubscriptionRequest({
    required this.deviceTokenId,
    required this.eventId,
  });

  Map<String, dynamic> toJson() {
    return {
      'device_token_id': deviceTokenId,
      'event_id': eventId,
    };
  }
}
