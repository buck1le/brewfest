import 'package:shared_preferences/shared_preferences.dart';

abstract class FavoritesRepository {
  Future<Set<String>> getFavorites(); 
  Future<void> addFavorite(String vendorId);
  Future<void> removeFavorite(String vendorId);
  Future<bool> isFavorite(String vendorId);
  Future<void> toggleFavorite(String vendorId);
}

class FavoritesRepositoryImpl implements FavoritesRepository {
  static const String _favoritesKey = 'favorite_vendors';

  @override
  Future<Set<String>> getFavorites() async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = prefs.getStringList(_favoritesKey) ?? [];
    return favorites.toSet();
  }

  @override
  Future<void> addFavorite(String vendorId) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await getFavorites();
    favorites.add(vendorId);
    await prefs.setStringList(_favoritesKey, favorites.toList());
  }

  @override
  Future<void> removeFavorite(String vendorId) async {
    final prefs = await SharedPreferences.getInstance();
    final favorites = await getFavorites();
    favorites.remove(vendorId);
    await prefs.setStringList(_favoritesKey, favorites.toList());
  }

  @override
  Future<bool> isFavorite(String vendorId) async {
    final favorites = await getFavorites();
    return favorites.contains(vendorId);
  }

  @override
  Future<void> toggleFavorite(String vendorId) async {
    final isFav = await isFavorite(vendorId);
    if (isFav) {
      await removeFavorite(vendorId);
    } else {
      await addFavorite(vendorId);
    }
  }
}
