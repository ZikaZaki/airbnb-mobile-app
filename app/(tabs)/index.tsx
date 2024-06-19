import React, { useMemo, useState } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import ExploreHeader from "@/components/ExploreHeader";
import Listings from "@/components/Listings";
import listingData from "@/assets/data/barcelona-listings.json";
import listingsGeoData from "@/assets/data/barcelona.geo.json";
import { AirbnbList } from "../interfaces/airbnb_list";
import ListingsMap from "@/components/ListingsMap";

const Page = () => {
  const [category, setCategory] = useState("Home/Apt");
  const items = useMemo(() => {
    return (listingData as AirbnbList[]).filter(
      (item) => item.property_type === category
    );
  }, [category]);

  const onDataChanged = (category: string) => {
    setCategory(category);
  };

  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Stack.Screen
        options={{
          header: () => <ExploreHeader onCategoryChanged={onDataChanged} />,
        }}
      />
      {/* <Listings items={items} category={category} /> */}
      <ListingsMap listingData={listingData as AirbnbList[]} />
    </View>
  );
};

export default Page;
