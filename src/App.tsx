import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import MedicationsPage from './pages/MedicationsPage';
import AddMedicationPage from './pages/AddMedicationPage';
import HistoryPage from './pages/HistoryPage';
import PharmaciesPage from './pages/PharmaciesPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/medications" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/medications" element={<MedicationsPage />} />
        <Route path="/medications/new" element={<AddMedicationPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/pharmacies" element={<PharmaciesPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}