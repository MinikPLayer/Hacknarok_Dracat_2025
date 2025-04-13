import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:latlong2/latlong.dart';

class OSRMGeometry {
  String type;
  List<LatLng> coordinates;

  factory OSRMGeometry.fromJson(Map<String, dynamic> json) {
    return OSRMGeometry(
      type: json['type'],
      coordinates: (json['coordinates'] as List).map((coord) => LatLng(coord[1], coord[0])).toList(),
    );
  }

  OSRMGeometry({required this.type, required this.coordinates});
}

class OSRMStep {
  num? distance;
  String? drivingSide;
  num? duration;
  OSRMGeometry? geometry;

  OSRMStep({this.distance, this.drivingSide, this.duration, this.geometry});

  factory OSRMStep.fromJson(Map<String, dynamic> json) {
    return OSRMStep(
      distance: json['distance'],
      drivingSide: json['driving_side'],
      duration: json['duration'],
      geometry: OSRMGeometry.fromJson(json['geometry']),
    );
  }
}

class OSRMLeg {
  List<OSRMStep>? steps;
  String? summary;
  num? weight;
  num? duration;
  num? distance;

  OSRMLeg({this.steps, this.summary, this.weight, this.duration, this.distance});

  factory OSRMLeg.fromJson(Map<String, dynamic> json) {
    return OSRMLeg(
      steps: (json['steps'] as List).map((step) => OSRMStep.fromJson(step)).toList(),
      summary: json['summary'],
      weight: json['weight'],
      duration: json['duration'],
      distance: json['distance'],
    );
  }
}

class OSRMTrip {
  OSRMGeometry? geometry;
  List<OSRMLeg>? legs;
  num? distance;
  num? duration;
  String? weightName;
  num? weight;

  OSRMTrip({this.geometry, this.legs, this.distance, this.duration, this.weightName, this.weight});

  factory OSRMTrip.fromJson(Map<String, dynamic> json, {bool skipReturn = false}) {
    var trip = OSRMTrip(
      geometry: OSRMGeometry.fromJson(json['geometry']),
      legs: (json['legs'] as List).map((leg) => OSRMLeg.fromJson(leg)).toList(),
      distance: json['distance'],
      duration: json['duration'],
      weightName: json['weight_name'],
      weight: json['weight'],
    );

    if (skipReturn) {
      trip.legs!.removeLast();
    }

    return trip;
  }
}

class OSRMWaypoint {
  LatLng location;
  String? name;
  String? hint;
  num? distance;
  num? waypointIndex;

  OSRMWaypoint(
      {required this.location, required this.name, required this.hint, required this.distance, this.waypointIndex});

  factory OSRMWaypoint.fromJson(Map<String, dynamic> json) {
    return OSRMWaypoint(
      location: LatLng(json['location'][1], json['location'][0]),
      name: json['name'],
      hint: json['hint'],
      distance: json['distance'],
      waypointIndex: json['waypoint_index'],
    );
  }
}

class MapRoute {
  List<LatLng> steps;

  MapRoute({required this.steps});
}

class MapTrip {
  List<MapRoute> routes;
  List<OSRMWaypoint> waypoints;

  factory MapTrip.fromOSRMTrip(OSRMTrip trip, List<OSRMWaypoint> waypoints) {
    var routes = <MapRoute>[];
    for (var leg in trip.legs!) {
      var steps = leg.steps!.map((step) => step.geometry!.coordinates).expand((x) => x).toList();
      routes.add(MapRoute(steps: steps));
    }
    return MapTrip(routes: routes, waypoints: waypoints);
  }

  MapTrip({required this.routes, required this.waypoints});
}

class MapUtils {
  // TODO: Fix path including user position.
  // Instead calculate the path without user position and add it to the start of the path.
  static Future<MapTrip> getTripBetweenPoints(LatLng userPos, List<LatLng> points) async {
    var fullPath = List.from(points);
    // Inverted addition order to avoid reallocation
    fullPath.insert(0, userPos);

    var coordString = "";
    for (var i = 0; i < fullPath.length; i++) {
      coordString += "${fullPath[i].longitude},${fullPath[i].latitude}";
      if (i != fullPath.length - 1) {
        coordString += ";";
      }
    }

    var response = await http.get(
      Uri.parse(
        'https://router.project-osrm.org/trip/v1/driving/$coordString?overview=full&geometries=geojson&steps=true&annotations=true&source=first&destination=any',
      ),
    );

    var responseJson = jsonDecode(response.body);
    var osrmTrip = OSRMTrip.fromJson(responseJson["trips"][0], skipReturn: true);
    var osrmWaypoints = (responseJson["waypoints"] as List).map((waypoint) => OSRMWaypoint.fromJson(waypoint)).toList();
    var mapTrip = MapTrip.fromOSRMTrip(osrmTrip, osrmWaypoints);

    return mapTrip;
  }
}
