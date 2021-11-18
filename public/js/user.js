'use strict';
// refactor back submit and next listeners switch
// methods one, two, three four to be assigned to an object
// so that element id can be used to call the method
// using the bracket notation on the object

// back button should return to previous next state
// next state should go to next back state
// input change should always disable both back and next
// and set buttons ready for submission (submit button side)

// the placeholder input attribute
// should be set to the submitted value
// as an input history after submission attempt

// info status messages to hold 4 sides:
// first clear all text to go back
// second invalid error messages
// third valid success messages
// fourth code button

// fields will be:
// one to set email
// two to set phone
// three to set authenticator
// four to get the JWT authentication token


const { isEmail } = validator;

const endpoint = 'https://x4.ngrok.io/users';

const userAccounts = document.querySelector('form#user-account');
window.addEventListener('DOMContentLoaded', formLoad);

const statusInfo = document.querySelector('status-info');
const navButtons = document.querySelector('nav-buttons');
const fieldsetInputs = document.querySelector('fieldset-inputs');

function formLoad(event) {
  try {
    console.info('form is [supposedly] ready.');
  }
  catch (error) {
    console.warn(error.message);
  }
};

// ////////////////////////////////////////////////

userAccounts.onsubmit = formSubmit;

const SUBMIT = {
  'set-email': async function setEmail(data) {
    try {
      const response = await postData(`${endpoint}/get/email`, data);
      if (response.status === 200) {
        setStatus({ className: 'valid', message: `returning: ${response.returning} // verified: ${response.verified}` });
        return response;
      }
      else {
        setStatus({ className: 'invalid', message: `${response.status}: ${response.error}` });
        return response;
      }
    }
    catch (error) {
      setStatus({ className: 'invalid', message: error.message });
    }
  }
}

async function formSubmit(event) {
  try {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target;
    const data = getFormData(form);

    console.log(data);

    disableFormSubmit(form);
    const response = await SUBMIT['set-email'](data);
    enableFormSubmit(form);

  }
  catch (error) {
    setStatus({ className: 'invalid', message: error.message });
  }
}

function enableFormSubmit(form) {
  try {
    form.onsubmit = formSubmit;
    navButtons.setAttribute('button', 'submit');
  } catch (error) {
    setStatus({ className: 'invalid', message: error.message });
  }
}

function disableFormSubmit(form) {
  try {
    form.onsubmit = (e) => {return e.preventDefault();};
    navButtons.setAttribute('button', 'submit');
    navButtons.setAttribute('status', 'disabled');
  }
  catch (error) {
    setStatus({ className: 'invalid', message: error.message });
  }
}

function disableForm(form) {
  try {
    form.setAttribute('disabled', 'disabled');
  }
  catch (error) {
    return setStatus({ className: 'invalid', message: error.message });
  }
}

function getFormData(form) {
  try {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }
  catch(error) {
    return setStatus({ className: 'invalid', message: error.message });
  }
}


function setStatus({className, message}) {
  try {
    statusInfo.setAttribute('status', className);
    statusInfo.setAttribute('text', message);
  }
  catch (error) {
    console.log('error:', error.message);
  }
}

// simplified fetch function
async function postData(url = null, data = null) {
  try {
    if (!url) throw new Error('required field missing. (url)');
    if (!data) throw new Error('required field missing. (data)');
    // console.log('url:', url);
    // console.log('data:', data);
    const response = await fetch(url, {
      method: 'POST',
      // mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // console.log(response.status);
    // console.log('response:', response);
    const result = await response.json();
    result.status = response.status;
    return result;
  }
  catch (error) {
    throw error;
    console.log('error', error.message);
    return error;
  }
}
