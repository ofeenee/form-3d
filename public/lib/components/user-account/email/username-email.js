'use strict';

const user = {
  email: null,
  phone: null,
  password: null,
}

const form = createElement({
  tagName: 'form',
  autocomplete: 'on',
  id: 'user-account',
  class: 'email-address',
  children: [
    {
      tagName: 'fieldset',
      id: 'email-address',
      class: 'active',
      disabled: true,
      children: [
        {
          tagName: 'label',
          for: 'email',
          textContent: 'account e-mail address'
        },
        {
          tagName: 'input',
          name: 'email',
          id: 'email',
          type: 'email',
          required: true,
          autocomplete: 'email',
          inputmode: 'email',
          placeholder: 'your@email.com',
          enterkeyhint: 'submit'
        },
        {
          tagName: 'p',
          class: 'status',
          textContent: 'delete to go back'
        },
        {
          tagName: 'div',
          class: 'back',
          children: [
            {
              tagName: 'button',
              type: 'button',
              textContent: 'back',
              class: 'back'
            },
            {
              tagName: 'button',
              type: 'submit',
              textContent: 'submit',
              class: 'submit',
            },
            {
              tagName: 'button',
              type: 'button',
              textContent: 'next',
              class: 'next'
            }
          ]
        }
      ]
    },
    {
      tagName: 'fieldset',
      id: 'verify-email-address',
      // class: 'active',
      disabled: true,
      children: [
        {
          tagName: 'label',
          for: 'email-otp',
          textContent: 'verify e-mail'
        },
        {
          tagName: 'input',
          name: 'email-otp',
          id: 'email-otp',
          type: 'one-time-code',
          required: true,
          maxlength: 6,
          autocomplete: 'one-time-code',
          inputmode: 'numeric',
          placeholder: '123456',
          enterkeyhint: 'next',
          style: 'letter-spacing: 12pt; font-size: 14pt; padding-right: 12px !important;',
        },
        {
          tagName: 'p',
          class: 'status'
        },
        {
          tagName: 'div',
          class: 'submit-and-next',
          children: [
            {
              tagName: 'button',
              type: 'button',
              textContent: 'back'
            },
            {
              tagName: 'button',
              type: 'button',
              textContent: 'get code'
            },
            {
              tagName: 'button',
              type: 'submit',
              textContent: 'verify'
            },
            {
              tagName: 'button',
              type: 'button',
              textContent: 'next'
            }
          ]
        }
      ]
    },
    {
      tagName: 'fieldset',
      id: 'phone-number',
      disabled: true,
      children: [
        {
          tagName: 'label',
          for: 'phone',
          textContent: 'phone number'
        },
        {
          tagName: 'input',
          name: 'phone',
          id: 'phone',
          type: 'tel',
          required: true,
          autocomplete: 'tel',
          inputmode: 'tel',
          placeholder: '+1234567890',
          enterkeyhint: 'submit'
        },
        {
          tagName: 'p',
          class: 'status'
        },
        {
          tagName: 'div',
          class: 'submit-and-next',
          children: [
            {
              tagName: 'button',
              type: 'button',
              textContent: 'back'
            },
            {
              tagName: 'button',
              type: 'submit',
              textContent: 'set'
            },
            {
              tagName: 'button',
              type: 'button',
              textContent: 'next'
            }
          ]
        }
      ]
    },
    {
      tagName: 'fieldset',
      id: 'verify-phone-number',
      disabled: true,
      children: [
        {
          tagName: 'label',
          for: 'phone-otp',
          textContent: 'verify phone number'
        },
        {
          tagName: 'input',
          name: 'phone-otp',
          id: 'phone-otp',
          type: 'one-time-code',
          required: true,
          maxlength: 6,
          autocomplete: 'one-time-code',
          inputmode: 'numeric',
          placeholder: '123456',
          enterkeyhint: 'submit',
          style: 'letter-spacing: 12pt; font-size: 14pt; padding-right: 12px !important;',
        },
        {
          tagName: 'p',
          class: 'status'
        },
        {
          tagName: 'div',
          class: 'submit-and-next',
          children: [
            {
              tagName: 'button',
              type: 'button',
              textContent: 'back'
            },
            {
              tagName: 'button',
              type: 'button',
              textContent: 'get code'
            },
            {
              tagName: 'button',
              type: 'submit',
              textContent: 'verify'
            },
            {
              tagName: 'button',
              type: 'button',
              textContent: 'next'
            }
          ]
        }
      ]
    },
    {
      tagName: 'fieldset',
      id: 'complete-registration',
      disabled: true,
      children: [
        {
          tagName: 'p',
          class: 'status'
        },
        {
          tagName: 'button',
          type: 'submit',
          textContent: 'submit'
        },
        {
          tagName: 'button',
          type: 'button',
          textContent: 'reset'
        }
      ]
    }
  ]
});

