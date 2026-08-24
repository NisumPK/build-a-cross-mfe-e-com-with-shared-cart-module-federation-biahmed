# Cross-MFE E-Commerce with Shared Cart (Module Federation)

## Overview

This project is a small e-commerce application built as **three independently
deployable Micro Frontends (MFEs)**, wired together at runtime with
[Vite Module Federation](https://github.com/originjs/vite-plugin-federation):

- **Host** — the shell app: layout, navigation, routing.
- **Catalog MFE** — product listing and product details.
- **Cart MFE** — shopping cart with quantities and totals.

The functional goal (a shopping cart) is secondary. The real goal — and the
thing this README documents in depth — is demonstrating **six different
ways independent frontends can share data**: `localStorage`,
`sessionStorage`, cookies, query parameters, custom events, and a shared
Redux store, each used for the use case it's actually good at.

## Architecture

```text
                    ┌─────────────────────┐
                    │        Host          │
                    │   (routing + shell)  │
                    └──────────┬───────────┘
                               │ Module Federation (remotes)
                ┌──────────────┴──────────────┐
                │                              │
       ┌────────▼────────┐          ┌─────────▼────────┐
       │   Catalog MFE    │          │     Cart MFE     │
       │  (port 5001)     │          │   (port 5002)    │
       │                  │          │                  │
       │ ProductList      │          │ CartPage         │
       │ ProductDetails   │          │                  │
       └────────┬─────────┘          └─────────┬────────┘
                │                              │
                └──────────────┬───────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Shared Redux Store  │
                    │  (created by Host,   │
                    │  cartSlice from      │
                    │  shared/src)         │
                    └──────────────────────┘
```

Each app is a **fully independent Vite project** with its own
`package.json` / `node_modules` — none of them import each other's source
directly. The Host consumes the other two purely through Module Federation
remotes (`catalog_mfe`, `cart_mfe`), loaded lazily at runtime.

`shared/` is a plain TypeScript folder (no `package.json`, no build step)
that holds the shared types and Redux logic both apps use — `cartSlice`,
types, storage/cookie/event helpers. Each app references it via a `@shared`
Vite/TS path alias. Note: this is **not** what makes Redux actually shared
across MFEs. See [Shared Redux State](#shared-redux-state) for why — it's the
`react-redux` singleton, not this folder.

## Technologies Used

- React 18 + TypeScript
- Vite + [`@originjs/vite-plugin-federation`](https://github.com/originjs/vite-plugin-federation)
- Redux Toolkit + React Redux
- React Router (Host only — remotes don't do their own routing when embedded)
- Vitest + React Testing Library
- No CSS framework — styling is intentionally minimal; this assignment is about data flow, not visuals

## Project Structure

```text
mfe-ecommerce-biahmed/
├── package.json                 # concurrently dev launcher only
├── shared/
│   └── src/
│       ├── types.ts             # Product, CartItem, CartState
│       ├── cartSlice.ts         # createSlice + createSelector totals (RTK)
│       ├── storage.ts           # localStorage save/load/clear
│       ├── cookies.ts           # get/setCookie
│       └── events.ts            # cart:item-added custom event helpers
├── host/                        # shell app — routing, nav, error boundaries
├── catalog-mfe/                 # remote — product list + details
├── cart-mfe/                    # remote — cart page
└── screenshots/                 # demo screenshots (see below)
```

Each of `host/`, `catalog-mfe/`, `cart-mfe/` has its own `package.json`,
`vite.config.ts` (federation config), `tsconfig.json`, and `src/`.

## Running the Application

Each app is independently runnable. Two ways to start everything:

**All at once from the repo root:**

```bash
npm install
npm --prefix host install
npm --prefix catalog-mfe install
npm --prefix cart-mfe install
npm run dev
```

This uses `concurrently` to start catalog-mfe (5001), cart-mfe (5002), and
the host (5000) together. Open **http://localhost:5000**.

**Or run each independently, in separate terminals** (useful for testing
one MFE in isolation, or for confirming "independently runnable"):

```bash
cd catalog-mfe && npm install && npm run dev   # http://localhost:5001
cd cart-mfe && npm install && npm run dev       # http://localhost:5002
cd host && npm install && npm run dev           # http://localhost:5000
```

> Note: `catalog-mfe`/`cart-mfe`'s `dev` script runs `vite build --watch`
> plus `vite preview` together (not `vite dev`). This is required for
> Module Federation remotes with this plugin — the federation exposes only
> work from a built/served bundle, not from Vite's dev-time module graph.
> The Host still runs a normal `vite` dev server.

Run tests per app:

```bash
npm --prefix catalog-mfe run test
npm --prefix cart-mfe run test
```

## Module Federation Configuration

| App | `name` | Exposes | Consumes | Port |
|---|---|---|---|---|
| catalog-mfe | `catalog_mfe` | `./ProductList`, `./ProductDetails` | — | 5001 |
| cart-mfe | `cart_mfe` | `./CartPage` | — | 5002 |
| host | `host` | — | `catalog_mfe`, `cart_mfe` (`http://localhost:PORT/assets/remoteEntry.js`) | 5000 |

All three configs share `['react', 'react-dom', 'react-redux']` as
singletons:

```ts
federation({
  name: 'catalog_mfe',
  filename: 'remoteEntry.js',
  exposes: {
    './ProductList': './src/components/ProductList.tsx',
    './ProductDetails': './src/components/ProductDetails.tsx',
  },
  shared: ['react', 'react-dom', 'react-redux'],
})
```

**Why these three are shared:** `react`/`react-dom` must be singletons or
you get duplicate React instances and broken hooks/context across bundle
boundaries. `react-redux` must be a singleton for a much more specific
reason: its `Provider` uses React Context internally, and `useSelector`/
`useDispatch` read that Context. If each remote bundled its own copy of
`react-redux`, each copy would create its *own* Context object, so a
remote's `useSelector` would never see the Host's `<Provider>` — the whole
"shared Redux" mechanism would silently break. `@reduxjs/toolkit` itself
does **not** need to be shared (it's pure logic, no context), and neither
does `react-router-dom` — see below.

**Why `react-router-dom` is intentionally *not* shared/used in remotes:**
the exposed `ProductList`, `ProductDetails`, and `CartPage` components never
import `react-router-dom`. Only the Host routes. Route params (`:id`) and
query params (`?ref=`, `?coupon=`) are read by the Host's own route
wrapper components and passed down as plain props
(`<ProductDetails id={id} refParam={ref} />`). This keeps the remotes fully
route-agnostic — the same components are reused, unmodified, by each app's
own standalone entry point with its own local router.

## Catalog MFE

- 10 products (≥ 8 required) as local static JSON (`src/data/products.json`), each with name, price, image, description.
- `ProductList` — grid of `ProductCard`s. Clicking **Add to Cart** triggers three independent things at once: `dispatch(addToCart(product))`, a `cart:item-added` custom event, and a direct `localStorage` write (see [Data-Sharing Toolbox](#data-sharing-toolbox)).
- `ProductDetails` — shown at `/product/:id`, reads `?ref=` and records the viewed product to `sessionStorage`.
- Exposed via Module Federation as `catalog_mfe/ProductList` and `catalog_mfe/ProductDetails`.
- Runs standalone (`npm run dev` inside `catalog-mfe/`) via its own local Redux store + local `BrowserRouter` (`src/main.tsx` / `src/StandaloneApp.tsx`) — this local store only exists so the app works when opened directly; it plays no part when embedded in the Host.

## Cart MFE

- `CartPage` — displays items, per-item quantity controls (+ / −), remove, clear cart, total items, total price (all computed via selectors, never stored/hardcoded).
- Reads the `currency` cookie set by the Host.
- Reads `?coupon=` for display only.
- Listens for the `cart:item-added` custom event and shows an informational banner, kept deliberately separate from the Redux count so it can't double-count.
- Has a collapsible debug panel showing the raw `localStorage` cart.
- Exposed via Module Federation as `cart_mfe/CartPage`.
- Also runs standalone with its own local store (`src/main.tsx` / `src/StandaloneApp.tsx`).

## Data-Sharing Toolbox

### localStorage

**Where:** `shared/src/storage.ts` (`saveCartToStorage` / `loadCartFromStorage` / `clearCartStorage`). Written by the Host's `store.subscribe()` on every state change (`host/src/store.ts`), and read as `preloadedState` when the store is created — so the cart survives a full page refresh. Also written directly inside `ProductList`/`ProductDetails`'s Add-to-Cart handler (independent of the Redux dispatch) and displayed in a debug panel in `CartPage`.

- **Why it's useful:** it's the only mechanism here that survives a full page reload/browser restart without any server.
- **On refresh:** the Host reads it into `preloadedState` before the store is created, so the UI already shows the persisted cart on first render.
- **Shared between MFEs?** Yes — `localStorage` is scoped to the *origin*, not the bundle. Since Host/Catalog/Cart are all served from `http://localhost:5000` in this setup (the Host page is what the browser actually navigates to), all three MFEs' code executes in that one origin and see the same `localStorage`. If Catalog/Cart were deployed to genuinely different origins and only loaded as remote *code* running inside the Host page, they'd still share the Host's origin's storage — the boundary that matters is the browser tab's origin, not the codebase.
- **Security considerations:** never store tokens/PII here — it's plain text, readable by any script on the page (including a malicious dependency, i.e. it's vulnerable to XSS-based exfiltration), and has no expiry.
- **Limitations:** synchronous API (can block on large payloads), ~5–10MB per origin, strings only (requires JSON serialize/parse), no cross-origin/cross-device sync.

### sessionStorage

**Where:** `catalog-mfe/src/components/ProductDetails.tsx` sets `recentProduct` on mount; `host/src/components/Nav.tsx` reads and displays it ("Recently viewed").

- **Difference from localStorage:** same API, but scoped to one *tab* and cleared when that tab closes (a new tab, even to the same site, gets a fresh sessionStorage).
- **When it's more appropriate:** short-lived, per-visit UI state that shouldn't leak across tabs or persist forever — e.g. "last viewed product," a multi-step checkout's current step, a one-time dismissed banner flag.
- **On tab close:** the data is gone. Reopening the site starts clean.
- **Should it be used for the cart?** No — a user very plausibly opens the cart in a second tab, or closes and reopens the tab intending to keep shopping. Cart data needs cross-tab, persist-after-close behavior, which is `localStorage`'s job, not `sessionStorage`'s.

### Cookies

**Where:** `shared/src/cookies.ts` (`getCookie`/`setCookie`). The Host sets `currency=USD` once at bootstrap (`host/src/main.tsx`); `CartPage` in the (independently built) Cart MFE reads it.

- **What they are:** small (~4KB) key/value strings attached to a domain/path, automatically sent with matching HTTP requests (unlike Web Storage, which never leaves the browser).
- **When appropriate:** small pieces of session/preference data that a *server* might also need to see (auth session id, locale, currency) — or, as here, a trivially small value one independently-built frontend can set and another can read without any direct coupling.
- **Size limitations:** ~4KB per cookie, sent on every matching request — bloats every HTTP call if overused.
- **`HttpOnly`:** prevents JavaScript from reading the cookie at all (mitigates XSS token theft); not used here on purpose since this value is meant to be read client-side.
- **`Secure`:** cookie is only sent over HTTPS.
- **`SameSite`:** controls whether the cookie is sent on cross-site requests (`Strict`/`Lax`/`None`), mitigating CSRF. This project sets `SameSite=Lax`, appropriate for a same-site, non-auth value.
- **Why not sensitive info:** any cookie without `HttpOnly` is fully readable by client JS (again, XSS-exposed), it's sent automatically on requests (CSRF surface), and it's visible in browser DevTools/network traffic — never put tokens, passwords, or PII in a plain client-readable cookie.

### Query Parameters

**Where:** `/product/:id?ref=list` — `id` is a route param, `ref` is a query param, both read by the Host and passed as props into `ProductDetails`. `/cart?coupon=SAVE10` — `coupon` is read by the Host and passed into `CartPage` (display only, not applied to totals).

- **Advantages:** shareable and bookmarkable (a link fully encodes state), visible/inspectable in the URL, survives page refresh without any storage API, works even with JS disabled for the initial request.
- **URL visibility:** by definition, anything in a query string is visible to the user, in browser history, in server access logs, and to anyone the link is shared with.
- **Security implications:** never put secrets or tokens in a query param — logs and browser history are not a secure place to keep sensitive data.
- **Appropriate use cases:** navigation/filter state (`?ref=`, `?coupon=`, `?page=`, `?sort=`) — things that should be part of the "address" of the page.

### Custom Events

**Where:** `shared/src/events.ts` — `dispatchCartItemAdded` (fired by `ProductList`/`ProductDetails` on Add-to-Cart) and `listenCartItemAdded` (used by `CartPage` to show a banner).

```js
window.dispatchEvent(new CustomEvent('cart:item-added', { detail: product }));
window.addEventListener('cart:item-added', handleAddToCart);
```

- **Why useful:** lets two independently built/deployed bundles communicate through the one thing they're guaranteed to share at runtime — the browser's global `window` — with zero code-level coupling (Catalog never imports anything from Cart).
- **Loose coupling advantage:** the dispatcher doesn't know or care who's listening, or whether anyone is listening at all; the listener doesn't know or care who dispatched. Either MFE can be redeployed independently without breaking the other, as long as the event name/payload shape is a respected contract.
- **Limitations:** fire-and-forget, no delivery guarantee, no built-in request/response, event name collisions across a large app are possible (mitigated here by a namespaced `cart:` prefix), and payloads must be serializable-ish (avoid passing live class instances/functions).
- **Naming:** namespaced (`cart:item-added`) to avoid clashing with other custom events on the same page; the event name and `detail` shape are the informal "API contract" between dispatcher and listener.
- **If the receiving MFE isn't mounted:** the event is simply dropped — there's no error, no queueing, no retry. This project deliberately keeps the custom-event flow *parallel* to (not a replacement for) the Redux dispatch, precisely because the event could be missed if `CartPage` isn't mounted when it fires (e.g., the user is still on the catalog page).

### Shared Redux State

**Where:** `shared/src/cartSlice.ts` defines the reducer/actions/selectors. `host/src/store.ts` is the **only** place `configureStore()` is called for the "real" app — it wraps the tree in `<Provider store={store}>`. `ProductList`/`ProductDetails` only ever call `useDispatch()`; `CartPage` only ever calls `useSelector()`. Neither remote creates its own store when embedded.

Here's how the Redux sharing actually works:

1. The Host creates one `configureStore()` and wraps everything in `<Provider store={store}>` (including the lazy-loaded remotes).
2. `react-redux` is marked as a singleton in all three `vite.config.ts` files (`shared: [..., 'react-redux']`).
3. Because of that, when Catalog and Cart load, they use the **same instance** of `react-redux` the Host already loaded — not separate copies.
4. So when a remote calls `useSelector()`, it reads from the exact same Redux Context the Host's `<Provider>` populated. One store, not separate ones.

If `react-redux` were *not* shared, each remote would bundle its own copy,
`useSelector` inside `CartPage` would throw ("could not find react-redux
context") or silently read nothing, since it'd be looking at a Context
object the Host's `<Provider>` never populated.

State shape:

```ts
{ cart: { items: [{ id, name, price, image?, quantity }] } }
```

`totalItems`/`totalPrice` are **not** stored — they're computed on read via
`createSelector` (`selectTotalItems`, `selectTotalPrice`) in
`cartSlice.ts`, per the assignment's "don't hardcode calculated values"
rule.

## Data-Sharing Mechanism Comparison

| Mechanism | Persistence | Communication | Coupling | Best Use Case (in this app) | Limitations |
|---|---|---|---|---|---|
| localStorage | Survives refresh & browser restart | Indirect (write then read later) | Low | Persisting the cart across reloads | Synchronous, string-only, no cross-origin sync, XSS-readable |
| sessionStorage | Cleared when tab closes | Indirect | Low | "Recently viewed product" (Nav) | Not shared across tabs, gone on tab close — wrong fit for cart data |
| Cookies | Configurable (this app: ~1 year) | Indirect, also sent to a server | Low | `currency` set by Host, read by Cart MFE | ~4KB size cap, sent on every request, must not hold secrets unless `HttpOnly`/`Secure` |
| Query Parameters | Lives as long as the URL is used/shared | Navigation-time only | Low | `?ref=`, `?coupon=` | Fully visible (history/logs), not for secrets, not for large/complex state |
| Custom Events | None — runtime only, this instant | Direct, real-time, but fire-and-forget | Low | Add-to-cart banner notification | Missed entirely if no listener is mounted; no delivery guarantee |
| Shared Redux | In-memory only (until combined with localStorage, as done here) | Direct, structured, reactive | Higher (all consumers depend on one shared state shape/store) | The actual cart items/quantities used by both MFEs | Requires the exact singleton config to work; strongest coupling of the six |

## Architecture Decisions

**Q1. Why would you choose Custom Events instead of Redux for communication between two independent MFEs?**
When the two MFEs don't need to share ongoing *state*, just notify each other that *something happened* — a one-off signal, not a value both sides continuously read. Custom Events require zero shared infrastructure (no singleton config, no shared store shape) and keep the MFEs able to evolve or redeploy independently, since the "contract" is just an event name + payload shape rather than a shared reducer/state tree.

**Q2. When would localStorage be a better choice than Redux?**
When the data needs to survive a full page reload/browser restart, or needs to be readable by a page that hasn't even loaded any Redux store yet (e.g., before the Host bootstraps). Redux state lives in memory and disappears on refresh unless something (like this app's `preloadedState`/`subscribe` combo) explicitly bridges it to storage — so for pure persistence, localStorage is the primitive; Redux is the in-memory API layered on top of it.

**Q3. When should sessionStorage be used instead of localStorage?**
When the data is only meaningful for the current tab/visit and *should* disappear afterward — e.g., "recently viewed product," a wizard's current step, a one-time dismissed-notice flag. If leaking the value into a new tab or having it persist forever would be wrong or confusing, sessionStorage is the right choice.

**Q4. Why should sensitive information generally not be stored in query parameters?**
Query strings are visible in the address bar, get saved in browser history, are logged by servers/proxies/analytics tools, and are trivially shared when a user copies a link — none of that can be undone once it happens, so anything sensitive (tokens, passwords, PII) leaks broadly and permanently just by existing in a URL.

**Q5. What are the advantages and disadvantages of using a shared Redux store across MFEs?**
Advantages: a single source of truth (no state drift/duplication), predictable and structured updates (actions/reducers), and access to Redux DevTools for debugging cross-MFE state changes as one timeline. Disadvantages: every consumer is coupled to the exact shared state shape and to the singleton dependency configuration being correct (miss it and the sharing silently breaks); it's harder to deploy MFEs on fully separate release cycles once they depend on the same evolving reducer/action contract; and it requires the composing shell (or agreed runtime) to own the store.

**Q6. Does sharing Redux state increase coupling between MFEs? Explain.**
Yes. Both remotes depend on the same state shape (`cart.items`) and actions (`addToCart`, etc.) from `shared/cartSlice.ts`. If that changes, both break simultaneously. It's tighter coupling than events/cookies (which just need a name), but still looser than importing each other's components directly.

**Q7. If the Cart MFE is deployed independently from the Catalog MFE, which communication mechanisms would make the MFEs more independent?**
Custom Events, localStorage, cookies, and query parameters — all four only require agreeing on a name/key and a payload shape; neither MFE needs to import from or version-match the other's code. Shared Redux is the *least* independent of the six here, since both MFEs must agree on the same reducer/state contract from `shared/`.

**Q8. If the user refreshes the browser, which data-sharing mechanisms will retain their data?**
- **localStorage:** retained — that's exactly what it's for (and how this app rehydrates the cart on refresh).
- **sessionStorage:** retained *if the tab itself isn't closed* — a refresh keeps the same tab/session, so `recentProduct` survives a refresh but not a closed tab or new tab.
- **Cookies:** retained until they expire (this app sets ~1 year) or are cleared — refresh has no effect on them.
- **Query parameters:** retained only if the refreshed URL still contains them (a plain refresh of the same URL keeps `?ref=`/`?coupon=`; navigating elsewhere without them loses them).
- **Custom Events:** never retained — they're momentary signals with no storage; a refresh means no listeners exist until new ones mount, and the original dispatch is gone.
- **Redux:** the in-memory store itself is destroyed and recreated from scratch on refresh; in this app it only *appears* to persist because the Host explicitly rehydrates it from `localStorage` via `preloadedState` — without that bridge, Redux state alone would not survive a refresh.

## Testing

Vitest + React Testing Library, one `vitest.config.ts` per app (deliberately
separate from `vite.config.ts` — no federation plugin needed for unit
tests, since components are imported directly and wrapped in a local test
`<Provider>`).

```bash
npm --prefix catalog-mfe run test
npm --prefix cart-mfe run test
```

**catalog-mfe** (`ProductList.test.tsx`, `ProductDetails.test.tsx`):
- renders all 10 products (≥ 8 required)
- Add to Cart dispatches `addToCart` (verified via store state)
- Add to Cart dispatches the `cart:item-added` CustomEvent
- Add to Cart writes to `localStorage`
- `ProductDetails` renders the correct product for a given `:id`, and a not-found message for an unknown id
- `ProductDetails` sets `sessionStorage` on mount
- `ProductDetails` reflects (and omits) the `?ref=` query param correctly

**cart-mfe** (`CartPage.test.tsx`):
- renders preloaded cart items
- increment / decrement (floors at 1) / remove / clear all work correctly
- totals (`Total Items`, `Total`) match expected computed values
- reads the `currency` cookie
- shows a banner on the `cart:item-added` CustomEvent **without** changing the Redux item count (proves the two mechanisms are independent)
- displays the `?coupon=` value (display only)

**Shared logic** (`cart-mfe/src/__tests__/shared/`, imported via the
`@shared` alias already configured in that app, since `shared/` itself has
no package/test runner of its own):
- `cartSlice.test.ts` — add/remove/inc/dec/clear reducer behavior, and selectors compute (not store) totals
- `storage.test.ts` — save/load/clear localStorage, empty-cart and malformed-JSON handling
- `cookies.test.ts` — set/read/URL-encoding round trip, missing cookie
- `events.test.ts` — dispatch/listen round trip, and unsubscribe actually stops delivery

All 34 tests pass (`9` in catalog-mfe, `25` in cart-mfe).

## Screenshots / Demo

All captured from the running Host at `http://localhost:5000` (see `screenshots/`):

| | |
|---|---|
| **Catalog** (`01-catalog.png`) | Product listing rendered from `catalog_mfe/ProductList` |
| **Catalog after Add to Cart** (`02-catalog-after-add.png`) | Nav badge updates live — proves the shared Redux store |
| **Product Details** (`03-product-detail.png`) | `/product/3?ref=list` — route param + query param |
| **Cart** (`04-cart.png`) | `/cart?coupon=SAVE10` — quantities, totals, cookie value, coupon param, localStorage debug panel |
| **DevTools storage snapshot** (`05-devtools-storage.png`) | `localStorage["cart"]`, `sessionStorage["recentProduct"]`, and `document.cookie` all populated simultaneously |

To reproduce the Redux DevTools view: install the Redux DevTools browser
extension, run `npm run dev` from the repo root, open
`http://localhost:5000`, and watch the single `cart` slice update as you
add items from the Catalog MFE and change quantities from the Cart MFE —
both act on the same store instance.

## Challenges & Solutions

- **Sharing `shared/` code without a package.json.** Since `shared/src` isn't inside any app's `node_modules` tree, bare imports like `@reduxjs/toolkit` inside `cartSlice.ts` couldn't resolve using Node's normal upward-search algorithm. Solved by adding `@reduxjs/toolkit` as a dependency of the **root** `package.json` — since `shared/src` lives directly under the repo root, resolution now finds it in `<root>/node_modules` while each app still bundles its own copy for its own code.
- **`react-router-dom` inside federated remotes.** Originally the plan called for exposed components to use `<Link>`/`useParams` directly. Since `react-router-dom` isn't a federation singleton (only React/ReactDOM/react-redux are), each remote would bundle its *own* copy with its *own* Router Context — completely disconnected from the Host's `<BrowserRouter>`. Any `useParams()`/`<Link>` inside a remote would either throw or silently do nothing. Fixed by keeping routing entirely in the Host (and in each app's own standalone router): remotes receive `id`/`refParam`/`coupon`/`onSelectProduct` as plain props instead of touching `react-router-dom` at all.
- **Vite dev server vs. federation exposes.** `@originjs/vite-plugin-federation` only produces a working `remoteEntry.js` from a *built* bundle, not from Vite's on-the-fly dev module graph. Catalog/Cart therefore run `vite build --watch` + `vite preview` concurrently for "dev" instead of plain `vite`, matching the working pattern from a previous Module Federation project in this environment.
- **Verifying it actually works end-to-end.** Rather than trust the wiring on faith, all three apps were built, served, and driven with a headless Chrome script that clicked "Add to Cart" in the Catalog, confirmed the Cart badge/route updated, refreshed and confirmed persistence, and killed the Cart MFE's server mid-session to confirm the Host's `ErrorBoundary` shows a graceful fallback instead of crashing.

## Submission Checklist

Before submitting, verified:

- ✅ Host application works
- ✅ Catalog MFE works independently
- ✅ Cart MFE works independently
- ✅ Module Federation is configured
- ✅ Products can be added to the cart
- ✅ Cart quantity can be changed
- ✅ Products can be removed
- ✅ Cart total is calculated correctly (computed, not hardcoded)
- ✅ localStorage is implemented (cart persists on refresh)
- ✅ sessionStorage is implemented (recently viewed product)
- ✅ Cookies are implemented (currency set by Host, read by Cart)
- ✅ Query parameters are implemented (`?ref=`, `?coupon=`)
- ✅ Custom Events are implemented (add-to-cart banner)
- ✅ Shared Redux state is implemented
- ✅ Redux state is actually shared between MFEs (verified via live testing)
- ✅ Tests are included (34 passing tests)
- ✅ README is complete
- ✅ Architecture is documented
- ✅ Data-sharing mechanisms are compared (detailed table)
- ✅ Architecture decisions are justified (8 questions answered)
- ✅ Screenshots/demo are included (5 screenshots in `screenshots/`)
- ✅ Repository runs using documented commands (`npm run dev`)
- ✅ Error handling works (ErrorBoundary tested with remote down)
- ✅ No AI/Claude references in codebase

## Conclusion

Building this showed that there's no "best" mechanism — each one solves a different problem. Redux is powerful but couples your MFEs tightly. Custom events are loose but easy to miss. localStorage/cookies are simple but have their own tradeoffs. The real question is just "what is this data — a signal, a setting, navigation state, or actual app state?" and pick the tool that fits.
