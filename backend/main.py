import logging
import feedparser
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RSS_FEEDS = [
    "https://techcrunch.com/tag/artificial-intelligence/feed/",
    "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml"
]

favorites = []

class FavoriteItem(BaseModel):
    title: str
    link: str
    published: str

@app.get("/")
def home():
    return {"message": "AI News API Running 🚀"}

@app.get("/news")
def get_news():
    all_news = []

    for url in RSS_FEEDS:
        try:
            feed = feedparser.parse(url)
            
            if feed.bozo:
                logger.warning(f"Feed parsing issue for {url}: {feed.bozo_exception}")
            
            for entry in feed.entries[:5]:
                news_item = {
                    "title": entry.get("title", "No Title"),
                    "link": entry.get("link", "#"),
                    "published": entry.get("published", "N/A")
                }
                all_news.append(news_item)
        except Exception as e:
            logger.error(f"Error fetching feed {url}: {str(e)}")
            continue

    return {"news": all_news}

@app.post("/favorite")
def add_favorite(item: FavoriteItem):
    if any(f.link == item.link for f in favorites):
        raise HTTPException(status_code=400, detail="Item already in favorites")
    
    favorites.append(item)
    logger.info(f"Added favorite: {item.title}")
    return {"message": "Added to favorites", "item": item}

@app.get("/favorites")
def get_favorites():
    return {"favorites": favorites}

@app.delete("/favorite")
def delete_favorite(link: str):
    global favorites
    original_count = len(favorites)
    favorites = [f for f in favorites if f.link != link]
    
    if len(favorites) == original_count:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    logger.info(f"Removed favorite: {link}")
    return {"message": "Removed from favorites"}