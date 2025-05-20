import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const CharacterContainer = styled.div`
  position: absolute;
  top: 30%; /* Changed from 40% to 30% to move it higher */
  left: ${props => props.position || '50%'};
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  pointer-events: none;
`;

const CharacterImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  min-height: 400px; /* Added minimum height */
  object-fit: contain;
`;

const getCharacterPosition = (character) => {
  // Could position different characters differently
  const positions = {
    doctor: '50%',
    student: '30%',
    assistant: '70%',
  };
  
  return positions[character] || '50%';
};

const CharacterDisplay = ({ character, image }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imagePath, setImagePath] = useState('');
  
  useEffect(() => {
    // Try different paths to find the correct one
    const paths = [
      `/images/characters/Neura.1.png`,
      `/characters/Neura.1.png`,
      `/Neura.1.png`,
      `/images/Neura.1.png`
    ];
    
    // Check if any of these paths work
    const img = new Image();
    let pathIndex = 0;
    
    const tryNextPath = () => {
      if (pathIndex >= paths.length) {
        console.error('Could not load Neura.1.png from any path');
        return;
      }
      
      img.src = paths[pathIndex];
      setImagePath(paths[pathIndex]);
      pathIndex++;
    };
    
    img.onload = () => {
      setImageLoaded(true);
      console.log('Image loaded successfully from:', img.src);
    };
    
    img.onerror = () => {
      console.log('Failed to load from:', img.src);
      tryNextPath();
    };
    
    tryNextPath();
  }, []);
  
  return (
    <CharacterContainer position={getCharacterPosition(character)}>
      {imageLoaded ? (
        <CharacterImage 
          src={imagePath}
          alt={character || "Neura"}
        />
      ) : (
        <div style={{ color: 'white', background: 'rgba(0,0,0,0.5)', padding: '10px' }}>
          Loading character...
        </div>
      )}
    </CharacterContainer>
  );
};

export default CharacterDisplay;