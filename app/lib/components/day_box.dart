import 'package:flutter/material.dart';

@immutable
class DayBox extends StatelessWidget {
  const DayBox({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 250,
      height: 400,
      decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(25),
          color: Colors.white,
          boxShadow: const [
            BoxShadow(
              offset: Offset(17, 17),
              blurRadius: 32,
              color: Color(0x25000000),
            ),
            BoxShadow(
              offset: Offset(-17, -17),
              blurRadius: 32,
              color: Color(0x09000000),
            )
          ]),
    );
  }
}
