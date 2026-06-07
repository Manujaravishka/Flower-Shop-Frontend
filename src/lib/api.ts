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
  getAll: async () => unwrapData((await apiClient.get("/gift/all")).data),
  getById: async (giftId: string) =>
    unwrapData((await apiClient.post("/gift/get", { giftId })).data),
  create: async (formData: FormData) =>
    unwrapData(
      (
        await apiClient.post("/gift/create", formData, {
          headers: authHeadersMultipart(),
        })
      ).data
    ),
  updateDetails: async (data: {
    giftId: string;
    name: string;
    description: string;
    price: number;
    colour: string;
    size: string;
    category: string;
  }) => unwrapData((await apiClient.put("/gift/update", data)).data),
  updateImages: async (formData: FormData) =>
    unwrapData(
      (
        await apiClient.put("/gift/update-images", formData, {
          headers: authHeadersMultipart(),
        })
      ).data
    ),
  deleteImages: async (data: { giftId: string; publicId: string }) =>
    unwrapData((await apiClient.delete("/gift/delete-image", { data })).data),
  delete: async (giftId: string) =>
    unwrapData((await apiClient.delete("/gift/delete", { data: { giftId } })).data),
};

export const customerApi = {
  getAll: async () => unwrapData((await apiClient.get("/customer/all")).data),
  get: async (customerId: string) =>
    unwrapData((await apiClient.post("/customer/get", { customerId })).data),
  create: async (data: { name: string; email: string; phone: string; address: string; password?: string }) => {
    const response = await apiClient.post("/customer/create", data);
    persistTokens(response.data);
    return response.data;
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
  getAll: async () => unwrapData((await apiClient.get("/order/all")).data),
  get: async (orderId: string) =>
    unwrapData((await apiClient.post("/order/get", { orderId })).data),
  getMine: async () => unwrapData((await apiClient.get("/customer/orders")).data),
  create: async (data: {
    items: { productId: string; quantity: number; price: number }[];
    totalAmount: number;
    shippingAddress?: string;
    notes?: string;
  }) => unwrapData((await apiClient.post("/order/create", data)).data),
  updateStatus: async (data: { orderId: string; status: string }) =>
    unwrapData((await apiClient.put("/order/update-status", data)).data),
  delete: async (orderId: string) =>
    unwrapData((await apiClient.delete("/order/delete", { data: { orderId } })).data),
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
  get: async (imageId: string) =>
    unwrapData((await apiClient.post("/library/get", { imageId })).data),
  create: async (formData: FormData) =>
    unwrapData(
      (
        await apiClient.post("/library/create", formData, {
          headers: authHeadersMultipart(),
        })
      ).data
    ),
  updateTitle: async (data: { libraryId: string; title: string }) =>
    unwrapData((await apiClient.put("/library/updateTitle", data)).data),
  updateImage: async (formData: FormData) =>
    unwrapData(
      (
        await apiClient.put("/library/updateImg", formData, {
          headers: authHeadersMultipart(),
        })
      ).data
    ),
  deleteImage: async (libraryId: string) =>
    unwrapData((await apiClient.delete("/library/deleteImg", { data: { libraryId } })).data),
  delete: async (libraryId: string) =>
    unwrapData((await apiClient.delete("/library/delete", { data: { libraryId } })).data),
  findByName: async (title: string) =>
    unwrapData((await apiClient.post("/library/findByName", { title })).data),
};

export const aiApi = {
  generate: async (data: { imageUrls: string[]; prompt: string }) =>
    apiClient.post("/ai/generate", data),
};

export const dashboardApi = {
  getStats: async () => unwrapData((await apiClient.get("/dashboard/stats")).data),
};

export { extractApiErrorMessage };
export type { AuthErrorPayload, AuthUser };
export { authHeaders, authHeadersMultipart, unwrapData };
