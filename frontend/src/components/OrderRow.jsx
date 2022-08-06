import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { GrDocumentText } from 'react-icons/gr'
import { AiFillCheckCircle } from 'react-icons/ai'
import { ImCross } from 'react-icons/im'

const OrderRow = ({ order, currency }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // console.log(order)


  const dateSplit = new Date(order.payment.orderedOn).toString().split(' ')
  const dateFormatted = `${dateSplit[0]} ${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`

  return (
    <tr className='text-center'>
      <td>{dateFormatted}</td>
      <td>{currency}{order.payment.total}</td>
      <td>{order.payment.paymentMethod}</td>
      <td>{order.payment.paid ? <AiFillCheckCircle /> : <ImCross />}</td>
      <td>{order._id}</td>
      <td><Button variant='light' size='sm' onClick={() => navigate(`/orders/${order._id}`, { state: { order } })}><GrDocumentText /></Button></td>
      {/* navigate('/my-page', { state: { edit: true } })} */}


      {/* <td><AiFillCheckCircle /></td>   */}



      {/* link to payment receipt page that includes all of these payment details */}
      {/* payment type - e.g. paid by card  */}
      {/* order number ? */}
      {/* maybe a finished boolean - but not to display, just to grey out events no longer happening */}
    </tr>
  )
}

export default OrderRow