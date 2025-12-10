import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/vendor.dart';

abstract class VendorRepository {
  Future<List<Vendor>> getVendors({int? eventId});
  Future<Vendor?> getVendorById(int id);
}

class ApiVendorRepository implements VendorRepository {
  final String baseUrl;
  final int eventId;
  final http.Client client;

  ApiVendorRepository({
    required this.baseUrl,
    required this.eventId,
    http.Client? client,
  }) : client = client ?? http.Client();

  @override
  Future<List<Vendor>> getVendors({int? eventId}) async {
    try {
      final targetEventId = eventId ?? this.eventId;
      final uri = Uri.parse('$baseUrl/events/$targetEventId/vendors');

      print('🌐 [API] GET Request to: $uri');
      print('🌐 [API] Headers: Content-Type: application/json');

      final response = await client.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      print('📡 [API] Response Status: ${response.statusCode}');
      print('📡 [API] Response Body Length: ${response.body.length} chars');
      print('📡 [API] Response Body: ${response.body.substring(0, response.body.length > 500 ? 500 : response.body.length)}...');

      if (response.statusCode == 200) {
        print('✅ [API] Success! Parsing response...');
        final List<dynamic> data = json.decode(response.body);
        print('✅ [API] Found ${data.length} vendors');
        print('✅ [API] First vendor keys: ${data.isNotEmpty ? (data[0] as Map).keys.join(', ') : 'none'}');
        return data.map((json) => Vendor.fromJson(json)).toList();
      } else {
        print('❌ [API] Error: ${response.statusCode}');
        print('❌ [API] Body: ${response.body}');
        throw Exception('Failed to load vendors: ${response.statusCode}');
      }
    } catch (e) {
      print('💥 [API] Exception caught: $e');
      print('💥 [API] Exception type: ${e.runtimeType}');
      throw Exception('Error fetching vendors: $e');
    }
  }

  @override
  Future<Vendor?> getVendorById(int id) async {
    try {
      final uri = Uri.parse('$baseUrl/events/$eventId/vendors/$id');

      print('🌐 [API] GET Request to: $uri');

      final response = await client.get(
        uri,
        headers: {'Content-Type': 'application/json'},
      );

      print('📡 [API] Response Status: ${response.statusCode}');

      if (response.statusCode == 200) {
        print('✅ [API] Success! Parsing vendor...');
        return Vendor.fromJson(json.decode(response.body));
      } else if (response.statusCode == 404) {
        print('⚠️ [API] Vendor not found (404)');
        return null;
      } else {
        print('❌ [API] Error: ${response.statusCode}');
        throw Exception('Failed to load vendor: ${response.statusCode}');
      }
    } catch (e) {
      print('💥 [API] Exception caught: $e');
      throw Exception('Error fetching vendor: $e');
    }
  }
}

