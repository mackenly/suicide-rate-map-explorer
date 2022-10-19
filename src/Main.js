import './Main.css';
import Plot from 'react-plotly.js';
import cdcData from './data.json';
import geoData from './geojson-counties-fips.json';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

function Main() {
	const { id } = useParams();
	const queryParameters = new URLSearchParams(window.location.search);
	const n = queryParameters.get('n') || 42;
	const w = queryParameters.get('w') || -100;
	const zoom = queryParameters.get('zoom') || 3;
	const [showSources, setShowSources] = useState(false);
    const [showBanner, setShowBanner] = useState(true);
	const [selectedFips, setSelectedFips] = useState([]);
	const [mapBoxData, setMapBoxData] = useState(() => {
		if (n & w & zoom) {
			return { center: { lon: w, lat: n }, zoom: zoom, style: 'open-street-map' };
		}
		return { center: { lon: -100, lat: 42 }, zoom: 3, style: 'open-street-map' };
	});
	const [data, setData] = useState(() => {
		if (id) {
			if (selectedFips.length === 0) {
				const filteredData = Object.keys(cdcData.counties).reduce((obj, key) => {
					if (key.startsWith(id)) {
						obj[key] = cdcData.counties[key];
					}
					return obj;
				}, {});

				const filter = filteredData;
				return { counties: filter };
			} else {
				return cdcData;
			}
		} else {
			return cdcData;
		}
	});

	function roundTo4(num) {
		return Math.round(num * 10000) / 10000;
	}
	const clickCounty = (event) => {
		console.log(event);
		var w = event.points[0].ct[0],
			n = event.points[0].ct[1],
			zoom = 5;
		const url = `/state/${event.points[0].location.substring(0, 2)}?n=${n}&w=${w}&zoom=${zoom}`;
		window.open(url, '_self');
	};

	function maxRate(data) {
        let max = 0;
		Object.values(data.counties).map((value) => {
            if (max < (value.suicideData.deaths / value.suicideData.population) * 100000) {
                max = (value.suicideData.deaths / value.suicideData.population) * 100000;
            }
		});
        return max;
	}

	return (
		<div className="App">
			{showBanner && (
				<div id="banner">
					<p>
						Are you thinking about killing yourself? Talk to someone in the U.S. by calling or texting{' '}
						<i>
							<a href="tel:988" target="_blank" rel="noreferrer">
								988
							</a>
						</i>{' '}
						or{' '}
						<a href="http://www.suicide.org/hotlines/international-suicide-hotlines.html" target="_blank" rel="noreferrer">
							talk to someone in your country
						</a>
						.
					</p>
					<button
						onClick={() => {
							setShowBanner(!showBanner);
						}}
					>
						X
					</button>
				</div>
			)}
			<header className="App-header">
				<h1>2020 Suicide Rate Map Explorer</h1>
				<p>
					This map illustrates the number of people who died by suicide across the counties of the United States with county
					religious attendance data. <br />
					<b>Click a county to isolate that state's data.</b>{' '}
					<a href="/" value="0">
						View All States
					</a>
				</p>
			</header>
			<div id="map">
				{
					<Plot
						data={[
							{
								type: 'choroplethmapbox',
								locations: Object.keys(data.counties),
								z: Object.values(data.counties).map((value) => {
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
								hovertemplate: Object.values(data.counties).map((value) => {
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
								showscale: false,
							},
						]}
						layout={{
							mapbox: mapBoxData,
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
						onClick={clickCounty}
					/>
				}
			</div>
			<div id="legend">
				<p>(2020 Suicide Deaths / Population) * 100000</p>
				<span>{Math.round(maxRate(data))}</span>
				<span>{Math.round((maxRate(data) / 2 / 2) * 3)}</span>
				<span>{Math.round(maxRate(data) / 2)}</span>
				<span>{Math.round(maxRate(data) / 2 / 2)}</span>
				<span>0</span>
				<hr />
			</div>
			{!showSources && (
				<button
					id="sourceButton"
					onClick={() => {
						setShowSources(!showSources);
					}}
				>
					Data Sources
				</button>
			)}
			{showSources && (
				<div id="sources">
					<button
						onClick={() => {
							setShowSources(!showSources);
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
                    <h3>Notice</h3>
					<p>
						The data used in this project is from the CDC and the ARDA. The CDC doesn't publish death counts for causes of death
						with fewer than 10 occurrences. That means that the death rate could be higher than shown in counties with low
						populations. The hover cards display a less than x for the death rate which means the actual rate could be that or
						lower. The data is not perfect and may not be accurate. This data and website should be used for educational
						purposes only and is subject to the{' '}
						<a href="https://github.com/mackenly/suicide-rate-map-explorer/blob/main/LICENSE" target="_blank" rel="noreferrer">project's license</a>.
					</p>
				</div>
			)}
		</div>
	);
}

export default Main;
