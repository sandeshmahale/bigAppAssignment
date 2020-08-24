const fs = require('fs');
const inputJson = JSON.parse(fs.readFileSync('expression.json'));

const array = [];

const eachOperator = (value) => {
    switch (value) {
        case "equal":
            return "=";
        case "add":
            return "+";
        case "subtract":
            return "-";
        case "multiply":
            return "*";
        case "divide":
            return "/";
        default:
            return value
    }
}

const OppOperator = (value) => {
    switch(value) {
        case "+":  
            return "-";
        case "-": 
            return "+";
        case "*": 
            return "/";
        case "/" : 
            return "*";
        default: 
            return value
    }
}

const isOperator = (operator) => {
    if (operator === '+' || operator === '-' || operator === '*' || operator === '/' || operator === '=') {
        return true;
    } else {
        return false;
    }
}

const recursionLoop = (obj) => {
    for (var k in obj) {
        if (typeof obj[k] == "object") {
            recursionLoop(obj[k]);
        } else {
            array.push(eachOperator(obj[k]));
        }
    }
    return array;
}

const removeSpace = (array) => {
    for(var i = array.length - 1; i >= 0; i--) {
        if(array[i].length === 0) {
           array.splice(i, 1);
        }
    }
    return array
}

const prefixToInfix = (expArray) => {
    let expression = [];
    let length = expArray.length;

    for (let i = length - 1; i >= 0; i--) {

        if (isOperator(expArray[i])) {
            let op1 = expression[expression.length - 1];
            expression.pop();
            let op2 = expression[expression.length - 1];
            expression.pop();

            let temp = ''
            if (i <= 1) {
                temp = op1 + " " + expArray[i] + " " + op2;
            }
            else {
                temp = "(" + op1 + " " + expArray[i] + " " + op2 + ")";
            }
            expression.push(temp);

        } else {
            expression.push(expArray[i]);
        }
    }
    return expression[expression.length - 1]
}

const simplify = (rhs, lhs) => {
    let value = [];
    lhs = lhs.split(' ').join(",").replace(/[\s''x()]/g,'').split(",");
    exp = removeSpace(lhs)
    if(exp.length > 3){
        for (let i = 1; i < lhs.length; i++) {
            if (isOperator(lhs[i]) && isOperator(lhs[i+1])) {
                value.push(OppOperator(lhs[i])+lhs[i-1]+")"+OppOperator(lhs[i+1]));
                i++
            }else if(isOperator(lhs[i])){
                value.push(OppOperator(lhs[i])+lhs[i-1]);
            }
            else {
                value.push(lhs[i]);
            }
        }
        return "(" + rhs + value.join('');
    }
    return rhs+ lhs.slice(0,lhs.length-1);
}

const parsedArray = recursionLoop(inputJson);
const expression = prefixToInfix(parsedArray);
console.log("1st point : ", expression)
const lhs = expression.split('=')[0];
const rhs = expression.split('=')[1].trim()
const value = simplify(rhs,lhs);
console.log("2nd point : ", "x =", value);
console.log("3rd point : ", "x =", eval(value));