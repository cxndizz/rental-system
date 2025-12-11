สร้างระบบเว็บแอป “เช่ายืม (Rental System)” โดยใช้
    * **Node:**  v20.19.0
    * **NPM:** 10.8.2
    * **Backend:** NESTJS (port: 8852)
    * **Frontend-Client:** VUE3 + Tailwind (port: 8850)
    * **Frontend-Backoffice:** VUE3 + Tailwind (port: 8851)
    * **Database:** Postgres + Prisma (port: 8853)
    * **Run with Docker Compose**
ให้สร้างสถาปัตยกรรม โปรเจกต์สตรักเจอร์ และสร้างโค้ดทั้งหมดแบบละเอียด โดยมีฟีเจอร์ดังนี้:
## **1) Modules (Backend API – NestJS)**
    * auth (login, register, roles)
    * users (profile, addresses, KYC)
    * items (item, category, tags, media)
    * rentals (rental order, status flow)
    * returns (return, inspection, damage)
    * payments (transactions, invoices, refunds)
    * deposits (hold/release deposit)
    * promotions (pricing rules, coupons, campaigns)
    * reviews (rating/comment)
    * notifications (send, template, logs)
    * admin (staff, roles, permissions)
    * reports (summary, export)
    * config (system settings, fee rules)
    * audit (logging)
## **2) Frontend-Client (Vue port: 8850) – Menus**
    * Home
    * Browse Items / Search / Filter
    * Item Detail
    * Login / Register / KYC
    * User Dashboard
    * My Rentals / Rental Detail
    * Upcoming Returns / Overdue
    * Wishlist
    * Checkout / Payment
    * Return Request
    * Notifications
    * Support / Tickets
    * Review & Rating
    #Focus on Responsive Mobile first, Tablet, Desktop
## **3) Frontend-Backoffice (Vue port: 8851) – Menus**
    * Admin Login
    * Dashboard
    * Items (list/create/edit/category/tag/media)
    * Rentals (orders, approve/reject, assign item)
    * Returns (queue, inspection, damage report, penalty)
    * Customers (list/detail/KYC/blacklist)
    * Payments (transactions, refunds, invoices)
    * Promotions (pricing rules, coupons, campaigns)
    * Content (banners, static pages, FAQ)
    * Notifications (template, broadcast, log)
    * Roles & Permissions
    * Reports (rental, revenue, item utilization, customer)
    * System Config (policy, fees, gateway config)
    * Audit Log
    #Focus on Responsive Mobile first, Tablet, Desktop
## **4) Database Entities (Prisma)**
    User, UserProfile, UserKYC, AdminUser, Role, Permission, Item, ItemCategory, ItemTag, ItemMedia, RentalOrder, RentalItem, Return, DamageReport, PaymentTransaction, Deposit, Invoice, Promotion, Coupon, Review, Notification, NotificationTemplate, SystemConfig, AuditLog
## **สิ่งที่ต้องการจาก AI**
    * ออกแบบโฟลเดอร์ทั้งหมด (backend, frontend-client, frontend-backoffice, db, docker)
    * สร้างไฟล์ตั้งต้นที่จำเป็น เช่น main.ts, router, layout, service, prisma schema
    * ตั้งค่า Docker Compose ให้ 4 service ทำงานบนพอร์ตที่กำหนด
    * กำหนด API endpoint แบบสั้น ๆ ของแต่ละโมดูล
    * กำหนด frontend routes แบบสั้น ๆ ของ client/backoffice
    * ห้ามเขียนโค้ดยาวเกินไป ให้ใช้สรุปโครงสร้างและตัวอย่างเฉพาะส่วนสำคัญเท่านั้น