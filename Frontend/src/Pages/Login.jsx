import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import axios from 'axios';

// Styled Components
const Card3D = styled(motion.div)`
  transform-style: preserve-3d;
  perspective: 1000px;
`;

const Input3D = styled(motion.input)`
  transform-style: preserve-3d;
  backface-visibility: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const Button3D = styled(motion.button)`
  position: relative;
  transform-style: preserve-3d;
  &::before {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 100%;
    background: #4f46e5;
    border-radius: 8px;
    transform: translateZ(-8px);
    transition: all 0.3s ease;
  }
  &:hover::before {
    transform: translateZ(-12px);
    bottom: -12px;
  }
`;

const FloatingShape = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), transparent);
  filter: blur(20px);
  z-index: -1;
`;

// Component
const Login = () => {
  const [formData, setFormData] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        userId: formData.userId,
        password: formData.password
      });

      if (res.data.success) {
        navigate('/dashboard');
      } else {
        setError(res.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const floatingAnimation = {
    y: [0, 20, 0],
    transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-indigo-100 relative overflow-hidden">
      <FloatingShape animate={floatingAnimation} style={{ width: '300px', height: '300px', top: '10%', left: '10%' }} />
      <FloatingShape animate={{ ...floatingAnimation, y: [0, -20, 0] }} style={{ width: '400px', height: '400px', bottom: '10%', right: '10%' }} />

      <Card3D className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-2xl">
        <motion.div animate={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
          <h2 className="text-center text-4xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-center text-gray-500 mb-6">Sign in to your account</p>
        </motion.div>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-md text-center mb-4">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input3D
              type="text"
              name="userId"
              placeholder="User ID"
              required
              className="w-full px-5 py-3 border bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              whileHover={{ y: -1 }}
            />
            <Input3D
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-5 py-3 border bg-gray-50 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              whileHover={{ y: -1 }}
            />
          </div>

          <div className="flex justify-between text-sm text-indigo-600 font-medium">
            <Link to="/forgot-password" className="hover:text-indigo-500">Forgot password?</Link>
            <Link to="/signup" className="hover:text-indigo-500">Create account</Link>
          </div>

          <Button3D
            type="submit"
            className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg shadow-md"
            whileHover={{ y: -1 }}
            whileTap={{ y: 1 }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button3D>
        </form>
      </Card3D>
    </div>
  );
};

export default Login;
