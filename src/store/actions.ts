import { NextRouter } from 'next/router';
import axios from 'axios';
import endOfDay from 'date-fns/endOfDay';

import { missingValues, profilesToSuggestion } from '@/utils';
import { Nullable, DictionaryType, ValueType } from '@/components/common/npu-ui-react/core/utils/types';

import {
  handleApi,
  auth,
  apiGetFaq,
  apiSearchApra,
  apiGetApraById,
  apiDeleteApraById,
  apiGetProfilesByBadge,
  apiGetSimilarPerson,
  apiGetDrivingLicense,
  apiGetDrivingLicenseById,
  apiGetVehicleLicenseById,
  apiGetVehicleBy,
} from '@/utils/api';
import { ApiParams, ApiQuery, Account, SimilarPerson, ApraResponse, DrivingLicense, Vehicle } from '@/utils/api/types';

import { AppThunk } from './store';
import * as constants from './constants';
import {
  Snackbar,
  ConfirmDialog,
  ErrorPage,
  BirthPositionDialog,
  ResidencePositionDialog,
  CommisionPositionDialog,
  Faq,
  Search,
  Actions,
  ViewIdDialog,
  PrintIdDialog,
  RootActions,
} from './types';

export function prepareQuery<T>(query: T) {
  const result: ApiQuery = {};
  Object.entries(query).forEach(([key, value]) => {
    switch (true) {
      case key === 'birthday':
        result[`${key}_gte`] = value as Date;
        result[`${key}_lte`] = endOfDay(value as Date);
        break;

      case Object.prototype.hasOwnProperty.call(value || {}, 'key') &&
        Object.prototype.hasOwnProperty.call(value || {}, 'value'):
        result[key] = (value as DictionaryType)!.key;
        break;

      case typeof value === 'string':
        result[key] = value === '' ? undefined : (value as string)!.toUpperCase();
        break;

      default:
        result[key] = value as number | Date | undefined;
        break;
    }
  });

  return result;
}

export const setPreloader = (value: boolean): RootActions => ({
  type: constants.PRELOADER_SET,
  payload: value,
});

export const setLoader = (value: boolean): RootActions => ({
  type: constants.LOADER_SET,
  payload: value,
});

export const setSnackbar = (value: Snackbar): RootActions => ({
  type: constants.SNACKBAR_SET,
  payload: value,
});

export const setConfirmDialog = (value: ConfirmDialog): RootActions => ({
  type: constants.CONFIRMDIALOG_SET,
  payload: value,
});

export const setError = (value: ErrorPage): RootActions => ({
  type: constants.ERROR_SET,
  payload: value,
});

export const resetError = (): RootActions => ({
  type: constants.ERROR_RESET,
  payload: null,
});

export const setMainMenu = (value: boolean): RootActions => ({
  type: constants.MAINMENU_SET,
  payload: value,
});

export const setBirthPosition = (value: BirthPositionDialog): RootActions => ({
  type: constants.BIRTHPOSITION_SET,
  payload: value,
});

export const setResidencePosition = (value: ResidencePositionDialog): RootActions => ({
  type: constants.RESIDENCEPOSITION_SET,
  payload: value,
});

export const setCommissionPosition = (value: CommisionPositionDialog): RootActions => ({
  type: constants.COMMISSIONPOSITION_SET,
  payload: value,
});

export const setAccount = (value: Account): RootActions => ({
  type: constants.ACCOUNT_RECEIVED,
  payload: value,
});

export const setFaq = (value: Faq): RootActions => ({
  type: constants.FAQ_SET,
  payload: value,
});

export const setViewId = (value: ViewIdDialog): RootActions => ({
  type: constants.VIEWID_SET,
  payload: value,
});

export const setPrintId = (value: PrintIdDialog): RootActions => ({
  type: constants.PRINTID_SET,
  payload: value,
});

export const setSearch = (value: Search): RootActions => ({
  type: constants.SEARCH_SET,
  payload: value,
});

