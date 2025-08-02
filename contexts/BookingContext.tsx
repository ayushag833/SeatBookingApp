import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Booking {
  bookingId: string;
  movieTitle: string;
  showtime: string;
  selectedSeats: number[];
  totalPrice: number;
  movieId: number;
  showtimeId: number;
}

interface BookingContextType {
  bookings: Booking[];
  bookedSeats: { [key: string]: number[] }; // key: "movieId-showtimeId"
  addBooking: (booking: Booking) => void;
  cancelBooking: (bookingId: string) => void;
  isSeatBooked: (movieId: number, showtimeId: number, seatId: number) => boolean;
  getBookedSeatsForShowtime: (movieId: number, showtimeId: number) => number[];
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookingContext = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBookingContext must be used within a BookingProvider');
  }
  return context;
};

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookedSeats, setBookedSeats] = useState<{ [key: string]: number[] }>({});

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadDataFromStorage();
  }, []);

  const loadDataFromStorage = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem('bookings');
      const storedBookedSeats = await AsyncStorage.getItem('bookedSeats');
      
      if (storedBookings) {
        setBookings(JSON.parse(storedBookings));
      }
      
      if (storedBookedSeats) {
        setBookedSeats(JSON.parse(storedBookedSeats));
      }
    } catch (error) {
      console.error('Error loading data from storage:', error);
    }
  };

  const saveDataToStorage = async (newBookings: Booking[], newBookedSeats: { [key: string]: number[] }) => {
    try {
      await AsyncStorage.setItem('bookings', JSON.stringify(newBookings));
      await AsyncStorage.setItem('bookedSeats', JSON.stringify(newBookedSeats));
    } catch (error) {
      console.error('Error saving data to storage:', error);
    }
  };

  const addBooking = (booking: Booking) => {
    const newBookings = [...bookings, booking];
    setBookings(newBookings);

    // Add seats to booked seats
    const key = `${booking.movieId}-${booking.showtimeId}`;
    const currentBookedSeats = bookedSeats[key] || [];
    const newBookedSeats = {
      ...bookedSeats,
      [key]: [...currentBookedSeats, ...booking.selectedSeats]
    };
    setBookedSeats(newBookedSeats);

    // Save to storage
    saveDataToStorage(newBookings, newBookedSeats);
  };

  const cancelBooking = (bookingId: string) => {
    const bookingToCancel = bookings.find(b => b.bookingId === bookingId);
    if (!bookingToCancel) return;

    // Remove booking from bookings array
    const newBookings = bookings.filter(b => b.bookingId !== bookingId);
    setBookings(newBookings);

    // Remove seats from booked seats
    const key = `${bookingToCancel.movieId}-${bookingToCancel.showtimeId}`;
    const currentBookedSeats = bookedSeats[key] || [];
    const newBookedSeatsForShowtime = currentBookedSeats.filter(
      seatId => !bookingToCancel.selectedSeats.includes(seatId)
    );

    const newBookedSeats = {
      ...bookedSeats,
      [key]: newBookedSeatsForShowtime
    };
    setBookedSeats(newBookedSeats);

    // Save to storage
    saveDataToStorage(newBookings, newBookedSeats);
  };

  const isSeatBooked = (movieId: number, showtimeId: number, seatId: number): boolean => {
    const key = `${movieId}-${showtimeId}`;
    const showtimeBookedSeats = bookedSeats[key] || [];
    return showtimeBookedSeats.includes(seatId);
  };

  const getBookedSeatsForShowtime = (movieId: number, showtimeId: number): number[] => {
    const key = `${movieId}-${showtimeId}`;
    return bookedSeats[key] || [];
  };

  const value: BookingContextType = {
    bookings,
    bookedSeats,
    addBooking,
    cancelBooking,
    isSeatBooked,
    getBookedSeatsForShowtime,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}; 