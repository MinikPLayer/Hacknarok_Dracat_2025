import 'package:dracat_hacknarok_2025/providers/mock_user_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_joystick/flutter_joystick.dart';
import 'package:latlong2/latlong.dart';

class MapDemoMenuComponent extends StatefulWidget {
  final MockUserProvider userProvider;

  const MapDemoMenuComponent({super.key, required this.userProvider});

  @override
  State<MapDemoMenuComponent> createState() => _MapDemoMenuComponentState();
}

class _MapDemoMenuComponentState extends State<MapDemoMenuComponent> {
  bool isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.end,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (isExpanded)
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
                          SwitchListTile(
                            title: const Text("Force mock location"),
                            value: widget.userProvider.forceMockLocation,
                            onChanged: (v) {
                              setState(() {
                                var curRealLocation = widget.userProvider.currentRealLocation ?? LatLng(0, 0);
                                widget.userProvider.forceMockLocation = v;
                                widget.userProvider.setUserMockLocation(curRealLocation);
                              });
                            },
                          ),
                          if (widget.userProvider.forceMockLocation)
                            Joystick(listener: (v) {
                              var curMockLocation = widget.userProvider.currentMockLocation;
                              if (curMockLocation != null) {
                                widget.userProvider.setUserMockLocation(
                                  LatLng(
                                      curMockLocation.latitude - v.y * 0.001, curMockLocation.longitude + v.x * 0.001),
                                );
                              } else {
                                widget.userProvider
                                    .setUserMockLocation(widget.userProvider.currentRealLocation ?? LatLng(0, 0));
                              }
                            })
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
              child: isExpanded ? const Icon(Icons.arrow_drop_down) : const Icon(Icons.arrow_drop_up),
              onPressed: () {
                setState(() {
                  isExpanded = !isExpanded;
                });
              },
            ),
          ],
        ),
      ],
    );
  }
}
