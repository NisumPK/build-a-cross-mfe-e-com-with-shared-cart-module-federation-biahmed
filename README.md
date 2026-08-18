[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/feVVTjSF)
# Assignment 2 — MFE Assignment: Cross-MFE E-Commerce App with Shared Cart State

## 📌 Overview

In this assignment, you will build a small **E-Commerce application using Micro Frontends (MFEs)** and **Module Federation**.

The application will consist of multiple independently developed and deployed Micro Frontends that communicate and share data with each other.

The primary goal of this assignment is to understand and demonstrate the **Data-Sharing Toolbox** introduced in Lecture 2:

- `localStorage`
- `sessionStorage`
- Cookies
- Query Parameters
- Custom Events
- Shared Redux State through Module Federation

You will implement a **Product Catalog MFE** and a **Shopping Cart MFE**, and demonstrate how data can be passed between these independent applications using different state/data-sharing mechanisms.

> **Important:** The goal is not only to make the application work. You must also explain **when, why, and where each data-sharing mechanism should be used**, including its advantages and limitations.

---

# 🎯 Learning Objectives

By completing this assignment, you should be able to:

1. Understand the architecture of Micro Frontends.
2. Configure and use **Webpack Module Federation**.
3. Build independently deployable MFEs.
4. Share UI/components between MFEs.
5. Share application state between MFEs.
6. Understand different browser-based data-sharing mechanisms.
7. Implement communication between independent MFEs.
8. Compare different approaches to cross-MFE communication.
9. Identify the appropriate data-sharing mechanism for different use cases.
10. Understand the trade-offs between loosely coupled and tightly coupled MFEs.

---

# 🏗️ Application Requirements

You will build an E-Commerce application consisting of at least the following applications:

```text
                    ┌─────────────────────┐
                    │       Host App      │
                    │   E-Commerce Shell  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
       ┌────────▼────────┐          ┌────────▼────────┐
       │  Catalog MFE    │          │    Cart MFE     │
       │                 │          │                 │
       │ Product Listing │          │ Cart Items      │
       │ Product Details │          │ Quantity        │
       │ Add to Cart     │          │ Total Price     │
       └─────────────────┘          └─────────────────┘
```

### Required Applications

#### 1. Host / Shell Application

The Host application should:

- Load the Catalog MFE.
- Load the Cart MFE.
- Provide basic navigation.
- Display the overall application layout.
- Integrate the independent MFEs using Module Federation.

#### 2. Catalog MFE

The Catalog MFE should:

- Display a list of products.
- Display at least:
  - Product name
  - Price
  - Image
  - Description
- Allow users to add products to the cart.
- Allow users to view product details.
- Communicate the selected product to the Cart MFE.

#### 3. Cart MFE

The Cart MFE should:

- Display products added to the cart.
- Display quantity for each product.
- Allow users to increase/decrease quantity.
- Allow users to remove products.
- Display subtotal/total price.
- Display the total number of items.

---

# 🧰 Technology Requirements

You must use the following technologies:

- React
- JavaScript or TypeScript
- Module Federation
- Redux Toolkit
- React Router
- HTML5 Web APIs where applicable

You may use:

- Vite with Module Federation
- Webpack Module Federation
- CSS / Tailwind CSS / Material UI
- Any suitable icon library
- Any mock product API or local JSON data

> The recommended implementation is React + TypeScript + Redux Toolkit + Module Federation.

---

# 📦 Required Project Structure

Your repository should follow a structure similar to:

```text
mfe-ecommerce/
│
├── host/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── catalog-mfe/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── cart-mfe/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── shared/
│   └── ...
│
└── README.md
```

You may choose a different structure if your architecture is clearly documented.

---

# 🔄 Part 1 — Module Federation Setup

Configure Module Federation so that the Host application can consume the Catalog and Cart MFEs independently.

For example:

```text
Host
 ├── Catalog MFE
 └── Cart MFE
```

The MFEs should be exposed remotely and consumed by the Host application.

### Requirements

