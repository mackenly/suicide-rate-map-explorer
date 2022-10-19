import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Main from './Main.js';

function App() {
	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path="/" element={<Main />} />
					<Route path="/state/:id" element={<Main />} />
				</Routes>
			</Router>
		</div>
	);
}

export default App;
