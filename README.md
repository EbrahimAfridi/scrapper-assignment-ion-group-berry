# KKR Portfolio Scraper

A NestJS application that scrapes all portfolio companies from KKR's public website, stores them in MongoDB, and exposes a REST API to query the data.

## Overview

KKR publishes its portfolio on [kkr.com/invest/portfolio](https://www.kkr.com/invest/portfolio) but does not provide a public API. This application reverse-engineered the internal JSON endpoint used by KKR's website, built a paginated scraper to collect all 299 portfolio companies, and stores them in a structured MongoDB database with a clean REST API for querying.

### Data Collected Per Company

- Name and sorting name
- Year of investment
- Asset class (supports multi-value e.g. `["Tech Growth", "Private Equity"]`)
- Industry
- Region
- Headquarters location
- Description
- Logo URL
- Website URL

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS (TypeScript)
- **Database:** MongoDB with Mongoose
- **HTTP Client:** Axios
- **Containerization:** Docker + Docker Compose

## Project Structure
```
src/
├── app.module.ts                          # Root module
├── main.ts                                # Entry point
├── common/
│   └── utils/
│       └── delay.util.ts                  # Rate limiting utility
├── portfolio/
│   ├── portfolio.module.ts
│   ├── portfolio.controller.ts            # GET /portfolio endpoints
│   ├── portfolio.service.ts               # DB upsert and query logic
│   ├── schemas/
│   │   └── portfolio-company.schema.ts    # Mongoose schema
│   └── dto/
│       ├── create-portfolio-company.dto.ts
│       └── query-portfolio.dto.ts
└── scraper/
    ├── scraper.module.ts
    ├── scraper.controller.ts              # POST /scraper/run
    ├── scraper.service.ts                 # Pagination orchestration
    ├── kkr.client.ts                      # KKR API HTTP client
    └── transformers/
        └── company.transformer.ts         # Data normalization
```

## Prerequisites

- [Docker](https://www.docker.com/get-started) and Docker Compose
- Node.js 20+ (only needed if running without Docker)

## Running with Docker (Recommended)

This is the simplest way to run the full application. One command starts both the app and MongoDB.

**1. Clone the repository**
```bash
git clone <repository-url>
cd kkr-portfolio
```

**2. Create your environment file**
```bash
cp .env.example .env
```

No changes needed — the defaults work out of the box with Docker Compose.

**3. Start the application**
```bash
docker-compose up --build
```

The app will be available at `http://localhost:3000`.

MongoDB data is persisted in a named Docker volume, so it survives restarts.

**4. Run the scraper**

In a separate terminal:
```bash
curl -X POST http://localhost:3000/scraper/run
```

The scraper will fetch all 20 pages of KKR portfolio data (299 companies) and store them in MongoDB. You will see progress logs in the Docker terminal.

**5. Query the data**
```bash
curl http://localhost:3000/portfolio
```

---

## Running Locally (Without Docker)

**1. Install dependencies**
```bash
npm install
```

**2. Start MongoDB**

Run MongoDB locally or start only the MongoDB container:
```bash
docker-compose up mongodb -d
```

**3. Create your environment file**
```bash
cp .env.example .env
```

**4. Start the app**
```bash
npm run start:dev
```

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/kkr-portfolio` | MongoDB connection string |
| `KKR_BASE_URL` | `https://www.kkr.com` | KKR website base URL |
| `SCRAPER_DELAY_MS` | `1000` | Delay between paginated requests (ms) |
| `PORT` | `3000` | HTTP server port |

Never commit your `.env` file. Use `.env.example` as the reference template.

---

## API Reference

### Scraper

#### `POST /scraper/run`

Triggers the scraper. Fetches all portfolio companies from KKR and upserts them into MongoDB. Safe to run multiple times — will update existing records, not create duplicates.

**Response:**
```json
{
  "total": 299,
  "scraped": 299
}
```

---

### Portfolio

#### `GET /portfolio`

Returns all portfolio companies. Supports optional query parameters for filtering.

**Query Parameters:**

| Parameter | Type | Example | Description |
|---|---|---|---|
| `assetClass` | string | `Private Equity` | Filter by asset class |
| `industry` | string | `Healthcare` | Filter by industry |
| `region` | string | `Americas` | Filter by region |
| `keyword` | string | `energy` | Search name and description |

**Examples:**
```bash
# All companies
curl http://localhost:3000/portfolio

# Filter by region
curl "http://localhost:3000/portfolio?region=Americas"

# Filter by industry
curl "http://localhost:3000/portfolio?industry=Healthcare"

# Filter by asset class
curl "http://localhost:3000/portfolio?assetClass=Private Equity"

# Keyword search
curl "http://localhost:3000/portfolio?keyword=energy"

# Combined filters
curl "http://localhost:3000/portfolio?region=Americas&industry=Technology"
```

**Response:**
```json
[
  {
    "_id": "...",
    "slug": "1-800-contacts-inc",
    "name": "1-800 Contacts, Inc.",
    "yearOfInvestment": "2020",
    "assetClass": ["Private Equity"],
    "industry": "Consumer Discretionary",
    "region": "Americas",
    "headquarters": "Draper, Utah, United States",
    "description": "Leading online destination for contact lenses.",
    "logoUrl": "https://www.kkr.com/content/dam/kkr/portfolio/...",
    "websiteUrl": "https://www.1800contacts.com",
    "scrapedAt": "2025-03-12T20:00:00.000Z",
    "createdAt": "2025-03-12T20:00:00.000Z",
    "updatedAt": "2025-03-12T20:00:00.000Z"
  }
]
```

#### `GET /portfolio/count`

Returns the total number of companies in the database.

**Response:**
```json
299
```

---

## Architecture Decisions

**Why no Playwright/Puppeteer?**
During initial investigation of the KKR website's network traffic, I discovered that the portfolio page uses an internal JSON endpoint (`bioportfoliosearch.bioportfoliosearch.json`) that is publicly accessible without authentication. This allowed simple HTTP requests via Axios instead of a headless browser, making the scraper faster, lighter, and more reliable.

**Why upsert instead of insert?**
The scraper uses MongoDB's `findOneAndUpdate` with `upsert: true` and `slug` as the unique key. This means the scraper is idempotent — running it multiple times updates existing records without creating duplicates.

**Why is `assetClass` stored as an array?**
KKR's API returns asset class as a comma-separated string for companies that belong to multiple classes (e.g. `"Tech Growth, Private Equity"`). Storing as an array enables accurate filtering using MongoDB's `$in` operator.

**Why a separate transformer layer?**
Raw API data requires several normalizations: stripping HTML from descriptions, converting relative logo paths to absolute URLs, normalizing website URLs, and splitting asset classes. Isolating this logic in `company.transformer.ts` keeps it testable and decoupled from both the HTTP client and the database layer.

---

## Linting
```bash
npm run lint
```

---

## License

MIT