import React, { useEffect, useState } from "react";
import { fetchTVSeriesByGenre, genreIds } from "../tmdbApi";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const TVSeries = () => {
  const [showsByCategory, setShowsByCategory] = useState({});

  useEffect(() => {
    const loadShows = async () => {
      try {
        const categories = [
          { name: "Drama Series", id: genreIds.Drama },
          { name: "Comedy Series", id: genreIds.Comedy },
          { name: "Crime Series", id: genreIds.Crime },
          { name: "Documentary", id: genreIds.Documentary },
          { name: "Mystery Series", id: genreIds.Mystery },
          { name: "Sci-Fi Series", id: genreIds["Sci-Fi"] },
          { name: "Family Series", id: genreIds.Family },
          { name: "Adventure Series", id: genreIds.Adventure },
        ];

        const categorizedShows = {};
        for (const category of categories) {
          const shows = await fetchTVSeriesByGenre(category.id);
          categorizedShows[category.name] = shows;
        }

        setShowsByCategory(categorizedShows);
      } catch (error) {
        console.error("Error loading shows:", error);
      }
    };
    loadShows();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">TV Series</h1>
        {[
          "Drama Series",
          "Comedy Series",
          "Crime Series",
          "Documentary",
          "Mystery Series",
          "Sci-Fi Series",
          "Family Series",
          "Adventure Series",
        ].map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {showsByCategory[category]?.map((show) => (
                <Link
                  key={show.id}
                  to={`/watch/${show.id}`}
                  state={{
                    title: show.name,
                    posterPath: show.poster_path,
                    type: "TV Series",
                    releaseYear: new Date(show.first_air_date).getFullYear()
                  }}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 block"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{show.name}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(show.first_air_date).getFullYear()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TVSeries;