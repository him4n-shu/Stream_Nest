import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchContent } from "../tmdbApi";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const suggestionsRef = useRef(null);

  const navItems = [
    { name: "New Movie", path: "/" },
    { name: "Genre", path: "/genre" },
    { name: "Country", path: "/country" },
    { name: "Kid", path: "/kid" },
    { name: "TV Series", path: "/tv-series" }
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const data = await searchContent(searchQuery.trim(), 1);
        setSuggestions(data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-black text-white py-3 px-4 font-montserrat">
      <div className="container mx-auto flex items-center justify-between">
        
        {/* Left side - Logo */}
        <div className="flex items-center">
          <img src="/Logo-1.png" alt="StreamNest Logo" className="h-12 w-auto" />
        </div>

        {/* Center - Navigation links */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative px-1 py-2 font-medium transition-colors ${
                currentPath === item.path ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {item.name}
              {currentPath === item.path && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Right side - Search Bar & Icon */}
        <div className="flex items-center space-x-3">
          <form 
            className="relative" 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
                setSearchQuery("");
                setShowSuggestions(false);
              }
            }}
          >
            <input
              type="text"
              placeholder="Search movies..."
              className="bg-gray-800 text-white text-sm px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 w-40 md:w-60"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className="absolute right-3 top-2 text-gray-400">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Movie Suggestions Dropdown */}
            {showSuggestions && searchQuery.trim().length >= 2 && (
              <div 
                ref={suggestionsRef}
                className="absolute mt-1 w-full bg-gray-900 rounded-md shadow-lg overflow-hidden z-50 max-h-80 overflow-y-auto"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center p-4">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/watch/${item.id}`}
                        state={{
                          title: item.title,
                          posterPath: item.poster_path,
                          type: item.media_type === "tv" ? "TV Series" : "Movie",
                          releaseYear: item.release_year
                        }}
                        className="flex items-center p-3 hover:bg-gray-800 transition-colors border-b border-gray-800"
                        onClick={() => {
                          setSearchQuery("");
                          setShowSuggestions(false);
                        }}
                      >
                        {item.poster_path ? (
                          <img 
                            src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                            alt={item.title}
                            className="w-10 h-14 object-cover rounded mr-3"
                          />
                        ) : (
                          <div className="w-10 h-14 bg-gray-700 rounded flex items-center justify-center mr-3">
                            <span className="text-xs text-gray-400">No Image</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-400">{item.release_year}</span>
                            <span className="mx-2 text-gray-600">•</span>
                            <span className="text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                              {item.media_type === "tv" ? "TV" : "Movie"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : searchQuery.trim().length >= 2 ? (
                  <div className="p-3 text-sm text-gray-400 text-center">
                    No results found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </form>
        </div>

        {/* Mobile menu button - hidden on desktop */}
        <div className="md:hidden flex items-center">
          <button className="p-1 rounded-full hover:bg-gray-800 transition-colors">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
