// import { useEffect } from "react";
// import { Platform } from "react-native";
// import * as WebBrowser from "expo-web-browser";

// export const useWarmUpBrowser = () => {
//   useEffect(() => {
//     void WebBrowser.warmUpAsync();
//     return () => {
//       void WebBrowser.coolDownAsync();
//     };
//   }, []);
// };
import { useEffect } from "react";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

export const useWarmUpBrowser = () => {
  useEffect(() => {
    const warmUpBrowser = async () => {
      if (Platform.OS !== "web") {
        try {
          await WebBrowser.warmUpAsync();
        } catch (error) {
          console.error("Error warming up browser:", error);
        }
      }
    };

    const coolDownBrowser = async () => {
      if (Platform.OS !== "web") {
        try {
          await WebBrowser.coolDownAsync();
        } catch (error) {
          console.error("Error cooling down browser:", error);
        }
      }
    };

    warmUpBrowser();

    return () => {
      coolDownBrowser();
    };
  }, []);
};
