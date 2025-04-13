import 'package:dracat_hacknarok_2025/dialogs/location_mode_dialog.dart';
import 'package:dracat_hacknarok_2025/pages/map_page.dart';
import 'package:dracat_hacknarok_2025/pages/location_swiper_page.dart';
import 'package:dracat_hacknarok_2025/providers/mock_location_provider.dart';
import 'package:dracat_hacknarok_2025/providers/mock_trip_provider.dart';
import 'package:dracat_hacknarok_2025/providers/mock_user_provider.dart';
import 'package:flutter/material.dart';
import 'package:intl/date_symbol_data_file.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  var locationProvider = MockLocationProvider();
  var userProvider = MockUserProvider();
  var tripProvider = MockTripProvider();

  var userAwait = userProvider.init();
  var tripAwait = tripProvider.init();

  await userAwait;
  await tripAwait;

  runApp(MyApp(
    locationProvider: locationProvider,
    userProvider: userProvider,
    tripProvider: tripProvider,
  ));
}

class MyApp extends StatelessWidget {
  final MockLocationProvider locationProvider;
  final MockUserProvider userProvider;
  final MockTripProvider tripProvider;

  static const String appTitle = '9 stron światów';

  const MyApp({super.key, required this.locationProvider, required this.userProvider, required this.tripProvider});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: appTitle,
      theme: ThemeData.light(),
      darkTheme: ThemeData.dark(),
      themeMode: ThemeMode.system,
      home: MultiProvider(
        providers: [
          ChangeNotifierProvider<MockLocationProvider>(
            create: (context) => locationProvider,
          ),
          ChangeNotifierProvider<MockUserProvider>(
            create: (context) => userProvider,
          ),
          ChangeNotifierProvider<MockTripProvider>(
            create: (context) => tripProvider,
          ),
        ],
        child: const MyHomePage(title: appTitle),
      ),
    );
  }
}

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    var userProvider = Provider.of<MockUserProvider>(context, listen: true);
    if (userProvider.getAllowLocationStatus() == null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        showDialog(
          context: context,
          builder: (context) => LocationModeDialog(
            userProvider: userProvider,
          ),
        );
      });

      return Scaffold(
        body: const Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Padding(
                padding: EdgeInsets.all(8.0),
                child: Text("Waiting for user interaction..."),
              ),
              CircularProgressIndicator(),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      body: Center(child: LocationSwiperPage()),
    );
  }
}
