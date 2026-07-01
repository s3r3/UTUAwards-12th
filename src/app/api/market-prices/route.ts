import { NextResponse } from 'next/server'

// ponytail: replace with real API (Alpha Vantage / Yahoo Finance) when ready
// For now uses realistic mock data with slight randomization per day

interface CommodityPrice {
  id: string
  name: string
  nameId: string
  emoji: string
  price: number
  unit: string
  change: number
  changePercent: number
  high: number
  low: number
  updatedAt: string
  history: number[]
  source: string
}

function generateHistory(basePrice: number, days: number = 30): number[] {
  const history: number[] = []
  let price = basePrice * (1 - (Math.random() * 0.15))
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * basePrice * 0.03
    price = Math.max(price + change, basePrice * 0.7)
    history.push(Math.round(price * 100) / 100)
  }
  return history
}

function generatePrice(basePrice: number): number {
  return Math.round((basePrice + (Math.random() - 0.5) * basePrice * 0.1) * 100) / 100
}

const commodities: CommodityPrice[] = [
  {
    id: 'coffee',
    name: 'Coffee Arabica',
    nameId: 'Kopi Arabika Gayo',
    emoji: '☕',
    price: generatePrice(4.85),
    unit: 'USD/kg',
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    updatedAt: new Date().toISOString(),
    history: [],
    source: 'ICE Futures US',
  },
  {
    id: 'patchouli',
    name: 'Patchouli Oil',
    nameId: 'Minyak Nilam Aceh',
    emoji: '🌿',
    price: generatePrice(48.50),
    unit: 'USD/kg',
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    updatedAt: new Date().toISOString(),
    history: [],
    source: 'Market Estimate',
  },
  {
    id: 'shrimp',
    name: 'Vannamei Shrimp',
    nameId: 'Udang Vannamei',
    emoji: '🦐',
    price: generatePrice(8.20),
    unit: 'USD/kg',
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    updatedAt: new Date().toISOString(),
    history: [],
    source: 'FAO Fishery',
  },
  {
    id: 'pepper',
    name: 'Black Pepper',
    nameId: 'Lada Hitam Aceh',
    emoji: '🌶️',
    price: generatePrice(4.50),
    unit: 'USD/kg',
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    updatedAt: new Date().toISOString(),
    history: [],
    source: 'IPE Singapore',
  },
  {
    id: 'robusta',
    name: 'Coffee Robusta',
    nameId: 'Kopi Robusta Gayo',
    emoji: '☕',
    price: generatePrice(2.95),
    unit: 'USD/kg',
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    updatedAt: new Date().toISOString(),
    history: [],
    source: 'ICE Futures US',
  },
  {
    id: 'cinnamon',
    name: 'Cinnamon',
    nameId: 'Kayu Manis Aceh',
    emoji: '🌰',
    price: generatePrice(3.80),
    unit: 'USD/kg',
    change: 0,
    changePercent: 0,
    high: 0,
    low: 0,
    updatedAt: new Date().toISOString(),
    history: [],
    source: 'Market Estimate',
  },
]

// Generate realistic data
for (const c of commodities) {
  const history = generateHistory(c.price)
  const today = history[history.length - 1] || c.price
  const yesterday = history[history.length - 2] || c.price
  c.change = Math.round((today - yesterday) * 100) / 100
  c.changePercent = Math.round((c.change / yesterday) * 100 * 100) / 100
  c.high = Math.round(Math.max(...history.slice(-7)) * 100) / 100
  c.low = Math.round(Math.min(...history.slice(-7)) * 100) / 100
  c.history = history
}

export async function GET() {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 300))

  return NextResponse.json({
    success: true,
    data: commodities,
    updatedAt: new Date().toISOString(),
  })
}
