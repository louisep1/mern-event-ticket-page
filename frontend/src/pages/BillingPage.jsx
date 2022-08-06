import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button, Form, Row, Col, Card, Table, Alert, ListGroup } from 'react-bootstrap'
import { getUser, reset, updateUser, clearBasket } from '../features/user/userSlice'
import { getEvents, updateAvailableTickets } from '../features/event/eventSlice'



const BillingPage = () => {
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    area: '',
    code: '',
    country: ''
  })

  const { line1, line2, city, area, code, country } = address

  const [saveAddress, setSaveAddress] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, isLoading, isSuccess } = useSelector(state => state.user)
  const { currency, events } = useSelector(state => state.event)


  useEffect(() => {
    dispatch(reset())
    dispatch(getEvents())
  }, [dispatch])

  useEffect(() => {
    window.scrollTo(0, 0)
    // https://stackoverflow.com/questions/33188994/scroll-to-the-top-of-the-page-after-render-in-react-js

    return () => {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    // if (!isLoading && !isSuccess) {
    //   dispatch(getUser())
    // }

    // if (user.seller) {
    //   navigate('/')
    // }

    // new code:
    if (user && user.name && !isLoading && !isSuccess) {
      dispatch(getUser())
    }
    // !!!basically, without checking user, if the user is not logged in then this dispatch(getUser()) created an infinite loop - same for billing and payment pages

    if ((user && user.seller) || !user) {
      navigate('/')
    }


    if (user && user.basket && user.basket.length === 0) {
      navigate('/')
    }

    if (location && location.state && location.state.address) {
      setAddress({
        line1: location.state.address.line1,
        line2: location.state.address.line2,
        city: location.state.address.city,
        area: location.state.address.area,
        code: location.state.address.code,
        country: location.state.address.country
      })
      // setAddress(location.state.address)
    } else if (user && user.address) {
      setAddress({
        line1: user.address.line1,
        line2: user.address.line2,
        city: user.address.city,
        area: user.address.area,
        code: user.address.code,
        country: user.address.country
      })
    }
  }, [isLoading, isSuccess, dispatch, navigate, user])

  const handleChange = e => {
    setAddress(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value
    })
    )
  }

  const proceedPayment = () => {
    if (!line1 || !city || !area || !code || !country) {
      alert('Billing address details incomplete')
    } else {
      if (saveAddress) {
        const addressData = { ...address, updateAddress: true }
        dispatch(updateUser(addressData))
      }

      navigate('/payment', { state: { address } })
    }
  }



  return (
    <>
      <Container className='pb-5'>
        <h2 className='pt-4 pb-3'>Billing info</h2>
        <Alert variant='primary'>
          If you leave or refresh this page, you may be required to resubmit information and repeat this billing process all over again.
        </Alert>



        <Row className='mt-5'>
          <Col md={6} className='mb-4'>
            <Form>
              <h4 className='mt-3'>Billing address</h4>
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
                <Form.Group className="my-3">
                  <Form.Check type="checkbox" label="Remember billing address" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)} />
                </Form.Group>
              </Form.Group>
            </Form>
          </Col>

          <Col md={6}>
            {user && user.name && user.contactNo && user.email && (
              <Card className='mb-4 p-1'>
                <Card.Header className='fw-bold'>Contact Details</Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Name: {user.name}</ListGroup.Item>
                  <ListGroup.Item>Contact number: {user.contactNo}</ListGroup.Item>
                  <ListGroup.Item>Email address: {user.email}</ListGroup.Item>
                </ListGroup>
              </Card>
            )}

            <Table className='mt-4' responsive size='sm'>
              <thead>
                <tr>
                  <th className="">Event</th>
                  <th className="">Ticket</th>
                  <th className="">Qty</th>
                  <th className="">Price</th>
                </tr>
              </thead>
              <tbody>
                {user && user.basket && user.basket.map(item => (
                  <tr key={item._id}>
                    <td>{events.filter(event => event._id === item.item)[0].eventName}</td>
                    <td>{item.ticketType}</td>
                    <td>{item.quantity}</td>
                    <td>{currency}{item.ticketPrice * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className='pt-1 fs-5'>Total: </td>
                  {user && user.basket && user.basket.length > 0 && (
                    <td className='pt-1 fs-5'>{currency}{Number(user.basket.reduce((a, b) => a + (b.ticketPrice * b.quantity), 0))}</td>
                  )}
                </tr>
              </tfoot>
            </Table>
          </Col>
        </Row>


        <Button onClick={() => navigate(-1, {})} variant='secondary' className='mt-3 me-3'>Back</Button>
        <Button onClick={proceedPayment} className='mt-3'>Select payment method</Button>
      </Container>
    </>
  )
}

export default BillingPage