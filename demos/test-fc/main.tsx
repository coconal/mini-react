import React from 'react';
import { useReducer } from 'react';
import ReactDOM from 'react-dom/client';

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);

function App() {
	const reducer = (state, action) => {
		switch (action.type) {
			case 'up':
				return state + 1;
		}
	};

	const [state, dispatch] = useReducer(reducer, 1);
	return (
		<div
			onClick={() => {
				dispatch({ type: 'up' });
			}}
		>
			{state}
		</div>
	);
}
