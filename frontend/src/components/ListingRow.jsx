import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Button } from 'react-bootstrap'
import { FaEdit } from 'react-icons/fa'
import { deleteEvent } from '../features/event/eventSlice'

const ListingRow = ({ event, currency }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete?')) {
      dispatch(deleteEvent(event._id))
    }
  }

  const dateSplit = new Date(event.date).toString().split(' ')
  const dateFormatted = `${dateSplit[0]} ${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`

  return (
    // check for past (dynamic class):
    <tr className={new Date(event.date) < new Date() ? 'bg-light text-muted' : 'bg-white'}>
      <LinkContainer to={`/event/${event._id}`}>
        <td className='py-2'>{event.eventName}</td>
      </LinkContainer>
      <td className='py-2'>{event.eventType}</td>
      <td className='py-2'>{event.location}</td>
      <td className='py-2'>{dateFormatted}</td>
      <td className='py-2'>{event.startTime} - {event.endTime}</td>
      <td className='py-2'>{event.availableTickets + ' / ' + event.totalTickets}</td>
      <td className='py-2'>
        <Button variant='light' size='sm' onClick={() => navigate(`/edit/${event._id}`, { state: { editing: true } })}><FaEdit /></Button>
      </td>
      <td><Button variant='danger' size='sm' onClick={handleDelete}>X</Button></td>
    </tr>
  )
}

export default ListingRow