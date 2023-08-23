import React, { useEffect, useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import "./BlogCardStyle.css"

function BlogCard({ isAuth }) {
      const [postLists, setPostList] = useState([]);
      const postsCollectionRef = collection(db, "post");

      const deletePost = async (id) => {
            const postDoc = doc(db, "post", id);
            await deleteDoc(postDoc);
      };

      const getPosts = async () => {
            const data = await getDocs(postsCollectionRef);
            setPostList(
                  data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
      };

      useEffect(() => {
            getPosts();
      }, []);

      const handleDeletePost = async (id) => {
            await deletePost(id);
            getPosts();
      };

      

      return (
            <div
                  className="cardContainer"
            >
                  {postLists.map((post, id) => {
                        return (
                              <Card
                                    className="card"
                                    sx={{backgroundColor: "#c5c1b7",
                                          borderRadius: "20px",
                                    boxShadow: "0px 2px 25px 5px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0, 0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)"}}
                                    key={id}
                              >
                                    <CardMedia
                                          className="cardPhoto"
                                          component="img"
                                          alt="Фото отсутсвует"
                                          image={post.photoLink}
                                    />

                                    <CardContent className="cardContent">
                                          <Typography
                                                className="postTitle"
                                                gutterBottom
                                                variant="h5"
                                                component="div"
                                          >
                                                <Link to={`/myposts/${post.id}`}
                                                style={{textDecoration: "none", color: "black"}}>
                                                
                                                {post.title.length > 55
                                                      ? post.title.substr(
                                                            0,
                                                            55
                                                            ) + "..."
                                                            : post.title}
                                                            </Link>
                                          </Typography>
                                          <Typography
                                                variant="body2"
                                                color="#010001"
                                                fontFamily="PT serif"
                                                fontSize="18px"
                                          >
                                                {post.postText.length > 150
                                                      ? post.postText.substr(
                                                              0,
                                                              150
                                                        ) + "..."
                                                      : post.postText}
                                                <span className="moreText">
                                                      {post.postText.slice(150)}
                                                </span>
                                          </Typography>
                                    </CardContent>

                                    <CardActions className="cardAction">
                                          <div className="author-date">
                                                <Button
                                                      sx={{
                                                            p: 0,
                                                            ml: 2,
                                                            fontWeight: "bold",
                                                            color: "#514e46",
                                                            textTransform: "capitalize",                                                            fontSize: "11px",
                                                      }}
                                                      className="author"
                                                      size="small"
                                                >
                                                      {"автор: " + post.author.name}
                                                </Button>
                                                <br />
                                                <Button
                                                      sx={{
                                                            p: 0,
                                                            ml: 2,
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                            color: "#514e46",
                                                            textTransform: "capitalize",
                                                      }}
                                                      className="date"
                                                      size="small"
                                                >
                                                      {post.postDate}
                                                </Button>
                                          </div>

                                          <Link
                                                to={`/myposts/${post.id}`}
                                                className="readMore"
                                          >
                                                Больше
                                                <i className="fa-solid fa-arrow-up arrow"></i>
                                          </Link>

                                          <div className="delete">
                                                {isAuth &&
                                                      post.author.id ===
                                                            auth.currentUser
                                                                  .uid && (
                                                            <i
                                                                  className="fa-solid fa-trash"
                                                                  onClick={() => {
                                                                        handleDeletePost(
                                                                              post.id
                                                                        );
                                                                  }}
                                                            >
                                                                  {" "}
                                                            </i>
                                                      )}
                                          </div>
                                    </CardActions>
                              </Card>
                        );
                  })}
            </div>
      );
}

export default BlogCard;
