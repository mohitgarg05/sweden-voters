import mongoose from 'mongoose';

const barSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    currentValue: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    swishNumber: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      trim: true,
      default: '',
    },
    color: {
      type: String,
      trim: true,
      default: '#2b7a78',
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Bar', barSchema);

