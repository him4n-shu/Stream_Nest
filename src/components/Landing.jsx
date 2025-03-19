import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "../styles/Landing.css";
import { fetchMovies } from "../tmdbApi";
import Navbar from "./Navbar";

const Landing = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    const loadFeaturedMovies = async () => {
      try {
        const movies = await fetchMovies();
        if (movies && movies.length > 0) {
          setFeaturedMovies(movies);
          console.log('Featured movies loaded:', movies);
        }
      } catch (error) {
        console.error("Error loading featured movies:", error);
      }
    };
    
    loadFeaturedMovies();
  }, []);
  
  const nextSlide = useCallback(() => {
    if (featuredMovies.length <= 1 || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredMovies.length);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [featuredMovies.length, isTransitioning]);
  
  const prevSlide = useCallback(() => {
    if (featuredMovies.length <= 1 || isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? featuredMovies.length - 1 : prevIndex - 1
    );
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  }, [featuredMovies.length, isTransitioning]);
  
  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
  };
  
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(slideInterval);
  }, [featuredMovies.length, nextSlide]);

  const ottPlatforms = [
    { id: 'netflix', name: 'Netflix', logo: '/ott-platform-logo/netflix-logo.png' },
    { id: 'prime', name: 'Prime Video', logo: '/ott-platform-logo/prime-video.png' },
    { id: 'disney', name: 'Disney+', logo: '/ott-platform-logo/disney +.png' },
    { id: 'hulu', name: 'Hulu', logo: '/ott-platform-logo/hulu.png' },
    { id: 'hbo', name: 'HBO Max', logo: '/ott-platform-logo/hbo-max.png' },
    { id: 'apple', name: 'Apple TV+', logo: '/ott-platform-logo/apple-tv+.png' },
    { id: 'paramount', name: 'Paramount+', logo: '/ott-platform-logo/paramount +.png' },
    { id: 'peacock', name: 'Peacock', logo: '/ott-platform-logo/peacock.png' },
    { id: 'crunchyroll', name: 'Crunchyroll', logo: '/ott-platform-logo/crunchyroll.png' },
  ];

  return (
    <div className="landing-container">
      <Navbar />
      
      <div className="watch-everywhere-section">
        <div className="watch-everywhere-content">
          <h1 className="watch-everywhere-title">Watch Everywhere<br />You Go!</h1>
          <p className="watch-everywhere-subtitle">Watch Free Movies & TV Shows</p>
          
          <div className="ott-platforms-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px',
            margin: '20px 0'
          }}>
            {ottPlatforms.map(platform => (
              <Link 
                key={platform.id} 
                to={`/platform/${platform.id}`} 
                className="ott-platform-logo flex items-center justify-center transition-all"
                style={{ 
                  backgroundColor: '#ffffff',
                  padding: '10px',
                  borderRadius: '10px',
                  minWidth: '90px', 
                  minHeight: '60px', 
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.7)',
                  border: '2px solid rgba(255, 255, 255, 0.5)'
                }}
              >
                <img 
                  src={platform.logo} 
                  alt={platform.name} 
                  style={{ 
                    height: '30px',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
                  }}
                />
              </Link>
            ))}
          </div>
        </div>
        
        <div className="featured-movies-carousel">
          <div className="featured-movies-slider">
            {featuredMovies.map((movie, index) => (
              <div 
                key={movie.id}
                className={`featured-movie-display ${index === currentIndex ? 'active' : ''}`}
                style={{
                  backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  opacity: index === currentIndex ? 1 : 0.5,
                  transition: 'all 0.5s ease-in-out'
                }}
              >
                <div className="featured-movie-header">
                  <div className="now-streaming-section">
                    <h3 className="now-streaming-text">NOW STREAMING</h3>
                    <div className="streaming-platform">
                      <span className="platform-divider">|</span>
                      <img src="/Logo-1.png" alt="StreamNest" className="platform-logo" />
                    </div>
                  </div>
                  
                  <h2 className="featured-movie-title">{movie.title}</h2>
                  <div className="featured-movie-meta">
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                    <span className="duration">1h 46m</span>
                    <div className="rating-stars">
                      <span>★★★★★</span>
                    </div>
                  </div>
                  <p className="featured-movie-description">
                    {movie.overview.substring(0, 150)}...
                  </p>
                  
                  <Link
                    to={`/watch/${movie.id}`}
                    state={{
                      title: movie.title,
                      posterPath: movie.poster_path,
                      type: "Movie",
                      releaseYear: new Date(movie.release_date).getFullYear()
                    }}
                    className="watch-now-button"
                  >
                    Watch Now
                  </Link>
                </div>
              </div>
            ))}
            
            {featuredMovies.length > 1 && (
              <div className="slider-controls">
                <button className="slider-arrow prev" onClick={prevSlide}>
                  &#10094;
                </button>
                <div className="slider-dots">
                  {featuredMovies.map((_, index) => (
                    <button 
                      key={index} 
                      className={`slider-dot ${index === currentIndex ? 'active' : ''}`}
                      onClick={() => goToSlide(index)}
                    />
                  ))}
                </div>
                <button className="slider-arrow next" onClick={nextSlide}>
                  &#10095;
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
