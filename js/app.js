// app.js — Entry point. Wires form + API + UI state together.

import { initForm, flattenPayload, setStep, goNext, goPrev } from "./form.js";
import { submitForm } from "./api.js";

function showLoading(visible) {
  const overlay = document.getElementById("loading-overlay");
  if (!overlay) return;
  overlay.hidden = !visible;
  overlay.setAttribute("aria-hidden", String(!visible));
}

function showSuccess(data) {
  document.getElementById("form-card").hidden = true;
  const s = document.getElementById("screen-success");
  s.hidden = false;
  const ref = data?.caseId ?? data?.referenceId ?? data?.id ?? null;
  if (ref) {
    const el = document.getElementById("success-ref");
    if (el) { el.textContent = `Reference: ${ref}`; el.hidden = false; }
  }
}

function showFailure(message, correlationId) {
  document.getElementById("form-card").hidden = true;
  const f = document.getElementById("screen-failure");
  f.hidden = false;
  const el = document.getElementById("failure-message");
  if (el) el.textContent = message || "An unexpected error occurred.";
  if (correlationId) {
    const c = document.getElementById("failure-corr");
    if (c) { c.textContent = `ID: ${correlationId}`; c.hidden = false; }
  }
}

async function handleSubmit() {
  showLoading(true);
  const payload = flattenPayload();
  const result = await submitForm(payload);
  showLoading(false);
  if (result.success) showSuccess(result.data);
  else showFailure(result.message, result.correlationId);
}

document.addEventListener("DOMContentLoaded", () => {
  initForm();

  document.getElementById("btn-next")?.addEventListener("click", goNext);
  document.getElementById("btn-prev")?.addEventListener("click", goPrev);
  document.getElementById("btn-submit")?.addEventListener("click", handleSubmit);
  document.getElementById("btn-retry")?.addEventListener("click", () => {
    document.getElementById("screen-failure").hidden = true;
    document.getElementById("form-card").hidden = false;
    setStep(3);
  });
  document.getElementById("btn-restart")?.addEventListener("click", () => window.location.reload());

  // Show/hide Prev & Submit based on step
  document.addEventListener("stepchange", (e) => {
    const { step, total } = e.detail;
    const prev   = document.getElementById("btn-prev");
    const next   = document.getElementById("btn-next");
    const submit = document.getElementById("btn-submit");
    if (prev)   prev.hidden   = step === 1;
    if (next)   next.hidden   = step === total;
    if (submit) submit.hidden = step !== total;
  });
});
