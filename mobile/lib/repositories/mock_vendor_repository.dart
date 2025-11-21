import '../models/vendor.dart';
import 'vendor_repository.dart';

class MockVendorRepository implements VendorRepository {
  static final List<Vendor> _mockVendors = [
    const Vendor(
      id: '1',
      name: 'Hopworks Brewing',
      type: VendorType.brewery,
      booth: 'A12',
      description: 'Award-winning craft brewery specializing in IPAs and stouts',
      imageUrl: 'https://images.unsplash.com/photo-1517153295259-74eb0b416cee',
      tags: ['IPA', 'Stout', 'Lager'],
      isFeatured: true,
    ),
    const Vendor(
      id: '2',
      name: 'Texas BBQ Pit',
      type: VendorType.food,
      booth: 'F01',
      description: 'Authentic Texas-style barbecue with craft beer pairings',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      tags: ['Brisket', 'Ribs', 'Sides'],
      isFeatured: true,
    ),
    const Vendor(
      id: '3',
      name: 'River City Brewing',
      type: VendorType.brewery,
      booth: 'B08',
      description: 'Local favorite known for pale ales and seasonal brews',
      imageUrl: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0',
      tags: ['Pale Ale', 'Wheat', 'Porter'],
      isFeatured: false,
    ),
    const Vendor(
      id: '4',
      name: 'Summit Suds',
      type: VendorType.brewery,
      booth: 'C15',
      description: 'Experimental craft brewery with unique flavor profiles',
      imageUrl: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7',
      tags: ['Sour', 'Belgian', 'Experimental'],
      isFeatured: false,
    ),
    const Vendor(
      id: '5',
      name: 'Lone Star Eats',
      type: VendorType.food,
      booth: 'F12',
      description: 'Classic Texas comfort food and street tacos',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
      tags: ['Tacos', 'Nachos', 'Wings'],
      isFeatured: false,
    ),
    const Vendor(
      id: '6',
      name: 'Barrel & Oak',
      type: VendorType.brewery,
      booth: 'A05',
      description: 'Barrel-aged specialists with rotating seasonal releases',
      imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13',
      tags: ['Barrel-Aged', 'Imperial', 'Stout'],
      isFeatured: true,
    ),
    const Vendor(
      id: '7',
      name: 'The Smoke Shack',
      type: VendorType.food,
      booth: 'F08',
      description: 'Smoked meats and gourmet sausages',
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
      tags: ['Smoked', 'Sausage', 'Brisket'],
      isFeatured: false,
    ),
    const Vendor(
      id: '8',
      name: 'Golden Tap',
      type: VendorType.brewery,
      booth: 'B22',
      description: 'Award-winning lagers and pilsners',
      imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9',
      tags: ['Lager', 'Pilsner', 'Helles'],
      isFeatured: false,
    ),
  ];

  @override
  Future<List<Vendor>> getVendors() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    return _mockVendors;
  }

  @override
  Future<Vendor?> getVendorById(String id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    try {
      return _mockVendors.firstWhere((vendor) => vendor.id == id);
    } catch (e) {
      return null;
    }
  }
}
