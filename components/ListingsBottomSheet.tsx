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
  const snapPoints = useMemo(() => ["8%", "100%"], []);
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
    bottomSheetRef.current?.expand();
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
      <View style={styles.listHeader}>
        <Text
          style={{
            textAlign: "center",
            fontFamily: "mon-sb",
            fontSize: 14,
            color: "#333",
          }}
        >
          {items?.length} Homes
        </Text>
      </View>
      <View style={[defaultStyles.container, { paddingHorizontal: 16 }]}>
        <BottomSheetFlatList
          ref={bottomSheetListRef}
          data={data}
          renderItem={RenderRow}
          keyExtractor={(item: AirbnbList) => `${item.id + item.host_id}`}
          windowSize={6}
          initialNumToRender={15}
          maxToRenderPerBatch={20}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          onScrollEndDrag={handleScroll}
        />
      </View>
      <View style={styles.absoluteBtn}>
        <TouchableOpacity style={styles.btn} onPress={showMap}>
          <Text style={{ fontFamily: "mon-sb", fontSize: 14, color: "#fff" }}>
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
    </BottomSheet>
  );
};

export default ListingsBottomSheet;

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: "#fff",
    borderRadius: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
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
    paddingBottom: 18,
    paddingHorizontal: 12,
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
    bottom: 32,
    right: 23,
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
