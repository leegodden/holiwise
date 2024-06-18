// src/app/_document.tsx
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head />
				<body>
					<div id='__next'>
						<Main />
					</div>
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
