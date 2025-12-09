import { useState, useEffect, useCallback } from 'react';
import { fetchBars, addDonation } from '../services/api';
import { animate, randomDelay } from '../utils/animation';
import { ANIMATION_DURATION, ANIMATION_DELAY_MAX } from '../constants/config';

export function useDonationBars() {
  const [bars, setBars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBars();
      setBars(data);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load bars:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBars();
  }, [loadBars]);

  const addDonationToBar = useCallback(async (barIndex, amount) => {
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    const bar = bars[barIndex];
    if (!bar) {
      throw new Error('Bar not found');
    }

    const startValue = bar.currentValue;
    const barId = bar._id || bar.id;

    await randomDelay(ANIMATION_DELAY_MAX);

    await animate(
      (progress) => {
        const newValue = Math.round(startValue + amount * progress);
        setBars((prevBars) => {
          const updated = [...prevBars];
          updated[barIndex] = { ...updated[barIndex], currentValue: newValue };
          return updated;
        });
      },
      ANIMATION_DURATION
    );

    try {
      await addDonation(barId, amount);
      await loadBars();
    } catch (err) {
      console.error('Failed to save donation to backend:', err);
      setBars((prevBars) => {
        const updated = [...prevBars];
        updated[barIndex] = { ...updated[barIndex], currentValue: startValue };
        return updated;
      });
      throw err;
    }
  }, [bars, loadBars]);

  return {
    bars,
    loading,
    error,
    addDonationToBar,
    reloadBars: loadBars,
  };
}

