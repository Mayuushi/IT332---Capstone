import { useEffect, useState } from 'react';
import styled from 'styled-components';

const CharacterContainer = styled.div`
  position: absolute;
  top: 60%; /* Changed from 30% to 50% to move it lower */
  left: ${props => props.position || '50%'};
  transform: translate(-50%, -50%);
  width: 900px; /* Increased from 600px to 900px */
  height: 900px; /* Increased from 600px to 900px */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5; /* Changed from 999 to 5 to appear behind the DialogBox */
  pointer-events: none;
`;

const CharacterImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  min-height: 800px; /* Increased from 500px to 800px */
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
      `/images/characters/Neura.3.png`,
      `/characters/Neura.3.png`,
      `/Neura.3.png`,
      `/images/Neura.3.png`
    ];
    
    // Check if any of these paths work
    const img = new Image();
    let pathIndex = 0;
    
    const tryNextPath = () => {
      if (pathIndex >= paths.length) {
        console.error('Could not load Neura.3.png from any path');
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