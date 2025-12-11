import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertPermissions() {
  const permissions = [
    { name: 'admin.manage', module: 'admin', action: 'manage', description: 'Full admin access' },
    { name: 'admin.view_reports', module: 'reports', action: 'view', description: 'View system reports' },
    { name: 'admin.manage_content', module: 'content', action: 'manage', description: 'Manage backoffice content' },
  ];

  const records = [];
  for (const permission of permissions) {
    const record = await prisma.permission.upsert({
      where: { name: permission.name },
      update: {
        module: permission.module,
        action: permission.action,
        description: permission.description,
      },
      create: permission,
    });
    records.push(record);
  }
  return records;
}

async function upsertAdminRole(permissionIds: number[]) {
  return prisma.adminRole.upsert({
    where: { name: 'Super Admin' },
    update: {
      description: 'Full system access',
      permissions: { set: permissionIds.map((id) => ({ id })) },
    },
    create: {
      name: 'Super Admin',
      description: 'Full system access',
      permissions: {
        connect: permissionIds.map((id) => ({ id })),
      },
    },
  });
}

async function upsertAdminUser(roleId: number) {
  const email = 'admin@rental.local';
  const password = 'Admin@123';
  const hashed = await bcrypt.hash(password, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      roleId,
      password: hashed,
      firstName: 'System',
      lastName: 'Admin',
      isActive: true,
    },
    create: {
      email,
      password: hashed,
      firstName: 'System',
      lastName: 'Admin',
      roleId,
      isActive: true,
    },
    include: { role: { include: { permissions: true } } },
  });

  return { ...admin, password: undefined, plaintextPassword: password };
}

async function main() {
  const permissions = await upsertPermissions();
  const role = await upsertAdminRole(permissions.map((p) => p.id));
  const admin = await upsertAdminUser(role.id);

  console.log('✅ Seeded admin user for backoffice login');
  console.log(`Email: ${admin.email}`);
  console.log(`Password: ${admin.plaintextPassword}`);
}

main()
  .catch((error) => {
    console.error('❌ Failed to seed data', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
