import React from 'react';
import axios from 'axios';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Instagram, 
  ExternalLink, 
  Globe, 
  Mail, 
  BookOpen, 
  Cpu, 
  Sparkles,
  Link2
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getIcon = (url, title) => {
  const urlLower = url.toLowerCase();
  const titleLower = title.toLowerCase();

  if (urlLower.includes('github')) return <Github className="card-icon" />;
  if (urlLower.includes('twitter') || urlLower.includes('x.com')) return <Twitter className="card-icon" />;
  if (urlLower.includes('linkedin')) return <Linkedin className="card-icon" />;
  if (urlLower.includes('youtube')) return <Youtube className="card-icon" />;
  if (urlLower.includes('instagram')) return <Instagram className="card-icon" />;
  if (urlLower.includes('mail') || urlLower.includes('mailto')) return <Mail className="card-icon" />;
  if (titleLower.includes('portfolio') || urlLower.includes('portfolio')) return <Globe className="card-icon" />;
  if (titleLower.includes('blog') || titleLower.includes('read') || urlLower.includes('blog')) return <BookOpen className="card-icon" />;
  if (titleLower.includes('project') || titleLower.includes('app') || titleLower.includes('dev')) return <Cpu className="card-icon" />;
  if (titleLower.includes('design') || titleLower.includes('art') || titleLower.includes('creative')) return <Sparkles className="card-icon" />;
  
  return <Link2 className="card-icon" />;
};

const BentoCard = ({ item }) => {
  const handleClick = (e) => {
    // 1. Fire background PATCH request to update count (silent, no await)
    axios.patch(`${API_URL}/links/click/${item._id}`)
      .catch((err) => console.error('Silent click tracking failed:', err));

    // 2. Open link in a new browser tab immediately (no blocking)
    // Make sure URL contains protocol
    let targetUrl = item.url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="bento-card interactive"
      onClick={handleClick}
      style={{
        gridColumn: `span ${item.gridSpanX || 1}`,
        gridRow: `span ${item.gridSpanY || 1}`
      }}
    >
      <div className="card-glow"></div>
      <div className="card-content">
        <div className="card-header">
          {getIcon(item.url, item.title)}
          <ExternalLink className="card-arrow" size={16} />
        </div>
        <div className="card-body">
          <h3 className="card-title">{item.title}</h3>
          <p className="card-url">{item.url.replace(/https?:\/\/(www\.)?/, '')}</p>
        </div>
        {item.clickCount !== undefined && (
          <div className="card-footer">
            <span className="click-counter">{item.clickCount} clicks</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BentoCard;
