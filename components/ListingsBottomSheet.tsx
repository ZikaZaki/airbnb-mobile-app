import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";
import Listings from "./Listings";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import listingData from "@/assets/data/barcelona-listings.json";

interface Props {
  category: string;
}

const ListingsBottomSheet = ({ category }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const items = useMemo(() => {
    return (listingData as AirbnbList[]).filter(
      (item) => item.property_type === category
    );
  }, [category]);

  useEffect(() => {
    if (items.length > 0) {
      setIsLoading(false);
    }
  }, []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["5%", "100%"], []);

  const showMap = () => {
    bottomSheetRef.current?.collapse();
  };

  return (
    <BottomSheet
      style={styles.sheetContainer}
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      handleIndicatorStyle={{ backgroundColor: Colors.grey }}
    >
      {isLoading ? (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            zIndex: 49,
          }}
        >
          <ActivityIndicator size="large" color="#FF5A5F" />
          <Text
            style={{
              fontFamily: "mon-sb",
              fontSize: 14,
              color: "grey",
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Listings items={items} category={category} />
          <View style={styles.absoluteBtn}>
            <TouchableOpacity style={styles.btn} onPress={showMap}>
              <Text
                style={{ fontFamily: "mon-sb", fontSize: 14, color: "#fff" }}
              >
                Map
              </Text>
              <Ionicons name="map" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </BottomSheet>
  );
};

export default ListingsBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "#fff",
    borderRadius: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  absoluteBtn: {
    position: "absolute",
    alignItems: "center",
    bottom: 30,
    width: "100%",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: Colors.dark,
    opacity: 0.8,
  },
});
