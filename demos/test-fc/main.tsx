import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

function App() {
	const [count, setCount] = useState(1210);
	const arr =
		count % 2 === 0
			? [<li key="1">1</li>, <li key="2">2</li>, <li key="3">3</li>]
			: [<li key="3">3</li>, <li key="2">2</li>, <li key="1">1</li>];
	return (
		<ul onClick={() => setCount(count + 1)}>
			<h1>123</h1>
			<h2>123</h2>
		</ul>
	);
}
