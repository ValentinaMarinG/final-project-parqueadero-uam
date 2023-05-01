// import './App.scss';

// function App() {
//   return (
//     <div className="App">
//       <h1>Inicialization of the parqueadero UAM 's front-end structure</h1>
//     </div>
//   );
// }

// export default App;

import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import allRoutesProject from "./config/routes";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {allRoutesProject.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              <route.layout>
                <route.component />
              </route.layout>
            }
          ></Route>
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
