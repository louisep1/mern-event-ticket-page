import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getSeller } from '../features/user/userSlice'
import { Container, Card, Button } from 'react-bootstrap'
import { AiFillPhone } from 'react-icons/ai'
import { BsFillPersonFill, BsBackspace } from 'react-icons/bs'

// the seller's user id is in the url => need to use this to get the seller's details from the backend

const SellerPage = () => {
  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { seller } = useSelector(state => state.user)

  useEffect(() => {
    dispatch(getSeller(params.id))
  }, [])

  return (
    <Container>

      <Button className='mt-5 mb-1' variant='secondary' onClick={() => navigate(-1)}><BsBackspace /> Go Back</Button>

      <h3 className='py-4'>Seller details</h3>

      {seller && seller.name && seller.contactNo && (
        <Card
          bg='light'
          text='dark'
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header><BsFillPersonFill /> {seller.name}</Card.Header>

          <Card.Body>
            {/* <Card.Title><BsFillPersonFill /> {seller.name}</Card.Title> */}
            <Card.Text>
              <AiFillPhone /> {seller.contactNo}
            </Card.Text>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

export default SellerPage