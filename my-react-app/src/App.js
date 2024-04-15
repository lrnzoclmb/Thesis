import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Rout from './rout'
import 'typeface-montserrat';
import {Helmet} from "react-helmet";
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  return (
    <>
    <Helmet>
                <meta charSet="utf-8" />
                <title>Falcon Print</title>
                <link rel="canonical" href="http://mysite.com/example" />
    </Helmet>
    <BrowserRouter>
    <Rout />
    </BrowserRouter>
    </>
  )
}

export default App