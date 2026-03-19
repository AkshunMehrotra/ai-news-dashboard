"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const API_URL = "https://glorious-fortnight-6v59jp7x9rrc5grp-8000.app.github.dev";

type NewsItem = {
  title: string;
  link: string;
  published: string;
};

export default function Home() {
  // 🔥 FIX: mounted check
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [news, setNews] = useState<NewsItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [category, setCategory] = useState<string>("all");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`${API_URL}/news`);
        const data = await res.json();
        setNews(data.news || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const addFavorite = async (item: NewsItem) => {
    try {
      await fetch(`${API_URL}/favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
      });

      setFavorites((prev) => [...prev, item.link]);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNews = news
    .filter((item) =>
      item.title.toLowerCase().includes(search.toLowerCase())
    )
    .filter((item) => {
      if (category === "all") return true;
      return item.title.toLowerCase().includes(category);
    });

  // 🔥 FIX: prevent SSR hydration mismatch
  if (!mounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen text-gray-200 relative overflow-hidden p-6"
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/batman.png')" }}
      />

      <motion.div
        className="absolute inset-0 bg-[url('https://i.ibb.co/7QpKsCX/rain.png')] opacity-25"
        animate={{ backgroundPositionY: ["0%", "100%"] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-0 bg-white"
        animate={{ opacity: [0, 0.15, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-extrabold text-center mb-6 tracking-widest 
          text-gray-300 drop-shadow-[0_0_20px_rgba(0,0,255,0.5)]"
        >
          🦇 GOTHAM AI
        </motion.h1>

        <p className="text-center text-gray-500 mb-8">
          Intelligence from the shadows...
        </p>

        <div className="flex justify-center mb-6">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            type="text"
            placeholder="🔍 Search classified AI intel..."
            autoComplete="off"
            name="search"
            className="p-3 w-full max-w-xl rounded-lg bg-gray-900 text-white border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handleSearch}
          />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {["all", "ai", "startup", "research"].map((cat) => (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full ${
                category === cat
                  ? "bg-blue-700 shadow-lg shadow-blue-500/40"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {cat.toUpperCase()}
            </motion.button>
          ))}
        </div>

        {loading && (
          <p className="text-center text-gray-500 animate-pulse">
            🕶️ Loading intelligence...
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {filteredNews.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 
              backdrop-blur-md shadow-lg 
              hover:shadow-blue-500/40 hover:border-blue-500/40 
              transition-all duration-300"
            >
              <h2 className="text-lg font-semibold mb-2 hover:text-blue-400 transition">
                📰 {item.title}
              </h2>

              <p className="text-gray-500 text-sm mb-2">
                🕒 {item.published}
              </p>

              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline text-sm"
              >
                🔗 View Intel
              </a>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => addFavorite(item)}
                  disabled={favorites.includes(item.link)}
                  className="px-3 py-1 bg-yellow-500 text-black rounded 
                  hover:bg-yellow-400 hover:scale-105 transition"
                >
                  ⭐ Save
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/?text=${item.title} ${item.link}`
                    )
                  }
                  className="px-3 py-1 bg-green-600 rounded 
                  hover:bg-green-500 hover:scale-105 transition"
                >
                  📲 Share
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && filteredNews.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            No intel found...
          </p>
        )}
      </div>
    </motion.div>
  );
}