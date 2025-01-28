'use client';
// import Home_ from "./chat/home/page";
import { AppProps } from 'next/app';
// import { Component } from "react";
// import Navbar from "./component/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
     {/* <Provider store={store}> */}
      <Component {...pageProps} />
    {/* </Provider> */}
   </>
  );
}
