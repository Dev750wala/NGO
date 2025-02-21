import React from 'react';
import Landing from './HOMEPAGE/Landing.jsx';


import {
  
    Route,
    BrowserRouter,
    Routes
  } from "react-router-dom";

  const App = () => (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Landing/>} />
      
    </Routes>
    </BrowserRouter>
  );

export default App;
