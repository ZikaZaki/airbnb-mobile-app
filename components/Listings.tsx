import {
  View,
  Text,
  ListRenderItem,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { FlatList, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import Colors from "@/constants/Colors";

interface ListingsProps {
  items: AirbnbList[];
  category: string;
}

const Listings: React.FC<ListingsProps> = ({ items, category }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AirbnbList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<FlatList<AirbnbList>>(null);
  const [showButtonToTop, setShowButtonToTop] = useState(false);

  useEffect(() => {
    loadInitialItems();
    console.log("items: ", data.length);
    setTimeout(() => {
      setIsLoading(false);
    }, 200);
  }, [category]);

  const loadInitialItems = useCallback(() => {
    setIsLoading(true);
    setData(items.slice(0, 20));
    setIsLoading(false);
  }, [items]);

  const loadMoreData = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    setCurrentPage(currentPage + 1);
    const startIndex = (currentPage - 1) * 20;
    const endIndex = startIndex + 20;
    setData((prevData) => [...prevData, ...items.slice(startIndex, endIndex)]);
  }, [isLoading, currentPage, items]);

  const renderRow: ListRenderItem<AirbnbList> = ({ item }) => (
    <Animated.View
      style={styles.listing}
      entering={FadeInRight}
      exiting={FadeOutLeft}
    >
      <Link href={`/listing/${item.id}`} key={item.id + item.host_id} asChild>
        <TouchableOpacity>
          <Image source={{ uri: item.picture_url }} style={styles.image} />
          <TouchableOpacity style={styles.likeBtn}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.imageAfter} />
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
              height: 12.5,
              width: 12.5,
              backgroundColor: "#FF5A5F",
              borderRadius: 6.25,
            }}
          />
        </View>
      </View>

      <View style={styles.details}>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "mon-sb",
            width: "100%",
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 4,
          }}
        >
          <Text style={{ fontFamily: "mon-sb", color: Colors.grey }}>
            Accommodates: {item.accommodates}
          </Text>

          <View style={{ flexDirection: "row", gap: 2 }}>
            <Text style={{ fontFamily: "mon-sb", color: Colors.grey }}>
              Rating:{" "}
            </Text>
            <Ionicons name="star" size={16} />
            <Text style={{ fontFamily: "mon-sb" }}>
              {item.review_scores_value}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  const renderFooter = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const maxOffset =
      event.nativeEvent.contentSize.height -
      event.nativeEvent.layoutMeasurement.height;

    setShowButtonToTop(currentOffset > 900);
  };

  return (
    <View style={defaultStyles.container}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        initialNumToRender={5}
        maxToRenderPerBatch={15}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        windowSize={5}
        onScroll={handleScroll}
        style={{ flex: 1, margin: 10, paddingHorizontal: 6 }}
      />
      {showButtonToTop && (
        <TouchableOpacity onPress={scrollToTop} style={styles.scrollTopBtn}>
          <Ionicons name="arrow-up" style={{ color: "white" }} size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  listing: {
    flexDirection: "column",
    gap: 6,
    height: 386,
    marginVertical: 12,
    borderRadius: 18,
  },
  image: {
    width: "100%",
    height: 300,
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
    top: -164,
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
    shadowOpacity: 1, // This makes the shadow visible
    shadowRadius: 0, // This makes the shadow sharp, not blurred
  },
  price: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "#FF5A5F",
    // backgroundColor: "#FF9194",
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
    shadowOpacity: 1, // This makes the shadow visible
    shadowRadius: 0, // This makes the shadow sharp, not blurred
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
  scrollTopBtn: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: "#FF5A5F",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 26,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 6,
  },
});


export default Listings;
