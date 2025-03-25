const fetch = require('node-fetch');

exports.handler = async (req, res) => {
    try {
        // Get TikTok URL from query parameter
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({
                error: 'Please provide a TikTok URL'
            });
        }

        // API endpoint from tikwm.com
        const apiUrl = 'https://www.tikwm.com/api/';
        
        // Custom headers as requested
        const headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://www.tikwm.com',
            'Referer': 'https://www.tikwm.com/'
        };

        // Request body
        const body = new URLSearchParams({
            url: url,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1 // For HD quality
        });

        // Make API request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: headers,
            body: body
        });

        const data = await response.json();

        if (data.code !== 0) {
            return res.status(400).json({
                error: data.msg || 'Failed to fetch TikTok content'
            });
        }

        // Example response structure
        const formattedResponse = {
            status: 'success',
            video: {
                url: data.data.play, // Video URL
                hd_url: data.data.hdplay, // HD Video URL
                duration: data.data.duration,
                size: data.data.size
            },
            audio: {
                url: data.data.music, // Audio URL
                title: data.data.music_info.title,
                author: data.data.music_info.author
            },
            metadata: {
                id: data.data.id,
                title: data.data.title,
                author: data.data.author,
                likes: data.data.digg_count,
                comments: data.data.comment_count,
                shares: data.data.share_count,
                plays: data.data.play_count
            }
        };

        res.status(200).json(formattedResponse);

    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
// Add error handling for invalid URLs
if (!url.includes('tiktok.com')) {
    return res.status(400).json({
        error: 'Please provide a valid TikTok URL'
    });
}

// Add download functionality
const downloadFile = async (fileUrl, type) => {
    const response = await fetch(fileUrl);
    const buffer = await response.buffer();
    res.setHeader('Content-Disposition', `attachment; filename="tiktok_${type}.mp4"`);
    res.send(buffer);
};

// Add to handler
if (req.query.download === 'true') {
    await downloadFile(data.data.hdplay, 'video');
    return;
}
