"use client";
import { useEffect, useState } from "react";

const API_URL = "https://glorious-fortnight-6v59jp7x9rrc5grp-8000.app.github.dev";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_URL}/favorites`);

        if (!res.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await res.json();
        setFavorites(data.favorites || []);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      }
    };

    fetchFavorites();
  }, []);

  const removeFavorite = async (link: string) => {
    try {
      await fetch(`${API_URL}/favorite?link=${encodeURIComponent(link)}`, {
        method: "DELETE",
      });

      setFavorites((prev) => prev.filter((item) => item.link !== link));
    } catch (err) {
      console.error("Error removing favorite:", err);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        ⭐ Favorites
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {favorites.map((item, index) => (
          <div
            key={index}
            className="p-5 bg-gray-900 rounded-2xl shadow-lg"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>

            <p className="text-gray-400 text-sm mb-2">
              🕒 {item.published}
            </p>

            <a
              href={item.link}
              target="_blank"
              className="text-blue-400 text-sm"
            >
              🔗 Read Full Article
            </a>

            <div className="mt-4">
              <button
                onClick={() => removeFavorite(item.link)}
                className="px-3 py-1 bg-red-500 rounded"
              >
                ❌ Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {favorites.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No favorites yet 😢
        </p>
      )}
    </div>
  );
}