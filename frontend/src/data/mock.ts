import type { Book, Department, Faculty, ReadingRoom, Resource, Seat } from "../types";

export const faculties: Faculty[] = [
  { id: 1, slug: "raqamli-texnologiyalar", name: "Raqamli texnologiyalar fakulteti" },
  { id: 2, slug: "ijtimoiy-fanlar", name: "Ijtimoiy fanlar fakulteti" }
];

export const departments: Department[] = [
  {
    id: 1,
    faculty_id: 1,
    slug: "axborot-texnologiyalari",
    name: "Axborot texnologiyalari kafedrasi",
    summary: "Sun’iy intellekt, dasturlash, ma’lumotlar bazasi va kiberxavfsizlik resurslari.",
    head_name: "DSc. Dilorom Karimova",
    resources_count: 184,
    subjects_count: 22,
    teachers_count: 17,
    downloads_count: 16320,
    active_subject: "Ma’lumotlar bazasi",
    updated_at: "2026-05-13T10:00:00",
    has_new_materials: true
  },
  {
    id: 2,
    faculty_id: 1,
    slug: "iqtisodiyot",
    name: "Iqtisodiyot kafedrasi",
    summary: "Moliyaviy tahlil, menejment va iqtisodiy modellashtirish resurslari.",
    head_name: "PhD. Bekzod Rasulov",
    resources_count: 127,
    subjects_count: 18,
    teachers_count: 12,
    downloads_count: 11480,
    active_subject: "Mikroiqtisodiyot",
    updated_at: "2026-05-12T09:00:00",
    has_new_materials: true
  },
  {
    id: 3,
    faculty_id: 1,
    slug: "matematika",
    name: "Matematika kafedrasi",
    summary: "Oliy matematika, statistika va analitik modellar to‘plami.",
    head_name: "Dots. Nilufar Abdullayeva",
    resources_count: 93,
    subjects_count: 14,
    teachers_count: 9,
    downloads_count: 8420,
    active_subject: "Ehtimollar nazariyasi",
    updated_at: "2026-05-10T13:30:00",
    has_new_materials: false
  },
  {
    id: 4,
    faculty_id: 2,
    slug: "filologiya",
    name: "Filologiya kafedrasi",
    summary: "Tilshunoslik, akademik yozuv va tarjima amaliyoti resurslari.",
    head_name: "PhD. Mohira Xudoyberdiyeva",
    resources_count: 88,
    subjects_count: 12,
    teachers_count: 8,
    downloads_count: 6570,
    active_subject: "Akademik yozuv",
    updated_at: "2026-05-11T15:20:00",
    has_new_materials: true
  },
  {
    id: 5,
    faculty_id: 2,
    slug: "tarix",
    name: "Tarix kafedrasi",
    summary: "O‘zbekiston tarixi, manbashunoslik va ilmiy maqolalar jamlanmasi.",
    head_name: "Prof. Abdumalik Turg‘unov",
    resources_count: 76,
    subjects_count: 11,
    teachers_count: 7,
    downloads_count: 4890,
    active_subject: "O‘zbekiston tarixi",
    updated_at: "2026-05-08T11:10:00",
    has_new_materials: false
  },
  {
    id: 6,
    faculty_id: 2,
    slug: "pedagogika",
    name: "Pedagogika kafedrasi",
    summary: "Ta’lim metodikasi, pedagogik texnologiyalar va amaliy kuzatuvlar.",
    head_name: "Dots. Shaxnoza Mamatova",
    resources_count: 102,
    subjects_count: 16,
    teachers_count: 10,
    downloads_count: 7030,
    active_subject: "Ta’lim metodikasi",
    updated_at: "2026-05-12T16:45:00",
    has_new_materials: true
  }
];

