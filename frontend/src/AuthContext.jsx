import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from './firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        localStorage.setItem('userEmail', user.email);
        localStorage.setItem('userName', user.displayName || user.email.split('@')[0]);
      } else {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
      }
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const signup = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  const value = { currentUser, login, signup, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}