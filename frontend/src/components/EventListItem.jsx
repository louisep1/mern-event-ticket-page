import { useEffect, useState } from 'react'
import { Card, ListGroup, ListGroupItem, Col, Row, Button, Form, Alert } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { TbCalendarTime } from 'react-icons/tb'
import { MdLocationOn } from 'react-icons/md'
import { GrMoney } from 'react-icons/gr'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addToBasket } from '../features/user/userSlice'


// eventName,
//   eventType,
//   date,
//   startTime,
//   endTime,
//   priceFull,
//   priceBasic,
//   availableTickets,
//   briefSummary,
//   fullDescription,
//   image,
// location


// page={false} => default => it is just a normal list item and shows see more button and shows a summarised description
// page={true} => hide see more button and add full length version of description

const EventListItem = ({ event, page }) => {

  const [ticket, setTicket] = useState({})
  const [dateFormatted, setDateFormatted] = useState('')

  const { user, isLoading, basketSuccess } = useSelector(state => state.user)
  const { currency } = useSelector(state => state.event)

  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    if (event) {
      const dateSplit = new Date(event.date).toString().split(' ')
      setDateFormatted(`${dateSplit[0]} ${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`)
    }

    if (!event) {
      navigate('/')
    }

    if (basketSuccess) {
      navigate('/basket')
    }
  }, [isLoading, basketSuccess, navigate])

  const buyTickets = e => {
    if (!user) {
      navigate('/sign-in')
    } else {
      if (!ticket.ticketType || !ticket.ticketPrice || ticket.ticketType === 'invalid' || ticket.ticketPrice === 'invalid') {
        alert('Please select a ticket type')
      } else if (user.seller) {
        alert(`Can't buy tickets with this account type`)
      } else {
        const itemData = {
          item: event._id,
          quantity: 1,
          ticketType: ticket.ticketType,
          ticketPrice: Number(ticket.ticketPrice),
          location: event.location,
          seller: event.createdBy.toString()
        }
        dispatch(addToBasket(itemData))
      }
    }
  }



  // !!! I'm actually not sure if this is correct/exhaustive:
  if (event && event.eventName && event._id && event.image && event.briefSummary && event.fullDescription && event.startTime && event.endTime && event.priceFull && event.location && event.ticketPrices) {
    return (

      <Card className="my-4 w-100">
        <Card.Body>
          <Card.Title className='pb-2'>{event.eventName}</Card.Title>
          {!page ? (
            <Row>
              <Col md={6}>
                <LinkContainer to={`/event/${event._id}`}><Card.Img variant="top" src={event.image} /></LinkContainer>
              </Col>
              <Col md={6}>
                <Card.Text className='pt-2'>
                  {event.briefSummary}
                </Card.Text>
              </Col>
            </Row>
          ) : (
            <>
              <Col md={8}>
                <Card.Img variant="top" src={event.image} />
              </Col>
              <Card.Text className='pt-4'>
                {event.fullDescription}
              </Card.Text>
            </>
          )}

        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem><TbCalendarTime /> Date and time: {dateFormatted}, {event.startTime} - {event.endTime}</ListGroupItem>
          <ListGroupItem><MdLocationOn /> Location: {event.location}</ListGroupItem>
          <ListGroupItem><GrMoney /> Cost: {event.priceBasic && `${currency}${event.priceBasic} / `}{currency}{event.priceFull}</ListGroupItem>

          {!page && (
            <ListGroupItem className='py-3'>
              <LinkContainer to={`/event/${event._id}`}><Card.Link>See more... </Card.Link></LinkContainer>
            </ListGroupItem>
          )}

        </ListGroup>
        {(!user || (user && user.seller === false)) && (
          <Card.Body>

            {/* if tickets are in stock...  */}
            {event.availableTickets > 0 ? (
              <>
                {/* {event.availableTickets <= 10 && <p className='fst-italic ps-2'>Only {event.availableTickets} ticket{event.availableTickets > 1 && 's'} remaining!</p>} */}

                {event.availableTickets <= 10 && <Alert variant='info' className='fst-italic ps-3 py-2 my-2' style={{ width: '14rem' }}>Only {event.availableTickets} ticket{event.availableTickets > 1 && 's'} remaining!</Alert>}

                <Col md={3}>
                  <Form.Group className="mb-3 mt-1">
                    <Form.Select onChange={(e) => setTicket({ ticketType: e.target.value.split(',')[0], ticketPrice: e.target.value.split(',')[1] })}>

                      {/* <Form.Select onChange={(e) => console.log(e.target.value)}> */}
                      <option value={["invalid", "invalid"]}>Select ticket</option>

                      {/* map through ticketPrices and display name and price as an option */}
                      {/* then set the component level state to match the selected ticket */}

                      {event.ticketPrices.map((ticket, i) => (
                        <option key={i} value={[ticket.ticketType, ticket.ticketPrice]}>{currency}{ticket.ticketPrice} --- {ticket.ticketType} - </option>
                      ))}

                    </Form.Select>
                  </Form.Group>
                </Col>
                {<Button onClick={buyTickets}>Buy Ticket</Button>}
              </>
            ) : (
              <strong className='ps-2'>Sold out</strong>
            )}

          </Card.Body>
        )}
      </Card >
    )
  }

  return
}

EventListItem.defaultProps = {
  page: false
}

export default EventListItem