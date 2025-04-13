import 'dart:math';

import 'package:dracat_hacknarok_2025/pages/location_swiper_page.dart';
import 'package:dracat_hacknarok_2025/utils/map_utils.dart';
import 'package:flutter/material.dart';

class LocationDetailsComponent extends StatefulWidget {
  final String locationName;
  final Function onBackPressed;
  final bool isReached;

  const LocationDetailsComponent(
      {super.key, required this.locationName, required this.onBackPressed, required this.isReached});

  @override
  State<LocationDetailsComponent> createState() => _LocationDetailsComponentState();
}

class _LocationDetailsComponentState extends State<LocationDetailsComponent> {
  bool photoTaken = false;

  static const List<String> userNames = [
    "John Doe",
    "Jane Smith",
    "Alice Johnson",
    "Bob Brown",
    "Charlie Davis",
    "Diana Prince",
    "Ethan Hunt",
    "Felicity Smoak",
    "George Clooney",
    "Hannah Montana",
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.locationName),
        leading: IconButton(onPressed: () => widget.onBackPressed(), icon: const Icon(Icons.arrow_back)),
      ),
      body: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.max,
            children: [
              if (widget.isReached)
                Text(
                  "Congratulations!",
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              if (widget.isReached)
                Text(
                  "You have reached:",
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
              if (widget.isReached)
                Text(
                  widget.locationName,
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              if (widget.isReached)
                Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.max,
                  children: photoTaken
                      ? [
                          const Text(
                            "Thank you for sharing your photo! ❤️",
                            style: TextStyle(fontSize: 24),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: const Text(
                              "+15 scoreboard points",
                            ),
                          ),
                        ]
                      : [
                          Text("Please take a photo of the location to help others!"),
                          const SizedBox(height: 16),
                          IconButton(
                            onPressed: () {
                              showDialog(
                                context: context,
                                builder: (ctx) => AlertDialog(
                                  title: const Text("Take a photo"),
                                  content: const Text(
                                      "Unfortunately, this feature is only implemented in the native version of the app because of some flutter technical limitations."),
                                  actions: [
                                    TextButton(
                                      onPressed: () => Navigator.of(ctx).pop(),
                                      child: const Text("Simulate a photo"),
                                    ),
                                  ],
                                ),
                              );

                              setState(() {
                                photoTaken = true;
                              });
                            },
                            icon: Icon(Icons.camera),
                          ),
                        ],
                ),
              Expanded(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        "People who reached this location.",
                        style: Theme.of(context).textTheme.headlineMedium,
                      ),
                    ),
                    SizedBox(
                      width: 400,
                      height: 300,
                      child: ListView.builder(
                        scrollDirection: Axis.horizontal,
                        itemBuilder: (v, x) => Padding(
                          padding: const EdgeInsets.all(8.0),
                          child: Column(
                            children: [
                              Image(
                                width: 200,
                                height: 200,
                                image: NetworkImage("http://hack.mtomecki.pl/influencer.gif"),
                              ),
                              Text(
                                userNames[x % userNames.length],
                                style: Theme.of(context).textTheme.labelLarge,
                              ),
                              Text(
                                "${(Random().nextInt(5) + 1)} ★",
                                style: Theme.of(context).textTheme.labelLarge,
                              )
                            ],
                          ),
                        ),
                      ),
                    )
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
