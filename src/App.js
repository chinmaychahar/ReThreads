import React from 'react';
import './App.css';
import Banner from './components/banner/'
import { BrowserRouter,Routes, Route } from "react-router-dom";
import featureSec from './components/featureSection/section.js';

function App() {

  return (
    <div >
      <Banner />
    </div>
  );
}

export default App;
