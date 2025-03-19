import React, { useEffect, useState } from "react";
import { fetchMoviesByRegion } from "../tmdbApi";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

const Country = () => {
  const [moviesByCountry, setMoviesByCountry] = useState({});

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const countries = [
          { name: "United States", code: "US" },
          { name: "India", code: "IN" },
          { name: "South Korea", code: "KR" },
          { name: "Japan", code: "JP" },
          { name: "United Kingdom", code: "GB" },
          { name: "France", code: "FR" },
          { name: "Spain", code: "ES" },
          { name: "Italy", code: "IT" },
        ];

        const categorizedMovies = {};
        for (const country of countries) {
          const movies = await fetchMoviesByRegion(country.code);
          categorizedMovies[country.name] = movies;
        }

        setMoviesByCountry(categorizedMovies);
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
        <h1 className="text-3xl font-bold mb-6">Movies by Country</h1>
        {[
          "United States",
          "India",
          "South Korea",
          "Japan",
          "United Kingdom",
          "France",
          "Spain",
          "Italy",
        ].map((country) => (
          <div key={country} className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">{country}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {moviesByCountry[country]?.map((movie) => (
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

export default Country;