// form.js — Multi-step form state machine and DOM rendering.

import { validateStep, stepSchemas } from "js/validation.js";

let currentStep = 1;
const TOTAL_STEPS = 3; // Step 1, Step 2, Review

export const formData = {
  referral: {
    firstName: "", lastName: "", email: "", phone: "", estimatedAmount: "",
    referralSource: "", relationship: "", notes: "",
  },
};

function collectStep(stepNum) {
  const inputs = document.querySelectorAll(`[data-step="${stepNum}"] [data-field]`);
  inputs.forEach((el) => {
    const field = el.dataset.field;
    if (field in formData.referral) {
      formData.referral[field] = el.type === "checkbox" ? el.checked : el.value;
    }
  });
}

export function flattenPayload() {
  return { ...formData.referral };
}

export function showFieldErrors(errors, stepNum) {
  clearFieldErrors(stepNum);
  for (const [field, msg] of Object.entries(errors)) {
    const input = document.querySelector(`[data-step="${stepNum}"] [data-field="${field}"]`);
    if (!input) continue;
    input.classList.add("input--error");
    input.setAttribute("aria-invalid", "true");
    const span = document.createElement("span");
    span.className = "field-error";
    span.setAttribute("role", "alert");
    span.textContent = msg;
    input.closest(".field").appendChild(span);
  }
  // Focus first error
  const first = document.querySelector(`[data-step="${stepNum}"] .input--error`);
  if (first) first.focus();
}

function clearFieldErrors(stepNum) {
  const panel = document.querySelector(`[data-step="${stepNum}"]`);
  if (!panel) return;
  panel.querySelectorAll(".input--error").forEach((el) => {
    el.classList.remove("input--error");
    el.removeAttribute("aria-invalid");
  });
  panel.querySelectorAll(".field-error").forEach((el) => el.remove());
}

function updateProgress(step) {
  document.querySelectorAll(".step-dot").forEach((dot, i) => {
    dot.classList.toggle("active", i + 1 === step);
    dot.classList.toggle("done", i + 1 < step);
  });
  const fill = document.getElementById("progress-fill");
  if (fill) fill.style.width = `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%`;

  // Update step labels
  document.querySelectorAll(".step-label").forEach((label, i) => {
    label.classList.toggle("active", i + 1 === step);
  });
}

function showStep(step) {
  document.querySelectorAll(".form-panel").forEach((panel) => {
    const s = parseInt(panel.dataset.step, 10);
    panel.hidden = s !== step;
    panel.setAttribute("aria-hidden", String(s !== step));
  });
  updateProgress(step);
  document.dispatchEvent(new CustomEvent("stepchange", { detail: { step, total: TOTAL_STEPS } }));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildReview() {
  const container = document.getElementById("review-content");
  if (!container) return;
  const d = formData.referral;
  const rows = [
    ["First Name",        d.firstName],
    ["Last Name",         d.lastName],
    ["Email",             d.email],
    ["Phone",             d.phone || "—"],
    ["Estimated Amount",  d.estimatedAmount ? `£${Number(d.estimatedAmount).toLocaleString()}` : "—"],
    ["Referral Source",   d.referralSource],
    ["Relationship",      d.relationship],
    ["Notes",             d.notes || "—"],
  ];
  container.innerHTML = rows.map(([label, val]) => `
    <div class="review-row">
      <span class="review-label">${label}</span>
      <span class="review-value">${val}</span>
    </div>
  `).join("");
}

export function goNext() {
  collectStep(currentStep);
  if (stepSchemas[currentStep]) {
    const stepData = currentStep === 1
      ? { firstName: formData.referral.firstName, lastName: formData.referral.lastName, email: formData.referral.email, phone: formData.referral.phone, estimatedAmount: formData.referral.estimatedAmount }
      : { referralSource: formData.referral.referralSource, relationship: formData.referral.relationship };
    const errors = validateStep(stepData, stepSchemas[currentStep]);
    if (Object.keys(errors).length > 0) { showFieldErrors(errors, currentStep); return; }
  }
  clearFieldErrors(currentStep);
  currentStep++;
  if (currentStep === 3) buildReview();
  showStep(currentStep);
}

export function goPrev() {
  if (currentStep <= 1) return;
  currentStep--;
  showStep(currentStep);
}

export function getCurrentStep() { return currentStep; }

export function setStep(n) { currentStep = n; showStep(n); }

export function initForm() { showStep(1); }
