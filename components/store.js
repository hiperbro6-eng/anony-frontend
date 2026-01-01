import { create } from 'zustand';

export const useStore = create((set) => ({
  cart: [],
  isOpen: false,
  
  // Open/Close the cart
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  // ✅ NEW: Function to actually add items to the array
  addToCart: (item) => set((state) => ({ 
    cart: [...state.cart, item],
    isOpen: true // Optional: Open cart automatically when adding
  })),

  // Optional: Remove item
  removeFromCart: (index) => set((state) => ({
    cart: state.cart.filter((_, i) => i !== index)
  })),
}));