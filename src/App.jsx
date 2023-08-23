import {  useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Pages/Home";
import CreateBlog from "./Pages/CreateBlog";
import Login from "./Pages/Login";
import { signOut } from "firebase/auth";
import { auth } from "./firebase-config";
import PrivatePost from "./Pages/PrivatePost";
import MyPosts from "./Pages/MyPosts";
import { FaBars, FaTimes } from "react-icons/fa";
import "./App.css";

function App() {
      const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuthBlog"));
      const [isNavExpanded, setIsNavExpanded] = useState(false);
      console.log(isAuth);

      const signUserOut = () => {
            signOut(auth).then(() => {
                  localStorage.clear();
                  setIsAuth(false);
                  window.location.pathname = "/login";
            });
      };

      const toggleMenu = () => {
            setIsNavExpanded(!isNavExpanded)
          };

      

      return (
            <Router>


                  {/* ============================================== */}
                  
                    <nav className="navigation">
                        <Link style={{textDecoration: "none"}} to="/">
                              <i className="aRrow fa-solid fa-arrow-left"> </i>
                        </Link>

                        <a href="#" className="logoText">
                              {" "}
                              <span> Road to the</span>
                              <br />
                              <span>dream</span>
                        </a>

                        <button
                              className="hamburger"
                              onClick={toggleMenu}
                        >
                              <i className="fa-solid fa-bars"></i>
                        </button>

                        <div
                              className={
                                    isNavExpanded
                                          ? "navigation-menu expanded"
                                          : "navigation-menu"
                              }
                        >
                              <ul className="domoi">
                                    <li>
                                          {" "}
                                          <Link to="/">Главная</Link>{" "}
                                    </li>

                                    {!isAuth ? (
                                          <li>
                                                {" "}
                                                <Link to="/login">
                                                      Войти
                                                </Link>{" "}
                                          </li>
                                    ) : (
                                          <ul>
                                                <li>
                                                      <Link to="/createblog">
                                                            Создать пост
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link
                                                            onClick={
                                                                  signUserOut
                                                            }
                                                      >
                                                            {" "}
                                                            Выйти
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link>
                                                            {" "}
                                                            {localStorage.getItem(
                                                                  "userName"
                                                            )}
                                                      </Link>
                                                </li>
                                                <li>
                                                      <Link>
                                                            {" "}
                                                            <img
                                                                  className="photoUser"
                                                                  src={localStorage.getItem(
                                                                        "userPhotoUrl"
                                                                  )}
                                                                  alt=""
                                                            />{" "}
                                                      </Link>
                                                </li>
                                          </ul>
                                    )}
                              </ul>
                        </div>
                  </nav> 

{/*                   <nav className="mobileNav">
                        <ul>
                              <li>Главная</li>
                              <li>Создать пост</li>
                              <li>Выйти</li>
                              <li>Войти</li>
                        </ul>
                  </nav>  */}

                  <div className="App">
                        <Routes>
                              <Route
                                    path="/"
                                    element={<Home isAuth={isAuth} />}
                              />
                              <Route
                                    path="/privatepost"
                                    element={<PrivatePost isAuth={isAuth} />}
                              />
                              <Route
                                    path="/myposts/:id"
                                    element={<MyPosts />}
                              />
                              <Route
                                    path="/createBlog"
                                    element={<CreateBlog isAuth={isAuth} />}
                              />
                              <Route
                                    path="/login"
                                    element={<Login setIsAuth={setIsAuth} />}
                              />
                        </Routes>
                  </div>
            </Router>
      );
}

export default App;
