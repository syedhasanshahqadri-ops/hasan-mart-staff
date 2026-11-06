# Hasan Mart - Staff Panel

The private orders panel for Hasan Mart staff. Orders placed on the store appear here live, and staff can update their status. It uses external HTML, CSS and JavaScript files.

## Folder structure

    staff/
    ├── index.html
    ├── css/style.css
    └── js/
        ├── app.js               (sign-in, live orders, filters, status updates)
        └── firebase-config.js   (your Firebase keys go here)

## Features

- Staff sign-in with email and password (Firebase Authentication)
- Live orders list: new orders appear without refreshing the page
- Summary counts for Total, Pending, Confirmed, Shipped and Delivered
- Filter by status and search by order ID, customer name, mobile or city
- Full order details: customer name, mobile, email, address, city, postal code, notes
- Items ordered with quantities, subtotal, Cash on Delivery fee and total
- Payment# ORDER
