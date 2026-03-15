import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createRating = async (req, res) => {
  try {
    const { bookingId, stars, review } = req.body;

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { bike: true },
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.renterId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (booking.status !== 'COMPLETED') return res.status(400).json({ message: 'Can only rate completed bookings' });

    const existing = await prisma.rating.findUnique({ where: { bookingId } });
    if (existing) return res.status(400).json({ message: 'Already rated this booking' });

    const rating = await prisma.rating.create({
      data: {
        bookingId,
        raterId: req.user.id,
        rateeId: booking.bike.ownerId,
        bikeId: booking.bikeId,
        stars: parseInt(stars),
        review,
      },
    });

    res.status(201).json({ message: 'Rating submitted', rating });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBikeRatings = async (req, res) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { bikeId: req.params.bikeId },
      include: { rater: { select: { name: true, photo: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};