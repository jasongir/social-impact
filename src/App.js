import React, { useEffect, useState } from "react";
import apiKey from "./api-key";

// docs: https://api-docs.iqair.com/
// dashboard: https://www.iqair.com/dashboard/api

// IDEAS:
// REFACTOR: make all the selection screens into a single component;
// pass the header info as a props.children, pass the setter function, and pass the data

// add button to use IP address for quick info
// add < and restart buttons for navigating backward
// add "bread crumbs" to show what we have done and what we have left

function App() {
	// the list of countries we will fetch
	const [countryList, setCountryList] = useState([]);
	// the country chosen by user
	const [chosenCountry, setChosenCountry] = useState("");

	// the list of states fetched once we know the country
	const [stateList, setStateList] = useState([]);
	// the state chosen by the user
	const [chosenState, setChosenState] = useState("");

	// the list of cities within the state chosen by user
	const [cityList, setCityList] = useState([]);
	// the city chosen by the user
	const [chosenCity, setChosenCity] = useState("");

	// the object containing all the weather/pollution data once city is chosen
	const [results, setResults] = useState({});
	// keep track of current step: country, state, city, or use IP address
	const [currentScreen, setCurrentScreen] = useState("country");

	const handleIPRequest = () => setCurrentScreen("results");

	// function to handle selecting a country from a button
	const selectCountry = (country) => {
		setChosenCountry(() => String(country));
		setCurrentScreen("state");
	};

	// function to handle selecting a state from a button
	const selectState = (state) => {
		setChosenState(() => String(state));
		setCurrentScreen("city");
	};

	// function to handle selecting a city w/ button
	const selectCity = (city) => {
		setChosenCity(() => String(city));
		setCurrentScreen("results");
	};

	// fetches the list of countries on load
	useEffect(() => {
		fetch("http://api.airvisual.com/v2/countries?key=" + apiKey)
			.then((res) => res.json())
			.then((json) => setCountryList(json.data))
			.catch((err) => console.error(err)); // sets our country list to the json data

		fetch("http://api.airvisual.com/v2/nearest_city?key=" + apiKey)
			.then((res) => res.json())
			.then((json) => setResults(json));
	}, []);

	// fetches the lsit of states once we have a country
	useEffect(() => {
		if (chosenCountry !== "") {
			fetch(
				"http://api.airvisual.com/v2/states?country=" +
					chosenCountry +
					"&key=" +
					apiKey
			)
				.then((res) => res.json())
				.then((json) => setStateList(json.data))
				.catch((err) => console.error(err)); // sets our state list with fetched data
		}
	}, [chosenCountry]);

	// fetches the list of cities within the specified state/country
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
				.then((json) => setCityList(json.data))
				.catch((err) => console.error(err)); // sets our city list to the fetched data
		}
	}, [chosenState, chosenCountry]);

	// fetch the data about the chosen city/state/country
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
				.then((json) => setResults(json)); // set our results to the fetched data
		}
	}, [chosenCity, chosenCountry, chosenState]);

	return (
		<div className="App">
			<h1>Air Quality App</h1>
			<h2>Find out about the air you breathe</h2>
			<div>
				<button onClick={() => setCurrentScreen("country")}>Restart</button>
			</div>
			{/* possible addition: button to use ip address 
         
            http://api.airvisual.com/v2/nearest_city?key={{YOUR_API_KEY}}

            quickly find your air quality data
            
            or: let user choose to find out info
         */}
			{currentScreen === "country" ? (
				<button onClick={handleIPRequest}>Just Show My Air Quality!</button>
			) : null}
			{currentScreen === "country" ? ( // if our currentScreen state is "country", display country component
				<Countries countryList={countryList} selectCountry={selectCountry} /> // pass in all of our countries and the function for choosing a country
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
			{/* if our current Screen is "results", display the results data */}
		</div>
	);
}

// Component for displaying all countries
// can be combined with the other list components:
// just pass in list of values, function for editing the values
const Countries = (props) => {
	// this stores value of user typing in input box
	const [inputVal, setInputVal] = useState("");
	// this handles user input: sets state
	const handleInput = (e) => {
		setInputVal(e.target.value);
	};

	return (
		<section>
			<h2>Find a Country</h2>
			<input onChange={handleInput} type="text" />
			<div
				className="country-btns"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
			>
				{props.countryList
					.filter((country) => {
						// filter countries: they must start how our user input starts
						return String(country.country)
							.toLowerCase() // change country to lower case, then check if this matches the string
							.startsWith(inputVal.toLowerCase());
					})
					.map((country) => {
						return (
							<div key={String(country.country)}>
								{/* map each country to a wrapper div and a button: on click, 
                           this uses the select country function with the 
                           selected country as argument (chooses that country) */}
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
			<h1>Current country: {props.country}</h1>
			<h2>Find a State</h2>
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
			<h1>Current country: {props.country}</h1>
			<h1>Current state: {props.state}</h1>
			<h2>Find a City:</h2>
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
