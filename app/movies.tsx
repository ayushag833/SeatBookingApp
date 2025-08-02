import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface Movie {
  id: number;
  title: string;
  genre: string;
  duration: string;
  rating: string;
  poster: string;
  description: string;
  showtimes: any[];
}

export default function MoviesScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    // Load movies data
    const loadMovies = async () => {
      try {
        const moviesData = require("../data/movies.json");
        setMovies(moviesData.movies);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };
    loadMovies();
  }, []);

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => router.push(`/movie-details/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.poster }} style={styles.moviePoster} />
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.movieGenre} numberOfLines={1}>
          {item.genre}
        </Text>
        <View style={styles.movieMeta}>
          <Text style={styles.movieDuration}>{item.duration}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Now Showing</Text>
        <Text style={styles.headerSubtitle}>Choose your movie</Text>
      </View>

      <FlatList
        data={movies}
        renderItem={renderMovieCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: "#f8f9fa",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  movieCard: {
    width: (width - 50) / 2,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  moviePoster: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginTop: 0,
  },
  movieInfo: {
    padding: 12,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
    lineHeight: 18,
  },
  movieGenre: {
    fontSize: 12,
    color: "#7f8c8d",
    marginBottom: 8,
  },
  movieMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  movieDuration: {
    fontSize: 11,
    color: "#95a5a6",
  },
  ratingBadge: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 10,
    color: "white",
    fontWeight: "bold",
  },
});
