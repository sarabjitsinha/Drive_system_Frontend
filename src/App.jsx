import React from 'react';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';
import Login from './withAuth/Login';
import Signup from './withAuth/Signup';
import Dashboard from './withAuth/Dashboard';
import Upload from './withAuth/Upload';
import { AuthProvider } from './contexts/Authcontext';
import Headers from './components/Headers';

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
          </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
