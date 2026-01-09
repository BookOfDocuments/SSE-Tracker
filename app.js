// SSE 50 Stock Tracker Application

// SSE 50 constituent stocks (as of recent data)
const SSE50_STOCKS = [
    { code: '600000', name: 'Pudong Development Bank' },
    { code: '600009', name: 'Shanghai Airport' },
    { code: '600016', name: 'China Minsheng Bank' },
    { code: '600028', name: 'China Petroleum' },
    { code: '600030', name: 'CITIC Securities' },
    { code: '600036', name: 'China Merchants Bank' },
    { code: '600048', name: 'Poly Developments' },
    { code: '600050', name: 'China United Network' },
    { code: '600104', name: 'SAIC Motor' },
    { code: '600196', name: 'Fosun Pharma' },
    { code: '600276', name: 'Jiangsu Hengrui' },
    { code: '600309', name: 'Wanhua Chemical' },
    { code: '600436', name: 'Zhangzhou Pientzehuang' },
    { code: '600519', name: 'Kweichow Moutai' },
    { code: '600585', name: 'Conch Cement' },
    { code: '600588', name: 'Yonyou Network' },
    { code: '600690', name: 'Haier Smart Home' },
    { code: '600887', name: 'Inner Mongolia Yili' },
    { code: '600893', name: 'Sinopec' },
    { code: '600900', name: 'China Yangtze Power' },
    { code: '601012', name: 'Longi Green Energy' },
    { code: '601066', name: 'CIMC' },
    { code: '601088', name: 'China Shenhua' },
    { code: '601138', name: 'CRRC' },
    { code: '601166', name: 'Industrial Bank' },
    { code: '601211', name: 'Guotai Junan' },
    { code: '601288', name: 'Agricultural Bank' },
    { code: '601318', name: 'Ping An Insurance' },
    { code: '601398', name: 'ICBC' },
    { code: '601601', name: 'China Pacific Insurance' },
    { code: '601628', name: 'China Life Insurance' },
    { code: '601633', name: 'Great Wall Motor' },
    { code: '601668', name: 'China State Construction' },
    { code: '601728', name: 'China Telecom' },
    { code: '601818', name: 'Bank of China' },
    { code: '601857', name: 'PetroChina' },
    { code: '601888', name: 'China Tourism Group' },
    { code: '601899', name: 'Zijin Mining' },
    { code: '601919', name: 'COSCO Shipping' },
    { code: '601988', name: 'Bank of Communications' },
    { code: '603259', name: 'WuXi AppTec' },
    { code: '603288', name: 'Foshan Haitian' },
    { code: '603501', name: 'Will Semiconductor' },
    { code: '603986', name: 'GigaDevice Semiconductor' },
    { code: '603993', name: 'Luolai Lifestyle' },
    { code: '688111', name: 'Jinko Solar' },
    { code: '688187', name: 'Shenzhen Inovance' },
    { code: '688599', name: 'Tianhe Defense' },
    { code: '688981', name: 'China Resources Micro' },
    { code: '689009', name: 'Jiuzhang Quantum' }
];

let stocksData = [];
let filteredStocks = [];
let currentChart = null;
let autoRefreshInterval = null;

// Initialize the application
function init() {
    generateMockStockData();
    renderStocks();
    setupEventListeners();
    updateLastUpdateTime();
    startAutoRefresh();
}

// Generate mock stock data (in production, this would fetch from an API)
function generateMockStockData() {
    stocksData = SSE50_STOCKS.map(stock => {
        const basePrice = Math.random() * 200 + 10;
        const changePercent = (Math.random() - 0.5) * 10;
        const change = (basePrice * changePercent) / 100;

        return {
            code: stock.code,
            name: stock.name,
            price: basePrice.toFixed(2),
            change: change.toFixed(2),
            changePercent: changePercent.toFixed(2),
            volume: Math.floor(Math.random() * 10000000) + 1000000,
            marketCap: (basePrice * (Math.random() * 1000 + 100) * 1000000).toFixed(0),
            high: (basePrice * 1.05).toFixed(2),
            low: (basePrice * 0.95).toFixed(2),
            open: (basePrice * (0.98 + Math.random() * 0.04)).toFixed(2)
        };
    });

    filteredStocks = [...stocksData];
    updateStatistics();
}

