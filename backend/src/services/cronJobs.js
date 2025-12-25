import cron from 'node-cron';
import Donation from '../models/Donation.js';

/**
 * Deletes pending donations (Swish and Card) that have been pending for more than 2 days
 */
export const deleteOldPendingSwishDonations = async () => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const result = await Donation.deleteMany({
      $or: [
        {
          paymentMethod: 'swish',
          swishStatus: 'pending',
          createdAt: { $lt: twoDaysAgo },
        },
        {
          paymentMethod: 'card',
          stripePaymentStatus: 'pending',
          createdAt: { $lt: twoDaysAgo },
        },
      ],
    });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} old pending donation(s) (Swish/Card)`);
    }
  } catch (error) {
    console.error('Error deleting old pending donations:', error);
  }
};

/**
 * Initialize cron jobs
 * Runs daily at midnight (00:00) to clean up old pending donations (Swish and Card)
 */
export const initializeCronJobs = () => {
  // Run daily at midnight (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log('Running cron job: Deleting old pending donations (Swish/Card)...');
    await deleteOldPendingSwishDonations();
  });

  console.log('Cron jobs initialized: Old pending donations cleanup scheduled (daily at midnight)');
};

