import React from 'react';
import Landing from './HOMEPAGE/Landing.jsx';
import NgoOwner from './NGOOWNERPG/NgoOwner.jsx';
import Donor from './Donor/Donor.jsx';
import Voter from './Voter/Voter.jsx';

import {
  
    Route,
    BrowserRouter,
    Routes
  } from "react-router-dom";

  const App = () => (
    <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<Landing/>} />
      <Route path="/ngoowner" element={<NgoOwner/>} />
      <Route path="/donor" element={<Donor/>} />
      <Route path="/voter" element={<Voter/>} />

    </Routes>
    </BrowserRouter>
  );

export default App;
