import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Showtime {
  id: number;
  time: string;
  date: string;
  price: number;
  seats: any;
}

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  poster: string;
  description: string;
  showtimes: Showtime[];
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  );

  useEffect(() => {
    const loadMovieDetails = async () => {
      try {
        const moviesData = require("../../data/movies.json");
        const foundMovie = moviesData.movies.find(
          (m: Movie) => m.id === Number(id)
        );
        setMovie(foundMovie);
      } catch (error) {
        console.error("Error loading movie details:", error);
      }
    };
    loadMovieDetails();
  }, [id]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
  };

  const handleBookSeats = () => {
    if (selectedShowtime && movie) {
      router.push({
        pathname: "/seat-booking",
        params: {
          movieId: movie.id,
          showtimeId: selectedShowtime.id,
          movieTitle: movie.title,
          showtime: selectedShowtime.time,
          price: selectedShowtime.price,
        },
      });
    }
  };

  if (!movie) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2c3e50" />

      <ScrollView style={styles.scrollView}>
        {/* Movie Poster and Basic Info */}
        <View style={styles.posterContainer}>
          <Image source={{ uri: movie.poster }} style={styles.poster} />
          <View style={styles.posterOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Movie Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.movieTitle}>{movie.title}</Text>
          <Text style={styles.movieGenre}>{movie.genre}</Text>

          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{movie.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>{movie.rating}</Text>
              </View>
            </View>
          </View>

          <Text style={styles.description}>{movie.description}</Text>
        </View>

        {/* Showtimes */}
        <View style={styles.showtimesContainer}>
          <Text style={styles.sectionTitle}>Select Showtime</Text>
          <View style={styles.showtimesGrid}>
            {movie.showtimes.map((showtime) => (
              <TouchableOpacity
                key={showtime.id}
                style={[
                  styles.showtimeCard,
                  selectedShowtime?.id === showtime.id &&
                    styles.selectedShowtime,
                ]}
                onPress={() => handleShowtimeSelect(showtime)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.showtimeTime,
                    selectedShowtime?.id === showtime.id &&
                      styles.selectedShowtimeText,
                  ]}
                >
                  {showtime.time}
                </Text>
                <Text
                  style={[
                    styles.showtimePrice,
                    selectedShowtime?.id === showtime.id &&
                      styles.selectedShowtimeText,
                  ]}
                >
                  ₹{showtime.price}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      {selectedShowtime && (
        <View style={styles.bookButtonContainer}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookSeats}
            activeOpacity={0.8}
          >
            <Text style={styles.bookButtonText}>
              Book Seats - ₹{selectedShowtime.price}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  posterContainer: {
    position: "relative",
    height: 400,
  },
  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  posterOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: "white",
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  movieGenre: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  metaItem: {
    marginRight: 30,
  },
  metaLabel: {
    fontSize: 12,
    color: "#95a5a6",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    color: "#2c3e50",
    fontWeight: "500",
  },
  ratingContainer: {
    backgroundColor: "#e74c3c",
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
    textAlign: "center", 
  },
  description: {
    fontSize: 14,
    color: "#34495e",
    lineHeight: 22,
  },
  showtimesContainer: {
    padding: 20,
    backgroundColor: "white",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 16,
  },
  showtimesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  showtimeCard: {
    width: (width - 60) / 3,
    padding: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
  },
  selectedShowtime: {
    backgroundColor: "#667eea",
    borderColor: "#667eea",
  },
  showtimeTime: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  selectedShowtimeText: {
    color: "white",
  },
  showtimePrice: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  bookButtonContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  bookButton: {
    backgroundColor: "#667eea",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
