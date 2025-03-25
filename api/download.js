// api/download.js
const fetch = require('node-fetch');

async function handler(req, res) {
  // Get URL from query parameters
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'Please provide a TeraBox URL' });
  }

  const apiUrl = 'https://terabox-downloader-tool.p.rapidapi.com/api';
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c7e2fc48e0msh077ba9d1e502feep11ddcbjsn4653c738de70', // Replace with your RapidAPI key
      'x-rapidapi-host': 'terabox-downloader-tool.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(`${apiUrl}?url=${encodeURIComponent(url)}`, options);
    const result = await response.json();
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

module.exports = handler;