export const resources: Resource[] = [
  {
    id: 1,
    title: "Ma’lumotlar bazasi: 2-kurs laboratoriya ishlari",
    description: "SQL, indekslash, tranzaksiyalar va ORM asosida ishlab chiqilgan laboratoriya to‘plami.",
    author_name: "Aziza Yuldasheva",
    department_id: 1,
    department_name: "Axborot texnologiyalari kafedrasi",
    subject_name: "Ma’lumotlar bazasi",
    course: 2,
    semester: 4,
    language: "uz",
    material_type: "Laboratoriya ishi",
    format: "PDF",
    views_count: 1230,
    downloads_count: 742,
    average_rating: 4.8,
    status: "approved",
    cover_url: null,
    file_url: null,
    online_read_allowed: true,
    download_allowed: true,
    academic_year: "2025/2026",
    keywords: ["sql", "orm", "postgresql"],
    tags: ["lab", "db", "backend"]
  },
  {
    id: 2,
    title: "Kiberxavfsizlik bo‘yicha o‘zbekcha darslik",
    description: "Tarmoq xavfsizligi, autentifikatsiya va risklarni boshqarish bo‘yicha asosiy o‘quv qo‘llanma.",
    author_name: "Jasur Qodirov",
    department_id: 1,
    department_name: "Axborot texnologiyalari kafedrasi",
    subject_name: "Kiberxavfsizlik",
    course: 3,
    semester: 5,
    language: "uz",
    material_type: "Darslik",
    format: "PDF",
    views_count: 1890,
    downloads_count: 1102,
    average_rating: 4.9,
    status: "approved",
    cover_url: null,
    file_url: null,
    online_read_allowed: true,
    download_allowed: true,
    academic_year: "2025/2026",
    keywords: ["security", "auth", "risk"],
    tags: ["cyber", "textbook"]
  },
  {
    id: 3,
    title: "Mikroiqtisodiyot bo‘yicha case study to‘plami",
    description: "Talab, taklif va narx elastikligi bo‘yicha mahalliy biznes misollari.",
    author_name: "Nodira Mamatqulova",
    department_id: 2,
    department_name: "Iqtisodiyot kafedrasi",
    subject_name: "Mikroiqtisodiyot",
    course: 1,
    semester: 2,
    language: "uz",
    material_type: "Amaliy mashg‘ulot",
    format: "DOCX",
    views_count: 780,
    downloads_count: 344,
    average_rating: 4.4,
    status: "approved",
    cover_url: null,
    file_url: null,
    online_read_allowed: true,
    download_allowed: true,
    academic_year: "2025/2026",
    keywords: ["elasticity", "market", "cases"],
    tags: ["economy", "practice"]
  },
  {
    id: 4,
    title: "Akademik yozuv: iqtibos va bibliografiya",
    description: "APA, MLA va Chicago uslublariga mos yozuv va citation qo‘llanmasi.",
    author_name: "Mahliyo Rahmonova",
    department_id: 4,
    department_name: "Filologiya kafedrasi",
    subject_name: "Akademik yozuv",
    course: 2,
    semester: 3,
    language: "en",
    material_type: "Metodik qo‘llanma",
    format: "PDF",
    views_count: 980,
    downloads_count: 522,
    average_rating: 4.7,
    status: "approved",
    cover_url: null,
    file_url: null,
    online_read_allowed: true,
    download_allowed: true,
    academic_year: "2025/2026",
    keywords: ["citation", "writing", "apa"],
    tags: ["style", "methodology"]
  }
];

export const books: Book[] = [
  {
    id: 1,
    title: "Advanced Database Systems",
    author_names: ["Carlos Coronel", "Steven Morris"],
    department_name: "Axborot texnologiyalari kafedrasi",
    subject_name: "Ma’lumotlar bazasi",
    language: "en",
    format: "Print + PDF",
    available_copies: 3,
    total_copies: 5,
    rating: 4.9,
    views_count: 804,
    downloads_count: 221,
    summary: "Transaction processing, distributed systems, and normalization patterns.",
    shelf_code: "AT-DB-204"
  },
  {
    id: 2,
    title: "Kiberxavfsizlik asoslari",
    author_names: ["Shavkat Raximov"],
    department_name: "Axborot texnologiyalari kafedrasi",
    subject_name: "Kiberxavfsizlik",
    language: "uz",
    format: "Print",
    available_copies: 1,
    total_copies: 4,
    rating: 4.6,
    views_count: 612,
    downloads_count: 0,
    summary: "Threat modeling, identity protection, and secure campus infrastructure.",
    shelf_code: "AT-SEC-118"
  },
  {
    id: 3,
    title: "Principles of Microeconomics",
    author_names: ["N. Gregory Mankiw"],
    department_name: "Iqtisodiyot kafedrasi",
    subject_name: "Mikroiqtisodiyot",
    language: "en",
    format: "Print + EPUB",
    available_copies: 2,
    total_copies: 3,
    rating: 4.5,
    views_count: 402,
    downloads_count: 96,
    summary: "Market equilibrium, elasticity, incentives, and macro connections.",
    shelf_code: "IQ-MIC-101"
  }
];

export const readingRooms: ReadingRoom[] = [
  {
    id: 1,
    name: "Markaziy o‘quv zali",
    floor: "2-qavat",
    total_seats: 30,
    available_seats: 23,
    occupancy_rate: 23
  },
  {
    id: 2,
    name: "IT quiet zone",
    floor: "3-qavat",
    total_seats: 18,
    available_seats: 7,
    occupancy_rate: 61
  }
];

export const seats: Seat[] = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  reading_room_id: 1,
  code: `A-${index + 1}`,
  row_label: ["A", "B", "C", "D", "E"][Math.floor(index / 6)],
  seat_number: (index % 6) + 1,
  status: index % 7 === 0 ? "reserved" : index % 9 === 0 ? "occupied" : "available"
}));

