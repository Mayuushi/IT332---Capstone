import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url('/images/backgrounds/title_bg.gif');
  background-size: cover;
  background-position: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  margin-bottom: 2rem;
`;

const StartButton = styled.button`
  padding: 1rem 2rem;
  font-size: 1.5rem;
  background-color: #2c7bb6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #16537e;
    transform: scale(1.05);
  }
`;

const TitleScreen = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/lessons/nervous-system/play');
  };

  return (
    <TitleContainer>
      <Title>Journey Through the Nervous System</Title>
      <StartButton onClick={handleStart}>Start Learning</StartButton>
    </TitleContainer>
  );
};

export default TitleScreen;