import React from 'react';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';

const App = () => {
  return (
    <DataProvider>
      <Layout />
    </DataProvider>
  );
};

export default App;
