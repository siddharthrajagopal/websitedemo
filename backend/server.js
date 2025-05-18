const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('../')); // Serve the main website files

// Analytics data storage
const ANALYTICS_FILE = path.join(__dirname, 'analytics.json');

// Initialize analytics file if it doesn't exist
if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify({
        totalVisits: 0,
        lastVisit: null,
        visitHistory: [],
        pageViews: {}
    }));
}

// Track visit endpoint
app.post('/api/track-visit', (req, res) => {
    try {
        const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE));
        const { page, referrer } = req.body;
        const now = new Date();

        // Update total visits
        analytics.totalVisits++;
        
        // Update last visit
        analytics.lastVisit = now.toISOString();
        
        // Add to visit history
        analytics.visitHistory.push({
            timestamp: now.toISOString(),
            page: page,
            referrer: referrer || 'direct',
            userAgent: req.headers['user-agent'],
            ip: req.ip
        });
        
        // Keep only last 1000 visits
        if (analytics.visitHistory.length > 1000) {
            analytics.visitHistory = analytics.visitHistory.slice(-1000);
        }
        
        // Update page views
        analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
        
        // Save to file
        fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(analytics, null, 2));
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error tracking visit:', error);
        res.status(500).json({ error: 'Failed to track visit' });
    }
});

// Get analytics endpoint
app.get('/api/analytics', (req, res) => {
    try {
        const adminKey = req.headers['x-admin-key'];
        if (adminKey !== 'Sujay&Sidd') {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const analytics = JSON.parse(fs.readFileSync(ANALYTICS_FILE));
        res.json(analytics);
    } catch (error) {
        console.error('Error getting analytics:', error);
        res.status(500).json({ error: 'Failed to get analytics' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 