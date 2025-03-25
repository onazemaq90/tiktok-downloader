const TikTokScraper = require('tiktok-scraper');
const axios = require('axios');

module.exports = async (req, res) => {
  try {
    // Get TikTok URL from query parameter
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Please provide a TikTok URL' });
    }

    // Normalize URL to handle both tiktok.com and www.tiktok.com
    let normalizedUrl = url;
    if (!url.startsWith('http')) {
      normalizedUrl = `https://www.tiktok.com/${url.startsWith('@') ? '' : 'video/'}${url}`;
    }

    // Custom headers as requested
    const headers = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };

    // Get video metadata
    const videoData = await TikTokScraper.getVideoMeta({
      url: normalizedUrl,
      headers: headers
    });

    // Download video
    const videoResponse = await axios({
      method: 'get',
      url: videoData.collector[0].videoUrl,
      responseType: 'stream',
      headers: headers
    });

    // Example Response structure
    const responseData = {
      status: 'success',
      video: {
        id: videoData.collector[0].id,
        url: videoData.collector[0].videoUrl,
        duration: videoData.collector[0].duration,
        format: 'mp4'
      },
      audio: {
        url: videoData.collector[0].playAddr, // Audio URL
        format: 'mp3'
      },
      metadata: {
        author: videoData.collector[0].authorMeta,
        description: videoData.collector[0].text,
        createdAt: videoData.collector[0].createTime
      }
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      error: 'Failed to download TikTok content',
      details: error.message 
    });
  }
};
