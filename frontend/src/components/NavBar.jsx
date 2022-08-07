import { useEffect, useState } from 'react'
import { Nav, Container, Navbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { AiOutlineUser } from 'react-icons/ai'
import { FaShoppingBasket } from 'react-icons/fa'
import { MdOutlineEventNote } from 'react-icons/md'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { signOut } from '../features/user/userSlice'

const NavBar = () => {
  const { user, isLoading } = useSelector(state => state.user)

  const [seller, setSeller] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      if (user.seller) {
        setSeller(true)
      } else {
        setSeller(false)
      }
    }

    if (!user) {
      setSeller(false)
    }
  }, [user, isLoading])


  const dispatch = useDispatch()
  const location = useLocation()

  const [hover, setHover] = useState(false)

  const logOut = () => {
    dispatch(signOut())
    navigate('/')
  }

  return (
    <Navbar bg="primary" variant="dark">
      <Container>

        <Nav className="w-100">
          <LinkContainer to="/" style={{ fontSize: '1.3rem' }} className={`pt-1 ${!user && 'me-auto'} ${user && seller && 'me-auto'}`}><Nav.Link>Events</Nav.Link></LinkContainer>
          {user && !seller && <LinkContainer to="/orders" className='me-auto'><Nav.Link>My Orders</Nav.Link></LinkContainer>}
          {!seller && user && <LinkContainer to="/basket"><Nav.Link><FaShoppingBasket className='mb-1 me-1' />Basket</Nav.Link></LinkContainer>}
          {seller && <LinkContainer to="/listings"><Nav.Link><MdOutlineEventNote className='mb-1 me-1' />My Listings</Nav.Link></LinkContainer>}
          {!user ? (
            <LinkContainer to='/sign-in' className={`${location.pathname === '/' && 'text-light'}`} style={{ "--bs-text-opacity": hover ? '.8' : '.6' }} onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}><Nav.Link ><AiOutlineUser className='mb-1' /> Sign in/up</Nav.Link></LinkContainer>) : (
            <Nav.Link onClick={logOut}>Sign out</Nav.Link>
          )
          }
        </Nav>
      </Container>
    </Navbar >
  )
}

export default NavBar