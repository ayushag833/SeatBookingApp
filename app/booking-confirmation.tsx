import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingContext } from "../contexts/BookingContext";

export default function BookingConfirmationScreen() {
  const params = useLocalSearchParams();
  const { cancelBooking } = useBookingContext();

  const bookingId = params.bookingId as string;
  const movieTitle = params.movieTitle as string;
  const showtime = params.showtime as string;
  const selectedSeats = (params.selectedSeats as string).split(",").map(Number);
  const totalPrice = Number(params.totalPrice);

  const handleBackToHome = () => {
    router.push("/welcome");
  };

  const handleViewBookings = () => {
    router.push("/bookings-history");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#27ae60" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Success Header */}
        <View style={styles.successHeader}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Your seats have been successfully booked
          </Text>
        </View>

        {/* Booking Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Booking ID</Text>
            <Text style={styles.detailValue}>{bookingId}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Movie</Text>
            <Text style={styles.detailValue}>{movieTitle}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Showtime</Text>
            <Text style={styles.detailValue}>{showtime}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seats</Text>
            <Text style={styles.detailValue}>{selectedSeats.join(", ")}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValue}>₹{totalPrice.toFixed(2)}</Text>
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.sectionTitle}>What's Next?</Text>

          <View style={styles.instructionItem}>
            <View style={styles.instructionIcon}>
              <Text style={styles.instructionNumber}>1</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Arrive Early</Text>
              <Text style={styles.instructionDescription}>
                Please arrive at least 15 minutes before the showtime
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionIcon}>
              <Text style={styles.instructionNumber}>2</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Show Your Booking ID</Text>
              <Text style={styles.instructionDescription}>
                Present this booking ID at the ticket counter
              </Text>
            </View>
          </View>

          <View style={styles.instructionItem}>
            <View style={styles.instructionIcon}>
              <Text style={styles.instructionNumber}>3</Text>
            </View>
            <View style={styles.instructionText}>
              <Text style={styles.instructionTitle}>Enjoy the Movie!</Text>
              <Text style={styles.instructionDescription}>
                Have a great time watching {movieTitle}
              </Text>
            </View>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Important Notice</Text>
          <Text style={styles.noticeText}>
            • Please keep this booking ID safe{"\n"}• No refunds or exchanges
            after booking{"\n"}• Late arrivals may result in seat reassignment
            {"\n"}• Mobile phones must be silenced during the show
          </Text>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBackToHome}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleViewBookings}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>View My Bookings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            Alert.alert(
              "Cancel Booking",
              "Are you sure you want to cancel this booking?",
              [
                { text: "No", style: "cancel" },
                {
                  text: "Yes, Cancel",
                  style: "destructive",
                  onPress: () => {
                    cancelBooking(bookingId);
                    Alert.alert(
                      "Booking Cancelled",
                      "Your booking has been cancelled successfully."
                    );
                  },
                },
              ]
            );
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.cancelButtonText}>Cancel This Booking</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  successHeader: {
    backgroundColor: "#27ae60",
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  checkmark: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
  },
  detailsContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#7f8c8d",
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  instructionsContainer: {
    backgroundColor: "white",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  instructionIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#667eea",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  instructionNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
  instructionText: {
    flex: 1,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  instructionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
  },
  noticeContainer: {
    backgroundColor: "#fff3cd",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#856404",
    marginBottom: 10,
  },
  noticeText: {
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  primaryButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#667eea",
  },
  secondaryButtonText: {
    color: "#667eea",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
