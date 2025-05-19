import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import DialogBox from './DialogBox';
import CharacterDisplay from './CharacterDisplay';
import { useAuth } from '../../context/AuthContext'; // Update this path to match your project structure

const API_BASE_URL = 'http://localhost:8080/api/vn';
const API_POINTS_URL = 'http://localhost:8080/api/points/award';

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

const PointsNotification = styled.div`
  position: absolute;
  top: 50px;
  right: 50px;
  background-color: rgba(0, 0, 0, 0.8);
  color: #66c2ff;
  padding: 15px 20px;
  border-radius: 10px;
  font-size: 1.2rem;
  animation: fadeInOut 3s forwards;
  z-index: 20;
  
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateY(-20px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
`;

const VisualNovel = () => {
  const { currentUser } = useAuth(); // Get current user from auth context
  const userId = currentUser ? currentUser.id : null; // Use the user's ID from auth context
  
  const [currentNode, setCurrentNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPointsNotification, setShowPointsNotification] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(0);
  const [isEnding, setIsEnding] = useState(false);

  // Simple logging function for production
  const addDebugLog = (message) => {
    console.log(message);
  };

  useEffect(() => {
    // Don't try to fetch progress if no user is logged in
    if (!userId) {
      setError('Please log in to play the visual novel');
      setLoading(false);
      return;
    }

    // Check if player has progress
    const fetchProgress = async () => {
      try {
        addDebugLog(`Fetching player progress for user: ${userId}`);
        const progressResponse = await axios.get(`${API_BASE_URL}/progress?userId=${userId}`);
        
        if (progressResponse.data) {
          // Player has progress, fetch the saved node
          addDebugLog(`Found progress, loading node: ${progressResponse.data.currentNodeId}`);
          const nodeResponse = await axios.get(`${API_BASE_URL}/node/${progressResponse.data.currentNodeId}`);
          const node = nodeResponse.data;
          
          // Check if current node is an ending node
          if (!node.choices || node.choices.length === 0) {
            addDebugLog('Current node is an ending node');
            setIsEnding(true);
          }
          
          setCurrentNode(node);
        } else {
          // New player, start from beginning
          addDebugLog('No progress found, starting from beginning');
          const startResponse = await axios.get(`${API_BASE_URL}/start`);
          setCurrentNode(startResponse.data);
        }
      } catch (err) {
        addDebugLog(`Error fetching progress: ${err.message}`);
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
  }, [userId]);

  // Award points function - now takes a points amount parameter
  const awardPoints = async (points = 10, reason = 'story_progress') => {
    if (!userId) {
      addDebugLog('Cannot award points: No user logged in');
      return;
    }
    
    setPointsAwarded(points);
    setShowPointsNotification(true);
    
    addDebugLog(`Attempting to award ${points} points to user ${userId} for ${reason}`);
    
    const pointsData = {
      studentId: userId,
      points: points,
      activityType: 'VISUAL_NOVEL_PROGRESS',
      description: `Visual novel ${reason}`,
      timestamp: new Date().toISOString()
    };
    
    try {
      // Try the direct API approach
      const response = await axios.post(API_POINTS_URL, pointsData);
      addDebugLog(`Points API response: ${JSON.stringify(response.data)}`);
    } catch (error) {
      addDebugLog(`Direct API call failed: ${error.message}`);
      
      // Try with a simplified payload as fallback
      try {
        const simplifiedData = {
          studentId: userId,
          points: points,
          activityType: 'VISUAL_NOVEL_PROGRESS'
        };
        
        addDebugLog('Trying with simplified payload');
        await axios.post(API_POINTS_URL, simplifiedData);
      } catch (simplifiedError) {
        addDebugLog(`Simplified API call also failed: ${simplifiedError.message}`);
        
        // Final fallback - try as URL parameters
        try {
          addDebugLog('Trying as URL parameters');
          await axios.post(
            `${API_POINTS_URL}?studentId=${userId}&points=${points}&activityType=VISUAL_NOVEL_PROGRESS`
          );
        } catch (paramError) {
          addDebugLog(`Parameter API call failed: ${paramError.message}`);
        }
      }
    }
    
    // Show notification regardless of API success
    setTimeout(() => {
      setShowPointsNotification(false);
    }, 3000);
    
    // Add to localStorage as backup
    try {
      const existingPoints = localStorage.getItem(`vn_points_${userId}`) || '0';
      const newTotal = parseInt(existingPoints) + points;
      localStorage.setItem(`vn_points_${userId}`, newTotal.toString());
      addDebugLog(`Points saved to localStorage: ${newTotal}`);
    } catch (e) {
      addDebugLog(`Failed to save to localStorage: ${e.message}`);
    }
  };

  const handleChoiceSelect = async (nextNodeId) => {
    if (!userId) {
      setError('You need to be logged in to progress');
      return;
    }
    
    try {
      setLoading(true);
      addDebugLog(`Selected choice with nextNodeId: ${nextNodeId}`);
      
      // Fetch the next dialog node
      const nodeResponse = await axios.get(`${API_BASE_URL}/node/${nextNodeId}`);
      const nextNode = nodeResponse.data;
      addDebugLog(`Loaded node: ${JSON.stringify(nextNode)}`);
      
      // Save progress
      await axios.post(`${API_BASE_URL}/progress`, null, {
        params: {
          userId: userId,
          nodeId: nextNodeId
        }
      });
      addDebugLog('Progress saved');
      
      // Award points for progressing through the story
      const isEndingNode = !nextNode.choices || nextNode.choices.length === 0;
      
      if (isEndingNode) {
        addDebugLog('This is an ending node!');
        setIsEnding(true);
        // Award bonus points for completing the story
        await awardPoints(50, 'story_completion');
      } else {
        // Award standard points for progressing
        await awardPoints(10, 'story_progress');
      }
      
      setCurrentNode(nextNode);
    } catch (err) {
      addDebugLog(`Error in handleChoiceSelect: ${err.message}`);
      setError('Failed to progress. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Please log in to play the visual novel</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <GameContainer background={currentNode?.background || 'default'}>
      {showPointsNotification && (
        <PointsNotification>
          +{pointsAwarded} points earned!
        </PointsNotification>
      )}
      
      <CharacterDisplay 
        character={currentNode?.character} 
        image={currentNode?.characterImage} 
      />
      
      <DialogBox 
        text={currentNode?.text || ''}
        character={currentNode?.character}
        choices={currentNode?.choices || []}
        onChoiceSelect={handleChoiceSelect}
        isEnding={isEnding}
        onEnding={() => awardPoints(100, 'final_completion')}
      />
    </GameContainer>
  );
};

export default VisualNovel;