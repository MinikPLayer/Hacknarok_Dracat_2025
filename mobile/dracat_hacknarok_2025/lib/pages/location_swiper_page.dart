import 'package:confetti/confetti.dart';
import 'package:dracat_hacknarok_2025/components/location_card.dart';
import 'package:dracat_hacknarok_2025/model/location_model.dart';
import 'package:dracat_hacknarok_2025/model/trip_model.dart';
import 'package:dracat_hacknarok_2025/pages/map_page.dart';
import 'package:dracat_hacknarok_2025/providers/mock_location_provider.dart';
import 'package:dracat_hacknarok_2025/providers/mock_trip_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_card_swiper/flutter_card_swiper.dart';
import 'package:provider/provider.dart';

class LocationSwiperCardEntry {
  final LocationModel location;
  final Widget backgroundWidget;

  LocationSwiperCardEntry({
    required this.location,
    required this.backgroundWidget,
  });
}

class LocationSwiperPage extends StatefulWidget {
  const LocationSwiperPage({super.key});

  @override
  State<LocationSwiperPage> createState() => _LocationSwiperPageState();
}

class _LocationSwiperPageState extends State<LocationSwiperPage> {
  bool isFinished = false;
  final ConfettiController confettiController = ConfettiController(duration: const Duration(seconds: 1));
  final ConfettiController confettiController2 = ConfettiController(duration: const Duration(seconds: 1));

  List<LocationSwiperCardEntry> selectedEntries = [];

  @override
  void initState() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      var provider = Provider.of<MockLocationProvider>(context, listen: false);
      provider.refreshLocations();
    });

    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    var provider = Provider.of<MockLocationProvider>(context, listen: true);

    if (isFinished) {
      return Stack(
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "Congratulations!",
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Expanded(
                  child: Column(
                    children: [
                      Text(
                        "Your trip plan contains ${selectedEntries.length} worlds.",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      Text("Swipe right to view your selected locations."),
                      Expanded(
                        child: ListView(
                          scrollDirection: Axis.horizontal,
                          children: selectedEntries.map((entry) {
                            return Padding(
                              padding: const EdgeInsets.all(40.0),
                              child: SizedBox(
                                width: MediaQuery.of(context).size.width - 90,
                                child: SwipeCard(
                                  backgroundWidget: entry.backgroundWidget,
                                  title: entry.location.name,
                                  description: entry.location.description,
                                  targetLocation: entry.location.getLocation(),
                                ),
                              ),
                            );
                          }).toList(),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.only(bottom: 40.0),
                        child: Row(
                          mainAxisSize: MainAxisSize.max,
                          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                          children: [
                            ElevatedButton(
                              onPressed: () {
                                setState(() {
                                  provider.refreshLocations();
                                  isFinished = false;
                                });
                              },
                              child: Row(
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(right: 8.0),
                                    child: Icon(Icons.add),
                                  ),
                                  Text("Add more"),
                                ],
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () {},
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Padding(
                                    padding: const EdgeInsets.only(right: 8.0),
                                    child: Icon(Icons.share),
                                  ),
                                  Text("Share your trip!"),
                                ],
                              ),
                            ),
                            ElevatedButton(
                              onPressed: () {
                                var tripData = TripModel(
                                  points: selectedEntries.map((entry) => entry.location).toList(),
                                );
                                Provider.of<MockTripProvider>(context, listen: false).setActiveTrip(tripData);
                                Navigator.of(context).popUntil((route) => route.isFirst);
                                Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (context) => MapPage(),
                                  ),
                                );
                              },
                              child: Row(
                                children: [
                                  Text("Continue"),
                                  Padding(
                                    padding: const EdgeInsets.only(left: 8.0),
                                    child: Icon(Icons.arrow_right_alt),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
          Positioned(
            bottom: 0,
            right: 0,
            child: Center(
              child: ConfettiWidget(
                confettiController: confettiController,
                blastDirectionality: BlastDirectionality.directional,
                emissionFrequency: 0.1,
                numberOfParticles: 20,
                blastDirection: -3.14 / 1.5,
                minBlastForce: 80,
                maxBlastForce: 150,
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            child: Center(
              child: ConfettiWidget(
                confettiController: confettiController2,
                blastDirectionality: BlastDirectionality.directional,
                emissionFrequency: 0.1,
                numberOfParticles: 20,
                blastDirection: -3.14 / 3,
                minBlastForce: 80,
                maxBlastForce: 150,
              ),
            ),
          ),
        ],
      );
    }

    var locations = provider.locations.map((location) {
      return LocationSwiperCardEntry(
        location: location,
        backgroundWidget: Image.network(
          location.imageUri,
          fit: BoxFit.cover,
          width: double.infinity,
          height: double.infinity,
        ),
      );
    }).toList();

    if (provider.isFetching) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text("Fetching customized worlds..."),
          ),
          CircularProgressIndicator(),
        ],
      );
    }

    if (provider.locations.isEmpty) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Text("No worlds found."),
          ),
          ElevatedButton(
            onPressed: () {
              provider.refreshLocations();
            },
            child: Text("Refresh"),
          ),
        ],
      );
    }

    return CardSwiper(
      isLoop: false,
      cardsCount: locations.length,
      allowedSwipeDirection: AllowedSwipeDirection.only(left: true, right: true),
      threshold: 90,
      onEnd: () => setState(() {
        if (selectedEntries.isEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text("You need to select at least one world."),
            ),
          );

          provider.refreshLocations();
          return;
        }

        isFinished = true;
        confettiController.play();
        confettiController2.play();
      }),
      onSwipe: (previousIndex, currentIndex, direction) async {
        if (direction == CardSwiperDirection.right) {
          selectedEntries.add(locations[previousIndex]);
        }
        return true;
      },
      cardBuilder: (context, index, percentThresholdX, percentThresholdY) => SwipeCard(
        backgroundWidget: locations[index].backgroundWidget,
        title: locations[index].location.name,
        description: locations[index].location.description,
        targetLocation: locations[index].location.getLocation(),
      ),
    );
  }
}
