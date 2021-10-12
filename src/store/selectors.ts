/* eslint-disable @typescript-eslint/naming-convention */
import { createSelector } from 'reselect';
import { formValueSelector } from 'redux-form';

import { ValueType } from '@/components/common/npu-ui-react/core/utils/types';

import { RootState } from '@/store/store';

export const preloaderSelector = ({ app }: RootState) => app.preloader;

export const loaderSelector = ({ app }: RootState) => app.loader;

export const snackbarSelector = ({ app }: RootState) => app.snackbar;

export const confirmDialogSelector = ({ app }: RootState) => app.confirmDialog;

export const errorSelector = ({ app }: RootState) => app.error;

export const mainMenuSelector = ({ app }: RootState) => app.mainMenu;

export const accountSelector = ({ app }: RootState) => app.account;

export const usernameSelector = ({ app }: RootState) => app.account?.sub;

export const policemanSelector = createSelector(
  ({ app }: RootState) => app?.account,

  (account) => {
    if (!account) return null;

    const {
      badge,
      unit,
      service,
      position,
      rank,
      regiment,
      battalion,
      squadron,
      platoon,
      lastname,
      firstname,
      middlename,
      landline_phone,
    } = account ?? {};

    return {
      filledToken: badge,
      filledUnit: unit,
      filledDepartment: service,
      filledOffice: position,
      filledFullname: `${lastname} ${firstname}${middlename ? ` ${middlename}` : ''}`,
      filledRank: rank,
      filledRegiment: regiment,
      filledBattalion: battalion,
      filledSquadron: squadron,
      filledPlatoon: platoon,
      filledPhone: landline_phone,
    };
  },
);

export const responseFaqSelector = ({ app }: RootState) => app.faq?.response;

export const queryFaqSelector = ({ app }: RootState) => app.faq?.query ?? '';

export const formSearchSelector = ({ app }: RootState) => app.search?.form;

export const paramsSearchSelector = ({ app }: RootState) => app.search?.params;

export const querySearchSelector = ({ app }: RootState) => app.search?.query;

export const responseSearchSelector = ({ app }: RootState) => app.search?.response;

export const viewIdSelector = ({ app }: RootState) => app.viewId;

export const printIdSelector = ({ app }: RootState) => app.printId;

export const reduxFormSelector =
  (form: string, field: string) =>
  (state: RootState): undefined | ValueType =>
    formValueSelector(form)(state, field);
