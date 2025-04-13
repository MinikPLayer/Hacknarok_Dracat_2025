import 'dart:math';

import 'package:dracat_hacknarok_2025/mics/tile_provider.dart';
import 'package:dracat_hacknarok_2025/utils/map_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapComponentState();
}

class MapWaypoint {
  OSRMWaypoint waypoint;
  bool isOpened = false;

  MapWaypoint(this.waypoint, {this.isOpened = false});
}

class _MapComponentState extends State<MapPage> {
  List<MapWaypoint> landmarks = [];

  LatLng initialCenter = LatLng(50.0645, 19.9234);
  LatLng userPosition = LatLng(50.0745, 19.9234);

  List<Polyline> currentRoute = [];

  bool demoMenuExpanded = false;
  bool isRouteGenerationAvailable = true;

  static Color nearestColor = Colors.green;
  static Color secondColor = Colors.green.withBlue(64);
  static Color thirdColor = Colors.blue;

  Color getMarkerColorByIndex(int index) {
    if (currentRoute.isEmpty) {
      return Colors.blue;
    }

    switch (index) {
      case 0:
        return nearestColor;
      case 1:
        return secondColor;
      default:
        return thirdColor;
    }
  }

  // TODO: Fix click being blocked by map overlays.
  // Fix by creating an overlay for the map and using it to handle clicks.
  List<Marker> getMarkersList() {
    var lst = landmarks.asMap().entries.map((entry) {
      var index = entry.key;
      var landmark = entry.value;

      const double iconSize = 40;

      return Marker(
        point: landmark.waypoint.location,
        height: landmark.isOpened ? 200 : iconSize * 2,
        width: landmark.isOpened ? 200 : iconSize,
        alignment: Alignment.topCenter,
        child: GestureDetector(
          onTap: () => setState(() {
            landmark.isOpened = !landmark.isOpened;
          }),
          child: Container(
            color: Colors.transparent,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (landmark.isOpened)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 16.0),
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(8.0),
                        child: Column(
                          children: [
                            Padding(
                              padding: const EdgeInsets.only(bottom: 8.0),
                              child: Text(
                                "Waypoint #${landmark.waypoint.waypointIndex}",
                                style: ThemeData.light().textTheme.headlineLarge!.copyWith(
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                            if ((landmark.waypoint.name != null && landmark.waypoint.name!.isNotEmpty))
                              Text(
                                landmark.waypoint.name!,
                              ),
                            Text("Latitude: ${landmark.waypoint.location.latitude}"),
                            Text("Longitude: ${landmark.waypoint.location.longitude}"),
                          ],
                        ),
                      ),
                    ),
                  ),
                Icon(
                  Icons.location_pin,
                  color: getMarkerColorByIndex(index),
                  size: iconSize,
                  shadows: [
                    Shadow(
                      color: Colors.black.withAlpha(196),
                      offset: const Offset(1, 1),
                      blurRadius: 1.0,
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      );
    }).toList();

    lst.add(
      Marker(
        point: userPosition,
        child: Icon(Icons.person_pin_circle, color: Colors.blue),
      ),
    );
    return lst;
  }

  Future generateRandomRoute() async {
    const int numberOfPoints = 10;
    const double range = 0.01;
    // Get random points around center

    setState(() {
      isRouteGenerationAvailable = false;
    });

    var positions = <LatLng>[];
    landmarks = [];
    for (int i = 0; i < numberOfPoints; i++) {
      var offsetLat = Random().nextDouble() * range;
      var offsetLng = Random().nextDouble() * range;

      var lat = initialCenter.latitude + (Random().nextBool() ? offsetLat : -offsetLat);
      var lng = initialCenter.longitude + (Random().nextBool() ? offsetLng : -offsetLng);

      positions.add(LatLng(lat, lng));
    }

    setState(() {
      currentRoute = [];
    });

    try {
      var trip = await MapUtils.getTripBetweenPoints(userPosition, positions);

      setState(() {
        currentRoute = trip.routes.asMap().entries.map(
          (entry) {
            var index = entry.key;
            var route = entry.value;

            Color color = Colors.green;
            var strokeWidth = 4.0;
            var pattern = StrokePattern.solid();
            switch (index) {
              case 0:
                color = nearestColor;
                strokeWidth = 4.0;
                pattern = StrokePattern.solid();
                break;

              case 1:
                color = secondColor.withAlpha(196);
                strokeWidth = 4.0;
                pattern = StrokePattern.dashed(segments: [4, 4]);
                break;

              default:
                color = thirdColor.withAlpha(128);
                strokeWidth = 4.0;
                pattern = StrokePattern.dashed(segments: [8, 8]);
                break;
            }

            return Polyline(
              points: route.steps,
              color: color,
              strokeWidth: strokeWidth,
              pattern: pattern,
            );
          },
        ).toList();

        // Skip 1 to avoid user position
        var waypoints = trip.waypoints.skip(1).toList();
        waypoints.sort((w1, w2) => w1.waypointIndex!.compareTo(w2.waypointIndex!));
        landmarks = waypoints.map((entry) {
          return MapWaypoint(entry, isOpened: false);
        }).toList();
      });
    } catch (e) {
      if (context.mounted) {
        showDialog(
          context: context,
          builder: (ctx) => AlertDialog(
            title: const Text("Error"),
            content: Text(e.toString()),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                },
                child: const Text("OK"),
              ),
            ],
          ),
        );
      }
    }

    setState(() {
      isRouteGenerationAvailable = true;
    });
  }

  @override
  void initState() {
    super.initState();

    generateRandomRoute();
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData.light(),
      child: Scaffold(
        body: FlutterMap(
          options: MapOptions(initialCenter: initialCenter),
          children: [
            openStreetMapTileLayer,
            MarkerLayer(markers: getMarkersList()),
            PolylineLayer(
              polylines: currentRoute,
            ),
          ],
        ),
        floatingActionButton: Column(
          mainAxisAlignment: MainAxisAlignment.end,
          crossAxisAlignment: CrossAxisAlignment.end,
          children: [
            if (demoMenuExpanded)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                mainAxisSize: MainAxisSize.max,
                children: [
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(left: 32.0),
                      child: Card(
                        color: Colors.white.withAlpha(196),
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            children: [
                              Padding(
                                padding: const EdgeInsets.all(8.0),
                                child: Text(
                                  "Demo menu",
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineMedium!
                                      .copyWith(color: Colors.black, fontWeight: FontWeight.bold),
                                ),
                              ),
                              ElevatedButton(
                                onPressed: isRouteGenerationAvailable
                                    ? () {
                                        generateRandomRoute();
                                      }
                                    : null,
                                style: ThemeData.light().elevatedButtonTheme.style,
                                child: const Text("Generate new route"),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                FloatingActionButton(
                  child: demoMenuExpanded ? const Icon(Icons.arrow_drop_down) : const Icon(Icons.arrow_drop_up),
                  onPressed: () {
                    setState(() {
                      demoMenuExpanded = !demoMenuExpanded;
                    });
                  },
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
