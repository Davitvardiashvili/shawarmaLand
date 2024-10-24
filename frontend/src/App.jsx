// App.js
import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import PrivateRoutes from './AdminPages/PrivateRoutes';
import LogIn from './Pages/LogIn';
import Home from './Pages/Home';
import Footer from './components/Footer';
import NavBar from './components/Navbar';
import BranchesPage from './pagestrash/BranchesPage';
import CategoriesPage from './pagestrash/CategoriesPage';
import ProductsPage from './pagestrash/ProductsPage';
import PublicPage from './pagestrash/PublicPage';
import UsersListPage from './pagestrash/UsersListPage';
import UserCreatePage from './pagestrash/UserCreatePage';

function App() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === '/';

  return (
    <>
      {!hideNavAndFooter && <NavBar />}
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/admin" element={<PublicPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route exact path="/users" element={<UsersListPage />} />
          <Route path="/users/create" element={< UserCreatePage />} />
        </Route>
        <Route path="/login" element={<LogIn />} />
        <Route path="/" element={<PublicPage />} />
      </Routes>
      {!hideNavAndFooter && <Footer />}
    </>
  );
}

export default App;
