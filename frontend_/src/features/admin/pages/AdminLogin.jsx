/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import superAdminAPI from '../../../services/superAdminAPI';
import subAdminAPI from '../../../services/subAdminAPI';
import { motion } from 'framer-motion';

// Static list of sports used by the login page. Module-level to avoid
// React hook dependency warnings and allow safe reuse across effects.
const SPORTS_LIST = [
  { name: 'Cricket', key: 'cricket' },
  { name: 'Football', key: 'football' },
  { name: 'Basketball', key: 'basketball' },
  { name: 'Tennis', key: 'tennis' }
];

const ProfessionalLoginPage = () => {
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [sport, setSport] = useState('cricket');
  const [adminCreds, setAdminCreds] = useState({});
  const [selectedSportCred, setSelectedSportCred] = useState(null);
  const [loadingCreds, setLoadingCreds] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const formTouchedRef = useRef(false);

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch credentials for all sports on mount
  useEffect(() => {
    let mounted = true;
    setLoadingCreds(true);
    const baseApi = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const fetchCredForSport = async (sportKey) => {
      // Prefer the service method if available
      if (superAdminAPI && typeof superAdminAPI.getAdminCredentials === 'function') {
        try {
          const res = await superAdminAPI.getAdminCredentials(sportKey);
          // service returns { success, data } or { success: true, data: {...} }
          return res?.data ?? res;
        } catch (_err) {
          return null;
        }
      }

      // Fallback: call the credentials endpoint directly
      try {
        const url = `${baseApi.replace(/\/$/, '')}/api/credentials?sport=${encodeURIComponent(sportKey)}`;
        const r = await fetch(url, { method: 'GET' });
        if (!r.ok) return null;
        const j = await r.json().catch(() => null);
        return j?.data ?? j;
      } catch (_e) {
        return null;
      }
    };

    (async () => {
      try {
        const results = await Promise.all(
          SPORTS_LIST.map(async (s) => {
            const data = await fetchCredForSport(s.key);
            return { sport: s.key, data };
          })
        );
        if (!mounted) return;
        const creds = {};
        results.forEach(({ sport: sp, data }) => { creds[sp] = data; });
        setAdminCreds(creds);
      } finally {
        if (mounted) setLoadingCreds(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  // Auto-fill email/password when sport changes — but do not overwrite
  // if the user has already started typing (formTouched).
  useEffect(() => {
    if (adminCreds[sport]) {
      if (!formTouchedRef.current) {
        setLoginForm({
          email: adminCreds[sport].email || '',
          password: adminCreds[sport].password || ''
        });
      }
      setSelectedSportCred(adminCreds[sport] || null);
    } else {
      if (!formTouchedRef.current) setLoginForm({ email: '', password: '' });
      setSelectedSportCred(null);
    }
  }, [sport, adminCreds]);

  // Icons + UI components (kept your original look)
  const EyeIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
    </svg>
  );

  const LockIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const MailIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const TrophyIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const ShieldIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const AlertCircleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CheckCircleIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const CalendarIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );

  const SupportIcon = ({ className }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
    </svg>
  );

  // Professional UI Components
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white/95 backdrop-blur-lg border border-white/20 shadow-2xl ${className}`} style={{
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
    }}>
      {children}
    </div>
  );

  const CardHeader = ({ children, className = "" }) => (
    <div className={`px-8 py-6 ${className}`}>
      {children}
    </div>
  );

  const CardTitle = ({ children, className = "" }) => (
    <h3 className={`text-xl font-bold leading-none tracking-tight ${className}`}>
      {children}
    </h3>
  );

  const CardContent = ({ children, className = "" }) => (
    <div className={`px-8 pb-8 ${className}`}>
      {children}
    </div>
  );

  const Button = ({ children, onClick, disabled, type = "button", className = "" }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 transition-transform duration-300 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 group-hover:scale-105" />
      <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 group-hover:opacity-100" />
      <span className="relative z-10 text-white">{children}</span>
    </button>
  );

  const Input = ({ type = "text", placeholder, value, onChange, name, required, disabled, className = "" }) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      required={required}
      disabled={disabled}
      autoComplete={type === "email" ? "email" : type === "password" ? "current-password" : "off"}
      className={`flex w-full rounded-xl border-2 border-slate-200/60 bg-white/95 backdrop-blur-sm px-4 py-3 text-sm font-medium text-slate-800 transition-all duration-300 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 hover:border-slate-300 ${className}`}
    />
  );

  const Alert = ({ children, className = "", type = "error" }) => {
    const alertStyles = {
      error: "border-red-200/60 bg-red-50/80 backdrop-blur-sm",
      success: "border-emerald-200/60 bg-emerald-50/80 backdrop-blur-sm"
    };

    return (
      <div className={`relative w-full rounded-xl border-2 p-4 ${alertStyles[type]} ${className}`}>
        {children}
      </div>
    );
  };

  const AlertDescription = ({ children, className = "", type = "error" }) => {
    const textStyles = {
      error: "text-red-700",
      success: "text-emerald-700"
    };

    return (
      <div className={`text-sm font-medium flex items-center ${textStyles[type]} ${className}`}>
        {children}
      </div>
    );
  };

  const Badge = ({ children, className = "" }) => (
    <div className={`inline-flex items-center rounded-full border-2 border-emerald-200/60 bg-emerald-50/80 backdrop-blur-sm px-4 py-2 text-xs font-bold text-emerald-800 ${className}`}>
      {children}
    </div>
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const floatingAnimation = {
    y: [-10, 10, -10],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Input change handler - prevents spaces in email (single-word email field)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'email') {
      // Remove any whitespace characters to enforce a single "word" while typing/pasting
      // (this prevents the user from entering spaces/newlines/tabs)
      newValue = newValue.replace(/\s+/g, '');
      // Optionally, we could also prevent multiple '@' characters:
      const parts = newValue.split('@');
      if (parts.length > 2) {
        // keep first '@' and strip additional ones
        newValue = parts.shift() + '@' + parts.join('');
      }
    }

    setLoginForm(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Mark that the user has interacted with the form to avoid
    // auto-fill overwriting their input. Use a ref for immediate
    // visibility inside effects (avoids setState timing issues).
    if (!formTouchedRef.current) formTouchedRef.current = true;
    if (!formTouched) setFormTouched(true);
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Normalize email input (trim whitespace) at submit-time only.
    const normalizedEmail = loginForm.email ? loginForm.email.trim() : '';
    const normalizedPassword = loginForm.password || '';

    if (!normalizedEmail || !normalizedPassword) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (!normalizedEmail.includes('@')) {
      setError('Please enter a valid email address (must include @).');
      setLoading(false);
      return;
    }

    if (normalizedPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const adminEmail = normalizedEmail.toLowerCase();
      const baseApi = import.meta.env.VITE_API_URL || '';

      // 1) Try DB-backed login first
      if (sport === 'cricket') {
        const dbLogin = await subAdminAPI.loginCricketSubAdmin(adminEmail, normalizedPassword);
        if (dbLogin.success && dbLogin.data?.success && dbLogin.data?.data?.subAdmin) {
          const { subAdmin, token } = dbLogin.data.data;
          const sessionData = {
            email: subAdmin.email,
            role: 'sport_admin',
            sport: subAdmin.sport,
            name: subAdmin.name,
            permissions: subAdmin.permissions || [],
            loginTime: new Date().toISOString(),
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userAgent: navigator.userAgent,
            lastActivity: new Date().toISOString()
          };

          localStorage.setItem('authToken', token);
          localStorage.setItem('adminUser', JSON.stringify(sessionData));
          localStorage.setItem('adminToken', `api_admin_${Date.now()}`);

          setSuccess(`Login successful. Welcome ${subAdmin.name}. Redirecting...`);
          setTimeout(() => { window.location.href = '/admin/cricket'; }, 1200);
          setLoading(false);
          return;
        }
      }

      // 2) Fallback to dev credentials fetched from /api/credentials when present and matching
      if (selectedSportCred && selectedSportCred.email && selectedSportCred.email.toLowerCase() === adminEmail) {
        if (selectedSportCred.sport && selectedSportCred.sport !== sport && selectedSportCred.sport !== 'all') {
          setError(`Credentials provided are for the ${selectedSportCred.sport} admin. Please select that sport or use matching credentials.`);
          setLoading(false);
          return;
        }
        if (normalizedPassword === selectedSportCred.password) {
          // Optionally fetch sub-admin profile by email (protected route; may fail without token)
          let subAdminRecord = null;
          try {
            const url = `${baseApi.replace(/\/$/, '')}/api/${sport}/sub-admins/email/${encodeURIComponent(adminEmail)}`;
            const r = await fetch(url, { method: 'GET' });
            if (r.ok) {
              const j = await r.json().catch(() => null);
              if (j && j.success && j.data) subAdminRecord = j.data;
            }
          } catch (_e) {
            // ignore lookup failure; we still proceed with dev creds session
          }

          const name = subAdminRecord?.name || selectedSportCred.name || 'Sport Administrator';
          const sportKey = selectedSportCred.sport || sport;
          const redirectTo = '/admin/cricket';

          const sessionData = {
            email: adminEmail,
            role: sportKey === 'all' ? 'system_admin' : 'sport_admin',
            sport: sportKey,
            name,
            permissions: selectedSportCred.permissions || [],
            loginTime: new Date().toISOString(),
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userAgent: navigator.userAgent,
            lastActivity: new Date().toISOString()
          };

          localStorage.setItem('adminToken', `${sportKey}_admin_${Date.now()}`);
          localStorage.setItem('adminUser', JSON.stringify(sessionData));
          localStorage.setItem('authToken', `auth_${Date.now()}_${sportKey}`);

          setSuccess(`Welcome back, ${sessionData.name}! Redirecting...`);
          setTimeout(() => { window.location.href = redirectTo; }, 1200);
          setLoading(false);
          return;
        }
      }

      // Next, check hardcoded SPORT_ADMINS map (dev fallback)
      const SPORT_ADMINS = {
        'cricket.admin@sports.com': {
          password: 'cricket123',
          sport: 'cricket',
          name: 'Cricket Administrator',
          redirectTo: '/admin/cricket',
          permissions: ['cricket_management', 'player_management', 'match_scoring']
        },
        'football.admin@sports.com': {
          password: 'football123',
          sport: 'football',
          name: 'Football Administrator',
          redirectTo: '/admin/football',
          permissions: ['football_management', 'team_management', 'tournament_management']
        },
        'basketball.admin@sports.com': {
          password: 'basketball123',
          sport: 'basketball',
          name: 'Basketball Administrator',
          redirectTo: '/admin/basketball',
          permissions: ['basketball_management', 'league_management']
        },
        'tennis.admin@sports.com': {
          password: 'tennis123',
          sport: 'tennis',
          name: 'Tennis Administrator',
          redirectTo: '/admin/tennis',
          permissions: ['tennis_management', 'tournament_management']
        },
        'tempadmin@mail.com': {
          password: 'temppass123',
          sport: 'all',
          name: 'System Administrator',
          redirectTo: '/admin/overview',
          permissions: ['full_access', 'system_management', 'user_management']
        },
        'rohit.cricket@admin.com': {
          password: 'rohit@2025',
          sport: 'cricket',
          name: 'Rohit Sharma (Cricket Sub-Admin)',
          redirectTo: '/cricket-management',
          permissions: ['team_management', 'player_management', 'view_reports', 'match_management']
        },
        'dhoni.cricket@admin.com': {
          password: 'dhoni@2025',
          sport: 'cricket',
          name: 'MS Dhoni (Cricket Sub-Admin)',
          redirectTo: '/cricket-management',
          permissions: ['player_management', 'view_reports', 'match_management']
        }
      };

      const adminData = SPORT_ADMINS[adminEmail];
      if (adminData) {
        if (adminData.sport !== sport && adminData.sport !== 'all') {
          setError(`The entered credentials belong to the ${adminData.sport} admin. Please select that sport to login.`);
          setLoading(false);
          return;
        }

        if (normalizedPassword === adminData.password) {
          const sessionData = {
            email: adminEmail,
            role: adminData.sport === 'all' ? 'system_admin' : 'sport_admin',
            sport: adminData.sport,
            name: adminData.name,
            permissions: adminData.permissions,
            loginTime: new Date().toISOString(),
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            userAgent: navigator.userAgent,
            lastActivity: new Date().toISOString()
          };

          localStorage.setItem('adminToken', `${adminData.sport}_admin_${Date.now()}`);
          localStorage.setItem('adminUser', JSON.stringify(sessionData));
          localStorage.setItem('authToken', `auth_${Date.now()}_${adminData.sport}`);

          setSuccess(`Welcome back, ${sessionData.name}! Redirecting...`);
          setTimeout(() => { window.location.href = '/admin/cricket'; }, 1200);

          setLoading(false);
          return;
        } else {
          setError('Invalid password for the selected sport.');
          setLoading(false);
          return;
        }
      }

      // If all failed up to here, show generic message
      setError('Invalid credentials for the selected sport.');

    } catch (error) {
      console.error('Login error:', error);
      setError('System error occurred. Please try again or contact technical support.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSupportClick = () => {
    alert('📧 Technical Support: admin@sportsmanagement.com\n📞 Emergency Hotline: +1-800-SPORTS-1\n💬 Live Chat: Available 24/7 on dashboard\n\nFor immediate assistance with login credentials, please contact our technical support team.');
  };

  return (
    <div className="relative flex items-center justify-center w-screen h-screen min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 75%, #475569 100%)',
      minHeight: '100vh',
      minWidth: '100vw',
    }}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={floatingAnimation}
          className="absolute rounded-full -top-40 -right-40 w-80 h-80 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #10b981, #06d6a0)'
          }}
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
          className="absolute rounded-full -bottom-40 -left-40 w-96 h-96 opacity-10"
          style={{
            background: 'linear-gradient(135deg, #0891b2, #0e7490)'
          }}
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 4 } }}
          className="absolute w-64 h-64 rounded-full top-1/2 left-1/4 opacity-5"
          style={{
            background: 'linear-gradient(135deg, #059669, #047857)'
          }}
        />

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 opacity-20" />
      </div>

      {/* Centered Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex items-center justify-center w-full h-full px-4 py-8"
      >
        <div className="grid items-center w-full max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Left Side: Logo, Title, Subtitle */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center lg:items-start lg:text-left">
            <motion.div
              className="relative inline-block mb-8"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <div className="relative flex items-center justify-center w-20 h-20 mx-auto overflow-hidden text-white lg:mx-0 rounded-2xl"
                   style={{
                     background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)'
                   }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                <TrophyIcon className="relative z-10 w-10 h-10" />
              </div>
              <motion.div
                className="absolute -inset-2 rounded-3xl opacity-30 blur-xl"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)'
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              />
            </motion.div>

            <motion.h1
              className="mb-4 text-4xl font-black lg:text-5xl xl:text-6xl"
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Sports Admin Hub
            </motion.h1>

            <motion.p className="max-w-md mb-8 text-lg font-medium text-slate-300">
              Professional Match Scheduling & Management Platform
            </motion.p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Badge className="border-emerald-400/40 bg-emerald-500/10 text-emerald-300">
                <ShieldIcon className="w-4 h-4 mr-2" />
                Administrator Portal
              </Badge>
              <Badge className="text-blue-300 border-blue-400/40 bg-blue-500/10">
                <CalendarIcon className="w-4 h-4 mr-2" />
                2025-08-24 12:15:12 UTC
              </Badge>
            </div>
          </motion.div>

          {/* Right Side: Login Card */}
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-md rounded-3xl border-slate-200/20 backdrop-blur-2xl">
              <CardHeader className="border-b border-slate-200/20 bg-gradient-to-r from-slate-50/5 to-slate-100/5">
                <CardTitle className="flex items-center justify-center text-2xl font-bold text-center text-slate-800">
                  <CalendarIcon className="w-6 h-6 mr-3 text-emerald-600" />
                  Secure Access Portal
                </CardTitle>
              </CardHeader>

              <CardContent className="w-full pt-8">
                {/* Alert Messages */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mb-6"
                  >
                    <Alert type="error">
                      <AlertDescription type="error">
                        <AlertCircleIcon className="flex-shrink-0 w-5 h-5 mr-3" />
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mb-6"
                  >
                    <Alert type="success">
                      <AlertDescription type="success">
                        <CheckCircleIcon className="flex-shrink-0 w-5 h-5 mr-3" />
                        {success}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Sport Selection & Login Form */}
               {/* Sport Selection & Login Form */}
<form onSubmit={handleSubmit} className="space-y-6">
  {/* Sport Selection */}
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <label className="block mb-3 text-sm font-bold text-slate-700">
      Select Sport
    </label>
    <select
      className="w-full h-12 px-4 py-2 mb-2 text-base font-medium border-2 rounded-xl border-slate-200/60 bg-white/95 text-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 focus:outline-none"
      value={sport}
      onChange={e => setSport(e.target.value)}
      disabled={loadingCreds || loading}
      required
    >
      {SPORTS_LIST.map(s => (
        <option key={s.key} value={s.key}>{s.name}</option>
      ))}
    </select>
    {loadingCreds && (
      <span className="text-xs text-slate-400">
        Loading credentials...
      </span>
    )}
  </motion.div>

  {/* Email Input */}
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <label className="block mb-3 text-sm font-bold text-slate-700">
      System Email Address
    </label>
    <div className="relative">
      <MailIcon className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-400" />
      <input
        type="text"
        name="email"
        value={loginForm.email}
        onChange={handleInputChange}
        placeholder="Enter your system email"
        className="w-full pl-12 text-base font-medium bg-white border h-14 rounded-xl border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        required
        disabled={loading}
      />
    </div>
  </motion.div>

  {/* Password Input */}
  <motion.div
    whileHover={{ y: -2 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <label className="block mb-3 text-sm font-bold text-slate-700">
      System Password
    </label>
    <div className="relative">
      <LockIcon className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-slate-400" />
      <input
        type={showPassword ? "text" : "password"}
        name="password"
        value={loginForm.password}
        onChange={handleInputChange}
        placeholder="Enter your secure password"
        className="w-full pl-12 pr-12 text-base font-medium bg-white border h-14 rounded-xl border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        required
        disabled={loading}
      />
      <motion.button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute transition-colors duration-200 transform -translate-y-1/2 right-4 top-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
        disabled={loading}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {showPassword ? (
          <EyeOffIcon className="w-5 h-5" />
        ) : (
          <EyeIcon className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  </motion.div>

  {/* Submit Button */}
  <motion.div
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    transition={{ type: "spring", stiffness: 400, damping: 25 }}
  >
    <Button
      type="submit"
      disabled={loading || !loginForm.email || !loginForm.password}
      className="w-full text-base font-bold transition-shadow duration-300 shadow-lg h-14 rounded-xl hover:shadow-xl"
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 mr-3 border-2 border-white rounded-full border-t-transparent"
          />
          Authenticating Access...
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <ShieldIcon className="w-5 h-5 mr-3" />
          Access Admin Dashboard
        </div>
      )}
    </Button>
  </motion.div>
</form>


                {/* Support Section */}
                <motion.div
                  className="mt-8 text-center"
                  variants={itemVariants}
                >
                  <motion.button
                    type="button"
                    className="inline-flex items-center px-4 py-2 text-sm font-semibold transition-all duration-200 rounded-lg text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    onClick={handleSupportClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <SupportIcon className="w-4 h-4 mr-2" />
                    Need Help? Contact Support Center
                  </motion.button>

                  <div className="pt-4 mt-4 text-center border-t border-slate-200/30">
                    <div className="text-xs text-slate-500">
                      <span className="font-semibold">Current User:</span> Dsp2810<br />
                      <span className="font-semibold">System Time:</span> 2025-08-24 12:15:12 UTC<br />
                      <span className="font-semibold">Status:</span> <span className="font-bold text-green-600">🟢 Operational</span>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalLoginPage;
