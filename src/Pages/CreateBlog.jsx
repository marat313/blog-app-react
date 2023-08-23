import React, { useState, useEffect } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";

function CreateBlog({ isAuth }) {
      const [title, setTitle] = useState("");
      const [photoLink, setPhotoLink] = useState("");
      const [postText, setPostText] = useState("");
      const [postDate, setpostDate] = useState("");

      const postsCollectionRef = collection(db, "post");
      const privatePostsCollectionRef = collection(db, "privatePost");
      let navigate = useNavigate();
      const createPost = async () => {
            if (title == "" || postText == "") {
                  alert("Поле не может быть пустым");
                  console.log("Поле не может быть пустым");
                  return false;
            } else {
                  await addDoc(postsCollectionRef, {
                        title,
                        photoLink,
                        postText,
                        postDate,
                        author: {
                              name: auth.currentUser.displayName,
                              id: auth.currentUser.uid,
                        },
                  });
                  alert("success");
                  navigate("/");
            }
      };

      useEffect(() => {
            if (!isAuth) {
                  navigate("/login");
            }
      }, []);

      const monthNames = [
            "Январь",
            "Февраль",
            "Март",
            "Апрель",
            "Май",
            "Июнь",
            "Июль",
            "Август",
            "Сентябрь",
            "Октябрь",
            "Ноябрь",
            "Декабрь",
      ];

      const monthGet = new Date();

      return (
            <div className="create">
                  <h2>Напишите ваши мысли</h2>
                  <Box
                        component="form"
                        sx={{
                              "& > :not(style)": {
                                    maxWidth: "500px",
                                    width: "100%",
                              },
                        }}
                        noValidate
                        autoComplete="off"
                  >
                        <TextField
                              id="standard-basic"
                              label="Тема блога"
                              variant="standard"
                              size="large"
                              onChange={(e) => {
                                    setTitle(e.target.value);
                                    setpostDate(
                                          new Date().getFullYear() +
                                                " / " +
                                                monthNames[
                                                      monthGet.getMonth()
                                                ] +
                                                " - " +
                                                new Date().getDate()
                                    );
                              }}
                        />
                        <TextField
                              sx={{ mt: 5 }}
                              id="standard-basic"
                              label="Ссылка на фото"
                              variant="standard"
                              size="large"
                              onChange={(e) => {
                                    setPhotoLink(e.target.value);
                              }}
                        />

                        <br />

                        <textarea
                              rows={16}
                              placeholder="Основной текст"
                              className="textarea"
                              onChange={(event) => {
                                    setPostText(event.target.value);
                              }}
                        />

                        <div className="publish">
                              <Button
                                    onClick={createPost}
                                    size="large"
                                    variant="contained"
                                    endIcon={<SendIcon />}
                              >
                                    Публиковать пост
                              </Button>
                        </div>
                  </Box>
            </div>
      );
}

export default CreateBlog;
