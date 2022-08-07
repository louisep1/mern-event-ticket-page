import { useState, useEffect } from 'react'
import { Card, ListGroup, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'


const Ticket = ({ currency, ticket, event }) => {
  const [seller, setSeller] = useState('')

  const [styleClass, setStyleClass] = useState('')

  useEffect(() => {
    if (event && event.date) {
      const pastEventCheck = new Date(event.date) < new Date() ? 'bg-light text-muted' : 'bg-white'
      setStyleClass(pastEventCheck)
    }
  }, [event])

  const formatDate = (date) => {
    const dateSplit = new Date(date).toString().split(' ')
    const dateFormatted = `${dateSplit[0]} ${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`
    return dateFormatted
  }

  return (
    <div className='py-2'>
      {event && event.eventName && event.location && event.startTime && event.date && (
        <Card className={`${new Date(event.date) < new Date() ? 'bg-light text-muted' : 'bg-white'} mt-3`}>
          <LinkContainer to={`/event/${ticket.item}`}>
            <Card.Header className={`${styleClass} fs-5`}>
              {event.eventName}
              <div className='pt-1' style={{ fontSize: '14px' }}>Ticket no. {ticket._id}</div>
            </Card.Header>
          </LinkContainer>


          <ListGroup variant="flush">
            <ListGroup.Item className={styleClass}>{ticket.ticketType} {currency}{ticket.ticketPrice} x {ticket.quantity}</ListGroup.Item>
            <ListGroup.Item className={styleClass}>{event.location}</ListGroup.Item>
            <ListGroup.Item className={styleClass}>{formatDate(event.date)}, {event.startTime} - {event.endTime}</ListGroup.Item>

          </ListGroup>
          <Card.Footer>
            {currency}{Number(ticket.ticketPrice * ticket.quantity)}
          </Card.Footer>
        </Card>

      )}
      {ticket && ticket.seller && event && event.date && <LinkContainer to={`/seller/${ticket.seller}`} style={{ fontSize: '12px' }} className={new Date(event.date) < new Date() ? 'text-muted' : ''}>
        <i>Click <u>here</u> to contact seller.</i>
      </LinkContainer>}
      <div></div>

    </div>
  )
}

export default Ticket