import 'dart:convert';

import 'package:dracat_hacknarok_2025/model/trip_model.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
      return null;
    }

    var jsonMap = jsonDecode(jsonString) as Map<String, dynamic>;
    return TripState.fromJson(jsonMap);
  }

  void setActiveTrip(TripModel trip) {
    _tripState?.activeTrip = trip;
    notifyListeners();
  }

  void addCompletedTrip(TripModel trip) {
    _tripState?.completedTrips.add(trip);
    notifyListeners();
  }

  TripModel? getActiveTrip() {
    return _tripState?.activeTrip;
  }

  void clearActiveTrip() {
    _tripState?.activeTrip = null;
    notifyListeners();
  }

  Future init() async {
    var state = await loadState();
    _tripState = state;
    notifyListeners();
  }
}
