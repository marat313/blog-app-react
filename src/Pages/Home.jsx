import React from 'react'
import BlogCard from './BlogCard'

function Home({isAuth}) {

  return (
    <div className='home'>
      
      <h1>THE BLOG</h1>
      <div className='welcome'>
        <div>{localStorage.getItem("userName")}</div>
      </div>
      <BlogCard isAuth={isAuth} />
    </div>
  )
  
}

export default Home
