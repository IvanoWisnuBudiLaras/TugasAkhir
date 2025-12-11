import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hapus data kategori yang ada (opsional)
  await prisma.category.deleteMany();

  // Tambahkan data kategori
  const categories = [
    {
      name: 'Healthy Food',
      description: 'Makanan sehat untuk gaya hidup sehat',
    },
    {
      name: 'Minuman Segar',
      description: 'Minuman segar dan menyehatkan',
    },
    {
      name: 'Snack Sehat',
      description: 'Camilan sehat untuk kudapan ringan',
    },
    {
      name: 'Makanan Pokok',
      description: 'Makanan pokok sehat dan bergizi',
    },
  ];

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    });
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });