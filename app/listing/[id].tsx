import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import listingData from "@/assets/data/barcelona-listings.json";
import Animated, {
  interpolate,
  SlideInDown,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";

const IMG_HEIGHT = 300;
const { width } = Dimensions.get("window");

const Page = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = (listingData as AirbnbList[]).find(
    (item) => item.id.toString() === id
  );
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const [imageLoading, setImageLoading] = useState(true);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollOffset.value,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingBottom: 100 }}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          {imageLoading && (
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 10,
                backgroundColor: "grey",
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
          <Animated.Image
            source={{ uri: item?.picture_url }}
            onLoad={() => setImageLoading(false)}
            onError={() => setImageLoading(false)}
            style={[styles.image, imageAnimatedStyle]}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item?.name}</Text>
          <Text style={styles.location}>
            {item?.room_type} in {item?.host_location}
          </Text>
          <View style={styles.rooms}>
            <Text style={styles.roomsText}>{item?.bedrooms} bedrooms</Text>
            <Text
              style={{ fontSize: 16, fontFamily: "mon", color: "lightgrey" }}
            >
              |
            </Text>
            <Text style={styles.roomsText}>{item?.beds} beds</Text>
            <Text
              style={{ fontSize: 16, fontFamily: "mon", color: "lightgrey" }}
            >
              |
            </Text>
            <Text style={styles.roomsText}>{item?.bathrooms} bathrooms</Text>
          </View>
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

      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(300)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity style={styles.footerText}>
            <Text style={styles.footerPrice}>
              {item?.price ? item.price : "Price: N/A"}
            </Text>
            {item?.price && <Text style={{ fontSize: 16 }}>night</Text>}
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.btn, { paddingHorizontal: 24 }]}
          >
            <Text style={defaultStyles.btnText}>Reserve</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    height: IMG_HEIGHT,
    width,
  },
  image: {
    height: "100%",
    width: "100%",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
  },
  roomsText: {
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
  footerText: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    height: "100%",
  },
  footerPrice: {
    fontSize: 18,
    fontFamily: "mon-sb",
  },
});
