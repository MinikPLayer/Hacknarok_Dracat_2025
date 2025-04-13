import 'dart:math';

import 'package:dracat_hacknarok_2025/pages/location_swiper_page.dart';
import 'package:dracat_hacknarok_2025/utils/map_utils.dart';
import 'package:flutter/material.dart';

import 'package:flutter/services.dart' show rootBundle;

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

  static const List<String> llmSummaries = [
    // 1. Generally positive, but crowded
    "Generally positive, but crowded: Most visitors are delighted by the beauty of this place, especially emphasizing the incredible views and architecture. However, a common observation is the huge number of tourists, particularly during peak season, which can make sightseeing difficult and spoil the atmosphere. High prices are also frequently mentioned.",

    // 2. Mixed feelings - beauty vs. infrastructure
    "Mixed feelings - beauty vs. infrastructure: Tourists unanimously praise the natural assets and unique monuments of this place. On the other hand, many negative reviews concern poor infrastructure – access problems, a lack of sufficient restaurants or restrooms, and inadequate cleanliness in some areas.",

    // 3. Ideal for those seeking peace
    "Ideal for those seeking peace: This place receives enthusiastic reviews from people who value tranquility, authenticity, and contact with nature. Users highlight the lack of crowds, the local atmosphere, and the opportunity for genuine relaxation. Some point out the absence of typical 'tourist attractions,' which is a disadvantage for some but an advantage for others.",

    // 4. Overpriced and commercial
    "Overpriced and commercial: Reviews indicating disappointment are dominant. Many tourists feel the place is overhyped, too expensive, and solely profit-driven. They complain about crowds, pushy vendors, and a lack of authentic character, labeling it a 'tourist trap'.",

    // 5. Great value for money
    "Great value for money: Visitors are generally very satisfied, mainly because of the affordable prices. They praise inexpensive accommodation, tasty and reasonably priced food, and numerous free or low-cost attractions. They stress that it's an excellent choice for budget-conscious travelers, though some mention that service standards might be slightly lower.",

    // 6. Praise for history and atmosphere
    "Praise for history and atmosphere: Reviews are overwhelmingly positive, with tourists especially appreciating the rich history, well-preserved monuments, and unique atmosphere. Many highlight the charming old town and the feeling of 'stepping back in time.' Occasionally, remarks arise about the need for renovation in some buildings.",

    // 7. Paradise for the active
    "Paradise for the active: The place earns high marks, especially from those who enjoy active recreation. Numerous hiking and biking trails, opportunities for water sports, and beautiful scenery are praised. Users point out the good sports and recreational infrastructure.",

    // 8. Positive, but with comments on cleanliness
    "Positive, but with comments on cleanliness: The overall perception of the place is good; tourists appreciate its charm and attractions. However, a recurring theme in reviews involves concerns about cleanliness – littered streets, overflowing bins, or neglected green spaces, which somewhat detracts from the overall impression.",

    // 9. Family idyll
    "Family idyll: Many users, particularly families with children, rate this place very highly. They emphasize safety, the availability of attractions for children (playgrounds, theme parks, gentle beaches), and the overall friendly atmosphere. They point out good accommodation and dining facilities suited to family needs.",

    // 10. One main attraction 'does the job'
    "One main attraction 'does the job': Opinions on the overall experience are mixed, but nearly everyone is impressed by one specific main attraction (e.g., an impressive castle, a unique museum, a spectacular national park). Visitors often come primarily for this single highlight, finding the rest less interesting or underdeveloped."
  ];

  int calculateSeed(String name) {
    int seed = 0;
    for (int i = 0; i < name.length; i++) {
      seed += name.codeUnitAt(i) * (i + 1);
    }
    return seed;
  }

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
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              if (widget.isReached)
                Text(
                  "You have reached:",
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
              if (widget.isReached)
                Text(
                  widget.locationName,
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
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
                            style: TextStyle(fontSize: 16),
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
                        "AI Summary of reviews:",
                        style: Theme.of(context).textTheme.headlineSmall,
                      ),
                    ),
                    SizedBox(
                      width: 400,
                      child: Text(
                        llmSummaries[Random(calculateSeed(widget.locationName)).nextInt(llmSummaries.length)],
                        softWrap: true,
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        "People who reached this location.",
                        style: Theme.of(context).textTheme.headlineSmall,
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
                                image: AssetImage("assets/influencer.gif"),
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
