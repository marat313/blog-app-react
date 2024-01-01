import React, { useEffect, useState } from "react";
import { Link,  useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function MyPosts() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const postDocRef = doc(db, "items", id);
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
    <div className="postWrapper">
      <div className="post">

        <img className="postImg" src={post.photoLink} alt="" />

     {/*    <div className="postUserInfo">
          <div className="postAuthorName"> 
            {post.author.name}
            <img className="postAuthorImg" src={localStorage.getItem("userPhotoUrl")} alt="" />
          </div>
          <div className="postDate">{post.postDate}</div>
        </div> */}
        
        <h2 className="postTitle">{post.title}</h2>
        <hr className="postTitleUnderline"/>
        <div className="postText" dangerouslySetInnerHTML={{ __html: post.postText }}></div>
        {/* <div className="postText" dangerouslySetInnerHTML={{ __html: post.postText }}>{post.postText}</div> */}
        
      </div>
      
    </div>
  );
}

export default MyPosts;



