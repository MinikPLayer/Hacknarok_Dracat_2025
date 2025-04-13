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
}
