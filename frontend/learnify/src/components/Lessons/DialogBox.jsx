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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
`;

const CharacterName = styled.div`
  font-weight: bold;
  font-size: 1.2rem;
  color: #66c2ff;
  margin-bottom: 10px;
  text-shadow: 0 0 5px rgba(102, 194, 255, 0.5);
`;

const DialogText = styled.div`
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 20px;
  min-height: 60px;
`;

const ChoicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  opacity: ${props => props.fadeIn ? '1' : '0'};
  transform: translateY(${props => props.fadeIn ? '0' : '10px'});
  transition: all 0.5s ease;
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
  position: relative;
  overflow: hidden;

  &:hover {
    background-color: rgba(102, 194, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
  
  &::after {
    content: '▶';
    position: absolute;
    right: 15px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover::after {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background-color: rgba(102, 194, 255, 0.2);
  border: 1px solid #66c2ff;
  color: white;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;
  min-width: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: rgba(102, 194, 255, 0.4);
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  opacity: ${props => props.fadeIn ? '1' : '0'};
  transform: translateY(${props => props.fadeIn ? '0' : '10px'});
  transition: all 0.5s ease;
`;

const TextSpeedControls = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 5px;
`;

const SpeedButton = styled.button`
  background-color: ${props => props.active ? 'rgba(102, 194, 255, 0.4)' : 'rgba(102, 194, 255, 0.1)'};
  border: 1px solid #66c2ff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(102, 194, 255, 0.3);
  }
`;

const SkipButton = styled.button`
  position: absolute;
  bottom: 10px;
  right: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

// Speed settings in milliseconds
const SPEEDS = {
  slow: 30,
  normal: 20,
  fast: 10,
  instant: 0
};

const getCharacterDisplayName = (characterId) => {
  const characters = {
    doctor: 'Dr. Neura',
    student: 'Student',
    assistant: 'Lab Assistant',
    // Add more character mappings as needed
  };
  
  return characters[characterId] || characterId;
};

const DialogBox = ({ 
  text, 
  character, 
  choices, 
  onChoiceSelect, 
  isEnding, 
  onEnding, 
  onReturnToLessons 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [typingSpeed, setTypingSpeed] = useState('normal');
  const [showChoices, setShowChoices] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const hasAwardedPoints = useRef(false);
  
  // Reset the awarded points flag when the text changes
  useEffect(() => {
    hasAwardedPoints.current = false;
    setShowChoices(false);
    setShowActions(false);
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
        
        // Show choices/actions with animation delay
        setTimeout(() => {
          if (choices && choices.length > 0) {
            setShowChoices(true);
          }
          
          if (isEnding) {
            setShowActions(true);
          }
        }, 300);
        
        // If this is an ending scene and we haven't awarded points yet
        if (isEnding && !hasAwardedPoints.current && onEnding) {
          console.log("Text finished typing - awarding points");
          hasAwardedPoints.current = true; // Prevent multiple awards
          onEnding();
        }
      }
    }, typingSpeed === 'instant' ? 0 : SPEEDS[typingSpeed]); // Speed of typing based on setting
    
    return () => clearInterval(typingInterval);
  }, [text, isEnding, onEnding, typingSpeed, choices]);
  
  const handleClick = () => {
    if (isTyping) {
      // Complete the text immediately if still typing
      setDisplayedText(text);
      setIsTyping(false);
      
      // Show choices/actions immediately
      if (choices && choices.length > 0) {
        setShowChoices(true);
      }
      
      if (isEnding) {
        setShowActions(true);
      }
    }
  };
  
  const handleCompletionClick = () => {
    if (isEnding && !hasAwardedPoints.current && onEnding) {
      console.log("Completion button clicked - awarding points");
      hasAwardedPoints.current = true; // Prevent multiple awards
      onEnding();
    }
    
    // Use the onReturnToLessons function from parent component
    if (onReturnToLessons) {
      onReturnToLessons();
    }
  };
  
  const handleGetPointsClick = () => {
    if (onEnding) {
      console.log("Get Points button clicked");
      onEnding();
    }
  };
  
  return (
    <DialogContainer onClick={handleClick}>
      <CharacterName>{getCharacterDisplayName(character)}</CharacterName>
      <DialogText>{displayedText}</DialogText>
      
      <TextSpeedControls>
        <SpeedButton 
          active={typingSpeed === 'slow'} 
          onClick={(e) => {
            e.stopPropagation();
            setTypingSpeed('slow');
          }}
        >
          1x
        </SpeedButton>
        <SpeedButton 
          active={typingSpeed === 'normal'} 
          onClick={(e) => {
            e.stopPropagation();
            setTypingSpeed('normal');
          }}
        >
          2x
        </SpeedButton>
        <SpeedButton 
          active={typingSpeed === 'fast'} 
          onClick={(e) => {
            e.stopPropagation();
            setTypingSpeed('fast');
          }}
        >
          3x
        </SpeedButton>
      </TextSpeedControls>
      
      {isTyping && (
        <SkipButton
          onClick={(e) => {
            e.stopPropagation();
            setTypingSpeed('instant');
          }}
        >
          Skip
        </SkipButton>
      )}
      
      {!isTyping && choices && choices.length > 0 && (
        <ChoicesContainer fadeIn={showChoices}>
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
      
      {/* Show action buttons at the end of VN */}
      {!isTyping && isEnding && (
        <ActionButtonsContainer fadeIn={showActions}>
          <ActionButton onClick={handleCompletionClick}>
            <span>Return to Lessons</span>
            <span>→</span>
          </ActionButton>
          
          {/* Explicit button to award points if needed */}
          <ActionButton onClick={handleGetPointsClick}>
            <span>✓</span>
            <span>Get Points</span>
          </ActionButton>
        </ActionButtonsContainer>
      )}
    </DialogContainer>
  );
};

export default DialogBox;