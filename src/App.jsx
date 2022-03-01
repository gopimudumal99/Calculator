import { useReducer, useState } from 'react'
import './App.css'
import Digitbtn from './components/Digitbtn';
import OperationBtn from './components/OperationBtn';
export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION :"chose-operation",
  CLEAR: 'clear-out',
  DELET_DIGIT: "delet-digit",
  EVALUATE:"evaluate"
}

const reducer = (state , { type, payload}) => { 
  switch (type) { 
    // ADD-Digit
    case ACTIONS.ADD_DIGIT:
      if (state.ovewrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          ovewrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0"){
        return state
      }
      if (state.currentOperand !== undefined) {
        if (payload.digit === "." && state.currentOperand.includes('.')) {
          return state;
        }
      } else { 
        if (payload.digit === ".") {
          return {
            ...state,
            currentOperand: `0${payload.digit}`,
          };
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand ||""}${payload.digit}`,
      }
    // chose-operation
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand === null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) { 
        return {
          ...state,
          operation:payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand:null
      }
      //clear
    case ACTIONS.CLEAR:
      return {}
    //evaluate
    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return state
      }
      return {
        ...state,
        ovewrite:true,
        previousOperand: null,
        operation: null,
        currentOperand:evaluate(state),
      }
    case ACTIONS.DELET_DIGIT:
      if (state.ovewrite) {
        return {
          ...state,
          currentOperand: null,
          ovewrite: false
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }
      return {
        ...state,
        currentOperand:state.currentOperand.slice(0,-1)   //remove last degit
      }
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return "";

  let computaion =""
  switch (operation) { 
    case "+":
      computaion = prev + current
      break;
    case "-":
      computaion = prev - current
      break;
    case "*":
      computaion = prev * current
      break;
    case "/":
      computaion = prev / current
      break
  }
  return computaion.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits:0,
})

function formatOperand(operend) { 
  if (operend == null) return
  const [integer, decimal] = operend.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer( reducer,{});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="preveious-operand">
          {formatOperand(previousOperand)}
          {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELET_DIGIT })}>
        DEL
      </button>
      <OperationBtn operation="/" dispatch={dispatch} />
      <Digitbtn digit="1" dispatch={dispatch} />
      <Digitbtn digit="2" dispatch={dispatch} />
      <Digitbtn digit="3" dispatch={dispatch} />
      <OperationBtn operation="*" dispatch={dispatch} />
      <Digitbtn digit="4" dispatch={dispatch} />
      <Digitbtn digit="5" dispatch={dispatch} />
      <Digitbtn digit="6" dispatch={dispatch} />
      <OperationBtn operation="+" dispatch={dispatch} />
      <Digitbtn digit="7" dispatch={dispatch} />
      <Digitbtn digit="8" dispatch={dispatch} />
      <Digitbtn digit="9" dispatch={dispatch} />
      <OperationBtn operation="-" dispatch={dispatch} />
      <Digitbtn digit="." dispatch={dispatch} />
      <Digitbtn digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App
