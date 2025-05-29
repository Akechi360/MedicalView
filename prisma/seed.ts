
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const adminEmail = 'godmode@mediview.com';
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('s1st3m4s1', 10);
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        fullName: 'GodMode',
        role: UserRole.ADMIN,
      },
    });
    console.log(`Created admin user: ${adminUser.email}`);
  } else {
    console.log(`Admin user ${adminUser.email} already exists.`);
    // Optionally update if needed, e.g., ensure password or role is correct if changed
    // For example, to ensure the password is the seeded one if it was changed manually:
    // const isPasswordCorrect = await bcrypt.compare('s1st3m4s1', adminUser.password);
    // if (!isPasswordCorrect) {
    //   const hashedPassword = await bcrypt.hash('s1st3m4s1', 10);
    //   await prisma.user.update({
    //     where: { email: adminEmail },
    //     data: { password: hashedPassword },
    //   });
    //   console.log(`Updated password for admin user: ${adminUser.email}`);
    // }
  }

  // You can add more seed data here for other models if needed
  // For example, creating some sample doctors or patients:
  /*
  const doctorEmail = 'doctor@mediview.com';
  let doctorUser = await prisma.user.findUnique({ where: { email: doctorEmail }});
  if (!doctorUser) {
    const hashedDoctorPassword = await bcrypt.hash('password123', 10);
    doctorUser = await prisma.user.create({
      data: {
        email: doctorEmail,
        password: hashedDoctorPassword,
        fullName: 'Dr. Alice Smith',
        role: UserRole.DOCTOR,
        specialty: 'Cardiology',
      },
    });
    console.log(`Created doctor user: ${doctorUser.email}`);
  }

  const patientEmail = 'patient@mediview.com';
  let patientUser = await prisma.user.findUnique({ where: { email: patientEmail }});
  if(!patientUser) {
    const hashedPatientPassword = await bcrypt.hash('password123', 10);
    patientUser = await prisma.user.create({
        data: {
            email: patientEmail,
            password: hashedPatientPassword,
            fullName: 'John Doe',
            role: UserRole.PATIENT,
            patientProfile: {
                create: {
                    fullName: 'John Doe',
                    dateOfBirth: new Date('1990-01-01T00:00:00.000Z'),
                    gender: 'MALE',
                }
            }
        }
    });
    console.log(`Created patient user: ${patientUser.email}`);
  }
  */

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
