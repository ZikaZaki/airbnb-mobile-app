import React, { useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import ListingsBottomSheet from "@/components/ListingsBottomSheet";
import ExploreHeader from "@/components/ExploreHeader";
import ListingsMap from "@/components/ListingsMap";
import { AirbnbList } from "../interfaces/airbnb_list";
import listingData from "@/assets/data/barcelona-listings.json";

const Page = () => {
  const [category, setCategory] = useState("Home/Apt");
  const onCategoryChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, paddingTop: 40 }}>
      {/* Define pour custom header */}
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onCategoryChanged} />,
        }}
      />
      <ListingsMap listingData={listingData as AirbnbList[]} />
      <ListingsBottomSheet category={category} />
    </View>
  );
};

export default Page;
