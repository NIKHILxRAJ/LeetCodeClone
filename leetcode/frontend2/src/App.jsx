import { Routes, Route, Navigate } from "react-router";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import Adminpanel from "./pages/adminpanel";
import Problem from "./pages/problem";


import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./authslice"; // example



function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);
 

  return (
    
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? <Homepage /> : <Navigate to="/signup" />
          }
        />

        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Login />
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" /> : <Signup />
          }
        />
      
 
  
  <Route path="/admin" element={<Adminpanel />} />
    <Route path="/problem/:problemId" element={<Problem/>}/>
</Routes>
  
        
  );
}

export default App;
