import React, { useEffect, useMemo, useState } from "react";

export default function Game() {
  const [coordYBot, setCoordYBot] = useState(600);
  const [coordXBot, setCoordXBot] = useState(300);
  const [coordX, setCoordX] = useState(20);
  const [coordY, setCoordY] = useState(30);
  const [apple1isDelete, setApple1isDelete] = useState(false);
  const [apple2isDelete, setApple2isDelete] = useState(false);
  const [apple3isDelete, setApple3isDelete] = useState(false);
  const [apple4isDelete, setApple4isDelete] = useState(false);
  const [apple5isDelete, setApple5isDelete] = useState(false);
  const [apple6isDelete, setApple6isDelete] = useState(false);
  const [isStart, setIsStart] = useState(false);
  const [objPresents, setObjPresents] = useState({
    objY1: getRandomInt(0, 900),
    objX1: getRandomInt(0, 900),
    objY2: getRandomInt(0, 900),
    objX2: getRandomInt(0, 900),
    objY3: getRandomInt(0, 900),
    objX3: getRandomInt(0, 900),
    objY4: getRandomInt(0, 900),
    objX4: getRandomInt(0, 900),
    objY5: getRandomInt(0, 900),
    objX5: getRandomInt(0, 900),
    objY6: getRandomInt(0, 900),
    objX6: getRandomInt(0, 900),
  });
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [sizeMe, setSizeMe] = useState({
    width: 30,
    height: 30,
  });

  const bigMe = () => {
    setSizeMe({
      height: sizeMe.height + 10,
      width: sizeMe.width + 10,
    });
  };
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const handleKeyPress = (event) => {
    if (!isStart) {
      setIsStart(true);
      setTimeStart(new Date().getTime());
    }

    switch (event.key) {
      case "w":
        setCoordY(coordY - 4);
        break;
      case "s":
        setCoordY(coordY + 4);
        break;
      case "a":
        setCoordX(coordX - 4);
        break;
      case "d":
        setCoordX(coordX + 4);
        break;
      default:
        break;
    }

    const cyfre = sizeMe.height;
    if (
      objPresents.objX1 >= coordX - cyfre &&
      objPresents.objX1 <= coordX + cyfre &&
      objPresents.objY1 >= coordY - cyfre &&
      objPresents.objY1 <= coordY + cyfre &&
      !apple1isDelete
    ) {
      setApple1isDelete(true);
      bigMe();
      console.log("delete 1");
    }
    if (
      objPresents.objX2 >= coordX - cyfre &&
      objPresents.objX2 <= coordX + cyfre &&
      objPresents.objY2 >= coordY - cyfre &&
      objPresents.objY2 <= coordY + cyfre &&
      !apple2isDelete
    ) {
      bigMe();
      setApple2isDelete(true);
      console.log("delete 1");
    }
    if (
      objPresents.objX3 >= coordX - cyfre &&
      objPresents.objX3 <= coordX + cyfre &&
      objPresents.objY3 >= coordY - cyfre &&
      objPresents.objY3 <= coordY + cyfre &&
      !apple3isDelete
    ) {
      bigMe();
      setApple3isDelete(true);
      console.log("delete 1");
    }

    if (
      objPresents.objX4 >= coordX - cyfre &&
      objPresents.objX4 <= coordX + cyfre &&
      objPresents.objY4 >= coordY - cyfre &&
      objPresents.objY4 <= coordY + cyfre &&
      !apple4isDelete
    ) {
      bigMe();
      setApple4isDelete(true);
      console.log("delete 1");
    }

    if (
      objPresents.objX5 >= coordX - cyfre &&
      objPresents.objX5 <= coordX + cyfre &&
      objPresents.objY5 >= coordY - cyfre &&
      objPresents.objY5 <= coordY + cyfre &&
      !apple5isDelete
    ) {
      bigMe();
      setApple5isDelete(true);
      console.log("delete 1");
    }

    if (
      objPresents.objX6 >= coordX - cyfre &&
      objPresents.objX6 <= coordX + cyfre &&
      objPresents.objY6 >= coordY - cyfre &&
      objPresents.objY6 <= coordY + cyfre &&
      !apple6isDelete
    ) {
      bigMe();
      setApple6isDelete(true);
      console.log("delete 1");
    }

    if (
      apple1isDelete &&
      apple2isDelete &&
      apple3isDelete &&
      apple4isDelete &&
      apple5isDelete &&
      apple6isDelete
    ) {
      setTimeEnd(new Date().getTime());
    }
  };

  useEffect(() => {
    if (isStart) {
      const timeSec = (timeEnd - timeStart) / 1000;
      alert(`You winner!!! Your result is ${timeSec} sec`);
      setApple1isDelete(false);
      setApple2isDelete(false);
      setApple3isDelete(false);
      setApple4isDelete(false);
      setApple5isDelete(false);
      setApple6isDelete(false);
      setCoordX(30);
      setCoordY(30);
    }
  }, [timeEnd]);
  return (
    <>
      <div className="App_board">
        <span
          className="myLine"
          style={{
            top: `${coordY}px`,
            left: `${coordX}px`,
            width: sizeMe.width,
            height: sizeMe.height,
          }}
        ></span>

        <span
          className="myBot"
          style={{ top: `${coordYBot}px`, left: `400px` }}
        ></span>
        <span
          className="myBot"
          style={{ top: `${coordYBot}px`, left: `800px` }}
        ></span>

        <span
          className="myBot"
          style={{ top: `${coordYBot}px`, left: `1000px` }}
        ></span>
        <span
          className="Apple"
          style={{
            top: `${objPresents.objY1}px`,
            left: `${objPresents.objX1}px`,
            display: apple1isDelete ? "none" : "block",
          }}
        ></span>
        <span
          className="Apple"
          style={{
            top: `${objPresents.objY2}px`,
            left: `${objPresents.objX2}px`,
            display: apple2isDelete ? "none" : "block",
          }}
        ></span>
        <span
          className="Apple"
          style={{
            top: `${objPresents.objY3}px`,
            left: `${objPresents.objX3}px`,
            display: apple3isDelete ? "none" : "block",
          }}
        ></span>

        <span
          className="Apple"
          style={{
            top: `${objPresents.objY4}px`,
            left: `${objPresents.objX4}px`,
            display: apple4isDelete ? "none" : "block",
          }}
        ></span>

        <span
          className="Apple"
          style={{
            top: `${objPresents.objY5}px`,
            left: `${objPresents.objX5}px`,
            display: apple5isDelete ? "none" : "block",
          }}
        ></span>

        <span
          className="Apple"
          style={{
            top: `${objPresents.objY6}px`,
            left: `${objPresents.objX6}px`,
            display: apple6isDelete ? "none" : "block",
          }}
        ></span>
      </div>
      <input onKeyPress={handleKeyPress} autoFocus />
    </>
  );
}
