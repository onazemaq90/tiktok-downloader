const axios = require('axios');

module.exports = async (req, res) => {
  // Extract TikTok URL from query parameter
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a TikTok URL' });
  }

  try {
    // Configure the request to tikwm.com API
    const response = await axios.post(
      'https://www.tikwm.com/api/',
      { url }, // TikTok URL as the payload
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Example response structure from tikwm.com
    const data = response.data;
    if (data.code !== 0) {
      return res.status(400).json({ error: 'Invalid TikTok URL or API error' });
    }

    // Construct the response with video and audio links
    const result = {
      video: data.data.play, // Video download link
      audio: data.data.music, // Audio download link
      title: data.data.title,
      author: data.data.author.nickname,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
