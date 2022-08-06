import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import BasketPage from './pages/BasketPage'
import BillingPage from './pages/BillingPage'
import PaymentPage from './pages/PaymentPage'
import EventPage from './pages/EventPage'
import MyListings from './pages/MyListings'
import MyOrders from './pages/MyOrders'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
import CreateEventPage from './pages/CreateEventPage'
import MyPage from './pages/MyPage'
import OrderReceipt from './pages/OrderReceipt'
import SellerPage from './pages/SellerPage'
import ErrorPage from './pages/ErrorPage'

function App() {
  return (
    <>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/orders/:id" element={<OrderReceipt />} />
          <Route path={`/seller/:id`} element={<SellerPage />} />
          <Route path="/basket" element={<BasketPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/create" element={<CreateEventPage />} />
          {/* <Route
            path="/edit/:id"
            element={<CreateEventPage editing={true} />}
          /> */}
          <Route path="/edit/:id" element={<CreateEventPage />} />
          <Route path="/my-page" element={<MyPage />} />
          <Route path="/listings" element={<MyListings />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
