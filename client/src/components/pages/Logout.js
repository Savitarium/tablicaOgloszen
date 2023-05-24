import {API_AUTH_URL} from "../../config";
import { logOut } from "../../redux/usersRedux";
import {useDispatch} from "react-redux";
import {useEffect} from "react";

const Logout = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const options = {
            method: 'DELETE',
        }
        fetch(`${API_AUTH_URL}auth/logout`, options)
            .then(() => {
                dispatch(logOut());
            });
    }, [dispatch]);
}
export default Logout;