import 'package:dracat_hacknarok_2025/model/location_model.dart';

class TripModel {
  List<LocationModel> points = [];
  List<LocationModel> visitedPointsList = [];

  String name;

  TripModel({
    required this.points,
    required this.name,
    required this.visitedPointsList,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      points:
          (json['points'] as List<dynamic>?)?.map((e) => LocationModel.fromJson(e as Map<String, dynamic>)).toList() ??
              [],
      name: json['name'] as String,
      visitedPointsList: (json['visitedPointsList'] as List<dynamic>?)
              ?.map((e) => LocationModel.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'points': points.map((e) => e.toJson()).toList(),
      'name': name,
      'visitedPointsList': visitedPointsList.map((e) => e.toJson()).toList(),
    };
  }
}
