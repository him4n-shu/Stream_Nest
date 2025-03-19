import React, { useEffect, useState } from "react";
import { fetchMoviesByGenre, genreIds } from "../tmdbApi";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Kid = () => {
  const [moviesByCategory, setMoviesByCategory] = useState({});

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const categories = [
          { name: "Animation", id: genreIds.Animation },
          { name: "Family", id: genreIds.Family },
          { name: "Adventure", id: genreIds.Adventure },
          { name: "Fantasy", id: genreIds.Fantasy },
        ];

        const categorizedMovies = {};
        for (const category of categories) {
          const movies = await fetchMoviesByGenre(category.id);
          categorizedMovies[category.name] = movies;
        }

        setMoviesByCategory(categorizedMovies);
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };
    loadMovies();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Kids Zone</h1>
        {[
          "Animation",
          "Family",
          "Adventure",
          "Fantasy",
        ].map((category) => (
          <div key={category} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {moviesByCategory[category]?.map((movie) => (
                <Link
                  key={movie.id}
                  to={`/watch/${movie.id}`}
                  state={{
                    title: movie.title,
                    posterPath: movie.poster_path,
                    type: "Movie",
                    releaseYear: new Date(movie.release_date).getFullYear()
                  }}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 block"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{movie.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      {new Date(movie.release_date).getFullYear()}
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

export default Kid;