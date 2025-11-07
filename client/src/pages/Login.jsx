// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const [state, setState] = useState('login');
  const navigate = useNavigate();
  const { setUser } = useAppContext();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = state === 'login' ? '/auth/login' : '/auth/register';
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        // keep this alert if you want a quick user-visible confirmation
        alert(result.message);
        if (state === 'register') {
          setState('login');
          setData({ name: '', email: '', password: '' });
        } else {
          console.log('Login successful:', result.user);
          setUser(result.user);

          // redirect after login if set by seat flow, otherwise home
          const redirect = sessionStorage.getItem('redirectAfterLogin');
          if (redirect) {
            sessionStorage.removeItem('redirectAfterLogin');
            navigate(redirect);
          } else {
            navigate('/');
          }
        }
      } else {
        alert(result.message || 'Auth failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="w-full max-w-sm sm:w-[350px] text-center 
          border border-zinc-300/60 dark:border-zinc-700 
          rounded-2xl px-6 py-8 bg-white dark:bg-zinc-900"
      >
        <h1 className="text-zinc-900 dark:text-white text-3xl mt-2 font-medium">
          {state === 'login' ? 'Login' : 'Register'}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-2 pb-4">
          Please {state === 'login' ? 'sign in' : 'sign up'} to continue
        </p>

        {state !== 'login' && (
          <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-4 gap-2">
            <input
              type="text"
              placeholder="Name"
              className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              autoComplete="name"
              required
            />
          </div>
        )}

        <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-4 gap-2">
          <input
            type="email"
            placeholder="Email id"
            className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            autoComplete="off"
            required
          />
        </div>

        <div className="flex items-center mt-4 w-full bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-4 gap-2">
          <input
            type="password"
            placeholder="Password"
            className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            autoComplete="new-password"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          {state === 'login' ? 'Login' : 'Create Account'}
        </button>

        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-3 mb-4">
          {state === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            className="text-indigo-500 dark:text-indigo-400"
            onClick={() => setState((prev) => (prev === 'login' ? 'register' : 'login'))}
          >
            {state === 'login' ? 'Register' : 'Login'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;