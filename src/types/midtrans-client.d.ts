declare module 'midtrans-client' {
  export interface MidtransClientOptions {
    isProduction: boolean
    serverKey: string
    clientKey: string
  }

  export class Snap {
    constructor(options: MidtransClientOptions)
    createTransaction(params: {
      transaction_details: { order_id: string; gross_amount: number }
      customer_details?: { first_name?: string; last_name?: string; email?: string; phone?: string }
      item_details?: { id: string; name: string; price: number; quantity: number }[]
    }): Promise<{ token: string; redirect_url: string }>
  }

  export class CoreApi {
    constructor(options: MidtransClientOptions)
    transaction: {
      notification(body: any): Promise<{ order_id: string; transaction_status: string; fraud_status: string | null }>
      status(orderId: string): Promise<any>
    }
    charge(params: any): Promise<any>
  }
}
