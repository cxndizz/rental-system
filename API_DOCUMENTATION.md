# 📖 API Documentation - Rental System

Base URL: `http://localhost:8852`

---

## 🔐 Authentication

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0812345678"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@rental.com",
  "password": "admin123456"
}
```

---

## 👤 Users

### Get Profile
```http
GET /users/profile/:id
Authorization: Bearer {token}
```

### Update Profile
```http
PUT /users/profile/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "phone": "0812345678"
}
```

### Submit KYC
```http
POST /users/kyc/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "idCardNumber": "1234567890123",
  "idCardUrl": "https://...",
  "selfieUrl": "https://..."
}
```

### Create Address
```http
POST /users/addresses/:userId
Authorization: Bearer {token}
Content-Type: application/json

{
  "addressLine": "123 Main St",
  "city": "Bangkok",
  "province": "Bangkok",
  "postalCode": "10100"
}
```

---

## 📦 Items

### Get All Items
```http
GET /items?page=1&limit=10&categoryId=1&search=keyword&minPrice=100&maxPrice=1000
```

### Get Item by ID
```http
GET /items/:id
```

### Create Item (Admin)
```http
POST /items
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "Camera Canon EOS R5",
  "description": "Professional mirrorless camera",
  "pricePerDay": 1500,
  "stock": 5,
  "categoryId": 1
}
```

### Update Item (Admin)
```http
PUT /items/:id
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "pricePerDay": 1800,
  "isActive": true
}
```

### Delete Item (Admin)
```http
DELETE /items/:id
Authorization: Bearer {adminToken}
```

### Get Categories
```http
GET /items/categories/all
```

### Create Category (Admin)
```http
POST /items/categories
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "Cameras",
  "description": "Photography equipment",
  "icon": "📷"
}
```

---

## 🛒 Rentals

### Create Rental
```http
POST /rentals
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "totalPrice": 3000,
  "depositAmount": 1000,
  "startDate": "2025-12-15",
  "endDate": "2025-12-20",
  "items": [
    {
      "itemId": 1,
      "quantity": 1,
      "priceAtRent": 1500
    }
  ]
}
```

### Get User Rentals
```http
GET /rentals/user/:userId?page=1&limit=10&status=ON_RENT
Authorization: Bearer {token}
```

### Get Rental Details
```http
GET /rentals/:id
Authorization: Bearer {token}
```

### Update Rental Status (Admin)
```http
PUT /rentals/:id/status
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "status": "APPROVED",
  "notes": "Approved and ready for pickup"
}
```

---

## 🔙 Returns

### Create Return Request
```http
POST /returns/:rentalOrderId
Authorization: Bearer {token}
```

### Get Pending Returns (Admin)
```http
GET /returns/pending
Authorization: Bearer {adminToken}
```

### Inspect Return (Admin)
```http
PUT /returns/:id/inspect
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "status": "COMPLETED",
  "inspectedBy": 1,
  "notes": "All items in good condition"
}
```

### Report Damage (Admin)
```http
POST /returns/:id/damage
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "description": "Screen scratched",
  "penaltyFee": 500,
  "photoUrls": ["https://..."]
}
```

---

## 💰 Payments

### Create Invoice
```http
POST /payments/invoice/:rentalOrderId
Authorization: Bearer {adminToken}
```

### Create Transaction
```http
POST /payments/transaction
Authorization: Bearer {token}
Content-Type: application/json

{
  "invoiceId": 1,
  "amount": 3000,
  "method": "CREDIT_CARD",
  "status": "SUCCESS",
  "gateway": "Stripe"
}
```

### Get Invoice
```http
GET /payments/invoice/:id
Authorization: Bearer {token}
```

### Refund Payment (Admin)
```http
POST /payments/refund/:invoiceId
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "amount": 1000
}
```

---

## 🎁 Promotions

### Get Active Promotions
```http
GET /promotions
```

### Create Promotion (Admin)
```http
POST /promotions
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "New Year Sale",
  "type": "PERCENTAGE",
  "value": 20,
  "startDate": "2025-12-25",
  "endDate": "2026-01-05"
}
```

### Validate Coupon
```http
GET /promotions/coupons/:code
```

### Create Coupon (Admin)
```http
POST /promotions/coupons
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "code": "WELCOME2025",
  "type": "FIXED_AMOUNT",
  "value": 100,
  "maxUses": 100,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

---

## ⭐ Reviews

### Create Review
```http
POST /reviews
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 1,
  "itemId": 1,
  "rating": 5,
  "comment": "Excellent quality!"
}
```

### Get Item Reviews
```http
GET /reviews/item/:itemId?page=1&limit=10
```

---

## 🔔 Notifications

### Get User Notifications
```http
GET /notifications/user/:userId
Authorization: Bearer {token}
```

### Send Notification (Admin)
```http
POST /notifications
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "userId": 1,
  "title": "Rental Approved",
  "message": "Your rental has been approved",
  "type": "INFO"
}
```

### Broadcast Notification (Admin)
```http
POST /notifications/broadcast
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "title": "System Maintenance",
  "message": "System will be down on...",
  "type": "WARNING"
}
```

---

## 👨‍💼 Admin

### Create Staff
```http
POST /admin/staff
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "email": "staff@rental.com",
  "password": "staff123",
  "firstName": "Staff",
  "lastName": "User",
  "roleId": 2
}
```

### Get All Staff
```http
GET /admin/staff
Authorization: Bearer {adminToken}
```

### Create Role
```http
POST /admin/roles
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "name": "Manager",
  "description": "Can manage items and rentals",
  "permissionIds": [1, 2, 3]
}
```

---

## 📊 Reports

### Get Dashboard Stats
```http
GET /reports/dashboard
Authorization: Bearer {adminToken}
```

### Get Revenue Report
```http
GET /reports/revenue?startDate=2025-01-01&endDate=2025-12-31
Authorization: Bearer {adminToken}
```

### Get Rental Report
```http
GET /reports/rentals?startDate=2025-01-01&endDate=2025-12-31&status=COMPLETED
Authorization: Bearer {adminToken}
```

### Get Item Utilization
```http
GET /reports/items
Authorization: Bearer {adminToken}
```

---

## ⚙️ System Config

### Get All Configs
```http
GET /config
Authorization: Bearer {adminToken}
```

### Update Config
```http
PUT /config/:key
Authorization: Bearer {adminToken}
Content-Type: application/json

{
  "value": "New value"
}
```

---

## 📝 Audit Logs

### Get Audit Logs
```http
GET /audit?page=1&limit=50&module=items&userId=1
Authorization: Bearer {adminToken}
```

---

## 📌 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error