const fieldset = getChildElements(form, 'fieldset');

fieldset['email-address'].querySelector('#email').oninput = inputChangeHandler;

// setChildElements(form, 'fieldset', function(element, index){
//   try {
//     element.style = `transform-origin: 50% 50% 0px; transform: rotate3d(0,1,0, ${index * 90}deg);`
//   }
//   catch (error) {
//     throw error;
//   }
// });

function inputChangeHandler(event) {
  try {
    event.preventDefault();
    event.stopPropagation();

    const fieldset = event.currentTarget.parentElement;

    const div = fieldset.querySelector('div');

    const input = event.currentTarget;
    const value = input.value;

    const status = fieldset.querySelector('p.status');
    status.className = 'status';
    status.textContent = 'delete to go back';


    if (value.length === 0) {
      div.className = 'back';
    } else {
      div.className = 'submit';
    }
  }
  catch (error) {

  }
}

async function formListener(event) {
  try {
    event.preventDefault();
    event.stopPropagation();

    const steps = Array.from(form.querySelectorAll('fieldset'));
    var step = steps.find(step => {
      return step.classList.contains('active');
    });
    console.log(steps);
    console.log(step);
    console.log(steps.indexOf(step));

    const response = await submitFormData(step.id, event.currentTarget.getAttribute('endpoint'));
    if (response.status === 200) {
      const status = step.querySelector('p.status');
      const div = step.querySelector('div');
      status.textContent = '';
      status.classList.add('valid');
      div.className = 'next';
      console.log(div);
      status.textContent = 'status: valid';
      status.classList.remove('invalid');
      console.log(response);
    }
    else throw new Error(response.error);

  }
  catch (error) {
    formErrorHandler(error, step);
    // throw error;
  }
}

async function submitFormData(id, endpoint) {
  try {
    switch (id) {
      case 'email-address':
        user.email = fieldset['email-address'].querySelector('#email').value;
        return await postData(`${endpoint}/get/email`, user);
        break;
      case 'verify-email-address':
        const code = fieldset["verify-email-address"].querySelector("#email-otp").value;
        return await postData(`${endpoint}/verify/code/email`, { email: user.email, code });
        break;

      default:
        break;
    }
  }
  catch (error) {
    throw error;
  }
}


function formErrorHandler(error, step) {
  try {
    console.log('errorhandler:', step);
    const status = step.querySelector('p.status');
    status.textContent = 'status: invalid';
    status.classList.remove('valid');
    status.classList.add('invalid');
    // console.warn(error.message);
  }
  catch (error) {
    console.log(error.message);
    throw error;
  }
}

form.onsubmit = formListener;



async function sendEmailCode(event) {
  try {

    const getCode = fieldset['verify-email-address'].querySelector('#send-email-code');

    inactivateElement(getCode);
    getCode.onclick = null;

    const endpoint = form.getAttribute('endpoint');
    const response = await postData(`${endpoint}/send/code/email`, { email: user.email });
    console.log(response);
    const expire = response?.ttl + 1 || 60;

    const timeout = setTimeout(() => {
      activateElement(getCode);
      getCode.onclick = sendEmailCode;

      clearTimeout(timeout);
    }, 1000 * expire);
  }
  catch (error) {
    console.log(error.message);
    throw error;
  }
}


