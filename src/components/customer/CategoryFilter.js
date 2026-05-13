import React from "react";

export default function CategoryFilter({ categories, activeCategory, onSelectCategory }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="category-scroll">
      <button 
        className={`category-pill ${activeCategory === "All" ? "active" : ""}`}
        onClick={() => onSelectCategory("All")}
      >
        All Categories
      </button>
      
      {categories.map((cat, index) => {
        // Some backends return objects, some strings
        const categoryName = typeof cat === 'object' ? cat.CategoryName : cat;
        if (!categoryName) return null;
        
        return (
          <button 
            key={index}
            className={`category-pill ${activeCategory === categoryName ? "active" : ""}`}
            onClick={() => onSelectCategory(categoryName)}
          >
            {categoryName}
          </button>
        );
      })}
    </div>
  );
}
