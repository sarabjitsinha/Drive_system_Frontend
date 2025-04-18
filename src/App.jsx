import React from 'react';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import { AuthProvider } from './contexts/Authcontext';
import CreatePath from './pages/Createpath';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Link to={"/"}>Home</Link>
        <Link to={"/login"}>Login</Link>
        {/* <Dashboard/> */}
      {/* <Login/> */}
      <Signup/>
      <Upload/>
      {/* <CreatePath/> */}

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Upload />} />
          <Route path='/createpath' element={<CreatePath/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
