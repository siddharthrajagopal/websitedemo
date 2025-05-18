// Analytics tracking
class Analytics {
    constructor() {
        this.visitData = JSON.parse(localStorage.getItem('visitData')) || {
            totalVisits: 0,
            lastVisit: null,
            visitHistory: [],
            pageViews: {}
        };
        this.initializeVisit();
    }

    initializeVisit() {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        
        // Update total visits
        this.visitData.totalVisits++;
        
        // Update last visit
        this.visitData.lastVisit = now.toISOString();
        
        // Add to visit history
        this.visitData.visitHistory.push({
            timestamp: now.toISOString(),
            page: window.location.pathname,
            referrer: document.referrer || 'direct'
        });
        
        // Keep only last 100 visits
        if (this.visitData.visitHistory.length > 100) {
            this.visitData.visitHistory.shift();
        }
        
        // Update page views
        const currentPage = window.location.pathname;
        this.visitData.pageViews[currentPage] = (this.visitData.pageViews[currentPage] || 0) + 1;
        
        // Save to localStorage
        localStorage.setItem('visitData', JSON.stringify(this.visitData));
    }

    getAnalytics() {
        return this.visitData;
    }

    getPageViews() {
        return this.visitData.pageViews;
    }

    getVisitHistory() {
        return this.visitData.visitHistory;
    }

    getTotalVisits() {
        return this.visitData.totalVisits;
    }

    getLastVisit() {
        return this.visitData.lastVisit;
    }
}

// Initialize analytics
const analytics = new Analytics();

// Admin dashboard functionality
function showAnalytics() {
    const adminKey = prompt('Enter admin key:');
    if (adminKey === 'Sujay&Sidd') { // Change this to your desired admin key
        const analyticsData = analytics.getAnalytics();
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