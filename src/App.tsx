import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Main } from './pages/main/main';
import { Login } from './pages/login';
import { CreatePost } from './pages/createPost/createPost';
import { OwnPosts } from './pages/main/ownPosts';

import { RealNavbar } from './components/navbar';

function App() {
  return (
    <div className="App">
      <Router>
        <RealNavbar></RealNavbar>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createPost" element={<CreatePost />} />
          <Route path="/ownPosts" element={<OwnPosts />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
