export type Locale = "uz" | "ru" | "en" | "tr";

export type Role = "admin" | "student" | "teacher" | "librarian" | "department";

export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

export interface User {
  id: number;
  full_name: string;
  email: string;
  role: Role;
  department_id?: number | null;
  faculty_id?: number | null;
  avatar_url?: string | null;
  phone?: string | null;
  student_id?: string | null;
  teacher_title?: string | null;
  face_id_enabled?: boolean;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse extends AuthTokens {
  user: User;
}

export interface Department {
  id: number;
  faculty_id: number;
  slug: string;
  name: string;
  summary: string;
  head_name: string;
  resources_count: number;
  subjects_count: number;
  teachers_count: number;
  downloads_count: number;
  active_subject: string;
  updated_at: string;
  has_new_materials: boolean;
}

export interface Faculty {
  id: number;
  name: string;
  slug: string;
}

export interface Resource {
  id: number;
  title: string;
  description: string;
  author_name: string;
  department_id: number;
  department_name?: string;
  subject_name: string;
  course: number;
  semester: number;
  language: string;
  material_type: string;
  format: string;
  views_count: number;
  downloads_count: number;
  average_rating: number;
  status: string;
  cover_url?: string | null;
  file_url?: string | null;
  online_read_allowed: boolean;
  download_allowed: boolean;
  academic_year: string;
  keywords: string[];
  tags: string[];
}

export interface Book {
  id: number;
  title: string;
  author_names: string[];
  department_name: string;
  subject_name: string;
  language: string;
  format: string;
  available_copies: number;
  total_copies: number;
  rating: number;
  views_count: number;
  downloads_count: number;
  summary: string;
  shelf_code: string;
}

export interface Reservation {
  id: number;
  book_id: number;
  book_title: string;
  pickup_date: string;
  pickup_time: string;
  status: string;
  qr_code: string;
}

export interface Loan {
  id: number;
  book_title: string;
  issued_at: string;
  due_at: string;
  returned_at?: string | null;
  status: string;
  renewal_count: number;
  fine_amount: number;
  remaining_days: number;
}

export interface Seat {
  id: number;
  reading_room_id: number;
  code: string;
  row_label: string;
  seat_number: number;
  status: string;
}

export interface ReadingRoom {
  id: number;
  name: string;
  floor: string;
  total_seats: number;
  available_seats: number;
  occupancy_rate: number;
}

export interface AIAnswer {
  answer: string;
  sources: Array<{
    id: number;
    title: string;
    department: string;
    subject: string;
    author: string;
    format: string;
    citation: string;
  }>;
}

