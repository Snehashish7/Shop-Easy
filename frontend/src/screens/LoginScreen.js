/*
  unable to understand how the front end was able to communicate with the backend for email and password authentication/verification .

  Please may I know the name of the variables and functions used that helped in the process.

  Please may I get an explanation.


  Bassir
  Answer

  hello there,

  backend is host in this address: https://localhost:5000

  we use proxy to access to backend using / instead of https://localhost:5000

  here:

  https://github.com/bradtraversy/proshop_mern/blob/master/frontend/package.json#L3

  in the frontend we use axios to connect to backend and fetch data or authenticate user like this:

  https://github.com/bradtraversy/proshop_mern/blob/master/frontend/src/actions/userActions.js#L42

  and it the backend we get data from frontend to verify:

  https://github.com/bradtraversy/proshop_mern/blob/master/backend/controllers/userController.js#L9
*/

import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import FormContainter from '../components/FormContainter'
import { login } from '../actions/userActions'

const LoginScreen = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()
  const userLogin = useSelector(state => state.userLogin) //we want to get the user login from state
  const { userInfo, loading, error } = userLogin

  const navigate = useNavigate()
  const location = useLocation()
  //redirect will contain the right side of querry delimited by "="
  const redirect = location.search ? location.search.split('=')[1] : '/' //location.search contains URL querry string

  useEffect(() => {
    if (userInfo) {
      navigate(redirect)
    }
  }, [navigate, userInfo, redirect])


  const submitHandler = (e) => {
    e.preventDefault(); //page does not refresh
    //DISPATCH LOGIN info
    dispatch(login(email, password))
  }

  return (
    <FormContainter>
      <h1>Sign In</h1>
      {error && <Message variant='danger'>{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}  //in useState setEmail is the object/function of 'email'
          //therefore we use it to set the value of email.
          >

          </Form.Control>
        </Form.Group>

        <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >

          </Form.Control>
        </Form.Group>
        <Button type='submit' className='mt-3' variant='primary'>Sign In</Button>
      </Form>

      <Row className='py-3'>
        <Col>
          New Customer?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
        </Col>
      </Row>

    </FormContainter>
  )
}

export default LoginScreen