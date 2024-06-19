import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  ListRenderItem,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import ListingItem from "./ListingItem";
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
  }, [category]);

  const loadInitialItems = useCallback(() => {
    setIsLoading(true);
    const initialData = items.slice(0, 20);
    setData(initialData);
    setIsLoading(false);
  }, [items]);

  const loadMoreData = useCallback(() => {
    if (isLoading) return;
    setIsLoading(true);
    const startIndex = currentPage * 20;
    const endIndex = startIndex + 20;
    const moreData = items.slice(startIndex, endIndex);
    setData((prevData) => [...prevData, ...moreData]);
    setCurrentPage((prevPage) => prevPage + 1);
    setIsLoading(false);
  }, [isLoading, currentPage, items]);

  const RenderRow: ListRenderItem<AirbnbList> = ({ item }) => {
    return <ListingItem item={item} />;
  };

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

    setShowButtonToTop(currentOffset > 900);
  };

  return (
    <View style={defaultStyles.container}>
      {isLoading ? (
        <ActivityIndicator
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
          }}
        />
      ) : (
        <>
          <FlatList
            ref={listRef}
            data={data}
            renderItem={RenderRow}
            keyExtractor={(item) => item.id.toString()}
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
        </>
      )}
    </View>
  );
};

export default Listings;

const styles = StyleSheet.create({
  scrollTopBtn: {
    position: "absolute",
    bottom: 18,
    right: 18,
    backgroundColor: Colors.primary,
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
