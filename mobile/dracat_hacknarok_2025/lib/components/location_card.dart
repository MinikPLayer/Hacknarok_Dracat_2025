import 'package:dracat_hacknarok_2025/providers/mock_user_provider.dart';
import 'package:flutter/material.dart';
import 'package:latlong2/latlong.dart';
import 'package:provider/provider.dart';

class SwipeCard extends StatelessWidget {
  final Widget backgroundWidget;
  final String title;
  final String description;
  final LatLng targetLocation;

  const SwipeCard(
      {super.key,
      required this.backgroundWidget,
      required this.title,
      required this.description,
      required this.targetLocation});

  @override
  Widget build(BuildContext context) {
    var userProvider = Provider.of<MockUserProvider>(context, listen: true);
    var userLocation = userProvider.currentUserLocation;

    var distance = 0.0;
    if (userLocation != null) {
      distance = Distance().as(LengthUnit.Meter, userLocation, targetLocation);
    }

    return Column(
      mainAxisSize: MainAxisSize.max,
      children: [
        Expanded(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(20),
              color: Colors.white,
              boxShadow: [
                BoxShadow(
                  color: Colors.black,
                  blurRadius: 10,
                  offset: const Offset(5, 5),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20),
              child: Stack(
                children: [
                  Column(
                    mainAxisSize: MainAxisSize.max,
                    children: [
                      Expanded(child: backgroundWidget),
                    ],
                  ),
                  Positioned(
                    bottom: 00,
                    left: 0,
                    right: 00,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.black.withAlpha(128),
                            Colors.black.withAlpha(0),
                          ],
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                        ),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  title,
                                  style: const TextStyle(
                                    fontSize: 24,
                                    fontWeight: FontWeight.bold,
                                    color: Colors.white,
                                    shadows: [
                                      Shadow(
                                        color: Colors.black54,
                                        offset: Offset(3, 3),
                                      ),
                                    ],
                                  ),
                                ),
                                if (userLocation != null)
                                  Text(
                                    " (${MockUserProvider.getDistanceString(distance)})",
                                    style: const TextStyle(
                                      fontSize: 24,
                                      shadows: [
                                        Shadow(
                                          color: Colors.black54,
                                          offset: Offset(3, 3),
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              description,
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                shadows: [
                                  Shadow(
                                    color: Colors.black54,
                                    offset: Offset(2, 2),
                                    blurRadius: 2,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
