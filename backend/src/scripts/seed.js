import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Bar from '../models/Bar.js';
import { connectDB } from '../config/database.js';

dotenv.config();

const seedBars = async () => {
  try {
    await connectDB();

    await Bar.deleteMany({});

    const bars = [
      {
        label: 'Bar 1',
        currentValue: 120,
        swishNumber: '+46700000001',
        paypalUser: 'yourname/',
        order: 1,
      },
      {
        label: 'Bar 2',
        currentValue: 80,
        swishNumber: '+46700000002',
        paypalUser: 'yourname/',
        order: 2,
      },
      {
        label: 'Bar 3',
        currentValue: 200,
        swishNumber: '+46700000003',
        paypalUser: 'yourname/',
        order: 3,
      },
      {
        label: 'Bar 4',
        currentValue: 40,
        swishNumber: '+46700000004',
        paypalUser: 'yourname/',
        order: 4,
      },
      {
        label: 'Bar 5',
        currentValue: 60,
        swishNumber: '+46700000005',
        paypalUser: 'yourname/',
        order: 5,
      },
      {
        label: 'Bar 6',
        currentValue: 95,
        swishNumber: '+46700000006',
        paypalUser: 'yourname/',
        order: 6,
      },
      {
        label: 'Bar 7',
        currentValue: 30,
        swishNumber: '+46700000007',
        paypalUser: 'yourname/',
        order: 7,
      },
      {
        label: 'Bar 8',
        currentValue: 140,
        swishNumber: '+46700000008',
        paypalUser: 'yourname/',
        order: 8,
      },
    ];

    await Bar.insertMany(bars);
    console.log('Bars seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding bars:', error);
    process.exit(1);
  }
};

seedBars();

