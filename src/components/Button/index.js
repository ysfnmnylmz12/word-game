import styles from "./Button.module.scss";

const Button = ({ text, disable, onClick, ...props }) => {
  return (
    <div className={styles.wrapper}>
      <button className={styles.button} disabled={disable} onClick={onClick}>
        {text}
      </button>
    </div>
  );
};

export default Button;
