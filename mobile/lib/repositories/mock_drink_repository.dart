import '../models/drink.dart';
import 'drink_repository.dart';

class MockDrinkRepository implements DrinkRepository {
  static final List<Drink> _mockDrinks = [
    const Drink(
      id: '1',
      name: 'Cascade Hop IPA',
      vendorName: 'Hopworks Brewing',
      vendorId: '1',
      description: 'West Coast style IPA with bold citrus and pine notes',
      style: 'IPA',
      abv: '7.2%',
      ibu: '68',
      price: 8,
      isFeatured: true,
    ),
    const Drink(
      id: '2',
      name: 'Riverside Pale Ale',
      vendorName: 'River City Brewing',
      vendorId: '3',
      description: 'Balanced pale ale with floral hop character',
      style: 'Pale Ale',
      abv: '5.8%',
      ibu: '42',
      price: 7,
      isFeatured: true,
    ),
    const Drink(
      id: '3',
      name: 'Wild Berry Sour',
      vendorName: 'Summit Suds',
      vendorId: '4',
      description: 'Tart and fruity with mixed berry finish',
      style: 'Sour',
      abv: '5.5%',
      ibu: '8',
      price: 9,
      isFeatured: true,
      isSeasonal: true,
    ),
    const Drink(
      id: '4',
      name: 'Midnight Stout',
      vendorName: 'Hopworks Brewing',
      vendorId: '1',
      description: 'Rich coffee and chocolate imperial stout',
      style: 'Stout',
      abv: '6.5%',
      ibu: '45',
      price: 8,
    ),
    const Drink(
      id: '5',
      name: 'Golden Lager',
      vendorName: 'Hopworks Brewing',
      vendorId: '1',
      description: 'Crisp and refreshing German-style lager',
      style: 'Lager',
      abv: '4.8%',
      ibu: '22',
      price: 7,
    ),
    const Drink(
      id: '6',
      name: 'Hazy Dream IPA',
      vendorName: 'Barrel & Oak',
      vendorId: '6',
      description: 'New England style hazy IPA with tropical fruit notes',
      style: 'IPA',
      abv: '6.8%',
      ibu: '55',
      price: 8,
    ),
    const Drink(
      id: '7',
      name: 'Amber Waves',
      vendorName: 'River City Brewing',
      vendorId: '3',
      description: 'Smooth amber ale with caramel malt sweetness',
      style: 'Amber Ale',
      abv: '5.5%',
      ibu: '30',
      price: 7,
    ),
    const Drink(
      id: '8',
      name: 'Porter House',
      vendorName: 'Golden Tap',
      vendorId: '8',
      description: 'Robust porter with roasted malt character',
      style: 'Porter',
      abv: '5.9%',
      ibu: '35',
      price: 7,
    ),
    const Drink(
      id: '9',
      name: 'Barrel Aged Stout',
      vendorName: 'Barrel & Oak',
      vendorId: '6',
      description: 'Imperial stout aged in bourbon barrels',
      style: 'Stout',
      abv: '10.2%',
      ibu: '50',
      price: 12,
      isFeatured: true,
    ),
    const Drink(
      id: '10',
      name: 'Wheat Wave',
      vendorName: 'River City Brewing',
      vendorId: '3',
      description: 'Light and refreshing American wheat beer',
      style: 'Wheat',
      abv: '4.5%',
      ibu: '18',
      price: 6,
    ),
    const Drink(
      id: '11',
      name: 'Double IPA',
      vendorName: 'Summit Suds',
      vendorId: '4',
      description: 'Hop-forward double IPA with intense bitterness',
      style: 'IPA',
      abv: '8.5%',
      ibu: '85',
      price: 9,
    ),
    const Drink(
      id: '12',
      name: 'Pilsner Perfect',
      vendorName: 'Golden Tap',
      vendorId: '8',
      description: 'Classic Czech-style pilsner with noble hops',
      style: 'Pilsner',
      abv: '5.0%',
      ibu: '38',
      price: 7,
    ),
    const Drink(
      id: '13',
      name: 'Coffee Stout',
      vendorName: 'Barrel & Oak',
      vendorId: '6',
      description: 'Stout brewed with locally roasted coffee beans',
      style: 'Stout',
      abv: '7.0%',
      ibu: '42',
      price: 8,
    ),
    const Drink(
      id: '14',
      name: 'Session IPA',
      vendorName: 'Hopworks Brewing',
      vendorId: '1',
      description: 'Lower ABV IPA packed with hop flavor',
      style: 'IPA',
      abv: '4.5%',
      ibu: '45',
      price: 6,
    ),
    const Drink(
      id: '15',
      name: 'Brown Ale',
      vendorName: 'River City Brewing',
      vendorId: '3',
      description: 'Smooth brown ale with nutty malt character',
      style: 'Brown Ale',
      abv: '5.2%',
      ibu: '25',
      price: 7,
    ),
  ];

  @override
  Future<List<Drink>> getDrinks() async {
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockDrinks;
  }

  @override
  Future<Drink?> getDrinkById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    try {
      return _mockDrinks.firstWhere((drink) => drink.id == id);
    } catch (e) {
      return null;
    }
  }
}
