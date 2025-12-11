FROM node:20.19.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8850

# รัน Vite โดย Bind Host 0.0.0.0 เพื่อให้เข้าถึงจากภายนอก Container ได้
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8850"]