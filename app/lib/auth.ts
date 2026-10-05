export function safeAdminRedirect(
  value: FormDataEntryValue | string | null | undefined
) {
  const path = String(value ?? "");
  return /^\/(?:researchers\/admin|appreciate)(?:[/?#]|$)/.test(path) && !path.startsWith("//")
    ? path
    : "/researchers/admin";
}
