/**
 * ╔══════════════════════════════════════════════════════════╗
 * ║  LEAPPBEE — Site Configuration                          ║
 * ║  Edit this file to update all website content           ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * After editing, save the file — changes appear instantly
 * in the browser (hot reload is active in dev mode).
 */

const SITE_CONFIG = {

  /* ── Brand ──────────────────────────────────────────────── */
  brand: {
    name:     'LeappBee',           // Your agency name
    tagline:  'Elite Video Production',
    emoji:    '🐝',                 // Shows in navbar & footer
  },

  /* ── Hero Section ───────────────────────────────────────── */
  hero: {
    eyebrow:  'LeappBee — Elite Video Production',
    title:    'A team of experts\nfor every creator.',
    subtitle: 'We handle the production,\nyou own the influence.',
    cta_primary:   { label: 'Get started', href: 'https://cal.com/leappbee/leappbee-discovery-call?overlayCalendar=true' },
    cta_secondary: { label: 'See our work →', href: '#work' },
  },

  /* ── Process Section ────────────────────────────────────── */
  process: {
    label:    'Behind the scenes',
    heading:  'How We Work',
    subtext:  'High retention video designed to scale your brand.',
    steps: [
      {
        num:   '01',
        title: 'Strategy-First',
        desc:  'We audit your channel and engineer data-backed hooks to maximize watch time.',
      },
      {
        num:   '02',
        title: 'Your Elite Squad',
        desc:  'Get a dedicated lead editor, motion designer, and strategist specialized in your niche.',
      },
      {
        num:   '03',
        title: 'Seamless Delivery',
        desc:  'Approve drafts with one click and receive polished videos within your guaranteed window.',
      },
    ],
    trust_items: [
      'Experienced editors trained on retention',
      'Long & short form expertise',
      'Direct Slack communication channel',
      '24 – 72 hour first draft delivery',
    ],
  },

  /* ── Stats Section ──────────────────────────────────────── */
  stats: {
    heading: 'Numbers That Speak',   // "Speak" renders in italic
    items: [
      { number: '100M+', label: 'Total views generated'    },
      { number: '500+',  label: 'Videos delivered'         },
      { number: '300%',  label: 'Average organic growth'   },
      { number: '99%',   label: 'Client satisfaction rate' },
    ],
  },

  /* ── Testimonials ───────────────────────────────────────── */
  testimonials: {
    heading: 'Loved by builders.',
    // Add/remove cards in row1 and row2 freely
    row1: [
      {
        name:   'American CE',
        handle: '@americance',
        quote:  'A complete game-changer for our content pipeline. Retention exploded after week one. Fast communication, faster delivery.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
      },
      {
        name:   'John Holloway',
        handle: '@johnholloway',
        quote:  'Great for orchestrating video assets across formats. Pacing, graphics, SFX — everything dialled in to match our brand.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
      },
      {
        name:   'Diogo D',
        handle: '@diogothereal',
        quote:  'Been working with LeappBee for 6 months. They script, edit and upload everything. Retention charts look like a hockey stick.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&q=80',
      },
      {
        name:   'Free Choir',
        handle: '@freechoir',
        quote:  'The rise of organic traffic on our SaaS is direct proof. Their motion graphics and explainer cuts are absolute top tier.',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80',
      },
    ],
    row2: [
      {
        name:   'Logan S',
        handle: '@logansaether',
        quote:  'When I needed an editing crew for launch day, LeappBee saved the campaign. Highly recommended for any serious creator.',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&q=80',
      },
      {
        name:   'John',
        handle: '@john_creates',
        quote:  'Framing, SFX, colour-grading — they make simple talking heads look like high-budget productions. Retention up 45%.',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=80&q=80',
      },
      {
        name:   'Alexander',
        handle: '@alexanderr',
        quote:  'Incredibly reliable. First draft always lands in under 48 hours and revisions are painless. Worth every single penny.',
        avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=80&q=80',
      },
      {
        name:   'Yash S',
        handle: '@yashms1',
        quote:  'They understand YouTube hooks and watch-time optimisation at a deep level. Our CTR is up 70% in just 2 months.',
        avatar: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80',
      },
    ],
  },

  /* ── Contact / Let's Work Together ─────────────────────── */
  contact: {
    label:   'Get in touch',
    heading: "Let's Work Together",
    subtext: 'Choose your channel — we respond within the hour.',

    discord: {
      name:    'Chat on Discord',
      desc:    'Real-time responses for quick questions and instant quotes.',
      url:     'https://discord.gg/z3Yf2DbyCM',
    },
    whatsapp: {
      name:    'WhatsApp Us',
      desc:    'Direct chat for quick questions and project updates.',
      url:     'https://wa.me/9128000075',
    },

    // Cal.com booking — update with your actual Cal.com username/event
    calcom_link: 'leappbee/discovery-call',           // ← Update this
  },

  /* ── FAQ ─────────────────────────────────────────────────── */
  faq: {
    heading: 'Frequently asked questions.',
    items: [
      {
        q: 'How is LeappBee different from hiring a full-time editor?',
        a: 'LeappBee gives you instant access to a full post-production team — editors, strategists, motion designers — without the overhead of salaries or onboarding time.',
      },
      {
        q: 'Can I keep using my existing project tools?',
        a: 'Absolutely. We slot into your existing workflow. Whether you use Notion, Slack, or ClickUp, our team adapts to your system within the first week.',
      },
      {
        q: 'What happens when a project hits its revision limit?',
        a: 'We build revision rounds into every project upfront. Further revisions are quoted and approved before any additional work begins — no surprises.',
      },
      {
        q: 'How do I track what is in production?',
        a: 'You get a live dashboard showing every asset, its status, and the responsible editor. No chasing, no surprises.',
      },
      {
        q: 'Do you work continuously or in batches?',
        a: 'Both. Rolling weekly batches or sprint-style runs around launches — whatever suits your calendar and release cadence.',
      },
      {
        q: 'Why LeappBee instead of a freelancer marketplace?',
        a: 'Consistency. A marketplace gives you a random editor per project. LeappBee gives you a dedicated team that learns your brand, voice, and audience over time.',
      },
      {
        q: 'What does a typical retainer look like?',
        a: 'Most clients start on a monthly plan covering 8–20 long-form or 30–60 short-form videos, with unlimited minor revisions included.',
      },
      {
        q: 'Do you accept one-off projects?',
        a: 'Yes. We take one-off launches, trailer cuts, and ad campaigns alongside retainer clients. Availability may vary — book a call to confirm.',
      },
    ],
  },

  /* ── Footer ──────────────────────────────────────────────── */
  footer: {
    description: "Founded by our creative team, LeappBee brings together a dedicated team of elite editors who transform raw content into viral moments.",
    copyright:   `© ${new Date().getFullYear()} LeappBee. All rights reserved.`,
    made_with:   "Made with passion for creators",
    columns: [
      {
        title: 'Quick Links',
        links: [
          { label: 'Our Work', href: '#work' },
          { label: 'Process',  href: '#process' },
          { label: 'Contact',  href: '#contact' },
        ],
      },
      {
        title: 'Services',
        links: [
          { label: 'Long-Form Editing', href: '#work' },
          { label: 'Short-Form Clips',  href: '#work' },
          { label: 'Motion Graphics',   href: '#work' },
          { label: 'Thumbnails',        href: '#work' },
          { label: 'Social Media Management', href: '#work' },
          { label: 'SEO',               href: '#work' },
        ],
      },
      {
        title: 'Connect',
        links: [
          { label: 'Discord Server', href: 'https://discord.gg/z3Yf2DbyCM' },
          { label: 'Book a Call',    href: 'https://cal.com/leappbee/leappbee-discovery-call?overlayCalendar=true' },
          { label: 'Email Us',       href: 'mailto:projectdesk.agency@gmail.com' },
        ],
      },
    ],
  },

  /* ── Portfolio Videos ───────────────────────────────────── */
  videos: [
    {
      _id: '1',
      title: "Ultimate 24-Hour Cyber Truck Challenge",
      type: "long-form",
      category: "Vlogs",
      url: "https://www.youtube.com/watch?v=9bZkp7q19f0",
      order: 0
    },
    {
      _id: '2',
      title: "What if ShowSpeed Became The Flash?",
      type: "long-form",
      category: "Explainers",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order: 1
    },
    {
      _id: '3',
      title: "How To Start Day Trading As A Beginner in 2026",
      type: "long-form",
      category: "Podcasts",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      order: 2
    },
    {
      _id: '4',
      title: "Leappbee Creative Studio Promo Video",
      type: "long-form",
      category: "Ads",
      url: "https://drive.google.com/file/d/1_d2b1c4e7f8g9h0i1j2k3l4m5n6o7p8q/view",
      order: 3
    },
    {
      _id: '5',
      title: "High Retention Talking Head Showcase",
      type: "short-form",
      category: "TikTok/Reels",
      url: "https://youtube.com/shorts/dQw4w9WgXcQ",
      order: 0
    },
    {
      _id: '6',
      title: "SaaS Motion Graphics Showcase",
      type: "short-form",
      category: "Motion Graphics",
      url: "https://drive.google.com/file/d/1_d2b1c4e7f8g9h0i1j2k3l4m5n6o7p8q/view",
      order: 1
    },
    {
      _id: '7',
      title: "Fast Paced Gaming Stream Highlight",
      type: "short-form",
      category: "Gaming Clips",
      url: "https://youtube.com/shorts/dQw4w9WgXcQ",
      order: 2
    }
  ],

  /* ── Admin credentials reminder ─────────────────────────── */
  // IMPORTANT: Set these in backend/.env — NOT here
  // ADMIN_USERNAME=admin
  // ADMIN_PASSWORD=admin123
};

export default SITE_CONFIG;
