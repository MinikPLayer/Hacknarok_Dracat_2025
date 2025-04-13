import 'dart:math';

import 'package:dracat_hacknarok_2025/model/location_model.dart';
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';

class MockLocationProvider extends ChangeNotifier {
  List<LocationModel> _locations = [];
  List<LocationModel> get locations => _locations;

  bool _isFetching = false;
  bool get isFetching => _isFetching;

  static List<LocationModel> generateRandomLocations(int n) {
    const List<String> titles = [
      "Motel",
      "Hotel",
      "Museum",
      "Park",
      "Restaurant",
      "Beach",
      "Mountain",
      "City",
      "Forest",
      "Desert",
      "Island",
      "Cave",
    ];

    const List<String> imagesURLs = [
      "https://cdn.pixabay.com/photo/2025/03/14/16/41/snow-covered-mountain-9470471_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/04/08/10/42/landscape-9521261_1280.jpg",
      "https://cdn.pixabay.com/photo/2020/08/24/21/44/man-5515150_1280.jpg",
      "https://cdn.pixabay.com/photo/2024/12/05/08/06/modern-9246082_1280.jpg",
      "https://cdn.pixabay.com/photo/2024/10/16/09/14/alps-9124288_1280.jpg",
      "https://cdn.pixabay.com/photo/2023/08/28/19/28/boat-8219886_1280.jpg",
      "https://cdn.pixabay.com/photo/2022/05/22/16/49/outdoors-7213951_1280.jpg",
      "https://cdn.pixabay.com/photo/2024/12/18/10/10/tree-9274973_1280.png",
      "https://cdn.pixabay.com/photo/2022/01/13/05/48/dog-6934437_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/04/05/18/12/bridge-9515680_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/01/14/13/42/amsterdam-9332884_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/01/22/15/57/landscape-9352440_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/04/07/21/29/nature-9520131_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/03/14/16/41/snow-covered-mountain-9470471_1280.jpg",
      "https://cdn.pixabay.com/photo/2024/11/25/10/38/mountains-9223041_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/03/31/08/17/penguin-9504250_1280.jpg",
      "https://cdn.pixabay.com/photo/2025/03/29/10/59/ryoan-ji-9500830_1280.jpg",
    ];

    const double range = 0.01;
    const LatLng initialCenter = LatLng(50.0645, 19.9234);

    return List.generate(n, (index) {
      var randomIndex = Random().nextInt(2137);
      var title = "${titles[Random().nextInt(titles.length)]} #$randomIndex";

      var offsetLat = Random().nextDouble() * range;
      var offsetLng = Random().nextDouble() * range;

      return LocationModel(
        name: title,
        description: "Description for location $title",
        imageUri: imagesURLs[Random().nextInt(imagesURLs.length)],
        latitude: initialCenter.latitude + offsetLat,
        longitude: initialCenter.longitude + offsetLng,
        rating: 4.5 + index * 0.1,
        reviewsCount: 100 + index * 10,
      );
    });
  }

  Future refreshLocations() async {
    _isFetching = true;
    notifyListeners();

    // Simulate a network delay
    await Future.delayed(Duration(milliseconds: Random().nextInt(800) + 500));

    _locations = generateRandomLocations(9);
    _isFetching = false;
    notifyListeners();
  }
}
