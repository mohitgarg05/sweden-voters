import Bar from '../models/Bar.js';

export const getAllBars = async (req, res) => {
  try {
    const bars = await Bar.find({ isActive: true }).sort({ order: 1 });
    res.json(bars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBarById = async (req, res) => {
  try {
    const bar = await Bar.findById(req.params.id);
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found' });
    }
    res.json(bar);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createBar = async (req, res) => {
  try {
    const { label, currentValue, swishNumber, paypalUser, order, about, color } = req.body;
    const bar = new Bar({
      label,
      currentValue: currentValue || 0,
      swishNumber,
      paypalUser,
      order: order || 0,
      about: about || '',
      color: color || '#2b7a78',
    });
    const savedBar = await bar.save();
    res.status(201).json(savedBar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBar = async (req, res) => {
  try {
    const { label, currentValue, swishNumber, paypalUser, isActive, order, about, color } = req.body;
    const bar = await Bar.findByIdAndUpdate(
      req.params.id,
      {
        ...(label && { label }),
        ...(currentValue !== undefined && { currentValue }),
        ...(swishNumber && { swishNumber }),
        ...(paypalUser && { paypalUser }),
        ...(isActive !== undefined && { isActive }),
        ...(order !== undefined && { order }),
        ...(about !== undefined && { about }),
        ...(color !== undefined && { color }),
      },
      { new: true, runValidators: true }
    );
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found' });
    }
    res.json(bar);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteBar = async (req, res) => {
  try {
    const bar = await Bar.findByIdAndDelete(req.params.id);
    if (!bar) {
      return res.status(404).json({ error: 'Bar not found' });
    }
    res.json({ message: 'Bar deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBarsAdmin = async (req, res) => {
  try {
    const bars = await Bar.find().sort({ order: 1 });
    res.json(bars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

