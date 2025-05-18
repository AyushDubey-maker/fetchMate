import React, { useEffect, useState } from 'react';
import './styles/HomePage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bannerImg from '../assets/banner_image.png';
import bannerImg_mobile from '../assets/banner_image_mobile.png';


const BASE_URL = 'https://frontend-take-home-service.fetch.com';
const PAGE_SIZE = 24;

const HomePage = () => {
  const [breeds, setBreeds] = useState([]);
const [dogIds, setDogIds] = useState([]);
const [dogDetails, setDogDetails] = useState([]);
const [selectedBreeds, setSelectedBreeds] = useState([]);
const [favorites, setFavorites] = useState([]);
const [sortOrder, setSortOrder] = useState('asc');
const [from, setFrom] = useState(0);
const [total, setTotal] = useState(0);
const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);



// Fetch breeds on mount
useEffect(() => {
  fetch(`${BASE_URL}/dogs/breeds`, { credentials: 'include' })
    .then((res) => res.json())
    .then((data) => setBreeds(data));
}, []);

// Fetch dog IDs with sort and filters
useEffect(() => {
  const query = new URLSearchParams();
  selectedBreeds.forEach((breed) => query.append('breeds', breed));
  query.append('size', PAGE_SIZE);
  query.append('from', from);
  query.append('sort', `breed:${sortOrder}`);

  fetch(`${BASE_URL}/dogs/search?${query.toString()}`, {
    credentials: 'include',
  })
    .then((res) => res.json())
    .then((data) => {
      setDogIds(data.resultIds);
      setTotal(data.total);
    });
}, [selectedBreeds, sortOrder, from]);

// Fetch dog details and location info
useEffect(() => {
  if (dogIds.length === 0) {
    setDogDetails([]);
    return;
  }

  fetch(`${BASE_URL}/dogs`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dogIds),
  })
    .then((res) => res.json())
    .then(async (dogs) => {
      const validDogs = dogs.filter((dog) => dog && typeof dog.zip_code !== 'undefined');
      const zipCodes = [...new Set(validDogs.map((dog) => dog.zip_code).filter(Boolean))];

      let locationMap = {};
      if (zipCodes.length > 0) {
        const locationRes = await fetch(`${BASE_URL}/locations`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zipCodes),
        });

        const locationData = await locationRes.json();
        locationData.forEach(loc => {
          if (loc && loc.zip_code) {
            locationMap[loc.zip_code] = loc;
          }
        });
      }

      const enrichedDogs = validDogs.map(dog => ({
        ...dog,
        location: locationMap[dog.zip_code] || null
      }));

      setDogDetails(enrichedDogs);
    })
    .catch((err) => {
      console.error("Error fetching dogs or locations:", err);
      setDogDetails([]);
    });
}, [dogIds]);

// Toggle favorites
const toggleFavorite = (id) => {
  setFavorites((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
};

// ✅ Match handler
const handleMatch = async () => {
  const res = await fetch(`${BASE_URL}/dogs/match`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(favorites),
  });
  const data = await res.json();
  const matchedDog = dogDetails.find((d) => d.id === data.match);
  if (matchedDog) {
    alert(`You matched with ${matchedDog.name}, a ${matchedDog.breed}! 🐶`);
  } else {
    alert(`You matched with dog ID: ${data.match}`);
  }
};

// Pagination logic
const totalPages = Math.ceil(total / PAGE_SIZE);
const currentPage = Math.floor(from / PAGE_SIZE) + 1;

const handlePageChange = (pageNum) => {
  setFrom((pageNum - 1) * PAGE_SIZE);
};

//  Window resize
useEffect(() => {
  const handleResize = () => setIsMobile(window.innerWidth <= 768);
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);

  return (
    <>
      <Header />
      <div className="banner">
        <img
          src={isMobile ? bannerImg_mobile : bannerImg}
          alt="Banner with dogs"
          className="banner-img"
        />
        <div className="banner-text">
          Home is Where<br /> the Paw Prints Are
        </div>
      </div>

      <div className="home-wrapper">
        <div className="controls">
         <select
            value={selectedBreeds[0] || ''}
            onChange={(e) => {
              setSelectedBreeds([e.target.value]);
              setFrom(0);
            }}
          >
            <option value="" disabled>
              Select a Breed
            </option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}>
            <option value="asc">Sort by Breed (A-Z)</option>
            <option value="desc">Sort by Breed (Z-A)</option>
          </select>

          <button onClick={() => {
            setSelectedBreeds([]);
            setSortOrder('asc');
            setFrom(0);
          }}>Reset Filters</button>
        </div>

        <div className="dog-grid">
          {dogDetails.map((dog) => (
            <div key={dog.id} className="dog-card">
              <img src={dog.img} alt={dog.name} />
              <h3>{dog.name}</h3>
              <p><strong>Breed:</strong> {dog.breed}</p>
              <p><strong>Age:</strong> {dog.age}</p>
              {dog.location ? (
                <p className="dog-location">
                  <strong>Location:</strong> {dog.location.city}, {dog.location.state} ({dog.location.county} County)
                </p>
              ) : (
                <p className="dog-location">
                  <strong>Location:</strong> No location provided
                </p>
              )}
              <button
                onClick={() => toggleFavorite(dog.id)}
                className={favorites.includes(dog.id) ? 'favorited' : ''}>
                {favorites.includes(dog.id) ? '💖 Favorited' : '🤍 Favorite'}
              </button>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Prev</button>
          {currentPage > 3 && <span className="dots">...</span>}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 2)
            .map((page) => (
              <button
                key={page}
                className={page === currentPage ? 'active-page' : ''}
                onClick={() => handlePageChange(page)}>
                {page}
              </button>
            ))}
          {currentPage < totalPages - 2 && <span className="dots">...</span>}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>

        {favorites.length > 0 && (
          <div className="match-section">
            <button onClick={handleMatch} className="match-button">
              Generate My Match
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;

