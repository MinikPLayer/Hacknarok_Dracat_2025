import 'package:dracat_hacknarok_2025/utils/map_utils.dart';
import 'package:flutter/material.dart';

class LocationDetailsComponent extends StatelessWidget {
  final OSRMWaypoint location;
  final Function onBackPressed;

  const LocationDetailsComponent({super.key, required this.location, required this.onBackPressed});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(location.name ?? "Location Details"),
        leading: IconButton(onPressed: () => onBackPressed(), icon: const Icon(Icons.arrow_back)),
      ),
      body: Center(
        child: Text('Location Details for ${location.name}'),
      ),
    );
  }
}
