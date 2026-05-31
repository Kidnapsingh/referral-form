# pega-form-frontend

Responsive multi-step "Submit Referral" form hosted on GitHub Pages. Submits data to the Vercel backend which authenticates with Pega via OAuth2.

## Quick Start

```bash
git clone https://github.com/YOUR-USERNAME/pega-form-frontend.git
cd pega-form-frontend
python3 -m http.server 3000
# open http://localhost:3000
```

## Configuration

Edit **`js/config.js`** — set `API_BASE_URL` to your deployed Vercel backend URL.

## Structure

```
pega-form-frontend/
├── index.html        # All markup — 3-step form + outcome screens
├── css/styles.css    # Full design system
├── js/
│   ├── app.js        # Entry point
│   ├── form.js       # Step state machine
│   ├── validation.js # Validation rules
│   ├── api.js        # fetch wrapper
│   └── config.js     # ← Edit before deploying
└── assets/
```

## Form Steps

| Step | Content |
|------|---------|
| 1 | First Name, Last Name, Email, Phone, Estimated Amount |
| 2 | Referral Source, Relationship, Notes |
| 3 | Review & Confirm → Submit |

Flat payload sent to backend:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "+44 7700 900000",
  "estimatedAmount": "10000",
  "referralSource": "Word of Mouth",
  "relationship": "Colleague",
  "notes": ""
}
```

## GitHub Pages Deployment

1. Push to GitHub
2. Settings → Pages → Source: `main` / `/ (root)` → Save
3. Copy Pages URL → set as `ALLOWED_ORIGIN` in Vercel backend env vars
