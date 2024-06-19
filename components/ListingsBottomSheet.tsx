import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import {
  View,
  Text,
  ListRenderItem,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { defaultStyles } from "@/constants/Styles";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetFlatListMethods,
} from "@gorhom/bottom-sheet";
import ListingItem from "./ListingItem";
import { AirbnbList } from "@/app/interfaces/airbnb_list";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import listingData from "@/assets/data/barcelona-listings.json";

interface Props {
  category: string;
}

const ListingsBottomSheet = ({ category }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AirbnbList[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const snapPoints = useMemo(() => ["10%", "100%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetListRef = useRef<BottomSheetFlatListMethods>(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);

  const items = useMemo(() => {
    return (listingData as AirbnbList[]).filter(
      (item) => item.property_type === category
    );
  }, [category]);

  useEffect(() => {
    loadInitialItems();
    scrollToTop(false);
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

  const ListFooterComponent = () => {
    if (isLoading) {
      return (
        <View style={{ padding: 10 }}>
          <ActivityIndicator />
        </View>
      );
    }
    return null;
  };

  const ListHeaderComponent = () => {
    return (
      <View style={styles.listHeader}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "mon-sb",
            fontSize: 14,
            color: "#333",
          }}
        >
          {items.length} Homes
        </Text>
      </View>
    );
  };

  const scrollToTop = (animated = true) => {
    if (bottomSheetListRef.current) {
      bottomSheetListRef.current?.scrollToOffset({
        offset: 0,
        animated: animated,
      });
      setShowScrollToTopButton(false);
    }
  };

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const currentOffset = event.nativeEvent.contentOffset.y;

      setShowScrollToTopButton(currentOffset > 900);
    },
    []
  );

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
          {/* <Listings items={items} category={category} /> */}
          <View style={defaultStyles.container}>
            <BottomSheetFlatList
              style={{ flex: 1, margin: 10, paddingHorizontal: 6 }}
              ref={bottomSheetListRef}
              data={data}
              renderItem={RenderRow}
              keyExtractor={(item: AirbnbList) => `${item.id + item.host_id}`}
              windowSize={5}
              initialNumToRender={5}
              maxToRenderPerBatch={15}
              onEndReached={loadMoreData}
              onEndReachedThreshold={0.5}
              ListFooterComponent={ListFooterComponent}
              ListHeaderComponent={ListHeaderComponent}
              onScrollEndDrag={handleScroll}
            />
          </View>
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
          {showScrollToTopButton && (
            <TouchableOpacity
              onPress={() => scrollToTop()}
              style={styles.scrollTopBtn}
            >
              <Ionicons name="arrow-up" style={{ color: "white" }} size={24} />
            </TouchableOpacity>
          )}
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
  listHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    padding: 6,
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
