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
        label: 'V',
        currentValue: 120,
        swishNumber: '+46700000001',
        order: 1,
        color: 'rgb(145, 20, 20)',
        about: 'V stands for socialist, feminist, and green policies, advocating for social justice, equality',
      },
      {
        label: 'S',
        currentValue: 80,
        swishNumber: '+46700000002',
        order: 2,
        color: 'rgb(224, 46, 61)',
        about: 'Social democratic party advocating for workers rights and equality.',
      },
      {
        label: 'M P',
        currentValue: 200,
        swishNumber: '+46700000003',
        order: 3,
        color: 'rgb(130, 200, 130)',
        about: 'Green party committed to environmental protection and sustainability.',
      },
      {
        label: 'C',
        currentValue: 40,
        swishNumber: '+46700000004',
        order: 4,
        color: 'rgb(49, 165, 50)',
        about: 'Centre party representing rural interests and regional development.',
      },
      {
        label: 'L',
        currentValue: 60,
        swishNumber: '+46700000005',
        order: 5,
        color: 'rgb(30, 105, 170)',
        about: 'Liberal party promoting individual freedom and market economy.',
      },
      {
        label: 'K D',
        currentValue: 95,
        swishNumber: '+46700000006',
        order: 6,
        color: 'rgb(51, 29, 121)',
        about: 'Christian democratic party with values-based politics.',
      },
      {
        label: 'M',
        currentValue: 30,
        swishNumber: '+46700000007',
        order: 7,
        color: 'rgb(125, 190, 225)',
        about: 'Moderate party supporting free markets and conservative values.',
      },
      {
        label: 'S D',
        currentValue: 140,
        swishNumber: '+46700000008',
        order: 8,
        color: 'rgb(255, 195, 70)',
        about: 'Sweden Democrats focusing on immigration and national identity.',
      }
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

