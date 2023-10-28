import React, { useState } from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Home from './components/home/Home';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Posts from './components/post/Posts';
import CreatePost from './components/post/CreatePost';
import EditPost from './components/post/EditPost';
import CompletePost from './components/post/CompletePost';
import PostTemplate from './components/post/PostTemplate';
import Footer from './components/common/Footer';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  const [isAuth, setIsAuth] = useState<boolean>(Boolean(localStorage.getItem('isAuth')));

  const [photoURL, setPhotoURL] = useState<string | null>();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      setPhotoURL(auth.currentUser?.photoURL);
    } else {
      setPhotoURL(null);
    }
  });

  return (
    <Router>
      <Header isAuth={isAuth} photoURL={photoURL} />
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/posts' element={<Posts isAuth={isAuth} />}></Route>
        <Route path='/post/*' element={<PostTemplate />}></Route>
        <Route path='/create-post' element={<CreatePost isAuth={isAuth} />}></Route>
        <Route path='/edit-post/:id' element={<EditPost />}></Route>
        <Route path='/complete-post' element={<CompletePost />}></Route>
        <Route path='/complete-edit' element={<CompletePost />}></Route>
        <Route path='/profile/posts' element={<Posts isAuth={isAuth} />}></Route>
        <Route path='/login' element={<Login setIsAuth={setIsAuth} />}></Route>
        <Route path='/logout' element={<Logout setIsAuth={setIsAuth} />}></Route>
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
