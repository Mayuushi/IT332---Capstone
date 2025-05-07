import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Brain, Zap, Activity, Network, MousePointer, Clock } from 'lucide-react';

// Nervous System lesson data
const lessons = [
  {
    id: 1,
    title: "Introduction to Nervous System",
    description: "Basic structure and function of the nervous system",
    icon: <Brain size={24} />,
    duration: "10 min"
  }
//   {
//     id: 2,
//     title: "Central Nervous System",
//     description: "The brain and spinal cord",
//     icon: <Brain size={24} />,
//     duration: "30 min"
//   },
//   {
//     id: 3,
//     title: "Peripheral Nervous System",
//     description: "Cranial and spinal nerves",
//     icon: <Network size={24} />,
//     duration: "20 min"
//   },
//   {
//     id: 4,
//     title: "Neurons and Nerve Impulses",
//     description: "Structure of neurons and transmission of signals",
//     icon: <Zap size={24} />,
//     duration: "35 min"
//   },
//   {
//     id: 5,
//     title: "Reflexes and Reactions",
//     description: "How the nervous system responds to stimuli",
//     icon: <MousePointer size={24} />,
//     duration: "25 min"
//   },
//   {
//     id: 6,
//     title: "Disorders of Nervous System",
//     description: "Common neurological disorders and treatments",
//     icon: <Activity size={24} />,
//     duration: "40 min"
//   }
];

export default function NervousSystemLessonPicker() {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const navigate = useNavigate();

  const handleSelectLesson = (lesson) => {
    setSelectedLesson(lesson);
  };
  
  const startLesson = () => {
    if (selectedLesson) {
      navigate(`/lessons/nervous-system`);
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Nervous System</h1>
        <p style={styles.subtitle}>
          Explore the complex network that coordinates your body's actions and sensory information
        </p>
      </div>
      
      <div style={styles.lessonGrid}>
        {lessons.map((lesson) => (
          <div 
            key={lesson.id}
            onClick={() => handleSelectLesson(lesson)}
            style={selectedLesson?.id === lesson.id ? {...styles.lessonCard, ...styles.lessonCardSelected} : styles.lessonCard}
          >
            <div style={styles.iconContainer}>
              {lesson.icon}
            </div>
            <h3 style={styles.lessonTitle}>{lesson.title}</h3>
            <p style={styles.lessonDescription}>{lesson.description}</p>
            <div style={styles.durationContainer}>
              <Clock size={14} style={{marginRight: '5px'}} />
              <span>{lesson.duration}</span>
            </div>
          </div>
        ))}
      </div>
      
      {selectedLesson && (
        <div style={styles.detailsCard}>
          <h2 style={styles.detailsTitle}>
            {selectedLesson.title}
          </h2>
          <p style={styles.detailsDescription}>
            {selectedLesson.description}
          </p>
          <button 
            onClick={startLesson}
            style={styles.button}
          >
            Start Lesson
          </button>
        </div>
      )}
    </div>
  );
}

// Inline styles 
const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '24px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    marginBottom: '24px'
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '8px'
  },
  subtitle: {
    color: '#666',
    fontSize: '16px',
    marginTop: '0'
  },
  lessonGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '16px',
  },
  lessonCard: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    flexDirection: 'column'
  },
  lessonCardSelected: {
    borderColor: '#3b82f6',
    borderWidth: '2px',
    boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
    backgroundColor: '#f0f7ff'
  },
  iconContainer: {
    display: 'inline-flex',
    padding: '10px',
    backgroundColor: '#f3f4f6',
    borderRadius: '50%',
    marginBottom: '12px',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'fit-content'
  },
  lessonTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '0',
    marginBottom: '8px'
  },
  lessonDescription: {
    fontSize: '14px',
    color: '#666',
    marginTop: '0',
    marginBottom: '12px'
  },
  durationContainer: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#777',
    marginTop: 'auto'
  },
  detailsCard: {
    marginTop: '24px',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #3b82f6'
  },
  detailsTitle: {
    fontSize: '22px',
    fontWeight: 'bold',
    color: '#333',
    marginTop: '0',
    marginBottom: '10px'
  },
  detailsDescription: {
    color: '#555',
    marginBottom: '16px'
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#fff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    outline: 'none'
  }
};