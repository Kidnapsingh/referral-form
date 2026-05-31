// api.js — Handles all communication with the Vercel backend.
// The frontend never contacts Pega directly.

import CONFIG from "./config.js";

export async function submitForm(payload) {
  const url = `${CONFIG.API_BASE_URL}${CONFIG.API_SUBMIT_ENDPOINT}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const json = await response.json();
    if (!response.ok) {
      return { success: false, message: json.message || `Error ${response.status}.`, correlationId: json.correlationId ?? null };
    }
    return { success: true, data: json };
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === "AbortError") return { success: false, message: "The request timed out. Please try again." };
    return { success: false, message: "Unable to reach the server. Check your connection." };
  }
}
