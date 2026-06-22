import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Mapa() {
  if (Platform.OS === "web") {
    return (
      <View style={styles.container}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.123456789!2d-48.2772!3d-18.9186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a4451f1b12345%3A0x123456789abcdef!2sUberl%C3%A2ndia%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1718200000000!5m2!1spt-BR!2sbr"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        source={{
          uri: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.123456789!2d-48.2772!3d-18.9186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94a4451f1b12345%3A0x123456789abcdef!2sUberl%C3%A2ndia%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1718200000000!5m2!1spt-BR!2sbr",
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
