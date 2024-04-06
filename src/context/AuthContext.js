import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail as updateProfileEmail,
  updatePassword as updateProfilePassword,
  EmailAuthProvider
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, SetCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  async function updateEmail(oldEmail, oldPassword, email) {
    var credentials = await EmailAuthProvider.credential(oldEmail, oldPassword);
    return await reauthenticateWithCredential(currentUser, credentials)
      .then(() => {
        return updateProfileEmail(currentUser, email);
      })
      .catch((e) => {
        console.error(e);
        throw new Error('credentials-error');
      })
  }

  async function updatePassword(oldEmail, oldPassword, password) {
    // Im using async so the error can be catched
    if (oldPassword === password) throw new Error('same-password');

    var credentials = await EmailAuthProvider.credential(oldEmail, oldPassword);
    return await reauthenticateWithCredential(currentUser, credentials)
      .then(() => {
        return updateProfilePassword(currentUser, password);
      })
      .catch((e) => {
        console.error(e);
        throw new Error('credentials-error');
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      SetCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);


  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
