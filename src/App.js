import React from 'react';
import SideBar from './components/Sidebar';
import './App.css';

function App() {
  return (
    <div className="App" id="outer-container">
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div id="page-wrap">
        <h1>ReThreads 🌸</h1>
      </div>
    </div>
  );
}

export default App;
