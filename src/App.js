import React, { useEffect, useState } from "react";

function App() {
	const [countryList, setCountryList] = useState([]);
	const [stateList, setStateList] = useState(null);
	const [cityList, setCityList] = useState(null);
	useEffect(() => {
		fetch(
			"http://api.airvisual.com/v2/countries?key=f523e477-7200-471e-bc77-f4e7f17f707a"
		)
			.then((res) => res.json())
			.then((json) => setCountryList(json.data));
	}, []);
	return (
		<div className="App">
			<h1>Air Quality App</h1>
			<h2>Find out about the air you breathe</h2>
			{countryList.map((country) => {
				return <div>{country.country}</div>;
			})}
		</div>
	);
}

const Countries = (props) => {
	return <section>{props.countries.f}</section>;
};

export default App;
