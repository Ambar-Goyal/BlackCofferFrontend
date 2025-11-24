import React, { useEffect, useState } from 'react';

const Navbar = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return (
    <header className="navbar">
      <h1>Insights Data Visualization Dashboard</h1>

      <button className="theme-toggle" onClick={() => setDark(!dark)}>
        {dark ? '🌙 Dark' : '☀️ Light'}
      </button>
    </header>
  );
};

export default Navbar;
