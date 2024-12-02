import React from 'react';
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

function App() {
	const [arr, setArr] = useState(['one', 'two', 'three']);

	function handleClick() {
		setArr(['two', 'three', 'one']);
	}
	return (
		<div>
			<h1 onClick={() => handleClick()}>点</h1>
			<ul>
				{arr.map((item) => {
					return <li key={item}>{item}</li>;
				})}
			</ul>
		</div>
	);
}
