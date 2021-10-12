import { App, RootActions } from './types';
import * as constants from './constants';

export const initialState: App = {
  preloader: true,
  loader: false,
  mainMenu: false,
  birthPosition: {
    open: false,
  },
  residencePosition: {
    open: false,
  },
  commissionPosition: {
    open: false,
  },
  search: {
    params: { page: 0, orderBy: 'eventDatetime' },
    query: {},
    response: [],
  },
};

export default function reducer(state = initialState, action: RootActions) {
  switch (action.type) {
    case constants.PRELOADER_SET:
      return { ...state, preloader: action.payload };

    case constants.LOADER_SET:
      return { ...state, loader: action.payload };

    case constants.SNACKBAR_SET: {
      const { onCloseCallback, ...rest } = state.snackbar || {};
      return {
        ...state,
        snackbar: { ...rest, ...action.payload },
      };
    }

    case constants.CONFIRMDIALOG_SET: {
      const { onNo, onOk, ...rest } = state.confirmDialog || {};
      return { ...state, confirmDialog: { ...rest, ...action.payload } };
    }

    case constants.ERROR_SET:
      return { ...state, error: action.payload };

    case constants.ERROR_RESET:
      return { ...state, error: action.payload };

    case constants.MAINMENU_SET:
      return { ...state, mainMenu: action.payload };

    case constants.BIRTHPOSITION_SET:
      return { ...state, birthPosition: { ...state.birthPosition, ...action.payload } };

    case constants.RESIDENCEPOSITION_SET:
      return { ...state, residencePosition: { ...state.residencePosition, ...action.payload } };

    case constants.COMMISSIONPOSITION_SET:
      return { ...state, commissionPosition: { ...state.commissionPosition, ...action.payload } };

    case constants.ACCOUNT_RECEIVED:
      return { ...state, account: action.payload };

    case constants.FAQ_SET:
      return { ...state, faq: { ...state.faq, ...action.payload } };

    case constants.VIEWID_SET:
      return { ...state, viewId: { ...state.viewId, ...action.payload } };

    case constants.PRINTID_SET:
      return { ...state, printId: { ...state.printId, ...action.payload } };

    case constants.SEARCH_SET:
      return { ...state, search: { ...state.search, ...action.payload } };

    case constants.SEARCH_RESET: {
      const { params, ...rest } = action.payload;

      return {
        ...state,
        search: {
          ...state.search,
          params: { ...(state.search?.params ?? {}), ...params },
          ...rest,
        },
      };
    }

    default:
      return state;
  }
}
