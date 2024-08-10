import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';

const CLIENT_ID = '657627652232-n7saeafbbucmtrl3ncg6eih78fv03dqs.apps.googleusercontent.com';

ReactDOM.render(
	<GoogleOAuthProvider clientId={CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>,
	document.getElementById('root')
);

reportWebVitals();
