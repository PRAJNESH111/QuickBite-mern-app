import React, { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import HeroBanner from "../../components/customer/HeroBanner";
import CategoryFilter from "../../components/customer/CategoryFilter";
import FoodCard from "../../components/customer/FoodCard";
import api from "../../services/api";

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await api.fetchFoodData();
        setFoodItems(data[0] || []);
        
        // Ensure categories list has 'All' implicitly
        const categories = data[1] || [];
        setFoodCat(categories);
      } catch (error) {
        console.error("Failed to load food items", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredItems = foodItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                       (item.description && item.description.toLowerCase().includes(search.toLowerCase()));
    const matchCategory = activeCategory === "All" || item.CategoryName === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="page-container">
      <Navbar />
      
      <div className="page-content">
        <HeroBanner />

        <div className="section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h2 className="section-title">Explore Menu</h2>
            <div className="section-divider"></div>
          </div>
          
          <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>
            <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "1rem" }}>🔍</span>
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: "40px" }}
              placeholder="Search dishes..."
              value={search}
              onChange={handleSearch}
            />
          </div>
        </div>

        <CategoryFilter 
          categories={foodCat} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />

        {loading ? (
          <div className="food-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card shimmer" style={{ height: "350px", borderRadius: "16px" }}></div>
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="food-grid">
            {filteredItems.map((item) => (
              <FoodCard key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3 className="empty-state-title">No dishes found</h3>
            <p className="empty-state-text">
              We couldn't find any items matching your search or category filter.
            </p>
            <button className="btn-secondary" style={{ marginTop: "16px" }} onClick={() => { setSearch(""); setActiveCategory("All"); }}>
              Clear Filters
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
