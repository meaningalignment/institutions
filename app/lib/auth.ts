export function safeAdminRedirect(
  value: FormDataEntryValue | string | null | undefined
) {
  const path = String(value ?? "");
  return /^\/researchers\/admin(?:\/|$)/.test(path) && !path.startsWith("//")
    ? path
    : "/researchers/admin";
}
