import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Genre from "./pages/Genre";
import Country from "./pages/Country";
import Kid from "./pages/Kid";
import TVSeries from "./pages/TVSeries";
import Watch from "./pages/Watch";
import Search from "./pages/Search";
import Platform from "./pages/Platform";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/genre" element={<Genre />} />
        <Route path="/country" element={<Country />} />
        <Route path="/kid" element={<Kid />} />
        <Route path="/tv-series" element={<TVSeries />} />
        <Route path="/watch/:id" element={<Watch />} />
        <Route path="/search" element={<Search />} />
        <Route path="/platform/:platformId" element={<Platform />} />
      </Routes>
    </div>
  );
}

export default App;