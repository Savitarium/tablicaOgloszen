
import {adAdd} from "../../redux/adsRedux";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useEffect} from "react";
import {fetchAds} from "../../redux/adsRedux";
const AddForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [title, setTitle] = useState( '');
    const [price, setPrice] = useState('');
    const [location, setLocation] = useState('');
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await dispatch(adAdd({ title, price, location, text, image }));
            navigate("/");
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        dispatch(fetchAds());
    }, [dispatch]);
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group key="adTitle" className="mb-3" controlId="adTitle">
                <Form.Label>Tytuł</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter title" />
            </Form.Group>
            <Form.Group key="adPrice" className="mb-3" controlId="adPrice">
                <Form.Label>Cena</Form.Label>
                <Form.Control type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter price" />
            </Form.Group>
            <Form.Group key="adLocation" className="mb-3" controlId="adLocation">
                <Form.Label>Lokalizacja</Form.Label>
                <Form.Control type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location" />
            </Form.Group>
            <Form.Group key="adText" className="mb-3" controlId="adText">
                <Form.Label>Treść</Form.Label>
                <Form.Control as="textarea" rows={3} type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Enter text" />
            </Form.Group>
            <Form.Group key="adImage" className="mb-3" controlId="adImage">
                <Form.Label>Zdjęcie</Form.Label>
                <Form.Control type="file" onChange={e => setImage(e.target.files[0])} />
            </Form.Group>
            <Button type="submit">Add</Button>
        </Form>
    )
}
export default AddForm;