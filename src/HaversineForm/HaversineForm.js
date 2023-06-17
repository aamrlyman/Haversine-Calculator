import React, { useState } from "react";
import "./HaversineForm.css";

const HaversineForm = () => {
  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const errorMessages = {
    CommaNeeded: "Separate latitude and longtitude values with a comma for valid input.",
    InputNeeded: "No input provided",
    TooManyCommas: "Invalid input, too many commas.",
    LatNotValidNumber: "Invalid input, latitude must be a number.",
    LonNotValidNumber: "Invalid input, longtitude must be a number.",
    NotInLatRange: "Invalide input, latitude must be between -90 and 90.",
    NotInLonRange: "Invalide input, longtitude must be between -180 and 180.",
  };

  function getStringPartsFromInput(userInputString) {
    let coordinatesArr = userInputString.split(",");
    const commaCount = coordinatesArr.length;

    if (coordinatesArr[0] === "")
      return { isSuccess: false, errorMessage: errorMessages.InputNeeded };
    if (commaCount === 1) {
      return { isSuccess: false, errorMessage: errorMessages.CommaNeeded };
    }
    if (commaCount > 2) {
      return { isSuccess: false, errorMessage: errorMessages.TooManyCommas };
    }
    return { isSuccess: true, value: coordinatesArr };
  }

  function getValidCoordinates(coordinatesArr) {
    const latitude = parseFloat(coordinatesArr[0]);
    const longtitude = parseFloat(coordinatesArr[1]);
    if (isNaN(latitude)) {
      return {
        isSuccess: false,
        errorMessage: errorMessages.LatNotValidNumber,
      };
    }
    if (isNaN(longtitude)) {
      return {
        isSuccess: false,
        errorMessage: errorMessages.LonNotValidNumber,
      };
    }
    if (Math.abs(latitude) > 90) {
      return { isSuccess: false, errorMessage: errorMessages.NotInLatRange };
    }
    if (Math.abs(longtitude) > 180) {
      return { isSuccess: false, errorMessage: errorMessages.NotInLonRange };
    }
    return { isSuccess: true, value: [latitude, longtitude] };
  }

  function getValidUserInput(userInputString) {
    const coordinatesArrResult = getStringPartsFromInput(userInputString);
    if (!coordinatesArrResult.isSuccess) return coordinatesArrResult;
    const coordinatesArr = coordinatesArrResult.value;
    const validCoordinates = getValidCoordinates(coordinatesArr);
    return validCoordinates;
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

  function checkValidParseInputCalcDist(userInputStr1, userInputStr2) {
    const coord1 = getValidUserInput(userInputStr1);
    if (!coord1.isSuccess) {
      return setErrorMessage(coord1.errorMessage);
    }
    const coord2 = getValidUserInput(userInputStr2);
    if (!coord2.isSuccess) {
      return setErrorMessage(coord2.errorMessage);
    }

    return haversine(coord1.value, coord2.value);
  }

  const handleSubmit = (e) => {
    setErrorMessage("");
    e.preventDefault();
    let distance = checkValidParseInputCalcDist(pointA, pointB);
    if (distance) {
      setResult(distance);
    }
  };
  const reset = () => {
    setPointA("");
    setPointB("");
    setResult(null);
    setErrorMessage("");
  };
  return (
    <div className="formContainer">
      <form onSubmit={handleSubmit}>
        <label>
          Point A
          <input
            type="text"
            value={pointA}
            onChange={(e) => setPointA(e.target.value)}
            placeholder="eg. 1.024, 34.578"
          />
        </label>
        <br />
        <label>
          Point B
          <input
            type="text"
            value={pointB}
            placeholder="eg. 46.024, 24.578"
            onChange={(e) => setPointB(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Calculate</button>
        <button type="button" onClick={() => reset()}>
          Reset
        </button>
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
