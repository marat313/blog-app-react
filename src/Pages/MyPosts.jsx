import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";

function MyPosts() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postDocRef = doc(db, "post", id);
      const postDocSnapshot = await getDoc(postDocRef);

      if (postDocSnapshot.exists()) {
        setPost({ ...postDocSnapshot.data(), id: postDocSnapshot.id });
      }
    };
    
    fetchPost();
  }, [id]);
  
  if (!post) {
    return <div>Загрузка...</div>;
  }


  return (
    <div className="individualPost">
      <div className="detail">
        <img src={post.photoLink} alt="" />
        <div style={{display: "flex", 
                      justifyContent: "space-between", 
                      marginTop: "10px",
                      fontFamily: "Alice"}}>

          <div style={{display: "flex", alignItems: "center"}}> 
            {post.author.name}
            <img style={{width:"25px", height:"25px", borderRadius: "20px", marginLeft: "5px"}} src={localStorage.getItem("userPhotoUrl")} alt="" />
          </div>
          <div>{post.postDate}</div>
        </div>
        
        <h2 style={{fontFamily: "Alice"}}>{post.title}</h2>
        <hr className="line"/>
        <div className="openBlog">{post.postText}</div>
        <Link to="/">
          <button className="back">Назад</button>
        </Link>
      </div>
      
    </div>
  );
}

export default MyPosts;



