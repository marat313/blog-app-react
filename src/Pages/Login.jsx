import React from 'react';
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';

export default function Login({ setIsAuth }) {
  let navigate = useNavigate();

  const signInWithGoogle = () => {
    signInWithPopup(auth, provider).then((result) => {
      localStorage.setItem("userName", result.user.displayName)
      localStorage.setItem("userPhotoUrl",  result.user.photoURL)
      localStorage.setItem("isAuthBlog", true);
      setIsAuth(true); // Move this line after setting local storage
      navigate("/");
    });
  };

  return (
    <div className="loginPage">
      <h2>Войти с помощью Google аккаунта</h2>
      <Button size="large" 
              sx={{mt: "20px", fontWeight: "bold"}}
              variant="outlined" 
              className="login-with-google-btn" 
              onClick={signInWithGoogle}>
        Войти
      </Button>
    </div>
  );
}
