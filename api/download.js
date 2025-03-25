// File: api/tiktok.js
const axios = require('axios');

const handler = async (req, res) => {
  try {
    // Get TikTok URL from query parameter
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Please provide a TikTok URL' });
    }

    // Configure headers
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Origin': 'https://www.tikwm.com',
      'Referer': 'https://www.tikwm.com/'
    };

    // API endpoint
    const apiUrl = 'https://www.tikwm.com/api/';
    
    // Request parameters
    const params = {
      url: url,
      count: 12,
      cursor: 0,
      hd: 1 // 1 for HD quality, 0 for standard
    };

    // Make request to tikwm API
    const response = await axios.post(apiUrl, new URLSearchParams(params), { headers });
    
    // Check if request was successful
    if (response.data.code !== 0) {
      return res.status(400).json({ error: response.data.msg });
    }

    // Extract relevant data
    const data = response.data.data;
    
    // Prepare response
    const result = {
      video: {
        url: data.play,        // Video download URL
        hd_url: data.hdplay,   // HD video URL
        size: data.size,       // Video size in bytes
        duration: data.duration
      },
      audio: {
        url: data.music,       // Audio download URL
        title: data.music_info?.title,
        author: data.music_info?.author
      },
      metadata: {
        id: data.id,
        title: data.title,
        author: data.author,
        likes: data.digg_count,
        comments: data.comment_count,
        shares: data.share_count,
        plays: data.play_count
      }
    };

    // Send response
    res.status(200).json(result);

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});

// Add to handler
app.use(limiter);

// Add download functionality
const downloadFile = async (fileUrl, type) => {
  const response = await axios({
    url: fileUrl,
    method: 'GET',
    responseType: 'stream',
    headers
  });
  
  return {
    stream: response.data,
    mime: type === 'video' ? 'video/mp4' : 'audio/mp3'
  };
};

// Usage in handler
if (req.query.download === 'video') {
  const { stream, mime } = await downloadFile(result.video.hd_url, 'video');
  res.setHeader('Content-Disposition', 'attachment; filename="tiktok-video.mp4"');
  res.setHeader('Content-Type', mime);
  stream.pipe(res);
}

export default handler;
