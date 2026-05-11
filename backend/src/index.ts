import express from 'express';
import cors from 'cors';
import connectDB from './db';
import authRoutes from './routes/auth';
import dataRoutes from './routes/data';

const app = express();

// Connect to Database
connectDB();

// Init Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.get('/', (req, res) => res.send('API Running'));
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
