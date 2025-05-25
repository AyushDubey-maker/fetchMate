import React, { useMemo } from 'react';
import './styles/DogFactModal.css';
import dogBanner from '../assets/dog_modal_img.png';

const dogFacts = [
  "Dalmatian puppies are born completely white and develop their spots as they age.",
  "A Greyhound can run up to 45 miles per hour, making it one of the fastest dog breeds.",
  "The Basenji is known as the ‘barkless dog’ because it doesn’t bark like other breeds.",
  "Labrador Retrievers have been America’s most popular dog breed for over 30 years.",
  "A dog’s sense of smell is at least 40x better than a human’s.",
  "Dogs have three eyelids including one to keep their eyes moist and protected.",
  "Some dogs can learn more than 1,000 words and gestures!",
  "The Labrador Retriever is the most popular dog breed in the world.",
  "Dogs' noses are wet to help absorb scent chemicals.",
  "The Saluki is one of the oldest dog breeds, dating back to ancient Egypt.",
  "Chihuahuas are the smallest dog breed, but they have the biggest personalities.",
  "A Bloodhound’s sense of smell can be used as evidence in court.",
  "The Norwegian Lundehund has six toes on each foot!",
  "Dogs can hear sounds four times farther away than humans.",
  "The Beatles song 'A Day in the Life' has a frequency only dogs can hear.",
  "Dogs curl up when they sleep to protect their organs.",
  "Newfoundlands are excellent swimmers and have webbed feet.",
  "Dachshunds were originally bred to hunt badgers.",
  "Puppies are born blind, deaf, and toothless.",
  "Dogs have about 1,700 taste buds (compared to 9,000 in humans).",
  "Australian Shepherds are actually from the United States.",
  "Corgis were used as herding dogs in Wales — their low stature helped avoid kicks.",
  "Dogs can smell your feelings — they can detect fear, anxiety, and even sadness.",
  "A dog’s nose print is as unique as a human fingerprint.",
  "Yawning is contagious to dogs — they’ll yawn if they see their human do it!"
];


const DogFactModal = ({ show, onClose }) => {
  const selectedFact = useMemo(() => {
    return dogFacts[Math.floor(Math.random() * dogFacts.length)];
  }, []);

  if (!show) return null;

  return (
    <div className="dogfact-modal-overlay">
      <div className="dogfact-modal">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>Dog Fact of the Day</h2>
        <img src={dogBanner} alt="Dog" className="dogfact-img" />
        <p className="dogfact-text">{selectedFact}</p>
      </div>
    </div>
  );
};

export default DogFactModal;