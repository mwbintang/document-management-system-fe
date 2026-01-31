// import { encryptPayload } from "./crypto-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";
// const AES_KEY = process.env.NEXT_PUBLIC_AES_HEX_KEY;
// const HMAC_KEY = process.env.NEXT_PUBLIC_HMAC_KEY;

export interface ApiClientOptions extends RequestInit {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: any; // can be plain object
  file?: boolean;
}

export async function apiClient(
  endpoint: string,
  {
    method = "GET",
    body,
    file = false
  }: ApiClientOptions = {}
): Promise<any> {
  const config: RequestInit = {
    method,
  };

  if (body && !file) {
    config.body = typeof body === "string" ? body : JSON.stringify(body);
    config.headers = {
      "Content-Type": "application/json",
    };
  } else {
    config.body = body;
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config);
  console.log("API Response:", res);

  if (!res.ok) {
    let errorMsg = `API error: ${res?.status} ${res?.statusText}`;
    try {
      const errData = await res.json();
      errorMsg = errData?.message || errorMsg;
    } catch (error) {
      console.error("Error parsing error response:", error);
    }

    throw new Error(errorMsg);
  }

  // ✅ SAFE RESPONSE HANDLING
  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await res.json();
  }

  return null; // DELETE / empty response
}
