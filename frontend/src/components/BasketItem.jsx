import { useDispatch, useSelector } from 'react-redux'
import { Card, ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { MdDelete } from 'react-icons/md'
import { removeFromBasket, getUser } from '../features/user/userSlice'
import { useEffect, useState } from 'react'

const BasketItem = ({ item, currency, event }) => {
  const [date, setDate] = useState('')

  const { events, isLoading } = useSelector(state => state.event)

  useEffect(() => {
    if (event && event.date) {
      const dateSplit = new Date(event.date).toString().split(' ')
      const dateFormatted = `${dateSplit[0]} ${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`
      setDate(dateFormatted)
    }

  }, [isLoading])


  const dispatch = useDispatch()


  const deleteTicket = () => {
    dispatch(removeFromBasket({ basketId: item._id }))
  }



  return (
    <>
      <Card className='my-4'>
        <Card.Header>
          {event && event.eventName && <LinkContainer to={`/event/${item.item}`}><Button variant='light fs-5' className='p-0'>{event.eventName}</Button></LinkContainer>}
          <Button variant='secondary' size='sm' className='position-absolute end-0 me-2' onClick={deleteTicket}><MdDelete /></Button>
        </Card.Header>
        <ListGroup variant="flush">
          {event && event.location && <ListGroup.Item>{event.location}</ListGroup.Item>}
          {event && event.startTime && event.endTime && <ListGroup.Item>{date}, {event.startTime} - {event.endTime}</ListGroup.Item>}
          <ListGroup.Item>
            <div>Ticket type: {item.ticketType}</div>
            <div>{currency}{item.ticketPrice} x {item.quantity}</div>
          </ListGroup.Item>
        </ListGroup>
        <Card.Footer className='fs-5'>Total: {currency}{(Math.round((item.quantity * item.ticketPrice) * 100) / 100).toFixed(2)}</Card.Footer>
      </Card>
    </>

  )
}

export default BasketItem