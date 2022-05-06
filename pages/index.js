import react, { useState, useEffect } from "react";
import Question from "src/components/Question";
import QuestionInfo from "src/components/QuestionInfo";
import { questionList } from "src/utils/questions";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import Button from "src/components/Button";
import useSound from "use-sound";
const applause = "/assets/sfx/applause.mp3";
const collect = "/assets/sfx/collect.mp3";
const fail = "/assets/sfx/fail.mp3";

export default function Home() {
  const [applauseSound] = useSound(applause);
  const [collectSound] = useSound(collect);
  const [failSound] = useSound(fail);
  const [word, setWord] = useState("");
  const [buy, setBuy] = useState([]);
  const [buyTwo, setBuyTwo] = useState([]);
  const [click, setClick] = useState(0);
  const [point, setPoint] = useState(0);
  const [totalPoint, setTotalPoint] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [prediction, setPrediction] = useState(false);
  const [isFinish, setFinish] = useState(false);
  const layout = {
    default: ["e r t y u ı o p ğ ü {bksp}", "a s d f g h j k l ş i", "z c v b n m ö ç"],
    shift: [
      "~ ! @ # $ % ^ &amp; * ( ) _ + {bksp}",
      "{tab} Q W E R T Y U I O P { } |",
      '{lock} A S D F G H J K L : " {enter}',
      "{shift} Z X C V B N M &lt; &gt; ? {shift}",
      ".com @ {space}",
    ],
  };
  const buyLetter = () => {
    const full = buy.every((item) => item !== "");
    let selectedIndex = Math.floor(Math.random() * word.length);
    let lastWord = buy;
    let lastBuy = buyTwo;
    while (buy[selectedIndex] !== "") {
      if (buy.every((letter) => letter !== "")) break;
      selectedIndex = Math.floor(Math.random() * word.length);
    }
    setClick((prevState) => prevState + 1);
    setPoint((prevState) => prevState - 100);
    if (!full) {
      lastWord[selectedIndex] = word.split("")[selectedIndex];
      lastBuy[selectedIndex] = "buyed";
      collectSound();
    }
    setBuy(lastWord);
    setBuyTwo(lastBuy);
  };
  const changeLetter = (e, key) => {
    let lastWord = buy;
    lastWord[key] = e.target.value;
    setClick((prevState) => prevState + 1);
    setBuy(lastWord);
  };
  const submit = () => {
    setPrediction(false);
    let answer = "";
    buy.map((l) => (answer = answer + l));
    if (answer.toLocaleLowerCase("tr-TR") === word.toLocaleLowerCase("tr-TR")) {
      applauseSound();
      setTotalPoint((prevState) => prevState + point);
      localStorage.setItem("totalPoint", totalPoint + point);
      nextQuestion();
    } else {
      failSound();
      setTotalPoint((prevState) => prevState - point);
      localStorage.setItem("totalPoint", totalPoint - point);
    }
    setBuy(Array(word.length).fill(""));
    if (questionNumber >= 14) {
      localStorage.setItem("isFinish", true);
      setFinish(true);
    }
    setQuestionNumber((prevState) => prevState + 1);
  };
  const nextQuestion = () => {
    if (questionNumber <= 13) {
      setWord(questionList.find((q) => q.id === questionNumber + 1).answer);
      setPoint(questionList.find((q) => q.id === questionNumber + 1).answer.length * 100);
      localStorage.setItem("questionNumber", questionList.find((q) => q.id === questionNumber + 1).answer);
    }
  };
  const predictionHandle = () => {
    setPrediction(true);
  };
  const onChange = (input) => {
    // console.log("Input changed", input);
  };

  const onKeyPress = (button) => {
    const index = buy.findIndex((b) => b === "");
    if (button === "{bksp}") {
      let notBuyedIndexes = [];
      buyTwo.map((bt, i) => {
        if (bt !== "buyed" && buy[i] !== "") notBuyedIndexes.push(i);
      });
      let newIndex = index === -1 ? buy.length : index;
      changeLetter({ target: { value: "" } }, notBuyedIndexes[notBuyedIndexes.length - 1]);
    } else {
      changeLetter({ target: { value: button } }, index);
    }
  };
  useEffect(() => {
    setBuy(Array(word.length).fill(""));
    setBuyTwo(Array(word.length).fill(""));
  }, [word]);
  useEffect(() => {
    if (
      localStorage.getItem("date") === new Date().toISOString().substring(0, 10) &&
      localStorage.getItem("isFinish") === "true"
    ) {
      setFinish(true);

      setTotalPoint(Number(localStorage.getItem("totalPoint")));
    } else {
      localStorage.setItem("date", new Date().toISOString().substring(0, 10));
      setWord(questionList.find((q) => q.id === questionNumber).answer);
      setPoint(400);
    }
  }, []);
  return (
    <div className="homepage">
      {!isFinish && (
        <QuestionInfo data={questionList.find((q) => q.id === questionNumber)} point={point} totalPoint={totalPoint} />
      )}
      {!isFinish && <Question qn={questionNumber} answer={buy} prediction={prediction} onChange={changeLetter} />}
      {!isFinish && (
        <div className="buttons">
          <Button
            text="Harf Al!"
            disable={buy.every((item) => item !== "") || prediction}
            onClick={() => buyLetter()}
          />
          <Button
            text="Tahmin Et!"
            disable={buy.every((item) => item !== "") || prediction}
            onClick={() => predictionHandle()}
          />
          <Button text="Gönder" disable={!buy.every((item) => item !== "")} onClick={() => submit()} />
        </div>
      )}
      {isFinish && <div>Tebrikler! Puanınız : {totalPoint}</div>}
      <div className="keyboard">
        {!prediction && <div className="popper"></div>}
        {!isFinish && <Keyboard layout={layout} onChange={onChange} onKeyPress={onKeyPress} />}
      </div>
    </div>
  );
}
