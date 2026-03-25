const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@botho.ac.bw' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@botho.ac.bw',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('Created admin user:', admin.email)

  // Create doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10)
  const doctor = await prisma.user.upsert({
    where: { email: 'sekutlu@botho.ac.bw' },
    update: {},
    create: {
      name: 'Dr. Relebohile Sekutlu',
      email: 'sekutlu@botho.ac.bw',
      password: doctorPassword,
      role: 'doctor',
    },
  })
  console.log('Created doctor user:', doctor.email)

  // Create nurse
  const nursePassword = await bcrypt.hash('nurse123', 10)
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@botho.ac.bw' },
    update: {},
    create: {
      name: 'Nurse Palesa Mokoena',
      email: 'nurse@botho.ac.bw',
      password: nursePassword,
      role: 'nurse',
    },
  })
  console.log('Created nurse user:', nurse.email)

  // Create sample patients with Sesotho names
  const patient1 = await prisma.patient.upsert({
    where: { studentId: 'STU001' },
    update: {},
    create: {
      studentId: 'STU001',
      firstName: 'Thabo',
      lastName: 'Mokoena',
      gender: 'Male',
      dateOfBirth: new Date('2003-05-15'),
      phone: '+267 71234567',
      address: 'Block 8, Gaborone',
    },
  })
  console.log('Created patient:', patient1.studentId)

  const patient2 = await prisma.patient.upsert({
    where: { studentId: 'STU002' },
    update: {},
    create: {
      studentId: 'STU002',
      firstName: 'Keabetswe',
      lastName: 'Kgosi',
      gender: 'Female',
      dateOfBirth: new Date('2004-08-22'),
      phone: '+267 72345678',
      address: 'Broadhurst, Gaborone',
    },
  })
  console.log('Created patient:', patient2.studentId)

  const patient3 = await prisma.patient.upsert({
    where: { studentId: 'STU003' },
    update: {},
    create: {
      studentId: 'STU003',
      firstName: 'Lesego',
      lastName: 'Motlhanka',
      gender: 'Female',
      dateOfBirth: new Date('2003-11-10'),
      phone: '+267 73456789',
      address: 'Old Naledi, Gaborone',
    },
  })
  console.log('Created patient:', patient3.studentId)

  const patient4 = await prisma.patient.upsert({
    where: { studentId: 'STU004' },
    update: {},
    create: {
      studentId: 'STU004',
      firstName: 'Kagiso',
      lastName: 'Sebele',
      gender: 'Male',
      dateOfBirth: new Date('2004-03-18'),
      phone: '+267 74567890',
      address: 'Extension 2, Gaborone',
    },
  })
  console.log('Created patient:', patient4.studentId)

  const patient5 = await prisma.patient.upsert({
    where: { studentId: 'STU005' },
    update: {},
    create: {
      studentId: 'STU005',
      firstName: 'Boitumelo',
      lastName: 'Kgalemang',
      gender: 'Female',
      dateOfBirth: new Date('2003-07-25'),
      phone: '+267 75678901',
      address: 'Tlokweng, Gaborone',
    },
  })
  console.log('Created patient:', patient5.studentId)

  const patient6 = await prisma.patient.upsert({
    where: { studentId: 'STU006' },
    update: {},
    create: {
      studentId: 'STU006',
      firstName: 'Tebogo',
      lastName: 'Moagi',
      gender: 'Male',
      dateOfBirth: new Date('2004-01-30'),
      phone: '+267 76789012',
      address: 'Block 6, Gaborone',
    },
  })
  console.log('Created patient:', patient6.studentId)

  const patient7 = await prisma.patient.upsert({
    where: { studentId: 'STU007' },
    update: {},
    create: {
      studentId: 'STU007',
      firstName: 'Onthatile',
      lastName: 'Gabaitse',
      gender: 'Female',
      dateOfBirth: new Date('2003-09-12'),
      phone: '+267 77890123',
      address: 'Mogoditshane, Gaborone',
    },
  })
  console.log('Created patient:', patient7.studentId)

  const patient8 = await prisma.patient.upsert({
    where: { studentId: 'STU008' },
    update: {},
    create: {
      studentId: 'STU008',
      firstName: 'Kgotso',
      lastName: 'Mosweu',
      gender: 'Male',
      dateOfBirth: new Date('2004-06-08'),
      phone: '+267 78901234',
      address: 'Phakalane, Gaborone',
    },
  })
  console.log('Created patient:', patient8.studentId)

  // Create sample medical records with 2026 dates
  await prisma.medicalRecord.create({
    data: {
      patientId: patient1.id,
      diagnosis: 'Common Cold',
      treatment: 'Rest and hydration',
      prescription: 'Paracetamol 500mg, twice daily for 3 days',
      visitDate: new Date('2026-01-15'),
      doctorId: doctor.id,
    },
  })
  console.log('Created medical record for patient:', patient1.studentId)

  await prisma.medicalRecord.create({
    data: {
      patientId: patient2.id,
      diagnosis: 'Migraine',
      treatment: 'Pain management and rest',
      prescription: 'Ibuprofen 400mg, as needed',
      visitDate: new Date('2026-01-14'),
      doctorId: doctor.id,
    },
  })
  console.log('Created medical record for patient:', patient2.studentId)

  await prisma.medicalRecord.create({
    data: {
      patientId: patient3.id,
      diagnosis: 'Allergic Reaction',
      treatment: 'Antihistamine therapy',
      prescription: 'Cetirizine 10mg, once daily',
      visitDate: new Date('2026-01-13'),
      doctorId: doctor.id,
    },
  })
  console.log('Created medical record for patient:', patient3.studentId)

  // Create sample appointments with 2026 dates
  await prisma.appointment.create({
    data: {
      patientId: patient2.id,
      appointmentDate: new Date('2026-01-20T10:00:00'),
      status: 'scheduled',
      notes: 'Follow-up consultation for migraine',
    },
  })
  console.log('Created appointment for patient:', patient2.studentId)

  await prisma.appointment.create({
    data: {
      patientId: patient4.id,
      appointmentDate: new Date('2026-01-20T14:00:00'),
      status: 'scheduled',
      notes: 'Annual health check-up',
    },
  })
  console.log('Created appointment for patient:', patient4.studentId)

  await prisma.appointment.create({
    data: {
      patientId: patient5.id,
      appointmentDate: new Date('2026-01-21T09:00:00'),
      status: 'scheduled',
      notes: 'General consultation',
    },
  })
  console.log('Created appointment for patient:', patient5.studentId)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
