import Letter from "../Letter";

const Question = ({ answer, prediction, onChange, qn }) => {
  return (
    <div style={{ display: "flex" }}>
      {answer.map((letter, _) => (
        <Letter disabled={!prediction} qn={qn} letter={letter} key={_} onChange={(e) => onChange(e, _)} />
      ))}
    </div>
  );
};
export default Question;
