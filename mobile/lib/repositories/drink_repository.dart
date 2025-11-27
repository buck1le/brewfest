import '../models/drink.dart';

abstract class DrinkRepository {
  Future<List<Drink>> getDrinks();
  Future<Drink?> getDrinkById(String id);
}
