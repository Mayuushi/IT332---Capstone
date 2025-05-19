  import React, { useState, useEffect, useRef } from 'react';
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

  const ContinueButton = styled.button`
    background-color: rgba(102, 194, 255, 0.2);
    border: 1px solid #66c2ff;
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s ease;
    width: 150px;
    margin: 0 auto;
    display: block;

    &:hover {
      background-color: rgba(102, 194, 255, 0.4);
    }
  `;

  const ActionButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
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

  const DialogBox = ({ text, character, choices, onChoiceSelect, isEnding, onEnding }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const hasAwardedPoints = useRef(false);
    
    // Reset the awarded points flag when the text changes
    useEffect(() => {
      hasAwardedPoints.current = false;
      console.log("Reset points awarded flag - new dialog");
    }, [text]);
    
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
          
          // If this is an ending scene and we haven't awarded points yet
          if (isEnding && !hasAwardedPoints.current && onEnding) {
            console.log("Text finished typing - awarding points");
            hasAwardedPoints.current = true; // Prevent multiple awards
            onEnding();
          }
        }
      }, 20); // Speed of typing
      
      return () => clearInterval(typingInterval);
    }, [text, isEnding, onEnding]);
    
    const handleClick = () => {
      if (isTyping) {
        // Complete the text immediately if still typing
        setDisplayedText(text);
        setIsTyping(false);
      }
    };
    
    const handleCompletionClick = () => {
      if (isEnding && !hasAwardedPoints.current && onEnding) {
        console.log("Completion button clicked - awarding points");
        hasAwardedPoints.current = true; // Prevent multiple awards
        onEnding();
      }
      
      // Navigate to dashboard after a short delay
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    };
    
    return (
      <DialogContainer onClick={handleClick}>
        <CharacterName>{getCharacterDisplayName(character)}</CharacterName>
        <DialogText>{displayedText}</DialogText>
        
        {!isTyping && choices && choices.length > 0 && (
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
        
        {/* Show "Continue" button at the end of VN */}
        {!isTyping && isEnding && (
          <ActionButtonsContainer>
            <ContinueButton onClick={handleCompletionClick}>
              Complete Story
            </ContinueButton>
            
            {/* Explicit button to award points if needed */}
            <ContinueButton onClick={() => {
              if (onEnding) {
                console.log("Get Points button clicked");
                onEnding();
              }
            }}>
              Get Points
            </ContinueButton>
          </ActionButtonsContainer>
        )}
      </DialogContainer>
    );
  };

  export default DialogBox;