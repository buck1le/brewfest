import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/device_token.dart';

abstract class NotificationRepository {
  Future<DeviceToken> registerDeviceToken(DeviceTokenRequest request);
  Future<void> deactivateDeviceToken(String token);
  Future<void> subscribeToEvent(int deviceTokenId, int eventId);
  Future<void> sendTestNotification(int eventId, String title, String body);
}

class ApiNotificationRepository implements NotificationRepository {
  final String baseUrl;
  final http.Client client;

  ApiNotificationRepository({
    required this.baseUrl,
    http.Client? client,
  }) : client = client ?? http.Client();

  @override
  Future<DeviceToken> registerDeviceToken(DeviceTokenRequest request) async {
    final uri = Uri.parse('$baseUrl/device-tokens');

    print('📱 [Notification API] POST Request to: $uri');
    print('📱 [Notification API] Body: ${jsonEncode(request.toJson())}');

    try {
      final response = await client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );

      print('📱 [Notification API] Response Status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        final data = jsonDecode(response.body) as Map<String, dynamic>;
        print('✅ [Notification API] Device token registered successfully');
        return DeviceToken.fromJson(data);
      } else {
        print('❌ [Notification API] Failed: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to register device token: ${response.statusCode}');
      }
    } catch (e, stackTrace) {
      print('💥 [Notification API] Error: $e');
      print('💥 [Notification API] Stack: $stackTrace');
      rethrow;
    }
  }

  @override
  Future<void> deactivateDeviceToken(String token) async {
    final uri = Uri.parse('$baseUrl/device-tokens/${Uri.encodeComponent(token)}');

    print('📱 [Notification API] DELETE Request to: $uri');

    try {
      final response = await client.delete(uri);

      print('📱 [Notification API] Response Status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 204) {
        print('✅ [Notification API] Device token deactivated successfully');
      } else {
        print('❌ [Notification API] Failed: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to deactivate device token: ${response.statusCode}');
      }
    } catch (e, stackTrace) {
      print('💥 [Notification API] Error: $e');
      print('💥 [Notification API] Stack: $stackTrace');
      rethrow;
    }
  }

  @override
  Future<void> subscribeToEvent(int deviceTokenId, int eventId) async {
    final uri = Uri.parse('$baseUrl/device-tokens/subscribe');

    final request = EventSubscriptionRequest(
      deviceTokenId: deviceTokenId,
      eventId: eventId,
    );

    print('📱 [Notification API] POST Request to: $uri');
    print('📱 [Notification API] Body: ${jsonEncode(request.toJson())}');

    try {
      final response = await client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(request.toJson()),
      );

      print('📱 [Notification API] Response Status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ [Notification API] Subscribed to event successfully');
      } else {
        print('❌ [Notification API] Failed: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to subscribe to event: ${response.statusCode}');
      }
    } catch (e, stackTrace) {
      print('💥 [Notification API] Error: $e');
      print('💥 [Notification API] Stack: $stackTrace');
      rethrow;
    }
  }

  @override
  Future<void> sendTestNotification(int eventId, String title, String body) async {
    final uri = Uri.parse('$baseUrl/device-tokens/test-notification');

    final requestBody = {
      'event_id': eventId,
      'title': title,
      'body': body,
    };

    print('📱 [Notification API] POST Request to: $uri');
    print('📱 [Notification API] Body: ${jsonEncode(requestBody)}');

    try {
      final response = await client.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(requestBody),
      );

      print('📱 [Notification API] Response Status: ${response.statusCode}');

      if (response.statusCode == 200 || response.statusCode == 201) {
        print('✅ [Notification API] Test notification sent successfully');
      } else {
        print('❌ [Notification API] Failed: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to send test notification: ${response.statusCode}');
      }
    } catch (e, stackTrace) {
      print('💥 [Notification API] Error: $e');
      print('💥 [Notification API] Stack: $stackTrace');
      rethrow;
    }
  }
}
