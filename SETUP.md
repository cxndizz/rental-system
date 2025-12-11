# 🚀 Rental System - Setup Guide

## ขั้นตอนการติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
# Backend
cd backend
npm install

# Frontend Client
cd ../frontend-client
npm install

# Frontend Backoffice
cd ../frontend-backoffice
npm install
```

### 2. Setup Database

```bash
# กลับไปที่ backend folder
cd ../backend

# สร้าง Prisma Migration
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate

# (Optional) Seed ข้อมูลทดสอบ
npx prisma db seed
```

### 3. รัน Application ด้วย Docker Compose

```bash
# จาก root directory
cd docker
docker-compose up -d

# หรือ รัน manually
cd ../backend && npm run start:dev
cd ../frontend-client && npm run dev
cd ../frontend-backoffice && npm run dev
```

## 📍 URLs

- **Backend API**: http://localhost:8852
- **Frontend Client**: http://localhost:8850
- **Frontend Backoffice**: http://localhost:8851
- **Database**: localhost:8853

## 🔑 Default Credentials

### Admin User
- Email: admin@rental.com
- Password: admin123456

*(ต้องสร้างใน Database ก่อนใช้งาน)*

## 🗄️ Database Schema

ระบบมี Models ทั้งหมด:
- User, UserProfile, UserKYC, UserAddress
- AdminUser, AdminRole, Permission
- Item, ItemCategory, ItemTag, ItemMedia
- RentalOrder, RentalItem
- Return, DamageReport
- Invoice, PaymentTransaction, Deposit
- Promotion, Coupon, Campaign
- Review, Notification, NotificationTemplate
- SystemConfig, AuditLog, FAQ, Banner, SupportTicket

## 🛠️ สร้าง Admin User แรก

```bash
# เข้าไป Prisma Studio
npx prisma studio

# หรือใช้ SQL
INSERT INTO "AdminRole" (name, description) VALUES ('Super Admin', 'Full access');

INSERT INTO "AdminUser" (email, password, "firstName", "lastName", "roleId")
VALUES (
  'admin@rental.com',
  '$2b$10$...', -- bcrypt hash ของ 'admin123456'
  'Admin',
  'User',
  1
);
```

## 📚 Next Steps

1. ✅ สร้าง Admin User แรก
2. ✅ Login เข้า Backoffice
3. ✅ สร้าง Categories และ Items
4. ✅ ทดสอบการเช่าจาก Frontend Client
5. ✅ Setup Payment Gateway (ถ้าต้องการ)

---

สร้างเมื่อ: 2025-12-11
