import '../models/inventory_item.dart';

abstract class InventoryRepository {
  Future<List<InventoryItem>> getDrinks();
  Future<List<InventoryItem>> getInventory();
  Future<InventoryItem?> getDrinkById(String id);
}

class InventoryRepositoryImpl implements InventoryRepository {
  @override
  Future<List<InventoryItem>> getDrinks() async {
    // TODO: implement getDrinks
    throw UnimplementedError();
  }

  @override
  Future<List<InventoryItem>> getInventory() async {
    // TODO: implement getInventory
    throw UnimplementedError();
  }

  @override
  Future<InventoryItem?> getDrinkById(String id) async {
    // TODO: implement getDrinkById
    throw UnimplementedError();
  }
}

