import styles from './Loader.module.scss';

const Loader = () => {
    return (
        <img
            className={styles.container}
            alt="????"
            src={`${process.env.PUBLIC_URL}/images/loader.png`} />
    );
};

export default Loader;