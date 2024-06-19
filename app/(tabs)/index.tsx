import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsMap from "@/components/ListingsMap";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import { AirbnbList } from "../interfaces/airbnb_list";
import listingData from "@/assets/data/barcelona-listings.json";

const Page = () => {
  const [category, setCategory] = useState("Home/Apt");
  const onCategoryChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            header: () => (
              <ExploreHeader onCategoryChanged={onCategoryChanged} />
            ),
          }}
        />
        <ListingsMap listingData={listingData as AirbnbList[]} />
        <ListingsBottomSheet category={category} />
      </GestureHandlerRootView>
    </View>
  );
};

export default Page;
