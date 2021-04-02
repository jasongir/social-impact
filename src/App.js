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
// TEST comment

// a change

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
	const USER_CITY = "OWN_USER_CITY";

	// the object containing all the weather/pollution data once city is chosen
	const [results, setResults] = useState({});
	const [errors, setErrors] = useState("");
	// keep track of current step: country, state, city, or use IP address
	const [currentScreen, setCurrentScreen] = useState("country");

	const handleIPRequest = () => {
		setChosenCity(USER_CITY);
		setCurrentScreen("results");
	};

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

	// reset state and screens from whichever screen we were on
	const handleReset = () => {
		setChosenCountry("");
		setChosenState("");
		setChosenCity("");
		setCurrentScreen("country");
	};

	// fetches the list of countries on load
	useEffect(() => {
		fetch("http://api.airvisual.com/v2/countries?key=" + apiKey)
			.then((res) => res.json())
			.then((json) => setCountryList(json.data))
			.catch(() => {
				handleReset();
				setErrors("Uh oh, errors occurred while getting that country's data.");
			}); // sets our country list to the json data

		fetch("http://api.airvisual.com/v2/nearest_city?key=" + apiKey)
			.then((res) => res.json())
			.then((json) => setResults(json))
			.catch(() => {
				handleReset();
				setErrors("Uh oh, errors occurred while getting your city's data.");
			});
		return () => setErrors("");
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
				.catch(() => {
					handleReset();
					setErrors(
						"Uh oh, errors occurred while getting that country's data."
					);
				}); // sets our state list with fetched data
		}
		return () => setErrors("");
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
				.catch(() => {
					handleReset();
					setErrors("Uh oh, errors occurred while getting that state's data.");
				}); // sets our city list to the fetched data
		}
		return () => setErrors("");
	}, [chosenState, chosenCountry]);

	// fetch the data about the chosen city/state/country
	useEffect(() => {
		if (chosenCity === USER_CITY) {
			fetch("http://api.airvisual.com/v2/nearest_city?key=" + apiKey)
				.then((res) => res.json())
				.then((json) => setResults(json))
				.catch(() => {
					handleReset();
					setErrors("Uh oh, errors occurred while getting your city's data.");
				});
		}
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
				.then((json) => setResults(json))
				.catch(() => {
					handleReset();
					setErrors("Uh oh, errors occurred while getting that city's data.");
				}); // set our results to the fetched data
		}
		return () => setErrors("");
	}, [chosenCity, chosenCountry, chosenState]);

	return (
		<div className="App">
			<h1>Air Quality App</h1>
			<h2>Find out about the air you breathe</h2>
			<div>
				<button onClick={handleReset}>Reset</button>
			</div>

			{currentScreen === "country" ? (
				<button onClick={handleIPRequest}>Just Show My Air Quality!</button>
			) : null}

			{currentScreen === "country" ? ( // if our currentScreen state is "country", display country component
				<ItemList
					itemList={countryList}
					selectItem={selectCountry}
					keyName="country"
				>
					<h2>Find a Country</h2>
					<h3>{errors ? errors : null}</h3>
				</ItemList> // pass in all of our countries and the function for choosing a country
			) : null}

			{currentScreen === "state" ? (
				<ItemList itemList={stateList} selectItem={selectState} keyName="state">
					<h1>Current country: {chosenCountry}</h1>
					<h2>Find a State</h2>
				</ItemList>
			) : null}

			{currentScreen === "city" ? (
				<ItemList itemList={cityList} selectItem={selectCity} keyName="city">
					<h1>Current country: {chosenCountry}</h1>
					<h1>Current state: {chosenState}</h1>
					<h2>Find a City:</h2>
				</ItemList>
			) : null}
			{currentScreen === "results" ? <Results results={results} /> : null}
			{/* if our current Screen is "results", display the results data */}
		</div>
	);
}

// Component for listing all available buttons and allowing users to
// search for a certain item
// props: props.selectItem, props.children, props.keyName, props.itemList
const ItemList = (props) => {
	// this stores value of user typing in input box
	const [inputVal, setInputVal] = useState("");
	// this handles user input: sets state
	const handleInput = (e) => {
		setInputVal(e.target.value);
	};

	return (
		<section>
			{props.children}
			<input onChange={handleInput} type="text" />
			<div
				className="item-btns"
				style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
			>
				{props.itemList
					.filter((item) => {
						// filter countries: they must start how our user input starts
						return String(item[props.keyName])
							.toLowerCase() // change country to lower case, then check if this matches the string
							.startsWith(inputVal.toLowerCase());
					})
					.map((item) => {
						return (
							<div key={String(item[props.keyName])}>
								{/* map each country to a wrapper div and a button: on click, 
                           this uses the select country function with the 
                           selected country as argument (chooses that country) */}
								<button onClick={() => props.selectItem(item[props.keyName])}>
									{item[props.keyName]}
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