class MockVendorRepository implements VendorRepository {
  static List<Vendor> get _mockVendors => [
    Vendor(
      id: 1,
      name: 'Hopworks Brewing',
      email: 'info@hopworks.com',
      phone: '555-0101',
      createdAt: DateTime.now().subtract(const Duration(days: 30)),
      operatingOutOf: 'Portland, OR',
      description: 'Award-winning craft brewery specializing in IPAs and stouts',
      vendorType: 'brewery',
      updatedAt: DateTime.now(),
      latitude: 45.5152,
      longitude: -122.6784,
      eventId: 1,
      category: 'brewery',
      thumbnail: 'https://images.unsplash.com/photo-1517153295259-74eb0b416cee',
      booth: 'A12',
      isFeatured: true,
      tags: ['IPA', 'Stout', 'Lager'],
    ),
    Vendor(
      id: 2,
      name: 'Texas BBQ Pit',
      email: 'hello@texasbbq.com',
      phone: '555-0102',
      createdAt: DateTime.now().subtract(const Duration(days: 25)),
      operatingOutOf: 'Austin, TX',
      description: 'Authentic Texas-style barbecue with craft beer pairings',
      vendorType: 'food',
      updatedAt: DateTime.now(),
      latitude: 30.2672,
      longitude: -97.7431,
      eventId: 1,
      category: 'food',
      thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
      booth: 'F01',
      isFeatured: true,
      tags: ['Brisket', 'Ribs', 'Sides'],
    ),
    Vendor(
      id: 3,
      name: 'River City Brewing',
      email: 'contact@rivercity.com',
      phone: '555-0103',
      createdAt: DateTime.now().subtract(const Duration(days: 20)),
      operatingOutOf: 'San Antonio, TX',
      description: 'Local favorite known for pale ales and seasonal brews',
      vendorType: 'brewery',
      updatedAt: DateTime.now(),
      latitude: 29.4241,
      longitude: -98.4936,
      eventId: 1,
      category: 'brewery',
      thumbnail: 'https://images.unsplash.com/photo-1532634993-15f421e42ec0',
      booth: 'B08',
      isFeatured: false,
      tags: ['Pale Ale', 'Wheat', 'Porter'],
    ),
    Vendor(
      id: 4,
      name: 'Summit Suds',
      email: 'info@summitsuds.com',
      phone: '555-0104',
      createdAt: DateTime.now().subtract(const Duration(days: 15)),
      operatingOutOf: 'Denver, CO',
      description: 'Experimental craft brewery with unique flavor profiles',
      vendorType: 'brewery',
      updatedAt: DateTime.now(),
      latitude: 39.7392,
      longitude: -104.9903,
      eventId: 1,
      category: 'brewery',
      thumbnail: 'https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7',
      booth: 'C15',
      isFeatured: false,
      tags: ['Sour', 'Belgian', 'Experimental'],
    ),
    Vendor(
      id: 5,
      name: 'Lone Star Eats',
      email: 'info@lonestar.com',
      phone: '555-0105',
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
      operatingOutOf: 'Houston, TX',
      description: 'Classic Texas comfort food and street tacos',
      vendorType: 'food',
      updatedAt: DateTime.now(),
      latitude: 29.7604,
      longitude: -95.3698,
      eventId: 1,
      category: 'food',
      thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
      booth: 'F12',
      isFeatured: false,
      tags: ['Tacos', 'Nachos', 'Wings'],
    ),
    Vendor(
      id: 6,
      name: 'Barrel & Oak',
      email: 'hello@barrelandoak.com',
      phone: '555-0106',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
      operatingOutOf: 'Fort Worth, TX',
      description: 'Barrel-aged specialists with rotating seasonal releases',
      vendorType: 'brewery',
      updatedAt: DateTime.now(),
      latitude: 32.7555,
      longitude: -97.3308,
      eventId: 1,
      category: 'brewery',
      thumbnail: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13',
      booth: 'A05',
      isFeatured: true,
      tags: ['Barrel-Aged', 'Imperial', 'Stout'],
    ),
    Vendor(
      id: 7,
      name: 'The Smoke Shack',
      email: 'contact@smokeshack.com',
      phone: '555-0107',
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
      operatingOutOf: 'Dallas, TX',
      description: 'Smoked meats and gourmet sausages',
      vendorType: 'food',
      updatedAt: DateTime.now(),
      latitude: 32.7767,
      longitude: -96.7970,
      eventId: 1,
      category: 'food',
      thumbnail: 'https://images.unsplash.com/photo-1544025162-d76694265947',
      booth: 'F08',
      isFeatured: false,
      tags: ['Smoked', 'Sausage', 'Brisket'],
    ),
    Vendor(
      id: 8,
      name: 'Golden Tap',
      email: 'info@goldentap.com',
      phone: '555-0108',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      operatingOutOf: 'Katy, TX',
      description: 'Award-winning lagers and pilsners',
      vendorType: 'brewery',
      updatedAt: DateTime.now(),
      latitude: 29.7858,
      longitude: -95.8244,
      eventId: 1,
      category: 'brewery',
      thumbnail: 'https://images.unsplash.com/photo-1608270586620-248524c67de9',
      booth: 'B22',
      isFeatured: false,
      tags: ['Lager', 'Pilsner', 'Helles'],
    ),
  ];

  @override
  Future<List<Vendor>> getVendors({int? eventId}) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));

    if (eventId != null) {
      return _mockVendors.where((v) => v.eventId == eventId).toList();
    }

    return _mockVendors;
  }

  @override
  Future<Vendor?> getVendorById(int id) async {
    await Future.delayed(const Duration(milliseconds: 300));
    try {
      return _mockVendors.firstWhere((vendor) => vendor.id == id);
    } catch (e) {
      return null;
    }
  }
}
