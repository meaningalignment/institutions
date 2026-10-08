export function safeAdminRedirect(
  value: FormDataEntryValue | string | null | undefined
) {
  const path = String(value ?? "");
  // /researchers covers the community page, profiles, and the admin.
  return /^\/(?:researchers|appreciate)(?:[/?#]|$)/.test(path) && !path.startsWith("//")
    ? path
    : "/researchers/admin";
}
