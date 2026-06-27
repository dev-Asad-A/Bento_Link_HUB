const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'Title cannot be empty'
    }
  },
  url: {
    type: String,
    required: [true, 'URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        // Robust URL validation regex supporting domains, IPs, and localhost (port numbers allowed)
        return /^(https?:\/\/)?(localhost|127\.0\.0\.1|([\w\-]+\.)+[\w\-]+)(:\d+)?(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/.test(v);
      },
      message: props => `${props.value} is not a valid URL!`
    }
  },
  gridSpanX: {
    type: Number,
    default: 1,
    min: [1, 'gridSpanX must be at least 1'],
    max: [4, 'gridSpanX cannot exceed 4']
  },
  gridSpanY: {
    type: Number,
    default: 1,
    min: [1, 'gridSpanY must be at least 1'],
    max: [4, 'gridSpanY cannot exceed 4']
  },
  clickCount: {
    type: Number,
    required: true,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Link', linkSchema);
