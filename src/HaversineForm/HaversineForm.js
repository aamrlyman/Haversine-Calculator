import React, { useState } from "react";
import "./HaversineForm.css"

const HaversineForm = () => {
  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const errorMessages = [
    "Separate latitude and longtitude values with a comma for valid input.",
    "Invalid input, too many commas.",
    "Invalid input, must be a number.",
    "Invalide input, Latitude must be between -90 and 90.",
    "Invalide input, longtitude must be between -180 and 180.",
  ];

  function isValidCommas(userInputString) {
    let commaCount = 0;
    for (const char of userInputString) {
      if (char === ",") {
        commaCount += 1;
      }
    }
    if (commaCount < 1) {
      setErrorMessage(errorMessages[0]);
      return false;
    }
    if (commaCount > 1) {
      setErrorMessage(errorMessages[1]);
      return false;
    } else {
      return true;
    }
  }

  function separateUserInputStr(userInputString) {
    const commaIndex = userInputString.indexOf(",");
    const latStr = userInputString.substring(0, commaIndex);
    const lonStr = userInputString.substring(commaIndex + 1);
    return [latStr, lonStr];
  }

  function areNumsValid(userInputString) {
    let coord = separateUserInputStr(userInputString);
    for (let i = 0; i < coord.length; i++) {
      if (isNaN(parseFloat(coord[i]))) {
        setErrorMessage(errorMessages[2]);
        return false;
      }
      if (i === 0 && Math.abs(coord[i]) > 90) {
        setErrorMessage(errorMessages[3]);
        return false;
      }
      if (i === 1 && Math.abs(coord[i]) > 180) {
        setErrorMessage(errorMessages[4]);
        return false;
      }
    }
    return true;
  }

  function validateUserInput(userInputString) {
    if (
      isValidCommas(userInputString) === true &&
      areNumsValid(userInputString) === true
    ) {
      return true;
    } else {
      return false;
    }
  }

  function parseUserInput(userInputString) {
    let strCoord = separateUserInputStr(userInputString);
    let numCoord = [];
    numCoord[0] = parseFloat(strCoord[0]);
    numCoord[1] = parseFloat(strCoord[1]);
    return numCoord;
  }

  function toRadians(degrees) {
    return (degrees * Math.PI) / 180;
  }

  function haversine(coord1, coord2) {
    const EarthsRadius = 6371000;
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;

    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaPhi = toRadians(lat2 - lat1);
    const deltaLambda = toRadians(lon2 - lon1);

    const a =
      Math.sin(deltaPhi / 2) ** 2 +
      Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;

    const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const roundedDistInKm = ((EarthsRadius * centralAngle) / 1000).toFixed(3);

    return `${roundedDistInKm}km`;
  }

  function checkValidParseInputCalcDist(string1, string2) {
    const coordinates = [string1, string2];
    for (const string of coordinates) {
      if (!validateUserInput(string)) {
        return false;
      }
    }
    return haversine(parseUserInput(string1), parseUserInput(string2));
  }

  const handleSubmit = (e) => {
    setErrorMessage("")
    e.preventDefault();
    let distance = checkValidParseInputCalcDist(pointA, pointB);
    if (distance) {
      setResult(distance);
    }
  };
const reset = (()=>{
    setPointA("");
    setPointB("");
    setResult(null);
    setErrorMessage("");
})
  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <label>
          Point A 
          <input
            type="text"
            value={pointA}
            onChange={(e) => setPointA(e.target.value)}
          />
        </label>
        <br />
        <label>
          Point B 
          <input
            type="text"
            value={pointB}
            onChange={(e) => setPointB(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Calculate</button>
        <button type="button" onClick={()=>reset()}>Reset</button>
      </form>
      <div className="resultsContainer">
        {errorMessage ? <p>{errorMessage}</p> : ""}
        <p>Distance: {result}</p>
      </div>
    </div>
  );
};

export default HaversineForm;

// console.log(haversine(coord1, coord2)); // 877
// console.log(haversine([10, 10], [1, 1])); // 1410
// console.log(haversine([54, 45], [1, 1])); // 7122
// console.log(haversine([1.6465, 23], [1, 1])); // 2445
// console.log(haversine([-1, -1], [11, 180])); // 18898
// console.log(haversine([0, 0], [11, 180])); // 18791
