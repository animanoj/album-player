//@flow
import { type Action } from "../types/Action";

type State = {
  isPlayerFocused: boolean,
  isQueueFocused: boolean
};

const initialState: State = {
  isPlayerFocused: false,
  isQueueFocused: false
};

const navigationReducer = (state: State = initialState, action: Action) => {
  switch (action.type) {
    case "UPDATE_PLAYER_FOCUS": {
      return { ...state, isPlayerFocused: action.isPlayerFocused };
    }
    case "UPDATE_QUEUE_FOCUS": {
      return { ...state, isQueueFocused: action.isQueueFocused };
    }
    default: {
      return state;
    }
  }
};

export default navigationReducer;