export const resetSearch = (): RootActions => ({
  type: constants.SEARCH_RESET,
  payload: {
    params: {
      page: 0,
    },
    query: {},
    totalCount: 0,
    response: [],
  },
});

export const controlAccess =
  (router: NextRouter): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      dispatch(setPreloader(true));
      const { data } = await auth.apiUser();
      dispatch(setAccount(data));
    } catch (errorUser) {
      let statusUser: number | undefined;
      let dataUser: { next: 'refresh' | 'login' } | undefined;
      if (axios.isAxiosError(errorUser)) {
        const { response } = errorUser;
        statusUser = response?.status;
        dataUser = response?.data;
      }

      // const { response } = errorUser;
      // const { status, data } = response || {};

      try {
        switch (statusUser) {
          case 401: {
            switch (dataUser?.next) {
              case 'refresh': {
                try {
                  await auth.apiRefreshToken();
                  await dispatch(controlAccess(router));
                } catch (errorRefreshToken) {
                  let statusRefreshToken: number | undefined;
                  if (axios.isAxiosError(errorRefreshToken)) {
                    const { response } = errorRefreshToken;
                    statusRefreshToken = response?.status;
                  }

                  if (statusRefreshToken === 401) {
                    window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}?redirectTo=${window.location.href}`;
                  } else {
                    throw errorRefreshToken;
                  }
                }
                break;
              }

              default:
                window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}?redirectTo=${window.location.href}`;
                break;
            }
            break;
          }

          case 403: {
            try {
              await auth.apiLogoutUser();
            } catch (errorLogoutUser) {
              console.log(errorLogoutUser);
            }
            throw errorUser;
          }

          default:
            throw errorUser;
        }
      } catch (errorOther) {
        let { message: messageOther } = errorOther as Error;
        let statusOther: number | undefined;
        messageOther = `${messageOther}!`;
        if (axios.isAxiosError(errorOther)) {
          const { response } = errorOther;
          statusOther = response?.status;
          messageOther = response?.data?.data || messageOther;
        }

        dispatch(setError({ status: statusOther, message: messageOther }));
        router.push('/error');
      }
    } finally {
      dispatch(setPreloader(false));
    }
  };

export const logout = (): AppThunk<void> => (dispatch) => {
  const onOk = async () => {
    try {
      dispatch(setLoader(true));
      await auth.apiLogoutUser();

      const onCloseCallback = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_LOGIN_URL}?redirectTo=${window.location.origin}${
          process.env.NEXT_PUBLIC_BASE_PATH || ''
        }`;
      };

      dispatch(
        setSnackbar({
          open: true,
          variant: 'success',
          message: 'Ви успішно здійснили вихід!',
          duration: 3000,
          onCloseCallback,
        }),
      );
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.data || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
    } finally {
      dispatch(setLoader(false));
    }
  };

  dispatch(
    setConfirmDialog({
      open: true,
      value: {
        title: 'Ви дійсно бажаєте здійснити вихід?',
        noLabel: 'СКАСУВАТИ',
        okLabel: 'ПРОДОВЖИТИ',
      },
      onOk,
    }),
  );
};

export const getFaq = (): AppThunk<Promise<void>> => async (dispatch) => {
  try {
    dispatch(setLoader(true));
    const api = () => apiGetFaq();
    const response = await handleApi(api);

    dispatch(setFaq({ response: response.data }));
  } catch (error) {
    let { message } = error as Error;
    message = `${message}!`;
    if (axios.isAxiosError(error)) {
      const { response } = error;
      message = response?.data?.error?.message || message;
    }

    dispatch(
      setSnackbar({
        open: true,
        variant: 'error',
        message,
      }),
    );
  } finally {
    dispatch(setLoader(false));
  }
};

export const getApra =
  (params: ApiParams = {}, query: ApiQuery): AppThunk<Promise<{ xTotalCount: number; data: Array<ApraResponse> }>> =>
  async (dispatch) => {
    if (missingValues(query)) {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'warning',
          message: 'Відсутні параметри пошуку!',
        }),
      );
      throw new Error('Відсутні параметри пошуку!');
    }

    try {
      dispatch(setLoader(true));
      const api = () => apiSearchApra(params, query);
      const response = await handleApi(api);

      const { headers, data } = response;
      const xTotalCount = Number.parseInt(headers['x-total-count'], 10);

      return { xTotalCount, data };
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );

      throw error;
    } finally {
      dispatch(setLoader(false));
    }
  };

export const getApraById =
  (id: string): AppThunk<Promise<ApraResponse>> =>
  async (dispatch) => {
    try {
      dispatch(setLoader(true));
      const api = () => apiGetApraById(id);
      const { data } = await handleApi(api);

      return data;
    } finally {
      dispatch(setLoader(false));
    }
  };

export const viewById =
  (id: string, actions: Actions): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      const value: unknown = await dispatch(getApraById(id));

      dispatch(
        setViewId({
          open: true,
          value: value as Record<string, ValueType>,
          actions,
        }),
      );
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
    }
  };

export const searchApra =
  (params: ApiParams = {}, query: Search['query']): AppThunk<Promise<void>> =>
  async (dispatch) => {
    try {
      const newQuery = prepareQuery(query);
      const { xTotalCount, data } = await dispatch(getApra(params, newQuery));

      if (!(xTotalCount > 0)) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'warning',
            message: 'Дані не знайдено!',
          }),
        );
      }

      dispatch(
        setSearch({
          params,
          query,
          totalCount: xTotalCount,
          response: data,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

export const deleteApraById =
  (id: string): AppThunk<Promise<void>> =>
  (dispatch) =>
    new Promise((resolve, reject) => {
      const handleOkConfirmDialog = async () => {
        try {
          dispatch(setLoader(true));
          const api = () => apiDeleteApraById(id);
          await handleApi(api);
          dispatch(
            setSnackbar({
              open: true,
              variant: 'success',
              message: 'Запис видалено!',
            }),
          );

          resolve();
        } catch (error) {
          let { message } = error as Error;
          message = `${message}!`;
          if (axios.isAxiosError(error)) {
            const { response } = error;
            message = response?.data?.error?.message || message;
          }

          dispatch(
            setSnackbar({
              open: true,
              variant: 'error',
              message,
            }),
          );

          reject(error);
        } finally {
          dispatch(setLoader(false));
        }
      };

      dispatch(
        setConfirmDialog({
          open: true,
          value: {
            title: 'Ви дійсно бажаєте видалити даний запис?',
            noLabel: 'СКАСУВАТИ',
            okLabel: 'ВИДАЛИТИ',
          },
          onOk: handleOkConfirmDialog,
        }),
      );
    });

export const getProfilesByBadge =
  (value?: string): AppThunk<Promise<ReturnType<typeof profilesToSuggestion>>> =>
  async (dispatch) => {
    if (!value || value.length < 3) return [];

    try {
      const api = () => apiGetProfilesByBadge(value);
      const { data } = await handleApi(api);
      return profilesToSuggestion(data);
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.data || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
      return [];
    }
  };

export const searchSimilarPerson =
  (
    person: Partial<{
      surname: string;
      name: string;
      middlename: string;
      birthday: Date;
    }>,
  ): AppThunk<Promise<Array<SimilarPerson>>> =>
  async (dispatch) => {
    try {
      const { surname, name, birthday } = person;
      if (!surname || !name || !birthday) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'error',
            message: 'Вкажіть прізвище, і`мя та дату народження!',
          }),
        );
        return [];
      }

      dispatch(setLoader(true));
      const api = () => apiGetSimilarPerson(person);
      const { data } = await handleApi(api);

      if (data.length === 0) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'warning',
            message: 'Дані не знайдено!',
          }),
        );
      }

      return data;
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
      return [];
    } finally {
      dispatch(setLoader(false));
    }
  };

