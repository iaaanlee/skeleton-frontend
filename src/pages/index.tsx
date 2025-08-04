import { Navigate, Route, Routes } from "react-router-dom";
import { MainPage } from "./main";

export const MainServiceRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/main" />} />
            <Route path="/main" element={<MainPage />} />
        </Routes>
    )
}