function enableElement(element) {
  try {
    return element.removeAttribute('disabled');
  }
  catch (error) {
    throw error;
  }
}

function activateElement(element) {
  try {
    enableElement(element);
    element.classList.add('active');
  }
  catch (error) {
    throw error;
  }
}

function disableElement(element) {
  try {
    return element.setAttribute('disabled', 'true');
  }
  catch (error) {
    throw error;
  }
}

function inactivateElement(element) {
  try {
    disableElement(element);
    element.classList.remove('active');
  }
  catch (error) {
    throw error;
  }
}


const style = document.createElement('style');
style.textContent = `
:root {

}

:host {


  --default-prm-color: white;
  --default-prm-color-glass: white;
  --default-sub-color: rgba(235, 235, 235, 0.95);
  --default-sub-color-glass: rgba(235, 235, 235, 0.95);
  --default-sub-background-color: rgba(65, 65, 65, 0.65);
  --default-sub-background-color-glass: rgba(65, 65, 65, 0.40);


  --background-color-valid: rgba(020, 175, 020, 0.75);
  --background-color-valid-glass: rgba(020, 175, 020, 0.45);

  --background-color-invalid: rgba(250, 010, 010, 0.75);
  --background-color-invalid-glass: rgba(250, 010, 010, 0.45);

  --default-status-background-color: rgba(255, 255, 255, 0.5);
  --default-status-background-color-glass: rgba(255,255,255, 0.35);
  --default-status-inset-shadow: inset 0px 0px 6px 3px var(--drop-shadow-color);

  --default-status-color-invalid: rgba(255, 48, 48, 0.65);
  --default-status-inset-shadow-invalid: inset 0px 0px 6px 3px var(--default-status-color-invalid);

  --default-status-color-valid: rgba(9, 167, 35, 0.65);
  --default-status-inset-shadow-valid: inset 0px 0px 6px 3px var(--default-status-color-valid);


  --drop-shadow-color: rgba(0, 0, 0, 0.35);
  --inset-shadow: inset 0px 0px 6px 3px var(--drop-shadow-color);

  --default-glow-focus-color: rgba(15, 103, 244, 0.9);
  --default-shadow-focus-color: rgba(48, 121, 238, 0.65);
  --glow-focus: 0px 0px 3px 2px var(--default-glow-focus-color);
  --shadow-focus: inset 0px 0px 6px 3px var(--default-shadow-focus-color);


  // --default-input-background-color: rgba(255, 255, 255, 0.5);
  // --default-input-background-color-glass: rgba(25, 25, 25, 0.15);

  --default-button-background-color: rgba(48, 121, 255, 0.8);
  --default-button-background-color-glass: rgba(48, 121, 255, 0.50);
  --default-button-background-color-active: rgba(35, 95, 195, 0.75);

  --default-border-radius: 1.5px;

  background: transparent;

  display: flex;
  flex-direction: column;
  align-items: center;

  position: relative;
  font-family: inherit;

  height: 245px;
  width: 325px;

  border: none;
  outline: none;
}

:host * {
  margin: 0;
  box-sizing: border-box;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.active {
  opacity: 1 !important;
  z-index: 2;
}


form {
  margin: 0;
  padding: 0;
  position: relative;
  width: 100%;
  font-family: inherit;

  transform-style: preserve-3d;
  perspective: 0px;
  transition: opacity 0.5s ease-in-out, transform, 0.5s ease-in-out;
  transform-origin: 50% 50% 0px;
  // transform: rotate3d(0, 1, 0, 0deg) translate3d(0px, 0px, 0px);
}

fieldset {
  position: absolute;
  width: 100%;
  padding: 0;

  display: flex;
  flex-direction: column;
  gap: 5px;

  font-family: inherit;

  perspective: 1000px;

  // transform-style: preserve-3d;

  opacity: 0;
  border: none;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
  z-index: 5;
  // transform: perspective(1000px) translateZ(0px);
}


fieldset:disabled {
  filter: grayscale(1);
  pointer-events: none;
  // transform-style: flat !important;
  opacity: 0;
  z-index: -2;
}


fieldset#email-address {
  // transform-origin: 50% 50% 0px;
  // transform: rotate3d(0, 1, 0, 0deg) translate3d(0px, 0px, 0px);
}

fieldset#verify-email-address {
  // transform-origin: 50% 0% 0px;
  // transform: rotate3d(0, 1, 0, 90deg) translate3d(162.5px, 0px, 162.5px);
}


fieldset div {
  position: relative;
  width: 100%;
  height: 65px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;

  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;

  transform-origin: 50% 50% -32.5px;
  // transform: rotateX(0deg);

}

fieldset div.back {
  transform: perspective(1000px) rotateX(-90deg);
}

fieldset div.submit {
  transform: perspective(1000px) rotateX(0deg);
}

fieldset div.next {
  transform: perspective(1000px) rotateX(90deg);
}

fieldset div button {
  position: absolute;
  width: 100%;
  transform-origin: 50% 100%;
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}

fieldset div button.back {
  transform: rotate3d(1, 0, 0, 90deg) translate3d(0px, 0px, 65px);
}
fieldset div button.submit {
  transform: rotate3d(1, 0, 0, 0deg);
}

fieldset div button.next {
  transform: rotate3d(1, 0, 0, -90deg) translate3d(0px, 65px, 0px);
}

fieldset p.status {

  display: flex;
  justify-self: center;
  align-self: center;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 20px;
  white-space: nowrap;

  border-radius: var(--default-border-radius);

  font-size: 7pt;
  font-weight: 400;
  text-transform: lowercase;
  letter-spacing: 2.2pt;

  font-family: inherit !important;

  color: var(--default-prm-color);
  background-color: var(--default-sub-background-color);

  // box-shadow: var(--inset-shadow);

  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;

  user-select: all !important;
  -webkit-user-select: all !important;
  -moz-user-select: all !important;

  z-index: 2;
}

fieldset p.status::selection {
  background-color: magenta;
}

fieldset p.status.invalid {
  background-color: var(--background-color-invalid);
}

fieldset p.status.valid {
  background-color: var(--background-color-valid);
}




label {

  display: block !important;
  position: absolute;
  top: 55px;

  width: calc(100% - 20px);

  font-family: inherit;
  font-weight: 500;
  font-size: 6pt;

  text-align: center;
  text-transform: uppercase;

  letter-spacing: 2px;




  color: var(--default-sub-color);

  padding-top: 6px !important;
  border-top: 1px dotted var(--default-sub-color);
  justify-self: center;
  align-self: center;
  z-index: 1000000000000;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;

  // transform: rotate3d(0, 0, 0, 0deg) translate3d(0px, 0px, 1px);
}



input {

  // background-color: var(--default-input-background-color);
  background-color: var(--default-sub-background-color);

  // box-shadow: var(--inset-shadow);
  font-family: inherit;

  font-weight: 500;

  white-space: wrap;

  padding: 5px 25px 23px 25px;

  color: var(--default-prm-color-glass);

  height: 100px;
  letter-spacing: 0.5pt;


  width: 100% !important;

  font-size: 12pt;

  text-align: center;
  text-transform: lowercase;
  text-rendering: optimizeLegibility !important;

  border: none;
  outline: none;

  border-radius: var(--default-border-radius);

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;


  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;

  box-sizing: border-box !important;
}

input::placeholder {
  color: var(--default-sub-color);
  font-weight: 300;
  font-size: 12pt;
  letter-spacing: 1pt;
  opacity: 0.7;
}

input:focus {
  box-shadow: var(--glow-focus);
}

button {

  color: white;
  background-color: var(--default-button-background-color);

  font-family: inherit;
  font-weight: normal;
  font-size: 9pt;

  height: 65px;


  text-align: center;
  text-transform: uppercase;

  letter-spacing: 2px;

  cursor: pointer;

  border: none;
  outline: none;

  border-radius: var(--default-border-radius);

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
}

button:active {
  background-color: var(--default-button-background-color-active) !important;
  box-shadow: var(--inset-shadow);
}

button:disabled {
  pointer-events: none;
  filter: grayscale(1);
}


@supports (-webkit-backdrop-filter: blur(7px)) {

  p.status {
    background-color: var(--default-sub-background-color-glass) !important;
    -webkit-backdrop-filter: blur(7px) !important;

  }

  p.status.valid {
    background-color: var(--background-color-valid-glass) !important;
    -webkit-backdrop-filter: blur(7px) !important;
  }

  p.status.invalid {
    background-color: var(--background-color-invalid-glass) !important;
    -webkit-backdrop-filter: blur(7px) !important;
  }
  input {
    background-color: var(--default-sub-background-color-glass) !important;
    -webkit-backdrop-filter: blur(7px) !important;
  }
  button {
    background-color: var(--default-button-background-color-glass) !important;
    -webkit-backdrop-filter: blur(7px);
  }
}

@supports (-webkit-touch-callout: none) {
  @media only screen
    and (min-device-width: 375px)
    and (max-device-width: 812px)
    and (-webkit-min-device-pixel-ratio: 3)
    and (orientation: portrait) {
      :host {
        width: 275px;
      }
  }
}

`;


