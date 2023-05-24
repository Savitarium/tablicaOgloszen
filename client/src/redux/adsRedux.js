import {API_ADS_URL} from "../config";
//selectors
export const getAllAds = (state) => {
    const ads = state.ads;
    console.log(ads);
    const sortedAds = ads.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
    return sortedAds;
};
export const getAdById = ({ads}, adId) => ads.find(ad => ad._id === adId);

// actions
const createActionName = actionName => `api/ads/${actionName}`;
const UPDATE_ADS = createActionName('UPDATE_ADS');
const REMOVE_AD = createActionName('REMOVE_AD');
const ADD_AD = createActionName('ADD_AD');
const EDIT_AD = createActionName('EDIT_AD');
const SEARCH_ADS = createActionName('SEARCH_ADS');
//Fetche


export const fetchAdvertBySearchPhrase = (searchPhrase) => {
    return (dispatch) => {
        fetch(API_ADS_URL + 'search/' + searchPhrase)
            .then((res) => res.json())
            .then((ads) => dispatch(updateAds(ads)));
        dispatch(searchAd(searchPhrase));
    };
};
export const fetchAds = () => {
    return (dispatch) => {
        fetch(API_ADS_URL)
            .then(res => {
                if(res.status === 200) {
                    return res.json().then(ads => {
                        dispatch(updateAds(ads));
                    });
                } else {
                    throw new Error('Nie udało się pobrać danych');
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
};

export const adAdd = (newAd) => {
    const fd = new FormData();
    fd.append('title', newAd.title);
    fd.append('text', newAd.text);
    fd.append('location', newAd.location);
    fd.append('price', newAd.price);
    fd.append('image', newAd.image);
    return (dispatch) => {
        const options = {
            method: 'POST',
            credentials: 'include',
            body: fd,
        };
        fetch(`${API_ADS_URL}`, options)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then((res) => {
                console.log(res);
                dispatch(addAd(res.newAd));
            });
    };
};

export const editAdRequest = (edAd, id) => {
    const fd = new FormData();
    fd.append('title', edAd.title);
    fd.append('text', edAd.text);
    fd.append('location', edAd.location);
    fd.append('price', edAd.price);
    fd.append('image', edAd.image);

    return (dispatch) => {
        const options = {
            method: 'PUT',
            credentials: 'include',
            body: fd,
        };

        fetch(`${API_ADS_URL}${id}`, options)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
            })
            .then((res) => {
                console.log(res);
                dispatch(editAd(res.edAd));
            });
    };
};

export const removeAdRequest = (id) => {
    return (dispatch) => {
        fetch(`${API_ADS_URL}${id}`, {
            method: "DELETE",
        })
            .then((res) => {
                if(res.status === 200) {
                    dispatch(removeAd(id));
                } else {
                    throw new Error("Nie udało się usunąć ogłoszenia");
                }
            }).catch ((err) => {
            console.error(err);
        })
    }
}

// action creators
export const updateAds = payload => ({type: UPDATE_ADS, payload});
export const removeAd = (payload) => ({type: REMOVE_AD, payload})
export const addAd = (payload) => ({ type: ADD_AD, payload });
export const editAd = (payload) => ({ payload, type: EDIT_AD });
export const searchAd = (searchPhrase) => ({
    type: SEARCH_ADS,
    payload: { searchPhrase },
});
const adsReducer = (statePart = [], action) => {
    switch(action.type) {
        case UPDATE_ADS:
            return [...action.payload]
        case REMOVE_AD:
            return statePart.filter(ad => ad._id !== action.payload);
        case ADD_AD:
            return [...statePart, action.payload];
        case EDIT_AD:
            return statePart.map((ad) =>
                ad._id === action.payload._id ? { ...ad, ...action.payload } : ad
            );
        case SEARCH_ADS:
            return statePart.filter((ad) => ad.title.includes(action.payload));
        default:
            return statePart;
    }
};
export default adsReducer;
