import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createBike = async (req, res) => {
  try {
    const { name, type, description, pricePerDay, deposit } = req.body;
    const photos = req.files ? req.files.map(f => f.path) : [];

    console.log('Creating bike:', { name, type, description, pricePerDay, deposit });
    console.log('Photos:', photos);
    console.log('Owner:', req.user.id);

    const bike = await prisma.bike.create({
      data: {
        name,
        type,
        description,
        photos,
        pricePerDay: parseFloat(pricePerDay),
        deposit: parseFloat(deposit),
        ownerId: req.user.id,
      }
    });

    res.status(201).json({ message: 'Bike listed successfully', bike });
  } catch (error) {
    console.error('BIKE CREATE ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllBikes = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, search } = req.query;

    const where = {
      isAvailable: true,
      isSuspended: false,
    };

    if (type) where.type = type;
    if (minPrice || maxPrice) {
      where.pricePerDay = {};
      if (minPrice) where.pricePerDay.gte = parseFloat(minPrice);
      if (maxPrice) where.pricePerDay.lte = parseFloat(maxPrice);
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { owner: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const bikes = await prisma.bike.findMany({
      where,
      include: {
        owner: { select: { id: true, name: true, photo: true } },
        ratings: { select: { stars: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const bikesWithRating = bikes.map(bike => ({
      ...bike,
      avgRating: bike.ratings.length
        ? (bike.ratings.reduce((a, b) => a + b.stars, 0) / bike.ratings.length).toFixed(1)
        : null,
    }));

    res.json(bikesWithRating);
  } catch (error) {
    console.error('GET BIKES ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBikeById = async (req, res) => {
  try {
    const bike = await prisma.bike.findUnique({
      where: { id: req.params.id },
      include: {
        owner: { select: { id: true, name: true, photo: true, phone: true } },
        ratings: {
          include: { rater: { select: { name: true, photo: true } } },
          orderBy: { createdAt: 'desc' },
        },
        bookings: {
          where: { status: { in: ['CONFIRMED', 'ACTIVE'] } },
          select: { startDate: true, endDate: true },
        },
      },
    });

    if (!bike) return res.status(404).json({ message: 'Bike not found' });

    const avgRating = bike.ratings.length
      ? (bike.ratings.reduce((a, b) => a + b.stars, 0) / bike.ratings.length).toFixed(1)
      : null;

    res.json({ ...bike, avgRating });
  } catch (error) {
    console.error('GET BIKE ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOwnerBikes = async (req, res) => {
  try {
    const bikes = await prisma.bike.findMany({
      where: { ownerId: req.user.id },
      include: {
        ratings: { select: { stars: true } },
        bookings: {
          where: { status: { in: ['PENDING', 'CONFIRMED', 'ACTIVE'] } },
          select: { id: true, status: true, startDate: true, endDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bikes);
  } catch (error) {
    console.error('GET OWNER BIKES ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBike = async (req, res) => {
  try {
    const bike = await prisma.bike.findUnique({ where: { id: req.params.id } });
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    if (bike.ownerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const { name, type, description, pricePerDay, deposit, isAvailable } = req.body;

    const updated = await prisma.bike.update({
      where: { id: req.params.id },
      data: {
        name, type, description,
        pricePerDay: pricePerDay ? parseFloat(pricePerDay) : undefined,
        deposit: deposit ? parseFloat(deposit) : undefined,
        isAvailable: isAvailable !== undefined ? isAvailable === 'true' : undefined,
      }
    });

    res.json({ message: 'Bike updated', bike: updated });
  } catch (error) {
    console.error('UPDATE BIKE ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteBike = async (req, res) => {
  try {
    const bike = await prisma.bike.findUnique({ where: { id: req.params.id } });
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    if (bike.ownerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    await prisma.bike.delete({ where: { id: req.params.id } });
    res.json({ message: 'Bike deleted' });
  } catch (error) {
    console.error('DELETE BIKE ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};