- Catalog MFE must be independently runnable.
- Cart MFE must be independently runnable.
- Host must consume both MFEs.
- MFEs should not be directly copied into the Host application.
- Remote modules should be loaded using Module Federation.

---

# 🛒 Part 2 — Basic E-Commerce Functionality

Implement the following functionality.

## Product Catalog

The Catalog MFE should display a minimum of **8 products**.

Example:

```text
Product
-------------------------
Name: Wireless Headphones
Price: $99
Description: ...
[Add to Cart]
```

Users should be able to click:

```text
Add to Cart
```

and the selected product should become available to the Cart MFE.

---

## Shopping Cart

The Cart MFE should display:

```text
Shopping Cart

Wireless Headphones
$99
Quantity: 2

Laptop Stand
$49
Quantity: 1

--------------------
Total Items: 3
Total: $247
```

Users should be able to:

- Add items
- Remove items
- Increase quantity
- Decrease quantity
- Clear the cart
- View total items
- View total price

---

# 🧰 Part 3 — Data-Sharing Toolbox

This is the **core part of the assignment**.

You must demonstrate how data can be shared between independent MFEs using the following mechanisms.

---

# 1️⃣ localStorage

Use `localStorage` to persist cart-related information.

### Requirement

When a user adds an item to the cart:

```text
Catalog MFE
     ↓
localStorage
     ↓
Cart MFE
```

The cart should remain available even after refreshing the browser.

### Demonstrate

- Saving cart data.
- Reading cart data.
- Updating cart data.
- Removing cart data.
- Handling an empty cart.

### Example

```javascript
localStorage.setItem(
  "cart",
  JSON.stringify(cart)
);
```

### Explain

In your documentation, explain:

- Why localStorage is useful.
- What happens when the browser is refreshed.
- Whether localStorage is shared between MFEs.
- Security considerations.
- Limitations of localStorage.

---

# 2️⃣ sessionStorage

Use `sessionStorage` for temporary information.

### Requirement

Use `sessionStorage` to store something such as:

```text
currentProduct
recentlyViewedProduct
checkoutStep
```

For example:

```javascript
sessionStorage.setItem(
  "recentProduct",
  JSON.stringify(product)
);
```

### Demonstrate

The stored information should be available while the browser tab/session remains active.

### Explain

Document:

- Difference between `localStorage` and `sessionStorage`.
- When sessionStorage is more appropriate.
- What happens when the browser/tab is closed.
- Whether sessionStorage should be used for persistent cart state.

---

# 3️⃣ Cookies

Use cookies to share a small piece of information between the applications.

### Requirement

Store information such as:

```text
currency=USD
```

or:

```text
cartSessionId=12345
```

Example:

```javascript
document.cookie = "currency=USD; path=/";
```

### Demonstrate

The application should read the cookie from another MFE.

### Explain

Document:

- What cookies are.
- When cookies are appropriate.
- Cookie size limitations.
- `HttpOnly`
- `Secure`
- `SameSite`
- Why sensitive information should not be stored in normal client-readable cookies.

---

# 4️⃣ Query Parameters

Use URL query parameters to share information between MFEs.

### Requirement

Implement a flow such as:

```text
/catalog/product/10
```

or:

```text
/catalog?productId=10
```

For example:

```text
/cart?coupon=SAVE10
```

The Cart MFE should be able to read the parameter.

### Example

```javascript
const params = new URLSearchParams(window.location.search);

const productId = params.get("productId");
```

### Demonstrate

Use query parameters for information that should be:

- Shareable
- Bookmarkable
- Visible in the URL
- Preserved when navigating between applications

### Explain

Discuss:

- Advantages of query parameters.
- URL visibility.
- Security implications.
- Appropriate use cases.

---

# 5️⃣ Custom Events

Use browser Custom Events to communicate between the Catalog and Cart MFEs.

### Requirement

When a user clicks:

```text
Add to Cart
```

the Catalog MFE should dispatch a custom event.

Example:

```javascript
window.dispatchEvent(
  new CustomEvent("cart:item-added", {
    detail: product
  })
);
```

The Cart MFE should listen for this event:

