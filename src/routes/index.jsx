import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Game from "../pages/Game/index.jsx";
const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Game />} />
        </Routes>
    );
}

export default AppRoutes;
