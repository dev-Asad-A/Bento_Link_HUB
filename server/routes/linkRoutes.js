const express = require('express');
const router = express.Router();
const Link = require('../models/Link');
const authMiddleware = require('../middleware/authMiddleware');

// GET /api/links - Return all link documents, HTTP 200
router.get('/', async (req, res) => {
  try {
    const links = await Link.find().sort({ createdAt: -1 });
    res.status(200).json(links);
  } catch (err) {
    console.error('GET links error:', err.message);
    res.status(500).json({ message: 'Server error retrieving links' });
  }
});

// POST /api/links - Validate and create a new link record. Protected.
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, url, gridSpanX, gridSpanY } = req.body;

    // Schema validations will catch bad data, but we do basic presence checks
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }

    const newLink = new Link({
      title,
      url,
      gridSpanX: gridSpanX ? parseInt(gridSpanX) : 1,
      gridSpanY: gridSpanY ? parseInt(gridSpanY) : 1
    });

    const savedLink = await newLink.save();
    res.status(201).json(savedLink);
  } catch (err) {
    console.error('POST link error:', err.message);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error creating link' });
  }
});

// PATCH /api/links/click/:id - Find by ID, atomically increment clickCount by 1 via $inc, return updated doc.
router.patch('/click/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Invalid Link ID format' });
    }

    const updatedLink = await Link.findByIdAndUpdate(
      id,
      { $inc: { clickCount: 1 } },
      { new: true, runValidators: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.status(200).json(updatedLink);
  } catch (err) {
    console.error('PATCH click error:', err.message);
    res.status(500).json({ message: 'Server error updating click count' });
  }
});

// DELETE /api/links/:id - Delete a link. Protected.
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(404).json({ message: 'Invalid Link ID format' });
    }

    const deletedLink = await Link.findByIdAndDelete(id);

    if (!deletedLink) {
      return res.status(404).json({ message: 'Link not found' });
    }

    res.status(200).json({ message: 'Link deleted successfully', id });
  } catch (err) {
    console.error('DELETE link error:', err.message);
    res.status(500).json({ message: 'Server error deleting link' });
  }
});

module.exports = router;
