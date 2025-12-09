import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    barId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bar',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    paymentMethod: {
      type: String,
      enum: ['swish', 'paypal', 'manual'],
      default: 'manual',
    },
    donorInfo: {
      name: String,
      email: String,
      message: String,
    },
  },
  {
    timestamps: true,
  }
);

donationSchema.index({ barId: 1, createdAt: -1 });

export default mongoose.model('Donation', donationSchema);

