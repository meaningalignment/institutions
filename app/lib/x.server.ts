// Thin client for the X API v2 list-member endpoints, signed with OAuth 1.0a
// user tokens for the account that owns the list (X_* env vars). Server-only;
// no database code here. Every call is billed by X (pay-per-use).
import crypto from "node:crypto";

const API = "https://api.x.com/2";

export interface XUser {
  id: string;
  username: string;
  name: string;
}

export interface XCredentials {
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  accessSecret: string;
}

export class XApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** The list and credentials from the environment, or null when X isn't set up. */
export function xConfig(): { listId: string; credentials: XCredentials } | null {
  const { X_API_KEY, X_API_SECRET, X_ACCESS_TOKEN, X_ACCESS_SECRET, X_LIST_ID } = process.env;
  if (!X_API_KEY || !X_API_SECRET || !X_ACCESS_TOKEN || !X_ACCESS_SECRET || !X_LIST_ID) {
    return null;
  }
  return {
    listId: X_LIST_ID,
    credentials: {
      apiKey: X_API_KEY,
      apiSecret: X_API_SECRET,
      accessToken: X_ACCESS_TOKEN,
      accessSecret: X_ACCESS_SECRET,
    },
  };
}

/** RFC 3986 percent-encoding, as OAuth 1.0a requires. */
function encode(value: string) {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}

export function authorizationHeader(
  credentials: XCredentials,
  method: string,
  url: URL,
  nonce = crypto.randomBytes(16).toString("hex"),
  timestamp = String(Math.floor(Date.now() / 1000))
) {
  const oauth: Record<string, string> = {
    oauth_consumer_key: credentials.apiKey,
    oauth_nonce: nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: timestamp,
    oauth_token: credentials.accessToken,
    oauth_version: "1.0",
  };
  // The signature covers the OAuth fields and query parameters. JSON bodies
  // are not form-encoded, so they're left out.
  const params = [...Object.entries(oauth), ...url.searchParams.entries()]
    .map(([k, v]) => [encode(k), encode(v)])
    .sort(([ak, av], [bk, bv]) => (ak === bk ? (av < bv ? -1 : 1) : ak < bk ? -1 : 1))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
  const base = [method, encode(url.origin + url.pathname), encode(params)].join("&");
  const key = `${encode(credentials.apiSecret)}&${encode(credentials.accessSecret)}`;
  const signature = crypto.createHmac("sha1", key).update(base).digest("base64");
  return (
    "OAuth " +
    Object.entries({ ...oauth, oauth_signature: signature })
      .map(([k, v]) => `${encode(k)}="${encode(v)}"`)
      .join(", ")
  );
}

export function createXClient(credentials: XCredentials) {
  async function request(
    method: string,
    path: string,
    { query, body }: { query?: Record<string, string | number | undefined>; body?: unknown } = {}
  ): Promise<any> {
    const url = new URL(API + path);
    for (const [k, v] of Object.entries(query ?? {})) {
      if (v !== undefined) url.searchParams.set(k, String(v));
    }
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: authorizationHeader(credentials, method, url),
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let json: any = {};
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      json = {};
    }
    if (!res.ok) {
      const detail = json.detail || json.title || json.errors?.[0]?.message || text;
      const reset = res.headers.get("x-rate-limit-reset");
      const hint =
        res.status === 429 && reset
          ? ` Try again after ${new Date(Number(reset) * 1000).toUTCString()}.`
          : "";
      throw new XApiError(`X said ${res.status}: ${detail}.${hint}`, res.status);
    }
    return json;
  }

  return {
    /** Every member of the list. */
    async listMembers(listId: string): Promise<XUser[]> {
      const members: XUser[] = [];
      let paginationToken: string | undefined;
      do {
        const page = await request("GET", `/lists/${listId}/members`, {
          query: {
            max_results: 100,
            "user.fields": "username,name",
            pagination_token: paginationToken,
          },
        });
        for (const u of page.data ?? []) {
          members.push({ id: u.id, username: u.username, name: u.name });
        }
        paginationToken = page.meta?.next_token;
      } while (paginationToken);
      return members;
    },

    /** Resolve usernames (no @) to users. Unknown or suspended names are left out. */
    async lookupUsernames(usernames: string[]): Promise<XUser[]> {
      const found: XUser[] = [];
      for (let i = 0; i < usernames.length; i += 100) {
        const page = await request("GET", "/users/by", {
          query: {
            usernames: usernames.slice(i, i + 100).join(","),
            "user.fields": "username,name",
          },
        });
        for (const u of page.data ?? []) {
          found.push({ id: u.id, username: u.username, name: u.name });
        }
      }
      return found;
    },

    async addMember(listId: string, userId: string) {
      await request("POST", `/lists/${listId}/members`, { body: { user_id: userId } });
    },

    async removeMember(listId: string, userId: string) {
      await request("DELETE", `/lists/${listId}/members/${userId}`);
    },
  };
}

export type XClient = ReturnType<typeof createXClient>;
