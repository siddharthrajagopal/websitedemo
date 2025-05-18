// Analytics tracking
class Analytics {
    constructor() {
        this.serverUrl = 'http://localhost:3000'; // Change this to your server URL when deployed
        this.initializeVisit();
    }

    async initializeVisit() {
        try {
            const response = await fetch(`${this.serverUrl}/api/track-visit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    page: window.location.pathname,
                    referrer: document.referrer || 'direct'
                })
            });
            
            if (!response.ok) {
                console.error('Failed to track visit');
            }
        } catch (error) {
            console.error('Error tracking visit:', error);
        }
    }

    async getAnalytics() {
        try {
            const response = await fetch(`${this.serverUrl}/api/analytics`, {
                headers: {
                    'x-admin-key': 'Sujay&Sidd'
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch analytics');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error getting analytics:', error);
            return null;
        }
    }
}

// Initialize analytics
const analytics = new Analytics();

// Admin dashboard functionality
async function showAnalytics() {
    const adminKey = prompt('Enter admin key:');
    if (adminKey === 'Sujay&Sidd') {
        const analyticsData = await analytics.getAnalytics();
        if (!analyticsData) {
            alert('Failed to load analytics data');
            return;
        }

        const dashboard = document.createElement('div');
        dashboard.className = 'analytics-dashboard';
        dashboard.innerHTML = `
            <div class="analytics-container">
                <h2>Website Analytics</h2>
                <div class="analytics-stats">
                    <div class="stat-box">
                        <h3>Total Visits</h3>
                        <p>${analyticsData.totalVisits}</p>
                    </div>
                    <div class="stat-box">
                        <h3>Last Visit</h3>
                        <p>${new Date(analyticsData.lastVisit).toLocaleString()}</p>
                    </div>
                </div>
                <div class="page-views">
                    <h3>Page Views</h3>
                    <ul>
                        ${Object.entries(analyticsData.pageViews)
                            .map(([page, views]) => `<li>${page}: ${views} views</li>`)
                            .join('')}
                    </ul>
                </div>
                <div class="recent-visits">
                    <h3>Recent Visits</h3>
                    <ul>
                        ${analyticsData.visitHistory
                            .slice(-10)
                            .map(visit => `
                                <li>
                                    ${new Date(visit.timestamp).toLocaleString()} - 
                                    ${visit.page} 
                                    (from: ${visit.referrer})
                                    <br>
                                    <small>IP: ${visit.ip}</small>
                                </li>
                            `)
                            .join('')}
                    </ul>
                </div>
                <button onclick="this.parentElement.parentElement.remove()">Close Dashboard</button>
            </div>
        `;
        document.body.appendChild(dashboard);
    } else {
        alert('Invalid admin key');
    }
} 