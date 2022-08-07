import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button, Form, Row, Col, Card, Table, Alert, ListGroup } from 'react-bootstrap'
import { getUser, reset, createOrder, clearBasket } from '../features/user/userSlice'
import { getEvents, updateAvailableTickets } from '../features/event/eventSlice'
import PaypalButton from '../components/PaypalButton'
import {
  PayPalScriptProvider
} from "@paypal/react-paypal-js";
import Spinner from '../components/Spinner'


function PaymentPage() {
  const [loading, setLoading] = useState(true)

  const [total, setTotal] = useState(0)
  const [address, setAddress] = useState({})

  const [paymentMethod, setPaymentMethod] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const { user, isLoading, isSuccess, orderSuccess, orderError } = useSelector(state => state.user)
  const { currency, events } = useSelector(state => state.event)


  useEffect(() => {
    dispatch(reset())
    dispatch(getEvents())

    if (location && location.state && location.state.address) {
      setAddress(location.state.address)
      setLoading(false)
    }

    if (!location.state) {
      navigate(-1)
    }

  }, [dispatch, location])

  useEffect(() => {
    window.scrollTo(0, 0)

    return () => {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (user && user.name && !isLoading && !isSuccess) {
      dispatch(getUser())
    }

    if ((user && user.seller) || !user) {
      navigate('/')
    }


    if (user && user.basket && user.basket.length === 0) {
      navigate('/')
    }

    if (user && user.basket && user.basket.length > 0) {
      setTotal(Number(user.basket.reduce((a, b) => a + (b.ticketPrice * b.quantity), 0)))
    }

    if (orderError) {
      navigate('/error')
    }

    if (orderSuccess && !isLoading) {
      // for each item in the basket:
      user.basket.map(ticket => dispatch(updateAvailableTickets({ item: ticket.item, quantity: ticket.quantity })))
      dispatch(clearBasket())
      navigate('/orders', { state: { orderSuccess: true } })
    }

  }, [isLoading, isSuccess, orderSuccess, orderError, dispatch, navigate, user])

  const confirmOrder = () => {
    // this section is the actual adding order functionality:
    // backend checks if enough tickets available

    if (paymentMethod !== '') {
      const ticketsArray = user.basket.map(ticket => ({
        item: ticket.item,
        quantity: ticket.quantity,
        ticketType: ticket.ticketType,
        ticketPrice: ticket.ticketPrice,
        seller: ticket.seller
      }))
      const orderDetails = {
        tickets: ticketsArray,
        payment: {
          total,
          paymentMethod,
          billingAddress: address,
          orderedOn: new Date(),
        }
      }
      dispatch(createOrder(orderDetails))
    } else {
      alert('Please select a payment method and check billing details entered correctly')
    }
  }

  return (
    <Container className='pb-5'>
      <h2 className='pt-4 pb-3'>Billing info</h2>
      <Alert variant='primary'>
        If you leave or refresh this page, you may be required to resubmit information and repeat this billing process all over again.
      </Alert>

      {loading && <Spinner />}

      <Row className='mt-5'>
        <Col md={6} className='mb-4'>
          <div>
            <div>Select payment method</div>

            {/* PayPal: */}
            <div style={{ maxWidth: "750px", minHeight: "200px" }} className='mt-5'>
              <PayPalScriptProvider
                options={{
                  "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                  components: "buttons",
                  currency: "GBP"
                }}
              >
                <PaypalButton
                  currency='GBP'
                  showSpinner={false}
                  amount={total}
                  tickets={(user && user.basket) && user.basket}
                  address={address}
                />
              </PayPalScriptProvider>
            </div>

            <div>
              <Form>
                <Form.Group>
                  <Form.Check
                    type='radio'
                    id='later'
                    value='Pay later'
                    label='Pay later'
                    name='paymentMethod'
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <Form.Check
                    type='radio'
                    id='bank'
                    value='Bank'
                    label='Bank transfer'
                    name='paymentMethod'
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </div>
          </div>
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

          <Card md={5}>
            <Card.Header className='fw-bold'>Biilling Address</Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>{address.line1}</ListGroup.Item>
              {!address.line2 ? '' : <ListGroup.Item>{address.line2}</ListGroup.Item>}
              <ListGroup.Item>{address.city}</ListGroup.Item>
              <ListGroup.Item>{address.area}</ListGroup.Item>
              <ListGroup.Item>{address.code}</ListGroup.Item>
              <ListGroup.Item>{address.country}</ListGroup.Item>
            </ListGroup>
          </Card>

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
                  <td className='pt-1 fs-5'>{currency}{total}</td>
                )}
              </tr>
            </tfoot>
          </Table>
        </Col>
      </Row>

      <Button onClick={() => navigate('/billing', { state: { address } })} variant='secondary' className='mt-3 me-3'>Back</Button>
      <Button onClick={confirmOrder} className='mt-3'>Confirm order</Button>
    </Container>
  )
}

export default PaymentPage