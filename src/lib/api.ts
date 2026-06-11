import { apiClient } from "./axios";
import { extractApiErrorMessage } from "./apiError";
import type {
  AuthErrorPayload,
  AuthUser,
  ChangePasswordPayload,
} from "@/types/auth";

function authHeaders() {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function authHeadersMultipart() {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function unwrapData<T = any>(payload: unknown): T {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function persistTokens(payload: unknown): void {
  if (!payload || typeof payload !== "object") return;
  const obj = payload as Record<string, unknown>;
  const data = obj.data && typeof obj.data === "object" ? (obj.data as Record<string, unknown>) : null;
  const accessToken = (data?.accessToken as string) ?? (obj.accessToken as string);
  const refreshToken = (data?.refreshToken as string) ?? (obj.refreshToken as string);
  if (typeof accessToken === "string" && accessToken.length > 0) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (typeof refreshToken === "string" && refreshToken.length > 0) {
    localStorage.setItem("refreshToken", refreshToken);
  }
}

export { authService } from "@/services/authService";

export const authApi = {
  register: async (data: { name: string; email: string; phone: string; password: string }) => {
    const response = await apiClient.post("/auth/register", data);
    persistTokens(response.data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/auth/login", data);
    persistTokens(response.data);
    return response.data;
  },
  getProfile: async () => {
    const response = await apiClient.get("/auth/me");
    return unwrapData(response.data);
  },
  updateProfile: async (data: { name: string; email: string; phone: string }) => {
    const response = await apiClient.put("/auth/update", data);
    return unwrapData(response.data);
  },
  changePassword: async (data: ChangePasswordPayload) => {
    const response = await apiClient.post("/auth/change-password", data);
    return response.data;
  },
  refreshTokens: async (refreshToken: string) => {
    const response = await apiClient.post("/auth/refresh-token", { refreshToken });
    return response.data;
  },
  registerAdmin: async (data: { name: string; email: string; phone: string; password: string; role?: "admin" | "superadmin" }) => {
    const response = await apiClient.post("/auth/register-admin", data);
    return response.data;
  },
  logout: async () => {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },
};

export const giftApi = {
  getAll: async (params?: Record<string, string>) => unwrapData((await apiClient.get("/gift/all", { params })).data),
  getById: async (giftId: string) =>
    unwrapData((await apiClient.get(`/gift/${giftId}`)).data),
  create: async (formData: FormData) =>
    unwrapData((await apiClient.post("/gift/create", formData)).data),
  updateDetails: async (
    giftId: string,
    data: {
      name: string;
      description: string;
      price: number;
      colour: string;
      size: string;
      category: string[];
    }
  ) => unwrapData((await apiClient.put(`/gift/${giftId}`, data)).data),
  updateImages: async (giftId: string, formData: FormData) =>
    unwrapData((await apiClient.put(`/gift/${giftId}/images`, formData)).data),
  deleteImages: async (giftId: string, publicId: string) =>
    unwrapData((await apiClient.delete(`/gift/${giftId}/image`, { data: { publicId } })).data),
  delete: async (giftId: string) =>
    unwrapData((await apiClient.delete(`/gift/${giftId}`)).data),
};

export const customerApi = {
  getAll: async () => unwrapData((await apiClient.get("/customer/getAll?limit=100")).data),
  get: async (customerId: string) =>
    unwrapData((await apiClient.post("/customer/get", { customerId })).data),
  create: async (data: { name: string; email: string; phone: string; address: string; password?: string }) => {
    const response = await apiClient.post("/customer/create", data);
    const body = response.data;
    persistTokens(body);
    const dataField = body?.data;
    return (dataField?.user ?? body) as { _id?: string; name?: string; email?: string; phone?: string };
  },
  update: async (data: {
    customerId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => unwrapData((await apiClient.put("/customer/update", data)).data),
  delete: async (customerId: string) =>
    unwrapData((await apiClient.delete("/customer/delete", { data: { customerId } })).data),
};

export const orderApi = {
  getAll: async () => unwrapData((await apiClient.get("/order/all?limit=100")).data),
  get: async (orderId: string) =>
    unwrapData((await apiClient.get(`/order/${orderId}`)).data),
  getMine: async () => unwrapData((await apiClient.get("/customer/orders")).data),
  create: async (data: {
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    shippingAddress?: string;
    notes?: string;
  }) => unwrapData((await apiClient.post("/order/create", data)).data),
  updateStatus: async (orderId: string, status: string) =>
    unwrapData((await apiClient.put(`/order/${orderId}/status`, { status })).data),
  delete: async (orderId: string) =>
    unwrapData((await apiClient.delete(`/order/${orderId}`)).data),
  cancel: async (orderId: string) =>
    unwrapData((await apiClient.post(`/customer/orders/${orderId}/cancel`)).data),
};

export const paymentApi = {
  process: async (data: {
    orderId: string;
    amount: number;
    discount?: number;
    paymentMethod: string;
    transactionId?: string;
  }) => unwrapData((await apiClient.post("/payment/process", data)).data),
  updateStatus: async (data: { paymentId: string; status: string }) =>
    unwrapData((await apiClient.put("/payment/update-status", data)).data),
  getMine: async () => unwrapData((await apiClient.get("/payment/me")).data),
};

export const otpApi = {
  send: async (data: { email: string }) =>
    apiClient.post("/auth/send-otp", data),
  verify: async (data: { email: string; otp: string }) => {
    const response = await apiClient.post("/auth/verify-otp", data);
    persistTokens(response.data);
    return response.data;
  },
};

export const cartApi = {
  get: async () => unwrapData((await apiClient.get("/cart/get")).data),
  add: async (data: { productId: string; quantity: number }) =>
    unwrapData((await apiClient.post("/cart/add", data)).data),
  update: async (data: { productId: string; quantity: number }) =>
    unwrapData((await apiClient.put("/cart/update", data)).data),
  remove: async (productId: string) =>
    unwrapData((await apiClient.delete("/cart/remove", { data: { productId } })).data),
  clear: async () => unwrapData((await apiClient.delete("/cart/clear")).data),
};

export const libraryApi = {
  getAll: async () => unwrapData((await apiClient.get("/library/getAll")).data),
  get: async (libraryId: string) =>
    unwrapData((await apiClient.get(`/library/${libraryId}`)).data),
  create: async (formData: FormData) =>
    unwrapData((await apiClient.post("/library/create", formData)).data),
  updateTitle: async (libraryId: string, title: string) =>
    unwrapData((await apiClient.put(`/library/${libraryId}`, { title })).data),
  updateImages: async (libraryId: string, formData: FormData) =>
    unwrapData((await apiClient.put(`/library/${libraryId}/images`, formData)).data),
  deleteImage: async (libraryId: string) =>
    unwrapData((await apiClient.delete(`/library/${libraryId}/image`)).data),
  delete: async (libraryId: string) =>
    unwrapData((await apiClient.delete(`/library/${libraryId}`)).data),
  findByName: async (title: string) =>
    unwrapData((await apiClient.post("/library/find-by-name", { title })).data),
};

export const aiApi = {
  generate: async (data: { imageUrls: string[]; prompt: string }) =>
    unwrapData<{ success: boolean; imageUrl?: string; message?: string }>((await apiClient.post("/ai/generate", data)).data),
};

export const dashboardApi = {
  getStats: async () => unwrapData((await apiClient.get("/dashboard/stats")).data),
};

export const reviewApi = {
  create: async (data: { productId: string; rating: number; title?: string; comment?: string }) =>
    unwrapData((await apiClient.post("/review/create", data)).data),
  getByProduct: async (giftId: string) =>
    unwrapData<{ reviews: any[]; stats: { average: number; count: number; distribution: Record<number, number> } }>((await apiClient.get(`/review/product/${giftId}`)).data),
  getMy: async () =>
    unwrapData((await apiClient.get("/review/my")).data),
  update: async (reviewId: string, data: { rating?: number; title?: string; comment?: string }) =>
    unwrapData((await apiClient.put(`/review/${reviewId}`, data)).data),
  delete: async (reviewId: string) =>
    unwrapData((await apiClient.delete(`/review/${reviewId}`)).data),
};

export { extractApiErrorMessage };
export type { AuthErrorPayload, AuthUser };
export { authHeaders, authHeadersMultipart, unwrapData };
export const API_BASE_URL = "http://localhost:3000";
