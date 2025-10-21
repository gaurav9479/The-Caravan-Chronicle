import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI not set in environment');
  process.exit(1);
}

mongoose.connect(mongoUri).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
  process.exit(1);
});

app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`API listening on :${port}`));
