import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Ambil JWT Secret dari environment variable
// Pastikan Anda telah mengatur JWT_SECRET di file .env atau docker-compose.yml
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Mendaftarkan user baru
 * @access  Public
 */
router.post(
  '/register',
  [
    // Validasi input
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    // Periksa kesalahan validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // 1. Cek apakah user sudah ada
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // 2. Buat user baru (model User menggunakan tipe data yang sesuai)
      user = new User({
        username,
        password, // Akan di-hash sebelum disimpan oleh middleware Mongoose (jika ada)
      });

      // 3. Hash password (jika tidak ada pre-save hook di model User)
      // Jika Anda memiliki pre-save hook di model User, baris ini bisa dihilangkan.
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // 4. Simpan user
      await user.save();

      // 5. Buat dan kirim JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '5h' }, // Token kadaluarsa dalam 5 jam
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user & mendapatkan token
 * @access  Public
 */
router.post(
  '/login',
  [
    // Validasi input
    check('username', 'Username is required').exists(),
    check('password', 'Password is required').exists(),
  ],
  async (req: Request, res: Response) => {
    // Periksa kesalahan validasi
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      // 1. Cek user
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // 2. Bandingkan password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      // 3. Buat dan kirim JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: '5h' }, // Token kadaluarsa dalam 5 jam
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

export default router;