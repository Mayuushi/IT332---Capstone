import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DialogContainer = styled.div`
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  padding: 20px;
  color: white;
  z-index: 10;
`;

const CharacterName = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: #66c2ff;
  margin-bottom: 10px;
`;

const DialogText = styled.div`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ChoiceButton = styled.button`
  background-color: rgba(102, 194, 255, 0.2);
  border: 1px solid #66c2ff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(102, 194, 255, 0.4);
  }
`;

const getCharacterDisplayName = (characterId) => {
  const characters = {
    doctor: 'Dr. Neura',
    student: 'Student',
    assistant: 'Lab Assistant',
    // Add more character mappings as needed
  };
  
  return characters[characterId] || characterId;
};

const DialogBox = ({ text, character, choices, onChoiceSelect }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  
  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    let currentText = '';
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex < text.length) {
        currentText += text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 20); // Speed of typing
    
    return () => clearInterval(typingInterval);
  }, [text]);
  
  const handleClick = () => {
    if (isTyping) {
      // Complete the text immediately if still typing
      setDisplayedText(text);
      setIsTyping(false);
    }
  };
  
  return (
    <DialogContainer onClick={handleClick}>
      <CharacterName>{getCharacterDisplayName(character)}</CharacterName>
      <DialogText>{displayedText}</DialogText>
      
      {!isTyping && choices && (
        <ChoicesContainer>
          {choices.map((choice, index) => (
            <ChoiceButton
              key={index}
              onClick={() => onChoiceSelect(choice.nextNodeId)}
            >
              {choice.text}
            </ChoiceButton>
          ))}
        </ChoicesContainer>
      )}
    </DialogContainer>
  );
};

export default DialogBox;