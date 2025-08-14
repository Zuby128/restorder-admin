// orderService.ts

import { apiWithToken } from "../lib/axiosInstance";

// Type definitions
export interface OrderItem {
  _id?: string;
  foodId:
    | string
    | {
        _id: string;
        name: string;
        price: number;
        description?: string;
        imageUrl?: string;
      };
  quantity: number;
  priceAtOrder: number;
  itemNotes?: string;
}

export interface Discount {
  type: "percentage" | "fixed";
  value: number;
  reason?: string;
  appliedBy?:
    | string
    | {
        _id: string;
        name: string;
      };
}

export interface AdditionalCharge {
  _id?: string;
  amount: number;
  description: string;
  addedBy?:
    | string
    | {
        _id: string;
        name: string;
      };
  addedAt?: Date;
}

export interface Order {
  _id: string;
  tableId?:
    | string
    | {
        _id: string;
        name: string;
      };
  waiterId?:
    | string
    | {
        _id: string;
        name: string;
        email: string;
      };
  items: OrderItem[];
  discount?: Discount;
  additionalCharges: AdditionalCharge[];
  subtotal: number;
  discountAmount: number;
  additionalChargesTotal: number;
  totalPrice: number;
  notes?: string;
  restaurant: string;
  orderTime: Date;
  completedTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrdersResponse {
  success: boolean;
  data: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
  pendingOrders: number;
  preparingOrders: number;
  paidOrders: number;
  canceledOrders: number;
  totalDiscount: number;
  totalAdditionalCharges: number;
}

export interface OrderStatsResponse {
  success: boolean;
  data: OrderStats;
}

export interface OrderFilters {
  restaurant?: string;
  status?: string;
  tableId?: string;
  waiterId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface DiscountRequest {
  type: "percentage" | "fixed";
  value: number;
  reason?: string;
}

export interface AdditionalChargeRequest {
  amount: number;
  description: string;
}

// Order Service Functions

// Tüm siparişleri getir (filtreleme ile)
export const getOrders = async (
  filters?: OrderFilters
): Promise<OrdersResponse> => {
  const api = await apiWithToken();
  const params = new URLSearchParams();

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value.toString());
      }
    });
  }

  const res = await api.get(`/orders?${params.toString()}`);
  return res.data;
};

// Belirli bir siparişi getir
export const getOrderById = async (orderId: string): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const { data } = await api.get(`/orders/${orderId}`);
  return data;
};

// Sipariş items'ları güncelle (ekleme, artırma, çıkarma)
export const updateOrderItems = async (
  orderId: string,
  items: OrderItem[]
): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const res = await api.patch(`/orders/items/${orderId}`, { items });
  return res.data;
};

// İndirim uygula
export const applyDiscount = async (
  orderId: string,
  discount: DiscountRequest
): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const res = await api.patch(`/orders/discount/${orderId}`, discount);
  return res.data;
};

// İndirim kaldır
export const removeDiscount = async (
  orderId: string
): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const res = await api.delete(`/orders/discount/${orderId}`);
  return res.data;
};

// Ek ücret ekle
export const addAdditionalCharge = async (
  orderId: string,
  charge: AdditionalChargeRequest
): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const res = await api.post(`/orders/additional-charges/${orderId}`, charge);
  return res.data;
};

// Ek ücret kaldır
export const removeAdditionalCharge = async (
  orderId: string,
  chargeId: string
): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const res = await api.delete(
    `/orders/additional-charges/${orderId}/${chargeId}`
  );
  return res.data;
};

// Tüm ek ücretleri temizle
export const clearAdditionalCharges = async (
  orderId: string
): Promise<OrderResponse> => {
  const api = await apiWithToken();
  const res = await api.delete(`/orders/additional-charges/${orderId}`);
  return res.data;
};

// Restoran bazında istatistikler
export const getOrderStats = async (
  restaurant: string,
  startDate?: string,
  endDate?: string
): Promise<OrderStatsResponse> => {
  const api = await apiWithToken();
  const params = new URLSearchParams();

  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const res = await api.get(`/orders/stats/${restaurant}?${params.toString()}`);
  return res.data;
};

// Helper functions for item management

// Siparişteki bir item'ın quantity'sini artır
export const increaseItemQuantity = (
  items: OrderItem[],
  foodId: string,
  amount: number = 1
): OrderItem[] => {
  return items.map((item) => {
    const itemFoodId =
      typeof item.foodId === "string" ? item.foodId : item.foodId._id;
    if (itemFoodId === foodId) {
      return { ...item, quantity: item.quantity + amount };
    }
    return item;
  });
};

// Siparişteki bir item'ın quantity'sini azalt
export const decreaseItemQuantity = (
  items: OrderItem[],
  foodId: string,
  amount: number = 1
): OrderItem[] => {
  return items
    .map((item) => {
      const itemFoodId =
        typeof item.foodId === "string" ? item.foodId : item.foodId._id;
      if (itemFoodId === foodId) {
        const newQuantity = Math.max(1, item.quantity - amount);
        return { ...item, quantity: newQuantity };
      }
      return item;
    })
    .filter((item) => item.quantity > 0);
};

// Sipariş items'ından bir item'ı kaldır
export const removeItemFromOrder = (
  items: OrderItem[],
  foodId: string
): OrderItem[] => {
  return items.filter((item) => {
    const itemFoodId =
      typeof item.foodId === "string" ? item.foodId : item.foodId._id;
    return itemFoodId !== foodId;
  });
};

// Siparişe yeni bir item ekle veya mevcut olanın quantity'sini artır
export const addItemToOrder = (
  items: OrderItem[],
  foodId: string,
  quantity: number,
  priceAtOrder: number,
  itemNotes?: string
): OrderItem[] => {
  console.log("---", items);
  const existingItemIndex = items.findIndex((item) => {
    const itemFoodId =
      typeof item.foodId === "string" ? item.foodId : item.foodId._id;
    return itemFoodId === foodId;
  });

  if (existingItemIndex >= 0) {
    // Mevcut item varsa quantity'yi artır
    const updatedItems = [...items];
    updatedItems[existingItemIndex] = {
      ...updatedItems[existingItemIndex],
      quantity: updatedItems[existingItemIndex].quantity + quantity,
      itemNotes: itemNotes || updatedItems[existingItemIndex].itemNotes,
    };
    return updatedItems;
  } else {
    // Yeni item ekle
    return [
      ...items,
      {
        foodId,
        quantity,
        priceAtOrder,
        itemNotes,
      },
    ];
  }
};

// Sipariş toplamlarını hesapla (client-side validation için)
export const calculateOrderTotals = (
  items: OrderItem[] = [],
  discount?: Discount,
  additionalCharges?: AdditionalCharge[]
) => {
  // Subtotal hesapla
  const subtotal = items.reduce((total, item) => {
    return total + item.priceAtOrder * item.quantity;
  }, 0);

  // İndirim miktarını hesapla
  let discountAmount = 0;
  if (discount && discount.value > 0) {
    if (discount.type === "percentage") {
      discountAmount = (subtotal * discount.value) / 100;
    } else if (discount.type === "fixed") {
      discountAmount = Math.min(discount.value, subtotal);
    }
  }

  // Ek ücretlerin toplamını hesapla
  const additionalChargesTotal =
    additionalCharges?.reduce((total, charge) => {
      return total + charge.amount;
    }, 0) || 0;

  // Toplam fiyatı hesapla
  const totalPrice = Math.max(
    0,
    subtotal - discountAmount + additionalChargesTotal
  );

  return {
    subtotal,
    discountAmount,
    additionalChargesTotal,
    totalPrice,
  };
};
