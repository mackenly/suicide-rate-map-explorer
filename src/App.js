import './App.css';
import Plot from 'react-plotly.js';
import cdcData from './data.json'
import geoData from './geojson-counties-fips.json'
import {useState} from 'react';

function roundTo4(num) {
	  return Math.round(num * 10000) / 10000;
}

function App() {
	const [showSources, setShowSources] = useState(false);

	return (
		<div className="App">
			<header className="App-header">
				<h1>2020 Suicide Data Map Test</h1>
				<p>
					This map illustrates the number of people who died by suicide across the counties of the United States.
				</p>
			</header>
			<div id="map">
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
									orientation: 'v',
									title: {
										text: '(2020 Suicide Deaths / Population) * 100000',
										side: 'right',
									},
								},
							},
						]}
						layout={{
							mapbox: { center: { lon: -73, lat: 44 }, zoom: 5, style: 'open-street-map' },
							width: window.innerWidth,
							height: window.innerHeight,
							margin: {
								l: 0,
								r: 0,
								b: 0,
								t: 0,
								pad: 0,
							},
						}}
					/>
				}
			</div>
			<button
				id="sourceButton"
				onClick={() => {
					setShowSources(true);
				}}
			>
				Data Sources
			</button>
			{showSources && (
				<div id="sources">
					<button
						onClick={() => {
							setShowSources(false);
						}}
					>
						X
					</button>
					<h3>Data Sources</h3>
					<p>
						<b>Health Data</b>
						<br />
						Centers for Disease Control and Prevention, National Center for Health Statistics. National Vital Statistics System,
						Mortality 1999-2020 on CDC WONDER Online Database, released in 2021. Data are from the Multiple Cause of Death
						Files, 1999-2020, as compiled from data provided by the 57 vital statistics jurisdictions through the Vital
						Statistics Cooperative Program. Accessed at{' '}
						<a href="http://wonder.cdc.gov/ucd-icd10.html" target="_blank" rel="noreferrer">
							http://wonder.cdc.gov/ucd-icd10.html
						</a>{' '}
						on Oct 18, 2022 5:01:39 PM
					</p>
					<p>
						<b>Religious Data</b>
						<br />
						Grammich, C., Hadaway, K., Houseal, R., Jones, D. E., Krindatch, A., Stanley, R., & Taylor, R. H. (2018, December
						11). U.S. Religion Census Religious Congregations and Membership Study, 2010 (County File). 10.17605/OSF.IO/QUN29{' '}
						<a href="https://www.thearda.com/data-archive?fid=RCMSCY10" target="_blank" rel="noreferrer">
							https://www.thearda.com/data-archive?fid=RCMSCY10
						</a>
					</p>
				</div>
			)}
		</div>
	);
}

export default App;
