# Weather Intelligence Dashboard

A modern, responsive weather intelligence application featuring real-time global city search, comprehensive 7-day forecasts, 24-hour timeline trends, atmospheric detail metrics, and outdoor activity suitability ratings powered by Open-Meteo.

## Features

- **Global City Search & Geocoding**: Search for cities worldwide with instant autocomplete suggestions.
- **Geolocation Support**: Detect your current location with one click using browser GPS.
- **Real-Time Weather Metrics**: Current temperature, "feels like" temperature, weather condition codes, wind speed/direction, humidity, dew point, surface pressure, cloud cover, UV index, and visibility.
- **24-Hour Hourly Timeline**: Interactive hourly timeline showing temperature curves, precipitation probability, and weather conditions.
- **7-Day Extended Forecast**: Daily high/low temperatures, precipitation chances, sunrise/sunset times, and max UV index.
- **Atmospheric & Solar Details**: Card view for air quality parameters, wind gusts, humidity, pressure, and solar cycle.
- **Activity Suitability Index**: Outdoor suitability scoring for running, cycling, hiking, water sports, outdoor dining, and stargazing based on live weather metrics.
- **Favorites & Fast Switching**: Bookmark frequently visited locations with local persistence.
- **Unit Conversion**: Seamlessly toggle between Celsius (°C) and Fahrenheit (°F).
- **Responsive & Accessible UI**: Dark atmospheric theme optimized for desktop, tablet, and mobile screens.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Bundler & Dev Server**: Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion (formerly Framer Motion)
- **Data Source**: Open-Meteo Free Weather & Geocoding APIs

## Project Structure

```
├── .env.example              # Environment variable definitions
├── index.html                # HTML entry point with typography and meta tags
├── metadata.json             # Application metadata and frame permissions
├── package.json              # Project dependencies and npm scripts
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite configuration with React and Tailwind plugins
└── src/
    ├── App.tsx               # Main application controller and state management
    ├── main.tsx              # Application root entry point
    ├── index.css             # Global Tailwind CSS stylesheet
    ├── components/           # UI components
    │   ├── ActivitySuitabilityGrid.tsx
    │   ├── AtmosphericDetailsCard.tsx
    │   ├── CurrentWeatherCard.tsx
    │   ├── DailyForecastCard.tsx
    │   ├── ErrorMessage.tsx
    │   ├── Header.tsx
    │   ├── HourlyTimeline.tsx
    │   ├── LoadingSkeleton.tsx
    │   ├── SavedLocationsBar.tsx
    │   ├── SearchBar.tsx
    │   ├── WeatherIcon.tsx
    │   └── WeatherIntelligenceBanner.tsx
    ├── services/             # API services
    │   └── weatherApi.ts     # Open-Meteo weather and geocoding fetchers
    ├── types/                # TypeScript interface declarations
    │   └── weather.ts
    └── utils/                # Calculation and conversion helpers
        ├── units.ts
        ├── weatherIntelligence.ts
        └── wmoCodes.ts
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server on port 3000:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

Compile TypeScript and build static production assets:
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory.

### Linting / Type Checking

Validate TypeScript types without emitting files:
```bash
npm run lint
```

## License

Apache-2.0
