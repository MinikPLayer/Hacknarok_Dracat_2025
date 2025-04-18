import 'package:dracat_hacknarok_2025/components/location_details_component.dart';
import 'package:dracat_hacknarok_2025/components/map_demo_menu_component.dart';
import 'package:dracat_hacknarok_2025/mics/tile_provider.dart';
import 'package:dracat_hacknarok_2025/providers/mock_trip_provider.dart';
import 'package:dracat_hacknarok_2025/providers/mock_user_provider.dart';
import 'package:dracat_hacknarok_2025/utils/map_utils.dart';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

class MapPage extends StatefulWidget {
  const MapPage({super.key});

  @override
  State<MapPage> createState() => _MapComponentState();
}

class _MapComponentState extends State<MapPage> {
  MapController mapController = MapController();

  OSRMWaypoint? openedLandmark;

  LatLng initialCenter = LatLng(50.0645, 19.9234);

  static Color nearestColor = Colors.green;
  static Color secondColor = Colors.green.withBlue(64);
  static Color thirdColor = Colors.blue;

  bool nearestWaypointUpdateInProgress = false;
  OSRMWaypoint? nearestWaypoint;
  MapRoute? nearestRoute;
  DateTime lastWaypointUpdate = DateTime.fromMicrosecondsSinceEpoch(0);

  static const Duration waypointUpdateInterval = Duration(seconds: 2);

  OSRMWaypoint? currentlyVisitingWaypoint;
  static const double minAutoVisitDistance = 75.0;

  Color getMarkerColorByWaypoint(bool isRouteEmpty, OSRMWaypoint waypoint) {
    if (isRouteEmpty) {
      return Colors.blue;
    }

    Color color;
    if (waypoint.location == nearestWaypoint?.location) {
      color = nearestColor;
    } else {
      color = thirdColor;
    }

    if (waypoint.isVisited) {
      color = color.withAlpha(96);
    }

    return color;
  }