export const searchDrivingLicense =
  (ser: Nullable<string>, num: Nullable<string>): AppThunk<Promise<Array<DrivingLicense>>> =>
  async (dispatch) => {
    try {
      if (!ser || !num) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'error',
            message: 'Вкажіть серію та номер посвідчення водія!',
          }),
        );
        return [];
      }

      dispatch(setLoader(true));
      const api = () => apiGetDrivingLicense(ser, num);
      const { data } = await handleApi(api);

      if (data.length === 0) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'warning',
            message: 'Дані не знайдено!',
          }),
        );
      }

      return data;
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
      return [];
    } finally {
      dispatch(setLoader(false));
    }
  };

export const checkQRCodeDrivingLicense =
  (url: string): AppThunk<Promise<Array<DrivingLicense>>> =>
  async (dispatch) => {
    const { host, pathname } = new URL(url);
    if (host !== 'diia.app') {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'До перевірки запропонований недостовірний QR код!',
        }),
      );
      return [];
    }

    const [type, id] = pathname.split('/').splice(2, 2);
    if (type !== 'driver-license') {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'Запропонований документ до перевірки не є посвідченням водія!',
        }),
      );
      return [];
    }

    try {
      dispatch(setLoader(true));
      const api = () => apiGetDrivingLicenseById(id);
      const { data } = await handleApi(api);

      if (data.length === 0) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'warning',
            message: 'Дані не знайдено!',
          }),
        );
      }

      return data;
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
      return [];
    } finally {
      dispatch(setLoader(false));
    }
  };

