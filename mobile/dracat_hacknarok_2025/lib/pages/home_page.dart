import 'package:flutter/material.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text(
        "Welcome to the Home Page!",
        style: Theme.of(context).textTheme.headlineLarge,
      ),
    );
  }
}
