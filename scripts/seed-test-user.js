const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('testpass123', 12);
    
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email: test@example.com');
    console.log('🔑 Password: testpass123');
    console.log('👤 User ID:', testUser.id);

    // Create a test agency for the user
    const testAgency = await prisma.agency.create({
      data: {
        name: 'Test Agency',
        description: 'A test agency for development',
        users: {
          connect: { id: testUser.id }
        }
      },
    });

    console.log('🏢 Test agency created:', testAgency.name);

    // Update user with agency
    await prisma.user.update({
      where: { id: testUser.id },
      data: { agencyId: testAgency.id }
    });

    console.log('✅ Test user linked to agency successfully!');
    
  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 