class AppNotification {
  final int id;
  final String title;
  final String body;
  final String notificationType;
  final String? relatedEntityType;
  final int? relatedEntityId;
  final int? eventId;
  final int? targetUserId;
  final String status;
  final DateTime? sentAt;
  final String? failedReason;
  final DateTime createdAt;
  final DateTime updatedAt;

  const AppNotification({
    required this.id,
    required this.title,
    required this.body,
    required this.notificationType,
    this.relatedEntityType,
    this.relatedEntityId,
    this.eventId,
    this.targetUserId,
    required this.status,
    this.sentAt,
    this.failedReason,
    required this.createdAt,
    required this.updatedAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'] as int,
      title: json['title'] as String,
      body: json['body'] as String,
      notificationType: json['notificationType'] as String? ?? json['notification_type'] as String,
      relatedEntityType: json['relatedEntityType'] as String? ?? json['related_entity_type'] as String?,
      relatedEntityId: json['relatedEntityId'] as int? ?? json['related_entity_id'] as int?,
      eventId: json['eventId'] as int? ?? json['event_id'] as int?,
      targetUserId: json['targetUserId'] as int? ?? json['target_user_id'] as int?,
      status: json['status'] as String,
      sentAt: json['sentAt'] != null
          ? DateTime.parse(json['sentAt'] as String)
          : (json['sent_at'] != null ? DateTime.parse(json['sent_at'] as String) : null),
      failedReason: json['failedReason'] as String? ?? json['failed_reason'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String? ?? json['created_at'] as String),
      updatedAt: DateTime.parse(json['updatedAt'] as String? ?? json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'body': body,
      'notificationType': notificationType,
      'relatedEntityType': relatedEntityType,
      'relatedEntityId': relatedEntityId,
      'eventId': eventId,
      'targetUserId': targetUserId,
      'status': status,
      'sentAt': sentAt?.toIso8601String(),
      'failedReason': failedReason,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
    };
  }

  /// Returns true if this notification is related to a vendor
  bool get isVendorNotification => relatedEntityType == 'vendor';

  /// Returns true if this notification is related to a schedule item
  bool get isScheduleNotification => relatedEntityType == 'schedule_item';

  /// Returns a user-friendly status text
  String get statusDisplay {
    switch (status) {
      case 'sending':
        return 'Sending...';
      case 'sent':
        return 'Sent';
      case 'failed':
        return 'Failed';
      case 'partial':
        return 'Partially sent';
      default:
        return status;
    }
  }
}
