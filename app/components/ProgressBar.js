//@flow
import React from "react";
import { View } from "react-native";

type Props = {
  barColor: string,
  progress: number,
  backgroundColor?: string,
  barStyle?: any
};

const ProgressBar = ({
  barColor,
  progress,
  backgroundColor,
  barStyle
}: Props) => (
  <View style={{ backgroundColor }}>
    <View
      style={[
        {
          backgroundColor: barColor,
          width: `${progress * 100}%`
        },
        barStyle
      ]}
    />
  </View>
);

export default ProgressBar;
