export function canApprove(role?: string | null) {
  return role === "admin" || role === "librarian" || role === "department";
}

export function canUploadResources(role?: string | null) {
  return role === "teacher" || role === "department" || role === "admin";
}

export function canManageLoans(role?: string | null) {
  return role === "librarian" || role === "admin";
}

