import react, { useState, useEffect } from "react";
import Question from "src/components/Question";
import QuestionInfo from "src/components/QuestionInfo";
import { questionList } from "src/utils/questions";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

export default function Home() {
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
    }
    setBuy(lastWord);
    setBuyTwo(lastBuy);
  };
  const changeLetter = (e, key) => {
    let lastWord = buy;
    lastWord[key] = e.target.value;
    setClick((prevState) => prevState + 1);
    setBuy(lastWord);
    // let inputList = [];
    // const inputs = document.querySelectorAll("input");
    // Object.keys(inputs).map((key) => {
    //   if (inputs[key].value === "") {
    //     inputList.push(inputs[key]);
    //   }
    // });
    // if (key <= word.length - 2) {
    //   setTimeout(() => {
    //     inputList.find((item) => item.value === "").focus();
    //   }, 1);
    // }
  };
  const submit = () => {
    setPrediction(false);
    let answer = "";
    buy.map((l) => (answer = answer + l));
    if (answer.toLocaleLowerCase("tr-TR") === word.toLocaleLowerCase("tr-TR")) {
      setTotalPoint((prevState) => prevState + point);
    } else {
      setTotalPoint((prevState) => prevState - point);
    }
    setBuy(Array(word.length).fill(""));
    if (questionNumber <= 13) {
      setWord(questionList.find((q) => q.id === questionNumber + 1).answer);
      setPoint(questionList.find((q) => q.id === questionNumber + 1).answer.length * 100);
    }
    if (questionNumber >= 14) setFinish(true);
    setQuestionNumber((prevState) => prevState + 1);
  };
  const predictionHandle = () => {
    setPrediction(true);
    // let inputList = [];
    // const inputs = document.querySelectorAll("input");
    // Object.keys(inputs).map((key) => {
    //   if (inputs[key].value === "") {
    //     inputList.push(inputs[key]);
    //   }
    // });
    // setTimeout(() => {
    //   inputList.find((item) => item.value === "").focus();
    // }, 1);
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
    setWord(questionList.find((q) => q.id === questionNumber).answer);
    setPoint(400);
  }, []);
  return (
    <div className="homepage">
      {!isFinish && (
        <QuestionInfo data={questionList.find((q) => q.id === questionNumber)} point={point} totalPoint={totalPoint} />
      )}
      {!isFinish && <Question qn={questionNumber} answer={buy} prediction={prediction} onChange={changeLetter} />}
      {!isFinish && (
        <div className="buttons">
          <button onClick={() => buyLetter()} disabled={buy.every((item) => item !== "") || prediction}>
            Harf Al!
          </button>
          <button onClick={() => predictionHandle()} disabled={buy.every((item) => item !== "") || prediction}>
            Tahmin Et!
          </button>
          <button disabled={!buy.every((item) => item !== "")} onClick={() => submit()}>
            Gönder!
          </button>
        </div>
      )}
      {isFinish && <div>Tebrikler! Puanınız : {totalPoint}</div>}
      <div className="keyboard">
        {!prediction && <div className="popper"></div>}
        <Keyboard layout={layout} onChange={onChange} onKeyPress={onKeyPress} />
      </div>
    </div>
  );
}
