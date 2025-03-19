import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { fetchDetailsById } from "../tmdbApi";

const Watch = () => {
  const { id } = useParams();
  const location = useLocation();
  const { title, posterPath, type, releaseYear } = location.state || {};
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDetails = async () => {
      try {
        setLoading(true);
        const mediaType = type === "TV Series" ? "tv" : "movie";
        const result = await fetchDetailsById(id, mediaType);
        setDetails(result);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getDetails();
    }
  }, [id, type]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left side - Poster */}
          <div className="md:w-1/3">
            <img
              src={`https://image.tmdb.org/t/p/w500${posterPath}`}
              alt={title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          
          {/* Right side - Content */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-yellow-400">{type} • {releaseYear}</p>
              {details && details.vote_average && (
                <div className="bg-yellow-500 text-black px-2 py-1 rounded-md flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">{details.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Watch Now</h2>
              <div className="aspect-w-16 aspect-h-9 bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="flex justify-center gap-4 p-8">
                  {details && details.tmdbUrl && (
                    <a 
                      href={details.tmdbUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white py-2 px-6 rounded-full font-medium hover:bg-blue-500 transition-colors flex items-center"
                    >
                      <span>Watch on TMDB</span>
                    </a>
                  )}
                  {details && details.imdbUrl && (
                    <a 
                      href={details.imdbUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-yellow-600 text-white py-2 px-6 rounded-full font-medium hover:bg-yellow-500 transition-colors flex items-center"
                    >
                      <span>View on IMDb</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-2">About this {type}</h2>
              {loading ? (
                <p className="text-gray-300">Loading details...</p>
              ) : details ? (
                <div>
                  <p className="text-gray-300 mb-4">{details.overview}</p>
                  {details.genres && details.genres.length > 0 && (
                    <div className="mb-4">
                      <h3 className="text-lg font-medium mb-2">Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {details.genres.map(genre => (
                          <span key={genre.id} className="bg-gray-700 text-white px-3 py-1 rounded-full text-sm">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {details.vote_count && (
                      <div>
                        <h3 className="text-lg font-medium mb-1">Vote Count</h3>
                        <p className="text-gray-300">{details.vote_count.toLocaleString()}</p>
                      </div>
                    )}
                    {details.popularity && (
                      <div>
                        <h3 className="text-lg font-medium mb-1">Popularity</h3>
                        <p className="text-gray-300">{details.popularity.toFixed(1)}</p>
                      </div>
                    )}
                    {details.runtime && (
                      <div>
                        <h3 className="text-lg font-medium mb-1">Runtime</h3>
                        <p className="text-gray-300">{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</p>
                      </div>
                    )}
                    {details.number_of_seasons && (
                      <div>
                        <h3 className="text-lg font-medium mb-1">Seasons</h3>
                        <p className="text-gray-300">{details.number_of_seasons}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">
                  No details available for this {type.toLowerCase()}.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;