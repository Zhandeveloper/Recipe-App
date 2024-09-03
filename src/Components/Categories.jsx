import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import back_img from '../img/back.png'
const apiURL_categories = "https://www.themealdb.com/api/json/v1/1/categories.php";

function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate(); // useNavigate hook

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(apiURL_categories);
        const data = await res.json();
        setCategories(data.categories);
      } catch (error) {
        console.error("Error fetching the categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };
  
  return (
    <div className="categories-container">
      <button onClick={handleBack} className="back-button">
        <img src={back_img} alt="back" />
        Back
      </button>
      {categories.map(category => (
        <div key={category.idCategory} className="category-card">
          <img src={category.strCategoryThumb} alt={category.strCategory} className="category-image" />
          <h3 className="category-title">{category.strCategory}</h3>
          <p className="category-description">{category.strCategoryDescription}</p>
        </div>
      ))}
    </div>
  );
}

export default Categories;
