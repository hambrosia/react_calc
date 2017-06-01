import React, { Component } from 'react';
import './App.css';
//import Calc from './Calc'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      //is this necessary? still works when removed
      instructions: '0',
    };
    //no clue why this is necessary, shouldn't the state be accessible to the render function already?
    this.updateDigits = this.updateDigits.bind(this);
  }


  componentDidUpdate (){

    // /([^0-9]0[^.x*+-/])/g     regex for operators followed by leading zero that is not a decimal or operator

    const instructions = this.state.instructions
    const reggie = /([^0-9.]0[^.x*+-/])/g
    const leadingZeros = reggie.exec(instructions)

    if(leadingZeros !== null){
      console.log(leadingZeros.index)
      console.log(leadingZeros)
      this.setState({
        instructions: instructions.substring(0, leadingZeros.index + 1) + instructions.substring(leadingZeros.index + 2 , instructions.length)
      })
    }

    if( (instructions > 1) && (instructions.charAt(0) === '0') ){
        this.setState({
          instructions: instructions.substring(1, instructions.length)
        })
    }

    if( instructions[0] === '0' && instructions[1] === '0'){
      this.setState({
        instructions: '0'
      })
    }
  }


  dotify(){

    const lastChar = this.state.instructions.slice(-1)
    var lastNan = ''

    for(var i=0; i < this.state.instructions.length; i++){
      if( isNaN(this.state.instructions[i]) ) {
        lastNan = this.state.instructions[i]
      }
    }

    if( (lastChar!== '.') && (lastNan !== '.') ){
      this.setState({
        instructions: this.state.instructions + '.'
      })
    }
  }

  updateDigits(digit){
    this.setState({
      instructions: this.state.instructions + digit
    })
  }

  clearDisplay(type){
    var instructions = this.state.instructions

    if(type === 'AC'){
        instructions = '0'
    }

    if(type === 'CE'){
        instructions = instructions.substring(0, instructions.length-1)
    }

    if(instructions === ''){
        instructions = '0'
    }

    this.setState({
      instructions: instructions
    })

  }

  operators(operator){

    var instructions = this.state.instructions
    const lastChar = this.state.instructions.slice(-1)

    if(instructions === '-' && operator === '-'){
      instructions = '0'
    } else if (instructions === '0' && operator === '-' ){
      instructions = '-'
    }

    if( (instructions !== '0') && (operator !== '-') && (lastChar !== '+') && (lastChar !== '-')  && (lastChar !== '*')  && (lastChar !== '/') ){
        instructions = this.state.instructions + operator
    }

    if( (instructions === '0') && (operator !== '-') ){
        instructions = this.state.instructions + operator
    }

    this.setState({
      instructions: instructions
    })

  }

  equalator(){
    var instructions = this.state.instructions

    var i = 0
    for(i = 0; i< instructions.length; i++){
      if(instructions[i] === "%"){
        instructions = instructions.substring(0, i) + "*0.01*" + instructions.substring(i + 1, instructions.length)
        console.log(instructions)
      }
    }

    if( (instructions[instructions.length -1] === '*') || (instructions[instructions.length -1] === '/') || (instructions[instructions.length -1] === '-') || (instructions[instructions.length -1] === '+') || (instructions[instructions.length -1] === '.')){
      instructions = instructions.substring(0, instructions.length - 1)
    }

    if (eval(instructions) === Infinity){
      instructions = 'undefined'
    } else{
        instructions = eval(instructions).toString()
    }
    this.setState({
      instructions: instructions
    })
  }

  makeButton(btnText){
    switch(btnText){
      case 'AC':
      return <button key={btnText} className="ac" onClick={() => this.clearDisplay('AC')} > {btnText} </button>

      case '%':
      return   <button key={btnText} onClick={ () => this.operators('%')}> 	% </button>

      case 'CE':
      return  <button key={btnText} onClick={() => this.clearDisplay('CE')} >{btnText} </button>

      case '7':
      return  <button  key={btnText} onClick={ () => this.updateDigits(7)}> {btnText} </button>

      case '8':
      return  <button key={btnText} onClick={ () => this.updateDigits(8)}> {btnText} </button>

      case '9':
      return  <button key={btnText} onClick={ () => this.updateDigits(9)}> {btnText} </button>

      case '/':
      return  <button key={btnText} onClick={ () => this.operators('/')}> {btnText} </button>

      case '4':
      return <button key={btnText} onClick={ () => this.updateDigits(4)}> {btnText} </button>

      case '5':
      return <button key={btnText} onClick={ () => this.updateDigits(5)}> {btnText} </button>

      case '6':
      return <button key={btnText} onClick={ () => this.updateDigits(6)}> {btnText} </button>

      case 'x':
      return <button key={btnText} onClick={ () => this.operators('*')}> {btnText} </button>

      case '1':
      return <button key={btnText} onClick={ () => this.updateDigits(1)}> {btnText} </button>

      case '2':
      return <button key={btnText} onClick={ () => this.updateDigits(2)}> {btnText} </button>

      case '3':
      return <button key={btnText} onClick={ () => this.updateDigits(3)}> {btnText} </button>

      case '-':
      return <button key={btnText} onClick={ () => this.operators('-')} > {btnText} </button>

      case '0':
      return <button key={btnText} onClick={ () => this.updateDigits(0)}> {btnText} </button>

      case '.':
      return <button key={btnText} onClick={ () => this.dotify()}> {btnText} </button>

      case '=':
      return <button key={btnText} onClick={ () => this.equalator()} > {btnText} </button>

      case '+':
      return <button key={btnText} onClick={ () => this.operators('+')} > {btnText} </button>

      default: return null
    }
  }

  changeHandler = (e) => {
    console.log(e.target.value)
    this.setState({
      // .target.value gives you the user's input from the input field
      // to use add onChange={this.changeHandler} to input
      instructions: e.target.value
    })
  }

  makeRow(elements) {
    let row = [];

    elements.forEach(element => {
      row.push(this.makeButton(element))
    })
    return (
      <div>
      {row}
      </div>
    )
  }

  render() {
    return (
      <div id="calcBody">
      <input id="calcDisplay"  type="text" value={this.state.instructions} readOnly  />
      {this.makeRow(['AC', '&#177;', '%', 'CE'])}
      {this.makeRow(['7', '8', '9', 'x'])}
      {this.makeRow(['4', '5', '6', '/'])}
      {this.makeRow(['1', '2', '3', '-'])}
      {this.makeRow(['0', '.', '=', '+'])}
      </div>
    );
  }
}

export default App;
