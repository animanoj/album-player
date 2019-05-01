import {
  NavigationActions,
  NavigationEventSubscription,
  NavigationScreenOptions,
  NavigationState
} from "react-navigation";

let _navigator: NavigationEventSubscription;

const setTopLevelNavigator = (navigatorRef: NavigationEventSubscription) => {
  _navigator = navigatorRef;
};

const navigate = (routeName: string, params: NavigationScreenOptions = {}) => {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params
    })
  );
};

const state = (): NavigationState => {
  return _navigator?.state;
};

export default {
  navigate,
  state,
  setTopLevelNavigator
};
