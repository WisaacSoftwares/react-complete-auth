import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OnlyNotAuth() {
  const { currentUser } = useAuth();

  return (
    currentUser
      ? <Navigate to="/" />
      : <Outlet />
  )
}
