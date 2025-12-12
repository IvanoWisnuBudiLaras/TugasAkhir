const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3005;

// Enable CORS
app.use(cors());

// Static file serving untuk uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'apps/backend/uploads'), {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    // Set CORS headers untuk images
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    // Set cache headers untuk images
    if (filePath.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
      
      // Set content type berdasarkan extension
      const ext = filePath.split('.').pop()?.toLowerCase();
      switch (ext) {
        case 'jpg':
        case 'jpeg':
          res.setHeader('Content-Type', 'image/jpeg');
          break;
        case 'png':
          res.setHeader('Content-Type', 'image/png');
          break;
        case 'gif':
          res.setHeader('Content-Type', 'image/gif');
          break;
        case 'webp':
          res.setHeader('Content-Type', 'image/webp');
          break;
        case 'svg':
          res.setHeader('Content-Type', 'image/svg+xml');
          break;
      }
    }
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Static file server is running' });
});

// List uploads directory structure
app.get('/uploads/list', (req, res) => {
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, 'apps/backend/uploads');
  
  function getDirectoryStructure(dir, basePath = '') {
    const items = [];
    const entries = fs.readdirSync(dir);
    
    entries.forEach(entry => {
      const fullPath = path.join(dir, entry);
      const relativePath = path.join(basePath, entry);
      const stats = fs.statSync(fullPath);
      
      if (stats.isDirectory()) {
        items.push({
          name: entry,
          type: 'directory',
          path: relativePath,
          children: getDirectoryStructure(fullPath, relativePath)
        });
      } else {
        items.push({
          name: entry,
          type: 'file',
          path: relativePath,
          size: stats.size,
          url: `http://localhost:${PORT}/uploads/${relativePath.replace(/\\/g, '/')}`
        });
      }
    });
    
    return items;
  }
  
  try {
    const structure = getDirectoryStructure(uploadsDir);
    res.json({
      baseUrl: `http://localhost:${PORT}/uploads`,
      structure: structure
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to read directory structure' });
  }
});

app.listen(PORT, () => {
  console.log(`Static file server running on http://localhost:${PORT}`);
  console.log(`Uploads directory: ${path.join(__dirname, 'apps/backend/uploads')}`);
  console.log(`Test URL: http://localhost:${PORT}/uploads/list`);
});