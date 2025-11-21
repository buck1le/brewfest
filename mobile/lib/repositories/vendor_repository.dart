import '../models/vendor.dart';

abstract class VendorRepository {
  Future<List<Vendor>> getVendors();
  Future<Vendor?> getVendorById(String id);
}
