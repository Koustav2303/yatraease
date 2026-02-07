import { create } from 'zustand';

export const useBookingStore = create((set) => ({
  checkIn: null,
  checkOut: null,
  adults: 1,
  children: 0,
  rooms: 1,
  
  actions: {
    setCheckIn: (date) => set({ checkIn: date }),
    setCheckOut: (date) => set({ checkOut: date }),
    setAdults: (count) => set({ adults: count }),
    setChildren: (count) => set({ children: count }),
    setRooms: (count) => set({ rooms: count }),
  }
}));

export const useBookingActions = () => useBookingStore((state) => state.actions);