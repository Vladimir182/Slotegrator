import API from '../service/apiSingleton';
// import { enqueueSnackbar } from './notification';
import _ from 'lodash';

const REQUEST_TERMINALS_ALL_STATUS_START = 'REQUEST_TERMINALS_ALL_STATUS_START';
const REQUEST_TERMINALS_ALL_STATUS_SUCCESS = 'REQUEST_TERMINALS_ALL_STATUS_SUCCESS';
const REQUEST_TERMINALS_ALL_STATUS_ERROR = 'REQUEST_TERMINALS_ALL_STATUS_ERROR';

const REQUEST_TERMINAL_STATUC_ON_SUCCESS = 'REQUEST_TERMINAL_STATUC_ON_SUCCESS';
const REQUEST_TERMINAL_STATUS_OFF_SUCCESS = 'REQUEST_TERMINAL_STATUS_OFF_SUCCESS';

const initialState = {
	terminals: [],
  count: 0,
  loading: false,
  error: false
};

function updateIsOnOfTerminalState(terminals, terminalData) {
  if (terminalData.id) {
    const updatedTerminal = terminals.find(item => item.id === terminalData.id);

    if (updatedTerminal) {
      updatedTerminal.is_on = terminalData.is_on;
    }
  }

  return terminals;
}

const terminals = (state = initialState, { type, payload }) => {
	switch (type) {
    case REQUEST_TERMINALS_ALL_STATUS_START:
      return {
        ...state,
        loading: true,
        error: false
      }
    case REQUEST_TERMINALS_ALL_STATUS_SUCCESS:
      return {
        ...state,
        loading: false,
        terminals: payload.result,
        count: payload.count,
        error: false
      }  
    case REQUEST_TERMINALS_ALL_STATUS_ERROR:
      return {
        ...state,
        loading: false,
        error: true
      }
    case REQUEST_TERMINAL_STATUC_ON_SUCCESS: {
      let terminals = state.terminals.map(item => Object.assign({}, item));
      
      terminals = updateIsOnOfTerminalState(terminals, payload);

      return {
        ...state,
        terminals
      }
    }
    case REQUEST_TERMINAL_STATUS_OFF_SUCCESS: {
      let terminals = state.terminals.map(item => Object.assign({}, item));

      terminals = updateIsOnOfTerminalState(terminals, payload);

      return {
        ...state,
        terminals
      }
    }
    default: 
      return state;
  }
}

export const terminalsStateAll = (params = {}) => async dispatch => {
	dispatch({ type: REQUEST_TERMINALS_ALL_STATUS_START });

	API.terminal
		.terminalsStateAll(params)
		.then(res => {
			dispatch({
				type: REQUEST_TERMINALS_ALL_STATUS_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({ type: REQUEST_TERMINALS_ALL_STATUS_ERROR });
		})
}

export const fetchTerminalON = id => async dispatch => {
	// dispatch({ type: REQUEST_TERMINAL_ON_START });

	API.terminal
		.on(id)
		.then(res => {
      // console.log('res.data.data', res.data.data, Object.keys(res.data.data).length === 0)
      // if (Object.keys(res.data.data).length === 0) {
      //   dispatch(enqueueSnackbar({
      //     message: 'Can\'t update status terminal',
      //     options: {
      //       variant: 'error'
      //     }
      //   }));

      //   return;
      // }

			dispatch({
				type: REQUEST_TERMINAL_STATUC_ON_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({ type: REQUEST_TERMINALS_ALL_STATUS_ERROR });
		});
};

export const fetchTerminalOFF = id => async dispatch => {
	// dispatch({ type: REQUEST_TERMINAL_OFF_START });

	API.terminal
		.off(id)
		.then(res => {
      // console.log('res.data.data', res.data.data, Object.keys(res.data.data).length === 0)
      // if (Object.keys(res.data.data).length === 0) {
      //   dispatch(enqueueSnackbar({
      //     message: 'Can\'t update status terminal',
      //     options: {
      //       variant: 'error'
      //     }
      //   }));
    
      //   return;
      // }

			dispatch({
				type: REQUEST_TERMINAL_STATUS_OFF_SUCCESS,
				payload: res.data.data
			});
		})
		.catch(error => {
			dispatch({ type: REQUEST_TERMINALS_ALL_STATUS_ERROR });
		});
};

export default terminals; 