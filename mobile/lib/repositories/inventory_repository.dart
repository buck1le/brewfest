import '../models/inventory_item.dart';

abstract class InventoryRepository {
  Future<List<InventoryItem>> getDrinks();
  Future<List<InventoryItem>> getInventory();
  Future<InventoryItem?> getDrinkById(String id);
}
