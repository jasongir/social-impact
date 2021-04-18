import React, { useEffect, useState } from "react";
import "./styles.css";
const apiKey = process.env.REACT_APP_apiKey;
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

	const [resultsBackground, setResultsBackground] = useState("");

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
		setResultsBackground("");
	};

	// fetches the list of countries on load
	useEffect(() => {
		fetch("http://api.airvisual.com/v2/countries?key=" + apiKey)
			.then(handleErrors)
			.then((res) => res.json())
			.then((json) => setCountryList(json.data))
			.catch(() => {
				handleReset();
				setErrors("Uh oh, errors occurred while getting that country's data.");
			}); // sets our country list to the json data

		fetch("http://api.airvisual.com/v2/nearest_city?key=" + apiKey)
			.then(handleErrors)
			.then((res) => res.json())
			.then((json) => setResults(json))
			.catch(() => {
				handleReset();
				setErrors("Uh oh, errors occurred while getting your city's data.");
			});
		return () => setErrors("");
	}, []);

	// fetches the list of states once we have a country
	useEffect(() => {
		if (chosenCountry !== "") {
			console.log("chosen country: " + chosenCountry);
			fetch(
				"http://api.airvisual.com/v2/states?country=" +
					chosenCountry +
					"&key=" +
					apiKey
			)
				.then(handleErrors)
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
				.then(handleErrors) // helper function throws error if not good request
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
				.then(handleErrors)
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
		<div
			className={`App ${currentScreen === "results" ? "results-app" : ""}`}
			style={{
				background: resultsBackground
					? `radial-gradient(#fff, ${resultsBackground} 99%)`
					: "",
			}}
		>
			<header>
				<h1>Air Quality App</h1>
				<h2>Find out about the air you breathe</h2>
			</header>
			<div className="top-btn-container">
				<div>
					<button className="btn top-btn" onClick={handleReset}>
						Reset
					</button>
				</div>
				{currentScreen === "country" ? (
					<div>
						<button className="btn top-btn" onClick={handleIPRequest}>
							Just Show My Air Quality!
						</button>
					</div>
				) : null}
			</div>

			{currentScreen === "country" ? ( // if our currentScreen state is "country", display country component
				<div>
					<ItemList
						itemList={countryList}
						selectItem={selectCountry}
						keyName="country"
					>
						<h2>Find a Country</h2>
						<h3>{errors ? errors : null}</h3>
					</ItemList>{" "}
					{/* pass in all of our countries and the function for choosing a country*/}
				</div>
			) : null}

			{currentScreen === "state" ? (
				<ItemList itemList={stateList} selectItem={selectState} keyName="state">
					<button
						className="back-btn"
						onClick={() => setCurrentScreen("country")}
					>
						⬅️
					</button>
					<h3>Current country: {chosenCountry}</h3>
					<h2>Find a State</h2>
				</ItemList>
			) : null}

			{currentScreen === "city" ? (
				<ItemList itemList={cityList} selectItem={selectCity} keyName="city">
					<button
						className="back-btn"
						onClick={() => setCurrentScreen("state")}
					>
						⬅️
					</button>
					<h3>Current country: {chosenCountry}</h3>
					<h3>Current state: {chosenState}</h3>
					<h2>Find a City:</h2>
				</ItemList>
			) : null}
			{currentScreen === "results" ? (
				<Results
					results={results}
					setResultsBackground={setResultsBackground}
				/>
			) : null}
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
		<section className="btn-search-area">
			{props.children}
			<input
				onChange={handleInput}
				type="text"
				placeholder={"Search for a " + props.keyName}
				className="searchBar"
			/>
			<div className="item-btns">
				{props.itemList
					.filter((item) => {
						// filter countries: they must start how our user input starts
						return String(item[props.keyName])
							.toLowerCase() // change country to lower case, then check if this matches the string
							.startsWith(inputVal.toLowerCase());
					})
					.map((item) => {
						return (
							<div key={String(item[props.keyName])} className="btn-container">
								{/* map each country to a wrapper div and a button: on click, 
                           this uses the select country function with the 
                           selected country as argument (chooses that country) */}
								<button
									onClick={() => props.selectItem(item[props.keyName])}
									className="btn"
								>
									{item[props.keyName]}
								</button>
							</div>
						);
					}) || <p>couldn't find a matching {props.keyName}</p>}
			</div>
		</section>
	);
};

const Results = (props) => {
	const [airQuality, setAirQuality] = useState("");
	const airQualityDescriptions = {
		Green: {
			description:
				"Air quality is satisfactory, and air pollution poses little or no risk.",
			color: "rgba(66, 245, 96, 0.5)",
		},
		Yellow: {
			description:
				"Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.",
			color: "rgba(239, 245, 66, 0.5)",
		},
		Orange: {
			description:
				"Members of sensitive groups may experience health effects. The general public is less likely to be affected.",
			color: "rgba(245, 206, 66)",
		},
		Red: {
			description:
				"Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.",
			color: "rgba(245, 87, 66)",
		},
		Purple: {
			description:
				"Health alert: The risk of health effects is increased for everyone.",
			color: "rgba(242, 34, 197)",
		},
		Maroon: {
			description:
				"Health warning of emergency conditions: everyone is more likely to be affected.",
			color: "rgba(163, 42, 5)",
		},
		none: {
			description: "",
			color: "#fff",
		},
		"": {
			description: "",
			color: "#fff",
		},
	};
	// only on reload: set the background
	useEffect(() => {
		props.setResultsBackground(airQualityDescriptions[airQuality].color);
	}, [airQuality, airQualityDescriptions]);

	// sets the air quality
	useEffect(() => {
		setAirQuality(
			determineAirQuality(props.results.data.current.pollution.aqius)
		);
		// console.log(airQuality);
	}, [airQuality, props.results.data]);

	const determineAirQuality = (number) => {
		return number < 51
			? "Green"
			: number < 101
			? "Yellow"
			: number < 151
			? "Orange"
			: number < 201
			? "Red"
			: number < 301
			? "Purple"
			: "Maroon";
	};

	const colorToConcern = (color) => {
		switch (color) {
			case "Green":
				return "Good";
			case "Yellow":
				return "Moderate";
			case "Orange":
				return "Unhealthy for Sensitive Groups";
			case "Red":
				return "Unhealthy";
			case "Purple":
				return "Very Unhealthy";
			case "Maroon":
				return "Hazardous";
			default:
				return "none";
		}
	};

	const weatherUpdateTime = new Date(
		`${props.results.data.current.weather.ts}`
	);
	const pollutionUpdateTime = new Date(
		`${props.results.data.current.pollution.ts}`
	);

	return (
		<section className="results-section">
			{props.results.data.current.weather.ic ? (
				<img
					src={`https://www.airvisual.com/images/${props.results.data.current.weather.ic}.png`}
					alt="current weather"
					className="weather-image"
				/>
			) : null}

			<h1 className="results-h1">
				{props.results.data.city}, {props.results.data.state},{" "}
				{props.results.data.country}
			</h1>
			<div className="air-quality results-container">
				<h2>
					Air Quality: {colorToConcern(airQuality)} (U.S. AQI:{" "}
					{props.results.data.current.pollution.aqius})
				</h2>
				<h3 className="timestamp-info">
					(as of{" "}
					{/* hours: 
                        if greater than 12, subtract 12.
                        if equal to 0, show 12.  */}
					{pollutionUpdateTime.getHours() <= 12
						? pollutionUpdateTime.getHours()
						: pollutionUpdateTime.getHours() === 0
						? "12"
						: pollutionUpdateTime.getHours() - 12}
					{":"}
					{/* minutes: if less than 10, add a zero */}
					{pollutionUpdateTime.getMinutes() < 10
						? "0" + pollutionUpdateTime.getMinutes()
						: pollutionUpdateTime.getMinutes}{" "}
					{/* is it in the morning or afternoon */}
					{pollutionUpdateTime.getHours() <= 12 ? "AM" : "PM"},{" "}
					{pollutionUpdateTime.getMonth() + 1}/{weatherUpdateTime.getDate()}/
					{pollutionUpdateTime.getFullYear()})
				</h3>

				<p className="desc-p">
					{airQualityDescriptions[airQuality].description}
				</p>
			</div>
			<div className="weather-info results-container">
				<h2>Weather Information:</h2>
				<h3 className="timestamp-info">
					(as of{" "}
					{/* hours: 
                     if greater than 12, subtract 12.
                     if equal to 0, show 12.  */}
					{weatherUpdateTime.getHours() <= 12
						? weatherUpdateTime.getHours()
						: weatherUpdateTime.getHours() === 0
						? "12"
						: weatherUpdateTime.getHours() - 12}
					{":"}
					{/* minutes: if less than 10, add a zero */}
					{weatherUpdateTime.getMinutes() < 10
						? "0" + weatherUpdateTime.getMinutes()
						: weatherUpdateTime.getMinutes}{" "}
					{/* is it in the morning or afternoon */}
					{weatherUpdateTime.getHours() <= 12 ? "AM" : "PM"},{" "}
					{weatherUpdateTime.getMonth() + 1}/{weatherUpdateTime.getDate()}/
					{weatherUpdateTime.getFullYear()})
				</h3>
				<p className="desc-p">
					{props.results.data.current.weather.tp}&#176;C /{" "}
					{(props.results.data.current.weather.tp * 9) / 5 + 32}&#176;F
				</p>
			</div>
		</section>
	);
};

// function to be used in fetch().then() to make sure errors are caught
const handleErrors = (response) => {
	if (!response.ok) {
		throw Error(response.statusText);
	}
	return response;
};

export default App;
