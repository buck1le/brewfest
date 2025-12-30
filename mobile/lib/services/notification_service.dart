import 'dart:io';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';
import '../repositories/notification_repository.dart';
import '../models/device_token.dart';

/// Background message handler - must be top-level function
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  print('🔔 [Background] Notification received: ${message.messageId}');
  print('🔔 [Background] Title: ${message.notification?.title}');
  print('🔔 [Background] Body: ${message.notification?.body}');
}

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  NotificationRepository? _repository;
  int? _deviceTokenId;
  String? _currentToken;

  /// Callback when a notification is tapped
  Function(RemoteMessage)? onNotificationTapped;

  /// Callback when a notification is received while app is in foreground
  Function(RemoteMessage)? onForegroundNotification;

  /// Initialize the notification service
  Future<void> initialize({
    required NotificationRepository repository,
    Function(RemoteMessage)? onNotificationTapped,
    Function(RemoteMessage)? onForegroundNotification,
  }) async {
    _repository = repository;
    this.onNotificationTapped = onNotificationTapped;
    this.onForegroundNotification = onForegroundNotification;

    print('📱 [NotificationService] Initializing...');

    // Set up background message handler
    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    // Initialize local notifications
    await _initializeLocalNotifications();

    // Request permissions
    await requestPermissions();

    // On iOS, we need to get the APNS token first
    if (Platform.isIOS) {
      print('📱 [NotificationService] Waiting for APNS token...');
      final apnsToken = await _firebaseMessaging.getAPNSToken();
      if (apnsToken != null) {
        print('📱 [NotificationService] APNS Token received: ${apnsToken.substring(0, 20)}...');
      } else {
        print('⚠️ [NotificationService] APNS token not available yet, will retry...');
        // Wait a bit and try again
        await Future.delayed(const Duration(seconds: 2));
        final retryToken = await _firebaseMessaging.getAPNSToken();
        if (retryToken != null) {
          print('📱 [NotificationService] APNS Token received on retry: ${retryToken.substring(0, 20)}...');
        } else {
          print('❌ [NotificationService] APNS token still not available. Notifications may not work.');
        }
      }
    }

    // Get FCM token
    final token = await _firebaseMessaging.getToken();
    if (token != null) {
      print('📱 [NotificationService] FCM Token: $token');
      _currentToken = token;
      await _registerToken(token);
    } else {
      print('⚠️ [NotificationService] FCM token not available yet');
    }

    // Listen for token refresh
    _firebaseMessaging.onTokenRefresh.listen((newToken) {
      print('📱 [NotificationService] Token refreshed: $newToken');
      _currentToken = newToken;
      _registerToken(newToken);
    });

    // Handle foreground messages
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      print('🔔 [Foreground] Notification received: ${message.messageId}');
      print('🔔 [Foreground] Title: ${message.notification?.title}');
      print('🔔 [Foreground] Body: ${message.notification?.body}');

      // Show local notification when app is in foreground
      if (message.notification != null) {
        _showLocalNotification(message);
      }

      // Call custom handler
      onForegroundNotification?.call(message);
    });

    // Handle notification taps when app is in background or terminated
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      print('🔔 [Tap] Notification opened: ${message.messageId}');
      onNotificationTapped?.call(message);
    });

    // Check if app was opened from a terminated state by tapping notification
    final initialMessage = await _firebaseMessaging.getInitialMessage();
    if (initialMessage != null) {
      print('🔔 [Tap] App opened from terminated state: ${initialMessage.messageId}');
      onNotificationTapped?.call(initialMessage);
    }

    print('✅ [NotificationService] Initialized successfully');
  }

  Future<void> _initializeLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        print('🔔 [Local] Notification tapped: ${response.payload}');
        // Handle local notification tap
      },
    );
  }

  Future<void> _showLocalNotification(RemoteMessage message) async {
    const androidDetails = AndroidNotificationDetails(
      'brewfest_channel',
      'Brewfest Notifications',
      channelDescription: 'Notifications for brewfest events',
      importance: Importance.max,
      priority: Priority.high,
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    const notificationDetails = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      message.messageId.hashCode,
      message.notification?.title ?? 'Brewfest',
      message.notification?.body ?? '',
      notificationDetails,
      payload: message.data.toString(),
    );
  }

  Future<void> _registerToken(String token) async {
    if (_repository == null) {
      print('⚠️ [NotificationService] Repository not initialized');
      return;
    }

    try {
      final platform = Platform.isIOS ? 'ios' : 'android';
      final request = DeviceTokenRequest(
        token: token,
        platform: platform,
      );

      final deviceToken = await _repository!.registerDeviceToken(request);
      _deviceTokenId = deviceToken.id;

      print('✅ [NotificationService] Device token registered: ID=${deviceToken.id}');
    } catch (e) {
      print('❌ [NotificationService] Failed to register token: $e');
    }
  }

  /// Request notification permissions
  Future<bool> requestPermissions() async {
    print('📱 [NotificationService] Requesting permissions...');

    // Request FCM permissions (iOS)
    final settings = await _firebaseMessaging.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      provisional: false,
    );

    print('📱 [NotificationService] FCM Permission status: ${settings.authorizationStatus}');

    if (Platform.isIOS) {
      final status = await Permission.notification.request();
      print('📱 [NotificationService] iOS Permission status: $status');
      return status.isGranted;
    }

    return settings.authorizationStatus == AuthorizationStatus.authorized ||
        settings.authorizationStatus == AuthorizationStatus.provisional;
  }

  /// Subscribe to event notifications
  Future<bool> subscribeToEvent(int eventId) async {
    if (_repository == null) {
      print('⚠️ [NotificationService] Repository not initialized');
      return false;
    }

    if (_deviceTokenId == null) {
      print('⚠️ [NotificationService] Device token not registered yet');
      // Try to get token again
      final token = await _firebaseMessaging.getToken();
      if (token != null) {
        await _registerToken(token);
      }

      if (_deviceTokenId == null) {
        print('❌ [NotificationService] Still no device token ID');
        return false;
      }
    }

    try {
      await _repository!.subscribeToEvent(_deviceTokenId!, eventId);
      print('✅ [NotificationService] Subscribed to event: $eventId');
      return true;
    } catch (e) {
      print('❌ [NotificationService] Failed to subscribe to event: $e');
      return false;
    }
  }

  /// Deactivate the current device token
  Future<void> deactivateToken() async {
    if (_repository == null || _currentToken == null) {
      print('⚠️ [NotificationService] Nothing to deactivate');
      return;
    }

    try {
      await _repository!.deactivateDeviceToken(_currentToken!);
      _deviceTokenId = null;
      _currentToken = null;
      print('✅ [NotificationService] Token deactivated');
    } catch (e) {
      print('❌ [NotificationService] Failed to deactivate token: $e');
    }
  }

  /// Get the current FCM token
  String? get currentToken => _currentToken;

  /// Get the current device token ID
  int? get deviceTokenId => _deviceTokenId;
}
