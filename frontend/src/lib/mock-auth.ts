import type { AuthResponse, User } from "../types";

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  "student@atmu.uz": {
    password: "Student123!",
    user: { id: 1, full_name: "Bobur Toshmatov", email: "student@atmu.uz", role: "student", department_id: 1, student_id: "AT-2301", face_id_enabled: false }
  },
  "teacher@atmu.uz": {
    password: "Teacher123!",
    user: { id: 2, full_name: "Aziza Yuldasheva", email: "teacher@atmu.uz", role: "teacher", department_id: 1, teacher_title: "Dots.", face_id_enabled: false }
  },
  "librarian@atmu.uz": {
    password: "Librarian123!",
    user: { id: 3, full_name: "Mohira Xudoyberdiyeva", email: "librarian@atmu.uz", role: "librarian", face_id_enabled: false }
  },
  "department@atmu.uz": {
    password: "Department123!",
    user: { id: 4, full_name: "DSc. Dilorom Karimova", email: "department@atmu.uz", role: "department", department_id: 1, face_id_enabled: false }
  },
  "admin@atmu.uz": {
    password: "Admin123!",
    user: { id: 5, full_name: "Administrator", email: "admin@atmu.uz", role: "admin", face_id_enabled: false }
  },
};

export function mockLogin(email: string, password: string): AuthResponse {
  const entry = MOCK_USERS[email.toLowerCase().trim()];
  if (!entry) throw new Error("Bu email ro'yxatdan o'tmagan.");
  if (entry.password !== password) throw new Error("Parol noto'g'ri.");
  return {
    access_token: `mock_token_${entry.user.role}_${Date.now()}`,
    refresh_token: `mock_refresh_${entry.user.role}`,
    token_type: "bearer",
    user: entry.user,
  };
}

export function mockMe(token: string): User {
  const role = token.split("_")[2] as string;
  const entry = Object.values(MOCK_USERS).find((u) => u.user.role === role);
  if (!entry) throw new Error("Token yaroqsiz.");
  return entry.user;
}
