import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';

import type {
  AppProps,
  // NextWebVitalsMetric
} from 'next/app';
import Head from 'next/head';

import { Provider } from 'react-redux';

import useStore from '@/store/store';

// export function reportWebVitals(metric: NextWebVitalsMetric) {
//   console.log(metric);
// }

const WrappedApp = ({ Component, pageProps }: AppProps) => {
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <title>Notes App</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no" />

        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Material+Icons&display=swap"
        />
      </Head>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </>
  );
};

export default WrappedApp;
