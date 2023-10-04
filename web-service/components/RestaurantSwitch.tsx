import styles from "./css/RestaurantSwitch.module.scss";

export default function RestaurantSwitch() {
    return (
        <div className={styles.container}>
            <div><span>Safka</span></div>
            <div><span>Amistoteles</span></div>
        </div>
    );
}