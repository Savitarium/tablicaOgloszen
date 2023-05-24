import { useSelector, useDispatch } from 'react-redux';
import { getAllAds, fetchAdvertBySearchPhrase } from '../../redux/adsRedux';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import {Card} from "react-bootstrap";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Search = () => {
    const { searchPhrase } = useParams();
    const dispatch = useDispatch();
    const ads = useSelector(getAllAds);

    useEffect(() => {
        dispatch(fetchAdvertBySearchPhrase(searchPhrase));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Row xs={1} md={4} className='g-3 my-5'>
            {ads.map((ad) => (
                <Col key={ad._id}>
                    <Card {...ad} />
                </Col>
            ))}
        </Row>
    );
};

export default Search;