import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import useOnclickOutside from 'react-cool-onclickoutside';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AiFillCloseCircle } from "react-icons/ai";
import Config from '../Config/config';

export default function SearchPlace(props) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: 'in',
      },
    },
    debounce: 300,
  });
  let dispatch = useDispatch();
  const ref = useOnclickOutside(() => {
    clearSuggestions();
  });
  const [showClearButton, setShowClearButton] = useState(false); 
  const [mapZoom, setMapZoom] = useState(10);
  const handleInput = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setShowClearButton(!!inputValue);
  };
  const handleClear = () => {
    setValue(''); 
    clearSuggestions();
    setShowClearButton(false); 
    dispatch({ type: "SHOWDRAWER",payload: false });
    dispatch({ type: 'REMOVE_MARKER', payload: [0,0]  })
    
    if (window.innerWidth <= 480) {
      props.updateMapZoom(6.5);
    } else {
      props.updateMapZoom(7.5);
    }
  };
  const handleSelect = ({ description }) => () => {
    setValue(description, false);
    clearSuggestions();
    getGeocode({ address: description })
      .then((results) => {
        if (results && results.length > 0) {
          const { lat, lng } = getLatLng(results[0]);
          props.searchArea(lat, lng);
          dispatch({
            type: 'SETREVERSEDGEOCODE',
            payload: description,
          });
          dispatch({ type: "SETMARKERLATLON", payload:  [lat, lng]  });
        } else {
          console.error('No geocode results found.');
        }
      })
      .catch((error) => {
        console.error('Error during geocoding:', error);
      });
  }; 

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;
      return (
        <li key={id} onClick={handleSelect(suggestion)} className="suggestion">
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });

  return (
  <div ref={ref}>
  <input
    value={value}
    onChange={handleInput}
    disabled={!ready}
    placeholder="Search Location"
    className="custom-searchinput"
  /> 
  {Config.stateImage.length > 0 ? (
  showClearButton && (
    <AiFillCloseCircle
      style={{
        fontSize: "18px",
        color: "#fff",
        background: "transparent",
      }}
      onClick={handleClear}
      id="clear-button-1"
    />
  )
  ) : (
    showClearButton && (
      <AiFillCloseCircle
        style={{
          fontSize: "18px",
          color: "#fff",
          background: "transparent",
        }}
        onClick={handleClear}
        id="clear-button-2"
      />
    )
  )}
  {status === 'OK' && (
    <ul className="custom-searchinput-list">{renderSuggestions()}</ul>
  )}
</div>
  );
}