```javascript
window.addEventListener(
  "cart:item-added",
  handleAddToCart
);
```

### Demonstrate

The following flow should work:

```text
Catalog MFE
     │
     │ CustomEvent
     ▼
Browser Window
     │
     ▼
Cart MFE
```

### Explain

Document:

- Why Custom Events are useful.
- Advantages of loose coupling.
- Limitations of Custom Events.
- How event naming should be handled.
- What happens if the receiving MFE is not mounted.

---

# 6️⃣ Shared Redux State via Module Federation

This is the **most important implementation requirement**.

You must demonstrate sharing Redux state between the Catalog and Cart MFEs through Module Federation.

The goal is to create a shared cart state such as:

```javascript
{
  cart: {
    items: [
      {
        id: 1,
        name: "Wireless Headphones",
        price: 99,
        quantity: 2
      }
    ],
    totalItems: 2,
    totalPrice: 198
  }
}
```

---

## Shared Redux Architecture

The expected architecture is:

```text
                 ┌─────────────────────┐
                 │   Shared Redux Store │
                 │                     │
                 │   cartSlice         │
                 └──────────┬──────────┘
                            │
                 ┌──────────┴──────────┐
                 │                     │
          ┌──────▼──────┐       ┌──────▼──────┐
          │ Catalog MFE │       │   Cart MFE   │
          │             │       │              │
          │ dispatch()  │       │ useSelector()│
          └─────────────┘       └──────────────┘
```

### Requirements

The shared Redux state should contain at least:

```text
cart.items
cart.totalItems
cart.totalPrice
```

The Catalog MFE should be able to:

```text
dispatch(addToCart(product))
```

The Cart MFE should be able to:

```text
useSelector(state => state.cart)
```

The state must be shared rather than maintaining two unrelated Redux stores.

---

# 🔗 Module Federation Shared Dependencies

Ensure dependencies such as React and Redux are configured correctly to avoid multiple instances where appropriate.

For example:

```text
react
react-dom
react-redux
@reduxjs/toolkit
```

should be configured appropriately as shared dependencies.

You must document your Module Federation configuration and explain why these dependencies are shared.

---

# 🧪 Part 4 — Demonstration Requirements

Your application must demonstrate all six mechanisms.

| Mechanism | Required Demonstration |
|---|---|
| localStorage | Persistent cart/session data |
| sessionStorage | Temporary browsing/session data |
| Cookies | Shared preference/session information |
| Query Parameters | Product/navigation information |
| Custom Events | Add-to-cart communication |
| Shared Redux | Centralized cross-MFE cart state |

---

# 🔍 Part 5 — Comparison & Justification

Create a section in your README called:

```text
## Data-Sharing Mechanism Comparison
```

Compare all six mechanisms.

Your comparison should include:

| Mechanism | Persistence | Communication | Coupling | Best Use Case | Limitations |
|---|---|---|---|---|---|
| localStorage | Long-term | Indirect | Low | Persistent client data | Browser-only |
| sessionStorage | Session | Indirect | Low | Temporary session data | Limited lifetime |
| Cookies | Configurable | Browser/Server | Low | Small session/preferences | Size/security constraints |
| Query Params | URL-based | Navigation | Low | Shareable navigation state | Visible in URL |
| Custom Events | Runtime | Direct events | Low | MFE communication | Requires active listeners |
| Shared Redux | Runtime | Direct state | Higher | Complex shared application state | Stronger coupling |

> The table above is a starting point. You must expand the explanation in your own words based on your implementation.

---

# 💡 Part 6 — Architecture Justification

In your README, answer the following questions.

### Question 1

Why would you choose **Custom Events** instead of Redux for communication between two independent MFEs?

---

### Question 2

When would `localStorage` be a better choice than Redux?

---

### Question 3

When should `sessionStorage` be used instead of `localStorage`?

---

### Question 4

Why should sensitive information generally not be stored in query parameters?

---

### Question 5

What are the advantages and disadvantages of using a shared Redux store across MFEs?

---

### Question 6

