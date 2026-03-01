import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const connectionString =
  process.env.DIRECT_URL || process.env.DATABASE_URL || '';
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Seeding database...');

  // ══ Admin User ══
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@buahkita.id' },
    update: {},
    create: {
      name: 'Admin BuahKita',
      email: 'admin@buahkita.id',
      passwordHash: adminPassword,
      role: 'ADMIN',
      phone: '081234567890',
      isVerified: true,
    },
  });
  console.log(`  ✅ Admin: ${admin.email}`);

  // ══ Sample Buyer ══
  const buyerPassword = await bcrypt.hash('buyer123', 12);
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@buahkita.id' },
    update: {},
    create: {
      name: 'Pembeli Demo',
      email: 'buyer@buahkita.id',
      passwordHash: buyerPassword,
      role: 'BUYER',
      phone: '089876543210',
      isVerified: true,
    },
  });
  console.log(`  ✅ Buyer: ${buyer.email}`);

  // ══ Categories ══
  const categoriesData = [
    { name: 'Buah Tropis', slug: 'buah-tropis', icon: '🥭' },
    { name: 'Buah Impor', slug: 'buah-impor', icon: '🍎' },
    { name: 'Buah Lokal', slug: 'buah-lokal', icon: '🍌' },
    { name: 'Buah Musiman', slug: 'buah-musiman', icon: '🍉' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories.push(category);
  }
  console.log(`  ✅ ${categories.length} Categories`);

  // ══ Products ══
  const productsData = [
    {
      name: 'Mangga Harum Manis',
      slug: 'mangga-harum-manis',
      description:
        'Mangga harum manis premium dari Probolinggo, daging buah tebal dan manis sempurna. Cocok untuk konsumsi langsung maupun campuran jus.',
      categoryId: categories[0].id,
      priceConsumer: 45000,
      priceReseller: 35000,
      minOrderReseller: 5,
      stock: 200,
      unit: 'kg',
      isFeatured: true,
      seasonStart: 9,
      seasonEnd: 12,
      tags: ['premium', 'lokal', 'manis'],
    },
    {
      name: 'Apel Fuji',
      slug: 'apel-fuji',
      description:
        'Apel Fuji import dari Jepang, rasa manis dan renyah. Dipetik saat matang sempurna untuk memastikan kualitas terbaik.',
      categoryId: categories[1].id,
      priceConsumer: 75000,
      priceReseller: 60000,
      minOrderReseller: 3,
      stock: 150,
      unit: 'kg',
      isFeatured: true,
      tags: ['import', 'premium'],
    },
    {
      name: 'Pisang Cavendish',
      slug: 'pisang-cavendish',
      description:
        'Pisang Cavendish organik dari Lampung, ukuran seragam, manis alami. Ideal untuk kebutuhan hotel, restoran dan catering.',
      categoryId: categories[2].id,
      priceConsumer: 25000,
      priceReseller: 18000,
      minOrderReseller: 10,
      stock: 500,
      unit: 'sisir',
      isFeatured: true,
      tags: ['organik', 'lokal'],
    },
    {
      name: 'Semangka Merah',
      slug: 'semangka-merah',
      description:
        'Semangka merah tanpa biji, sangat segar dan manis. Berat rata-rata 5-7 kg per buah. Cocok untuk acara dan pesta.',
      categoryId: categories[3].id,
      priceConsumer: 35000,
      priceReseller: 25000,
      minOrderReseller: 5,
      stock: 100,
      unit: 'buah',
      seasonStart: 6,
      seasonEnd: 8,
      tags: ['segar', 'tanpa-biji'],
    },
    {
      name: 'Kelengkeng Pingpong',
      slug: 'kelengkeng-pingpong',
      description:
        'Kelengkeng Pingpong berukuran besar, daging buah tebal, dan rasa manis legit. Langsung dari kebun petani lokal.',
      categoryId: categories[0].id,
      priceConsumer: 55000,
      priceReseller: 42000,
      minOrderReseller: 3,
      stock: 80,
      unit: 'kg',
      seasonStart: 1,
      seasonEnd: 3,
      tags: ['premium', 'musiman'],
    },
    {
      name: 'Jeruk Mandarin',
      slug: 'jeruk-mandarin',
      description:
        'Jeruk Mandarin impor kualitas super. Kulit tipis mudah dikupas, rasa manis menyegarkan. Sumber vitamin C terbaik.',
      categoryId: categories[1].id,
      priceConsumer: 65000,
      priceReseller: 50000,
      minOrderReseller: 5,
      stock: 120,
      unit: 'kg',
      isFeatured: true,
      tags: ['import', 'vitamin-c'],
    },
    {
      name: 'Durian Musang King',
      slug: 'durian-musang-king',
      description:
        'Durian Musang King Malaysia premium. Daging buah kuning pekat, creamy, dan aroma khas yang kuat. Raja buah sejati.',
      categoryId: categories[3].id,
      priceConsumer: 250000,
      priceReseller: 200000,
      minOrderReseller: 2,
      stock: 30,
      unit: 'buah',
      seasonStart: 11,
      seasonEnd: 2,
      tags: ['premium', 'import', 'musiman'],
    },
    {
      name: 'Alpukat Mentega',
      slug: 'alpukat-mentega',
      description:
        'Alpukat mentega lokal kualitas super. Daging buah kuning, lembut seperti mentega, tanpa serat. Sempurna untuk jus atau dimakan langsung.',
      categoryId: categories[2].id,
      priceConsumer: 40000,
      priceReseller: 30000,
      minOrderReseller: 5,
      stock: 180,
      unit: 'kg',
      tags: ['lokal', 'premium'],
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`  ✅ ${productsData.length} Products`);

  // ══ Banners ══
  const bannersData = [
    {
      title: 'Buah Segar Setiap Hari',
      imageUrl: '/images/banners/banner1.svg',
      linkUrl: '/products',
      orderIndex: 0,
    },
    {
      title: 'Diskon Reseller Hingga 30%',
      imageUrl: '/images/banners/banner2.svg',
      linkUrl: '/products?mode=reseller',
      orderIndex: 1,
    },
    {
      title: 'Musim Durian Telah Tiba!',
      imageUrl: '/images/banners/banner3.svg',
      linkUrl: '/products/durian-musang-king',
      orderIndex: 2,
    },
  ];

  for (const banner of bannersData) {
    await prisma.banner.create({ data: banner });
  }
  console.log(`  ✅ ${bannersData.length} Banners`);

  // ══ Quiz Questions ══
  const quizData = [
    {
      question: 'Buah apa yang dijuluki "Raja Buah"?',
      options: ['Mangga', 'Durian', 'Rambutan', 'Nangka'],
      correctIndex: 1,
      explanation:
        'Durian dijuluki Raja Buah karena aromanya yang khas dan rasanya yang unik.',
    },
    {
      question: 'Vitamin apa yang paling banyak terkandung dalam jeruk?',
      options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
      correctIndex: 2,
      explanation:
        'Jeruk terkenal sebagai sumber Vitamin C yang sangat baik untuk imunitas tubuh.',
    },
    {
      question: 'Buah apa yang mengandung enzim bromelain?',
      options: ['Pepaya', 'Nanas', 'Mangga', 'Melon'],
      correctIndex: 1,
      explanation:
        'Nanas mengandung enzim bromelain yang membantu pencernaan protein.',
    },
    {
      question: 'Negara asal buah kiwi adalah?',
      options: ['Australia', 'Selandia Baru', 'China', 'Jepang'],
      correctIndex: 2,
      explanation:
        'Kiwi berasal dari China dan dibawa ke Selandia Baru pada awal abad ke-20.',
    },
    {
      question: 'Buah pisang termasuk dalam keluarga tumbuhan apa?',
      options: ['Rumput', 'Herba', 'Pohon', 'Semak'],
      correctIndex: 1,
      explanation:
        'Pisang adalah tanaman herba raksasa, bukan pohon. Batangnya terbuat dari pelepah daun.',
    },
  ];

  for (const quiz of quizData) {
    await prisma.quizQuestion.create({ data: quiz });
  }
  console.log(`  ✅ ${quizData.length} Quiz Questions`);

  // ══ Vouchers ══
  const vouchersData = [
    {
      code: 'WELCOME10',
      discountType: 'PERCENTAGE' as const,
      discountValue: 10,
      minPurchase: 100000,
      usageLimit: 100,
      validUntil: new Date('2026-12-31'),
    },
    {
      code: 'BUAH20',
      discountType: 'PERCENTAGE' as const,
      discountValue: 20,
      minPurchase: 200000,
      maxDiscount: 50000,
      usageLimit: 50,
      validUntil: new Date('2026-12-31'),
    },
  ];

  for (const voucher of vouchersData) {
    await prisma.voucher.upsert({
      where: { code: voucher.code },
      update: {},
      create: voucher,
    });
  }
  console.log(`  ✅ ${vouchersData.length} Vouchers`);

  // ══ Reseller Map Locations ══
  const mapData = [
    {
      name: 'Toko Buah Segar - Jakarta',
      address: 'Jl. Raya Pasar Minggu No. 12, Jakarta Selatan',
      lat: -6.2615,
      lng: 106.842,
      phone: '021-7654321',
    },
    {
      name: 'Buah Nusantara - Bandung',
      address: 'Jl. Braga No. 45, Bandung',
      lat: -6.9175,
      lng: 107.6191,
      phone: '022-4206789',
    },
    {
      name: 'Fresh Fruit Corner - Surabaya',
      address: 'Jl. Tunjungan No. 78, Surabaya',
      lat: -7.2575,
      lng: 112.7521,
      phone: '031-5467890',
    },
  ];

  for (const loc of mapData) {
    await prisma.resellerMap.create({ data: loc });
  }
  console.log(`  ✅ ${mapData.length} Reseller Map Locations`);

  console.log('\n🎉 Seeding completed!');
  console.log('\n📋 Login credentials:');
  console.log('   Admin: admin@buahkita.id / admin123');
  console.log('   Buyer: buyer@buahkita.id / buyer123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
