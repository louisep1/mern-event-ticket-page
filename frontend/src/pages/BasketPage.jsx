import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Card, Col, Row, ListGroup } from 'react-bootstrap'
import BasketItem from '../components/BasketItem'
import { getUser, reset, clearBasket } from '../features/user/userSlice'
import { getEvents } from '../features/event/eventSlice'
import Spinner from '../components/Spinner'
import { FaEdit } from 'react-icons/fa'

const BasketPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading, isSuccess } = useSelector(state => state.user)
  const { events, currency } = useSelector(state => state.event)


  useEffect(() => {
    dispatch(reset())
    dispatch(getEvents())
  }, [])

  useEffect(() => {
    if (user && user.name && !isLoading && !isSuccess) {
      dispatch(getUser())
    }
    // !!!basically, without checking user, if the user is not logged in then this created an infinite loop - same for billing and payment pages

    if ((user && user.seller) || !user) {
      navigate('/')
    }

  }, [isLoading, isSuccess])

  const clearAll = () => {
    if (window.confirm('Delete all tickets?')) {
      dispatch(clearBasket())
    }
  }



  return (
    <>
      <Container className='mb-4'>
        <h2 className='pt-4'>Basket</h2>
        {isLoading ? <Spinner /> : (
          <>
            <Row>
              <Col md={6} className='position-relative'>
                {/* for each basket item: */}
                {events.length === 0 ? <Spinner /> : (!user || !user.basket || user.basket.length === 0) ? <div className='pt-2'>There are no tickets to show</div> : user.basket.map(item => <BasketItem key={item._id} item={item} currency={currency} event={events.filter(event => event._id === item.item)[0]} />)}
                {/* .slice() */}
                {/* event={events.filter(event => event._id === item.item)[0]} */}

                {events.length > 0 && user && user.basket && user.basket.length > 0 && (
                  <>
                    <p className="text-muted px-2 pb-5" style={{ fontSize: '14px' }}>** The times displayed are the general opening times. For admittance times regarding your ticket type, please check the event information and ticket terms and conditions for details.</p>
                    <Button variant='danger' size='sm' className='my-2 ms-1 position-absolute end-0 bottom-0 me-3' onClick={clearAll}>Clear All</Button>
                  </>
                )}


              </Col>


              <Col md={1}></Col>
              <Col md={5}>
                {/* stuck as to md=4 or md=5 */}
                <div>
                  {/* style={{ width: '18rem' }} */}
                  <Card className='mt-3 mb-4 p-1'>
                    <Card.Header className='fw-bold'>Contact Details</Card.Header>

                    <Button variant='light' className='position-absolute end-0 top-0 pe-1 pt-0 me-1 mt-1' onClick={() => navigate('/my-page', { state: { edit: true } })}><FaEdit /></Button>

                    {user && user.name && user.contactNo && user.email && (
                      <ListGroup variant="flush">
                        <ListGroup.Item>Name: {user.name}</ListGroup.Item>
                        <ListGroup.Item>Contact number: {user.contactNo}</ListGroup.Item>
                        <ListGroup.Item>Email address: {user.email}</ListGroup.Item>
                      </ListGroup>
                    )}

                  </Card>

                  <Card>
                    <Card.Header><Card.Title className='pt-2'>Grand Total:</Card.Title></Card.Header>
                    <ListGroup variant="flush">
                      {user && user.basket && user.basket.length > 0 && (
                        <ListGroup.Item className='fs-4 ps-4'>
                          {currency} {(Math.round((Number(user.basket.reduce((a, b) => a + (b.ticketPrice * b.quantity), 0))) * 100) / 100).toFixed(2)}
                        </ListGroup.Item>
                      )}
                      {/* I don't think this Number() is necessary, but I put it just in case */}
                    </ListGroup>
                  </Card>
                  {events.length > 0 && user && user.basket && user.basket.length > 0 && <Button className='ms-2 mt-4' onClick={() => navigate('/billing')}>Proceed to payment</Button>}

                </div>
              </Col>
            </Row>
          </>
        )}

      </Container>
    </>
  )
}

export default BasketPage