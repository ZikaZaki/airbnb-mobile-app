import { View } from "react-native";
import React, { useMemo, useState } from "react";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Listings from "@/components/Listings";
import listingData from "@/assets/data/barcelona-listings.json";
import { AirbnbList } from "../interfaces/airbnb_list";

const Page = () => {
  const [category, setCategory] = useState("Home/Apt");
  // const items = useMemo(() => listingData as any, []);
  const items = useMemo(() => {
    return (listingData as AirbnbList[]).filter(
      (item) => item.room_type === category
    );
  }, [category]);

  const onDataChanged = (category: string) => {
    // console.log("CHANGED_ ", category);
    setCategory(category);
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      <Listings items={items} category={category} />
    </View>
  );
};

export default Page;
