import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ProfessionalInterviewSession from '../components/ProfessionalInterviewSession';
import { InterviewSession } from '../types';
import { useAuth } from '../contexts/AuthContext';

const ProfessionalInterview: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  useEffect(() => {
    // Prevent multiple navigation attempts
    if (isNavigating) return;
    
    // Get session ID from URL query parameters
    const { session_id } = router.query;
    if (session_id && !isNavigating) {
      setSessionId(Number(session_id));
    } else if (!session_id && router.isReady && !isNavigating) {
      // Only redirect if router is ready and we're not already navigating
      setIsNavigating(true);
      router.replace('/dashboard');
    }
  }, [router.query, router.isReady, isNavigating]);

  const handleInterviewComplete = (session: InterviewSession) => {
    if (!isNavigating) {
      setIsNavigating(true);
      // Redirect to results page
      router.replace(`/interview/results?session_id=${session.id}`);
    }
  };

  const handleExitInterview = () => {
    if (!isNavigating) {
      setIsNavigating(true);
      // Redirect back to dashboard
      router.replace('/dashboard');
    }
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Loading Interview...
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Please wait while we prepare your interview session.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProfessionalInterviewSession
      sessionId={sessionId}
      onComplete={handleInterviewComplete}
      onExit={handleExitInterview}
    />
  );
};

export default ProfessionalInterview;
