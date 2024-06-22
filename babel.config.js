module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      "babel-preset-expo", // This already includes support for expo-router
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
