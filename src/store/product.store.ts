import { create } from 'zustand'

interface Product {
  id: string
  name: string
  category: string
  description: string
  image?: string
  origin: string
  status: string
}

interface ProductState {
  products: Product[]
  filteredProducts: Product[]
  searchQuery: string
  selectedCategory: string
  setProducts: (products: Product[]) => void
  setSearchQuery: (query: string) => void
  setCategory: (category: string) => void
  addProduct: (product: Product) => void
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  filteredProducts: [],
  searchQuery: '',
  selectedCategory: 'all',
  setProducts: (products) => set({ products, filteredProducts: products }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCategory: (category) => set({ selectedCategory: category }),
  addProduct: (product) => set((state) => ({ 
    products: [...state.products, product] 
  })),
}))
