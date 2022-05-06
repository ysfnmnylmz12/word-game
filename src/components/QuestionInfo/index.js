import styles from "./QuestionInfo.module.scss";

const QuestionInfo = ({ data, point, totalPoint }) => {
  return (
    <div className={styles.main}>
      <h1 className={styles.question}>{data.question}</h1>
      <div className={styles.points}>
        <div className={styles.total}>
          <h2>Toplam Puan : {String(totalPoint)}</h2>
        </div>
        <div className={styles.current}>
          <h2>Soru Puanı : {String(point)}</h2>
        </div>
      </div>
    </div>
  );
};

export default QuestionInfo;
