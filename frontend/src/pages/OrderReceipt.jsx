import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Card, ListGroup, Row, Col, Button } from 'react-bootstrap'
import { getUser } from '../features/user/userSlice'
import { getEvents } from '../features/event/eventSlice'
import { BsBackspace } from 'react-icons/bs'
import Ticket from '../components/Ticket'

const OrderReceipt = () => {
  const location = useLocation()
  const [order, setOrder] = useState({})

  const { user } = useSelector(state => state.user)
  const { events, currency } = useSelector(state => state.event)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getUser())
    dispatch(getEvents())


    if (location.state && location.state.order) {
      setOrder(location.state.order)
    }

    if (!location.state || !location.state.order) {
      navigate('/')
    }

  }, [dispatch, location.state])

  const formatDate = (date) => {
    const dateSplit = new Date(date).toString().split(' ')
    const dateFormatted = `${dateSplit[0]} ${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`
    return dateFormatted
  }




  return (
    <Container className='mb-5'>
      <h3 className='mt-5 mb-4'>Order number {order._id}</h3>

      <Button className='mt-2 mb-4' variant='secondary' onClick={() => navigate(-1)}><BsBackspace /> Go Back</Button>

      {order && order.payment && order.payment.billingAddress && order.payment.billingAddress.line1 && order.payment.billingAddress.city && order.payment.billingAddress.area && order.payment.billingAddress.code && order.payment.billingAddress.country && (

        <Row>
          <Col md={6}>
            {order && order.tickets && order.tickets.map(ticket => (
              <Ticket key={ticket._id} currency={currency} ticket={ticket} event={events.filter(event => event._id === ticket.item)[0]} />
            ))}


            {order && order.payment && order.payment.total && (
              <Card className='my-3'>
                <Card.Header><Card.Title className='pt-2'>Total: {currency}{(Math.round(order.payment.total * 100) / 100).toFixed(2)}</Card.Title></Card.Header>
                <ListGroup variant="flush">
                  <ListGroup.Item>Payment method: {order.payment.paymentMethod}</ListGroup.Item>
                  <ListGroup.Item>Paid: {order.payment.paid ? 'Yes' : 'No'}</ListGroup.Item>
                  <ListGroup.Item>Ordered on: {formatDate(order.payment.orderedOn)}</ListGroup.Item>
                  {order.payment.paid && <ListGroup.Item>Paid on: {formatDate(order.payment.paidOn)}</ListGroup.Item>}
                </ListGroup>
              </Card>
            )}

          </Col>



          <Col md={6}>
            <Card className='mt-4 mb-5'>
              <Card.Header>Contact Details</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>Name: {user.name}</ListGroup.Item>
                <ListGroup.Item>Contact number: {user.contactNo}</ListGroup.Item>
                <ListGroup.Item>Email address: {user.email}</ListGroup.Item>
              </ListGroup>
            </Card>

            <Card>
              <Card.Header>Biilling Address</Card.Header>
              <ListGroup variant="flush">
                <ListGroup.Item>{order.payment.billingAddress.line1}</ListGroup.Item>
                {!order.payment.billingAddress.line2 ? '' : <ListGroup.Item>{order.payment.billingAddress.line2}</ListGroup.Item>}
                <ListGroup.Item>{order.payment.billingAddress.city}</ListGroup.Item>
                <ListGroup.Item>{order.payment.billingAddress.area}</ListGroup.Item>
                <ListGroup.Item>{order.payment.billingAddress.code}</ListGroup.Item>
                <ListGroup.Item>{order.payment.billingAddress.country}</ListGroup.Item>
              </ListGroup>
            </Card>

          </Col>
        </Row>
      )}


    </Container>

  )
}

export default OrderReceipt