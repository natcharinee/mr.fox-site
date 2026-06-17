/// Design tokens shared with web — see /DESIGN.md
import 'package:flutter/material.dart';

class FoxTokens {
  static const Color foxOrange = Color(0xFFF97316);
  static const Color foxOrangeDark = Color(0xFFEA580C);
  static const Color foxCharcoal = Color(0xFF1C1917);
  static const Color foxSlate = Color(0xFF64748B);

  static const double radiusSm = 6;
  static const double radiusMd = 10;
  static const double radiusLg = 16;

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: foxOrange,
      brightness: Brightness.light,
    ),
    fontFamily: 'Prompt',
    appBarTheme: const AppBarTheme(
      backgroundColor: foxCharcoal,
      foregroundColor: Colors.white,
      elevation: 0,
    ),
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: foxOrange,
        foregroundColor: Colors.white,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusMd),
        ),
      ),
    ),
  );
}
