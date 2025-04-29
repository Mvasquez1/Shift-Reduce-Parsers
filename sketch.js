let input;
let Button; 
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
    //hardcoded table (row)
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

  //text, box for work
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
  //seperates based on spaces, then joints them without for the input
  inputStr =  input.value().split(" ").join('') + '$';
  output = [];
  stack = [0];
  // a input index tracker
  let i = 0;

  let keepParsing = true;
  while (keepParsing) {
    //top of stack for reducing
    let state = stack[stack.length - 1];

    //id, (, ), +, *
    let key;
    if (inputStr[i] === 'i' && inputStr[i + 1] === 'd') {
      key = 'id';
    } else {
      key = inputStr[i];
    }
  
    // if the current state and the current key in the state...
    let action;
    if (table[state] && key in table[state]) {
      action = table[state][key];
    } else {
      action = undefined;
    }

    //alligning columns
    let stackColumn = `Stack: ${stack.join(' ')}`.padEnd(40);
    let inputColumn = `Input: ${inputStr.slice(i)}`.padEnd(40);
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
      stack.push(key);
      stack.push(parseInt(action.slice(1)));
      //if id, move 2 indexes, if not then 1
      if (key === 'id') {
          i += 2;
      } else {
          i += 1;
      }
    }

     //Reduce
     else if ( action[0] === 'R') {
      let rule = parseInt(action.slice(1)) - 1;
      let prod = grammar[rule];
      let [leftSide, rightSide] = prod.split(' -> ');

      let rightSidekeys;
      if (rightSide.trim() === 'id') {
        rightSidekeys = ['id'];
      } else {
        rightSidekeys = rightSide.trim().split(' ');
      }
      //pop key and state
      for (let j = 0; j < rightSidekeys.length * 2; j++) {
        stack.pop();
      }

      //Goto table
      let topState = stack[stack.length - 1];
      stack.push(leftSide.trim());
      //check if real and possible goto state...
      let gotoState;
      if (table[topState] && leftSide.trim() in table[topState]) {
        gotoState = table[topState][leftSide.trim()];
      } else {
        gotoState = undefined;
      }

      if (gotoState === undefined) {
        output.push("Incorrect Goto or Empty Goto Table");
      break;
      } // push if there
       stack.push(gotoState);
    }
  }
}