import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getStats = async (req, res) => {
  try {
    const [totalUsers, totalBikes, totalBookings, commissionData] = await Promise.all([
      prisma.user.count(),
      prisma.bike.count(),
      prisma.booking.count(),
      prisma.commission.aggregate({ _sum: { amount: true } }),
    ]);

    const activeRentals = await prisma.booking.count({
      where: { status: 'ACTIVE' },
    });

    const totalCommission = commissionData._sum.amount || 0;

    res.json({
      totalUsers,
      totalBikes,
      totalBookings,
      activeRentals,
      totalCommission,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isSuspended: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleSuspendUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { isSuspended: !user.isSuspended },
    });

    res.json({
      message: `User ${updated.isSuspended ? 'suspended' : 'unsuspended'}`,
      user: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllListings = async (req, res) => {
  try {
    const bikes = await prisma.bike.findMany({
      include: {
        owner: { select: { name: true, email: true } },
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bikes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleSuspendListing = async (req, res) => {
  try {
    const bike = await prisma.bike.findUnique({ where: { id: req.params.id } });
    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    const updated = await prisma.bike.update({
      where: { id: req.params.id },
      data: { isSuspended: !bike.isSuspended },
    });

    res.json({
      message: `Listing ${updated.isSuspended ? 'suspended' : 'unsuspended'}`,
      bike: updated,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        renter: { select: { name: true, email: true } },
        bike: { select: { name: true, pricePerDay: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCommissionRate = async (req, res) => {
  try {
    const { percentage } = req.body;
    if (!percentage || percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: 'Invalid commission percentage' });
    }
    res.json({ message: 'Commission rate updated', percentage });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};