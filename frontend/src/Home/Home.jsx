import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://recipe-full.onrender.com/recipes/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("https://recipe-full.onrender.com/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Extract only recipe IDs
        const favoriteRecipeIds = response.data.map((fav) => fav.recipeId._id);
        setFavorites(favoriteRecipeIds);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  // Function to toggle the like button
  const toggleFavorite = async (recipeId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const response = await axios.post(
        "http://localhost:3000/favorites/toggle",
        { recipeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === "Removed from favorites") {
        setFavorites(favorites.filter((id) => id !== recipeId));
      } else {
        setFavorites([...favorites, recipeId]);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Filtering based on search input
  const filterData = data.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Pagination logic
  const recordsPerPage = 4;
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = filterData.slice(firstIndex, lastIndex);
  const totalPages = Math.ceil(filterData.length / recordsPerPage);
  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);

  return (
    <>
      <div style={{ backgroundColor: "#f0f8ff", minHeight: "100vh" }}> {/* Light blue background */}
        {/* Inspirational Quote */}
        <span
          style={{
            position: "absolute",
            top: "100px", // Adjust to avoid navbar overlap
            left: "20px",
            fontSize: "38px",
            fontWeight: "bold",
            fontFamily: "'Poppins', sans-serif",
            color: "#333",
            lineHeight: "1.3",
            letterSpacing: "1px",
          }}
        >
          <p
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              maxWidth: "50%",
              textAlign: "left",
              color: "black",
              marginLeft: "20px",
              // marginTop: "20px",
              marginBottom: "30px",
            }}
          >
            “ Unleash your culinary creativity with our Recipe app – where flavors come to life! Discover, save, and share delicious recipes, find your favorites, and make every meal an unforgettable experience. Whether you're a beginner or a seasoned chef, our app helps you cook with confidence, inspire your taste buds, and create memorable dishes every time.
            ”
          </p>
        </span>

        {/* Image on the right */}
        <img
          src="fd.webp"
          style={{
            display: "block",
            marginLeft: "auto",
            // marginTop: "50px",
            marginbottom: "1000px",
            maxWidth: "30%",
            maxHeight: "30%",
          }}
          alt="Recipe"
        />

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            style={{
              display: "block",
              margin: "20px auto",
              padding: "10px",
              width: "60%",
              borderRadius: "30px",
              border: "1px solid #ddd",
              fontSize: "16px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </div>

        {/* Recipe List */}
        <div className="row mx-4" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
          {records.length > 0 ? (
            records.map((item) => (
              <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item._id}>
                <div
                  className="card"
                  style={{
                    width: "280px",
                    height: "350px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s, box-shadow 0.3s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Link to={`recipe/${item._id}`}>
                    <img
                      src={item.image ? item.image : "istockphoto-520410807-612x612.jpg"}
                      className="card-img-top"
                      alt="Recipe"
                      style={{ height: "200px", objectFit: "cover", borderRadius: "10px" }}
                    />
                  </Link>
                  <div className="card-body" style={{ padding: "10px" }}>
                    <h5 className="card-title" style={{ fontWeight: "bold" }}>
                      {item.name}
                    </h5>
                    <p className="card-text" style={{ color: "#6c757d" }}>
                      <strong>{item.timeToCook}</strong>
                    </p>
                    <button
                      onClick={() => toggleFavorite(item._id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "24px",
                        color: favorites.includes(item._id) ? "red" : "gray",
                      }}
                    >
                      {favorites.includes(item._id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <h3>No results available</h3>
            </div>
          )}
        </div>

        {/* Pagination */}
        <nav style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                style={{
                  backgroundColor: "#00cba9",
                  borderRadius: "50%",
                  padding: "8px 12px",
                }}
              >
                Previous
              </button>
            </li>

            {pageNumbers.map((n) => (
              <li className={`page-item ${currentPage === n ? "active" : ""}`} key={n}>
                <button
                  className="page-link"
                  onClick={() => setCurrentPage(n)}
                  style={{
                    backgroundColor: currentPage === n ? "#00cba9" : "#fff",
                    borderRadius: "50%",
                    padding: "8px 12px",
                  }}
                >
                  {n}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                style={{
                  backgroundColor: "#00cba9",
                  borderRadius: "50%",
                  padding: "8px 12px",
                }}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
};
