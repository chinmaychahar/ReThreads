import './App.css'; 
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import { Redirect, Route, Switch } from 'react-router-dom';
import ProductDetail from './components/ProductDetail';
import ProductDetailForProductsPage from './components/ProductDetailsForProductsPage';
import Cart from './components/Cart';
import Checkout from './components/Checkout'
import Shop from './components/Shop';
import Clothes from './components/Alzheimer';

function App() {
  return (
    <>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/products" component={Shop} />
        <Route exact path="/Alzheimer" component={Clothes} />
        <Route exact path="/products/:id" component={ProductDetail} />
        <Route exact path="/allProducts/:id" component={ProductDetailForProductsPage} />
        <Route exact path="/cart" component={Cart} />
        <Route exact path="/checkout" component={Checkout} />
        <Route exact path="/about" component={About} />
        <Route exact path="/contact" component={Contact} />
        <Redirect to="/" />
      </Switch>
      <Footer/>
    </>
  );
}

export default App;
