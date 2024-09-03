import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import cook_img from '../img/cook.png'
import logo_img from '../img/logo.png'
const apiURL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
const categoryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";
const countryURL = "https://www.themealdb.com/api/json/v1/1/filter.php?a=";
const ingredientURL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
const randomURL = "https://www.themealdb.com/api/json/v1/1/random.php";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [ingredient, setIngredient] = useState(""); // New state for main ingredient
  const [recipes, setRecipes] = useState([]);
  const navigate = useNavigate();

  // Function to search and filter recipes
  const searchRecipes = async (e) => {
    e && e.preventDefault();
    setIsLoading(true);
    try {
      let url = apiURL + query;
      let result = [];

      if (country && category && ingredient) {
        const countryRes = await fetch(countryURL + country);
        const countryData = await countryRes.json();
        const categoryRes = await fetch(categoryURL + category);
        const categoryData = await categoryRes.json();
        const ingredientRes = await fetch(ingredientURL + ingredient);
        const ingredientData = await ingredientRes.json();
        
        const countryMeals = countryData.meals || [];
        const categoryMeals = categoryData.meals || [];
        const ingredientMeals = ingredientData.meals || [];
        
        result = countryMeals.filter(meal => 
          categoryMeals.some(catMeal => catMeal.idMeal === meal.idMeal) &&
          ingredientMeals.some(ingMeal => ingMeal.idMeal === meal.idMeal)
        );
      } else if (country && category) {
        const countryRes = await fetch(countryURL + country);
        const countryData = await countryRes.json();
        const categoryRes = await fetch(categoryURL + category);
        const categoryData = await categoryRes.json();
        
        const countryMeals = countryData.meals || [];
        const categoryMeals = categoryData.meals || [];
        
        result = countryMeals.filter(meal => 
          categoryMeals.some(catMeal => catMeal.idMeal === meal.idMeal)
        );
      } else if (country && ingredient) {
        const countryRes = await fetch(countryURL + country);
        const countryData = await countryRes.json();
        const ingredientRes = await fetch(ingredientURL + ingredient);
        const ingredientData = await ingredientRes.json();
        
        const countryMeals = countryData.meals || [];
        const ingredientMeals = ingredientData.meals || [];
        
        result = countryMeals.filter(meal => 
          ingredientMeals.some(ingMeal => ingMeal.idMeal === meal.idMeal)
        );
      } else if (category && ingredient) {
        const categoryRes = await fetch(categoryURL + category);
        const categoryData = await categoryRes.json();
        const ingredientRes = await fetch(ingredientURL + ingredient);
        const ingredientData = await ingredientRes.json();
        
        const categoryMeals = categoryData.meals || [];
        const ingredientMeals = ingredientData.meals || [];
        
        result = categoryMeals.filter(meal => 
          ingredientMeals.some(ingMeal => ingMeal.idMeal === meal.idMeal)
        );
      } else if (country) {
        const res = await fetch(countryURL + country);
        const data = await res.json();
        result = data.meals || [];
      } else if (category) {
        const res = await fetch(categoryURL + category);
        const data = await res.json();
        result = data.meals || [];
      } else if (ingredient) {
        const res = await fetch(ingredientURL + ingredient);
        const data = await res.json();
        result = data.meals || [];
      } else {
        const res = await fetch(url);
        const data = await res.json();
        result = data.meals || [];
      }

      // Save recipes to localStorage
      localStorage.setItem('savedRecipes', JSON.stringify(result));
      setRecipes(result);
    } catch (error) {
      console.error("Error fetching the recipes:", error);
      setRecipes([]);
    }
    setIsLoading(false);
  };

  // Use useEffect to load data on initial load
  useEffect(() => {
    const savedCountry = localStorage.getItem('selectedCountry');
    const savedCategory = localStorage.getItem('selectedCategory');
    const savedIngredient = localStorage.getItem('selectedIngredient'); // Load saved ingredient
    const savedRecipes = localStorage.getItem('savedRecipes'); // Load saved recipes

    if (savedCountry) {
      setCountry(savedCountry);
    }
    if (savedCategory) {
      setCategory(savedCategory);
    }
    if (savedIngredient) {
      setIngredient(savedIngredient); // Set saved ingredient
    }

    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    } else {
      searchRecipes();
    }
  }, []);

  // Function to save current filters and navigate to the recipe
  const handleRecipeClick = (idMeal) => {
    localStorage.setItem('selectedCountry', country);
    localStorage.setItem('selectedCategory', category);
    localStorage.setItem('selectedIngredient', ingredient);
    navigate(`/recipe/${idMeal}`);
  };

  // Function to clear filters and localStorage
  const clearFilters = () => {
    localStorage.removeItem('selectedCountry');
    localStorage.removeItem('selectedCategory');
    localStorage.removeItem('selectedIngredient'); // Clear saved ingredient
    localStorage.removeItem('savedRecipes'); // Clear saved recipes
    setCountry("");
    setCategory("");
    setIngredient(""); // Clear ingredient
    searchRecipes();
  };

  // Function to fetch and navigate to a random recipe
  const handleRandomRecipe = async () => {
    try {
      const res = await fetch(randomURL);
      const data = await res.json();
      const randomRecipeId = data.meals[0].idMeal;
      navigate(`/recipe/${randomRecipeId}`);
    } catch (error) {
      console.error("Error fetching a random recipe:", error);
    }
  };

  return (
    <div className="RecipeSearchHome">
      <h1 className='welcome'>Welcome to Recipe Finder</h1>
      
      <form onSubmit={searchRecipes}>
        <button
          type="button" // Изменили тип кнопки на "button", чтобы она не отправляла форму
          onClick={() => navigate('/categories-food')}
        >
          View Categories
        </button>
        <input
          className="input-search"
          value={query}
          disabled={isLoading}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search recipe'
        />
        <input
          className="input-ingredient"
          value={ingredient}
          disabled={isLoading}
          onChange={(e) => setIngredient(e.target.value)}
          placeholder='Main Ingredient'
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Country</option>
          <option value="Canadian">Canadian</option>
          <option value="Italian">Italian</option>
          <option value="Chinese">Chinese</option>
          <option value="American">American</option>
          <option value="Turkish">Turkish</option>
          <option value="British">British</option>
          <option value="Croatian">Croatian</option>
          <option value="Dutch">Dutch</option>
          <option value="Egyptian">Egyptian</option>
          <option value="Filipino">Filipino</option>
          <option value="French">French</option>
          <option value="Greek">Greek</option>
          <option value="Indian">Indian</option>
          <option value="Irish">Irish</option>
          <option value="Jamaican">Jamaican</option>
          <option value="Kenyan">Kenyan</option>
          <option value="Malaysian">Malaysian</option>
          <option value="Mexican">Mexican</option>
          <option value="Moroccan">Moroccan</option>
          <option value="Polish">Polish</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Spanish">Spanish</option>
          <option value="Thai">Thai</option>
          <option value="Tunisian">Tunisian</option>
          <option value="Ukrainian">Ukrainian</option>
          <option value="Vietnamese">Vietnamese</option>
          {/* Add countries here */}
        </select>
        <select 
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={isLoading}
        >
          <option value="">Category</option>
          <option value="Seafood">Seafood</option>
          <option value="Dessert">Dessert</option>
          <option value="Beef">Beef</option>
          <option value="Chicken">Chicken</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Lamb">Lamb</option>
          <option value="Miscellaneous">Miscellaneous</option>
          <option value="Pasta">Pasta</option>
          <option value="Pork">Pork</option>
          <option value="Side">Side</option>
          <option value="Starter">Starter</option>
          <option value="Vegan">Vegan</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Goat">Goat</option>
        </select>
        <button
          className='btn-search'
          type="submit"
          disabled={isLoading || (!query && !country && !category && !ingredient)}
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
        <button
          type="button"
          onClick={clearFilters}
          disabled={isLoading}
        >
          Clear Filters
        </button>
        <button
          type="button"
          onClick={handleRandomRecipe}
          disabled={isLoading}
        >
          Show Random Recipe
        </button>
      </form>

      <div className='recipes'>
        {isLoading && <p>Loading recipes...</p>}
        {!isLoading && recipes.length === 0 && <p>No recipes found.</p>}
        {recipes && recipes.map(recipe => (
          <div key={recipe.idMeal} className='card'>
            <h1>{recipe.strMeal}</h1>
            <h4 className='category'>{recipe.strCategory}</h4>
            <img
              className='card-img'
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
            />
            <button
              onClick={() => handleRecipeClick(recipe.idMeal)}
              className='ingredients'
              disabled={isLoading}
            >
              Ingredients
            </button>
          </div>
        ))}
      </div>
      <footer>
        <img src={cook_img} alt="cook" />
        <h3>Author - <a href='https://t.me/Zhan2018' target='_blank'>© Zhan 2024</a></h3>
        <h3>Api site - <a href='https://www.themealdb.com/' target='_blank'>MealDB</a></h3>
        <img src="https://www.themealdb.com/images/meal-icon.png" alt="ramen"/>
      </footer>
    </div>
  );
};

export default Home;
