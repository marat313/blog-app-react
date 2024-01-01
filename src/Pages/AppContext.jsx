// В файле, например, AppContext.js
import { createContext, useContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuthBlog"));
  const [savedPosts, setSavedPosts] = useState([]);

  const contextValue = {
    isAuth,
    setIsAuth,
    savedPosts,
    setSavedPosts,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
