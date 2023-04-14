import React from 'react';
import SideBar from './components/Sidebar';
import {TfiHeart} from 'react-icons/tfi';
import {BsCart2} from 'react-icons/bs';
import './App.css';

function App() {
  return (
    <div className="App" id="outer-container">
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div id="page-wrap">
      </div>
      <div>
      <h2 align="right" id="home-icons"><TfiHeart/>&emsp;<BsCart2/></h2> 
      </div>
    </div>
  );
}

export default App;
