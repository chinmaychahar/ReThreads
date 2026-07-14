import products from "./products";
import auth from "./auth";
import cart from "./cart";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
    products,
    auth,
    cart
})

export default rootReducers;