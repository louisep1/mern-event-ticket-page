import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { Container, Button, Table, Alert } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
// import { reset } from '../features/event/eventSlice'
import { getUser, reset } from '../features/user/userSlice'
import OrderRow from '../components/OrderRow'

const MyOrders = () => {
  const [orderSuccess, setOrderSuccess] = useState(false)
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  const { user, isLoading } = useSelector(state => state.user)
  const { currency } = useSelector(state => state.event)


  useEffect(() => {
    dispatch(getUser())

    if (location.state && location.state.orderSuccess) {
      setOrderSuccess(location.state.orderSuccess)
    }

    // if no user or user is a seller
    if (!user || (user && user.seller)) {
      navigate('/')
    }

    return () => {
      // Anything in here is fired on component unmount AND BEFORE RENDER
      dispatch(reset())
    }
  }, [dispatch, location.state])



  return (
    <Container>
      <h2 className='py-4'>My Orders</h2>

      {/* {orderSuccess && <Alert variant='success'>
        Your order has successfully been placed!
      </Alert>} */}
      {orderSuccess && user && user.orders && (user.orders.length > 0) && <Alert variant='success'>
        Your order has successfully been placed!
        <br />
        <i>(Order {user.orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[user.orders.length - 1]._id})</i>
      </Alert>}

      <LinkContainer to='/my-page' className='my-1' ><Button>Update my details</Button></LinkContainer>

      <Table className='mt-4' responsive>
        <thead>
          <tr className='text-center'>
            <th>Order date</th>
            <th>Total</th>
            <th>Payment Type</th>
            <th>Paid</th>
            <th>Order number</th>
            <th>Order receipt</th>
          </tr>
        </thead>
        <tbody>
          {user && user.orders && user.orders.length > 0 && user.orders.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).reverse().map(order => (
            <OrderRow key={order._id} order={order} currency={currency} />
          ))}

          {/* cannot reuse same page/row for seller page because multiple tickets in each ticket array in each order item .... */}
        </tbody>
      </Table>
    </Container>

  )
}


export default MyOrders