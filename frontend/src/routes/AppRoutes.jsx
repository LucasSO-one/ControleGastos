import {Route, Routes} from "react-router-dom";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";

import {PrivateRoute} from "./PrivateRoute";

export function AppRoutes() {
  return (
    
    <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        {/* Rotas Protegidas */}
        <Route path="/" element={
            <PrivateRoute>
                <Dashboard/>
            </PrivateRoute>
        } />
    </Routes>
  )
}
