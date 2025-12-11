FROM node:20.19.0

# ติดตั้ง OpenSSL และ CA Certificates ที่จำเป็นสำหรับ Prisma Engine
RUN apt-get update -y && apt-get install -y openssl ca-certificates procps

WORKDIR /usr/src/app

# Copy ไฟล์ package เพื่อ install dependencies
COPY package*.json ./

# Install dependencies (บน Debian ปัญหาน้อยกว่า Alpine)
RUN npm install

# Copy โค้ดทั้งหมด
COPY . .

# Generate Prisma Client (จะดาวน์โหลด Engine ที่ถูกต้องสำหรับ Debian)
RUN npx prisma generate

EXPOSE 8852

CMD ["npm", "run", "start:dev"]