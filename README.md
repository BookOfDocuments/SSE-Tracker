# SSE 50 Stock Tracker

A real-time web application for tracking stocks from the Shanghai Stock Exchange 50 Index (SSE 50).

## Features

- **Real-time Stock Data**: Track all 50 constituent stocks with current prices and changes
- **Search & Filter**: Search by stock name or code, filter by gainers/losers
- **Sorting Options**: Sort by code, name, price, change percentage, volume, or market cap
- **Historical Charts**: View price history with interactive charts (1D, 5D, 1M, 3M, 1Y)
- **Auto-refresh**: Data automatically refreshes every 30 seconds
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Statistics Overview**: Quick view of gainers, losers, and unchanged stocks

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

1. Clone or download this repository

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The app will automatically open in your browser at `http://localhost:3000`

### Running in Cursor

If you're using Cursor IDE:

1. Open the project folder in Cursor
2. Open the integrated terminal (Ctrl + ` or Cmd + `)
3. Run:
   ```bash
   npm install
   npm start
   ```
4. The app will launch in your default browser

### Available Scripts

- `npm start` or `npm run dev` - Starts the development server with live reload
- The server automatically refreshes when you make changes to HTML, CSS, or JS files

## Usage

### Viewing Stocks

- All 50 SSE stocks are displayed in cards showing:
  - Stock name and code
  - Current price
  - Change percentage (color-coded: green for gains, red for losses)
  - Trading volume
  - Market capitalization
  - Daily high and low prices

### Search & Filter

- **Search**: Type in the search box to filter by stock name or code
- **Sort**: Use the dropdown to sort stocks by various criteria
- **Filter**: Choose to view all stocks, only gainers, only losers, or unchanged stocks

### View Charts

Click on any stock card to view a detailed price chart with multiple time periods:
- 1D (last 24 hours)
- 5D (last 5 days)
- 1M (last month)
- 3M (last 3 months)
- 1Y (last year)

### Refresh Data

- Click the "Refresh Data" button to manually update stock prices
- Data automatically refreshes every 30 seconds

## Technical Details

### Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- Chart.js for data visualization

### Data Source

Currently, the app uses mock data for demonstration purposes. In a production environment, you would integrate with:
- Yahoo Finance API
- Alpha Vantage API
- Real-time stock data providers
- Custom backend API

### Customization

To connect to a real data source, modify the `generateMockStockData()` function in `app.js` to fetch from your API:

```javascript
async function fetchStockData() {
    const response = await fetch('YOUR_API_ENDPOINT');
    const data = await response.json();
    // Process and update stocksData
}
```

## SSE 50 Constituents

The app tracks these major Chinese companies:
- Financial sector: ICBC, Bank of China, China Merchants Bank, Ping An Insurance
- Energy: PetroChina, Sinopec, China Shenhua
- Consumer goods: Kweichow Moutai, Inner Mongolia Yili
- Technology: WuXi AppTec, GigaDevice Semiconductor
- And 40+ other leading Chinese companies

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- IE11: Not supported (uses modern JavaScript features)

## Future Enhancements

Potential features for future versions:
- Integration with real-time stock APIs
- User watchlists and favorites
- Price alerts and notifications
- Technical indicators (RSI, MACD, etc.)
- News feed for each stock
- Export data to CSV/Excel
- Dark mode
- Multi-language support

## License

This project is open source and available for personal and educational use.

## Disclaimer

This application is for informational purposes only. Stock prices shown are mock data for demonstration. Always consult official financial sources and professional advisors before making investment decisions.
