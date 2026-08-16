import { PRODUCT_CATEGORIES } from '@/constants/products';
import { NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import { SAMPLE_PRODUCTS } from '@/constants/products'

// Size settings
const WIDTH = 1200
const HEIGHT = 630

// Add safer font loading to prevent fallback failures
function safeFontFontFamily(name: string, weight?: string): string {
  const safeName = name.replace(/["']/g, "'")
  return `${safeName}, "Segoe UI", Roboto, sans-serif`
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Find product data
    const product = SAMPLE_PRODUCTS.find(p => p.id === id)
    if (!product) {
      // Return a 404 or fallback image
      return new NextResponse('Product not found', { status: 404 })
    }

    // Get category data
    const category = PRODUCT_CATEGORIES.find(c => c.value === product.category)
    const categoryColor = category?.color || '#6d28d9'

    // Create the OG image
    const ogImage = new ImageResponse(
      (
        <div
          style={
            {
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              padding: '40px',
              backgroundColor: '#ffffff',
              backgroundImage: `linear-gradient(135deg, ${categoryColor}15, ${categoryColor}05)`,
              fontFamily: 'system-ui, -apple-system, sans-serif',
              position: 'relative',
            }
          }
        >
          {/* Brand Header */}
          <div
            style={
              {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginBottom: '20px',
              }
            }
          >
            <div
              style={
                {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }
              }
            >
              <div
                style={
                  {
                    width: '48px',
                    height: '48px',
                    backgroundColor: categoryColor,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }
                }
              >
                {category?.emoji || '🌿'}
              </div>
              <div
                style={
                  {
                    display: 'flex',
                    flexDirection: 'column',
                  }
                }
              >
                <div
                  style={
                    {
                      fontSize: '28px',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      lineHeight: 1,
                    }
                  }
                >
                  Acelora
                </div>
                <div
                  style={
                    {
                      fontSize: '16px',
                      color: '#6b7280',
                    }
                  }
                >
                  Premium Export-Quality Products
                </div>
              </div>
            </div>

            {/* Certification Badge */}
            <div
              style={
                {
                  backgroundColor: '#10b981',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }
              }
            >
              ✅ Verified Premium
            </div>
          </div>

          {/* Main Content */}
          <div
            style={
              {
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                width: '100%',
              }
            }
          >
            {/* Product Info */}
            <div
              style={
                {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  marginBottom: '8px',
                }
              }
            >
              <span
                style={
                  {
                    fontSize: '36px',
                    fontWeight: 'bold',
                    color: categoryColor,
                  }
                }
              >
                {product.category}
              </span>
              <span
                style={
                  {
                    fontSize: '18px',
                    color: '#9ca3af',
                  }
                }
              >
                |
              </span>
              <span
                style={
                  {
                    fontSize: '18px',
                    color: '#6b7280',
                  }
                }
              >
                {product.origin}
              </span>
            </div>

            {/* Product Title */}
            <div
              style={
                {
                  fontSize: '56px',
                  fontWeight: 'bold',
                  color: '#111827',
                  lineHeight: 1.2,
                  maxWidth: '800px',
                }
              }
            >
              {product.name}
            </div>

            {/* Product Description */}
            <div
              style={
                {
                  fontSize: '20px',
                  color: '#374151',
                  lineHeight: 1.5,
                  maxWidth: '700px',
                }
              }
            >
              {product.descriptionEn?.split('. ')[0] || product.descriptionEn}
            </div>

            {/* Product Details */}
            <div
              style={
                {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '24px',
                  marginTop: '20px',
                }
              }
            >
              {/* Price */}
              {product.priceRangeUSD && (
                <div
                  style={
                    {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f3f4f6',
                      padding: '12px 20px',
                      borderRadius: '8px',
                    }
                  }
                >
                  <span
                    style={
                      {
                        fontSize: '16px',
                        color: '#6b7280',
                      }
                    }
                  >
                    Price Range
                  </span>
                  <span
                    style={
                      {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#10b981',
                      }
                    }
                  >
                    {product.priceRangeUSD}
                  </span>
                </div>
              )}

              {/* Annual Production */}
              {product.annualProductionTon && (
                <div
                  style={
                    {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f3f4f6',
                      padding: '12px 20px',
                      borderRadius: '8px',
                    }
                  }
                >
                  <span
                    style={
                      {
                        fontSize: '16px',
                        color: '#6b7280',
                      }
                    }
                  >
                    Annual Production
                  </span>
                  <span
                    style={
                      {
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#3b82f6',
                      }
                    }
                  >
                    {product.annualProductionTon}t
                  </span>
                </div>
              )}

              {/* Export Destinations */}
              {product.exportDestinations && product.exportDestinations.length > 0 && (
                <div
                  style={
                    {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#f3f4f6',
                      padding: '12px 20px',
                      borderRadius: '8px',
                    }
                  }
                >
                  <span
                    style={
                      {
                        fontSize: '16px',
                        color: '#6b7280',
                      }
                    }
                  >
                    Export to {product.exportDestinations.length} Countries
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Certification Strip */}
          <div
            style={
              {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                marginTop: '40px',
                paddingTop: '20px',
                borderTop: '1px solid #e5e7eb',
              }
            }
          >
            <div
              style={
                {
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }
              }
            >
              <span
                style={
                  {
                    fontSize: '16px',
                    color: '#6b7280',
                  }
                }
              >
                Certificates:
              </span>
              <div
                style={
                  {
                    display: 'flex',
                    gap: '8px',
                  }
                }
              >
                {product.certifications?.slice(0, 3).map(cert => (
                  <div
                    key={cert}
                    style={
                      {
                        backgroundColor: '#f9fafb',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#374151',
                        border: `1px solid ${categoryColor}30`,
                      }
                    }
                  >
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Product ID */}
            <div
              style={
                {
                  fontSize: '14px',
                  color: '#9ca3af',
                  textAlign: 'right',
                }
              }
            >
              ID: {product.id}
            </div>
          </div>
        </div>
      ),
      {
        width: WIDTH,
        height: HEIGHT,
      }
    )

    // Set cache headers for product OG images
    const cacheTTL = 3600 * 24 * 7 // 1 week
    const response = new NextResponse(ogImage as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': `public, max-age=${cacheTTL}, stale-while-revalidate`,
        'X-Content-Type-Options': 'nosniff',
        'X-Download-Options': 'noopen',
        'X-XSS-Protection': '1; mode=block',
      },
    })

    return response
  } catch (error) {
    console.error('Error generating OG image:', error)

    // Return a simple error image for debugging
    return new NextResponse('Error generating OG image', { status: 500 })
  }
}