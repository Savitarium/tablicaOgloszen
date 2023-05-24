import thunk from 'redux-thunk';
import initialState from "./initialState";
import adsReducer from "./adsRedux";
import {applyMiddleware, combineReducers, compose, createStore} from "redux";
import usersReducer from "./usersRedux";

const subreducers = {
    ads: adsReducer,
    users: usersReducer,
}

const reducer = combineReducers(subreducers);
const store = createStore(
    reducer,
    initialState,

    compose(
        applyMiddleware(thunk),
            window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f

    )
);
export default store;