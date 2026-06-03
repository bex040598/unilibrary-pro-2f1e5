import type { ApiEnvelope, AuthResponse, Book, Department, Faculty, Loan, ReadingRoom, Reservation, Resource, Seat, User, AIAnswer } from "../types";

const runtimeConfig = (globalThis as {
  __ATMU_RUNTIME_CONFIG__?: {
    apiBaseUrl?: string;
  };
}).__ATMU_RUNTIME_CONFIG__;

const browserFallbackApiBaseUrl =
  typeof window !== "undefined" && window.location.hostname !== "127.0.0.1" && window.location.hostname !== "localhost"
    ? `${window.location.origin}/api`
    : undefined;

const API_BASE_URL =
  runtimeConfig?.apiBaseUrl ??
  import.meta.env.VITE_API_BASE_URL ??
  browserFallbackApiBaseUrl ??
  "http://127.0.0.1:8000";

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers ?? {});
  headers.set("Accept", "application/json");

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `HTTP ${response.status}`);
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Serverga ulanib bo'lmadi. API manzilini tekshiring: ${API_BASE_URL}`);
    }
    throw error;
  }
}

export const api = {
  baseUrl: API_BASE_URL,
  login: (email: string, password: string) =>
    request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password })
    }),
  register: (payload: Record<string, unknown>) =>
    request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: (token: string) => request<User>("/auth/me", {}, token),
  updateMe: (token: string, payload: Record<string, unknown>) =>
    request<User>("/users/me", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }, token),
  changePassword: (token: string, payload: Record<string, unknown>) =>
    request<ApiEnvelope<{ success: boolean }>>("/users/me/password", {
      method: "PATCH",
      body: JSON.stringify(payload)
    }, token),
  librarySummary: (token: string) =>
    request<ApiEnvelope<{ reservations: number; loans: number; overdue: number; seat_bookings: number }>>("/users/me/library-summary", {}, token),
  activity: (token: string) =>
    request<ApiEnvelope<Array<{ id: number; action: string; created_at: string }>>>("/users/me/activity", {}, token),
  faculties: () => request<Faculty[]>("/faculties"),
  departments: () => request<Department[]>("/departments"),
  department: (id: number) => request<Department>(`/departments/${id}`),
  departmentResources: (departmentId?: number) =>
    request<Resource[]>(departmentId ? `/departments/${departmentId}/resources` : "/department-resources"),
  departmentStatistics: (id: number) => request<ApiEnvelope<Record<string, number>>>(`/departments/${id}/statistics`),
  createResource: (token: string, formData: FormData) =>
    request<Resource>("/department-resources", { method: "POST", body: formData }, token),
  submitResource: (token: string, id: number) =>
    request<Resource>(`/department-resources/${id}/submit`, { method: "POST" }, token),
  approveResource: (token: string, id: number) =>
    request<Resource>(`/department-resources/${id}/approve`, { method: "PATCH" }, token),
  rejectResource: (token: string, id: number) =>
    request<Resource>(`/department-resources/${id}/reject`, { method: "PATCH" }, token),
  requestRevision: (token: string, id: number) =>
    request<Resource>(`/department-resources/${id}/request-revision`, { method: "PATCH" }, token),
  books: () => request<Book[]>("/books"),
  bookAvailability: (id: number) => request<ApiEnvelope<{ available_copies: number; total_copies: number }>>(`/books/${id}/availability`),
  myReservations: (token: string) => request<Reservation[]>("/reservations/my", {}, token),
  reservations: (token: string) => request<Reservation[]>("/reservations", {}, token),
  reserveBook: (token: string, payload: Record<string, unknown>) =>
    request<Reservation>("/reservations", { method: "POST", body: JSON.stringify(payload) }, token),
  approveReservation: (token: string, id: number) =>
    request<Reservation>(`/reservations/${id}/approve`, { method: "PATCH" }, token),
  rejectReservation: (token: string, id: number) =>
    request<Reservation>(`/reservations/${id}/reject`, { method: "PATCH" }, token),
  markPickedUp: (token: string, id: number) =>
    request<Reservation>(`/reservations/${id}/mark-picked-up`, { method: "PATCH" }, token),
  myLoans: (token: string) => request<Loan[]>("/loans/my", {}, token),
  dueToday: (token: string) => request<Loan[]>("/loans/due-today", {}, token),
  overdue: (token: string) => request<Loan[]>("/loans/overdue", {}, token),
  renewLoan: (token: string, id: number) =>
    request<ApiEnvelope<{ status: string }>>(`/loans/${id}/renew-request`, { method: "POST" }, token),
  issueLoan: (token: string, payload: Record<string, unknown>) =>
    request<Loan>("/loans/issue", { method: "POST", body: JSON.stringify(payload) }, token),
  returnLoan: (token: string, id: number) =>
    request<Loan>(`/loans/${id}/return`, { method: "POST" }, token),
  readingRooms: () => request<ReadingRoom[]>("/reading-rooms"),
  seats: (readingRoomId: number) => request<Seat[]>(`/reading-rooms/${readingRoomId}/seats`),
  mySeatReservations: (token: string) => request<ApiEnvelope<Array<Record<string, unknown>>>>("/seat-reservations/my", {}, token),
  reserveSeat: (token: string, payload: Record<string, unknown>) =>
    request<ApiEnvelope<Record<string, unknown>>>("/seat-reservations", { method: "POST", body: JSON.stringify(payload) }, token),
  checkInSeat: (token: string, id: number) =>
    request<ApiEnvelope<Record<string, unknown>>>(`/seat-reservations/${id}/check-in`, { method: "PATCH" }, token),
  checkOutSeat: (token: string, id: number) =>
    request<ApiEnvelope<Record<string, unknown>>>(`/seat-reservations/${id}/check-out`, { method: "PATCH" }, token),
  cancelSeat: (token: string, id: number) =>
    request<ApiEnvelope<Record<string, unknown>>>(`/seat-reservations/${id}/cancel`, { method: "PATCH" }, token),
  faceStatus: (token: string) => request<ApiEnvelope<{ enabled: boolean; updated_at?: string | null }>>("/face/status", {}, token),
  faceRegister: (token: string, formData: FormData) =>
    request<ApiEnvelope<{ enabled: boolean }>>("/face/register", { method: "POST", body: formData }, token),
  faceVerify: (token: string, formData: FormData) =>
    request<ApiEnvelope<{ verified: boolean; message: string }>>("/face/verify", { method: "POST", body: formData }, token),
  faceRemove: (token: string) =>
    request<ApiEnvelope<{ removed: boolean }>>("/face/remove", { method: "DELETE" }, token),
  aiChat: (token: string | undefined, payload: Record<string, unknown>) =>
    request<AIAnswer>("/ai/chat", { method: "POST", body: JSON.stringify(payload) }, token),
  aiCitation: (token: string | undefined, payload: Record<string, unknown>) =>
    request<ApiEnvelope<{ citation: string }>>("/ai/citation", { method: "POST", body: JSON.stringify(payload) }, token),
  reportsLibrary: (token: string) => request<ApiEnvelope<Record<string, number>>>("/reports/library", {}, token),
  auditLogs: (token: string) => request<ApiEnvelope<Array<Record<string, unknown>>>>("/audit-logs", {}, token)
};
