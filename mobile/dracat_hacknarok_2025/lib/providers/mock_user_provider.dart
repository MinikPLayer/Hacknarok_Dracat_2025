import 'dart:async';
import 'dart:convert';
import 'dart:math';

import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:latlong2/latlong.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserPreferencesCategories {
  static const String parks = 'Parks';
  static const String museums = 'Museums';
  static const String restaurants = 'Restaurants';
  static const String water = 'Water';

  static List<String> allCategories() {
    return [
      parks,
      museums,
      restaurants,
      water,
    ];
  }
}

class UserState {
  String? name;
  bool seenDemoMessage = false;
  bool? allowLocation = false;
  List<String> selectedCategories = [];

  UserState({
    required this.name,
    required this.seenDemoMessage,
    required this.selectedCategories,
    required this.allowLocation,
  });

  factory UserState.createGuest() {
    return UserState(
      name: "Guest #${Random().nextInt(10000)}",
      seenDemoMessage: false,
      selectedCategories: [],
      allowLocation: null,
    );
  }

  factory UserState.fromJson(Map<String, dynamic> json) {
    return UserState(
      name: json['name'] as String?,
      seenDemoMessage: json['seenDemoMessage'] as bool? ?? false,
      selectedCategories: (json['selectedCategories'] as List<dynamic>?)?.map((e) => e as String).toList() ?? [],
      allowLocation: json['allowLocation'] as bool?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'seenDemoMessage': seenDemoMessage,
      'selectedCategories': selectedCategories,
      'allowLocation': allowLocation,
    };
  }
}

class MockUserProvider extends ChangeNotifier {
  static const String _userStateKey = 'userState';

  UserState? _userState;
  UserState? get userState => _userState;

  bool _forceMockLocation = false;
  LatLng? _currentMockLocation;
  LatLng? _currentRealLocation;

  LatLng? get currentUserLocation => _forceMockLocation || (_userState == null || _userState!.allowLocation != true)
      ? _currentMockLocation
      : _currentRealLocation;

  Future<bool> saveState(UserState? state) async {
    if (state == null) {
      return false;
    }

    var prefs = await SharedPreferences.getInstance();
    var jsonMap = state.toJson();
    var jsonString = json.encode(jsonMap);

    return prefs.setString(_userStateKey, jsonString);
  }

  Future<UserState> loadState() async {
    var prefs = await SharedPreferences.getInstance();
    var jsonString = prefs.getString(_userStateKey);
    if (jsonString != null) {
      var jsonMap = json.decode(jsonString) as Map<String, dynamic>;
      return UserState.fromJson(jsonMap);
    } else {
      var state = UserState.createGuest();
      saveState(state);
      return state;
    }
  }

  final LocationSettings locationSettings = LocationSettings(
    accuracy: LocationAccuracy.high,
  );
  StreamSubscription<Position>? positionStream;
  Future initAutoLocation() async {
    LocationPermission permission;

    // Test if location services are enabled.
    var serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return Future.error('Location services are disabled.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return Future.error('Location permissions are denied');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return Future.error('Location permissions are permanently denied, we cannot request permissions.');
    }

    positionStream = Geolocator.getPositionStream(locationSettings: locationSettings).listen((Position? position) {
      print(position == null ? 'Unknown' : '${position.latitude.toString()}, ${position.longitude.toString()}');

      if (position != null) {
        _currentRealLocation = LatLng(position.latitude, position.longitude);
        notifyListeners();
      }
    });
  }

  void setAllowLocation(bool allowLocation) {
    _userState?.allowLocation = allowLocation;
    saveState(_userState);

    if (allowLocation) {
      initAutoLocation();
    }

    notifyListeners();
  }

  bool? getAllowLocationStatus() {
    return _userState?.allowLocation;
  }

  void setUserMockLocation(LatLng location) {
    _currentMockLocation = location;
    notifyListeners();
  }

  static String getDistanceString(double distance) {
    if (distance < 1000) {
      return "${distance.toStringAsFixed(0)} m";
    } else {
      return "${(distance / 1000).toStringAsFixed(1)} km";
    }
  }

  LatLng? getUserLocation() {
    return currentUserLocation;
  }

  void setName(String name) {
    _userState?.name = name;
    saveState(_userState);
    notifyListeners();
  }

  void setSeenDemoMessage(bool seen) {
    _userState?.seenDemoMessage = seen;
    saveState(_userState);
    notifyListeners();
  }

  void setSelectedCategories(List<String> categories) {
    _userState?.selectedCategories = categories;
    saveState(_userState);
    notifyListeners();
  }

  Future init() async {
    var newState = await loadState();
    _userState = newState;

    if (_userState != null && _userState!.allowLocation == true) {
      initAutoLocation();
    }

    notifyListeners();
  }
}
