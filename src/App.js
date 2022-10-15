import './App.css';
import Plot from 'react-plotly.js';
import cdcData from './data.json'
import geoData from './geojson-counties-fips.json'

function App() {
	return (
		<div className="App">
			<div id="myDiv">
				{
					<Plot
						data={[
							{
								type: 'choroplethmapbox',
								locations: Object.keys(cdcData.counties),
								z: Object.values(cdcData.counties).map((value) => {
									return (value.deaths / value.population)*100000;
								}),
								geojson: geoData,
								marker: {
									line: {
										color: 'rgba(0,0,0,0.6)',
										width: 0.05,
									},
								},
								text: Object.values(cdcData.counties).map((value) => {
									return `
                    County: ${value.name}<br>
                    Crude Rate: ${value.crude_rate}<br>
                    Population: ${value.population}<br>
                    Deaths: ${value.deaths}<br>`;
								}),
								colorbar: {
									title: {
										text: 'Crude Rate',
										side: 'right',
									},
								},
							},
						]}
						layout={{
							title: '<b>2020 Suicide Data Map Test</b><br>This map illustrates the number of people who died by suicide across the counties of the United States.<br><a href="https://wonder.cdc.gov/ucd-icd10.html" target="_blank" rel="noreferrer">Data Source: CDC WONDER</a>',
							mapbox: { center: { lon: -98, lat: 38 }, zoom: 2, style: 'open-street-map' },
							width: window.innerWidth * 0.95,
							height: window.innerHeight * 0.95,
						}}
					/>
				}
			</div>
		</div>
	);
}

export default App;
