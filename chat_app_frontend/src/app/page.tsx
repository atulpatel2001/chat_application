'use client';
import Home_ from "./chat/home/page";
import { AppProps } from 'next/app';
// import { Component } from "react";
// import Navbar from "./component/Navbar";

export default function Home({ Component, pageProps }: AppProps) {
  return (
    <>
     <Component {...pageProps} />
    
     <Home_/>
  
   </>
  );
}
