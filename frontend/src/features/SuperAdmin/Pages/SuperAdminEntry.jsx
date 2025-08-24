/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import ParticleTextEffect from '../../../components/ui/ParticleTextEffect.jsx';
import SuperAdminLogin from './SuperAdminLogin.jsx';

const SuperAdminEntry = () => {
  const words = ["COMMAND", "CENTER", "SUPERADMIN", "PORTAL"];
  
  const displayTimePerWord = 2500; // ms each word stays on screen (2.5s)
  const transitionTime = 800;      // ms transition between words
  const totalDuration = (words.length * (displayTimePerWord + transitionTime)) + 1000;
  
  const [showParticles, setShowParticles] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const timeoutRef = useRef();
  const intervalRef = useRef();

  // Handle word sequencing with smooth transitions
  useEffect(() => {
    if (!showParticles) return;

    const scheduleWords = () => {
      let index = 0;
      
      // Show first word immediately
      setCurrentWordIndex(0);
      
      // Set up interval for subsequent words
      intervalRef.current = setInterval(() => {
        index++;
        if (index < words.length) {
          setCurrentWordIndex(index);
        } else {
          // Clear interval when all words are shown
          clearInterval(intervalRef.current);
        }
      }, displayTimePerWord + transitionTime);
      
      // Set timeout to hide particles after total duration
      timeoutRef.current = setTimeout(() => {
        setShowParticles(false);
      }, totalDuration);
    };

    scheduleWords();

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [showParticles, words.length, displayTimePerWord, transitionTime, totalDuration]);

  // Handle manual completion
  const handleParticleComplete = () => {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
    setShowParticles(false);
  };

  if (showParticles) {
    return (
      <ParticleTextEffect
        words={words}
        currentWordIndex={currentWordIndex}
        externalControl={true}
        onComplete={handleParticleComplete}
        duration={totalDuration}
      />
    );
  }

  return <SuperAdminLogin />;
};

export default SuperAdminEntry;