# E-commerce Website

A learning project for building a small online store with Express, MongoDB, EJS, Mailjet, and Razorpay.

## Features

- Browse products without logging in. Products load 8 at a time with a cursor and a **Load more** button.
- Open product details and add products to a logged-in user's cart without reloading the page.
- Change cart quantities, remove items, and check stock before checkout.
- Register, verify an email address, log in, log out, and reset a forgotten password.
- Save delivery addresses and use a saved address at checkout.
- Pay for orders and memberships using Razorpay.
- See previous orders, their payment status, and payment IDs.
- Buy a 30-day membership and earn credits.
- Use an available membership credit automatically on an order with at least ₹1,000 in product subtotal. One credit gives free delivery and a fixed discount:
  - **Essential**: ₹99, 9 credits, ₹200 off per eligible order.
  - **Plus**: ₹199, 19 credits, ₹300 off per eligible order.
- Manage products and stock as an admin. The admin dashboard shows sales and stock per product.

Membership credits are deducted only after the order payment succeeds. Unused credits expire with the membership.

## Technologies

- Node.js and Express
- MongoDB and Mongoose
- EJS templates
- Mailjet for email messages
- Razorpay for payments
- HTML, CSS, and browser JavaScript

## Project structure

```text
backend/
├── config/          # MongoDB and Mailjet setup
├── controllers/     # Request handling and application logic
├── frontend/        # CSS and browser JavaScript
├── middleware/      # Login and admin access checks
├── models/          # MongoDB schemas
├── routes/          # Express routes
├── views/           # EJS pages and shared partials
├── server.js        # Starts the Express app
└── package.json
```

## Requirements

- Node.js and npm
- A MongoDB database, local or hosted
- Mailjet API credentials and a verified sender email address
- Razorpay API keys (use test keys while developing)

## Setup

Open a terminal in the folder and install the packages:

```bash
npm install
```

Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The home page redirects to the product list.

## Making a user an admin

Register a normal account first. Then, using MongoDB Compass or the Mongo shell, set `isAdmin` to `true` on that user's document in the `users` collection. For example, after selecting the `ecommerce` database:

```javascript
db.users.updateOne(
    { email: "admin@example.com" },
    { $set: { isAdmin: true } }
)
```

Replace the email with the account you registered. Admin pages are under `/admin`.

## Main pages and routes

| Page or route | Purpose |
| --- | --- |
| `/products` | Browse products |
| `/products/api` | Load a product batch; pass a `cursor` query parameter for the next batch |
| `/products/:id` | View one product |
| `/signup`, `/login` | Create an account or log in |
| `/cart` | View and update the logged-in user's cart |
| `/cart/checkout` | Start checkout |
| `/orders` | View previous orders |
| `/membership` | View and buy a membership |
| `/admin` | Admin sales and stock dashboard |

## Basic application flow

1. The product page requests the first 8 products from the server. **Load more** sends the last product ID as a cursor to retrieve the next batch.
2. A customer must log in to add an item to their cart or view the cart. Add-to-cart uses browser `fetch`, so the page stays in place and displays a result message.
3. During checkout, the server reads product prices and stock from MongoDB, saves the delivery address, and creates a pending order.
4. If the customer has an active membership and a credit, an eligible order with at least ₹1,000 in product subtotal automatically gets the plan's fixed discount and free delivery.
5. The server creates a Razorpay payment order. After checkout, the server fetches the payment from Razorpay and checks its order, amount, currency, and captured status.
6. After successful confirmation, the server deducts a membership credit if used, reduces product stock, marks the order paid, and empties the cart.

Email verification and password reset links are sent through Mailjet.

## Current learning-project limits

- Payment confirmation currently uses a server-side Razorpay payment fetch. Webhooks and payment-signature verification are not implemented in this project.
- The npm `test` command is still the default placeholder; no automated test suite is configured.

