# PriceGhost Scraper API

Python-based scraper using crawl4ai for Amazon price extraction.

## Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repo
3. Set root directory to `scraper_api`
4. Build command: `pip install -r requirements.txt && playwright install chromium`
5. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Environment Variables

None required.

## Endpoints

### GET /
Health check

### POST /scrape
```json
{
  "url": "https://amazon.co.uk/dp/B09CQ32VC7",
  "product_name": "VANKYO Performance V630"
}
```

Response:
```json
{
  "success": true,
  "price": 42.49,
  "currency": "GBP",
  "title": "...",
  "image": "..."
}
```

## Local Development

```bash
cd scraper_api
pip install -r requirements.txt
playwright install chromium
uvicorn main:app --reload
```
