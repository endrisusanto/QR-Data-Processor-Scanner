import express from 'express';
import auth, { AuthRequest } from '../middleware/auth';
import ItemData from '../models/ItemData';

const router = express.Router();

// @route   GET api/data
// @desc    Get user's data
// @access  Private
router.get('/', auth, async (req: AuthRequest, res) => {
  try {
    const data = await ItemData.findOne({ userId: req.user!.id });
    if (!data) {
      return res.json({ items: [], dataInput: '' });
    }
    res.json(data);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/data
// @desc    Create or update user's data
// @access  Private
router.post('/', auth, async (req: AuthRequest, res) => {
  // FIX: Cast `req` to `any` to access the `body` property, which is added by middleware but may not be present in the base type definition.
  const { items, dataInput } = (req as any).body;
  const userId = req.user!.id;

  try {
    let data = await ItemData.findOne({ userId });

    if (data) {
      // Update
      data.items = items;
      data.dataInput = dataInput;
      await data.save();
      return res.json(data);
    }

    // Create
    const newData = new ItemData({
      userId,
      items,
      dataInput,
    });

    await newData.save();
    res.json(newData);
  } catch (err: any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;