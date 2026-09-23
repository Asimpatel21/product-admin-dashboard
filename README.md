# Product Admin Dashboard

## Live Demo
🔗 https://product-admin-dashboard-xxxx.vercel.app

A small admin dashboard built with **Next.js (Pages Router)**, **React**, **Tailwind CSS**, and **Axios**, using the free [DummyJSON](https://dummyjson.com) API.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000 — you'll be redirected to `/login`.

**Login:** `emilys` / `emilyspass`

To build for production:

```bash
npm run build
npm run start
```

## What's finished

- [x] Login with DummyJSON `/auth/login`, error message on wrong credentials, logout button
- [x] Route protection — `/products/*` pages redirect to `/login` if not authenticated
- [x] Product list — image, title, category, price, rating, stock
- [x] Responsive layout — table on desktop, cards on mobile (Tailwind breakpoints, no JS)
- [x] Pagination — page numbers, Previous/Next, page-size selector (10/20/50), "Showing X–Y of Z"
- [x] Debounced search (500ms) against `/products/search`, resets to page 1 on change
- [x] Category filter (`/products/categories`) and sort by price / rating / title, asc/desc
- [x] Product detail page at `/products/[id]` with images, description, price, reviews
- [x] "Not found" state for an invalid product id
- [x] Add / edit product with validation, delete with a confirm popup
- [x] Loading / empty / error states everywhere data is fetched, with a Retry button
- [x] One shared Axios instance (`lib/axios.js`) — attaches the token and normalizes errors in one place
- [x] Page, search, category, and sort are all kept in the URL (shareable / refresh-safe)
- [x] No React Query / SWR / table libraries — all state and fetching logic is hand-written
- [x] Race-condition-safe search (a request-id ref ignores stale responses)
- [x] Bad URL values (`?page=abc`, `?page=999`) are handled instead of crashing
- [x] Login and Save buttons are guarded against double-submit (ref lock + disabled state)

## Project structure

```
lib/axios.js           shared Axios instance (token + error handling)
lib/api/*.js            one file per API resource (auth, products)
lib/localOverlay.js      keeps add/edit/delete changes in localStorage (see note below)
context/AuthContext.js   auth state (login/logout/isAuthenticated)
hooks/useDebounce.js     generic debounce hook
components/*             small, single-purpose UI pieces
pages/*                  routes (login, products list, detail, new, edit)
```

## Notes on the two tricky requirements

**Search + category at the same time:** DummyJSON's API can't do both in one call, so this app treats search as taking priority — starting a search clears any active category filter, and the category dropdown is disabled while the search box has text. This keeps the URL state unambiguous (you're always either searching or filtering, never both).

**Add/edit/delete aren't really saved by the API:** DummyJSON's `/products/add`, `PUT /products/:id`, and `DELETE /products/:id` all return a success response but don't change what a later `GET` returns. To make the app still feel real, `lib/localOverlay.js` keeps a small record (added / edited / deleted) in `localStorage`, and every list of products fetched from the API is passed through `applyOverlay()` before it's shown. So a new product actually appears in the list, an edit actually shows up, and a deleted product actually disappears — even after a refresh — without needing a real backend.

## Submission checklist (fill in before submitting)

- [ ] Push this to a public GitHub repo with multiple commits (not one big commit)
- [ ] Deploy to Vercel or Netlify and add the live link here
- [ ] Add your short note (see `NOTES.md`) about your choices, a problem you hit, and where AI helped
