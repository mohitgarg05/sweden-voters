import mongoose from 'mongoose';
import Donation from '../models/Donation.js';
import Bar from '../models/Bar.js';

export const createDonation = async (req, res) => {
  try {
    const { barId, amount, paymentMethod, donorInfo } = req.body;

    const bar = await Bar.findById(barId);
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found' });
    }

    const donation = new Donation({
      barId,
      amount,
      paymentMethod: paymentMethod || 'manual',
      donorInfo: donorInfo || {},
    });

    const savedDonation = await donation.save();

    bar.currentValue += amount;
    await bar.save();

    res.status(201).json(savedDonation);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getDonations = async (req, res) => {
  try {
    const { barId, limit = 50, skip = 0 } = req.query;
    const query = barId ? { barId } : {};

    const donations = await Donation.find(query)
      .populate('barId', 'label')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Donation.countDocuments(query);

    res.json({
      donations,
      total,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate('barId', 'label');
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDonationStats = async (req, res) => {
  try {
    const { barId } = req.query;
    const matchStage = barId ? { $match: { barId: new mongoose.Types.ObjectId(barId) } } : { $match: {} };

    const stats = await Donation.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalDonations: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
        },
      },
    ]);

    res.json(stats[0] || { totalDonations: 0, totalAmount: 0, averageAmount: 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

