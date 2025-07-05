const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Setting up production database...');
    
    // Check if database is accessible
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if admin user exists
    const adminExists = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });
    
    if (!adminExists) {
      console.log('👤 Creating admin user...');
      
      // Hash the password
      const hashedPassword = await bcrypt.hash('admin123!', 12);
      
      // Create admin user
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@creatorai.com',
          name: 'Admin User',
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date(),
        },
      });
      
      console.log('✅ Admin user created successfully!');
      console.log('📧 Email: admin@creatorai.com');
      console.log('🔑 Password: admin123!');
      console.log('👤 User ID:', adminUser.id);
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('');
    console.log('🎉 Production setup completed successfully!');
    console.log('📊 Database is ready for production use');
    
  } catch (error) {
    console.error('❌ Error during production setup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 