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
    setIsLoading(false);
  }, [isLoading, currentPage, items]);

  // const renderItem = ({ item }: { item: any }) => <ListingItem item={item} />;
  const renderRow: ListRenderItem<AirbnbList> = ({ item }) => (
    <Link href={`/listing/${item.id}`} key={item.id + item.host_id} asChild>
      <TouchableOpacity>
        <View style={styles.listing}>
          <Image source={{ uri: item.picture_url }} style={styles.image} />
        </View>
      </TouchableOpacity>
    </Link>
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
        initialNumToRender={10}
        maxToRenderPerBatch={30}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        windowSize={5}
        onScroll={handleScroll}
        style={{ flex: 1, margin: 10 }}
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
    padding: 8,
    marginVertical: 2,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
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
