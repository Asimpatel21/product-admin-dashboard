# Short note

**Choices I made**
- Used the Pages Router (not App Router) since the assignment's routing needs (`/products/[id]`, `/products/[id]/edit`) map cleanly onto file-based routes without extra client/server-component complexity.
- Kept all page/search/filter/sort state in the URL via `router.query` instead of component state, so refreshing or sharing a link reproduces the exact same view — the assignment explicitly asks for this.
- Search and category filter are treated as mutually exclusive (see README) because the API can't combine them; search wins and the category dropdown is disabled while searching.
- Since add/edit/delete don't really persist on DummyJSON, I layered a small `localStorage` "overlay" (`lib/localOverlay.js`) on top of every API response so the UI behaves like the changes are saved.

**A problem I faced and how I fixed it**
The trickiest part was the race condition in search: typing fast (especially with `&delay=2000` added to the API) could let an old, slow request's response arrive *after* a newer one and overwrite it with stale data. I fixed this with a simple incrementing request-id ref — each fetch captures its own id before calling the API, and when the response comes back it's only applied to state if that id is still the latest one. Anything older is silently dropped.

**Where AI helped**
I used an AI assistant to scaffold the overall file/folder structure and generate a first draft of each component and page, then read through and adjusted the logic myself (especially the query-string parsing/validation, the overlay approach for fake persistence, and the double-submit guards) so I can explain and modify every part of it.
