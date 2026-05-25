const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const videoRoutes = require('./routes/videoRoutes');
const configRoutes = require('./routes/configRoutes');
const Video = require('./models/Video');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // For local dev flexibility, accept all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/config', configRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Leappbee API is running' });
});

// Seed data function if DB is empty
const seedVideos = async () => {
  try {
    const count = await Video.countDocuments();
    if (count === 0) {
      console.log('Seeding initial portfolio videos...');
      const seedData = [
        {
          title: "Ultimate 24-Hour Cyber Truck Challenge",
          type: "long-form",
          category: "Vlogs",
          url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
          order: 0
        },
        {
          title: "What if ShowSpeed Became The Flash?",
          type: "long-form",
          category: "Explainers",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          order: 1
        },
        {
          title: "How To Start Day Trading As A Beginner in 2026",
          type: "long-form",
          category: "Podcasts",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          order: 2
        },
        {
          title: "Leappbee Creative Studio Promo Video",
          type: "long-form",
          category: "Ads",
          url: "https://drive.google.com/file/d/1_d2b1c4e7f8g9h0i1j2k3l4m5n6o7p8q/view",
          order: 3
        },
        {
          title: "High Retention Talking Head Showcase",
          type: "short-form",
          category: "TikTok/Reels",
          url: "https://youtube.com/shorts/dQw4w9WgXcQ",
          order: 0
        },
        {
          title: "SaaS Motion Graphics Showcase",
          type: "short-form",
          category: "Motion Graphics",
          url: "https://drive.google.com/file/d/1_d2b1c4e7f8g9h0i1j2k3l4m5n6o7p8q/view",
          order: 1
        },
        {
          title: "Fast Paced Gaming Stream Highlight",
          type: "short-form",
          category: "Gaming Clips",
          url: "https://youtube.com/shorts/dQw4w9WgXcQ",
          order: 2
        }
      ];
      await Video.insertMany(seedData);
      console.log('Seeding complete.');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
};

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/leappbee';
console.log('Connecting to MongoDB...');

mongoose.connect(mongoUri)
  .then(async () => {
    console.log('Successfully connected to MongoDB.');
    await seedVideos();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Make sure MongoDB service is running on your local machine.');
    // Start server anyway so that API is available, even if DB is offline
    app.listen(PORT, () => {
      console.log(`Server running in fallback mode on port ${PORT} (DB Offline)`);
    });
  });
