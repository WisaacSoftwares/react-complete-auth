import React, { useRef, useState } from 'react'
import { Form, Button, Card, Alert, Modal } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

// React Authentication Crash Course With Firebase And Routing - 22:21

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordCorfirmRef = useRef();
  const oldPassword = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  function handlePrevSubmit(e) {
    e.preventDefault();

    setError('');
    setMessage('');

    if (passwordRef.current.value !== passwordCorfirmRef.current.value) {
      return setError('Passwords do not match');
    }

    if (emailRef.current.value === currentUser.email
      && !passwordRef.current.value) {
      return setError('There is no changes in this form');
    }

    setShowModal(true);
    // oldPassword.current
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const promises = [];

    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(currentUser.email, oldPassword.current.value, emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(currentUser.email, oldPassword.current.value, passwordRef.current.value));
    }

    if (promises.length === 0) {
      setLoading(false);
      setShowModal(false);

      return setError('There is no changes to update in the form');
    }

    Promise.all(promises)
      .then(() => {
        setMessage('Success: profile updated!');
        emailRef.current.value = currentUser.email;
        passwordRef.current.value = '';
        passwordCorfirmRef.current.value = '';
        // navigate('/');
      })
      .catch((e) => {
        if (e.message === 'same-password') {
          setError('New password needs to be diferent than the old password');
        } else if (e.message === 'credentials-error') {
          if (emailRef.current.value !== currentUser.email) {
            setError('Credentials Error (last password) or Email already in use');
          } else {
            setError('Credentials Error, please check your last saved password');
          }
        } else {
          setError('Failed to update account');
        }
        console.error(e);
      }).finally(() => {
        setLoading(false);
        setShowModal(false);
      });
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className='text-center mb-4'>Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Form onSubmit={handlePrevSubmit}>
            <Form.Group id="email">
              <Form.Label>New Email</Form.Label>
              <Form.Control type="email" ref={emailRef} autoFocus required defaultValue={currentUser.email}></Form.Control>
            </Form.Group>
            <Form.Group id="password">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" ref={passwordRef} placeholder='Leave blank to keep the same'></Form.Control>
            </Form.Group>
            <Form.Group id="password-corfirm">
              <Form.Label>New Password Confirmation</Form.Label>
              <Form.Control type="password" ref={passwordCorfirmRef} placeholder='Leave blank to keep the same'></Form.Control>
            </Form.Group>
            <Button className='w-100 mt-3' type="submit">
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Back to Dashboard</Link>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered="true">
        <Modal.Header closeButton>
          <Modal.Title>One last step, before you go</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group id="oldPassword">
              <Form.Label>For security reasons, you need to specify your old password</Form.Label>
              <Form.Control type="password" autoFocus ref={oldPassword} required></Form.Control>
            </Form.Group>
            <Button disabled={loading} className='w-100 mt-3' type="submit">
              Update
            </Button>
            <div className="w-100 text-center mt-2">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
