import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "expo-blur";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
} from "react-native-reanimated";
import { defaultStyles } from "@/constants/Styles";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import DatePicker from "react-native-modern-datepicker";
import Colors from "@/constants/Colors";
import { places } from "@/assets/data/places";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const guestsGroups = [
  {
    name: "Adults",
    text: "Ages 13 or above",
    count: 1,
  },
  {
    name: "Children",
    text: "Age 2-12",
    count: 0,
  },
  {
    name: "Infants",
    text: "Ages under 2",
    count: 0,
  },
  {
    name: "Pets",
    text: "Pets allowed",
    count: 0,
  },
];

const Page = () => {
  const router = useRouter();
  const [openCard, setOpenCard] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState(0);
  const today = new Date().toISOString().substring(0, 10);
  const [groups, setGroups] = useState(guestsGroups);

  const onClearAll = () => {
    setOpenCard(0);
    setSelectedPlace(0);
    setGroups(guestsGroups);
  };

  const onGuestsChanged = (index: number, count: number) => {
    setGroups((prev) => {
      const newGroups = [...prev];
      newGroups[index].count = count;
      return newGroups;
    });
  };

  return (
    <BlurView intensity={70} tint="light" style={styles.container}>
      {/* Where */}
      <View style={styles.card}>
        {openCard != 0 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(0)}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.cardPreview}
          >
            <Text style={styles.previewText}>Where</Text>
            <Text style={styles.previewDate}>I'm flexible</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 0 && (
          <>
            <Animated.Text style={styles.cardHeader} entering={FadeIn}>
              Where to?
            </Animated.Text>
            <Animated.View style={styles.cardBody}>
              <View style={styles.searchSection}>
                <Ionicons name="search" size={20} style={styles.searchIcon} />
                <TextInput
                  style={styles.inputField}
                  placeholder="Search destination"
                  placeholderTextColor={Colors.grey}
                />
              </View>
            </Animated.View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 24,
                paddingLeft: 20,
                marginBottom: 30,
              }}
            >
              {places.map((place, index) => (
                <TouchableOpacity
                  key={place.title + index}
                  onPress={() => setSelectedPlace(index)}
                  style={{
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <Image
                    source={place.img}
                    style={
                      selectedPlace === index
                        ? styles.placeSelected
                        : styles.place
                    }
                  />
                  <Text
                    style={[
                      { paddingTop: 6 },
                      selectedPlace === index
                        ? { fontFamily: "mon-sb" }
                        : { fontFamily: "mon" },
                    ]}
                  >
                    {place.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
      </View>

      {/* When */}
      <View style={styles.card}>
        {openCard != 1 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(1)}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.cardPreview}
          >
            <Text style={styles.previewText}>When</Text>
            <Text style={styles.previewDate}>Any week</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 1 && (
          <>
            <Animated.Text style={styles.cardHeader} entering={FadeIn}>
              When's your trip?
            </Animated.Text>
            <Animated.View style={styles.cardBody}>
              <DatePicker
                current={today}
                selected={today}
                mode={"calendar"}
                options={{
                  defaultFont: "mon",
                  headerFont: "mon-sb",
                  borderColor: "transparent",
                  mainColor: Colors.primary,
                }}
              />
            </Animated.View>
          </>
        )}
      </View>

      {/* Who */}
      <View style={styles.card}>
        {openCard !== 2 && (
          <AnimatedTouchableOpacity
            onPress={() => setOpenCard(2)}
            entering={FadeIn.duration(200)}
            exiting={FadeOut.duration(200)}
            style={styles.cardPreview}
          >
            <Text style={styles.previewText}>Who</Text>
            <Text style={styles.previewDate}>Add guests</Text>
          </AnimatedTouchableOpacity>
        )}

        {openCard === 2 && (
          <>
            <Animated.Text style={styles.cardHeader} entering={FadeIn}>
              Who's coming?
            </Animated.Text>
            <Animated.View style={styles.cardBody}>
              {groups.map((item, index) => (
                <View
                  key={item.name + index}
                  style={[
                    styles.guestItem,
                    index + 1 < groups.length ? styles.guestItemBorder : null,
                  ]}
                >
                  <View>
                    <Text style={{ fontFamily: "mon-sb", fontSize: 14 }}>
                      {item.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "mon",
                        fontSize: 14,
                        color: Colors.grey,
                      }}
                    >
                      {item.text}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => onGuestsChanged(index, item.count - 1)}
                      disabled={
                        (item.name === "Adults" && item.count === 1) ||
                        item.count === 0
                      }
                    >
                      <Ionicons
                        name="remove-circle-outline"
                        size={26}
                        color={
                          (item.name === "Adults" && item.count === 1) ||
                          item.count === 0
                            ? "lightgrey"
                            : Colors.grey
                        }
                      />
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontFamily: "mon",
                        fontSize: 16,
                        minWidth: 20,
                        textAlign: "center",
                      }}
                    >
                      {item.count}
                    </Text>
                    <TouchableOpacity
                      onPress={() => onGuestsChanged(index, item.count + 1)}
                    >
                      <Ionicons
                        name="add-circle-outline"
                        size={26}
                        color={Colors.grey}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </Animated.View>
          </>
        )}
      </View>

      {/* Footer */}
      <Animated.View
        style={defaultStyles.footer}
        entering={SlideInDown.delay(200)}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <TouchableOpacity
            onPress={onClearAll}
            style={{ justifyContent: "center" }}
          >
            <Text
              style={{
                fontFamily: "mon-sb",
                fontSize: 18,
                textDecorationLine: "underline",
              }}
            >
              Clear all
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[defaultStyles.btn, { paddingRight: 20, paddingLeft: 50 }]}
          >
            <Ionicons
              name="search-outline"
              size={24}
              color={"#fff"}
              style={defaultStyles.btnIcon}
            />
            <Text style={defaultStyles.btnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </BlurView>
  );
};

export default Page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  previewText: {
    fontFamily: "mon-sb",
    fontSize: 18,
    color: "#000",
    padding: 20,
  },
  previewDate: {
    fontFamily: "mon-r",
    fontSize: 14,
    color: "#000",
    padding: 20,
  },
  cardPreview: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
  },
  cardHeader: {
    fontFamily: "mon-sb",
    fontSize: 24,
    padding: 20,
  },
  cardBody: {
    paddingHorizontal: 20,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#fff",
    height: 50,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#ABABAB",
    borderRadius: 10,
  },
  searchIcon: {
    padding: 10,
  },
  inputField: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  place: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  placeSelected: {
    width: 120,
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.grey,
  },
  guestItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  guestItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.grey,
  },
});
