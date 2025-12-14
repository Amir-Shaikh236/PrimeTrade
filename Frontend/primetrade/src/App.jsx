import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Register from '@/components/register'
import Login from '@/components/login'
import Trades from '@/components/trades'

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (

    <Routes>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='/' element={
        <ProtectedRoute>
          <Trades />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App
