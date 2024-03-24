// Create an event OR update a current event

import axios from 'axios'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { Container, Button, Form, InputGroup, Col, Row } from 'react-bootstrap'
import { postEvent, getMyEvents, updateEvent } from '../features/event/eventSlice'
import { BsBackspace } from 'react-icons/bs'
import Spinner from '../components/Spinner'

const CreateEventPage = () => {
  const [uploading, setUploading] = useState(false)

  const [editing, setEditing] = useState(false)

  const [eventId, setEventId] = useState('')

  const [ticketPrices, setTicketPrices] = useState([{ ticketType: '', ticketPrice: 0 }])

  const [event, setEvent] = useState({
    eventName: '',
    eventType: '',
    date: '',
    startTime: '',
    endTime: '',
    priceFull: 0,
    priceBasic: '',
    availableTickets: 0,
    totalTickets: 0,
    briefSummary: '',
    fullDescription: '',
    image: '',
    location: ''
  })

  const { eventName, eventType, date, startTime, endTime, priceFull, priceBasic,
    availableTickets, totalTickets, briefSummary, fullDescription, image, location } = event

  const { updateSuccess, createSuccess, updateError, createError, deleteError, message, sellerEvents, getMySuccess, currency } = useSelector(state => state.event)

  const { user } = useSelector(state => state.user)



  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const urlLocation = useLocation()

  useEffect(() => {
    dispatch(getMyEvents())
  }, [dispatch])

  useEffect(() => {
    if (!user || (user && !user.seller)) {
      navigate('/')
    }

    if (urlLocation && urlLocation.state && urlLocation.state.editing) {
      setEditing(urlLocation.state.editing)
    }

    // if !editing but edit is in the url, redirect
    if ((!urlLocation.state || !urlLocation.state.editing) && urlLocation.pathname.includes('edit')) {
      navigate('/')
    }

    if (updateSuccess || createSuccess) {
      navigate('/listings')
    }

    if (updateError || createError || deleteError) {
      alert(message)
    }

    if (editing && sellerEvents && sellerEvents.length > 0) {
      const currentEvent = (sellerEvents.filter(event => event._id === params.id)[0])
      setEvent({
        eventName: currentEvent.eventName,
        eventType: currentEvent.eventType,
        date: currentEvent.date,
        startTime: currentEvent.startTime,
        endTime: currentEvent.endTime,
        priceFull: currentEvent.priceFull,
        priceBasic: currentEvent.priceBasic || '',
        availableTickets: currentEvent.availableTickets,
        totalTickets: currentEvent.totalTickets,
        briefSummary: currentEvent.briefSummary,
        fullDescription: currentEvent.fullDescription,
        image: currentEvent.image || '',
        location: currentEvent.location
      })

      const list = []
      currentEvent.ticketPrices.map((ticket, i) => {
        return list[i] = { ticketPrice: ticket.ticketPrice, ticketType: ticket.ticketType }
      })
      setTicketPrices(list)

      setEventId(currentEvent._id)
    }
  }, [updateSuccess, createSuccess, getMySuccess, createError, deleteError, message, updateError, dispatch, editing, navigate, params.id, urlLocation, sellerEvents, user])


  const handleChange = e => {
    setEvent(prevState => ({
      ...prevState,
      [e.target.id]: e.target.value,
    })
    )
  }

  // For uploading flyer images:
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)

    setUploading(true)

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }

      const { data } = await axios.post('/api/flyer', formData, config)

      setEvent(prevState => ({
        ...prevState,
        image: data
      }))

      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }


  const submitEvent = e => {
    e.preventDefault()

    if (!eventName || !eventType || !date || !startTime || !endTime || !priceFull || !ticketPrices || (!totalTickets && !availableTickets) || !briefSummary || !fullDescription || !location) {
      alert('Some event fields missing')
    } else {
      const eventInfo = { ...event, ticketPrices }

      if (!editing) {
        dispatch(postEvent(eventInfo))
      }

      if (editing) {
        const updatedEvent = { ...eventInfo, eventId }
        dispatch(updateEvent(updatedEvent))
      }

    }

  }

  // Ticket type/prices drop down list options section:
  const updateTicketArray = e => {
    setTicketPrices(prevState => ([...prevState, { ticketType: '', ticketPrice: 0 }]))
  }

  const handleTicketFieldChange = (e, i) => {
    const { name, value } = e.target
    const list = [...ticketPrices]
    list[i][name] = value
    setTicketPrices(list)
  }

  const removeLast = () => {
    const list = [...ticketPrices]
    list.splice(ticketPrices.length - 1, 1)
    setTicketPrices(list)
  }




  return (
    <Container>
      <h2 className='pt-4'>{editing ? 'Edit Event' : 'Create New Event'}</h2>
      <Button className='my-3' onClick={() => navigate(-1)}><BsBackspace /> Go Back</Button>

      <Form onSubmit={submitEvent}>
        <Form.Group className="mb-3">
          <Form.Label className='mt-2'>Event Name</Form.Label>
          <Form.Control type="string" placeholder="Example Event" id='eventName' value={eventName} onChange={handleChange} />
          <Form.Label className='mt-2'>Event type</Form.Label>
          <Form.Control type="string" placeholder="Music event, festival, etc..." id='eventType' value={eventType} onChange={handleChange} />
          <Form.Label className='mt-2'>Location</Form.Label>
          <Form.Control type="string" placeholder="London, UK" id='location' value={location} onChange={handleChange} />

          <Form.Label className='mt-2'>Date</Form.Label>
          <Form.Control type="date" placeholder="Sunday 1st January 2000" id='date' value={date} onChange={handleChange} />

          <Form.Label className='mt-2'>Start Time</Form.Label>
          <Form.Control type="string" placeholder="6pm" id='startTime' value={startTime} onChange={handleChange} />
          <Form.Label className='mt-2'>End Time</Form.Label>
          <Form.Control type="string" placeholder="11:30pm" id='endTime' value={endTime} onChange={handleChange} />

          <Form.Label className='mt-2'>Full price (highest price)</Form.Label>
          <InputGroup>
            <InputGroup.Text>{currency}</InputGroup.Text>
            <Form.Control type="number" placeholder="20" id='priceFull' value={priceFull} onChange={handleChange} />
          </InputGroup>

          <Form.Label className='mt-2'>Basic Price (lowest price) <i>optional</i></Form.Label>
          <InputGroup>
            <InputGroup.Text>{currency}</InputGroup.Text>
            <Form.Control type="number" placeholder="10" id='priceBasic' value={priceBasic} onChange={handleChange} />
          </InputGroup>

          {/* TICKET PRICES DROPDOWN - ARRAY OPTIONS LISTED HERE */}
          <div className='my-4'>
            <Form.Label className='mt-2'>Ticket Types</Form.Label>
            {ticketPrices.map((ticket, i) => (
              <div key={i} className='mb-3'>
                <Row>
                  <Col>
                    <Form.Control type='string' placeholder='Ticket type' name='ticketType' value={ticket.ticketType} onChange={(e) => handleTicketFieldChange(e, i)} required />
                  </Col>

                  <Col>
                    <InputGroup>
                      <InputGroup.Text>{currency}</InputGroup.Text>
                      <Form.Control type='number' placeholder='Ticket price' name='ticketPrice' value={ticket.ticketPrice} onChange={(e) => handleTicketFieldChange(e, i)} required />
                    </InputGroup>
                  </Col>
                </Row>
              </div>
            ))}
            <Button onClick={updateTicketArray} size='sm'>Add another ticket type</Button>
            {ticketPrices.length > 1 && <Button onClick={removeLast} className='ms-3' variant='danger' size='sm'>Remove last</Button>}
          </div>

          <Form.Label className='mt-2'>Available Tickets</Form.Label>
          <Form.Control type="number" placeholder="50" id='availableTickets' value={availableTickets} onChange={handleChange} />
          {editing &&
            <>
              <Form.Label className='mt-2'>Total Number of Tickets</Form.Label>
              <Form.Control type="number" placeholder="60" id='totalTickets' value={totalTickets} onChange={handleChange} />
            </>
          }
          <Form.Label className='mt-2'>Brief summary</Form.Label>
          <Form.Control as='textarea' placeholder="Enter a short summary for homepage" id='briefSummary' value={briefSummary} onChange={handleChange} />
          <Form.Label className='mt-2'>Full Event Description</Form.Label>
          <Form.Control as='textarea' placeholder="Enter a longer description for main event page" id='fullDescription' value={fullDescription} onChange={handleChange} />

          {/* Upload flyer image section: */}
          <Form.Label className='mt-2'>Flyer image</Form.Label>
          <Form.Control type="string" placeholder="Enter image path here or choose image below" id='image' value={image} onChange={handleChange} className='mb-2' />

          <Form.Control id='image-file' type='file' label='Choose File' custom='true' onChange={uploadFileHandler}></Form.Control>
          {uploading && <Spinner />}

        </Form.Group>

        <Button className='mt-3 mb-5' type='submit'>{editing ? 'Update Event' : 'Publish Event'}</Button>
      </Form>

    </Container>
  )
}


CreateEventPage.defaultProps = {
  editing: false
}

export default CreateEventPage