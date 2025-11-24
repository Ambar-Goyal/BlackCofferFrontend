import React from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';

const Layout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="app-main">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default Layout;
