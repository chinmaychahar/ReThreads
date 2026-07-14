import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout'
import Shop from './components/Shop';
import Clothes from './components/Alzheimer';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PrivateRoute from './components/auth/PrivateRoute';
import OrderHistory from './components/orders/OrderHistory';
import OrderDetail from './components/orders/OrderDetail';
import DonateForm from './components/donations/DonateForm';
import DonationTracker from './components/donations/DonationTracker';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard';
import BuyerRequestForm from './components/requests/BuyerRequestForm';
import MyRequests from './components/requests/MyRequests';
import AdminDashboard from './components/admin/AdminDashboard';
import { checkSession } from './redux/actions/authActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Shop} />
        <Route exact path="/Alzheimer" component={Clothes} />
        <Route exact path="/category/:category" component={Clothes} />
        <Route exact path="/products/:id" component={ProductDetail} />
        <Route exact path="/allProducts/:id" component={ProductDetail} />
        <Route exact path="/cart" component={Cart} />
        <PrivateRoute exact path="/checkout" component={Checkout} />
        <PrivateRoute exact path="/orders" component={OrderHistory} />
        <PrivateRoute exact path="/orders/:id" component={OrderDetail} />
        <PrivateRoute exact path="/donate" component={DonateForm} />
        <PrivateRoute exact path="/donations" component={DonationTracker} />
        <PrivateRoute exact path="/volunteer" component={VolunteerDashboard} />
        <PrivateRoute exact path="/buyer-requests" component={MyRequests} />
        <PrivateRoute exact path="/buyer-requests/new" component={BuyerRequestForm} />
        <PrivateRoute exact path="/admin" roles={['admin']} component={AdminDashboard} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Redirect to="/" />
      </Switch>
      <Footer/>
    </>
  );
}

export default App;
