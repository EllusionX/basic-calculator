document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const calculator = document.querySelector(".container");
  const screen = document.querySelector(".screen p");
  const keypad = document.querySelector(".keypad");

  const nums = new Array();   //input numbers
  var opKey = new Array();    //input operator keys
  var flagForEqual = false;   //check if equal is press

  keypad.addEventListener("click", (e) => {
    if (e.target.matches("span")) {
      const key = e.target;
      const action = key.dataset.func;
      const keyContent = key.textContent;
      const displayNum = screen.textContent;

      //check if equal is press
      if (action === "equal" && !flagForEqual) {
        nums.push(screen.textContent);
        if (nums.length === 2) {
          let result = calculate(nums, opKey[0]);
          updateNumsArray(result, nums);
          opKey[0] = action;
          screen.textContent = result;
        } else if (nums[0].includes("%")){
          nums[0] = nums[0].replace(/%/g, "") / 100;
          screen.textContent = nums[0];
        }

        flagForEqual = true;
        console.log(nums, opKey);
      }

      //clear / setup display
      if (!action) {
        if (
          displayNum === "0" ||
          calculator.dataset.operatorPress === "true" ||
          flagForEqual === true
        ) {
          screen.textContent = keyContent;
          calculator.dataset.operatorPress = "";
          if (flagForEqual === true) {
            flagForEqual = false;
            nums.length = 0;
            opKey.length = 0;
          }
        } else {
          screen.textContent += keyContent;
        }
      }

      if (action === "dot") {
        if (!screen.textContent.includes(".")) {
          screen.textContent += ".";
        }
      }

      if (action === "percentage") {
        if (screen.textContent.includes("%")) {
          screen.textContent = screen.textContent.replace(/%/g, "");
        } else {
          screen.textContent += "%";
        }
      }

      //checking for operators
      if (
        action === "add" ||
        action === "minus" ||
        action === "multiply" ||
        action === "divide"
      ) {
        console.log(opKey);
        if (opKey[0] !== "equal" && calculator.dataset.operatorPress !== 'true') {
          if(!flagForEqual)
            nums.push(screen.textContent);
        } else {
          opKey.length = 0;
        }
        opKey.push(action);
        calculator.dataset.operatorPress = "true";
        console.log("nums: " + nums + " -- opKey: " + opKey);
        flagForEqual = false;
      } else if (action === "clear") {
        nums.length = 0;
        opKey.length = 0;
        screen.textContent = "0";
      }

      //calculation take place if nums have 2 values
      if (nums.length == 2) {
        updateNumsArray(calculate(nums, opKey[0]), nums);
        opKey.shift();
        console.log(opKey);
      }
    }
  }); //end of keypad listener

  const updateNumsArray = (value, numsArray) => {
    numsArray[0] = value.toString();
    numsArray.pop();
    screen.textContent = value.toString();
  };

  const calculate = (numArray, operator) => {
    numArray = checkPercentage(numArray);
    switch (operator) {
      case "add":
        return parseFloat(numArray[0]) + parseFloat(numArray[1]);
        break;
      case "minus":
        return parseFloat(numArray[0]) - parseFloat(numArray[1]);
        break;
      case "divide":
        return parseFloat(numArray[0]) / parseFloat(numArray[1]);
        break;
      case "multiply":
        return parseFloat(numArray[0]) * parseFloat(numArray[1]);
        break;  
      default:
        console.log("it broke the values are: " + operator);
    }
  };

  const checkPercentage = (numArray) => {
    numArray.forEach((element, index, editArray) => {
      console.log("type of element: " + typeof element);
      if (element.includes("%")) {
        editArray[index] = element.replace(/%/g, "") / 100;
        editArray[index]  = parseFloat(editArray[0]) * parseFloat(numArray[1]);
      }
    });
    return numArray;
  };


}); // end of DOM
