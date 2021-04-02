import React, { useEffect, useState } from "react";
import apiKey from "./api-key";

function App() {
	const [countryList, setCountryList] = useState([]);
	const [chosenCountry, setChosenCountry] = useState("");

	const [stateList, setStateList] = useState([]);
	const [chosenState, setChosenState] = useState("");

	const [cityList, setCityList] = useState([]);
	const [chosenCity, setChosenCity] = useState("");

	const [results, setResults] = useState({});
	// keep track of current step: country, state, city, or use IP address
	const [currentScreen, setCurrentScreen] = useState("country");

	const selectCountry = (country) => {
		setChosenCountry(() => String(country));
		setCurrentScreen("state");
	};

	const selectState = (state) => {
		setChosenState(() => String(state));
		setCurrentScreen("city");
	};

	const selectCity = (city) => {
		setChosenCity(() => String(city));
		setCurrentScreen("results");
	};

	useEffect(() => {
		fetch("http://api.airvisual.com/v2/countries?key=" + apiKey)
			.then((res) => res.json())
			.then((json) => setCountryList(json.data));
	}, []);

	useEffect(() => {
		if (chosenCountry !== "") {
			fetch(
				"http://api.airvisual.com/v2/states?country=" +
					chosenCountry +
					"&key=" +
					apiKey
			)
				.then((res) => res.json())
				.then((json) => setStateList(json.data));
		}
	}, [chosenCountry]);

	useEffect(() => {
		if (chosenCountry !== "" && chosenState !== "") {
			fetch(
				"http://api.airvisual.com/v2/cities?state=" +
					chosenState +
					"&country=" +
					chosenCountry +
					"&key=" +
					apiKey
			)
				.then((res) => res.json())
				.then((json) => setCityList(json.data));
		}
	}, [chosenState, chosenCountry]);

	useEffect(() => {
		if (chosenCountry !== "" && chosenState !== "" && chosenCity !== "") {
			fetch(
				"http://api.airvisual.com/v2/city?city=" +
					chosenCity +
					"&state=" +
					chosenState +
					"&country=" +
					chosenCountry +
					"&key=" +
					apiKey
			)
				.then((res) => res.json())
				.then((json) => setResults(json.data));
		}
	}, [chosenCity, chosenCountry, chosenState]);

	return (
		<div className="App">
			<h1>Air Quality App</h1>
			<h2>Find out about the air you breathe</h2>
			{currentScreen === "country" ? (
				<Countries countryList={countryList} selectCountry={selectCountry} />
			) : null}
			{currentScreen === "state" ? (
				<States
					country={chosenCountry}
					stateList={stateList}
					selectState={selectState}
				/>
			) : null}
			{currentScreen === "city" ? (
				<Cities
					selectCity={selectCity}
					cityList={cityList}
					country={chosenCountry}
					state={chosenState}
				/>
			) : null}
			{currentScreen === "results" ? <Results results={results} /> : null}
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

const States = (props) => {
	const [inputVal, setInputVal] = useState("");
	const handleInput = (e) => {
		setInputVal(e.target.value);
	};
	return (
		<section>
			<h1>Your country: {props.country}</h1>
			<h2>Find Your State</h2>
			<input onChange={handleInput} type="text" />
			<div
				className="state-btns"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
			>
				{props.stateList
					.filter((state) => {
						return String(state.state)
							.toLowerCase()
							.startsWith(inputVal.toLowerCase());
					})
					.map((state) => {
						return (
							<div key={String(state.state)}>
								<button onClick={() => props.selectState(state.state)}>
									{state.state}
								</button>
							</div>
						);
					})}
			</div>
		</section>
	);
};

const Cities = (props) => {
	const [inputVal, setInputVal] = useState("");
	const handleInput = (e) => {
		setInputVal(e.target.value);
	};
	return (
		<section>
			<h1>Your country: {props.country}</h1>
			<h1>Your state: {props.state}</h1>
			<h2>Find Your City:</h2>
			<input onChange={handleInput} type="text" />
			<div
				className="city-btns"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
			>
				{props.cityList
					.filter((city) => {
						return String(city.city)
							.toLowerCase()
							.startsWith(inputVal.toLowerCase());
					})
					.map((city) => {
						return (
							<div key={String(city.city)}>
								<button onClick={() => props.selectCity(city.city)}>
									{city.city}
								</button>
							</div>
						);
					})}
			</div>
		</section>
	);
};

const Results = (props) => {
	return <section>{JSON.stringify(props.results)}</section>;
};

export default App;