class usernameEmail extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    const endpoint = this.getAttribute('endpoint');
    form.setAttribute('endpoint', endpoint);

    this.shadowRoot.append(style);
    // this.shadowRoot.append(nav);
    this.shadowRoot.append(form);

    window.addEventListener('backgroundLoaded', function enableFormField1(event) {
      try {
        fieldset['email-address'].removeAttribute('disabled');
      }
      catch (error) {

      }
    })
  }

  connectedCallback() {
    console.log('username form on page. (connected Callback)');
  }
}


window.customElements.define('username-email', usernameEmail);


// ELEMENTS GENERATORS
//


function createElement(object = { tagName: 'div', id: null, class: undefined }) {
  try {
    if (!object?.tagName) throw new Error('tagName property missing. (required)');

    const { tagName } = object;
    delete object.tagName;

    const children = (object?.children && typeof object.children === 'object' && object.children.length) ? object.children : null;
    if (object?.children) delete object.children;

    const textContent = (object?.textContent && typeof object.textContent === 'string' && object.textContent.length) ? object.textContent : null;
    if (object?.textContent) delete object.textContent;

    if (children) children.forEach(function (child, index) {
      try {
        children[index] = createElement(child);
      }
      catch (error) {
        throw error;
      }
    });

    const element = document.createElement(tagName);
    for (let att in object) {
      const value = object[att] ?? null;
      if (value !== null) element.setAttribute(att, value);
    }

    element.textContent = textContent;

    if (children && children.length) {
      children.forEach(function (child) {
        element.append(child);
      });
    }


    // console.info('created:', element);
    return element;
  }
  catch (error) {
    throw error;
  }
}

function getChildElements(parent, selector) {
  try {
    if (!parent || !parent?.tagName || typeof parent.tagName !== 'string' || !selector || typeof selector !== 'string') throw new Error('parent element is missing or invalid. (required)');

    const children = parent.querySelectorAll(selector);
    const sets = {};

    children.forEach(function (child, index) {
      try {
        sets[child.id || index] = child;
      }
      catch (error) {
        throw error;
      }
    });

    return sets;

  }
  catch (error) {

  }
}

function setChildElements(parent, selector, callback) {
  try {
    if (
      (!parent || !parent?.tagName || typeof parent.tagName !== 'string')
      ||
      (!selector || typeof selector !== 'string')
    ) throw new Error('parent element is missing or invalid. (required)');

    const children = parent.querySelectorAll(selector);

    children.forEach(callback);
  }
  catch (error) {
    throw error;
  }
}




// HELPER FUNCTIONS
//

// simplified fetch function
async function postData(url = null, data = null) {
  try {
    if (!url || !data) throw new Error('required field missing.');
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
