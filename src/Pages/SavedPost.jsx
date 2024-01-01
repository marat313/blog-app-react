import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from "../firebase-config";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { useAppContext } from './AppContext';
import { FcRemoveImage } from 'react-icons/fc';
import '../App.css'



function SavedPost() {
    const [savedPosts, setSavedPosts] = useState([]);
    const savedPostsCollectionRef = collection(db, "savedposts");
    const { isAuth } = useAppContext();


    useEffect(() => {
        const getSavedPosts = async () => {
          try {
            const querySnapshot = await getDocs(savedPostsCollectionRef);
            const savedPostsData = querySnapshot.docs.map((doc) => doc.data());
            setSavedPosts(savedPostsData);
          } catch (error) {
            console.error("Error fetching saved posts:", error);
          }
        };
    
        getSavedPosts();
      }, []);

      const deletePost = async (id) => {
        try {
          const postDoc = doc(db, "savedposts", id);
          await deleteDoc(postDoc);
          console.log(`Post with ID ${id} deleted successfully.`);
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      };

      const getPosts = async () => {
        try {
          const data = await getDocs(savedPostsCollectionRef);
          setSavedPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      };

      useEffect(() => {
        getPosts();
      }, []);


      const handleDeletePost = async (id) => {
        try {
          console.log("Before deletion:", savedPosts);
          await deletePost(id);
          setSavedPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
          console.log("After deletion:", savedPosts);
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      };

  return (
    <div>
      <h2>Saved Posts</h2>
      <div className='otherNewsContainer'>
      {savedPosts.map((post, index) => (
        <Card key={index} className="card mainNews">
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

        <CardContent className="mainCardContent">

          <Typography className="postTitle" gutterBottom>
            <Link
              to={`/myposts/${post.id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              {post.title.length > 30
                ? post.title.substr(0, 30) + "..."
                : post.title}
            </Link>
            {/* {console.log(index + 1)} */}
          </Typography>

          <CardActions className="mainCardAction">
            <div className="card_create_date" style={{
                position: "relative",
                bottom: "-10px",
                left: "-15%"
            }}>
                {post.postDate}
            </div>

            <div className="savedPostDelete" style={{
                position: "relative",top: "5px" ,
                left: "20%", 
                fontSize: "22px",
                cursor: "pointer"
                }}>
              {isAuth && post.author.id === auth.currentUser.uid && (
                <i
                  className="fa-solid fa-trash"
                  onClick={() => {
                    handleDeletePost(post.id);
                  }}
                >
                  {" "}
                </i>
              )}
              <span>{index + 1}</span>
            </div>
          </CardActions>

        </CardContent>



      </Card>
      ))}
      </div>
 
    </div>
  )
}

export default SavedPost
