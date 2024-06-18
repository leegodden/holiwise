// src/app/_app.tsx

import { useEffect } from 'react';
import Modal from 'react-modal';
import type { AppProps } from 'next/app'; // Importing AppProps from next/app
import '../styles/globals.css'; // Adjust path as per your project structure

function MyApp({ Component, pageProps }: AppProps) {
	useEffect(() => {
		Modal.setAppElement('#__next'); // Ensure this matches the id in your _document.tsx
	}, []);

	return <Component {...pageProps} />;
}

export default MyApp;
