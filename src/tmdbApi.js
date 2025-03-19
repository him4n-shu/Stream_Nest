const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Fetch trending movies
export const fetchMovies = async () => {
  if (!API_KEY) {
    console.error("API Key is missing!");
    return [];
  }

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}`
    );
    if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
    const data = await res.json();
    return data.results?.slice(0, 5) || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};

// Fetch movies by genre
export const fetchMoviesByGenre = async (genreId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    if (!res.ok) throw new Error(`Failed to fetch genre movies: ${res.status}`);
    const data = await res.json();
    return data.results?.slice(0, 5) || [];
  } catch (error) {
    console.error("Error fetching genre movies:", error);
    return [];
  }
};

// Fetch TV series by genre
export const fetchTVSeriesByGenre = async (genreId) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
    );
    if (!res.ok) throw new Error(`Failed to fetch TV series: ${res.status}`);
    const data = await res.json();
    return data.results?.slice(0, 5) || [];
  } catch (error) {
    console.error("Error fetching TV series:", error);
    return [];
  }
};

// Fetch movies by region/country
export const fetchMoviesByRegion = async (region) => {
  try {
    // Map country codes to appropriate language codes
    let originalLanguage;
    switch(region) {
      case 'US': originalLanguage = 'en'; break;
      case 'GB': originalLanguage = 'en'; break;
      case 'IN': originalLanguage = 'hi'; break; // Hindi for India
      case 'KR': originalLanguage = 'ko'; break; // Korean
      case 'JP': originalLanguage = 'ja'; break; // Japanese
      case 'FR': originalLanguage = 'fr'; break;
      case 'ES': originalLanguage = 'es'; break;
      case 'IT': originalLanguage = 'it'; break;
      default: originalLanguage = region.toLowerCase();
    }
    
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&page=1&with_original_language=${originalLanguage}&vote_count.gte=10`
    );
    
    if (!res.ok) throw new Error(`Failed to fetch regional movies: ${res.status}`);
    const data = await res.json();
    
    // If no results found, fetch popular movies as fallback
    if (!data.results || data.results.length === 0) {
      console.log(`No movies found for region ${region}, fetching popular movies instead`);
      const fallbackRes = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
      );
      if (!fallbackRes.ok) throw new Error(`Failed to fetch fallback movies: ${fallbackRes.status}`);
      const fallbackData = await fallbackRes.json();
      return fallbackData.results?.slice(0, 5) || [];
    }
    
    return data.results?.slice(0, 5) || [];
  } catch (error) {
    console.error("Error fetching regional movies:", error);
    // Return some hardcoded movie data as last resort fallback
    return [
      { id: 1000 + Math.floor(Math.random() * 1000), title: "Sample Movie 1", poster_path: "/wwemzKWzjKYJFfCeiB57q3r4Bcm.jpg", release_date: "2023-01-01" },
      { id: 2000 + Math.floor(Math.random() * 1000), title: "Sample Movie 2", poster_path: "/A7EByudX0eOzlkQ2FIbogzyazm2.jpg", release_date: "2023-02-01" },
      { id: 3000 + Math.floor(Math.random() * 1000), title: "Sample Movie 3", poster_path: "/fiVW06jE7z9YnO4trhaMEdclSiC.jpg", release_date: "2023-03-01" },
      { id: 4000 + Math.floor(Math.random() * 1000), title: "Sample Movie 4", poster_path: "/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", release_date: "2023-04-01" },
      { id: 5000 + Math.floor(Math.random() * 1000), title: "Sample Movie 5", poster_path: "/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg", release_date: "2023-05-01" }
    ];
  }
};

// Fetch details for a specific movie or TV show by ID
export const fetchDetailsById = async (id, type = 'movie') => {
  try {
    // Fetch basic details
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}?api_key=${API_KEY}&language=en-US`
    );
    if (!detailsRes.ok) throw new Error(`Failed to fetch ${type} details: ${detailsRes.status}`);
    const details = await detailsRes.json();
    
    // Fetch external IDs (including IMDb ID)
    const externalIdsRes = await fetch(
      `https://api.themoviedb.org/3/${type}/${id}/external_ids?api_key=${API_KEY}`
    );
    if (!externalIdsRes.ok) throw new Error(`Failed to fetch external IDs: ${externalIdsRes.status}`);
    const externalIds = await externalIdsRes.json();
    
    // Return combined data
    return {
      ...details,
      externalIds,
      tmdbUrl: `https://www.themoviedb.org/${type}/${id}`,
      imdbUrl: externalIds.imdb_id ? `https://www.imdb.com/title/${externalIds.imdb_id}` : null
    };
  } catch (error) {
    console.error(`Error fetching ${type} details:`, error);
    return null;
  }
};

// Search for movies and TV shows
export const searchContent = async (query, page = 1) => {
  try {
    // Search for movies
    const movieRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );
    if (!movieRes.ok) throw new Error(`Failed to search movies: ${movieRes.status}`);
    const movieData = await movieRes.json();
    
    // Search for TV shows
    const tvRes = await fetch(
      `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=${page}&include_adult=false`
    );
    if (!tvRes.ok) throw new Error(`Failed to search TV shows: ${tvRes.status}`);
    const tvData = await tvRes.json();
    
    // Format movie results
    const movieResults = movieData.results?.map(movie => ({
      ...movie,
      media_type: 'movie',
      release_year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'
    })) || [];
    
    // Format TV results
    const tvResults = tvData.results?.map(show => ({
      ...show,
      media_type: 'tv',
      title: show.name,
      release_year: show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Unknown'
    })) || [];
    
    // Combine and sort results by popularity
    const combinedResults = [...movieResults, ...tvResults].sort((a, b) => b.popularity - a.popularity);
    
    return {
      results: combinedResults,
      total_results: movieData.total_results + tvData.total_results,
      total_pages: Math.max(movieData.total_pages, tvData.total_pages)
    };
  } catch (error) {
    console.error("Error searching content:", error);
    return { results: [], total_results: 0, total_pages: 0 };
  }
};

// Genre IDs mapping
export const genreIds = {
  Action: 28,
  Comedy: 35,
  Drama: 18,
  Horror: 27,
  Romance: 10749,
  "Sci-Fi": 878,
  Thriller: 53,
  Animation: 16,
  Documentary: 99,
  Family: 10751,
  Adventure: 12,
  Fantasy: 14,
  Mystery: 9648,
  Crime: 80
};