Does sharing Redux state increase coupling between MFEs? Explain.

---

### Question 7

If the Cart MFE is deployed independently from the Catalog MFE, which communication mechanisms would make the MFEs more independent?

Explain your answer.

---

### Question 8

If the user refreshes the browser, which data-sharing mechanisms will retain their data?

Explain the behavior of:

- localStorage
- sessionStorage
- cookies
- query parameters
- Custom Events
- Redux

---

# 🧪 Part 7 — Testing

You should include tests for important functionality.

At minimum, test:

### Catalog MFE

- Products render correctly.
- Add to Cart works.
- Custom event is dispatched.
- Redux action is dispatched.

### Cart MFE

- Cart items render.
- Quantity can be increased.
- Quantity can be decreased.
- Items can be removed.
- Total price is calculated correctly.
- Cart can be cleared.

### Data Sharing

Test at least:

- localStorage persistence.
- sessionStorage behavior.
- Query parameter parsing.
- Custom event handling.
- Shared Redux state.

Recommended tools:

```text
Jest
React Testing Library
```

---

# 📸 Part 8 — Screenshots / Demo

Include screenshots or a short GIF/video demonstrating:

### 1. Catalog

Show:

```text
Product Listing
     ↓
Add to Cart
```

### 2. Cart

Show:

```text
Cart
     ↓
Quantity
     ↓
Total
```

### 3. localStorage

Show the cart data in browser DevTools.

### 4. sessionStorage

Show the session data in browser DevTools.

### 5. Cookies

Show the cookie in browser DevTools.

### 6. Query Parameters

Show an example URL.

### 7. Custom Events

Show the communication flow in your implementation.

### 8. Shared Redux

Show Redux DevTools demonstrating the shared cart state.

---

# 📁 Expected Deliverables

Your GitHub repository must contain:

```text
├── host/
├── catalog-mfe/
├── cart-mfe/
├── README.md
├── package.json
└── ...
```

Your submission must include:

- Working Host application.
- Working Catalog MFE.
- Working Cart MFE.
- Module Federation configuration.
- Shared Redux implementation.
- localStorage implementation.
- sessionStorage implementation.
- Cookie implementation.
- Query parameter implementation.
- Custom Events implementation.
- Unit/component tests.
- Architecture documentation.
- Data-sharing comparison.
- Screenshots or demo video.

---

# 📖 README Documentation Requirements

Your README must contain the following sections:

```text
# Project Title

## Overview

## Architecture

## Technologies Used

## Project Structure

## Running the Application

## Module Federation Configuration

## Catalog MFE

## Cart MFE

## Data-Sharing Toolbox

### localStorage

### sessionStorage

### Cookies

### Query Parameters

### Custom Events

### Shared Redux State

## Data-Sharing Mechanism Comparison

## Architecture Decisions

## Testing

## Screenshots / Demo

## Challenges & Solutions

## Conclusion
```

---

# ▶️ Running the Application

Your project should provide clear instructions for running all applications.

For example:

```bash
# Install dependencies
npm install

# Start Host
npm run dev:host

# Start Catalog MFE
npm run dev:catalog

# Start Cart MFE
npm run dev:cart
```

You may use different commands depending on your implementation.

Clearly document the actual commands used by your project.

---

# 🌐 Expected Application Flow

The following is an example of the expected user journey:

```text
1. User opens the E-Commerce application
                 ↓
2. Host loads Catalog MFE
                 ↓
3. User browses products
                 ↓
4. User clicks "Add to Cart"
                 ↓
5. Catalog communicates with Cart
                 ↓
6. Cart state is updated
                 ↓
7. Cart badge updates
                 ↓
8. User opens Cart
                 ↓
9. Cart MFE displays selected products
                 ↓
10. User changes quantity
                 ↓
11. Total price is recalculated
```

---

# ⭐ Bonus Requirements

The following are optional but can earn bonus marks.

## Bonus 1 — Wishlist MFE

Create a third MFE:

```text
Wishlist MFE
```

Allow users to add/remove wishlist items.

---

## Bonus 2 — Authentication MFE

