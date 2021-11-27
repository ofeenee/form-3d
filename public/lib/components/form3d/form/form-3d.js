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


// const { isEmail, isStrongPassword, isMobilePhone } = validator;

window.addEventListener('DOMContentLoaded', formLoad);


function formLoad(event) {
  try {
    console.info('form is [supposedly] ready.');
  }
  catch (error) {
    console.warn(error.message);
  }
};

// ////////////////////////////////////////////////
function getFormData(form) {
  try {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }
  catch (error) {
    return setStatus({ className: 'invalid', message: error.message });
  }
}


function setStatus({ className, message }) {
  try {
    statusInfo.setAttribute('status', className);
    statusInfo.setAttribute('text', message);
  }
  catch (error) {
    console.log('error:', error.message);
  }
}






const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet">
<form id="wrapper">
  <status-info
    status='notice'
    text='clear all text to go back'
    styles='./lib/components/form3d/status/status-info.css'
    idle='false'>
  </status-info>

  <fieldset-inputs
    input='email-address'
    step='set'
    styles='./lib/components/form3d/fieldset/fieldset-inputs.css'
    idle='false'
  >
  </fieldset-inputs>

  <nav-buttons
    button='none'
    status='none'
    styles="./lib/components/form3d/nav/nav-buttons.css"
    idle='false'
  >
  </nav-buttons>
  <div id="container">
    <div id="background">
      <img src="./lib/components/form3d/form/form-3d.png" alt="background image of locks on a fence">
    </div>
  </div>
  <footer>
    <small>The Green hills of life. Colliverde. 2021.</small>
  </footer>
</form>


`;


class Form3d extends HTMLElement {
  static get observedAttributes() {
    return ['endpoint', 'styles', 'background', 'footer'];
  }

  constructor() {
    try {
      super();

      const styles = this.getAttribute('styles');
      const stylesheet = template.content.querySelector('link');
      stylesheet.setAttribute('href', styles);

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const statusInfo = this.shadowRoot.querySelector('status-info');
      const navButtons = this.shadowRoot.querySelector('nav-buttons');
      const fieldsetInputs = this.shadowRoot.querySelector('fieldset-inputs');

    }
    catch (error) {

    }

  }

  connectedCallback() {
    console.info('••• element is connected:', this.tagName);
  }

  disconnectedCallback() {
  }

  adobtedCallback() {

  }

  attributeChangedCallback(name, oldValue, newValue) {
    try {
      if (name === 'styles') return this.shadowRoot.querySelector('link').setAttribute('href', newValue);
      if (name === 'background' && newValue !== 'default') return this.shadowRoot.querySelector('#background img').setAttribute('src', newValue);
      if (name === 'background' && newValue === 'none') return this.shadowRoot.querySelector('#background img').setAttribute('src', `none`);
      if (name === 'background' && newValue === 'default') return this.shadowRoot.querySelector('#background img').removeAttribute('src');
      if (name === 'footer') return this.shadowRoot.querySelector('footer small').innerHTML = newValue;
    }
    catch (error) {
      throw error;
    }
  }
}


window.customElements.define('form-3d', Form3d);







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
