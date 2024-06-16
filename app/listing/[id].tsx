import { View, Text, StyleSheet, Dimensions, Image } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import listingData from "@/assets/data/barcelona-listings.json";
import Animated from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = (listingData as AirbnbList[]).find(
    (item) => item.id.toString() === id
  );
  // put a log statement for id
  console.log(" ~ file: [id].tsx:7 ~ Page ~ id:", id);
  return (
    <View style={styles.container}>
      <Animated.ScrollView>
        <Animated.Image
          source={{ uri: item?.picture_url }}
          style={styles.image}
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.location}>
            {item?.room_type} in {item?.host_location}
          </Text>
          <Text style={styles.rooms}>{item?.accommodates} accommodates. {item?.bedrooms} bedrooms. {item?.beds} beds. {item?.bathrooms} bathrooms</Text>
          <View style={{ flexDirection: "row", gap: 4 }}>
            <Ionicons name="star" size={16} />
            <Text style={styles.ratings}>
              {item?.review_scores_rating} . {item?.number_of_reviews} reviews
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.hostView}>
            <Image
              source={{ uri: item?.host_thumbnail_url }}
              style={styles.host}
            />

            <View>
              <Text style={{ fontWeight: "500", fontSize: 16 }}>
                Hosted by {item?.host_name}
              </Text>
              <Text>Host since {item?.host_since}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.description}>{item?.description}</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    height: IMG_HEIGHT,
    width,
  },
  infoContainer: {
    padding: 24,
    backgroundColor: "white",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "mon-sb",
  },
  location: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: "mon-sb",
  },
  rooms: {
    fontSize: 16,
    color: Colors.grey,
    fontFamily: "mon",
  },
  ratings: {
    fontSize: 16,
    fontFamily: "mon-sb",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.grey,
    marginVertical: 16,
  },
  host: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  hostView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  description: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: "mon",
  },
});
export default Page;