  // TODO: Fix click being blocked by map overlays.
  // Fix by creating an overlay for the map and using it to handle clicks.
  List<Marker> getMarkersList(List<OSRMWaypoint> landmarks, LatLng? userPosition) {
    const double iconSize = 40;

    var lst = landmarks.asMap().entries.map((entry) {
      var index = entry.key;
      var landmark = entry.value;

      var isOpened = landmark.location == openedLandmark?.location;

      return Marker(
        point: landmark.location,
        height: isOpened ? 300 : iconSize * 2,
        width: isOpened ? 300 : iconSize,
        alignment: Alignment.topCenter,
        child: GestureDetector(
          onTap: () => setState(() {
            if (isOpened) {
              openedLandmark = null;
            } else {
              openedLandmark = landmark;
            }
          }),
          child: Container(
            color: Colors.transparent,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                if (isOpened)
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
                                "Waypoint #${landmark.waypointIndex}",
                                style: ThemeData.light().textTheme.headlineLarge!.copyWith(
                                      color: Colors.black,
                                      fontWeight: FontWeight.bold,
                                    ),
                              ),
                            ),
                            if ((landmark.name != null && landmark.name!.isNotEmpty))
                              Text(
                                landmark.name!,
                              ),
                            Text("Latitude: ${landmark.location.latitude}"),
                            Text("Longitude: ${landmark.location.longitude}"),
                            ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  currentlyVisitingWaypoint = landmark;
                                });
                              },
                              child: Text("Visit now"),
                            )
                          ],
                        ),
                      ),
                    ),
                  ),
                Icon(
                  Icons.location_pin,
                  color: getMarkerColorByWaypoint(false, landmark),
                  size: iconSize,
                  shadows: [
                    Shadow(
                      color: Colors.black.withAlpha(landmark.isVisited ? 32 : 196),
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

    if (userPosition != null) {
      lst.add(
        Marker(
          point: userPosition,
          child: Icon(Icons.person_pin_circle, color: Colors.blue, size: iconSize),
        ),
      );
    }

    return lst;
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      var tripProvider = Provider.of<MockTripProvider>(context, listen: false);
      var userProvider = Provider.of<MockUserProvider>(context, listen: false);

      var activeTrip = tripProvider.getActiveTrip();
      if (userProvider.currentUserLocation != null && activeTrip != null) {
        initialCenter = userProvider.currentUserLocation!;
        tripProvider.updateActiveTripData(activeTrip, userProvider.currentUserLocation);
      }
    });
  }

  OSRMWaypoint getNearestNotVisitedWaypoint(LatLng userPosition, List<OSRMWaypoint> waypoints) {
    var nearestWaypoint = waypoints.firstWhere((waypoint) => !waypoint.isVisited);
    var nearestDistance = Distance().as(LengthUnit.Meter, userPosition, nearestWaypoint.location);

    for (var waypoint in waypoints) {
      if (waypoint.isVisited) {
        continue;
      }

      var distance = Distance().as(LengthUnit.Meter, userPosition, waypoint.location);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestWaypoint = waypoint;
      }
    }

    return nearestWaypoint;
  }

  Future updateNearestPointAndRouteIfNescessary(LatLng userLocation, List<OSRMWaypoint> waypoints) async {
    if (nearestWaypointUpdateInProgress) {
      return;
    }

    if (nearestWaypoint == null ||
        DateTime.now().difference(lastWaypointUpdate).inSeconds > waypointUpdateInterval.inSeconds) {
      print("Updating nearest waypoint and route...");
      nearestWaypointUpdateInProgress = true;
      var nearest = getNearestNotVisitedWaypoint(userLocation, waypoints);
      setState(() {
        nearestWaypoint = nearest;
      });

      var route = await MapUtils.getRouteBetweenTwoPoints(userLocation, nearest.location);
      setState(() {
        nearestRoute = route;
        nearestWaypointUpdateInProgress = false;
      });

      print("Nearest waypoint: ${nearestWaypoint?.location.latitude}, ${nearestWaypoint?.location.longitude}");
      lastWaypointUpdate = DateTime.now();
    }
  }

  void checkForUserBeingCloseToWaypoint(LatLng? userPosition, List<OSRMWaypoint> waypoints) {
    if (userPosition == null || currentlyVisitingWaypoint != null) {
      return;
    }

    for (var waypoint in waypoints) {
      if (waypoint.isVisited) {
        continue;
      }

      var distance = Distance().as(LengthUnit.Meter, userPosition, waypoint.location);
      if (distance < minAutoVisitDistance) {
        setState(() {
          currentlyVisitingWaypoint = waypoint;
        });
        return;
      }
    }

    setState(() {
      currentlyVisitingWaypoint = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    var tripProvider = Provider.of<MockTripProvider>(context, listen: true);
    var userProvider = Provider.of<MockUserProvider>(context, listen: true);
    if (tripProvider.getActiveTrip() == null) {
      return Scaffold(
        body: const Center(
          child: Text("No active trip"),
        ),
      );
    }

    var activeTripData = tripProvider.getActiveTripData();
    if (activeTripData == null) {
      return Scaffold(
        body: const Center(
          child: Column(
            children: [
              Padding(
                padding: EdgeInsets.all(8.0),
                child: Text("Waiting for detailed trip data..."),
              ),
              CircularProgressIndicator(),
            ],
          ),
        ),
      );
    }

    if (userProvider.currentUserLocation != null) {
      updateNearestPointAndRouteIfNescessary(userProvider.currentUserLocation!, activeTripData.waypoints);
      checkForUserBeingCloseToWaypoint(userProvider.currentUserLocation, activeTripData.waypoints);
    }

    if (currentlyVisitingWaypoint != null) {
      return LocationDetailsComponent(
        isReached: true,
        locationName: currentlyVisitingWaypoint?.name ?? "Target location",
        onBackPressed: () {
          setState(() {
            tripProvider.flagWaypointAsVisited(currentlyVisitingWaypoint!, userProvider.currentUserLocation);
            currentlyVisitingWaypoint = null;
            // Center camera on user
            mapController.move(userProvider.currentUserLocation!, mapController.camera.zoom);
          });
        },
      );
    }

    var polyLines = activeTripData.routes.asMap().entries.map(
      (entry) {
        var index = entry.key;
        var route = entry.value;

        Color color = Colors.green;
        var strokeWidth = 4.0;
        var pattern = StrokePattern.solid();

        switch (index) {
          case 0:
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

    if (nearestRoute != null) {
      polyLines.insert(
        0,
        Polyline(
          points: nearestRoute!.steps,
          color: Colors.green,
          strokeWidth: 4.0,
          pattern: StrokePattern.solid(),
        ),
      );
    }

    return Theme(
      data: ThemeData.light(),
      child: Scaffold(
        body: Stack(
          children: [
            FlutterMap(
              options: MapOptions(initialCenter: initialCenter),
              mapController: mapController,
              children: [
                openStreetMapTileLayer,
                MarkerLayer(markers: getMarkersList(activeTripData.waypoints, userProvider.currentUserLocation)),
                PolylineLayer(
                  polylines: polyLines,
                ),
              ],
            ),
            Column(
              children: [
                Row(
                  mainAxisSize: MainAxisSize.max,
                  children: [
                    Expanded(
                      child: Card(
                        color: Colors.white.withAlpha(196),
                        child: Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            children: [
                              Row(
                                mainAxisSize: MainAxisSize.max,
                                children: [
                                  Expanded(
                                    child: Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Text(
                                        activeTripData.activeTrip?.name ?? "No active trip",
                                        style: Theme.of(context)
                                            .textTheme
                                            .headlineMedium!
                                            .copyWith(color: Colors.black, fontWeight: FontWeight.bold),
                                      ),
                                    ),
                                  ),
                                  IconButton(
                                    onPressed: () {
                                      showDialog(
                                        context: context,
                                        builder: (ctx) => AlertDialog(
                                          title: const Text("Stop trip"),
                                          content: const Text("Are you sure you want to stop the trip?"),
                                          actions: [
                                            TextButton(
                                              child: const Text("No"),
                                              onPressed: () {
                                                Navigator.of(context).pop();
                                              },
                                            ),
                                            TextButton(
                                              child: const Text("Yes"),
                                              onPressed: () {
                                                Navigator.of(context).pop();
                                                setState(() {
                                                  tripProvider.stopActiveTrip();
                                                });
                                              },
                                            ),
                                          ],
                                        ),
                                      );
                                    },
                                    color: Colors.red,
                                    icon: Icon(
                                      Icons.close,
                                    ),
                                  )
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        floatingActionButton: MapDemoMenuComponent(userProvider: userProvider),
      ),
    );
  }
}
