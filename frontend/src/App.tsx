import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./HOMEPAGE/Landing";
import NgoOwner from "./NGOOWNERPG/NgoOwner";
import Donor from "./Donor/Donor";
import Voter from "./Voter/Voter";
import CreateNgo from "./NGOOWNERPG/CreateNgo";
import ViewNgo from "./NGOOWNERPG/ViewNgo";
import Participate from "./Donor/Participate";
import Form from "./HOMEPAGE/Form";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ngoowner" element={<NgoOwner />} />
        <Route path="/donor" element={<Donor />} />
        <Route path="/voter" element={<Voter />} />
        <Route path="/create-ngo" element={<CreateNgo />} />
        <Route path="/view-ngo" element={<ViewNgo />} />
       <Route path="/participate" element={<Participate/>} />
       <Route path="/form" element={<Form/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;