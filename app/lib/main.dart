import 'package:flutter/material.dart';
import 'package:safka/components/day_box.dart';

void main() {
  runApp(const AppRoot());
}


class AppRoot extends StatelessWidget {
  const AppRoot({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "Safka Online",
      theme: ThemeData(
        fontFamily: "Montserrat",
        brightness: Brightness.light,
        primaryColor: const Color(0x00ff3535)
      ),
      home: Material(
        child: SafeArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: const [
              SizedBox(
                height: 200,
                child: Text("Safka.\nOnline", style: TextStyle(
                  color: Color(0xffff3535),
                  fontWeight: FontWeight.bold,
                  fontSize: 45
                ),),
              ),
              DayBox()
            ],
          ),
        )
      )
    );
  }
}