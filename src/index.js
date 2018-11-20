import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import fares from './data/fares.json';

let FAREINFO;

function ZoneSelect(props) {
    return (
        <select className={props.inputClassName} id="zone_select" onChange={props.onChange}>
			{props.optionValues}
		</select>
    );
}

function TimeOfTripSelect(props) {
    return (
		<select className={props.inputClassName} id="when_select" onChange={props.onChange}>
			<option id="weekday" value="weekday">Weekday - Single Trip</option>
			<option id="evening_weekend" value="evening_weekend">Evening/Weekend - Single Trip</option>
			<option id="anytime" disabled={props.disabledProp} value="anytime">Anytime - Pack of 10</option>
		</select>
    );
}

function PurchaseLocation(props) {
    return (
       <input type="radio" onChange={props.onChange} defaultChecked={props.inputChecked} disabled={props.disabledProp} className={props.inputClassName} id={props.inputId} name={props.inputName} value={props.inputValue} />
    );
}

function NumberOfTrips(props) {
    return (
        <input type="text" onChange={props.onChange} className={props.inputClassName} id={props.inputId} defaultValue={props.inputValue} />
    );
}




function CodeInput(props) {
    return (
		<select className={props.selectClassName} value={props.codeValue} onChange={props.onChange}>
            {props.optionValues}
		</select>
    );
}

function consoleLog(value, label) {
	label = label || '';
	value = value || '';
	
	if(label != '') {
		console.log(label);
	}
	
	if(value != '') {
		console.log(value);
	}
}

class Widget extends React.Component {
	constructor(props) {
        super(props);
        this.state = {
            zone: "1",
			time_of_ride: "weekday",
			purchase_location: "advance_purchase",
			number_of_trips: "1",
			time_of_ride_info: "",
			fare_cost: "$0.00"
        };
    }
	
	componentWillMount() {
		//this.getFareData();
		console.log('Mounting...');
		consoleLog(fares, 'fares before prepare');
		this.prepareFares();
		consoleLog(FAREINFO, 'fares after prep');
		
	}
	
	getFareDataURL() {
		//return 'https://raw.githubusercontent.com/thinkcompany/code-challenges/master/septa-fare-calculator/fares.json';
	}
	
	prepareFares() {
		var zone_map = {};
		let fares_copy = fares;
		
		
		fares_copy['zones'].forEach(function(i, v) {
			var fare_info = {};

			
			i['fares'].forEach(function(y, x) {
				
				
				if(typeof fare_info[y['type']] === 'undefined') {
					fare_info[y['type']] = {};
					fare_info[y['type']]['info'] = fares_copy['info'][y['type']];
				}
				
				if(typeof fare_info[y['type']][y['purchase']] === 'undefined') {
					fare_info[y['type']][y['purchase']] = {};
				}
				
				fare_info[y['type']][y['purchase']]['trips'] = y['trips'];
				fare_info[y['type']][y['purchase']]['price'] = y['price'];
				fare_info[y['type']][y['purchase']]['info'] = fares_copy['info'][y['type']];
				
			});
			
			zone_map[i['zone']] = i;
			zone_map[i['zone']]['fares'] = fare_info;			
		});

		FAREINFO = zone_map;
			
		
		this.setState({
			time_of_ride_info: FAREINFO[this.state.zone]['fares'][this.state.time_of_ride]['info'],
			fare_cost: "$" + this.calculateFare()
		});
		//
		//consoleLog(zone_map, 'zone_map');
	}
	
	getFareData() {
		const dataURL = this.getFareDataURL();
		console.log(dataURL);
		fetch(dataURL)
		.then((response) => response.json())
		.then((responseJson) => {			
			let fares = responseJson;
			console.log(fares);
			//const sortedRateKeys = Object.keys(rates).sort();
			//let sortedRates = {};
			//for(let k = 0; k < sortedRateKeys.length; k++) {
			//	sortedRates[sortedRateKeys[k]] = rates[sortedRateKeys[k]];
			//}
			
			//let convertedAmount = this.convert(this.state.baseAmount, sortedRates[targetCode]);
			
			//this.setState({
			//	exchangeRates: sortedRates,
			//	targetAmount: convertedAmount,
			//	baseAmount: this.decimalFormat(amount),
			//	apiCallSuccess: 1
			//});
		})
		.catch((error) => {
			console.log('did not work');
			//this.setState({
			//	apiCallSuccess: 0,
			//	apiCallErrorMessage: (error).toString()
			//});
		});
	}
	
