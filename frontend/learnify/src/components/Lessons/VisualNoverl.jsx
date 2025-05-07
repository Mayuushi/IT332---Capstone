import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DialogBox from './DialogBox';
import CharacterDisplay from './CharacterDisplay';

const API_BASE_URL = 'http://localhost:8080/api/vn';
const USER_ID = 'demo-user'; // For simplicity in demo

const GameContainer = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background-image: ${props => `url('/images/backgrounds/${props.background}.jpg')`};
  background-size: cover;
  background-position: center;
  transition: background-image 0.5s ease-in-out;
`;

const VisualNovel = () => {
  const [currentNode, setCurrentNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if player has progress
    const fetchProgress = async () => {
      try {
        const progressResponse = await axios.get(`${API_BASE_URL}/progress?userId=${USER_ID}`);
        
        if (progressResponse.data) {
          // Player has progress, fetch the saved node
          const nodeResponse = await axios.get(`${API_BASE_URL}/node/${progressResponse.data.currentNodeId}`);
          setCurrentNode(nodeResponse.data);
        } else {
          // New player, start from beginning
          const startResponse = await axios.get(`${API_BASE_URL}/start`);
          setCurrentNode(startResponse.data);
        }
      } catch (err) {
        // If error or no progress, start from beginning
        try {
          const startResponse = await axios.get(`${API_BASE_URL}/start`);
          setCurrentNode(startResponse.data);
        } catch (startErr) {
          setError('Failed to load game. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleChoiceSelect = async (nextNodeId) => {
    try {
      setLoading(true);
      
      // Fetch the next dialog node
      const nodeResponse = await axios.get(`${API_BASE_URL}/node/${nextNodeId}`);
      
      // Save progress
      await axios.post(`${API_BASE_URL}/progress`, null, {
        params: {
          userId: USER_ID,
          nodeId: nextNodeId
        }
      });
      
      setCurrentNode(nodeResponse.data);
    } catch (err) {
      setError('Failed to progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <GameContainer background={currentNode.background}>
      <CharacterDisplay 
        character={currentNode.character} 
        image={currentNode.characterImage} 
      />
      <DialogBox 
        text={currentNode.text}
        character={currentNode.character}
        choices={currentNode.choices}
        onChoiceSelect={handleChoiceSelect}
      />
    </GameContainer>
  );
};

export default VisualNovel;