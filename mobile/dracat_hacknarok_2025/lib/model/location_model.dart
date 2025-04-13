import 'package:latlong2/latlong.dart';

class LocationModel {
  String name;
  String description;
  String imageUri;

  double latitude;
  double longitude;

  double rating;
  int reviewsCount;

  LocationModel({
    required this.name,
    required this.description,
    required this.imageUri,
    required this.latitude,
    required this.longitude,
    required this.rating,
    required this.reviewsCount,
  });

  LatLng getLocation() {
    return LatLng(latitude, longitude);
  }

  factory LocationModel.fromJson(Map<String, dynamic> json) {
    return LocationModel(
      name: json['name'] as String,
      description: json['description'] as String,
      imageUri: json['imageUri'] as String,
      latitude: (json['latitude'] as num).toDouble(),
      longitude: (json['longitude'] as num).toDouble(),
      rating: (json['rating'] as num).toDouble(),
      reviewsCount: json['reviewsCount'] as int,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'name': name,
      'description': description,
      'imageUri': imageUri,
      'latitude': latitude,
      'longitude': longitude,
      'rating': rating,
      'reviewsCount': reviewsCount,
    };
  }
}
