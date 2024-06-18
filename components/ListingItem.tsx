import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Colors from "@/constants/Colors";

interface ListingItemProps {
  item: AirbnbList;
}

const ListingItem: React.FC<ListingItemProps> = ({ item }) => {
  const [imageLoading, setImageLoading] = useState(true);

  console.log("Rendered Item: ", item.id);

  return (
    <Animated.View
      style={styles.listing}
      entering={FadeInRight}
      exiting={FadeOutLeft}
    >
      <Link href={`/listing/${item.id}`} key={item.id + item.host_id} asChild>
        <TouchableOpacity>
          <View style={styles.imageContainer}>
            {imageLoading && (
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
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
                  Loading image...
                </Text>
              </View>
            )}
            <Image
              style={styles.image}
              source={{
                uri: item.picture_url,
              }}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
            <TouchableOpacity style={styles.likeBtn}>
              <Ionicons name="heart-outline" size={26} color="#FF5A5F" />
            </TouchableOpacity>
            <View style={styles.imageAfter} />
          </View>
        </TouchableOpacity>
      </Link>
      <View style={styles.priceContainer}>
        <View style={styles.priceBefore} />
        <View style={styles.price}>
          <Text style={{ fontFamily: "mon-b", color: "white" }}>
            Price: {item.price ? item.price + "night" : "  N/A"}
          </Text>
        </View>
        <View style={styles.priceAfter}>
          <View
            style={{
              height: 15,
              width: 15,
              backgroundColor: "#FF5A5F",
              borderRadius: 50,
            }}
          />
        </View>
      </View>

      <View style={styles.details}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "mon-sb",
              width: "80%",
            }}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View style={{ flexDirection: "row", gap: 2 }}>
            <Ionicons name="star" size={16} />
            <Text style={{ fontFamily: "mon-sb" }}>
              {item.review_scores_value}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Text style={{ fontFamily: "mon-sb", color: Colors.grey }}>
            Type: {item.room_type}
          </Text>
          <Text style={{ fontFamily: "mon-sb", color: Colors.grey }}>
            Accommodates: {item.accommodates}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

// Optional custom comparison function
const areEqual = (prevProps: ListingItemProps, nextProps: ListingItemProps) => {
  return (
    prevProps.item.id === nextProps.item.id &&
    prevProps.item.host_id === nextProps.item.host_id
  );
};

export default React.memo(ListingItem, areEqual);

const styles = StyleSheet.create({
  listing: {
    flexDirection: "column",
    gap: 6,
    height: 386,
    marginVertical: 12,
    borderRadius: 18,
  },
  imageContainer: {
    position: "relative",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 300,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#EAEAEA",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 18,
    overflow: "hidden",
  },
  imageAfter: {
    position: "absolute",
    left: -4,
    bottom: 50,
    width: 28,
    height: 28,
    borderLeftWidth: 5,
    borderBottomWidth: 5,
    borderBottomStartRadius: 18,
    borderColor: "white",
  },
  likeBtn: {
    position: "absolute",
    padding: 4,
    borderRadius: 50,
    color: "white",
    right: 30,
    top: 30,
  },
  priceContainer: {
    flex: 1,
    flexDirection: "column",
    position: "absolute",
    backgroundColor: "#EAEAEA",
    height: 60,
    width: "50%",
    padding: 8,
    left: 0,
    bottom: 80,
    zIndex: 10,
    borderTopWidth: 6,
    borderRightWidth: 6,
    borderColor: "white",
    borderTopRightRadius: 18,
  },
  priceBefore: {
    position: "absolute",
    borderTopStartRadius: 50,
    width: 25,
    height: 25,
    backgroundColor: "#EAEAEA",
    shadowColor: "white",
    shadowOffset: {
      width: -15,
      height: -5,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  price: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FF5A5F",
    padding: 2,
    height: "100%",
    width: "100%",
    borderRadius: 8,
  },
  priceAfter: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: -25,
    borderRadius: 50,
    width: 25,
    height: 25,
    backgroundColor: "white",
    shadowColor: "#EAEAEA",
    shadowOffset: {
      width: -10,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
  },
  details: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 5,
    padding: 16,
    backgroundColor: "#EAEAEA",
    height: 90,
    borderBottomStartRadius: 18,
    borderBottomEndRadius: 18,
    borderTopEndRadius: 18,
  },
});
