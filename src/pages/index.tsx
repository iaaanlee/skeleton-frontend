import { Navigate, Route, Routes } from "react-router-dom";

export const MainServiceRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/main" />} />
            <Route path="/main" element={<MainServiceRoute />} />
        </Routes>
    )
}