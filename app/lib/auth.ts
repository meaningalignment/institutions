export function safeAdminRedirect(
  value: FormDataEntryValue | string | null | undefined
) {
  const path = String(value ?? "");
  return /^\/admin(?:\/|$)/.test(path) && !path.startsWith("//") ? path : "/admin";
}
