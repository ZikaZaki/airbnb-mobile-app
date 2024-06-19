import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useMemo, useRef } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import Listings from "./Listings";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

interface Props {
  listingData: AirbnbList[];
  category: string;
}

const ListingsBottomSheet = ({ listingData, category }: Props) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["6%", "100%"], []);

  const showMap = () => {};

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.grey }}
    >
      <View style={{ flex: 1 }}>
        <Listings items={listingData} category={category} />
        <View style={styles.absoluteBtn}>
          <TouchableOpacity style={styles.btn} onPress={showMap}>
            <Text>Map</Text>
            <Ionicons name="map" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </BottomSheet>
  );
};

export default ListingsBottomSheet;

const styles = StyleSheet.create({
  absoluteBtn: {
    position: "absolute",
    alignItems: "center",
    bottom: 30,
    width: "100%",
  },
  btn: {
    backgroundColor: Colors.dark,
  },
});
