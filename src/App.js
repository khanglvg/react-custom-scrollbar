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

const containerStyles = {
	width: '1200px',
	height: '350px',
};

function App() {
	return (
		<div className="App">
			<div style={containerStyles}>
				<Scrollbar>{contentRenderer(50)}</Scrollbar>
			</div>
			<div style={{ marginTop: 50, ...containerStyles }}>
				<FakeScrollbar autoHide={false}>{contentRenderer(50)}</FakeScrollbar>
			</div>
		</div>
	);
}

export default App;
