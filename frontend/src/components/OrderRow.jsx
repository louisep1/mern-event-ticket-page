import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { GrDocumentText } from 'react-icons/gr'
import { AiFillCheckCircle } from 'react-icons/ai'
import { ImCross } from 'react-icons/im'

const OrderRow = ({ order, currency }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()


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

    </tr>
  )
}

export default OrderRow