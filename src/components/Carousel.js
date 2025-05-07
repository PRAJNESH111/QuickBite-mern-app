import React, { useState } from "react";

export default function Carousel({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(search);
    }
  };

  const handleClearSearch = () => {
    setSearch("");
    if (onSearch) {
      onSearch(""); // Reset search to show all items
    }
  };

  return (
    <div className="mb-4" style={{ maxHeight: '350px', overflow: 'hidden' }}>
      <div
        id="carouselExampleFade"
        className="carousel slide carousel-fade bg-success"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-caption" style={{ zIndex: "9" }}>
            <form className="d-flex justify-content-center" onSubmit={handleSearch}>
              <input
                className="form-control me-2 bg-white text-dark"
                style={{ minWidth: 0, width: '450px', borderRadius: '20px' }}
                type="text"
                placeholder="Search here..."
                aria-label="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
              />


              <button
                className="btn btn-outline-secondary me-2"
                type="button"
                onClick={handleClearSearch}
                style={{ visibility: search ? 'visible' : 'hidden', borderRadius: '20px' }}
              >
                ❌
              </button>
            </form>
          </div>
          <div className="carousel-item active" data-bs-interval="3000">
            <img src="/pizza.jpg" className="d-block w-100" style={{ height: '350px', objectFit: 'cover', filter: 'brightness(30%)' }} alt="Pizza" />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img src="/momos.jpg" className="d-block w-100" style={{ height: '350px', objectFit: 'cover', filter: 'brightness(30%)' }} alt="Momos" />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img src="/burger.jpg" className="d-block w-100" style={{ height: '350px', objectFit: 'cover', filter: 'brightness(30%)' }} alt="Burger" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