Create an authentication MFE that shares:

```text
user
isAuthenticated
token/session information
```

with other MFEs.

---

## Bonus 3 — Cross-Tab Synchronization

Use the browser `storage` event to synchronize cart changes across browser tabs.

Example:

```javascript
window.addEventListener("storage", handleStorageChange);
```

---

## Bonus 4 — Offline Support

Allow users to continue viewing their cart when temporarily offline.

---

## Bonus 5 — Independent Deployment

Deploy:

```text
Host MFE
Catalog MFE
Cart MFE
```

independently and configure the Host to consume the remotely deployed MFEs.

---

# 📊 Evaluation Criteria

| Category | Marks |
|---|---:|
| Micro Frontend Architecture | 10 |
| Module Federation Configuration | 15 |
| Catalog MFE | 10 |
| Cart MFE | 10 |
| localStorage Implementation | 5 |
| sessionStorage Implementation | 5 |
| Cookies Implementation | 5 |
| Query Parameters Implementation | 5 |
| Custom Events Implementation | 10 |
| Shared Redux State | 15 |
| Testing | 5 |
| Documentation & Justification | 5 |
| **Total** | **100** |

---

# 🚨 Important Rules

1. The Catalog and Cart must be implemented as **independent MFEs**.
2. Do not simply place both applications inside one React application and call them MFEs.
3. Module Federation must be used for MFE integration.
4. Shared Redux state must demonstrate actual state sharing between MFEs.
5. Each data-sharing mechanism must have a meaningful use case.
6. Do not use one mechanism for all requirements.
7. Clearly explain the trade-offs of every mechanism.
8. Code should be clean, modular, and maintainable.
9. Avoid hardcoding calculated values such as cart totals.
10. Handle loading and error states appropriately.

---

# 📝 Submission Checklist

Before submitting your assignment, verify:

- [ ] Host application works.
- [ ] Catalog MFE works independently.
- [ ] Cart MFE works independently.
- [ ] Module Federation is configured.
- [ ] Products can be added to the cart.
- [ ] Cart quantity can be changed.
- [ ] Products can be removed.
- [ ] Cart total is calculated correctly.
- [ ] localStorage is implemented.
- [ ] sessionStorage is implemented.
- [ ] Cookies are implemented.
- [ ] Query parameters are implemented.
- [ ] Custom Events are implemented.
- [ ] Shared Redux state is implemented.
- [ ] Redux state is actually shared between MFEs.
- [ ] Tests are included.
- [ ] README is complete.
- [ ] Architecture is documented.
- [ ] Data-sharing mechanisms are compared.
- [ ] Architecture decisions are justified.
- [ ] Screenshots/demo are included.
- [ ] Repository runs using documented commands.

---

# 🎓 Final Goal

The purpose of this assignment is **not simply to build a shopping cart**.

The main objective is to understand how independently developed Micro Frontends can **communicate, share state, and remain as decoupled as possible**.

By the end of the assignment, you should be able to answer:

> **"If I have two independent Micro Frontends, how should they share data, and which mechanism should I choose for a particular use case?"**

You should be able to justify your choice between:

```text
localStorage
      ↓
sessionStorage
      ↓
Cookies
      ↓
Query Parameters
      ↓
Custom Events
      ↓
Shared Redux State
```

based on **persistence, coupling, security, scalability, communication requirements, and application architecture**.

---

## 📅 Deadline

Please submit your GitHub repo link by: 25 - August - 2026

---

## 💡 Tips
- Start all remote apps before running the shell.
- Keep each remote app small and focused.
- Test what happens when one remote app is stopped.
- Use clear component names and folder structure.
- Read the Module Federation and Vite plugin documentation carefully. 

---

## 🚀 Good Luck!

Build it, experiment with the different data-sharing approaches, and most importantly — **understand why you chose each approach, not just how to implement it.**

---

Helpful links:

- https://vitejs.dev/
- https://react.dev/
- https://reactrouter.com/
- https://github.com/originjs/vite-plugin-federation

## Happy Building! ⚡
