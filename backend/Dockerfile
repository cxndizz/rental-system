# ใช้ Node v20.19.0 ตาม Requirement
FROM node:20.19.0-alpine

# กำหนด Working Directory ใน Container
WORKDIR /usr/src/app

# Copy ไฟล์ package ไปก่อนเพื่อ install dependencies (Cache Layering)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy โค้ดทั้งหมดเข้าไป
COPY . .

# Generate Prisma Client (เพื่อให้รู้จัก Schema ที่เราเขียนไว้)
RUN npx prisma generate

# เปิด Port 8852
EXPOSE 8852

# คำสั่งรัน NestJS ในโหมด Dev
CMD ["npm", "run", "start:dev"]