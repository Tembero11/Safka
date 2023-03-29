import { UIEvent, useEffect, useRef, useState } from "react";
import styles from "./css/Drawer.module.scss";

interface IProps {
  onClose: () => void;
  isOpen: boolean;
  children?: React.ReactNode;
}


export default function Drawer(props: IProps) {
  const [isAutoScrolling, setAutoScrolling] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({top: 201});
    containerRef.current?.scrollTo({top: window.innerHeight / 2, behavior: "smooth"});
  }, [props.isOpen]);

  function onScroll(e: UIEvent<HTMLDivElement>) {
    console.log(e.currentTarget.scrollTop)
    if (e.currentTarget.scrollTop == 0) {
      setAutoScrolling(false);
      props.onClose();
    }
    if (e.currentTarget.scrollTop <= 200 && !isAutoScrolling) {
      setAutoScrolling(true);
      e.currentTarget.scrollTo({top: 0, behavior: "smooth"});
    }
  }

  return (
    props.isOpen ? (
      <div className={styles.container} ref={containerRef} onClick={e => e.target == e.currentTarget && props.onClose()} onScroll={onScroll}>
        <div className={styles.content}>
          {props.children}
        </div>
      </div>
    ) : null
  )
}