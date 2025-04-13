import 'dart:convert';

import 'package:dracat_hacknarok_2025/model/trip_model.dart';

import 'package:dracat_hacknarok_2025/utils/map_utils.dart';
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ActiveTripData {
  TripModel? activeTrip;
  List<OSRMWaypoint> waypoints;
  List<MapRoute> routes;

  ActiveTripData({
    required this.activeTrip,
    required this.waypoints,
    required this.routes,
  });
}

class TripState {
  TripModel? activeTrip;
  List<TripModel> completedTrips = [];

  TripState({
    required this.activeTrip,
    required this.completedTrips,
  });

  factory TripState.create() {
    return TripState(
      activeTrip: null,
      completedTrips: [],
    );
  }

  factory TripState.fromJson(Map<String, dynamic> json) {
    return TripState(
      activeTrip: json['activeTrip'] != null ? TripModel.fromJson(json['activeTrip']) : null,
      completedTrips: (json['completedTrips'] as List<dynamic>?)
              ?.map((e) => TripModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'activeTrip': activeTrip?.toJson(),
      'completedTrips': completedTrips.map((e) => e.toJson()).toList(),
    };
  }
}

class MockTripProvider extends ChangeNotifier {
  static const String _tripStateKey = 'tripState';

  ActiveTripData? _activeTripData;
  ActiveTripData? get activeTripData => _activeTripData;

  TripState? _tripState;
  TripState? get tripState => _tripState;

  Future<bool> saveState(TripState? state) async {
    if (state == null) {
      return false;
    }

    var prefs = await SharedPreferences.getInstance();
    return await prefs.setString(_tripStateKey, jsonEncode(state.toJson()));
  }

  Future<TripState?> loadState() async {
    var prefs = await SharedPreferences.getInstance();
    var jsonString = prefs.getString(_tripStateKey);
    if (jsonString == null) {
      return TripState.create();
    }

    var jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;
    return TripState.fromJson(jsonMap);
  }

  Future updateActiveTripData(TripModel trip, LatLng? userLocation) async {
    var points = trip.points;
    if (userLocation != null) {
      points.sort((p1, p2) {
        var distance1 = Distance().as(LengthUnit.Meter, p1.getLocation(), userLocation);
        var distance2 = Distance().as(LengthUnit.Meter, p2.getLocation(), userLocation);

        return distance1.compareTo(distance2);
      });
    }

    var tripData = await MapUtils.getTripBetweenPoints(points.map((e) => e.getLocation()).toList());
    _activeTripData = ActiveTripData(activeTrip: trip, waypoints: tripData.waypoints, routes: tripData.routes);

    notifyListeners();
  }

  ActiveTripData? getActiveTripData() {
    return _activeTripData;
  }

  void setActiveTrip(TripModel trip) {
    _tripState?.activeTrip = trip;
    updateActiveTripData(trip, null);
    saveState(_tripState);
    notifyListeners();
  }

  bool isTripActive() {
    return _tripState?.activeTrip != null;
  }

  TripModel? getActiveTrip() {
    return _tripState?.activeTrip;
  }

  void addCompletedTrip(TripModel trip) {
    _tripState?.completedTrips.add(trip);
    saveState(_tripState);
    notifyListeners();
  }

  void stopActiveTrip() {
    _tripState?.activeTrip = null;
    saveState(_tripState);
    notifyListeners();
  }

  Future init() async {
    var state = await loadState();
    _tripState = state;
    notifyListeners();

    if (_tripState?.activeTrip != null) {
      updateActiveTripData(tripState!.activeTrip!, null);
    } else {
      _activeTripData = null;
    }
  }
}
