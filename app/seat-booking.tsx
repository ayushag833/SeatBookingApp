import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingContext } from "../contexts/BookingContext";

const { width } = Dimensions.get("window");

interface Seat {
  id: number;
  row: number;
  column: number;
  isBooked: boolean;
  isSelected: boolean;
}

export default function SeatBookingScreen() {
  const params = useLocalSearchParams();
  const { isSeatBooked, addBooking } = useBookingContext();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const movieId = Number(params.movieId);
  const showtimeId = Number(params.showtimeId);
  const movieTitle = params.movieTitle as string;
  const showtime = params.showtime as string;
  const pricePerSeat = Number(params.price);

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    try {
      const moviesData = require("../data/movies.json");
      const movie = moviesData.movies.find((m: any) => m.id === movieId);
      const showtime = movie.showtimes.find((s: any) => s.id === showtimeId);
      const { rows, columns } = showtime.seats.layout;
      const defaultBookedSeats = showtime.seats.booked;
      const seatsArray: Seat[] = [];
      for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
          const seatId = (row - 1) * columns + col;
          const isBookedByUser = isSeatBooked(movieId, showtimeId, seatId);
          const isBookedByDefault = defaultBookedSeats.includes(seatId);
          seatsArray.push({
            id: seatId,
            row,
            column: col,
            isBooked: isBookedByUser || isBookedByDefault,
            isSelected: false,
          });
        }
      }
      setSeats(seatsArray);
    } catch (error) {
      console.error("Error loading seats:", error);
    }
  };

  const handleSeatPress = (seat: Seat) => {
    if (seat.isBooked) return;
    const updatedSeats = seats.map((s) => {
      if (s.id === seat.id) {
        return { ...s, isSelected: !s.isSelected };
      }
      return s;
    });
    const newSelectedSeats = updatedSeats.filter((s) => s.isSelected);
    setSeats(updatedSeats);
    setSelectedSeats(newSelectedSeats);
    setTotalPrice(newSelectedSeats.length * pricePerSeat);
  };

  const handleConfirmBooking = () => {
    if (selectedSeats.length === 0) {
      Alert.alert(
        "No Seats Selected",
        "Please select at least one seat to continue."
      );
      return;
    }
    const booking = {
      movieId,
      showtimeId,
      movieTitle,
      showtime,
      selectedSeats: selectedSeats.map((s) => s.id),
      totalPrice,
      bookingId: Date.now().toString(),
    };
    addBooking(booking);
    router.push({
      pathname: "/booking-confirmation",
      params: booking,
    });
  };

  const renderSeat = (seat: Seat) => {
    let seatStyle: any = styles.seat;
    let seatTextStyle: any = styles.seatText;
    if (seat.isBooked) {
      seatStyle = [styles.seat, styles.bookedSeat];
      seatTextStyle = [styles.seatText, styles.bookedSeatText];
    } else if (seat.isSelected) {
      seatStyle = [styles.seat, styles.selectedSeat];
      seatTextStyle = [styles.seatText, styles.selectedSeatText];
    }
    return (
      <TouchableOpacity
        key={seat.id}
        style={seatStyle}
        onPress={() => handleSeatPress(seat)}
        disabled={seat.isBooked}
        activeOpacity={0.8}
      >
        <Text style={seatTextStyle}>{seat.id}</Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (rowNumber: number) => {
    const rowSeats = seats.filter((seat) => seat.row === rowNumber);
    return (
      <View key={rowNumber} style={styles.row}>
        <Text style={styles.rowLabel}>
          {String.fromCharCode(64 + rowNumber)}
        </Text>
        <View style={styles.seatsInRow}>{rowSeats.map(renderSeat)}</View>
      </View>
    );
  };

  const getUniqueRows = () => {
    return [...new Set(seats.map((seat) => seat.row))].sort((a, b) => a - b);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.movieTitle} numberOfLines={1}>
            {movieTitle}
          </Text>
          <Text style={styles.showtimeText}>{showtime}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Screen */}
        <View style={styles.screenContainer}>
          <View style={styles.screen}>
            <Text style={styles.screenText}>SCREEN</Text>
          </View>
        </View>

        {/* Seats */}
        <View style={styles.seatsContainer}>
          {getUniqueRows().map(renderRow)}
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.availableSeat]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.selectedLegendSeat]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendSeat, styles.bookedSeat]} />
            <Text style={styles.legendText}>Booked</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""}{" "}
            selected
          </Text>
          <Text style={styles.priceText}>₹{totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            selectedSeats.length === 0 && styles.disabledButton,
          ]}
          onPress={handleConfirmBooking}
          disabled={selectedSeats.length === 0}
        >
          <Text style={styles.confirmButtonText}>
            {selectedSeats.length === 0
              ? "Select Seats First"
              : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewBookingsButton}
          onPress={() => router.push("/bookings-history")}
        >
          <Text style={styles.viewBookingsText}>My Bookings</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8
  },
  headerInfo: {
    flex: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
  },
  viewBookingsButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10
  },
  viewBookingsText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },
  showtimeText: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  scrollView: {
    flex: 1,
  },
  screenContainer: {
    alignItems: "center",
    paddingVertical: 30,
  },
  screen: {
    width: width * 0.8,
    height: 60,
    backgroundColor: "#34495e",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  screenText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  seatsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rowLabel: {
    width: 20,
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    textAlign: "center",
    marginRight: 10
  },
  seatsInRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "nowrap",
    gap: 8,
  },
  seat: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#ecf0f1",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  seatText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  selectedSeat: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  selectedSeatText: {
    color: "white",
  },
  bookedSeat: {
    backgroundColor: "#e74c3c",
    borderColor: "#e74c3c",
  },
  bookedSeatText: {
    color: "white",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendSeat: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  availableSeat: {
    backgroundColor: "#ecf0f1",
    borderWidth: 1,
    borderColor: "#bdc3c7",
  },
  selectedLegendSeat: {
    backgroundColor: "#667eea",
  },
  legendText: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  bottomBar: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  selectionInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectionText: {
    fontSize: 16,
    color: "#2c3e50",
    fontWeight: "500",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#667eea",
  },
  confirmButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#bdc3c7",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
