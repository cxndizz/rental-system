import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. เปิดใช้งาน CORS (Cross-Origin Resource Sharing)
  // เพื่อให้ Frontend (Port 8850, 8851) ยิง API มาหา Backend ได้
  app.enableCors({
    origin: '*', // ใน Production ควรระบุ domain ที่แน่นอน
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. ตั้งค่า Global Validation Pipe (สำหรับตรวจสอบข้อมูลที่ส่งเข้ามา)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // ตัด field ที่ไม่ได้อยู่ใน DTO ทิ้ง
    transform: true, // แปลง type อัตโนมัติ (เช่น string -> number)
  }));

  // 3. กำหนด Port 8852
  const port = process.env.PORT || 8852;
  await app.listen(port, '0.0.0.0'); // '0.0.0.0' สำคัญมากสำหรับ Docker
  
  console.log(`🚀 Backend is running on: http://localhost:${port}`);
}
bootstrap();