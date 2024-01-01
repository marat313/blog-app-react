import React, { useEffect, useRef, useState } from "react";
import { getDocs, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { AiFillFrown } from "react-icons/ai";
import "./OtherNewsStyle.css"
import { FcRemoveImage } from "react-icons/fc";
import Skeleton from 'react-loading-skeleton';
import { FaTrash } from "react-icons/fa";
import { useAppContext } from '../Pages/AppContext';


function OtherNews() {
  const [postLists, setPostList] = useState([])
  const [savedPosts, setSavedPosts] = useState([])
  const [loading, setLoading] = useState(true);
  const { isAuth } = useAppContext();


  const postsCollectionRef = collection(db, "items")
  const savedPostsCollectionRef = collection(db, "savedposts")


  const deletePost = async (id) => {
    const postDoc = doc(db, "items", id);
    await deleteDoc(postDoc);
  };

  useEffect(() => {
    getPosts().then(() => setLoading(false));
  }, []);

  const getPosts = async () => {
    const data = await getDocs(postsCollectionRef);
    setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  const handleDeletePost = async (id) => {
    await deletePost(id);
    getPosts();
  };



  const getSavedPosts = async () => {
    try {
      const querySnapshot = await getDocs(savedPostsCollectionRef);
      const savedPostsData = querySnapshot.docs.map((doc) => doc.data());
      setSavedPosts(savedPostsData);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
    }
  };

  useEffect(() => {
    getSavedPosts();
  }, []); // Вызовем getSavedPosts при монтировании компонента

  const handleBookmark = async (post) => {
    try {
      // Добавить пост в коллекцию savedposts в Firebase
      const savedPostRef = doc(db, "savedposts", post.id);
      await setDoc(savedPostRef, post);

      // Обновить список сохраненных постов
      getSavedPosts();

      console.log("Post added to savedposts:", post);
    } catch (error) {
      console.error("Error adding post to savedposts:", error);
    }
  };



  const sortedPosts = [...postLists].sort((a, b) => a.index - b.index);

    return (
        <div>
          <div className="otherNewsContainer">
            {loading ? (
              // Отображение скелета во время загрузки
              Array.from({ length: 5 }).map((_, index) => (
                <Card key={index} className="card">
                  <Skeleton height={150} width={425} className="skeleton-wave" />
                  <CardContent className="cardContent">
                    <Typography className="postTitle" gutterBottom>
                      <Skeleton className="skeleton-wave" />
                    </Typography>
                    <Skeleton count={2} className="skeleton-wave" />
                  </CardContent>
                </Card>
              ))
            ) : (
              // Отображение реальных данных после загрузки
              sortedPosts
                .filter((post) => !post.isMainNews)
                .map((post, index) => (
                  <Card key={index} className="card">
                    {post.photoLink ? (
                      <CardMedia
                        className="cardPhoto"
                        component="img"
                        alt=""
                        image={post.photoLink}
                      />
                    ) : (
                      <FcRemoveImage className="noPhoto" />
                    )}
                    <CardContent className="cardContent">
                      <Typography className="postTitle" gutterBottom>
                        <Link to={`/myposts/${post.id}`}>
                          {post.title.length > 65
                            ? post.title.substr(0, 65) + '.'
                            : post.title}
                        </Link>
                      </Typography>
                      <div className="delete">
                        {isAuth && post.author.id === auth.currentUser.uid && (
                        
                          <FaTrash onClick={() => {
                            handleDeletePost(post.id);
                          }}/>
                        )}
                      </div>
                      <div className="bookmark" onClick={() => handleBookmark(post)}>
                        {isAuth && post.author.id === auth.currentUser.uid ? (
                          savedPosts.some((savedPost) => savedPost.id === post.id) ? (
                            <FaBookmark />
                          ) : (
                            <FaRegBookmark />
                          )
                        ) : null}
                      </div>
                      {/* <span>{index + 1}</span> */}
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      );
}

export default OtherNews
