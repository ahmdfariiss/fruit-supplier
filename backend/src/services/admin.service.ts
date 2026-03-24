import { prisma } from '../config/database';

export const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const [
    totalOrders,
    ordersToday,
    ordersThisMonth,
    totalRevenue,
    totalUsers,
    newUsersThisMonth,
    totalProducts,
    pendingOrders,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfDay } } }),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DONE'] } },
    }),
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        total: true,
        status: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    }),
  ]);

  // Top products
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId', 'productName'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });

  return {
    totalOrders,
    ordersToday,
    ordersThisMonth,
    totalRevenue: totalRevenue._sum.total || 0,
    totalUsers,
    newUsersThisMonth,
    totalProducts,
    pendingOrders,
    recentOrders,
    topProducts: topProducts.map((p: any) => ({
      productId: p.productId,
      productName: p.productName,
      totalSold: p._sum.quantity || 0,
    })),
  };
};

export const getUsers = async (
  search?: string,
  role?: string,
  page = 1,
  limit = 10,
) => {
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }
  if (role) {
    where.role = role;
  }

  const skip = (page - 1) * limit;

  const [users, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
    },
  };
};

export const updateUserRole = async (
  userId: string,
  role: 'ADMIN' | 'BUYER',
) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });
};

export const toggleUserActive = async (userId: string, isActive: boolean) => {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive },
    select: { id: true, name: true, email: true, role: true, isActive: true },
  });
};

export const deleteUser = async (userId: string) => {
  // Delete related data first
  await prisma.refreshToken.deleteMany({ where: { userId } });
  await prisma.cartItem.deleteMany({ where: { userId } });
  await prisma.userVoucher.deleteMany({ where: { userId } });

  return prisma.user.delete({ where: { id: userId } });
};
