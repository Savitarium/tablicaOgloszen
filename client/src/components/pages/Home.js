import {fetchAds, getAllAds} from "../../redux/adsRedux";
import { useSelector, useDispatch } from "react-redux";
import { Container } from "react-bootstrap";
import {Row, Col, Card } from "react-bootstrap";
import styles from "./Home.module.scss"
import {IMGS_URL} from "../../config";
import AppButton from "../common/Button";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";



const Home = () => {
    const ads = useSelector(getAllAds);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    useEffect(() => {
        dispatch(fetchAds());
    }, [dispatch]);
    return(
        <div className={styles.container}>
            <Row>
                <Col>
                    <Form className='d-flex'>
                        <Form.Control
                            type='search'
                            placeholder='Search'
                            className='me-2'
                            aria-label='Search'
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='success' as={Link} to={'/search/' + search}>
                            Search
                        </Button>
                    </Form>
                </Col>
                <Col>
                    <h1>All Adverts</h1>
                </Col>
            </Row>
            <Container>
                <Row className="mt-4 mb-4 rounded d-flex">
                    {ads.map(ad =>
                        <Col key={ad._id} md={4}>
                            <Card className={styles.card}>
                                <Card.Img variant="top" src={IMGS_URL + ad.image} className={styles.cardimg} crossOrigin="anonymous" />
                                <Card.Body>
                                    <Card.Title>{ad.title}</Card.Title>
                                    <Card.Text>
                                        <p className={styles.p}>Lokalizacja: {ad.location}</p>
                                    </Card.Text>
                                    <Link to={`/ads/${ad._id}`}>
                                        <AppButton>Read more</AppButton>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    )}
                </Row>
            </Container>
        </div>
    )
}
export default Home;
