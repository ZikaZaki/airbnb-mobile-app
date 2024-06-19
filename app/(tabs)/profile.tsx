import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

const Page = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [email, setEmail] = useState(
    user?.emailAddresses[0].emailAddress ?? ""
  );
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName ?? "");
    setLastName(user.lastName ?? "");
    setEmail(user.emailAddresses[0].emailAddress ?? "");
  }, [user]);

  const onSaveUser = async () => {
    try {
      await user?.update({
        firstName,
        lastName,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setEdit(false);
    }
  };

  const onCaptureImage = async () => {};

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
        <Ionicons name="notifications-outline" size={26} />
      </View>

      {user && (
        <View style={styles.card}>
          <TouchableOpacity onPress={onCaptureImage}>
            <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {edit ? (
              <View style={styles.editRow}>
                <TextInput
                  style={[defaultStyles.inputField]}
                  placeholder="First name"
                  value={firstName || ""}
                  onChangeText={setFirstName}
                />
                <TextInput
                  style={[defaultStyles.inputField]}
                  placeholder="Last name"
                  value={lastName || ""}
                  onChangeText={setLastName}
                />
                <TouchableOpacity onPress={onSaveUser}>
                  <Ionicons
                    name="checkmark-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.editRow}>
                <Text style={{ fontFamily: "mon-sb", fontSize: 22 }}>
                  {firstName} {lastName}
                </Text>
                <TouchableOpacity onPress={() => setEdit(true)}>
                  <Ionicons
                    name="create-outline"
                    size={24}
                    color={Colors.dark}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <Text>{email}</Text>
          <Text>Since {user?.createdAt?.toLocaleDateString()}</Text>
        </View>
      )}

      {isSignedIn && (
        <Button title="Log out" color={Colors.dark} onPress={() => signOut()} />
      )}

      {!isSignedIn && (
        <Link href={"/(modals)/login"} asChild>
          <Button title="Log In" color={Colors.dark} />
        </Link>
      )}
    </SafeAreaView>
  );
};

export default Page;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 24,
  },
  headerText: {
    fontFamily: "mon-b",
    fontSize: 24,
  },
  card: {
    backgroundColor: "#fff",
    alignItems: "center",
    gap: 14,
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    marginBottom: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    height: 60,
  },
});
