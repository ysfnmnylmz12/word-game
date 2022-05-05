import styles from "./QuestionInfo.module.scss";

const QuestionInfo = ({ data, point, totalPoint }) => {
  return (
    <div className={styles.main}>
      <h1>{data.question}</h1>
      <div className={styles.points}>
        <h2>Soru Puanı : {String(point)}</h2>
        <h2>Toplam Puan : {String(totalPoint)}</h2>
      </div>
    </div>
  );
};

export default QuestionInfo;
