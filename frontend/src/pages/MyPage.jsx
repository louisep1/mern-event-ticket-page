import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Card, ListGroup, Row, Col, Button, Form } from 'react-bootstrap'
import { updateUser, getUser, reset } from '../features/user/userSlice'
import { BsBackspace } from 'react-icons/bs'

const MyPage = () => {
  const location = useLocation()
  const [editing, setEditing] = useState(false)
  const { user, updatedSuccess } = useSelector(state => state.user)

  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    contactNo: '',
  })

  const { name, contactNo } = updatedUser

  const [updatedAddress, setUpdatedAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    area: '',
    code: '',
    country: ''
  })

  const { line1, line2, city, area, code, country } = updatedAddress

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // if the previous page was basket
    if (location.state && location.state.edit) {
      setEditing(true)
    }

    if (!user) {
      navigate('/')
    }

    dispatch(getUser())
  }, [updatedSuccess])

  useEffect(() => {
    if (user && user.address) {
      setUpdatedUser({
        name: user.name,
        contactNo: user.contactNo,
      })
      setUpdatedAddress({
        line1: user.address.line1,
        line2: user.address.line2,
        city: user.address.city,
        area: user.address.area,
        code: user.address.code,
        country: user.address.country
      })
    }

    return () => {
      dispatch(reset())
    }
  }, [user])


  const handleChange = e => {
    setUpdatedAddress(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    })
    )
  }

  const handleContactChange = e => {
    setUpdatedUser(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    })
    )
  }

  const updateDetails = e => {
    if (e.target.name === 'contact') {
      const contactData = { ...updatedUser, updateAddress: false }
      dispatch(updateUser(contactData))
    }

    if (e.target.name === 'address') {
      const addressData = { ...updatedAddress, updateAddress: true }
      dispatch(updateUser(addressData))
    }

    setEditing(false)
    if (location.state && location.state.edit) {
      navigate('/basket')
    }
  }


  return (
    <Container className='mb-5'>
      <h2 className='my-4'>My Page</h2>
      <div>
        <Button variant='secondary' onClick={() => navigate(-1)}><BsBackspace /> Go Back</Button>
      </div>
      {!editing ? (
        <>
          <Button className='mt-4' onClick={() => setEditing(true)}>Edit</Button>
          <Row>
            <Col lg={4}>
              {user && user.name && user.contactNo && user.email && (
                <Card className='mt-4 mb-5'>
                  <Card.Header>Contact Details</Card.Header>
                  <ListGroup variant="flush">
                    <ListGroup.Item>Name: {user.name}</ListGroup.Item>
                    <ListGroup.Item>Contact number: {user.contactNo}</ListGroup.Item>
                    <ListGroup.Item>Email address: {user.email}</ListGroup.Item>
                  </ListGroup>
                </Card>
              )}
            </Col>

            <Col lg={1}></Col>

            <Col>
              <Card md={5}>
                <Card.Header>Billing Address</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>{user && user.address && user.address.line1 ? user.address.line1 : '-'}</ListGroup.Item>
                  <ListGroup.Item>{user && user.address && user.address.line2 ? user.address.line2 : '-'}</ListGroup.Item>
                  <ListGroup.Item>{user && user.address && user.address.city ? user.address.city : '-'}</ListGroup.Item>
                  <ListGroup.Item>{user && user.address && user.address.area ? user.address.area : '-'}</ListGroup.Item>
                  <ListGroup.Item>{user && user.address && user.address.code ? user.address.code : '-'}</ListGroup.Item>
                  <ListGroup.Item>{user && user.address && user.address.country ? user.address.country : '-'}</ListGroup.Item>
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row>
            <Col lg={4}>
              <Form>
                <h4 className='mt-4'>Contact Details</h4>
                <Form.Group className="mb-3">
                  <Form.Label className='mt-2'>Name</Form.Label>
                  <Form.Control type="string" id='name' value={name} onChange={handleContactChange} />
                  <Form.Label className='mt-2'>Contact Number</Form.Label>
                  <Form.Control type="string" id='contactNo' value={contactNo} onChange={handleContactChange} />
                </Form.Group>
                <Button onClick={updateDetails} className='mt-3 mb-4' name='contact'>Update Contact Details</Button>
              </Form>
            </Col>

            <Col lg={2}></Col>

            <Col lg={6} className='mb-4'>
              <Form>
                <h4 className='mt-4'>Billing address</h4>
                <Form.Group className="mb-3">
                  <Form.Label className='mt-2'>Address line 1:</Form.Label>
                  <Form.Control type="string" placeholder="Enter first line of address" id='line1' value={line1} onChange={handleChange} />
                  <Form.Label className='mt-2'>Address line 2: <i>optional</i></Form.Label>
                  <Form.Control type="string" placeholder="Enter second line for address" id='line2' value={line2} onChange={handleChange} />
                  <Form.Label className='mt-2'>Town/City:</Form.Label>
                  <Form.Control type="string" placeholder="Enter town or city" id='city' value={city} onChange={handleChange} />
                  <Form.Label className='mt-2'>County/Province/Area:</Form.Label>
                  <Form.Control type="string" placeholder="Enter county or province/area" id='area' value={area} onChange={handleChange} />
                  <Form.Label className='mt-2'>Post/Zip code:</Form.Label>
                  <Form.Control type="string" placeholder="Enter post or zip code" id='code' value={code} onChange={handleChange} />
                  <Form.Label className='mt-2'>Country:</Form.Label>
                  <Form.Control type="string" placeholder="Enter country" id='country' value={country} onChange={handleChange} />
                </Form.Group>
                <Button onClick={updateDetails} className='mt-3 mb-4' name='address'>Update Billing Address</Button>
              </Form>
            </Col>

          </Row>
        </>

      )}

    </Container>

  )
}

export default MyPage