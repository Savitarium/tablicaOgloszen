import {Navigate, useParams, useNavigate} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {getAdById, updateAds, removeAdRequest} from "../../redux/adsRedux";
import styles from "./Ad.module.scss";
import moment from "moment";
import {IMGS_URL, API_ADS_URL} from "../../config";
import {useEffect, useState} from "react";
import Loader from "../common/Loader";
import AppButton from "../common/Button";
import {getUserLogin} from "../../redux/usersRedux";
import { Link } from 'react-router-dom';


const Ad = () => {
    const { id } = useParams();
    const reduxUserLogin = useSelector(getUserLogin);
    const [connecting, setConnecting] = useState(true);
    const adData = useSelector((state) => getAdById(state, id));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [userLogin, setUserLogin] = useState(null);
console.log(reduxUserLogin);
    useEffect(() => {
        setUserLogin(reduxUserLogin);
    }, [reduxUserLogin]);

    useEffect(() => {
        if (!adData) {
            fetch(API_ADS_URL)
                .then((res) => {
                    if (res.status === 200) {
                        return res.json().then((ads) => {
                            dispatch(updateAds(ads));
                            setConnecting(false);
                        });
                    } else {
                        throw new Error("Nie udało się pobrać danych");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    setConnecting(false);
                });
        } else {
            setConnecting(false);
        }
    }, [id, adData, dispatch]);

    if (connecting) {
        return <Loader />;
    }

    if (!adData) {
        return <Navigate to="/" />;
    }
    console.log('adData.user_info.login: ', adData.user_info.login);
    console.log('userLogin: ', userLogin);
    const deleteAd = (e) => {
        const fetchData = async () => {
            setConnecting(true);
            try {
                await dispatch(removeAdRequest(id));
            } catch (err) {
                console.log(err);
            } finally {
                setConnecting(false);
            }
        };
        fetchData();
    }

    return (
        <div className={styles.container}>
            <h1>Ogłoszenie od {adData.user_info.login}</h1>
            <div className={styles.ad_content}>
                <div className={styles.ad_text}>
                    <div className={styles.ad_header}>
                        <h2>{adData.title}</h2>
                        <p className={styles.date_text}>Added { moment(adData.publication_date).format('DD.MM.YYYY HH:mm:ss') }</p>
                    </div>
                    <div className={styles.text_container}>
                        <div className={styles.text_container_text}>
                            <p className={styles.ad_text_text}>{adData.text}</p>
                        </div>
                        <div className={styles.text_container_image}>
                            <img src={IMGS_URL + adData.image} crossOrigin="anonymous" />
                            <p className={styles.price}>Cena {adData.price} zł.</p>
                        </div>
                    </div>
                </div>
                <div className={styles.ad_info}>
                    <div className={styles.ad_info_header}>
                        <div className={styles.user_avatar}>
                            <img src={IMGS_URL + adData.user_info.avatar} crossOrigin="anonymous" />
                        </div>
                        <div className={styles.user_login}>
                            <h2>{adData.user_info.login}</h2>
                        </div>
                    </div>
                    <div className={styles.phone_container}>
                        <p className={styles.phone}>Numer telefonu: {adData.user_info.phone}</p>
                    </div>
                    {userLogin !== null && adData.user_info.login === userLogin.login && (<div className={styles.buttons_section}>
                        <Link to={`/edit/${adData._id}`}>
                            <AppButton>Edit</AppButton>
                        </Link>
                        <AppButton onClick={deleteAd}>Delete</AppButton>
                    </div>)}
                </div>
            </div>
        </div>
    )
}
export default Ad;