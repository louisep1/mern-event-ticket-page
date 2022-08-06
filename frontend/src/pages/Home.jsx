import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap'
import EventListItem from '../components/EventListItem'
import { FaSearch } from 'react-icons/fa'
import { getEvents } from '../features/event/eventSlice'
import Spinner from '../components/Spinner'

const Home = () => {
  const [keyword, setKeyword] = useState('')
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const dispatch = useDispatch()

  const { events, isLoading } = useSelector(state => state.event)

  useEffect(() => {
    dispatch(getEvents())
  }, [])

  useEffect(() => {
    if (events && events.length > 0) {
      const filteredEvents = events.filter(event => new Date(event.date) > new Date())
      setUpcomingEvents(filteredEvents)
    }
  }, [events])

  return (
    <div>
      {/*  style={{ border: '3px solid black' }} */}
      <Container>
        <h2 className='pt-4'>Upcoming Events</h2>
        {isLoading ? <Spinner /> : events.length === 0 ? <p className='mt-3'>There are no events to be displayed</p> : (
          <>
            <Container className='my-4'>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Search events here"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                // onBlur={() => setKeyword('')}
                />
                {keyword && <Button className='rounded' onClick={() => setKeyword('')} variant='danger'>X</Button>}
                <InputGroup.Text className='ps-3'><FaSearch /></InputGroup.Text>
              </InputGroup>
            </Container>

            {/* if keyword.length = 0 or if filter then details/title matches keyword, display: */}
            {keyword.length > 0 ?
              upcomingEvents
                .filter(event =>
                  event.eventName.toLowerCase().match(keyword.toLowerCase()) ||
                  event.eventType.toLowerCase().match(keyword.toLowerCase()) ||
                  event.date.toLowerCase().match(keyword.toLowerCase()) ||
                  event.fullDescription.toLowerCase().match(keyword.toLowerCase()) ||
                  event.briefSummary.toLowerCase().match(keyword.toLowerCase()) ||
                  event.location.toLowerCase().match(keyword.toLowerCase())
                )
                .map(event => (
                  <EventListItem key={event._id} event={event} />
                ))
              : upcomingEvents.map(event => (
                <EventListItem key={event._id} event={event} />
              ))}
          </>
        )}

      </Container>
    </div>
  )
}

export default Home