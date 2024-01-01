import React, { useEffect, useRef, useState } from "react";
import { getDocs, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";;
import { Link } from "react-router-dom";
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import { AiFillFrown } from "react-icons/ai";
import "./MainNewsStyle.css"
import Skeleton from 'react-loading-skeleton';
import { useAppContext } from '../Pages/AppContext';


// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectCoverflow, Pagination } from "swiper/modules";
import "swiper/css";
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';



function MainNews() {
    const [postLists, setPostList] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]); 
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true);
    const { isAuth } = useAppContext();


    const postsCollectionRef = collection(db, "items")
    const savedPostsCollectionRef = collection(db, "savedposts"); 


    const deletePost = async (id) => {
      const postDoc = doc(db, "items", id);
      await deleteDoc(postDoc);
    };

    useEffect(() => {
      console.log("MainNews useEffect");
      getPosts().then(() => setLoading(false));
    }, []);
  
    const getPosts = async () => {
      console.log("getPosts");
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
  
  
    const handleDeletePost = async (id) => {
      await deletePost(id);
      getPosts();
    setOpen(true);

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
      console.log("getSaved posts");
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
        <div className="mainNewsContainer">
          <Swiper
            effect={'coverflow'}
            spaceBetween={0}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            autoplay={{
              delay: 2000,
              disableOnInteraction: false,
            }}
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            pagination={true}
            modules={[EffectCoverflow, Pagination, Autoplay]}
            className="mySwiper"
          >
            {loading ? (
              Array.from({length: 5}).map((_, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                   <Card key={index} className="card mainNews">
                  <Skeleton height={300} width={265} className="skeleton-wave" />
                  <CardContent className="mainCardContent">
                    <Typography className="postTitle">
                    <Skeleton className="skeleton-wave" />
                    </Typography>
                    <Skeleton count={2} className="skeleton-wave" />
                  </CardContent>
                </Card>
                </SwiperSlide>
               
              ))
            ) : (
              sortedPosts
              .filter((post) => post.isMainNews)
              .slice(0, 5)
              .map((post, index) => (
                <SwiperSlide className="swiper-slide" key={index}>
                  <Card className="card mainNews">
  
                    {post.photoLink ? (
                      <CardMedia
                        className="mainCardPhoto"
                        component="img"
                        alt=""
                        image={post.photoLink}
                      />
                    ) : (
                      <AiFillFrown className="noPhoto1" />
                    )}
  
                    <CardContent className="mainCardContent">
  
                      <Typography className="postTitle" gutterBottom>
                        {post.title ? (
                          <Link
                            to={`/myposts/${post.id}`}
                            style={{ textDecoration: 'none', color: 'black' }}
                          >
                            {post.title.length > 30
                              ? post.title.substr(0, 30) + '...'
                              : post.title}
                          </Link>
                        ) : (
                          <Skeleton height={20} width={`80%`} />
                        )}
                      </Typography>
  
                      <CardActions className="mainCardAction">
                        {/* <div className="card_create_date">
                          {post.postDate ? (
                            post.postDate
                          ) : (
                            <Skeleton height={15} width={`50%`} />
                          )}
                        </div> */}
  
                        <div className="mainCardDelete">
                          {isAuth && post.author.id === auth.currentUser.uid ? (
                            <i
                              className="fa-solid fa-trash"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              {' '}
                            </i>
                          ) : null}
                          {/* <span>{index + 1}</span> */}
                        </div>
  
                        <div className="bookmark2" onClick={() => handleBookmark(post)}>
                          {isAuth && post.author.id === auth.currentUser.uid ? (
                            savedPosts.some((savedPost) => savedPost.id === post.id) ? (
                              <FaBookmark />
                            ) : (
                              <FaRegBookmark />
                            )
                          ) : null}
                        </div>
  
                      </CardActions>
  
                    </CardContent>
  
                  </Card>
                </SwiperSlide>
              ))
            )}
            {}
          </Swiper>
        </div>
      </div>
    );
}

export default React.memo(MainNews)
