const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const SiteConfig = require('../models/SiteConfig');
const auth = require('../middleware/auth');

// In-memory fallback config
let memoryConfig = {
  discordUrl: 'https://discord.gg/z3Yf2DbyCM',
  whatsappNumber: '9128000075',
  calcomLink: 'leappbee/leappbee-discovery-call',
  services: ['Long-Form Editing', 'Short-Form Clips', 'Motion Graphics', 'Thumbnails', 'Social Media Management', 'SEO'],
  testimonials: [
    { name: 'American CE', handle: '@americance', quote: 'A complete game-changer for our content pipeline. Retention exploded after week one. Fast communication, faster delivery.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80' },
    { name: 'John Holloway', handle: '@johnholloway', quote: 'Great for orchestrating video assets across formats. Pacing, graphics, SFX — everything dialled in to match our brand.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80' },
    { name: 'Diogo D', handle: '@diogothereal', quote: 'Been working with LeappBee for 6 months. They script, edit and upload everything. Retention charts look like a hockey stick.', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&q=80' },
    { name: 'Free Choir', handle: '@freechoir', quote: 'The rise of organic traffic on our SaaS is direct proof. Their motion graphics and explainer cuts are absolute top tier.', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80' }
  ],
  faqs: [
    {
      q: 'How is LeappBee different from hiring a full-time editor?',
      a: 'LeappBee gives you instant access to a full post-production team — editors, strategists, motion designers — without the overhead of salaries or onboarding time.'
    },
    {
      q: 'Can I keep using my existing project tools?',
      a: 'Absolutely. We slot into your existing workflow. Whether you use Notion, Slack, or ClickUp, our team adapts to your system within the first week.'
    },
    {
      q: 'What happens when a project hits its revision limit?',
      a: 'We build revision rounds into every project upfront. Further revisions are quoted and approved before any additional work begins — no surprises.'
    },
    {
      q: 'How do I track what is in production?',
      a: 'You get a live dashboard showing every asset, its status, and the responsible editor. No chasing, no surprises.'
    },
    {
      q: 'Do you work continuously or in batches?',
      a: 'Both. Rolling weekly batches or sprint-style runs around launches — whatever suits your calendar and release cadence.'
    },
    {
      q: 'Why LeappBee instead of a freelancer marketplace?',
      a: 'Consistency. A marketplace gives you a random editor per project. LeappBee gives you a dedicated team that learns your brand, voice, and audience over time.'
    },
    {
      q: 'What does a typical retainer look like?',
      a: 'Most clients start on a monthly plan covering 8–20 long-form or 30–60 short-form videos, with unlimited minor revisions included.'
    },
    {
      q: 'Do you accept one-off projects?',
      a: 'Yes. We take one-off launches, trailer cuts, and ad campaigns alongside retainer clients. Availability may vary — book a call to confirm.'
    }
  ]
};

// GET /api/config
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(memoryConfig);
    }
    let config = await SiteConfig.findOne();
    if (!config) {
      // Seed default config
      config = new SiteConfig(memoryConfig);
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/config
router.put('/', auth, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      memoryConfig = { ...memoryConfig, ...req.body };
      return res.json(memoryConfig);
    }
    
    let config = await SiteConfig.findOne();
    delete req.body._id; // prevent immutable _id update error
    if (!config) {
      config = new SiteConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    const updatedConfig = await config.save();
    res.json(updatedConfig);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
