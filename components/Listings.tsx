import {
  View,
  Text,
  ListRenderItem,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { defaultStyles } from "@/constants/Styles";
import { FlatList } from "react-native";
import { Link } from "expo-router";

interface ListingsProps {
  items: any[];
  category: string;
}

const Listings: React.FC<ListingsProps> = ({ items, category }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const listRef = useRef<FlatList<any>>(null);

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
  const renderRow: ListRenderItem<any> = ({ item }) => (
    <Link href={`/listing/${item.id}`} key={item.id}>
      Go there
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

  return (
    <View style={defaultStyles.container}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        windowSize={3}
        style={{ flex: 1, margin: 10 }}
      />
      <Text>Listings</Text>
      <TouchableOpacity
        onPress={scrollToTop}
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "blue",
          paddingVertical: 12,
          paddingHorizontal: 16,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "white" }}>Scroll to Top</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Listings;
