const Article = require('../models/Article');

// GET /api/articles — public, published only, with filters
exports.getArticles = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { status: 'published' };

    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [articles, total] = await Promise.all([
      Article.find(query)
        .populate('category', 'name')
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Article.countDocuments(query),
    ]);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/articles/:id — public, single article + increment viewCount
exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    )
      .populate('category', 'name')
      .populate('author', 'username');

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/articles — protected, create article
exports.createArticle = async (req, res) => {
  try {
    const { title, content, summary, category, tags, status } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const article = await Article.create({
      title,
      content,
      summary,
      category,
      author: req.user.id,
      tags,
      status: status || 'draft',
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/articles/:id — protected, update article
exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(article);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/articles/:id — protected, delete article
exports.deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json({ message: 'Article deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/articles — protected, ALL articles including drafts
exports.getAdminArticles = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [articles, total] = await Promise.all([
      Article.find()
        .populate('category', 'name')
        .populate('author', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Article.countDocuments(),
    ]);

    res.json({
      articles,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
