import 'package:dracat_hacknarok_2025/providers/mock_user_provider.dart';
import 'package:flutter/material.dart';

class LocationModeDialog extends StatelessWidget {
  final MockUserProvider userProvider;

  const LocationModeDialog({super.key, required this.userProvider});

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text("Select location mode"),
      content: const Text("This app supports two location modes: Demo and Real. "
          "Demo mode uses test locations, while Real mode uses the device's GPS. "
          "You can choose to use either one or both."),
      actionsPadding: const EdgeInsets.all(16),
      actionsAlignment: MainAxisAlignment.spaceEvenly,
      actions: [
        TextButton(
          onPressed: () {
            userProvider.setAllowLocation(false);
            Navigator.of(context).pop();
          },
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: const Icon(Icons.gps_off),
              ),
              const Text("Demo only"),
            ],
          ),
        ),
        TextButton(
          onPressed: () {
            userProvider.setAllowLocation(true);
            Navigator.of(context).pop();
          },
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text("Demo + Real"),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: const Icon(Icons.gps_fixed),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
