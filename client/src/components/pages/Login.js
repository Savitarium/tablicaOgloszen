import Button from 'react-bootstrap/Button';
import {Form} from "react-bootstrap";
import {useState} from "react";
import {API_AUTH_URL} from "../../config";
import {Alert} from "react-bootstrap";
import Loader from "../common/Loader";
import {useDispatch} from "react-redux";
import {logIn} from "../../redux/usersRedux";
import {useNavigate} from "react-router-dom";
const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState(null) // null, Loading, success, serverError, clientError
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleSubmit = e => {
        e.preventDefault();
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        };
        setStatus('Loading');
        fetch(`${API_AUTH_URL}auth/login`, options)
            .then (res => {
                if (res.status === 200) {
                    setStatus('success');
                    dispatch(logIn({ login }));
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 2000);
                } else if (res.status === 400) {
                    setStatus('clientError');
                } else {
                    setStatus('serverError');
                }
            })
            .catch(err => {
                setStatus('serverError');
            });
    }
    return (
        <Form className="col-12 col-sm-3 mx-auto" onSubmit={handleSubmit}>
            <h1 className="my-4">Login</h1>
            { status === 'success' && <Alert variant="success">
                <Alert.Heading>Success!</Alert.Heading>
                <p>You have been successfuly logged in!</p>
            </Alert> }
            { status === 'serverError' && <Alert variant="danger">
                <Alert.Heading>Somethin went wrong...</Alert.Heading>
                <p>Unexpected error.. Try again</p>
            </Alert> }
            { status === 'clientError' && <Alert variant="danger">
                <Alert.Heading>Incorrect data</Alert.Heading>
                <p>Login or password are incorrect</p>
            </Alert> }
            { status === 'loginError' && <Alert variant="warning">
                <Alert.Heading>Login already in use</Alert.Heading>
                <p>You have to use other login</p>
            </Alert> }
            { status === 'Loading' && <Loader /> }
            <Form.Group className="mb-3" controlId="formLogin">
                <Form.Label>Login</Form.Label>
                <Form.Control type="text" value={login} onChange={e => setLogin(e.target.value)} placeholder="Enter login" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Sign in
            </Button>
        </Form>
    )
};
export default Login;