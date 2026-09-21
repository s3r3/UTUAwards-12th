import { NextResponse } from 'next/server'
import { ACEH_LOCATIONS } from '@/data/acehLocations'

export async function GET() {
  return NextResponse.json({ success: true, data: ACEH_LOCATIONS })
}