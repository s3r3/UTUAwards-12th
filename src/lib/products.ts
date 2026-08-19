export interface BestSellerProduct {
  id: string
  name: string
  variant: string
  weight: string
  price: string
  image: string
}

export async function getBestSellers(): Promise<{
  farmProduct: BestSellerProduct
  seaProduct: BestSellerProduct
}> {
  return {
    farmProduct: {
      id: 'farm-001',
      name: 'ACEH BLACK PEPPER',
      variant: 'Premium Grade A',
      weight: '1 kg',
      price: 'Rp 185.000',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    },
    seaProduct: {
      id: 'sea-001',
      name: 'WILD CAUGHT PRAWNS',
      variant: 'Fresh XL',
      weight: '1 kg',
      price: 'Rp 275.000',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&q=80',
    },
  }
}
