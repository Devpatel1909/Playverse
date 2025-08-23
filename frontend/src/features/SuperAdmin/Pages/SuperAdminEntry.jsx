import React, { useState, useEffect } from 'react';
import ParticleTextEffect from '../../../components/ui/ParticleTextEffect.jsx';
import SuperAdminLogin from './SuperAdminLogin.jsx';

const SuperAdminEntry = () => {
  const [showParticles, setShowParticles] = useState(true);

  // Auto-hide particles after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowParticles(false);
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleParticleComplete = () => {
    setShowParticles(false);
  };

  if (showParticles) {
    return (
      <ParticleTextEffect
        words={["CRICKET", "COMMAND", "CENTER", "SUPERADMIN", "PORTAL"]}
        onComplete={handleParticleComplete}
        duration={8000}
      />
    );
  }

  return <SuperAdminLogin />;
};

export default SuperAdminEntry;
