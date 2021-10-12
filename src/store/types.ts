import { Props as SnackbarProps } from '@/components/common/npu-ui-react/core/Snackbar';
import { Props as ConfirmDialogProps } from '@/components/common/npu-ui-react/core/ConfirmDialog';
import { Props as ErrorProps } from '@/components/common/npu-ui-react/core/Error';
import { ValueType, Birth, Residence, Commision } from '@/components/common/npu-ui-react/core/utils/types';

import { ApiParams, Account, FaqResponse, ApraRequest, ApraResponse } from '@/utils/api/types';

import * as constants from './constants';

export interface Snackbar extends Omit<SnackbarProps, 'onClose'> {}
export interface ConfirmDialog extends Omit<ConfirmDialogProps, 'onClose'> {}
export interface ErrorPage extends Omit<ErrorProps, 'resetError'> {}

export interface BirthPositionDialog {
  open?: boolean;
  title?: string;
  value?: Birth;
  onApply?: (newPosition: Birth) => void;
}

export interface ResidencePositionDialog {
  open?: boolean;
  title?: string;
  value?: Residence;
  onApply?: (newPosition: Residence) => void;
}

export interface CommisionPositionDialog {
  open?: boolean;
  title?: string;
  value?: Commision;
  onApply?: (newPosition: Commision) => void;
}

export interface Faq {
  response?: Array<FaqResponse>;
  query?: string;
}

export interface Search {
  form?: ApraRequest;
  params?: ApiParams;
  query?: ApraRequest;
  totalCount?: number;
  response?: Array<ApraResponse> | null;
}

export interface Actions {
  onRefresh: () => Promise<void>;
  isEdit?: boolean;
  isDelete?: boolean;
}

export interface ViewIdDialog {
  open: boolean;
  value?: Record<string, ValueType>;
  actions?: Actions;
}

export interface PrintIdDialog {
  open: boolean;
  id: string;
}

export interface App {
  preloader: boolean;
  loader: boolean;
  snackbar?: Snackbar;
  confirmDialog?: ConfirmDialog;
  error?: ErrorPage | null;
  mainMenu: boolean;
  birthPosition?: BirthPositionDialog;
  residencePosition?: ResidencePositionDialog;
  commissionPosition?: CommisionPositionDialog;
  account?: Account;
  faq?: Faq;
  search?: Search;
  viewId?: ViewIdDialog;
  printId?: PrintIdDialog;
}

// Actions
interface PreloaderAction {
  type: typeof constants.PRELOADER_SET;
  payload: boolean;
}

interface LoaderAction {
  type: typeof constants.LOADER_SET;
  payload: boolean;
}

interface SnackbarAction {
  type: typeof constants.SNACKBAR_SET;
  payload: Snackbar;
}

interface ConfirmDialogAction {
  type: typeof constants.CONFIRMDIALOG_SET;
  payload: ConfirmDialog;
}

interface ErrorAction {
  type: typeof constants.ERROR_SET;
  payload: ErrorPage;
}

interface ResetErrorAction {
  type: typeof constants.ERROR_RESET;
  payload: null;
}

interface MainMenuAction {
  type: typeof constants.MAINMENU_SET;
  payload: boolean;
}

interface BirthPositionAction {
  type: typeof constants.BIRTHPOSITION_SET;
  payload: BirthPositionDialog;
}

interface ResidencePositionAction {
  type: typeof constants.RESIDENCEPOSITION_SET;
  payload: ResidencePositionDialog;
}

interface CommisionPositionAction {
  type: typeof constants.COMMISSIONPOSITION_SET;
  payload: CommisionPositionDialog;
}

interface AccountAction {
  type: typeof constants.ACCOUNT_RECEIVED;
  payload: Account;
}

interface FaqAction {
  type: typeof constants.FAQ_SET;
  payload: Faq;
}

interface ViewIdAction {
  type: typeof constants.VIEWID_SET;
  payload: ViewIdDialog;
}

interface PrintIdAction {
  type: typeof constants.PRINTID_SET;
  payload: PrintIdDialog;
}
interface SearchAction {
  type: typeof constants.SEARCH_SET;
  payload: Search;
}

interface SearchResetAction {
  type: typeof constants.SEARCH_RESET;
  payload: Search;
}

export type RootActions =
  | PreloaderAction
  | LoaderAction
  | SnackbarAction
  | ConfirmDialogAction
  | ErrorAction
  | ResetErrorAction
  | MainMenuAction
  | BirthPositionAction
  | ResidencePositionAction
  | CommisionPositionAction
  | AccountAction
  | FaqAction
  | ViewIdAction
  | PrintIdAction
  | SearchAction
  | SearchResetAction;
