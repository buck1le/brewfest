import '../models/event.dart';

abstract class EventRepository {
  Future<List<Event>> getEvents();
  Future<Event?> getEventById(String id);
}

class EventRepositoryImpl implements EventRepository {
  @override
  Future<List<Event>> getEvents() async {
    // TODO: implement getEvents
    throw UnimplementedError();
  }

  @override
  Future<Event?> getEventById(String id) async {
    // TODO: implement getEventById
    throw UnimplementedError();
  }
}
