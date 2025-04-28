let input, Button; 
let table = {}, grammar = [];
let stack = [], output = [];
let inputStr = ''; 

function setup() {
  //input can be hardcoded
  input = createInput("");
  input.position((displayWidth/2) - 32, 150);

  //grammer table 
  grammar = [
  /*1.*/"E -> E + T",
  /*2.*/"E -> T",
  /*3.*/"T -> T * F", 
  /*4.*/"T -> F",
  /*5.*/"F -> ( E )", 
  /*6.*/"F -> id"
  ];
    //hardcoded table (column)
    //numbers = stages
  table = {
    0: { id: 'S5', '(': 'S4', E: 1, T: 2, F: 3 },
    1: { '+': 'S6', $: 'accept' },
    2: { '+': 'R2', '*': 'S7', ')': 'R2', $: 'R2' },
    3: { '+': 'R4', '*': 'R4', ')': 'R4', $: 'R4' },
    4: { id: 'S5', '(': 'S4', E: 8, T: 2, F: 3 },
    5: { '+': 'R6', '*': 'R6', ')': 'R6', $: 'R6' },
    6: { id: 'S5', '(': 'S4', T: 9, F: 3 },
    7: { id: 'S5', '(': 'S4', F: 10 },
    8: { '+': 'S6', ')': 'S11' },
    9: { '+': 'R1', '*': 'S7', ')': 'R1', $: 'R1' },
    10:{ '+': 'R3', '*': 'R3', ')': 'R3', $: 'R3' },
    11:{ '+': 'R5', '*': 'R5', ')': 'R5', $: 'R5' }
   };
}

// parcing steps text
function draw() {
  //Bg 
  createCanvas(displayWidth - 31, displayHeight); 
  background(100);   
  //textBox
  strokeWeight(2);
  fill(200);
  rect(5, 50, displayWidth -43, 800);

  //text
  textFont('Courier New');
  fill(0);
  textSize(15);
  textStyle(BOLD);

  for (let i = 0; i < output.length; i++) {
    text(output[i], 8, 70 + i * 20);
  }

   // starts the parcing Button
   Button = createButton("Parse");
   Button.position((displayWidth/2) - 32, 125);
   Button.mousePressed(startParsing);
}

//parcing
function startParsing() {
  output = [];
  //user input without spaces
  inputStr =  input.value().split(/\s+/).join('') + '$';

  stack = [0];
  // keep track of index of string
  let i = 0;

  while (true) {
    //top of stack for reducing
    let state = stack[stack.length - 1];
    //id, (, ), +, *
    let symbol = getNextSymbol(i);
    let action = table[state]?.[symbol];

    //alligning columns
    let stackColumn = `Stack: ${stack.join(' ')}`.padEnd(40);
    let inputColumn = `Input: ${inputStr.slice(i)}`.padEnd(30);
    let actionColumn = `Action: ${action}`;
    output.push(`${stackColumn}${inputColumn}${actionColumn}`);

    //error
    if (!action)  {
      output.push("Invalid Input or Empty Table");
    break;
    }

    //accepted
    if (action === 'accept') {
      output.push("Accepted!");
    break;
    }

    //Shift
    if (action[0] === 'S') {
      stack.push(symbol);
      stack.push(parseInt(action.slice(1)));
      //if id, move 2 chars, if not then 1
      if (symbol === 'id') {
          i += 2;
      } else {
          i += 1;
      }
    }

     //Reduce
     else if ( action[0] === 'R') {
      let prodNum = parseInt(action.slice(1)) - 1;
      let prod = grammar[prodNum];
      let [leftSide, rightSide] = prod.split(' -> ');
      let rightSideSymbols = rightSide.trim() === 'id' ? ['id'] : rightSide.trim().split(' ');
      //pop symbol and state
      for (let j = 0; j < rightSideSymbols.length * 2; j++) {
        stack.pop();
      }

      //Goto table
      let topState = stack[stack.length - 1];
      stack.push(leftSide.trim());
      let gotoState = table[topState]?.[leftSide.trim()];
      if (gotoState === undefined) {
        output.push("Incorrect Goto");
      break;
      }
       stack.push(gotoState);
    }
  }
}

function getNextSymbol(index) {
  if (inputStr[index] === 'i' && inputStr[index + 1] === 'd') return 'id';
  return inputStr[index];
}