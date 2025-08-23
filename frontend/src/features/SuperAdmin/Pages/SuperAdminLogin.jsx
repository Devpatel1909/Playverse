/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, Shield, Trophy, Zap, Star, Crown, Award, Target, Activity, ArrowRight, CheckCircle2, AlertCircle, Sparkles, Globe, Cpu, Database, BarChart3, Menu, X } from 'lucide-react';

const UltraModernsuperAdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    superadminName: '',
  // superadminCode removed
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedField, setFocusedField] = useState('');
  const [typingAnimation, setTypingAnimation] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);

  // Typing animation effect
  const titles = ["Cricket Command Center", "Live Match Control", "superAdmin Dashboard", "Data Analytics Hub"];
  
  useEffect(() => {
    let titleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    const typeEffect = () => {
      const currentTitle = titles[titleIndex];
      
      if (isDeleting) {
        setTypingAnimation(currentTitle.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypingAnimation(currentTitle.substring(0, charIndex + 1));
        charIndex++;
      }
      
      if (!isDeleting && charIndex === currentTitle.length) {
        setTimeout(() => { isDeleting = true; }, 2000);
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
      }
      
      const speed = isDeleting ? 100 : 150;
      setTimeout(typeEffect, speed);
    };
    
    typeEffect();
  }, []);

  // Mouse tracking with smooth interpolation (disabled on mobile)
  useEffect(() => {
    let animationFrameId;
    const handleMouseMove = (e) => {
      if (window.innerWidth >= 768) { // Only track on desktop
        const container = containerRef.current;
        if (container) {
          const rect = container.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          
          animationFrameId = requestAnimationFrame(() => {
            setMousePosition({ x, y });
          });
        }
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Password strength calculator
  useEffect(() => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 6) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^a-zA-Z0-9]/)) strength += 25;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.superadminName) {
        newErrors.superadminName = 'superAdmin name is required';
      } else if (formData.superadminName.length < 2) {
        newErrors.superadminName = 'Name must be at least 2 characters';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

  // superadminCode validation removed
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/superadmin/login' : '/api/superadmin/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : {
            superadminName: formData.superadminName,
            email: formData.email,
            password: formData.password
          };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setShowSuccessAnimation(true);
        setTimeout(() => {
          if (isLogin) {
            navigate('/superadmin/sports');
          } else {
            alert('✨ superAdmin account created successfully! Welcome to the team!');
            setIsLogin(true);
            setFormData({
              email: '',
              password: '',
              confirmPassword: '',
              superadminName: ''
            });
          }
          setIsLoading(false);
          setShowSuccessAnimation(false);
        }, 1500);
      } else {
        throw new Error(result.message || 'Operation failed');
      }
    } catch (error) {
      setIsLoading(false);
      alert(`Error: ${error.message}`);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      superadminName: ''
    });
    setFocusedField('');
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return 'from-red-500 to-red-600';
    if (passwordStrength <= 50) return 'from-yellow-500 to-orange-500';
    if (passwordStrength <= 75) return 'from-blue-500 to-blue-600';
    return 'from-emerald-500 to-green-600';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  return (
    <div ref={containerRef} className="relative w-full min-h-screen">
      {/* Ultra-modern animated background - Full Screen */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-violet-950"></div>
        
        {/* Dynamic mesh gradient - optimized for mobile */}
        <div 
          className="absolute inset-0 transition-all duration-1000 opacity-20 md:opacity-30"
          style={{
            background: typeof window !== 'undefined' && window.innerWidth >= 768 
              ? `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`
              : 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)'
          }}
        ></div>

        {/* Animated grid pattern - simplified for mobile */}
        <div className="absolute inset-0 opacity-5 md:opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: typeof window !== 'undefined' && window.innerWidth >= 768 ? '50px 50px' : '30px 30px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Floating geometric shapes - reduced for mobile */}
        {[...Array(typeof window !== 'undefined' && window.innerWidth >= 768 ? 20 : 8)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full blur-sm animate-float-${i % 4}`}
            style={{
              width: `${15 + (i % 3) * 10}px`,
              height: `${15 + (i % 3) * 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: `linear-gradient(135deg, ${
                i % 4 === 0 ? 'rgba(59, 130, 246, 0.08)' :
                i % 4 === 1 ? 'rgba(139, 92, 246, 0.08)' :
                i % 4 === 2 ? 'rgba(16, 185, 129, 0.08)' :
                'rgba(236, 72, 153, 0.08)'
              }, transparent)`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${8 + (i % 3) * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Success animation overlay */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 border md:p-12 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-xl rounded-3xl border-white/20 animate-scale-in">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full md:w-20 md:h-20 md:mb-6 bg-gradient-to-r from-emerald-500 to-blue-500 animate-pulse">
                <CheckCircle2 className="w-8 h-8 text-white md:w-10 md:h-10" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white md:text-2xl">Success!</h3>
              <p className="text-white/80">Processing your request...</p>
              <div className="flex justify-center mt-4 space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" style={{animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Centered Properly */}
      <div className="relative z-10 flex items-center justify-center w-full min-h-screen p-4 py-8">
        <div className="w-full max-w-sm mx-auto sm:max-w-md lg:max-w-lg xl:max-w-xl">
          {/* Main container with enhanced glass morphism */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-violet-500/20 to-emerald-500/20 rounded-3xl blur-xl animate-pulse-glow"></div>
            
            <div className="relative bg-white/[0.02] backdrop-blur-2xl rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
              {/* Enhanced header */}
              <div className="relative p-4 text-center border-b md:p-8 border-white/5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-violet-500/5 to-emerald-500/5"></div>
                
                <div className="relative z-10">
                  {/* Logo with animation - responsive size */}
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-4 transition-all duration-500 border shadow-lg md:w-24 md:h-24 md:mb-6 group rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500/20 to-violet-500/20 border-white/10 hover:scale-110 hover:rotate-3">
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-r from-blue-500 to-violet-500 rounded-xl md:rounded-2xl group-hover:opacity-10"></div>
                    <Crown className="w-8 h-8 text-blue-400 transition-colors duration-500 md:w-12 md:h-12 group-hover:text-white" />
                    <div className="absolute flex items-center justify-center w-4 h-4 rounded-full md:w-6 md:h-6 -top-1 -right-1 bg-emerald-500">
                      <Sparkles className="w-2 h-2 text-white md:w-3 md:h-3 animate-spin" />
                    </div>
                  </div>
                  
                  {/* Typing animation title - responsive text */}
                  <div className="h-6 mb-2 md:h-8">
                    <h1 className="text-lg font-bold text-transparent md:text-2xl bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text">
                      {typingAnimation}
                      <span className="animate-blink">|</span>
                    </h1>
                  </div>
                  
                  <p className="mb-3 text-sm md:mb-4 md:text-lg text-white/70">
                    {isLogin ? 'Professional superAdmin Access Portal' : 'Create Your superAdmin Account'}
                  </p>
                  
                  {/* Status indicators - responsive layout */}
                  <div className="flex justify-center space-x-3 text-xs md:space-x-4">
                    <div className="flex items-center space-x-1 text-emerald-400">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-ping"></div>
                      <Globe className="w-3 h-3" />
                      <span className="hidden sm:inline">Live</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-400">
                      <Database className="w-3 h-3" />
                      <span className="hidden sm:inline">Secure</span>
                    </div>
                    <div className="flex items-center space-x-1 text-violet-400">
                      <Cpu className="w-3 h-3" />
                      <span className="hidden sm:inline">Fast</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced form section - responsive padding */}
              <div className="p-4 space-y-4 md:p-8 md:space-y-6">
                {/* Professional mode toggle */}
                <div className="relative bg-white/[0.02] rounded-xl md:rounded-2xl p-0.5 md:p-1 border border-white/5">
                  <div 
                    className={`absolute top-0.5 md:top-1 bottom-0.5 md:bottom-1 rounded-lg md:rounded-xl bg-gradient-to-r transition-all duration-500 ease-out shadow-lg ${
                      isLogin 
                        ? 'left-0.5 md:left-1 right-1/2 from-blue-500/20 to-violet-500/20' 
                        : 'right-0.5 md:right-1 left-1/2 from-violet-500/20 to-emerald-500/20'
                    }`}
                  ></div>
                  
                  <div className="relative flex">
                    <button
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-center transition-all duration-300 text-sm md:text-base ${
                        isLogin 
                          ? 'text-white shadow-lg' 
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      <Shield className="inline w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
                      <span className="hidden sm:inline">superAdmin </span>Login
                    </button>
                    <button
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-semibold text-center transition-all duration-300 text-sm md:text-base ${
                        !isLogin 
                          ? 'text-white shadow-lg' 
                          : 'text-white/50 hover:text-white/80'
                      }`}
                    >
                      <Star className="inline w-3 h-3 mr-1 md:w-4 md:h-4 md:mr-2" />
                      Register
                    </button>
                  </div>
                </div>

                {/* Enhanced form fields with responsive design */}
                {!isLogin && (
                  <div className="space-y-2 animate-slide-in">
                    <label className="flex items-center block mb-2 text-xs font-semibold md:mb-3 md:text-sm text-white/90">
                      <User className="w-3 h-3 mr-2 md:w-4 md:h-4 text-violet-400" />
                      superAdministrator Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="superadminName"
                        value={formData.superadminName}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField('superadminName')}
                        onBlur={() => setFocusedField('')}
                        className={`w-full px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-white placeholder-white/40 backdrop-blur-sm text-sm md:text-base ${
                          errors.superadminName 
                            ? 'border-red-400/50 focus:border-red-400' 
                            : focusedField === 'superadminName'
                              ? 'border-violet-400 shadow-lg shadow-violet-400/20'
                              : 'border-white/10 hover:border-white/20'
                        }`}
                        placeholder="Enter your superadministrator name"
                      />
                      {focusedField === 'superadminName' && (
                        <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 animate-pulse-border"></div>
                      )}
                      {formData.superadminName && !errors.superadminName && (
                        <div className="absolute transform -translate-y-1/2 right-3 md:right-4 top-1/2">
                          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-scale-in" />
                        </div>
                      )}
                    </div>
                    {errors.superadminName && (
                      <div className="flex items-center space-x-2 text-xs text-red-400 md:text-sm animate-shake">
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{errors.superadminName}</span>
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="flex items-center block mb-2 text-xs font-semibold md:mb-3 md:text-sm text-white/90">
                    <Mail className="w-3 h-3 mr-2 text-blue-400 md:w-4 md:h-4" />
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-white placeholder-white/40 backdrop-blur-sm text-sm md:text-base ${
                        errors.email 
                          ? 'border-red-400/50 focus:border-red-400' 
                          : focusedField === 'email'
                            ? 'border-blue-400 shadow-lg shadow-blue-400/20'
                            : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="superadmin@cricket-pro.com"
                    />
                    {focusedField === 'email' && (
                      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500/10 to-emerald-500/10 animate-pulse-border"></div>
                    )}
                    {formData.email && /\S+@\S+\.\S+/.test(formData.email) && (
                      <div className="absolute transform -translate-y-1/2 right-3 md:right-4 top-1/2">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-scale-in" />
                      </div>
                    )}
                  </div>
                  {errors.email && (
                    <div className="flex items-center space-x-2 text-xs text-red-400 md:text-sm animate-shake">
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{errors.email}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center block mb-2 text-xs font-semibold md:mb-3 md:text-sm text-white/90">
                    <Lock className="w-3 h-3 mr-2 md:w-4 md:h-4 text-emerald-400" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                      className={`w-full px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-14 bg-white/[0.02] border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-white placeholder-white/40 backdrop-blur-sm text-sm md:text-base ${
                        errors.password 
                          ? 'border-red-400/50 focus:border-red-400' 
                          : focusedField === 'password'
                            ? 'border-emerald-400 shadow-lg shadow-emerald-400/20'
                            : 'border-white/10 hover:border-white/20'
                      }`}
                      placeholder="Enter your secure password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute p-1 transition-all duration-200 transform -translate-y-1/2 right-3 md:right-4 top-1/2 text-white/60 hover:text-white hover:scale-110"
                    >
                      {showPassword ? <EyeOff size={16} className="md:w-5 md:h-5" /> : <Eye size={16} className="md:w-5 md:h-5" />}
                    </button>
                    {focusedField === 'password' && (
                      <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500/10 to-blue-500/10 animate-pulse-border"></div>
                    )}
                  </div>
                  
                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-2 md:mt-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/60">Password Strength</span>
                        <span className={`font-semibold ${
                          passwordStrength <= 25 ? 'text-red-400' :
                          passwordStrength <= 50 ? 'text-yellow-400' :
                          passwordStrength <= 75 ? 'text-blue-400' : 'text-emerald-400'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="h-1.5 md:h-2 overflow-hidden rounded-full bg-white/10">
                        <div 
                          className={`h-full bg-gradient-to-r ${getPasswordStrengthColor()} transition-all duration-500 rounded-full`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {errors.password && (
                    <div className="flex items-center space-x-2 text-xs text-red-400 md:text-sm animate-shake">
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      <span>{errors.password}</span>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <>
                    <div className="space-y-2 animate-slide-in">
                      <label className="flex items-center block mb-2 text-xs font-semibold md:mb-3 md:text-sm text-white/90">
                        <Lock className="w-3 h-3 mr-2 md:w-4 md:h-4 text-violet-400" />
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField('')}
                          className={`w-full px-4 md:px-6 py-3 md:py-4 pr-12 md:pr-14 bg-white/[0.02] border-2 rounded-xl md:rounded-2xl transition-all duration-300 text-white placeholder-white/40 backdrop-blur-sm text-sm md:text-base ${
                            errors.confirmPassword 
                              ? 'border-red-400/50 focus:border-red-400' 
                              : focusedField === 'confirmPassword'
                                ? 'border-violet-400 shadow-lg shadow-violet-400/20'
                                : 'border-white/10 hover:border-white/20'
                          }`}
                          placeholder="Confirm your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute p-1 transition-all duration-200 transform -translate-y-1/2 right-3 md:right-4 top-1/2 text-white/60 hover:text-white hover:scale-110"
                        >
                          {showConfirmPassword ? <EyeOff size={16} className="md:w-5 md:h-5" /> : <Eye size={16} className="md:w-5 md:h-5" />}
                        </button>
                        {formData.confirmPassword && formData.password === formData.confirmPassword && (
                          <div className="absolute transform -translate-y-1/2 right-12 md:right-14 top-1/2">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-scale-in" />
                          </div>
                        )}
                      </div>
                      {errors.confirmPassword && (
                        <div className="flex items-center space-x-2 text-xs text-red-400 md:text-sm animate-shake">
                          <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{errors.confirmPassword}</span>
                        </div>
                      )}
                    </div>

                    {/* superadminCode input removed */}
                  </>
                )}

                {/* Ultra-modern submit button - responsive */}
                <div className="pt-3 md:pt-4">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="group relative w-full overflow-hidden rounded-xl md:rounded-2xl p-0.5 transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
                  >
                    {/* Animated border */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500 animate-gradient-rotate"></div>
                    
                    {/* Button content */}
                    <div className="relative flex items-center justify-center px-6 py-3 space-x-2 text-base font-bold text-white transition-all duration-300 md:px-8 md:py-4 md:space-x-3 md:text-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 rounded-xl md:rounded-2xl">
                      {isLoading ? (
                        <>
                          <div className="flex space-x-1">
                            {[...Array(3)].map((_, i) => (
                              <div key={i} className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                            ))}
                          </div>
                          <span>Processing...</span>
                          <div className="w-4 h-4 border-2 rounded-full md:w-6 md:h-6 border-white/30 border-t-white animate-spin"></div>
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-4 h-4 transition-transform md:w-5 md:h-5 group-hover:scale-110" />
                          <span className="text-sm md:text-base">{isLogin ? 'Launch superAdmin Dashboard' : 'Create superAdmin Account'}</span>
                          <ArrowRight className="w-4 h-4 transition-transform md:w-5 md:h-5 group-hover:translate-x-1" />
                        </>
                      )}
                    </div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-blue-400/20 to-violet-400/20 group-hover:opacity-100 rounded-xl md:rounded-2xl"></div>
                  </button>
                </div>

                {/* Enhanced toggle section - responsive */}
                <div className="pt-4 space-y-3 text-center md:pt-6 md:space-y-4">
                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/20"></div>
                    <div className="px-3 text-xs md:px-4 md:text-sm text-white/50">or</div>
                    <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/20"></div>
                  </div>
                  
                  <p className="mb-3 text-sm md:mb-4 md:text-base text-white/60">
                    {isLogin ? "Need superadmin privileges?" : "Already have access credentials?"}
                  </p>
                  
                  <button
                    onClick={toggleMode}
                    className="group inline-flex items-center space-x-2 px-4 md:px-6 py-2 md:py-3 bg-white/[0.02] border border-white/10 rounded-lg md:rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-emerald-400 group-hover:animate-spin" />
                    <span className="text-sm font-semibold text-transparent md:text-base bg-gradient-to-r from-emerald-400 via-blue-400 to-violet-400 bg-clip-text">
                      {isLogin ? 'Register New superAdmin' : 'Sign In to Dashboard'}
                    </span>
                    <ArrowRight className="w-3 h-3 text-blue-400 transition-transform md:w-4 md:h-4 group-hover:translate-x-1" />
                  </button>
                </div>

                {/* Stats section - responsive grid */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t md:gap-4 md:pt-6 border-white/5">
                  <div className="space-y-1 text-center md:space-y-2">
                    <div className="flex items-center justify-center w-6 h-6 mx-auto rounded-md md:w-8 md:h-8 md:rounded-lg bg-emerald-500/20">
                      <Shield className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
                    </div>
                    <div className="text-xs text-white/60">Secure</div>
                    <div className="text-xs font-semibold md:text-sm text-emerald-400">256-bit</div>
                  </div>
                  <div className="space-y-1 text-center md:space-y-2">
                    <div className="flex items-center justify-center w-6 h-6 mx-auto rounded-md md:w-8 md:h-8 md:rounded-lg bg-blue-500/20">
                      <Zap className="w-3 h-3 text-blue-400 md:w-4 md:h-4" />
                    </div>
                    <div className="text-xs text-white/60">Response</div>
                    <div className="text-xs font-semibold text-blue-400 md:text-sm">&lt;200ms</div>
                  </div>
                  <div className="space-y-1 text-center md:space-y-2">
                    <div className="flex items-center justify-center w-6 h-6 mx-auto rounded-md md:w-8 md:h-8 md:rounded-lg bg-violet-500/20">
                      <Activity className="w-3 h-3 md:w-4 md:h-4 text-violet-400" />
                    </div>
                    <div className="text-xs text-white/60">Uptime</div>
                    <div className="text-xs font-semibold md:text-sm text-violet-400">99.9%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced footer - responsive */}
          <div className="mt-6 text-center md:mt-8">
            <div className="inline-flex items-center space-x-3 md:space-x-4 px-4 md:px-6 py-2 md:py-3 bg-white/[0.02] backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/10">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold md:text-base text-white/80">Cricket Command Center</span>
              </div>
              <div className="w-px h-4 md:h-6 bg-white/20"></div>
              <div className="flex items-center space-x-2 text-xs md:text-sm text-white/60">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-400 animate-ping"></div>
                <span>Enterprise Ready</span>
              </div>
            </div>
            <p className="mt-2 text-xs md:mt-3 md:text-sm text-white/40">Powered by Next-Gen Authentication Technology</p>
          </div>
        </div>
      </div>

      {/* Advanced CSS animations */}
      <style jsx>{`
        @keyframes gradient-rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes float-0 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(-180deg); }
        }
        
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        
        @keyframes float-3 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-90deg); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-in {
          0% { transform: translateX(-20px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        @keyframes pulse-border {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        
        .animate-gradient-rotate {
          animation: gradient-rotate 3s linear infinite;
        }
        
        .animate-float-0 { animation: float-0 6s ease-in-out infinite; }
        .animate-float-1 { animation: float-1 7s ease-in-out infinite; }
        .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
        .animate-float-3 { animation: float-3 8s ease-in-out infinite; }
        
        .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
        .animate-blink { animation: blink 1s infinite; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-slide-in { animation: slide-in 0.5s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
        .animate-pulse-border { animation: pulse-border 2s ease-in-out infinite; }

        /* Mobile specific optimizations */
        @media (max-width: 768px) {
          .animate-float-0, .animate-float-1, .animate-float-2, .animate-float-3 {
            animation-duration: 4s;
          }
        }
      `}</style>
    </div>
  );
};

export default UltraModernsuperAdminAuth;