FROM node:20.19.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8851

# รัน Vite บน Port 8851
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8851"]