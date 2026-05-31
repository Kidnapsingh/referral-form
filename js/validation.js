// validation.js — Pure validation rules and step schemas.

export const rules = {
  required: (value) => ({
    valid: String(value ?? "").trim().length > 0,
    message: "This field is required.",
  }),
  email: (value) => ({
    valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value ?? "").trim()),
    message: "Please enter a valid email address.",
  }),
  phone: (value) => {
    const v = String(value ?? "").trim();
    return {
      valid: v === "" || /^[\d\s\+\-\(\)]{7,20}$/.test(v),
      message: "Please enter a valid phone number.",
    };
  },
  amount: (value) => {
    const v = String(value ?? "").trim();
    return {
      valid: v === "" || /^\d+(\.\d{1,2})?$/.test(v),
      message: "Please enter a valid amount (e.g. 5000 or 5000.00).",
    };
  },
  minLength: (min) => (value) => ({
    valid: String(value ?? "").trim().length >= min,
    message: `Must be at least ${min} characters.`,
  }),
};

export function validateField(value, fieldRules = []) {
  for (const rule of fieldRules) {
    const result = rule(value);
    if (!result.valid) return result.message;
  }
  return null;
}

export function validateStep(data, schema) {
  const errors = {};
  for (const [field, fieldRules] of Object.entries(schema)) {
    const msg = validateField(data[field], fieldRules);
    if (msg) errors[field] = msg;
  }
  return errors;
}

export const stepSchemas = {
  1: {
    firstName:       [rules.required, rules.minLength(2)],
    lastName:        [rules.required, rules.minLength(2)],
    email:           [rules.required, rules.email],
    phone:           [rules.phone],
    estimatedAmount: [rules.amount],
  },
  2: {
    referralSource: [rules.required],
    relationship:   [rules.required],
  },
};
