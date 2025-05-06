// QuizWrapper.jsx
import { useParams } from 'react-router-dom';
import Quiz from './Quiz';

const QuizWrapper = () => {
  const { classId } = useParams();
  return <Quiz classId={classId} />;
};

export default QuizWrapper;
