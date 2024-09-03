import './App.css'
import { useState, useEffect } from 'react';
import SearchBar from './Components/SearchBar';
import RecipeCard from './Components/RecipeCard';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Components/Home';
import Recipe from './Components/Recipe';
import Categories from './Components/Categories';

const apiURL = "https://www.themealdb.com/api/json/v1/1/search.php?s="

function App() {
  return (
    <BrowserRouter>
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/categories-food' element={<Categories/>}/>
        <Route path='/recipe/:id' element={<Recipe/>}/>
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
