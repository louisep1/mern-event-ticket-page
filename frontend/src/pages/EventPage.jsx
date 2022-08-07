import {
  useState, useEffect
} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Container, Button } from 'react-bootstrap'
import EventListItem from '../components/EventListItem'
import { BsBackspace } from 'react-icons/bs'
import { getEvents } from '../features/event/eventSlice'
import Spinner from '../components/Spinner'

const EventPage = () => {
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useDispatch()

  const { events, isLoading } = useSelector(state => state.event)

  useEffect(() => {
    dispatch(getEvents())
  }, [])

  useEffect(() => {
    if (events.length > 0 && !isLoading) {
      setLoading(false)
    }
  }, [events, isLoading])



  return (
    <Container>
      <Button className='mt-4' onClick={() => navigate(-1)}><BsBackspace /> Go Back</Button>
      {loading && <Spinner />}
      {!loading && <EventListItem page={true} event={events.filter(event => event._id === params.id)[0]} />}
    </Container>
  )
}

export default EventPage