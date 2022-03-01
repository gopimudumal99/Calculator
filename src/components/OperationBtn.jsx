import React from 'react'
import { ACTIONS } from './../App';

function OperationBtn({operation,dispatch}) {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
}

export default OperationBtn