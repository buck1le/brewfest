# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Flutter mobile application for a brewfest event. The project is a fresh Flutter migration, replacing the previous React Native/Expo implementation (now located in `../mobile-old`).

**Current Status**: Early development stage with default Flutter template code.

**Backend**: The application will integrate with a Rust API backend. Designs will be provided via screenshots.

## Development Commands

### Running the Application
```bash
# Run on iOS simulator/device
flutter run

# Run on specific device
flutter devices  # List available devices
flutter run -d <device-id>

# Run with hot reload (default when using flutter run)
# Press 'r' to hot reload, 'R' to hot restart, 'q' to quit
```

### Building
```bash
# Build for iOS (requires macOS and Xcode)
flutter build ios

# Build for Android (requires Android SDK setup)
flutter build apk

# Build for web
flutter build web
```

### Testing
```bash
# Run all tests
flutter test

# Run a specific test file
flutter test test/widget_test.dart

# Run tests with coverage
flutter test --coverage
```

### Code Quality
```bash
# Analyze code for issues
flutter analyze

# Format code
dart format .

# Fix formatting issues
dart format --fix .
```

### Dependencies
```bash
# Install dependencies
flutter pub get

# Update dependencies
flutter pub upgrade

# Add a new dependency
flutter pub add <package_name>

# Add a dev dependency
flutter pub add --dev <package_name>
```

### Cleaning
```bash
# Clean build artifacts
flutter clean

# Full clean and reinstall
flutter clean && flutter pub get
```

## Code Architecture

### Current Structure
The project currently has the default Flutter template structure:
- `lib/main.dart` - Entry point with a simple counter demo app
- `test/widget_test.dart` - Sample widget test

### Expected Architecture (from Previous Implementation)
Based on git history, the previous React Native app included:
- Event browsing and details
- Vendor information with modal views
- Schedule/calendar functionality
- Map views with custom markers and region handling
- Event-specific theming

As the Flutter app is developed, expect to implement similar features with Flutter's architecture patterns.

## Platform Support

Currently configured for:
- iOS (Xcode required) ✓
- Web ✓
- Android (requires Android SDK setup)
- macOS
- Linux
- Windows

## Linting

The project uses `flutter_lints` with the recommended Flutter lint rules defined in `analysis_options.yaml`.

## Code Standards and Practices

### Code Quality
- Keep code clean, professional, and maintainable
- Follow Flutter best practices and idiomatic patterns
- Use meaningful variable and function names
- Break down complex widgets into smaller, reusable components
- Prefer composition over inheritance for widget architecture

### Backend Integration
- The backend is a Rust API
- All API calls must be abstracted behind service/repository layers
- Mock data and API implementations should be easily swappable with real backend calls
- Use dependency injection or service locators to make backend integration pluggable
- Define clear data models/DTOs that match the API contracts
- Structure API clients so they can be switched between mock and production with minimal code changes

**Example pattern for pluggable backend:**
```dart
// Abstract interface
abstract class EventRepository {
  Future<List<Event>> getEvents();
}

// Mock implementation for development
class MockEventRepository implements EventRepository {
  @override
  Future<List<Event>> getEvents() async {
    // Return mock data
  }
}

// Real implementation
class ApiEventRepository implements EventRepository {
  @override
  Future<List<Event>> getEvents() async {
    // Call Rust API
  }
}
```

### UI Implementation
- Implement UI based on provided design screenshots
- Match design specifications closely (spacing, colors, typography)
- Maintain visual consistency across the application
- Use theme data for colors, text styles, and spacing constants
- Ensure responsive layouts that work across different screen sizes
