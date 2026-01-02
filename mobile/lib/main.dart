import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';
import 'services/notification_service.dart';
import 'repositories/notification_repository.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize Firebase
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    print('✅ [Main] Firebase initialized');
  } catch (e) {
    print('⚠️ [Main] Firebase initialization failed: $e');
    print('⚠️ [Main] Notifications will not work until Firebase is configured');
  }

  // Initialize notification service
  try {
    final notificationService = NotificationService();
    final repository = ApiNotificationRepository(
      baseUrl: 'https://brew-fest-api.fly.dev/api/v1',
    );

    await notificationService.initialize(
      repository: repository,
      onNotificationTapped: (message) {
        print('🔔 [Main] Notification tapped: ${message.messageId}');
        // TODO: Navigate to relevant screen based on notification data
      },
      onForegroundNotification: (message) {
        print('🔔 [Main] Foreground notification: ${message.notification?.title}');
      },
    );
    print('✅ [Main] Notification service initialized');
  } catch (e) {
    print('⚠️ [Main] Notification service initialization failed: $e');
  }

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Wild West Brewfest',
      theme: AppTheme.lightTheme,
      debugShowCheckedModeBanner: false,
      home: const HomeScreen(),
    );
  }
}
