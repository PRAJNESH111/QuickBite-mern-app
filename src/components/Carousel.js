import React, { useState, useEffect } from "react";

export default function Carousel({ onSearch }) {
  const [search, setSearch] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Delicious Pizza",
      image: "/img1.svg",
      color: "#FF6B6B",
    },
    {
      id: 2,
      title: "Momos Special",
      image: "/img2.svg",
      color: "#FFA500",
    },
    {
      id: 3,
      title: "Fresh Burgers",
      image: "/img3.svg",
      color: "#CB202D",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(search);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    if (onSearch) {
      onSearch("");
    }
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="new-carousel-container">
      {/* Slides */}
      <div className="slides-wrapper">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`slide ${index === currentSlide ? "active" : ""}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              opacity: index === currentSlide ? 1 : 0,
              visibility: index === currentSlide ? "visible" : "hidden",
            }}
          >
            <div className="slide-overlay"></div>
          </div>
        ))}
      </div>

      {/* Content - Title & Search */}
      <div className="carousel-content">
        <h1 className="carousel-main-title">Order Your Favorite Food</h1>

        <form className="carousel-search-form" onSubmit={handleSearch}>
          <div className="search-input-wrapper">
            <i className="fas fa-search search-icon"></i>
            <input
              type="text"
              className="carousel-search-input"
              placeholder="Search for dishes, cuisines or restaurants"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
              autoComplete="off"
            />
            {search && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={handleClearSearch}
              >
                ✕
              </button>
            )}
          </div>
        </form>

        {/* Slide Indicators */}
        <div className="slide-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button className="carousel-arrow prev-arrow" onClick={handlePrev}>
        <i className="fas fa-chevron-left"></i>
      </button>
      <button className="carousel-arrow next-arrow" onClick={handleNext}>
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
}
