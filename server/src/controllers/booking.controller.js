import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const COMMISSION_RATE = 0.10;

const calculateBookingCost = (startDate, endDate, pricePerDay) => {
  const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
  const totalCost = days * pricePerDay;
  const commission = totalCost * COMMISSION_RATE;
  const netPayout = totalCost - commission;
  return { days, totalCost, commission, netPayout };
};

export const createBooking = async (req, res) => {
  try {
    const { bikeId, startDate, endDate } = req.body;

    const bike = await prisma.bike.findUnique({ where: { id: bikeId } });
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    if (!bike.isAvailable) return res.status(400).json({ message: 'Bike is not available' });
    if (bike.ownerId === req.user.id) return res.status(400).json({ message: 'You cannot book your own bike' });

    const conflict = await prisma.booking.findFirst({
      where: {
        bikeId,
        status: { in: ['CONFIRMED', 'ACTIVE'] },
        OR: [
          { startDate: { lte: new Date(endDate) }, endDate: { gte: new Date(startDate) } },
        ],
      },
    });
    if (conflict) return res.status(400).json({ message: 'Bike already booked for these dates' });

    const { totalCost, commission, netPayout } = calculateBookingCost(startDate, endDate, bike.pricePerDay);

    const booking = await prisma.booking.create({
      data: {
        renterId: req.user.id,
        bikeId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalCost,
        commission,
        netPayout,
        status: 'PENDING',
      },
      include: {
        bike: { include: { owner: true } },
        renter: { select: { name: true, email: true } },
      },
    });

    await prisma.commission.create({
      data: { bookingId: booking.id, amount: commission, percentage: 10 },
    });

    await prisma.notification.create({
      data: {
        userId: bike.ownerId,
        title: 'New booking request',
        message: `${booking.renter.name} wants to book your bike "${bike.name}"`,
      },
    });

    const { io } = await import('../index.js');
    io.to(bike.ownerId).emit('new_notification', {
      title: 'New booking request',
      message: `${booking.renter.name} wants to book "${bike.name}"`,
    });

    res.status(201).json({ message: 'Booking request sent', booking });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        bike: true,
        renter: { select: { name: true, email: true } },
      },
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.bike.ownerId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status },
    });

    if (status === 'CONFIRMED') {
      await prisma.bike.update({
        where: { id: booking.bikeId },
        data: { isAvailable: false },
      });

      try {
        const { sendBookingConfirmationEmail } = await import('../utils/email.js');
        await sendBookingConfirmationEmail(booking.renter.email, {
          bikeName: booking.bike.name,
          startDate: new Date(booking.startDate).toDateString(),
          endDate: new Date(booking.endDate).toDateString(),
          totalCost: booking.totalCost,
          ownerPhone: booking.bike.ownerId,
        });
      } catch (emailError) {
        console.error('Email failed:', emailError.message);
      }
    }

    if (['COMPLETED', 'REJECTED', 'CANCELLED'].includes(status)) {
      await prisma.bike.update({
        where: { id: booking.bikeId },
        data: { isAvailable: true },
      });
    }

    await prisma.notification.create({
      data: {
        userId: booking.renterId,
        title: `Booking ${status.toLowerCase()}`,
        message: `Your booking for "${booking.bike.name}" has been ${status.toLowerCase()}`,
      },
    });

    const { io } = await import('../index.js');
    io.to(booking.renterId).emit('booking_update', {
      bookingId: booking.id,
      status,
      bikeName: booking.bike.name,
    });

    res.json({ message: `Booking ${status.toLowerCase()}`, booking: updated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRenterBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { renterId: req.user.id },
      include: {
        bike: {
          include: { owner: { select: { name: true, phone: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getOwnerBookings = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { bike: { ownerId: req.user.id } },
      include: {
        renter: { select: { id: true, name: true, email: true, phone: true, photo: true } },
        bike: { select: { id: true, name: true, photos: true, pricePerDay: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        bike: { include: { owner: { select: { name: true, phone: true } } } },
        renter: { select: { name: true, email: true, phone: true } },
      },
    });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { bike: true },
    });

    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.renterId !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    if (!['PENDING', 'CONFIRMED'].includes(booking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' },
    });

    await prisma.bike.update({
      where: { id: booking.bikeId },
      data: { isAvailable: true },
    });

    res.json({ message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};