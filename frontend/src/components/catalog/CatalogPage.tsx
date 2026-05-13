import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { books as fallbackBooks, departments as fallbackDepartments, resources as fallbackResources } from "../../data/mock";
import type { Book, Resource } from "../../types";
import { Badge } from "../common/Badge";
import { SectionHeading } from "../common/SectionHeading";

export function CatalogPage() {
  const { locale = "uz" } = useParams();
  const { accessToken } = useAuth();
  const [books, setBooks] = useState<Book[]>(fallbackBooks);
  const [resources, setResources] = useState<Resource[]>(fallbackResources);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");

  useEffect(() => {
    api.books().then(setBooks).catch(() => undefined);
    api.departmentResources().then(setResources).catch(() => undefined);
  }, []);

  const filteredBooks = useMemo(() => books.filter((book) => {
    const matchesText = `${book.title} ${book.subject_name} ${book.department_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || book.department_name === departmentFilter;
    return matchesText && matchesDepartment;
  }), [books, departmentFilter, search]);

  const filteredResources = useMemo(() => resources.filter((resource) => {
    const matchesText = `${resource.title} ${resource.subject_name} ${resource.department_name}`.toLowerCase().includes(search.toLowerCase());
    const matchesDepartment = departmentFilter === "all" || resource.department_name === departmentFilter;
    return matchesText && matchesDepartment;
  }), [departmentFilter, resources, search]);

  async function quickReserve(bookId: number) {
    if (!accessToken) return;
    await api.reserveBook(accessToken, {
      book_id: bookId,
      pickup_date: "2026-05-14",
      pickup_time: "10:00"
    });
  }

  return (
    <div className="page">
      <SectionHeading
        eyebrow="Electronic catalog"
        title="Professional katalog, book copies va department resources"
        description="Search, filter sidebar, availability, reserve, online read, download va material metadata bir joyda."
      />
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <label>
            Search
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Book, subject, author..." />
          </label>
          <label>
            Department
            <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
              <option value="all">Barcha kafedralar</option>
              {fallbackDepartments.map((department) => (
                <option key={department.id} value={department.name}>{department.name}</option>
              ))}
            </select>
          </label>
          <div className="filter-summary">
            <span>Category filter</span>
            <span>Course filter</span>
            <span>Semester filter</span>
            <span>Availability filter</span>
            <span>Sorting</span>
            <span>Pagination preview</span>
          </div>
        </aside>
        <div className="catalog-content">
          <div className="content-section">
            <SectionHeading eyebrow="Books" title="Bosma va raqamli kitoblar" />
            <div className="preview-grid">
              {filteredBooks.map((book) => (
                <article key={book.id} className="preview-card">
                  <div className="preview-topline">
                    <Badge label={book.department_name} tone="info" />
                    <span>{book.available_copies}/{book.total_copies} copies</span>
                  </div>
                  <h3>{book.title}</h3>
                  <p>{book.summary}</p>
                  <div className="resource-meta">
                    <span>{book.subject_name}</span>
                    <span>{book.language}</span>
                    <span>{book.format}</span>
                    <span>{book.shelf_code}</span>
                  </div>
                  <div className="resource-actions">
                    <button type="button" className="ghost-button">O'qish</button>
                    <button type="button" className="ghost-button">Yuklab olish</button>
                    <button type="button" className="primary-button small" onClick={() => quickReserve(book.id)}>Band qilish</button>
                    <Link to={`/${locale}/reservations`} className="ghost-button">Batafsil</Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="content-section">
            <SectionHeading eyebrow="Resources" title="Kafedra resurslari" />
            <div className="preview-grid">
              {filteredResources.map((resource) => (
                <article key={resource.id} className="preview-card">
                  <div className="preview-topline">
                    <Badge label={resource.material_type} tone="warning" />
                    <span>{resource.average_rating} rating</span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <div className="resource-meta">
                    <span>{resource.department_name}</span>
                    <span>{resource.subject_name}</span>
                    <span>{resource.course}-kurs</span>
                    <span>{resource.semester}-semestr</span>
                  </div>
                  <div className="resource-actions">
                    <button type="button" className="ghost-button">O'qish</button>
                    <button type="button" className="ghost-button">Yuklab olish</button>
                    <button type="button" className="ghost-button">Saqlash</button>
                    <button type="button" className="ghost-button">APA citation</button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

