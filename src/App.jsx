
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import CreateBlog from "./Pages/CreateBlog";
import Login from "./Pages/Login";
import { signOut } from "firebase/auth";
import { auth, db } from "./firebase-config";
import MyPosts from "./Pages/Post";
import { FaHome } from "react-icons/fa";
import { IoIosLogOut, IoIosAddCircle, IoIosLogIn } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import "./App.css";
import SavedPost from "./Pages/SavedPost";
import { useAppContext } from './Pages/AppContext';

function App() {
//   const [isAuth, setIsAuth] = useState(() => localStorage.getItem("isAuthBlog") === "true");
  const { isAuth, setIsAuth } = useAppContext();

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear();
      setIsAuth(false);
      window.location.pathname = "/login";
    });
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/myposts/:id" element={<MyPosts />} />
          <Route path="/savedpost" element={<SavedPost />} />
          <Route path="/createBlog" element={<CreateBlog />} />
          <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        </Routes>

        <div className="AppFixedMenu">
          <ul>
            <Link to="/">
              <FaHome />
            </Link>
            {console.log(isAuth)}
            {!isAuth ? (
              <Link to="/login">
                <IoIosLogIn />
              </Link>
            ) : (
              <div style={{ display: "flex", gap: "30px" }}>
                <Link to="/savedpost">
                  <FaRegBookmark className="bookmark3" />
                </Link>
            
                <Link to="/createblog">
                  <IoIosAddCircle />
                </Link>
                
                <Link to="/logout" onClick={signUserOut}>
                  <IoIosLogOut />
                </Link>
                <Link>
                  <img
                    className="fixedMenuUserPhoto"
                    src={localStorage.getItem("userPhotoUrl")}
                    alt=""
                  />
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </Router>
  );
}

export default App;