	handleZoneChange(e) {
		console.log('handleZoneChange');
		console.log(e.target.value);
		
		let zone = e.target.value;
		let time_of_ride = this.state.time_of_ride;
		let purchase_location = this.state.purchase_location;
		let number_of_trips = this.state.number_of_trips;
		
		let fare_total = this.calculateFare(
			zone,
			time_of_ride,
			purchase_location,
			number_of_trips
		);
		
		this.setState({
			zone: zone,
			fare_cost: "$" + fare_total.toFixed(2)
		});
	}
	
	handleTimeChange(e) {
		console.log('handleTimeChange');
		console.log(e);
		
		let zone = this.state.zone;
		let time_of_ride = e.target.value;
		let purchase_location = this.state.purchase_location;
		let number_of_trips = this.state.number_of_trips;
		
		let fare_total = this.calculateFare(
			zone,
			time_of_ride,
			purchase_location,
			number_of_trips
		);
		
		this.setState({
			time_of_ride: time_of_ride,
			time_of_ride_info: FAREINFO[this.state.zone]['fares'][time_of_ride]['info'],
			fare_cost: "$" + fare_total.toFixed(2)
		});
	}
	
	handlePurchaseLocationChange(e) {
		console.log('handlePurchaseLocationChange');
		console.log(e);
		
		let zone = this.state.zone;
		let time_of_ride = this.state.time_of_ride;
		let purchase_location = e.target.value;
		let number_of_trips = this.state.number_of_trips;
		
		let fare_total = this.calculateFare(
			zone,
			time_of_ride,
			purchase_location,
			number_of_trips
		);
		
		this.setState({
			purchase_location: purchase_location,
			fare_cost: "$" + fare_total.toFixed(2)
		});
	}
	
	handleNumberOfTripsChange(e) {
		console.log('handleNumberOfTripsChange');
		console.log(e);
		
		let zone = this.state.zone;
		let time_of_ride = this.state.time_of_ride;
		let purchase_location = this.state.purchase_location;
		let number_of_trips = e.target.value;
		
		let fare_total = this.calculateFare(
			zone,
			time_of_ride,
			purchase_location,
			number_of_trips
		);
		
		this.setState({
			number_of_trips: number_of_trips,
			fare_cost: "$" + fare_total.toFixed(2)
		});
	}
	
	renderZoneSelect() {
		const fares = FAREINFO;
		
		let options = [];
		let optionKey = 1;
		
		
		for(let z in FAREINFO) {
			options.push(<option key={optionKey} value={FAREINFO[z]['zone']}>{FAREINFO[z]['name']}</option>);
			optionKey++;
		}

		return (
			<ZoneSelect
				inputClassName="form-control"
				onChange={e => this.handleZoneChange(e)}
				optionValues={options}
			/>
		);
	}
	
	renderTimeOfTripSelect() {
		let anytime_disabled = (this.state.purchase_location == 'onboard_purchase') ? "1" : 0;

		let disabled_prop = (anytime_disabled == 1) ? "disabled" : "";
		let disabled_option_classname = (anytime_disabled == 1) ? "form-control select-option-disabled" : "form-control";
		
		return (
			<TimeOfTripSelect
				inputClassName={disabled_option_classname}
				onChange={e => this.handleTimeChange(e)}
				disabledProp={disabled_prop}
			/>
		);
	}
	
