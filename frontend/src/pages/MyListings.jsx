import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Container, Button, Table } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { getMyEvents, reset } from '../features/event/eventSlice'
import { getUser, reset as resetUser } from '../features/user/userSlice'
import ListingRow from '../components/ListingRow'

const MyListings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isLoading } = useSelector(state => state.user)
  const { sellerEvents, deleteSuccess, currency } = useSelector(state => state.event)

  useEffect(() => {
    if (user && user.seller) {
      dispatch(getMyEvents())
    }

    // if no user or user is NOT a seller
    if (!user || (user && !user.seller)) {
      navigate('/')
    }

    if (deleteSuccess) {
      dispatch(getMyEvents())
    }


  }, [user, isLoading, deleteSuccess])



  useEffect(() => {
    // I couldn't put this above because only want to call it once on load - above created a continuous loop
    dispatch(getUser())

    return () => {
      // Anything in here is fired on component unmount AND BEFORE RENDER
      dispatch(reset())
      dispatch(resetUser())
    }
  }, [])



  return (
    <Container>
      <h2 className='py-4'>My Listings</h2>
      <div className='d-flex justify-content-between mb-1'>
        <LinkContainer to='/create'><Button>Add New Listing</Button></LinkContainer>
        <LinkContainer to='/my-page' className='me-2' ><Button>View my details</Button></LinkContainer>
      </div>


      <Table className='mt-4' responsive>
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Event Type</th>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Tickets remaining</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sellerEvents && sellerEvents.length > 0 && sellerEvents.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map(event => (
            <ListingRow key={event._id} event={event} currency={currency} />
          ))}
        </tbody>
      </Table>
    </Container>

  )
}

export default MyListings