import React, { useEffect, useState } from "react";

function App() {
	const [countryList, setCountryList] = useState([]);
	const [chosenCountry, setChosenCountry] = useState("");

	const [stateList, setStateList] = useState(null);
	const [chosenState, setChosenState] = useState("");

	const [cityList, setCityList] = useState(null);
	const [chosenCity, setChosenCity] = useState("");

	const [results, setResults] = useState([]);
	// keep track of current step: country, state, city, or use IP address
	const [currentScreen, setCurrentScreen] = useState("country");

	const selectCountry = (country) => {
		setChosenCountry(() => String(country));
		console.log(chosenCountry);
	};

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
			{currentScreen === "country" ? (
				<Countries countryList={countryList} selectCountry={selectCountry} />
			) : null}
			{currentScreen === "state" ? <State stateList={stateList} /> : null}
			{currentScreen === "city" ? <City cityList={cityList} /> : null}
			{currentScreen === "results" ? <Results results={results} /> : null}

			{/*countryList.map((country) => {
				return <div>{country.country}</div>;
			})*/}
		</div>
	);
}

const Countries = (props) => {
	const [inputVal, setInputVal] = useState("");
	const handleInput = (e) => {
		setInputVal(e.target.value);
	};

	return (
		<section>
			<h2>Find Your Country</h2>
			<input onChange={handleInput} type="text" />
			<div
				className="country-btns"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
			>
				{props.countryList
					.filter((country) => {
						return String(country.country)
							.toLowerCase()
							.startsWith(inputVal.toLowerCase());
					})
					.map((country) => {
						return (
							<div key={String(country.country)}>
								<button onClick={() => props.selectCountry(country.country)}>
									{country.country}
								</button>
							</div>
						);
					})}
			</div>
		</section>
	);
};

const State = (props) => {
	return <section>{props.countries}</section>;
};

const City = (props) => {
	return <section>{props.countries}</section>;
};

const Results = (props) => {
	return <section>{props.countries}</section>;
};

export default App;
