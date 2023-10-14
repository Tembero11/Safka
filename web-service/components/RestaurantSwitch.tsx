import { useState } from "react";
import styles from "./css/RestaurantSwitch.module.scss";

export interface IRestaurant {
    id: number;
    name: string;
    schoolName: string,
    url: string;
}

interface IProps {
    onChange: (restaurant: IRestaurant) => void
    restaurants: IRestaurant[]
}

export default function RestaurantSwitch(props: IProps) {
    const [currentId, setCurrentId] = useState(0);

    const restaurantWidth = 118;
    const padding = 8;
    const selectionLeft = restaurantWidth + padding;

    function onChange(restaurant: IRestaurant) {
        if (restaurant.id == currentId) return;

        setCurrentId(restaurant.id);
        props.onChange(restaurant);
    }

    return (
        <div className={styles.container}>
            <div className={styles.selection} style={{left: selectionLeft * currentId}}></div>
            {props.restaurants.map(e => {
                return (
                    <div onClick={() => onChange(e)} data-selected={e.id == currentId}>
                        <span>{e.name}</span>
                    </div>
                )
            })}
        </div>
    );
}