import React, { useState } from "react";
import "./HaversineForm.css";

const HaversineForm = () => {
  const [pointA, setPointA] = useState("");
  const [pointB, setPointB] = useState("");
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const errorMessages = {
    CommaNeeded:
      "Separate latitude and longtitude values with a comma for valid input.",
    TooManyCommas: "Invalid input, too many commas.",
    NotValidNumber: "Invalid input, must be a number.",
    NotInLatRange: "Invalide input, Latitude must be between -90 and 90.",
    NotInLonRange: "Invalide input, longtitude must be between -180 and 180.",
  };

  function getStringPartsFromInput(userInputString) {
    let pieces = userInputString.split(",");
    const commaCount = pieces.length;

    if (commaCount < 1) {
      return {isSuccess: false, errorMessage: errorMessages.CommaNeeded};
    }
    if (commaCount > 1) {
      return {isSuccess: false, errorMessage: errorMessages.CommaNeeded};
    } 
    return {isSuccess: true, value: pieces};
  }

  function getValidCoordinates(parts) {
    const [latitude, longitude] = parseFloat(parts);
    if(isNaN(latitude) || isNaN(longitude)) {
      return {isSuccess: false, errorMessage: errorMessages.NotValidNumber};
    }

    if(Math.abs(latitude) > 90){
      return {isSuccess: false, errorMessage: errorMessages.NotInLatRange};
    }
    if(Math.abs(latitude) > 180){
      return {isSuccess: false, errorMessage: errorMessages.NotInLonRange};
    }
    
    return {isSuccess: true, value: {latitude, longitude}};
  }

  function getValidUserInput(userInputString) {
    const getPartsResult = getStringPartsFromInput(userInputString);
    if(!getPartsResult.isSuccess) return getPartsResult;
    const parts = getPartsResult.value;
    if (
      getValidCoordinates(userInputString) === true
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
      if (!getValidUserInput(string)) {
        return false;
      }
    }
    return haversine(parseUserInput(string1), parseUserInput(string2));
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
