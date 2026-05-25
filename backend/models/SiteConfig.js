const mongoose = require('mongoose');

const siteConfigSchema = new mongoose.Schema({
  discordUrl: { type: String, default: 'https://discord.gg/z3Yf2DbyCM' },
  whatsappNumber: { type: String, default: '9128000075' },
  calcomLink: { type: String, default: 'leappbee/leappbee-discovery-call' },
  services: { type: [String], default: ['Long-Form Editing', 'Short-Form Clips', 'Motion Graphics', 'Thumbnails', 'Social Media Management', 'SEO'] },
  testimonials: [{
    name: String,
    handle: String,
    quote: String,
    avatar: String
  }],
  faqs: {
    type: [{ q: String, a: String }],
    default: [
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
  }
});

module.exports = mongoose.model('SiteConfig', siteConfigSchema);
