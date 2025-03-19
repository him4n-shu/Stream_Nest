import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchMovies } from "../tmdbApi";

const Platform = () => {
  const { platformId } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Platform display names mapping
  const platformNames = {
    netflix: "Netflix",
    prime: "Prime Video",
    disney: "Disney+",
    hulu: "Hulu",
    hbo: "HBO Max",
    apple: "Apple TV+",
    paramount: "Paramount+",
    peacock: "Peacock",
    crunchyroll: "Crunchyroll"
  };

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const fetchedMovies = await fetchMovies();
        setMovies(fetchedMovies);
      } catch (error) {
        console.error(`Error loading ${platformId} movies:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMovies();
  }, [platformId]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white p-2 rounded-lg flex items-center justify-center shadow-lg" 
               style={{ 
                 minWidth: '65px', 
                 minHeight: '45px', 
                 boxShadow: '0 0 15px rgba(255, 255, 255, 0.6)', 
                 border: '2px solid rgba(255, 255, 255, 0.5)'
               }}>
            <img 
              src={`/ott-platform-logo/${platformId === 'netflix' ? 'netflix-logo.png' : 
                    platformId === 'prime' ? 'prime-video.png' : 
                    platformId === 'disney' ? 'disney +.png' : 
                    platformId === 'hulu' ? 'hulu.png' : 
                    platformId === 'hbo' ? 'hbo-max.png' : 
                    platformId === 'apple' ? 'apple-tv+.jpg' : 
                    platformId === 'paramount' ? 'paramount +.png' : 
                    platformId === 'peacock' ? 'peacock.png' : 
                    platformId === 'crunchyroll' ? 'crunchyroll.png' : 'Logo-1.png'}`} 
              alt={platformNames[platformId]} 
              className="h-8 w-auto object-contain"
              style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))' }}
            />
          </div>
          <h1 className="text-3xl font-bold">{platformNames[platformId]} Movies</h1>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {movies.map((movie) => (
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
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-gray-400 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                    <span className="bg-gray-700 text-xs px-2 py-1 rounded flex items-center gap-1">
                      <div className="bg-white p-0.5 rounded flex items-center justify-center mr-1" 
                           style={{ 
                             minWidth: '16px', 
                             minHeight: '16px', 
                             boxShadow: '0 0 8px rgba(255, 255, 255, 0.4)',
                             border: '1px solid rgba(255, 255, 255, 0.3)'
                           }}>
                        <img 
                          src={`/ott-platform-logo/${platformId === 'netflix' ? 'netflix-logo.png' : 
                                platformId === 'prime' ? 'prime-video.png' : 
                                platformId === 'disney' ? 'disney +.png' : 
                                platformId === 'hulu' ? 'hulu.png' : 
                                platformId === 'hbo' ? 'hbo-max.png' : 
                                platformId === 'apple' ? 'apple-tv+.png' : 
                                platformId === 'paramount' ? 'paramount +.png' : 
                                platformId === 'peacock' ? 'peacock.png' : 
                                platformId === 'crunchyroll' ? 'crunchyroll.png' : 'Logo-1.png'}`} 
                          alt={platformNames[platformId]} 
                          className="h-3 w-auto object-contain"
                          style={{ filter: 'contrast(1.2)' }}
                        />
                      </div>
                      {platformNames[platformId]}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">No movies found for {platformNames[platformId]}.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Platform;