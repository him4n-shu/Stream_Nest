import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { searchContent } from "../tmdbApi";

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await searchContent(query, currentPage);
        setResults(data.results);
        setTotalResults(data.total_results);
        setTotalPages(data.total_pages);
      } catch (error) {
        console.error("Error searching content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        {query ? (
          <p className="text-gray-400 mb-6">Found {totalResults} results for "{query}"</p>
        ) : (
          <p className="text-gray-400 mb-6">Enter a search term to find movies and TV shows</p>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {results.map((item) => (
                <Link
                  key={item.id}
                  to={`/watch/${item.id}`}
                  state={{
                    title: item.title,
                    posterPath: item.poster_path,
                    type: item.media_type === "tv" ? "TV Series" : "Movie",
                    releaseYear: item.release_year
                  }}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition-transform duration-300 block"
                >
                  {item.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                      alt={item.title}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-gray-400 text-sm">
                        {item.release_year}
                      </p>
                      <span className="bg-gray-700 text-xs px-2 py-1 rounded">
                        {item.media_type === "tv" ? "TV" : "Movie"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded ${currentPage === 1 ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center px-4 py-2 bg-gray-800 rounded">
                    <span>{currentPage} of {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded ${currentPage === totalPages ? 'bg-gray-700 text-gray-500' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : query ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No results found for "{query}"</p>
            <p className="mt-2 text-gray-500">Try different keywords or check your spelling</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Search;