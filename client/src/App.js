import {Container} from "react-bootstrap";
import {Route, Routes} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {fetchAds, updateAds} from './redux/adsRedux';
import Header from './components/views/Header';
import Loader from './components/common/Loader';
import Home from './components/pages/Home';
import Footer from "./components/views/Footer";
import Ad from "./components/pages/Ad";
import Register from "./components/pages/Register";
import Login from "./components/pages/Login";
import { API_AUTH_URL } from "./config";
import { logIn } from "./redux/usersRedux";
import Logout from "./components/pages/Logout";
import Add from "./components/pages/Add";
import Edit from "./components/pages/Edit";
import Search from "./components/pages/Search";
function App() {
    const dispatch = useDispatch();
    const [connecting, setConnecting] = useState(false);

    useEffect( () => {
        const options = {
            method: 'GET',
            credentials: 'same-origin'
        };
        fetch(`${API_AUTH_URL}auth/user`, options)
            .then(res => {
                if (res.status === 200) {
                    return res.text().then(user => {
                        dispatch(logIn(user));
                        console.log(user);
                    });
                } else {
                    throw new Error('Nie udało się pobrać danych');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            setConnecting(true);
            try {
                await dispatch(fetchAds());
            } catch (error) {
            } finally {
                setConnecting(false);
            }
        };

        fetchData();
    }, [dispatch]);

  return (
      <Container>
          {!connecting && <Header />}
          { connecting ? <Loader /> : null }
          { !connecting &&
              <Routes>
                  <Route path='/' element={<Home />} />
                  <Route path='/ads/:id' element={<Ad />} />
                  <Route path='/add' element={<Add />} />
                  <Route path='edit/:id' element={<Edit />} />
                  <Route path='/register' element={<Register />} />
                  <Route path='/login' element={<Login />} />
                  <Route path='/logout' element={<Logout />} />
                  <Route path='/search/:searchPhrase' element={<Search />} />
                  <Route path='*' element={<Home />} />
              </Routes>
          }
          {!connecting && <Footer />}
      </Container>
  );
}

export default App;