// Render stock cards
function renderStocks() {
    const stockGrid = document.getElementById('stockGrid');

    if (filteredStocks.length === 0) {
        stockGrid.innerHTML = '<div class="loading">No stocks match your criteria</div>';
        return;
    }

    stockGrid.innerHTML = filteredStocks.map(stock => {
        const changeClass = stock.changePercent > 0 ? 'positive' : stock.changePercent < 0 ? 'negative' : 'neutral';
        const changeSymbol = stock.changePercent > 0 ? '+' : '';

        return `
            <div class="stock-card" data-code="${stock.code}">
                <div class="stock-header">
                    <div class="stock-info">
                        <h3>${stock.name}</h3>
                        <div class="stock-code">${stock.code}</div>
                    </div>
                    <div class="stock-price">
                        <div class="price">¥${stock.price}</div>
                        <div class="change ${changeClass}">
                            ${changeSymbol}${stock.changePercent}%
                        </div>
                    </div>
                </div>
                <div class="stock-details">
                    <div class="detail-item">
                        <div class="detail-label">Volume</div>
                        <div class="detail-value">${formatVolume(stock.volume)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Market Cap</div>
                        <div class="detail-value">¥${formatMarketCap(stock.marketCap)}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">High</div>
                        <div class="detail-value">¥${stock.high}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Low</div>
                        <div class="detail-value">¥${stock.low}</div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click event to each stock card
    document.querySelectorAll('.stock-card').forEach(card => {
        card.addEventListener('click', () => {
            const code = card.getAttribute('data-code');
            showStockChart(code);
        });
    });
}

// Format large numbers
function formatVolume(volume) {
    if (volume >= 1000000) {
        return (volume / 1000000).toFixed(2) + 'M';
    } else if (volume >= 1000) {
        return (volume / 1000).toFixed(2) + 'K';
    }
    return volume.toString();
}

function formatMarketCap(marketCap) {
    const cap = parseInt(marketCap);
    if (cap >= 1000000000000) {
        return (cap / 1000000000000).toFixed(2) + 'T';
    } else if (cap >= 1000000000) {
        return (cap / 1000000000).toFixed(2) + 'B';
    } else if (cap >= 1000000) {
        return (cap / 1000000).toFixed(2) + 'M';
    }
    return cap.toString();
}

// Update statistics
function updateStatistics() {
    const gainers = stocksData.filter(s => parseFloat(s.changePercent) > 0).length;
    const losers = stocksData.filter(s => parseFloat(s.changePercent) < 0).length;
    const unchanged = stocksData.filter(s => parseFloat(s.changePercent) === 0).length;

    document.getElementById('totalStocks').textContent = stocksData.length;
    document.getElementById('gainers').textContent = gainers;
    document.getElementById('losers').textContent = losers;
    document.getElementById('unchanged').textContent = unchanged;
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    document.getElementById('searchInput').addEventListener('input', handleSearch);

    // Sort functionality
    document.getElementById('sortSelect').addEventListener('change', handleSort);

    // Filter functionality
    document.getElementById('filterSelect').addEventListener('change', handleFilter);

    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', refreshData);

    // Modal close
    document.querySelector('.close').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('chartModal');
        if (e.target === modal) {
            closeModal();
        }
    });

    // Chart time period buttons
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.getAttribute('data-period');
            updateChartData(period);
        });
    });
}

// Handle search
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    filteredStocks = stocksData.filter(stock =>
        stock.name.toLowerCase().includes(searchTerm) ||
        stock.code.includes(searchTerm)
    );
    applyCurrentFilters();
    renderStocks();
}

// Handle sort
function handleSort(e) {
    const sortBy = e.target.value;

    filteredStocks.sort((a, b) => {
        switch(sortBy) {
            case 'code':
                return a.code.localeCompare(b.code);
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price':
                return parseFloat(b.price) - parseFloat(a.price);
            case 'change':
                return parseFloat(b.changePercent) - parseFloat(a.changePercent);
            case 'volume':
                return b.volume - a.volume;
            case 'marketCap':
                return parseFloat(b.marketCap) - parseFloat(a.marketCap);
            default:
                return 0;
        }
    });

    renderStocks();
}

// Handle filter
function handleFilter(e) {
    applyCurrentFilters();
    renderStocks();
}

function applyCurrentFilters() {
    const filterValue = document.getElementById('filterSelect').value;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();

    filteredStocks = stocksData.filter(stock => {
        const matchesSearch = stock.name.toLowerCase().includes(searchTerm) ||
                            stock.code.includes(searchTerm);

        if (!matchesSearch) return false;

        switch(filterValue) {
            case 'gainers':
                return parseFloat(stock.changePercent) > 0;
            case 'losers':
                return parseFloat(stock.changePercent) < 0;
            case 'unchanged':
                return parseFloat(stock.changePercent) === 0;
            default:
                return true;
        }
    });
}

// Refresh data
function refreshData() {
    const btn = document.getElementById('refreshBtn');
    btn.textContent = 'Refreshing...';
    btn.disabled = true;

    setTimeout(() => {
        generateMockStockData();
        applyCurrentFilters();
        renderStocks();
        updateLastUpdateTime();
        btn.textContent = 'Refresh Data';
        btn.disabled = false;
    }, 1000);
}

// Update last update time
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdate').textContent = timeString;
}

// Auto refresh every 30 seconds
function startAutoRefresh() {
    autoRefreshInterval = setInterval(() => {
        refreshData();
    }, 30000);
}

// Show stock chart
function showStockChart(code) {
    const stock = stocksData.find(s => s.code === code);
    if (!stock) return;

    const modal = document.getElementById('chartModal');
    document.getElementById('chartTitle').textContent = `${stock.name} (${stock.code})`;
    modal.style.display = 'block';

    updateChartData('1d');
}

// Generate mock historical data
function generateHistoricalData(stock, period) {
    let dataPoints = 0;
    switch(period) {
        case '1d': dataPoints = 24; break;
        case '5d': dataPoints = 120; break;
        case '1m': dataPoints = 30; break;
        case '3m': dataPoints = 90; break;
        case '1y': dataPoints = 365; break;
    }

    const basePrice = parseFloat(stock.price);
    const data = [];
    const labels = [];

    for (let i = dataPoints; i >= 0; i--) {
        const variance = (Math.random() - 0.5) * basePrice * 0.1;
        data.push((basePrice + variance).toFixed(2));

        if (period === '1d') {
            labels.push(`${i}h ago`);
        } else {
            labels.push(`${i}d ago`);
        }
    }

    return { labels: labels.reverse(), data: data.reverse() };
}

// Update chart data
function updateChartData(period) {
    const chartTitle = document.getElementById('chartTitle').textContent;
    const code = chartTitle.match(/\((\d+)\)/)[1];
    const stock = stocksData.find(s => s.code === code);

    if (!stock) return;

    const { labels, data } = generateHistoricalData(stock, period);

    const ctx = document.getElementById('stockChart').getContext('2d');

    if (currentChart) {
        currentChart.destroy();
    }

    const changePercent = parseFloat(stock.changePercent);
    const lineColor = changePercent > 0 ? '#10b981' : changePercent < 0 ? '#ef4444' : '#6b7280';

    currentChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price (¥)',
                data: data,
                borderColor: lineColor,
                backgroundColor: lineColor + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        callback: function(value) {
                            return '¥' + value;
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

// Close modal
function closeModal() {
    document.getElementById('chartModal').style.display = 'none';
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
