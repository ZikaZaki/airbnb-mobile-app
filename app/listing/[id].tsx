import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  // put a log statement for id
  console.log(" ~ file: [id].tsx:7 ~ Page ~ id:", id);
  return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

export default Page;
