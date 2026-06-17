import 'package:flutter/material.dart';
import 'theme/tokens.dart';

void main() {
  runApp(const MrFoxApp());
}

class MrFoxApp extends StatelessWidget {
  const MrFoxApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FOXY',
      theme: FoxTokens.lightTheme,
      home: const HomeScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('🦊 FOXY')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Creator Platform Engine',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                    color: FoxTokens.foxCharcoal,
                  ),
            ),
            const SizedBox(height: 8),
            const Text(
              'Flutter mobile app — connects to Engine API at /api/v1',
              style: TextStyle(color: FoxTokens.foxSlate),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () {},
              child: const Text('Explore Creators'),
            ),
          ],
        ),
      ),
    );
  }
}
