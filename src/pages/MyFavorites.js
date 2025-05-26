import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import './styles/MyFavorites.css';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';

const MyFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [dogs, setDogs] = useState([]);
  const [matchedDog, setMatchedDog] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('userEmail');
    if (user) {
      const favs = localStorage.getItem(`favorites_${user}`);
      setFavoriteIds(favs ? JSON.parse(favs) : []);
    }
  }, []);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setDogs([]);
      return;
    }

    const fetchDogs = async () => {
      setIsLoading(true);
      try {
        const dogRes = await fetch(`${BASE_URL}/dogs`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(favoriteIds),
        });

        const dogData = await dogRes.json();

        const zipCodes = [...new Set(dogData.map((dog) => dog.zip_code))];
        const locRes = await fetch(`${BASE_URL}/locations`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(zipCodes),
        });

        const locationData = await locRes.json();
        const locMap = {};
        locationData.forEach(loc => {
          if (loc && loc.zip_code) locMap[loc.zip_code] = loc;
        });

        const enriched = dogData.map(dog => ({
          ...dog,
          location: locMap[dog.zip_code] || null,
        }));

        setDogs(enriched);
      } catch (err) {
        console.error('Error loading favorite dogs:', err);
        setDogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogs();
  }, [favoriteIds]);

  const removeFavorite = (id) => {
    const updated = favoriteIds.filter((fid) => fid !== id);
    setFavoriteIds(updated);

    const user = localStorage.getItem('userEmail');
    if (user) localStorage.setItem(`favorites_${user}`, JSON.stringify(updated));
  };

  const handleMatch = async () => {
    const res = await fetch(`${BASE_URL}/dogs/match`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(favoriteIds),
    });

    const data = await res.json();

    const matchRes = await fetch(`${BASE_URL}/dogs`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([data.match]),
    });

    const matchData = await matchRes.json();
    const matchDog = matchData[0];

    if (matchDog && matchDog.zip_code) {
      const locRes = await fetch(`${BASE_URL}/locations`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([matchDog.zip_code]),
      });

      const [loc] = await locRes.json();
      matchDog.location = loc || null;
    }

    setMatchedDog(matchDog);
  };

  return (
    <>
      <Header favoriteCount={dogs.length}/>
      <Banner />

      <div className="favorites-wrapper">
        <h2>My Favorites</h2>

        {isLoading ? (
          <div className="loading-favorites">Loading favorites...</div>
        ) : dogs.length === 0 ? (
          <p className="no-favorites">No favorite dogs found. <a href='/' className='nav-link'>Add</a></p>
        ) : (
          <div className="dog-grid">
            {dogs.map((dog) => (
              <div key={dog.id} className="dog-card">
                <img src={dog.img} alt={dog.name} />
                <h3>{dog.name}</h3>
                <p><strong>Breed:</strong> {dog.breed}</p>
                <p>
                  <strong>Age:</strong>{' '}
                  {dog.age === 0
                    ? 'Less than 1 year old'
                    : dog.age === 1
                    ? '1 year old'
                    : `${dog.age} years old`}
                </p>
                {dog.location ? (
                  <p className="dog-location">
                    <strong>Location:</strong> {dog.location.city}, {dog.location.state}
                  </p>
                ) : (
                  <p className="dog-location">Location not available</p>
                )}
                <button className="remove-button" onClick={() => removeFavorite(dog.id)}>
                  ❌ Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {favoriteIds.length > 0 && (
          <button className="floating-match-button" onClick={handleMatch}>
            Generate My Match
          </button>
        )}
      </div>

      <Footer />

      {matchedDog && (
        <div className="modal-overlay">
          <div className="match-modal">
            <button className="close-button" onClick={() => setMatchedDog(null)}>✖</button>
            <h2>🎉 You matched with:</h2>
            <img src={matchedDog.img} alt={matchedDog.name} className="match-image" />
            <h3>{matchedDog.name}</h3>
            <p><strong>Breed:</strong> {matchedDog.breed}</p>
            <p>
              <strong>Age:</strong>{' '}
              {matchedDog.age === 0
                ? 'Less than 1 year old'
                : matchedDog.age === 1
                ? '1 year old'
                : `${matchedDog.age} years old`}
            </p>
            {matchedDog.location && (
              <p><strong>Location:</strong> {matchedDog.location.city}, {matchedDog.location.state}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyFavorites;
