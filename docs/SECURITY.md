# Security Measures & Checklist

## Currently Implemented

### HTTP Security Headers (`next.config.ts`)
- `X-Frame-Options: DENY` — prevents clickjacking
- `X-Content-Type-Options: nosniff` — prevents MIME sniffing
- `Strict-Transport-Security` — forces HTTPS for 2 years
- `Referrer-Policy: strict-origin-when-cross-origin` — limits referrer leakage
- `Permissions-Policy` — disables camera, microphone, geolocation APIs

### Authentication
- Admin cookie: `httpOnly`, `secure` (in production), `sameSite: lax`
- Timing-safe password comparison (`crypto.timingSafeEqual`)
- Rate limiting on login: 5 attempts per 15 minutes per IP

### Input Validation (`src/lib/validation.ts`)
- Slug format validation (alphanumeric + hyphens only)
- URL validation (must be http/https)
- Array type checking on tags, screenshots, orderedSlugs
- Field allowlisting on project and about data (prevents arbitrary Firestore writes)
- All JSON parsing wrapped in try/catch

### File Upload Protection (`/api/admin/upload`)
- Image MIME type allowlist: JPEG, PNG, WebP, GIF, SVG
- 10MB file size limit
- Filename sanitization (strips special chars, limits length)

### SSRF Protection (`/api/admin/proxy-image`)
- URL allowlist: only `storage.googleapis.com` and `firebasestorage.googleapis.com`
- 10-second request timeout
- 15MB response size limit

### Error Handling
- Global error boundary (`src/app/error.tsx`)
- Generic error messages returned to clients (no stack traces leaked)
- Admin routes return 401 for unauthorized, not 403 (avoids confirming route existence)

---

## TODO — Before Production

### High Priority

- [ ] **Rotate all secrets** — Firebase service account key, `ADMIN_PASSWORD`, `ADMIN_TOKEN_VALUE`. Do this if `.env.local` was ever committed to git history. Use `git log --all --full-history -- .env.local` to check
- [ ] **Purge secrets from git history** — If found, use `git filter-repo` to remove `.env.local` from all commits, then force-push
- [ ] **Verify `.gitignore`** — Ensure `.env.local`, `.env*.local`, `*.pem`, `*.key`, `service-account*.json` are all listed
- [ ] **Set secrets via Vercel dashboard** — Never commit secrets to the repo. Use Vercel Environment Variables for production
- [ ] **Use a strong admin password** — At least 16 characters, random. Use a password manager
- [ ] **Firestore security rules** — Deploy rules that block all public writes:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read: if true;
        allow write: if false;
      }
    }
  }
  ```

### Medium Priority

- [ ] **Content Security Policy (CSP)** — Add a CSP header to restrict script sources. Requires a nonce for the theme init inline script. Example:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; style-src 'self' 'unsafe-inline'; img-src 'self' https://storage.googleapis.com https://firebasestorage.googleapis.com; font-src 'self'
  ```
- [ ] **CSRF tokens** — While `sameSite: lax` covers modern browsers, adding explicit CSRF tokens provides defense-in-depth. Generate a token per session, include in a custom header (`X-CSRF-Token`), validate server-side
- [ ] **Token expiration** — Admin tokens currently last 7 days. Consider shortening to 24 hours or implementing refresh tokens
- [ ] **Audit logging** — Log admin mutations (create/update/delete) to a Firestore `audit-log` collection with: action, timestamp, IP, user agent, before/after values
- [ ] **Run `npm audit`** — Check for known vulnerabilities in dependencies. Add `npm audit` to CI pipeline

### Low Priority (Nice to Have)

- [ ] **Two-factor authentication** — Add TOTP (e.g., Google Authenticator) for admin login using a library like `otpauth`
- [ ] **Server-side token revocation** — Maintain a blocklist for invalidated tokens so logout is immediate even if the cookie is intercepted
- [ ] **Rate limiting on all admin routes** — Currently only login is rate-limited. Consider adding rate limits to upload and project mutation endpoints
- [ ] **Subresource Integrity (SRI)** — Add `integrity` attributes to external script/stylesheet tags if any are added
- [ ] **Contact form instead of exposed email** — Replace the mailto link with a server-side contact form to prevent email harvesting by bots
- [ ] **Monitoring & alerting** — Set up error tracking (Sentry or Vercel's built-in) to catch runtime errors in production
- [ ] **Dependency update schedule** — Check for security updates monthly. Consider Dependabot or Renovate for automated PRs

---

## Quick Reference: Where Security Code Lives

| Concern | File |
|---------|------|
| Security headers | `next.config.ts` |
| Auth middleware | `src/middleware.ts` |
| Rate limiting | `src/lib/rate-limit.ts` |
| Input validation | `src/lib/validation.ts` |
| Login (rate limit + timing-safe) | `src/app/api/auth/login/route.ts` |
| Upload validation | `src/app/api/admin/upload/route.ts` |
| SSRF protection | `src/app/api/admin/proxy-image/route.ts` |
| Field sanitization | `src/app/api/admin/projects/route.ts`, `src/app/api/admin/about/route.ts` |
| Error boundary | `src/app/error.tsx` |
