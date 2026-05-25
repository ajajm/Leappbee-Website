const express = require('express');
const router  = express.Router();
const Video   = require('../models/Video');
const auth    = require('../middleware/auth');

const mongoose = require('mongoose');

// In-memory fallback if DB is offline
let memoryVideos = [
  { _id: '1', title: "Ultimate 24-Hour Cyber Truck Challenge", type: "long-form", category: "Vlogs", url: "https://www.youtube.com/watch?v=9bZkp7q19f0", order: 0, createdAt: Date.now() },
  { _id: '2', title: "What if ShowSpeed Became The Flash?", type: "long-form", category: "Explainers", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 1, createdAt: Date.now() },
  { _id: '3', title: "How To Start Day Trading As A Beginner in 2026", type: "long-form", category: "Podcasts", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", order: 2, createdAt: Date.now() },
  { _id: '4', title: "Leappbee Creative Studio Promo Video", type: "long-form", category: "Ads", url: "https://drive.google.com/file/d/1_d2b1c4e7f8g9h0i1j2k3l4m5n6o7p8q/view", order: 3, createdAt: Date.now() },
  { _id: '5', title: "High Retention Talking Head Showcase", type: "short-form", category: "TikTok/Reels", url: "https://youtube.com/shorts/dQw4w9WgXcQ", order: 0, createdAt: Date.now() },
  { _id: '6', title: "SaaS Motion Graphics Showcase", type: "short-form", category: "Motion Graphics", url: "https://drive.google.com/file/d/1_d2b1c4e7f8g9h0i1j2k3l4m5n6o7p8q/view", order: 1, createdAt: Date.now() },
  { _id: '7', title: "Fast Paced Gaming Stream Highlight", type: "short-form", category: "Gaming Clips", url: "https://youtube.com/shorts/dQw4w9WgXcQ", order: 2, createdAt: Date.now() }
];

const isDbConnected = () => mongoose.connection.readyState === 1;

/* ─── PUBLIC ───────────────────────────────────────────────── */

// GET all videos sorted by order
router.get('/', async (req, res) => {
  if (!isDbConnected()) {
    return res.json([...memoryVideos].sort((a,b) => a.order - b.order || b.createdAt - a.createdAt));
  }
  try {
    const videos = await Video.find().sort({ order: 1, createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ─── ADMIN ────────────────────────────────────────────────── */

// POST — add a video
router.post('/', auth, async (req, res) => {
  const { title, type, category, url, order } = req.body;
  if (!title || !type || !category || !url) {
    return res.status(400).json({ message: 'Title, type, category and url are required.' });
  }
  
  if (!isDbConnected()) {
    let finalOrder = order;
    if (finalOrder === undefined) {
      const last = memoryVideos.length ? Math.max(...memoryVideos.map(v => v.order)) : -1;
      finalOrder = last + 1;
    }
    const newVideo = { _id: Date.now().toString(), title, type, category, url, order: finalOrder, createdAt: Date.now() };
    memoryVideos.push(newVideo);
    return res.status(201).json(newVideo);
  }

  try {
    let finalOrder = order;
    if (finalOrder === undefined) {
      const last = await Video.findOne().sort({ order: -1 });
      finalOrder = last ? last.order + 1 : 0;
    }
    const video = await new Video({ title, type, category, url, order: finalOrder }).save();
    res.status(201).json(video);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /bulk/reorder  ← MUST be BEFORE /:id
router.put('/bulk/reorder', auth, async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ message: 'Expected an array of video IDs.' });
  }

  if (!isDbConnected()) {
    ids.forEach((id, index) => {
      const v = memoryVideos.find(vid => vid._id === id);
      if (v) v.order = index;
    });
    return res.json({ message: 'Order updated in memory.' });
  }

  try {
    const ops = ids.map((id, index) => ({
      updateOne: { filter: { _id: id }, update: { $set: { order: index } } }
    }));
    await Video.bulkWrite(ops);
    res.json({ message: 'Order updated.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /:id — update a video
router.put('/:id', auth, async (req, res) => {
  if (!isDbConnected()) {
    const v = memoryVideos.find(vid => vid._id === req.params.id);
    if (!v) return res.status(404).json({ message: 'Video not found.' });
    ['title', 'type', 'category', 'url', 'order'].forEach(f => {
      if (req.body[f] !== undefined) v[f] = req.body[f];
    });
    return res.json(v);
  }

  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found.' });
    ['title', 'type', 'category', 'url', 'order'].forEach(f => {
      if (req.body[f] !== undefined) video[f] = req.body[f];
    });
    res.json(await video.save());
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /:id
router.delete('/:id', auth, async (req, res) => {
  if (!isDbConnected()) {
    const idx = memoryVideos.findIndex(vid => vid._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Video not found.' });
    memoryVideos.splice(idx, 1);
    return res.json({ message: 'Video deleted from memory.' });
  }

  try {
    const result = await Video.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Video not found.' });
    res.json({ message: 'Video deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
