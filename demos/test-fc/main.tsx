import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

function App() {
	const [count, setCount] = useState(0);
	return (
		<div>
			<h1>45</h1>
		</div>
	);
}
