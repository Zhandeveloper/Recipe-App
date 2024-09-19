import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Home from './Components/Home';
import Recipe from './Components/Recipe';
import Categories from './Components/Categories';
import { ThemeProvider, useTheme } from './context/ThemeContext';

function AppWrapper() {
  const { theme, setTheme, appliedTheme } = useTheme();
  const location = useLocation(); // Получаем текущий маршрут

  const handleThemeChange = (event) => {
    setTheme(event.target.value); // Устанавливаем выбранную тему
  };

  useEffect(() => {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');

    if (appliedTheme === 'dark') {
      body.classList.add('dark-theme');
    } else if (appliedTheme === 'light') {
      body.classList.add('light-theme');
    }

    // Можно также добавить обработку для "system" темы, если нужно
  }, [appliedTheme]);
  return (
    <div className={`App ${appliedTheme === 'dark' ? 'dark-theme' : 'light-theme'}`}>
      <header>
        {/* Select для выбора темы отображается только на главной странице */}
        {location.pathname === '/' && (
          <div className="theme-select">
            <select value={theme} onChange={handleThemeChange}>
            <option value="light">🌞Light</option>
              <option value="dark">🌜Dark</option>
              <option value="system">🤖System</option>
            </select>
          </div>
        )}
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/categories-food' element={<Categories />} />
        <Route path='/recipe/:id' element={<Recipe />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
