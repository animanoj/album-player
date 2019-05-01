//@flow
import { type Action } from "../types/Action";

export const updatePlayerFocus = (isPlayerFocused: boolean): Action => ({
  type: "UPDATE_PLAYER_FOCUS",
  isPlayerFocused
});

export const updateQueueFocus = (isQueueFocused: boolean): Action => ({
  type: "UPDATE_QUEUE_FOCUS",
  isQueueFocused
});
