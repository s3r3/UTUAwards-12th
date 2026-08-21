import { describe, it, expect, vi, beforeEach } from 'vitest'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  stock: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
}

// Mocking localStorage for persistence middleware
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Create a fresh store instance for testing
const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.stock) }
                  : i
              ),
            }
          }
          return { items: [...state.items, { ...item, quantity: item.quantity || 1 }] }
        })
      },
      removeItem: (productId: string) => {
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }))
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) return
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
          ),
        }))
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: 'acelora-cart' }
  )
)

describe('cart store', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] })
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
  })

  it('should add an item to an empty cart', () => {
    const newItem: Omit<CartItem, 'quantity'> & { quantity?: number } = {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      stock: 5,
    }
    useCartStore.getState().addItem(newItem)
    expect(useCartStore.getState().items).toEqual([
      {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
        stock: 5,
        quantity: 1,
      },
    ])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', expect.any(String))
  })

  it('should increase quantity if item already exists', () => {
    const existingItem: CartItem = {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      stock: 5,
      quantity: 2,
    }
    useCartStore.setState({ items: [existingItem] })

    const newItem: Omit<CartItem, 'quantity'> & { quantity?: number } = {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      stock: 5,
      quantity: 1,
    }
    useCartStore.getState().addItem(newItem)

    expect(useCartStore.getState().items).toEqual([
      {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
        stock: 5,
        quantity: 3,
      },
    ])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', expect.any(String))
  })

  it('should not exceed stock when adding items', () => {
    const existingItem: CartItem = {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      stock: 5,
      quantity: 4,
    }
    useCartStore.setState({ items: [existingItem] })

    const newItem: Omit<CartItem, 'quantity'> & { quantity?: number } = {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      stock: 5,
      quantity: 3,
    }
    useCartStore.getState().addItem(newItem)

    expect(useCartStore.getState().items).toEqual([
      {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
        stock: 5,
        quantity: 5,
      },
    ])
  })

  it('should remove an item from the cart', () => {
    const item1: CartItem = { productId: 'prod-1', name: 'Test Product 1', price: 100, image: 'test1.jpg', stock: 5, quantity: 1 }
    const item2: CartItem = { productId: 'prod-2', name: 'Test Product 2', price: 200, image: 'test2.jpg', stock: 10, quantity: 2 }
    useCartStore.setState({ items: [item1, item2] })

    useCartStore.getState().removeItem('prod-1')

    expect(useCartStore.getState().items).toEqual([item2])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', expect.any(String))
  })

  it('should update quantity of an item', () => {
    const existingItem: CartItem = { productId: 'prod-1', name: 'Test Product', price: 100, image: 'test.jpg', stock: 5, quantity: 1 }
    useCartStore.setState({ items: [existingItem] })

    useCartStore.getState().updateQuantity('prod-1', 3)

    expect(useCartStore.getState().items).toEqual([
      {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
        stock: 5,
        quantity: 3,
      },
    ])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', expect.any(String))
  })

  it('should cap quantity at stock limit when updating', () => {
    const existingItem: CartItem = { productId: 'prod-1', name: 'Test Product', price: 100, image: 'test.jpg', stock: 5, quantity: 1 }
    useCartStore.setState({ items: [existingItem] })

    useCartStore.getState().updateQuantity('prod-1', 10)

    expect(useCartStore.getState().items).toEqual([
      {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        image: 'test.jpg',
        stock: 5,
        quantity: 5,
      },
    ])
  })

  it('should clear the cart', () => {
    const item1: CartItem = { productId: 'prod-1', name: 'Test Product 1', price: 100, image: 'test1.jpg', stock: 5, quantity: 1 }
    const item2: CartItem = { productId: 'prod-2', name: 'Test Product 2', price: 200, image: 'test2.jpg', stock: 10, quantity: 2 }
    useCartStore.setState({ items: [item1, item2] })

    useCartStore.getState().clearCart()

    expect(useCartStore.getState().items).toEqual([])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', expect.any(String))
  })

  it('should calculate total items correctly', () => {
    const item1: CartItem = { productId: 'prod-1', name: 'Test Product 1', price: 100, image: 'test1.jpg', stock: 5, quantity: 2 }
    const item2: CartItem = { productId: 'prod-2', name: 'Test Product 2', price: 200, image: 'test2.jpg', stock: 10, quantity: 3 }
    useCartStore.setState({ items: [item1, item2] })

    expect(useCartStore.getState().totalItems()).toBe(5)
  })

  it('should calculate subtotal correctly', () => {
    const item1: CartItem = { productId: 'prod-1', name: 'Test Product 1', price: 100, image: 'test1.jpg', stock: 5, quantity: 2 }
    const item2: CartItem = { productId: 'prod-2', name: 'Test Product 2', price: 200, image: 'test2.jpg', stock: 10, quantity: 3 }
    useCartStore.setState({ items: [item1, item2] })

    expect(useCartStore.getState().subtotal()).toBe(800)
  })
})
