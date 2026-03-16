import { Routes, Route, Navigate } from "react-router-dom";
import LoanList from "./pages/LoanList/LoanList";
import LoanDetail from "./pages/LoanDetail/LoanDetail";
import ToastProvider from "./components/ToastProvider";

export default function App() {
  return (
    <>
      <ToastProvider />
      <Routes>
        <Route path="/loans" element={<LoanList />} />
        <Route path="/loan/:id" element={<LoanDetail />} />
        <Route path="*" element={<Navigate to="/loans" replace />} />
      </Routes>
    </>
  );
}
