export const setCookie = (c_name, value, exdays) => {
  // Create a new Date object representing the current time
  let exdate = new Date();
  // exdate.setDate(exdate.getDate() + exdays); // Calculate the expiration date based on the number of days

  // Calculate the expiration date based on the number of seconds
  exdate.setTime(exdate.getTime() + exdays * 1000);
  // exdate.getTime() returns the current time in milliseconds, so we multiply exdays by 1000 to convert it to milliseconds

  // encodeURI() is used to encode special characters in the cookie value
  // If exdays is null, no expiration date is added to the cookie
  // If exdays has a value, the expiration date is appended to the cookie using toUTCString()
  let c_value =
    encodeURI(value) +
    (exdays == null ? '' : '; expires=' + exdate.toUTCString());

  document.cookie = c_name + '=' + c_value; // Set the cookie with the provided name and value
};

// Function to retrieve the value of a cookie by its name
export const getCookie = (c_name) => {
  // Get the entire cookie string
  let c_value = document.cookie;

  // Find the start position of the cookie value
  let c_start = c_value.indexOf(' ' + c_name + '=');
  if (c_start === -1) {
    // If the cookie name is not preceded by a space, check for the cookie name at the beginning
    c_start = c_value.indexOf(c_name + '=');
  }

  if (c_start === -1) {
    // If the cookie name is not found, set the cookie value to null
    c_value = null;
  } else {
    c_start = c_value.indexOf('=', c_start) + 1; // Find the start position of the cookie value
    let c_end = c_value.indexOf(';', c_start); // Find the end position of the cookie value

    if (c_end === -1) {
      // If a semicolon is not found, consider the end of the cookie string as the end position
      c_end = c_value.length;
    }

    c_value = decodeURI(c_value.substring(c_start, c_end)); // Extract and decode the cookie value
  }

  return c_value; // Return the cookie value
};
