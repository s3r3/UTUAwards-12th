import { describe, it, expect, vi } from 'vitest'
import { useCartStore, CartItem } from './cart.store'

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

describe('cart store', () => {
  beforeEach(() => {
    // Clear the store before each test
    useCartStore.setState({ items: [] }, true)
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
    useCartStore.setState({ items: [existingItem] }, true)

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
    useCartStore.setState({ items: [existingItem] }, true)

    const newItem: Omit<CartItem, 'quantity'> & { quantity?: number } = {
      productId: 'prod-1',
      name: 'Test Product',
      price: 100,
      image: 'test.jpg',
      stock: 5,
      quantity: 3, // trying to add 3 more, total 4 + 3 = 7, should cap at 5
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
    useCartStore.setState({ items: [item1, item2] }, true)

    useCartStore.getState().removeItem('prod-1')

    expect(useCartStore.getState().items).toEqual([item2])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', expect.any(String))
  })

  it('should update quantity of an item', () => {
    const existingItem: CartItem = { productId: 'prod-1', name: 'Test Product', price: 100, image: 'test.jpg', stock: 5, quantity: 1 }
    useCartStore.setState({ items: [existingItem] }, true)

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
    useCartStore.setState({ items: [existingItem] }, true)

    useCartStore.getState().updateQuantity('prod-1', 10) // try to update to 10, stock is 5

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
    useCartStore.setState({ items: [item1, item2] }, true)

    useCartStore.getState().clearCart()

    expect(useCartStore.getState().items).toEqual([])
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('acelora-cart', JSON.stringify([]))
  })

  it('should calculate total items correctly', () => {
    const item1: CartItem = { productId: 'prod-1', name: 'Test Product 1', price: 100, image: 'test1.jpg', stock: 5, quantity: 2 }
    const item2: CartItem = { productId: 'prod-2', name: 'Test Product 2', price: 200, image: 'test2.jpg', stock: 10, quantity: 3 }
    useCartStore.setState({ items: [item1, item2] }, true)

    expect(useCartStore.getState().totalItems()).toBe(5)
  })

  it('should calculate subtotal correctly', () => {
    const item1: CartItem = { productId: 'prod-1', name: 'Test Product 1', price: 100, image: 'test1.jpg', stock: 5, quantity: 2 }
    const item2: CartItem = { productId: 'prod-2', name: 'Test Product 2', price: 200, image: 'test2.jpg', stock: 10, quantity: 3 }
    useCartStore.setState({ items: [item1, item2] }, true)

    expect(useCartStore.getState().subtotal()).toBe(800) // (100*2) + (200*3) = 200 + 600 = 800
  })
})