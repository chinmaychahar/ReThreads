import React from 'react';
import './App.css';
import Appbar from './components/header/Appbar';
import Banner from './components/banner/'
function App() {

  return (
    <div >
      <Appbar position="sticky" />
      <Banner />
      
    </div>
  );
}

export default App;
