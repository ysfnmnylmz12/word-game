import react from "react";
import styles from "./Letter.module.scss";
import cn from "classnames";

const Letter = ({ letter, qn, error, correct, disabled, onChange, ...props }) => {
  const ref = react.useRef();
  react.useEffect(() => {
    if (letter === "") ref.current.value = letter;
  }, [letter, qn]);
  return (
    <div className={styles.wrapper}>
      {letter !== "" ? (
        <p>{letter}</p>
      ) : (
        <input
          disabled={disabled}
          defaultValue={letter}
          ref={ref}
          className={cn(styles.hexagon, error && styles.error, correct && styles.correct, disabled && styles.disabled)}
          onChange={onChange}
          maxLength={1}
          {...props}
        />
      )}
    </div>
  );
};

export default Letter;
