import 'package:dracat_hacknarok_2025/model/location_model.dart';

class TripModel {
  List<LocationModel> points = [];
  int currentPointIndex = 0;

  String name;

  TripModel({
    required this.points,
    required this.name,
    this.currentPointIndex = 0,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      points:
          (json['points'] as List<dynamic>?)?.map((e) => LocationModel.fromJson(e as Map<String, dynamic>)).toList() ??
              [],
      name: json['name'] as String,
      currentPointIndex: json['currentPointIndex'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'points': points.map((e) => e.toJson()).toList(),
      'name': name,
      'currentPointIndex': currentPointIndex,
    };
  }
}
