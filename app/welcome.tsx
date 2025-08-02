import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>🎬</Text>
            </View>
            <Text style={styles.appName}>MovieSeat</Text>
            <Text style={styles.tagline}>Book Your Perfect Seat</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={styles.featureText}>Easy Seat Selection</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>⚡</Text>
              <Text style={styles.featureText}>Quick Booking</Text>
            </View>
            <View style={styles.feature}>
              <Text style={styles.featureIcon}>🎭</Text>
              <Text style={styles.featureText}>Best Movies</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => router.push("/movies")}
            activeOpacity={0.8}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
  flex: 1,
  alignItems: "center",
  paddingHorizontal: 30,
  paddingTop: 100,
  paddingBottom: 40,
},
  logoContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  featuresContainer: {
    width: "100%",
    marginVertical: 20,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  featureText: {
    fontSize: 16,
    color: "white",
    fontWeight: "500",
  },
  getStartedButton: {
  backgroundColor: "white",
  paddingHorizontal: 40,
  paddingVertical: 15,
  borderRadius: 30,
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
},
  getStartedText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
  },
});