export const checkQRCodeVehicleLicense =
  (url: string): AppThunk<Promise<Array<Vehicle>>> =>
  async (dispatch) => {
    const { host, pathname } = new URL(url);
    if (host !== 'diia.app') {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'До перевірки запропонований недостовірний QR код!',
        }),
      );
      return [];
    }

    const [type, id] = pathname.split('/').splice(2, 2);
    if (type !== 'vehicle-license') {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'Запропонований документ до перевірки не є свідоцтвом про реєстрацію ТЗ!',
        }),
      );
      return [];
    }

    try {
      dispatch(setLoader(true));
      const api = () => apiGetVehicleLicenseById(id);
      const { data } = await handleApi(api);

      if (data.length === 0) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'warning',
            message: 'Дані не знайдено!',
          }),
        );
      }

      return data;
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
      return [];
    } finally {
      dispatch(setLoader(false));
    }
  };

const searchVehicle =
  (url: string, query: string): AppThunk<Promise<Array<Vehicle>>> =>
  async (dispatch) => {
    try {
      dispatch(setLoader(true));
      const api = () => apiGetVehicleBy(url, query);
      const { data } = await handleApi(api);

      if (data.length === 0) {
        dispatch(
          setSnackbar({
            open: true,
            variant: 'warning',
            message: 'Дані не знайдено!',
          }),
        );
      }

      return data;
    } catch (error) {
      let { message } = error as Error;
      message = `${message}!`;
      if (axios.isAxiosError(error)) {
        const { response } = error;
        message = response?.data?.error?.message || message;
      }

      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message,
        }),
      );
      return [];
    } finally {
      dispatch(setLoader(false));
    }
  };

export const searchVehicleByLicensePlate =
  (licensePlate?: string): AppThunk<Promise<Array<Vehicle>>> =>
  async (dispatch) => {
    if (!licensePlate) {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'Вкажіть державний номерний знак!',
        }),
      );
      return [];
    }

    const response = await dispatch(
      searchVehicle(process.env.NEXT_PUBLIC_HSC_VEHICLE_BY_LICENSE_PLATE_URL!, licensePlate),
    );
    return response;
  };

export const searchVehicleByVin =
  (vin?: string): AppThunk<Promise<Array<Vehicle>>> =>
  async (dispatch) => {
    if (!vin) {
      dispatch(
        setSnackbar({
          open: true,
          variant: 'error',
          message: 'Вкажіть VIN!',
        }),
      );
      return [];
    }

    const response = await dispatch(searchVehicle(process.env.NEXT_PUBLIC_HSC_VEHICLE_BY_VIN_URL!, vin));
    return response;
  };
