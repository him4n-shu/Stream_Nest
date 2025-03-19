import React, { useEffect, useState } from "react";
import { fetchMoviesByGenre, genreIds } from "../tmdbApi";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Genre = () => {
  const [moviesByGenre, setMoviesByGenre] = useState({});

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const genres = [
          "Action",
          "Comedy",
          "Drama",
          "Horror",
          "Romance",
          "Sci-Fi",
          "Thriller",
          "Animation",
        ];

        const categorizedMovies = {};
        for (const genre of genres) {
          const movies = await fetchMoviesByGenre(genreIds[genre]);
          categorizedMovies[genre] = movies;
        }

        setMoviesByGenre(categorizedMovies);
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
        <h1 className="text-3xl font-bold mb-6">Movie Genres</h1>
        {[
          "Action",
          "Comedy",
          "Drama",
          "Horror",
          "Romance",
          "Sci-Fi",
          "Thriller",
          "Animation",
        ].map((genre) => (
          <div key={genre} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{genre}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {moviesByGenre[genre]?.map((movie) => (
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

export default Genre;