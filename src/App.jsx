import React from 'react';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import { AuthProvider } from './contexts/Authcontext';
import CreatePath from './pages/Createpath';
import Headers from './pages/Headers';

function App() {

  
  return (
    <AuthProvider>
          <Router>
      <Headers/>
          <Routes>
          <Route path="/" element={[<Upload key={0}/>,<Dashboard key={1}/>]} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path='/createpath' element={<CreatePath/>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
