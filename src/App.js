import React from 'react';
import './App.css';
import Scrollbar from './scrollbar';
import { Scrollbars as FakeScrollbar } from 'react-custom-scrollbars';

function contentRenderer(numberOfBlock) {
	return Array(numberOfBlock)
		.fill(null)
		.map(() => {
			return (
				<p>
					Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
					invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
					accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
					sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing
					elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
					diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
					gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
				</p>
			);
		});
}

function App() {
	return (
		<div className="App">
			<div style={{ width: '1600px', height: '500px' }}>
				<Scrollbar>{contentRenderer(50)}</Scrollbar>
			</div>
			<div style={{ marginTop: 50, width: '1600px', height: '500px' }}>
				<FakeScrollbar>{contentRenderer(50)}</FakeScrollbar>
			</div>
		</div>
	);
}

export default App;
