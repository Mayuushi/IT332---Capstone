import React from 'react';
import styled from 'styled-components';

const CharacterContainer = styled.div`
  position: absolute;
  bottom: 120px;
  left: ${props => props.position || '50%'};
  transform: translateX(-50%);
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 5;
  transition: all 0.3s ease-in-out;
`;

const CharacterImage = styled.img`
  height: 90%;
  max-height: 700px;
  filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
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
  return (
    <CharacterContainer position={getCharacterPosition(character)}>
      <CharacterImage 
        src={`/images/characters/${image}.png`} 
        alt={character} 
      />
    </CharacterContainer>
  );
};

export default CharacterDisplay;