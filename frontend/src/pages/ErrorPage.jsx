import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { reset } from '../features/user/userSlice'
import { Container } from "react-bootstrap"

const ErrorPage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    return () => {
      dispatch(reset())
    }
  }, [])

  return (
    <Container className='py-5'>
      <h2>Oops.</h2>
      <h3>Something went wrong and your order could not be placed.</h3>
      <h4>Please check that the item is still in stock and try again</h4>
    </Container>
  )
}

export default ErrorPage