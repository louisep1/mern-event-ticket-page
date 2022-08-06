import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'
import { signIn, signUp, reset } from '../features/user/userSlice'

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // for sign Up only
  const [password2, setPassword2] = useState('')
  const [name, setName] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [seller, setSeller] = useState(false)


  const [signingUp, setSigningUp] = useState(false)
  const [signingIn, setSigningIn] = useState(false)

  const { user, isError, message } = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
    if (isError) {
      // alert('Sign in details incorrect')
      alert(message)
      dispatch(reset())
    }
  }, [user, isError, message])

  const handleBack = () => {
    setSigningIn(false)
    setSigningUp(false)
  }

  const handleSubmit = e => {
    e.preventDefault()
    if (signingIn) {
      const data = {
        email,
        password
      }
      dispatch(signIn(data))
    }
    if (signingUp) {
      if (password !== password2) {
        alert('Passwords do not match')
      } else {
        const data = {
          email,
          password,
          name,
          contactNo,
          seller
        }
        dispatch(signUp(data))
      }
    }
    // dispatch signIn or signUp with corresponding data depending on signingIn/signingUp state
  }

  return (
    <>
      <Container>
        <h3 className='my-4'>{signingIn ? 'Sign In' : signingUp ? 'Sign Up' : 'Welcome, User'}</h3>
        {!signingIn && !signingUp && (
          <>
            <Button onClick={() => { setSigningIn(true) }}>Sign In</Button>
            <Button className='mx-3' onClick={() => { setSigningUp(true) }} >Sign Up</Button>
          </>
        )}
        {(signingIn || signingUp) && <Button onClick={handleBack}>Back</Button>}
        <Form className='my-3' onSubmit={handleSubmit}>
          {(signingIn || signingUp) && (
            <>
              <Form.Group >
                <Form.Label>Email address</Form.Label>
                <Form.Control type='email' placeholder='Enter email' value={email} onChange={e => setEmail(e.target.value)} />
              </Form.Group>

              <Form.Group className='my-3'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
            </>
          )}
          {signingUp && (
            <>
              <Form.Group className='my-3'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type='password' placeholder='Re-enter password' value={password2} onChange={e => setPassword2(e.target.value)} />
              </Form.Group>

              <Form.Group className='my-3'>
                <Form.Label>Name</Form.Label>
                <Form.Control type='text' placeholder='Enter name' value={name} onChange={e => setName(e.target.value)} />
              </Form.Group>

              <Form.Group className='my-3'>
                <Form.Label>Contact Number</Form.Label>
                <Form.Control type='string' placeholder='Enter contact Number' value={contactNo} onChange={e => setContactNo(e.target.value)} />
                <Form.Text className="text-muted">For overseas numbers, please include your country code.</Form.Text>
              </Form.Group>

              <Form.Group className="my-3" >
                <Form.Check type="checkbox" label="Check here for promoter-only accounts. *" checked={seller} onChange={e => setSeller(e.target.checked)} />
                <i style={{ fontSize: '14px' }}>* By checking this box, you also agree to allow your name, contact number and email to be displayed publicly.</i>
              </Form.Group>
            </>
          )}

          {(signingIn || signingUp) && <Button type='submit' className='my-3'>Submit</Button>}
        </Form>

      </Container>
    </>
  )
}

export default SignIn