import 'package:dracat_hacknarok_2025/model/location_model.dart';

class TripModel {
  List<LocationModel> points = [];

  String name;

  TripModel({
    required this.points,
    required this.name,
  });

  factory TripModel.fromJson(Map<String, dynamic> json) {
    return TripModel(
      points:
          (json['points'] as List<dynamic>?)?.map((e) => LocationModel.fromJson(e as Map<String, dynamic>)).toList() ??
              [],
      name: json['name'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'points': points.map((e) => e.toJson()).toList(),
      'name': name,
    };
  }
}
