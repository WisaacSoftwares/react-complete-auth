import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

// React Authentication Crash Course With Firebase And Routing - 22:21

export default function ForgotPassword() {
  const emailRef = useRef();
  const { resetPassword, currentUser } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage('Check your inbox for futher instructions')
    } catch (e) {
      setError('Failed to reset password');
      console.error(e);
    }

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Password Reset</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" ref={emailRef} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type="submit">
              Reset Password
            </Button>
          </Form>
          <div className="w-100 text-center mt-3">
            { !currentUser ? <Link to="/login">Login</Link> : null }
          </div>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
      { !currentUser ? <>Need an account? <Link to="/signup">Sign Up</Link></> : <Link to="/update-profile">Back to Update Profile</Link> }
        
      </div>
    </>
  )
}
