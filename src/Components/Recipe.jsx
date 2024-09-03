import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cook_img from "../img/cook.png"
import back_img from '../img/back.png'
const apiURL = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

const Recipe = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // useNavigate hook
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(apiURL + id);
        const data = await res.json();
        setRecipe(data.meals[0]);
      } catch (error) {
        console.error("Error fetching the recipe details:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <p>Loading...</p>;
  }

  // Преобразование ссылки на YouTube в формат для вставки в iframe
  const embedUrl = recipe.strYoutube ? recipe.strYoutube.replace("watch?v=", "embed/") : null;

  // Создание массива ингредиентов и их количества
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`] || "Неизвестно";
    if (ingredient) {
      ingredients.push(`${ingredient} - ${measure}`);
    }
  }

  // Handle back navigation
  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="recipe">
      {/* Back Button */}
      <button onClick={handleBack} className="back-button">
      <img src={back_img} alt="back_img" />
                 Back
      </button>
      <div className="recipe-section">
        <h1>{recipe.strMeal}</h1>
        <div className='recipe-box'>
          <img src={recipe.strMealThumb} alt={recipe.strMeal} />

          <div className="recipe-details">
            <h2><span>Category</span> - {recipe.strCategory}</h2>
            <h2><span>Country of origin</span> - {recipe.strArea}</h2>
            <h2><span>Recipe Source</span> - <a href={recipe.strSource} target='_blank' rel="noopener noreferrer">link</a></h2>
            <hr />
            <h1>Ingridients</h1>
            {/* Вывод списка ингредиентов и их количества */}
            {ingredients.map((item, index) => {
              const [ingredient, measure] = item.split(" - ");
              return (
                <p className='ingridient' key={index}>
                  <span>{ingredient}</span> - {measure}
                </p>
              );
            })}
            
          </div>

        </div>
        <div className="instruction">
            <h1>Instruction</h1>
            <p>{recipe.strInstructions}</p>
          </div>
      </div>

      <div className="guide">
        {/* Проверка на наличие ссылки на YouTube */}
        {embedUrl ? (
          <>
            <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer">Guide</a>
            <iframe
              className='video-player'
              src={embedUrl}
              title="Recipe Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </>
        ) : (
          <p>Видео не найдено</p>
        )}
        
      </div>
      
       <footer>
       <img src={cook_img} alt="cook" />               <h2>Enjoy your meal!</h2>
       </footer>
    </div>
  );
};

export default Recipe;
