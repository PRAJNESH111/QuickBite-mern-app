import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import ShimmerCard from "../components/ShimmerCard";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Carousel from "../components/Carousel";
import apiService from "../services/apiService";

export default function Home() {
  const [foodCat, setFoodCat] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      const data = await apiService.fetchFoodData();
      setFoodItems(data[0] || []);
      setFoodCat(data[1] || []);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFoodItems();
  }, []);

  const renderShimmerCards = () => {
    return Array.from({ length: 8 }).map((_, idx) => (
      <div key={idx} className="col-12 col-md-6 col-lg-3 hai">
        <ShimmerCard />
      </div>
    ));
  };

  return (
    <div>
      <Navbar />
      <div className="w-100 pt-10">
        <Carousel onSearch={setSearch} />
        <div className="container">
          {loading ? (
            <div className="row mb-3">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <div>
                  <div className="section-title" style={{ color: "#ccc" }}>
                    Loading...
                  </div>
                  <div className="pill-divider"></div>
                </div>
              </div>
              {renderShimmerCards()}
            </div>
          ) : foodCat.length > 0 ? (
            foodCat.map((data) => (
              <div
                className="row mb-3"
                key={data._id || data.CategoryName || JSON.stringify(data)}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="section-title">{data.CategoryName}</div>
                    <div className="pill-divider"></div>
                  </div>
                  <span className="category-pill">Chef's picks</span>
                </div>
                {foodItems.length > 0 ? (
                  foodItems
                    .filter(
                      (items) =>
                        items.CategoryName === data.CategoryName &&
                        items.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((filterItems, itemIdx) => (
                      <div
                        key={
                          filterItems._id ||
                          filterItems.id ||
                          `${data.CategoryName}-${itemIdx}`
                        }
                        className="col-12 col-md-6 col-lg-3 hai"
                      >
                        <Card
                          foodName={filterItems.name}
                          item={filterItems}
                          options={filterItems.options[0]}
                          ImgSrc={filterItems.img}
                        />
                      </div>
                    ))
                ) : (
                  <div>No Such Data</div>
                )}
              </div>
            ))
          ) : (
            <div>No Categories Found</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
