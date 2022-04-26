import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
  } from "use-places-autocomplete";
  import useOnclickOutside from "react-cool-onclickoutside";
  import React from 'react'

  export default function  SearchPlace(props) {
    const {
      ready,
      value,
      suggestions: { status, data },
      setValue,
      clearSuggestions,
    } = usePlacesAutocomplete({
      requestOptions: {
        componentRestrictions: {         
          country: "in",
          // locality:"Telangana"         
        },
    
      },
      debounce: 300,
    });
    const ref = useOnclickOutside(() => {
      // When user clicks outside of the component, we can dismiss
      // the searched suggestions by calling this method
      clearSuggestions();
    });
  
    const handleInput = (e) => {
      // Update the keyword of the input element
      setValue(e.target.value);
    };
  
    const handleSelect = ({ description }) => () => {   
      setValue(description, false);
      clearSuggestions();
      // var data = {
      //   bounds: {
      //     west: -25.806884999999966,
      //     east: 16.380615000000034,
      //     south: 48.98742739340465,
      //     north: 60.16884190739975
      //   }
      // };
      // var bounds = new google.maps.LatLngBounds(
      //                new google.maps.LatLng(77.2389910664845729, 15.8331755181357039), 
      //                new google.maps.LatLng(81.3253406742049663, 19.9164620207057510));
      getGeocode({ address: description})
        .then((results) => getLatLng(results[0]))
        .then(({ lat, lng }) => {          
          props.searchArea(lat,lng)
        })
        .catch((error) => {          
        });
    };
  
    const renderSuggestions = () =>
      data.map((suggestion) => {
        const {
          id,
          structured_formatting: { main_text, secondary_text },
        } = suggestion;
        return (
          <li key={id} onClick={handleSelect(suggestion)} style={{backgroundColor:"#282a29",color:"#546775"}} className="suggestion">
            <strong>{main_text}</strong> <small>{secondary_text}</small>
          </li>
        );
      });
  
    return (
      <div ref={ref} >
        <input
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your Location "
          style={{backgroundColor:"#212121",color:"#b4b6b5"}}
          className="custom-searchinput"
        />  
        {status === "OK" && <ul>{renderSuggestions()}</ul>}
      </div>
    );
  };
  