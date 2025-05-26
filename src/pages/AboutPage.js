import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './styles/AboutPage.css';
import dogPic from '../assets/woman-with-dog.jpg'; 
import Banner from '../components/Banner';

const AboutPage = () => {
    const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
    // Favorites
      useEffect(() => {
        const storedUser = localStorage.getItem('userEmail');
        if (storedUser) {
          const storedFavs = localStorage.getItem(`favorites_${storedUser}`);
          if (storedFavs) {
            setFavorites(JSON.parse(storedFavs));
          }
        }
      }, []);
  

  return (
    <>
      <Header favoriteCount={favorites.length}/>
      <Banner/>
      <div className="about-container">
        <img src={dogPic} alt="Cute dog" className="about-image" />
        <div className="about-text">
        <h2>About FetchMate</h2>
        
        <p>
            I’m building this website with one mission: <strong>to help shelter dogs find their forever homes</strong>. And yes, also to pass Fetch’s assessment 🐕
        </p>

        <p>
            Built with <strong>ReactJS</strong>, this project is powered by a little caffeine, a lot of love for dogs, and some finely tuned frontend logic. It lets you search for adoptable dogs, filter them by breed, save your favorites, and find the pawfect match 🐾
        </p>

        <p>
            From creating smooth navigation with React Router to building custom components like a searchable gallery of good bois and gurls, everything here is handcrafted with care (and many console logs)
        </p>

        <p>
            Whether you're a dog lover looking for a new companion or just here for the adorable pictures, FetchMate is here to make your day better. Because honestly, who doesn't want to scroll through happy puppy faces while pretending to work
        </p>

        <p>
            So, take a look around, favorite some furballs, and maybe just maybe make a best friend for life 🦴
        </p>
        <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#555' }}>
        P.S. This site may contain excessive cuteness. Viewer discretion advised
        </p>

    </div>
  </div>


      <Footer />
    </>
  );
};

export default AboutPage;
