import './App.css';
import Plot from 'react-plotly.js';
import cdcData from './data.json'
import geoData from './geojson-counties-fips.json'

function roundTo4(num) {
	  return Math.round(num * 10000) / 10000;
}

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
									if (value.suicideData.deaths === 0) {
										return 0;
									}
									return (value.suicideData.deaths / value.suicideData.population) * 100000;
								}),
								geojson: geoData,
								marker: {
									line: {
										color: 'rgba(0,0,0,0.6)',
										width: 0.05,
									},
								},
								hoverlabel: {
									bgcolor: 'rgb(0,0,0)',
									font: {
										color: 'white',
									},
								},
								hovertemplate: Object.values(cdcData.counties).map((value) => {
									return `<b>
										County: ${value.location.county}<br>
										State: ${value.location.state}<br>
										Suicide Rate: <span style="color:red;">${
											value.suicideData.deaths === 0
												? 'less than ' + roundTo4((10 / value.suicideData.population) * 100)
												: roundTo4((value.suicideData.deaths / value.suicideData.population) * 100)
										}%</span><br>
										Number of Suicide Deaths: <span style="color:red;">${value.suicideData.deaths === 0 ? 'less than 10' : value.suicideData.deaths}</span><br>
										No Religious Attendance: <span style="color:red;">${roundTo4(100 - value.religionData.attendanceRate * 100)}%</span></b><extra></extra>`;
								}),
								colorbar: {
									title: {
										text: '(2020 Suicide Deaths / Population) * 100000',
										side: 'right',
									},
								},
							},
						]}
						layout={{
							title: '<b>2020 Suicide Data Map Test</b><br>This map illustrates the number of people who died by suicide across the counties of the United States.<br><a href="https://wonder.cdc.gov/ucd-icd10.html" target="_blank" rel="noreferrer">Health Data Source: CDC WONDER</a>, <a href="http://usreligioncensus.org/" target="_blank" rel="noreferrer">Religion Data Source: ASARB 2010 U.S. Religion Census: Religious Congregations & Membership Study</a>',
							mapbox: { center: { lon: -73, lat: 44 }, zoom: 5, style: 'open-street-map' },
							// carto-darkmatter, carto-positron, open-street-map, stamen-terrain, stamen-toner, stamen-watercolor, white-bg
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
