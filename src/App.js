import React from 'react';
import './App.css';
import Appbar from './components/header/Appbar';
import Banner from './components/banner/'
import ShopByDisabilityCarousel from './components/Carousel/Carousel.jsx';
import TopFeaturesCarousel from './components/Top-Featured/Top-Featured';
function App() {

  return (
    <div >
      <Appbar position="sticky" />
      <Banner />
      <ShopByDisabilityCarousel/>
      <TopFeaturesCarousel/>
 
      
    </div>
  );
}

export default App;
