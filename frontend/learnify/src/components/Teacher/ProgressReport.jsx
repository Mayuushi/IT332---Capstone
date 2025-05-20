import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import classService from '../../services/classService';
import {
  fetchClassPerformance,
  fetchQuizAverages,
  fetchEngagementHeatmap,
  fetchTemporalProgress,
} from '../../services/progressReportService';
import ClassPerformanceChart from './ClassPerformanceChart';
import QuizAverageChart from './QuizAverageChart';
import EngagementHeatmap from './EngagementHeatmap';
import TemporalProgressChart from './TemporalProgressChart';

export default function ProgressReport() {
  const { currentUser, isTeacher } = useAuth();
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const [classPerformance, setClassPerformance] = useState([]);
  const [quizAverages, setQuizAverages] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [temporalData, setTemporalData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    async function fetchClasses() {
      setLoading(true);
      setError(null);
      try {
        let data = [];
        if (isTeacher) {
          data = await classService.getClassesByTeacherId(currentUser.id);
        } else {
          data = await classService.getClassesByStudentIdWithUsers(currentUser.id);
        }
        setClasses(data);
        if (data.length > 0) {
          setSelectedClassId(data[0].id);
        } else {
          setSelectedClassId(null);
        }
      } catch (err) {
        setError('Failed to load classes.');
        setSelectedClassId(null);
      } finally {
        setLoading(false);
      }
    }
    fetchClasses();
  }, [currentUser, isTeacher]);

  useEffect(() => {
    if (!selectedClassId) return;

    async function fetchAllProgressData() {
      setLoading(true);
      setError(null);
      try {
        const [
          classPerfRes,
          quizAvgRes,
          heatmapRes,
          temporalRes,
        ] = await Promise.all([
          fetchClassPerformance(selectedClassId),
          fetchQuizAverages(selectedClassId),
          fetchEngagementHeatmap(selectedClassId),
          fetchTemporalProgress(selectedClassId),
        ]);
        setClassPerformance(classPerfRes.data || []);
        setQuizAverages(quizAvgRes.data || []);
        setHeatmapData(heatmapRes.data || []);
        setTemporalData(temporalRes.data || []);
      } catch (err) {
        setError('Failed to load progress report data.');
      } finally {
        setLoading(false);
      }
    }

    fetchAllProgressData();
  }, [selectedClassId]);

  if (!currentUser || !currentUser.id) {
    return <div>Loading user data...</div>;
  }

  if (loading) {
    return <div>Loading progress report...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Visual Progress Report</h1>

      <div className="mb-4">
        <label htmlFor="class-select" className="mr-2">Select Class:</label>
        <select
          id="class-select"
          value={selectedClassId || ''}
          onChange={(e) => setSelectedClassId(e.target.value)}
        >
          <option value="" disabled>
            -- Select a class --
          </option>
          {classes.map((cls) => (
            <option key={cls.id} value={cls.id}>
              {cls.topic}
            </option>
          ))}
        </select>
      </div>

      {selectedClassId ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '20px',
          }}
        >
          <div style={{ border: '1px solid #ccc', padding: '10px' }}>
            <ClassPerformanceChart data={classPerformance} />
          </div>

          <div style={{ border: '1px solid #ccc', padding: '10px' }}>
            <QuizAverageChart data={quizAverages} />
          </div>

          <div style={{ border: '1px solid #ccc', padding: '10px' }}>
            <EngagementHeatmap data={heatmapData} />
          </div>

          {/* Empty placeholder box */}
          <div
            style={{
              border: '1px dashed #aaa',
              backgroundColor: '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontStyle: 'italic',
              fontSize: '1rem',
            }}
          >
            {/* You can put any placeholder text or leave blank */}
            Empty Box
          </div>
        </div>
      ) : (
        <p>No classes available to show progress report.</p>
      )}
    </div>
  );
}
