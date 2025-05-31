import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/HomePage.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import DogFactModal from '../components/DogFactModal';

const BASE_URL = 'https://frontend-take-home-service.fetch.com';
const PAGE_SIZE = 24;

const HomePage = () => {
  const [breeds, setBreeds] = useState([]);
  const [breedGroups, setBreedGroups] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [dogIds, setDogIds] = useState([]);
  const [dogDetails, setDogDetails] = useState([]);
  const [favorites, setFavorites] = useState(() => {
  const stored = localStorage.getItem('favorites');
  return stored ? JSON.parse(stored) : [];
});
  const [sortOrder, setSortOrder] = useState('asc');
  const [from, setFrom] = useState(0);
  const [total, setTotal] = useState(0);
  const [zipCodesNearMe, setZipCodesNearMe] = useState([]);
  const [isNearMeActive, setIsNearMeActive] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [matchedDog, setMatchedDog] = useState(null);
  const [showFactModal, setShowFactModal] = useState(false);


  const location = useLocation();

  const groupBreedsAlphabetically = (breedsList) => {
    const groups = { 'A–F': [], 'G–L': [], 'M–R': [], 'S–Z': [] };
    breedsList.forEach((breed) => {
      const firstChar = breed.charAt(0).toUpperCase();
      if ('ABCDEF'.includes(firstChar)) groups['A–F'].push(breed);
      else if ('GHIJKL'.includes(firstChar)) groups['G–L'].push(breed);
      else if ('MNOPQR'.includes(firstChar)) groups['M–R'].push(breed);
      else if ('STUVWXYZ'.includes(firstChar)) groups['S–Z'].push(breed);
    });
    return groups;
  };

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetch(`${BASE_URL}/dogs/breeds`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch breeds');
        }

        const data = await res.json();
        setBreeds(data);
        setBreedGroups(groupBreedsAlphabetically(data));
      } catch (error) {
        console.error('Error fetching breeds:', error);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      setSelectedGroup('');
      setSelectedBreeds([]);
      setSortOrder('asc');
      setFrom(0);
    }
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const fetchDogIds = async () => {
      const query = new URLSearchParams();

      if (selectedBreeds.length > 0) {
        selectedBreeds.forEach((breed) => query.append('breeds', breed));
      } else if (selectedGroup && breedGroups[selectedGroup]) {
        breedGroups[selectedGroup].forEach((breed) => query.append('breeds', breed));
      }

      if (zipCodesNearMe.length > 0) {
        zipCodesNearMe.forEach((zip) => query.append('zipCodes', zip));
      }

      query.append('size', PAGE_SIZE);
      query.append('from', from);
      query.append('sort', `breed:${sortOrder}`);

      setIsLoading(true);

      try {
        const res = await fetch(`${BASE_URL}/dogs/search?${query.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch dog search results');
        }

        const data = await res.json();
        setDogIds(data.resultIds);
        setTotal(data.total);
      } catch (err) {
        console.error('Error fetching dog IDs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogIds();
  }, [selectedBreeds, selectedGroup, sortOrder, from, breedGroups, zipCodesNearMe]);

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

    // Fact for the day

    useEffect(() => {
      const shown = sessionStorage.getItem('dogFactShown');
      if (!shown) {
        setShowFactModal(true);
        sessionStorage.setItem('dogFactShown', 'true');

        // Auto close after 15s
        setTimeout(() => setShowFactModal(false), 15000);
      }
    }, []);

    useEffect(() => {
      const storedUser = localStorage.getItem('userEmail');
      if (storedUser) {
        localStorage.setItem(`favorites_${storedUser}`, JSON.stringify(favorites));
      }
    }, [favorites]);

  // useEffect(() => {
  //   if (dogIds.length === 0) {
  //     setDogDetails([]);
  //     setIsLoading(false);
  //     return;
  //   }

  //   setIsLoading(true);

  //   fetch(`${BASE_URL}/dogs`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(dogIds),
  //   })
  //     .then((res) => res.json())
  //     .then(async (dogs) => {
  //       const validDogs = dogs.filter((dog) => dog && typeof dog.zip_code !== 'undefined');
  //       const zipCodes = [...new Set(validDogs.map((dog) => dog.zip_code).filter(Boolean))];

  //       let locationMap = {};
  //       if (zipCodes.length > 0) {
  //         const locationRes = await fetch(`${BASE_URL}/locations`, {
  //           method: 'POST',
  //           credentials: 'include',
  //           headers: { 'Content-Type': 'application/json' },
  //           body: JSON.stringify(zipCodes),
  //         });

  //         const locationData = await locationRes.json();
  //         locationData.forEach(loc => {
  //           if (loc && loc.zip_code) locationMap[loc.zip_code] = loc;
  //         });
  //       }

  //       const enrichedDogs = validDogs.map(dog => ({
  //         ...dog,
  //         location: locationMap[dog.zip_code] || null
  //       }));

  //       setDogDetails(enrichedDogs);
  //       setIsLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching dogs or locations:", err);
  //       setDogDetails([]);
  //       setIsLoading(false);
  //     });
  // }, [dogIds]);
useEffect(() => {
  if (dogIds.length === 0) {
    setDogDetails([]);
    setIsLoading(false);
    return;
  }

  setIsLoading(true);

  // Step 1: Fetch dog details
  fetch(`${BASE_URL}/dogs`, {
    method: 'POST',
    credentials: 'include', // Needed for cookie session
    mode: 'cors',            // ✅ iOS compatibility
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dogIds)
  })
    .then((res) => {
      if (!res.ok) throw new Error(`Dog fetch failed: ${res.status}`);
      return res.json();
    })
    .then(async (dogs) => {
      const validDogs = dogs.filter((dog) => dog && typeof dog.zip_code !== 'undefined');
      const zipCodes = [...new Set(validDogs.map((dog) => dog.zip_code).filter(Boolean))];

      let locationMap = {};

      // Step 2: Fetch location data for zip codes
      if (zipCodes.length > 0) {
        try {
          const locationRes = await fetch(`${BASE_URL}/locations`, {
            method: 'POST',
            credentials: 'include', // ✅ Cookie support
            mode: 'cors',           // ✅ iOS fix
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(zipCodes)
          });

          if (!locationRes.ok) throw new Error(`Location fetch failed: ${locationRes.status}`);

          const locationData = await locationRes.json();
          locationData.forEach((loc) => {
            if (loc && loc.zip_code) {
              locationMap[loc.zip_code] = loc;
            }
          });
        } catch (locationErr) {
          console.warn('Failed to fetch locations (handled gracefully):', locationErr);
        }
      }

      // Step 3: Enrich and set dog data
      const enrichedDogs = validDogs.map((dog) => ({
        ...dog,
        location: locationMap[dog.zip_code] || null
      }));

      setDogDetails(enrichedDogs);
      setIsLoading(false);
    })
    .catch((err) => {
      console.error('Dog fetch failed:', err);
      setDogDetails([]); // fallback: empty array
      setIsLoading(false);
    });
}, [dogIds]);

  // const handleFindNearMe = () => {
  //     // If already active, clicking again should turn it off
  //     if (isNearMeActive) {
  //       setZipCodesNearMe([]);
  //       setIsNearMeActive(false);
  //       return;
  //     }

  //     if (!navigator.geolocation) {
  //       alert('Geolocation is not supported by your browser');
  //       return;
  //     }
  //   navigator.geolocation.getCurrentPosition(async (position) => {
  //     const { latitude, longitude } = position.coords;

  //     const nearbyZipRes = await fetch(`${BASE_URL}/locations/search`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({
  //         geoBoundingBox: {
  //           bottom_left: { lat: latitude - 0.3, lon: longitude - 0.3 },
  //           top_right: { lat: latitude + 0.3, lon: longitude + 0.3 },
  //         },
  //         size: 100,
  //       }),
  //     });

  //     const zipData = await nearbyZipRes.json();
  //     const zipCodes = zipData.results.map(loc => loc.zip_code);

  //     if (zipCodes.length === 0) {
  //       alert('No dogs found near your location. Try expanding your search.');
  //       return;
  //     }

  //     setZipCodesNearMe(zipCodes);
  //     setIsNearMeActive(true);
  //     setFrom(0);
  //   }, () => {
  //     alert('Unable to retrieve your location. Please allow location access.');
  //   });
  // };
    const handleFindNearMe = () => {
  if (isNearMeActive) {
    setZipCodesNearMe([]);
    setIsNearMeActive(false);
    return;
  }

  if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const nearbyZipRes = await fetch(`${BASE_URL}/locations/search`, {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            geoBoundingBox: {
              bottom_left: { lat: latitude - 0.3, lon: longitude - 0.3 },
              top_right: { lat: latitude + 0.3, lon: longitude + 0.3 }
            },
            size: 100
          })
        });

        if (!nearbyZipRes.ok) throw new Error(`Nearby ZIP fetch failed: ${nearbyZipRes.status}`);

        const zipData = await nearbyZipRes.json();
        const zipCodes = zipData.results.map((loc) => loc.zip_code);

        if (zipCodes.length === 0) {
          alert('No dogs found near your location. Try expanding your search.');
          return;
        }

        setZipCodesNearMe(zipCodes);
        setIsNearMeActive(true);
        setFrom(0);
      } catch (error) {
        console.error('Error retrieving nearby ZIP codes:', error);
        alert('Something went wrong while finding nearby dogs.');
      }
    },
    () => {
      alert('Unable to retrieve your location. Please allow location access.');
    }
  );
};

  // const handleMatch = async () => {
  //   const res = await fetch(`${BASE_URL}/dogs/match`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(favorites),
  //   });

  //   const data = await res.json();

  //   const matchedRes = await fetch(`${BASE_URL}/dogs`, {
  //     method: 'POST',
  //     credentials: 'include',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify([data.match]),
  //   });

  //   const matchedData = await matchedRes.json();
  //   const matchedDogObj = matchedData[0] || { id: data.match, name: 'Unknown', breed: 'Unknown' };

  //   if (matchedDogObj && matchedDogObj.zip_code) {
  //     const locationRes = await fetch(`${BASE_URL}/locations`, {
  //       method: 'POST',
  //       credentials: 'include',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify([matchedDogObj.zip_code]),
  //     });

  //     const [location] = await locationRes.json();
  //     matchedDogObj.location = location || null;
  //   }

  //   setMatchedDog(matchedDogObj);
  // };
  const handleMatch = async () => {
  try {
    // Step 1: Get the matched dog ID
    const res = await fetch(`${BASE_URL}/dogs/match`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors', // iOS Safari compatibility
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(favorites),
    });

    if (!res.ok) throw new Error(`Match request failed: ${res.status}`);
    const data = await res.json();

    // Step 2: Fetch full details of matched dog
    const matchedRes = await fetch(`${BASE_URL}/dogs`, {
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([data.match]),
    });

    if (!matchedRes.ok) throw new Error(`Dog details fetch failed: ${matchedRes.status}`);
    const matchedData = await matchedRes.json();

    const matchedDogObj = matchedData[0] || {
      id: data.match,
      name: 'Unknown',
      breed: 'Unknown',
    };

    // Step 3: Enrich with location (if zip_code is available)
    if (matchedDogObj && matchedDogObj.zip_code) {
      const locationRes = await fetch(`${BASE_URL}/locations`, {
        method: 'POST',
        credentials: 'include',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([matchedDogObj.zip_code]),
      });

      if (locationRes.ok) {
        const [location] = await locationRes.json();
        matchedDogObj.location = location || null;
      }
    }

    setMatchedDog(matchedDogObj);
  } catch (error) {
    console.error('Match generation failed:', error);
    alert('Unable to generate a match. Please try again later.');
  }
};

  const toggleFavorite = (id) => {
  setFavorites((prev) =>
    prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
  );
};


  const handlePageChange = (pageNum) => {
    setFrom((pageNum - 1) * PAGE_SIZE);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(from / PAGE_SIZE) + 1;

  return (
    <>
      <DogFactModal show={showFactModal} onClose={() => setShowFactModal(false)} />

      <Header favoriteCount={favorites.length} />

      <Banner/>

      <div className="home-wrapper">
        <div className="controls">
          <select
            value={selectedGroup}
            title="Filter breeds alphabetically (e.g. A–F)"
            onChange={(e) => {
              setSelectedGroup(e.target.value);
              setSelectedBreeds([]);
              setFrom(0);
            }}
          >
            <option value="">All Breed Groups</option>
            {Object.keys(breedGroups).map((groupLabel) => (
              <option key={groupLabel} value={groupLabel}>
                Breeds {groupLabel}
              </option>
            ))}
          </select>

          <select
            value={selectedBreeds[0] || ''}
            title="Select a specific dog breed to filter results"
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                setSelectedBreeds([]);
              } else {
                setSelectedBreeds([value]);
                setSelectedGroup('');
              }
              setFrom(0);
            }}
          >
            <option value="">Select a Breed</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>{breed}</option>
            ))}
          </select>

          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value);
              setSelectedBreeds([]);
            }}
          >
            <option value="asc">Sort by Breed (A–Z)</option>
            <option value="desc">Sort by Breed (Z–A)</option>
          </select>

          <button
            className={`near-me-button ${isNearMeActive ? 'active' : ''}`}
            onClick={handleFindNearMe}
            title="Find dogs close to your current location"
          >
            📍Dogs Near Me 
          </button>

          <button
            onClick={() => {
              setSelectedGroup('');
              setSelectedBreeds([]);
              setSortOrder('asc');
              setZipCodesNearMe([]);
              setIsNearMeActive(false);
              setFrom(0);
            }}
          >
            Reset Filters
          </button>

          
        </div>

        <div className="dog-grid">
          {isLoading ? (
            <div className="loading-dog-grid">Loading dogs... 🐾</div>
          ) : dogDetails.length === 0 ? (
            <div className="no-dogs-message">
              😕 No dogs found. Try changing your filters or location!
            </div>
          ) : (
            dogDetails.map((dog) => (
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
                    <strong>Location:</strong> {dog.location.city}, {dog.location.state} ({dog.location.county} County)
                  </p>
                ) : (
                  <p className="dog-location">
                    <strong>Location:</strong> No location provided
                  </p>
                )}
                <button
                  onClick={() => toggleFavorite(dog.id)}
                  className={favorites.includes(dog.id) ? 'favorited' : ''}
                >
                  {favorites.includes(dog.id) ? '❤️ Favorited' : '🤍 Favorite'}
                </button>
              </div>
            ))
          )}
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
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
          {currentPage < totalPages - 2 && <span className="dots">...</span>}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
        </div>

        {favorites.length > 0 && (
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

export default HomePage;
