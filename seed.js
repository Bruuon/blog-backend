const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Category = require('./models/Category');
const Article = require('./models/Article');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Article.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    // Create admin user
    const hashedPassword = await bcryptjs.hash('admin123', 10);
    const admin = await User.create({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
    });
    console.log('Created admin user (admin / admin123)');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Technology', description: 'Tech news, tutorials, and insights' },
      { name: 'Design', description: 'UI/UX design and visual creativity' },
      { name: 'Life', description: 'Personal stories and lifestyle articles' },
    ]);
    console.log(`Created ${categories.length} categories`);

    // Create sample articles
    const articles = await Article.insertMany([
      {
        title: 'Getting Started with Vue 3',
        content: `# Getting Started with Vue 3\n\nVue 3 is the latest version of the progressive JavaScript framework.\n\n## Why Vue 3?\n\n- **Composition API** for better code organization\n- **Smaller bundle size** with tree-shaking\n- **TypeScript support** out of the box\n\n## Quick Start\n\n\`\`\`bash\nnpm create vue@latest\n\`\`\`\n\nStart building your next project with Vue 3 today!`,
        summary: 'An introduction to Vue 3 and why you should consider it for your next project.',
        category: categories[0]._id,
        author: admin._id,
        status: 'published',
        tags: ['vue', 'javascript', 'frontend'],
      },
      {
        title: 'Mastering CSS Grid Layout',
        content: `# Mastering CSS Grid Layout\n\nCSS Grid is a powerful layout system that changed how we build web layouts.\n\n## Basic Grid\n\n\`\`\`css\n.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 1rem;\n}\n\`\`\`\n\n## Grid Areas\n\nDefine named areas for complex responsive layouts with ease.`,
        summary: 'Learn how to use CSS Grid to create modern, responsive layouts.',
        category: categories[1]._id,
        author: admin._id,
        status: 'published',
        tags: ['css', 'design', 'layout'],
      },
      {
        title: 'Why I Switched to Tailwind CSS',
        content: `# Why I Switched to Tailwind CSS\n\nAfter years of writing custom CSS, I finally gave Tailwind CSS a try.\n\n## The Good Parts\n\n- **Utility-first** approach speeds up development\n- **Consistent design system** out of the box\n- **No naming things** — no more BEM headaches\n\n## The Learning Curve\n\nIt looks ugly at first, but trust the process. Once you memorize the classes, you'll build UIs faster than ever.`,
        summary: 'My journey from traditional CSS to Tailwind CSS and why I am never going back.',
        category: categories[1]._id,
        author: admin._id,
        status: 'published',
        tags: ['tailwind', 'css', 'frontend'],
      },
      {
        title: 'Node.js Best Practices in 2026',
        content: `# Node.js Best Practices in 2026\n\nNode.js continues to evolve. Here are the practices I follow in production.\n\n## Project Structure\n\n- Separate concerns: routes, controllers, models\n- Use middleware for cross-cutting concerns\n- Keep your server.js thin\n\n## Error Handling\n\nAlways wrap async operations in try/catch. Return proper HTTP status codes.\n\n## Security\n\n- Hash passwords with bcryptjs\n- Use JWT for authentication\n- Validate input on every endpoint`,
        summary: 'Production-tested Node.js patterns and practices for 2026.',
        category: categories[0]._id,
        author: admin._id,
        status: 'published',
        tags: ['nodejs', 'backend', 'best-practices'],
      },
      {
        title: 'Building a REST API with Express',
        content: `# Building a REST API with Express\n\nExpress remains the most popular Node.js framework. Here's how to build a clean API.\n\n## Getting Started\n\n\`\`\`bash\nnpm init -y\nnpm install express mongoose dotenv\n\`\`\`\n\n## Structuring Routes\n\nUse Express Router to organize endpoints by resource. Each resource gets its own route file.\n\n## Middleware\n\nJWT auth middleware protects private routes. Just import and use it on any route that needs authentication.`,
        summary: 'A step-by-step guide to building RESTful APIs with Express and MongoDB.',
        category: categories[0]._id,
        author: admin._id,
        status: 'published',
        tags: ['express', 'api', 'backend'],
      },
    ]);
    console.log(`Created ${articles.length} articles`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