	renderPurchaseLocation() {
		let onboard_disabled = (this.state.time_of_ride == 'anytime') ? "1" : 0;

		let disabled_prop = (onboard_disabled == 1) ? "disabled" : "";
		let disabled_label_classname = (onboard_disabled == 1) ? "location-text radio-disabled" : "location-text";
		return (
			<div id="location_formfields">
				<div>
					<PurchaseLocation
						inputClassName="location-radio"
						inputId="location_kiosk"
						inputValue="advance_purchase"
						inputName="location"
						inputChecked="checked"
						onChange={e => this.handlePurchaseLocationChange(e)}
						disabledProp=""
					/>
					<label htmlFor="location_kiosk" className="location-text"> Station Kiosk</label>
				</div>
				<div>
					<PurchaseLocation
						inputClassName="location-radio"
						inputId="location_onboard"
						inputValue="onboard_purchase"
						inputName="location"
						inputChecked=""
						onChange={e => this.handlePurchaseLocationChange(e)}
						disabledProp={disabled_prop}
					/>
					<label htmlFor="location_onboard" className={disabled_label_classname}> Onboard</label>
				</div>
			</div>
		);
		
		
	}
	
	renderNumberOfTrips() {
		return (
			<NumberOfTrips
				inputClassName="form-control"
				inputId="number_of_rides_text"
				inputValue="1"
				onChange={e => this.handleNumberOfTripsChange(e)}
			/>
		);
	}
	
	renderWidget() {
		return (
			<form className="septa-fare-form">
				<div className="septa-container">
					<div className="septa-container-header">
						<img src="./septa-img.png"></img>
						Regional Rail Fares	
					</div>
					<div className="septa-container-content">
						<div className="form-group container-section" id="zone_request">
							<div className="container-section-header">
								Where are you going?
							</div>
							<div className="container-section-formfield">
								{this.renderZoneSelect()}
							</div>
						</div>
						<div className="form-group container-section" id="when_riding">
							<div className="container-section-header">
								When will you be riding?
							</div>
							<div className="container-section-formfield">
								{this.renderTimeOfTripSelect()}
							</div>
							<div className="container-section-helper" id="time_of_ride_helper_text">
								{this.state.time_of_ride_info}
							</div>
						</div>
						<div className="form-group container-section" id="purchase_location">
							<div className="container-section-header">
								Where will you purchase the fare?
							</div>
							<div className="container-section-formfield">
								{this.renderPurchaseLocation()}
							</div>
						</div>
						<div className="form-group container-section" id="number_of_rides">
							<div className="container-section-header">
								<span className="toggleable-div" id="number_of_rides_helper">
									How many rides will you need?
								</span>
								<span className="toggleable-div hide" id="number_of_packs_helper">
									How many packs will you need?
								</span>
							</div>
							<div className="container-section-formfield" id="number_of_rides_outterdiv">
								<div className="container-section-formfield" id="number_of_rides_innerdiv">
									{this.renderNumberOfTrips()}
									
								</div>
							</div>
						</div>
						<div className="container-section fare-total" id="fare_total">
							<div className="container-section-header">
								Your fare will cost
							</div>
							<div className="container-section-formfield">
								<span className="fare-total-text">{this.state.fare_cost}</span>
							</div>
						</div>
					</div>
				</div>
			</form>
		);
	}

	calculateFare(zone, time_of_ride, purchase_location, number_of_trips) {
		const fares = FAREINFO;
		
		zone = zone || this.state.zone;
		time_of_ride = time_of_ride || this.state.time_of_ride;
		purchase_location = purchase_location || this.state.purchase_location;
		number_of_trips = number_of_trips || this.state.number_of_trips;
		
		let fare_info = fares[zone];
		let zone_fare_time = fare_info['fares'][time_of_ride];
		
		let zone_fare_amount = zone_fare_time[purchase_location];
		let zone_fare_total = zone_fare_amount['price'] * number_of_trips;
		
		return zone_fare_total;
	}

    render() {
		return (
			<div className="container">
				<div className="row">
				{this.renderWidget()}
				</div>
			</div>
		);        
    }
}


ReactDOM.render(<Widget />, document.getElementById("root"));
