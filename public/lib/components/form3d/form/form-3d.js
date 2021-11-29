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
    console.info('form-3d is [supposedly] ready.');
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
  <footer>
    <small>The Green hills of life. Colliverde. 2021.</small>
    <small id="population">current population: <span id="value"></span></small>
  </footer>
  <input type="submit" hidden style="visibility: hidden;">
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

      const hiddenSubmitButton = this.shadowRoot.querySelector('input[type="submit"]');
      const statusInfo = this.shadowRoot.querySelector('status-info');
      const fieldsetInputs = this.shadowRoot.querySelector('fieldset-inputs');
      const navButtons = this.shadowRoot.querySelector('nav-buttons');

      const form = this.shadowRoot.querySelector('form');
      const statistics = this.shadowRoot.querySelector('#population span');


      this.methods = {
        setStatus: ({ className, message }) => {
          try {
            statusInfo.setAttribute('status', className);
            statusInfo.setAttribute('text', message);
          }
          catch (error) {
            console.log('error:', error.message);
          }
        },
        inputField: (input) => {
          try {
            if (input.value.length) {
              navButtons.setAttribute('button', 'submit');
            }
            else {
              if (fieldsetInputs.getAttribute('input') === 'email-address')
                navButtons.setAttribute('button', 'none');
              else navButtons.setAttribute('button', 'back');
            }
          }
          catch (error) {
            console.log('error:', error.message);
          }
        },
      };



      this.user = {
        ['email-address']: {
          value: '',
          code: '',
          status: '',
        },
        ['phone-number']: {
          value: '',
          code: '',
          status: '',
        },
        ['authenticator']: {
          value: '',
          code: '',
          status: '',
        },
        ['password']: {
          value: '',
          confirm: '',
          status: '',
        }
      };



      const socket = io();

      socket.on('welcome', (message) => {
        this.methods.setStatus({ className: 'notice', message: message });
        fieldsetInputs.setAttribute('input', 'email-address');
        const input = fieldsetInputs.shadowRoot.querySelector(`#${fieldsetInputs.getAttribute('input')} #${fieldsetInputs.getAttribute('step')} input`);
        if (input.value.length) navButtons.setAttribute('button', 'submit');
        else navButtons.setAttribute('button', 'none');
      });

      socket.on('birth', (population) => {
        statistics.textContent = population;
      });
      socket.on('death', (population) => {
        statistics.textContent = population;
      });

      socket.on('error', (message) => {
        this.methods.setStatus({ className: 'invalid', message: message });
      });

      socket.on('success', (message) => {
        this.methods.setStatus({ className: 'valid', message: message });
      });

      socket.on('token', (token) => {
        this.methods.setStatus({ className: 'code', message: token });
      });

      // EMAIL EVENTS
      socket.on('verified-email', (email) => {
        try {
          this.user['email-address'].status = 'verified';
          navButtons.setAttribute('button', 'next');
          this.methods.setStatus({ className: 'valid', message: `email is already verified.` });
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      });

      socket.on('unverified-valid-email', (email) => {
        try {
          this.user['email-address'].status = 'unverified';
          navButtons.setAttribute('button', 'next');
          this.methods.setStatus({ className: 'valid', message: `email is valid. (unverified)` });
          statusInfo.shadowRoot.querySelector('#code').onclick = () => {
            socket.emit('send-email-verification-code', JSON.stringify(this.user['email-address']));
          };
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
          navButtons.setAttribute('button', 'none');
        }
      });

      socket.on('email-verification-code-sent', (data) => {
        try {
          this.methods.setStatus({ className: 'valid', message: 'verification code sent.' });
          const getCodeButton = statusInfo.shadowRoot.querySelector('#code');
          getCodeButton.setAttribute('disabled', 'true');

          const timeout = setTimeout(() => {
            this.methods.setStatus({ className: 'code', message: 'get verification code' });
            getCodeButton.removeAttribute('disabled');
            clearTimeout(timeout);
          }, 1000 * 60);
        }
        catch (error) {
          this.method.setStatus({ className: 'invalid', message: error.message });
        }
      });

      socket.on('email-address-verified', (email) => {
        try {
          if (this.user['email-address'].value === email) {
            this.user['email-address'].status = 'verified';
            this.methods.setStatus({ className: 'valid', message: 'email address verified.' });
            navButtons.setAttribute('button', 'next');
          }
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      });

      // PHONE EVENTS
      socket.on('verified-phone', (phone) => {
        try {
          this.user['phone-number'].status = 'verified';
          navButtons.setAttribute('button', 'next');
          this.methods.setStatus({ className: 'valid', message: `phone is already verified.` });
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      });

      socket.on('unverified-valid-phone', (phone) => {
        try {
          this.user['phone-number'].status = 'unverified';
          navButtons.setAttribute('button', 'next');
          this.methods.setStatus({ className: 'valid', message: 'phone number valid. (unverified)' });
          statusInfo.shadowRoot.querySelector('#code').onclick = () => {
            socket.emit('send-phone-verification-code-sms', JSON.stringify(this.user['phone-number']));
          };
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
          navButtons.setAttribute('button', 'none');
        }
      });

      socket.on('phone-verification-code-sent', (data) => {
        try {
          this.methods.setStatus({ className: 'valid', message: 'verification code sent.' });
          const getCodeButton = statusInfo.shadowRoot.querySelector('#code');
          getCodeButton.setAttribute('disabled', 'true');
          const timeout = setTimeout(() => {
            this.methods.setStatus({ className: 'code', message: 'get verification code' });
            getCodeButton.removeAttribute('disabled');
            clearTimeout(timeout);
          }, 1000 * 60);
        }
        catch (error) {
          this.method.setStatus({ className: 'invalid', message: error.message });
        }
      });

      socket.on('phone-number-verified', (phone) => {
        try {
          if (this.user['phone-number'].value === phone) {
            this.user['phone-number'].status = 'verified';
            this.methods.setStatus({ className: 'valid', message: 'phone address verified.' });
            navButtons.setAttribute('button', 'next');
          }
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      });




      const stepBack = () =>{
        try {
          const requirements = ['email-address', 'phone-number', 'authenticator', 'password'];
          const input = fieldsetInputs.getAttribute('input');
          const step = fieldsetInputs.getAttribute('step');
          let index = requirements.indexOf(input);
          if (index > 0) {
            if (step === 'verify') {
              return fieldsetInputs.setAttribute('step', 'set');
            }
            else {
              fieldsetInputs.setAttribute('input', requirements[--index]);
              if (this.user[requirements[index]].status === 'verified') {
                return fieldsetInputs.setAttribute('step', 'set');
              }
              else {
                return fieldsetInputs.setAttribute('step', 'verify');
              }
            }
          }
          else {
            if (step === 'verify') {
              return fieldsetInputs.setAttribute('step', 'set');
            }
            else return;
          }
        }
        catch (error) {
          console.log(error);
          this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      }

      const stepNext = () => {
        try {
          const requirements = ['email-address', 'phone-number', 'authenticator', 'password'];
          const input = fieldsetInputs.getAttribute('input');
          const step = fieldsetInputs.getAttribute('step');
          let index = requirements.indexOf(input);

          switch (index) {
            case 0: {
              if (this.user['email-address'].status === 'verified') {
                this.methods.setStatus({ className: 'notice', message: 'clear all text to go back.' });
                return fieldsetInputs.setAttribute('input', 'phone-number');
              }
              else {
                if (step === 'set') {
                  this.methods.setStatus({ className: 'code', message: 'get verification code' });
                  return fieldsetInputs.setAttribute('step', 'verify');
                }
                else {
                  this.methods.setStatus({ className: 'notice', message: 'clear all text to go back.' });
                  return fieldsetInputs.setAttribute('input', 'phone-number');
                }
              }
              break;
            }
            case 1: {
              if (this.user['phone-number'].status === 'verified') {
                this.methods.setStatus({ className: 'notice', message: 'clear all text to go back.' });
                return fieldsetInputs.setAttribute('input', 'authenticator');
              }
              else {
                if (step === 'set') {
                  this.methods.setStatus({ className: 'code', message: 'get verification code' });
                  return fieldsetInputs.setAttribute('step', 'verify');
                }
                else {
                  this.methods.setStatus({ className: 'notice', message: 'clear all text to go back.' });
                  return fieldsetInputs.setAttribute('input', 'authenticator');
                }
              }
              break;
            }
            case 2: {
              if (this.user['authenticator'].status === 'verified') {
                this.methods.setStatus({ className: 'notice', message: 'clear all text to go back.' });
                return fieldsetInputs.setAttribute('input', 'password');
              }
              else {
                if (step === 'set') {
                  this.methods.setStatus({ className: 'code', message: 'get verification code' });
                  return fieldsetInputs.setAttribute('step', 'verify');
                }
                else {
                  this.methods.setStatus({ className: 'notice', message: 'clear all text to go back.' });
                  return fieldsetInputs.setAttribute('input', 'password');
                }
              }
              break;
            }
            case 3: {
              if (this.user['password'].status === 'verified') {
                return this.socket.emit('register-user', JSON.stringify(this.user));
              }
              else {
                if (step === 'set') {
                  this.methods.setStatus({ className: 'notice', message: 're-enter your password' });
                  return fieldsetInputs.setAttribute('step', 'verify');
                }
                else {
                  return this.socket.emit('register-user', JSON.stringify(this.user));
                }
              }
              break;
            }
            default:
              break;
          }

          if (index < requirements.length - 1) {
            if (step === 'set') {
              if (this.user[requirements[index]].status === 'verified') {
                statusInfo.setAttribute('status', 'notice');
                return fieldsetInputs.setAttribute('input', requirements[++index]);
              }
              else {
                statusInfo.setAttribute('status', 'code');
                return fieldsetInputs.setAttribute('step', 'verify');
              }
            }
            else {
              if (this.user[requirements[index]].status === 'verified') {
                return fieldsetInputs.setAttribute('input', requirements[++index]);
              }
              else {
                return;
              }
            }
          }
          else {
            if (step === 'set') {
              statusInfo.setAttribute('status', 'code');
              return fieldsetInputs.setAttribute('step', 'verify');
            }
            else {
              return;
            }
          }
        }
        catch (error) {
          console.log(error);
          return this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      }

      customElements.whenDefined('nav-buttons')
      .then(function() {
        const back = navButtons.shadowRoot.querySelector('#back');
        back.onclick = stepBack;

        const next = navButtons.shadowRoot.querySelector('#next');
        next.onclick = stepNext;
      })


      this.socket = socket;

      form.onsubmit = (event) => {
        try {
          event.preventDefault();
          event.stopPropagation();
          // event.stopImmediatePropagation();

          const input = fieldsetInputs.getAttribute('input');
          const step = fieldsetInputs.getAttribute('step');
          const field = fieldsetInputs.shadowRoot.querySelector(`#${input} #${step} input`);

          switch (input) {
            case 'email-address':
              switch (step) {
                case 'set':
                    console.log(field.value);
                    this.user['email-address'].value = field.value;
                    return socket.emit('set-email', field.value);
                  break;
                case 'verify':
                    this.user['email-address'].code = field.value;
                    return socket.emit('verify-email-address', JSON.stringify(this.user['email-address']));
                  break;

                default:
                  throw new Error('email-address: unknown step.');
                  break;
              }
              break;
            case 'phone-number':
              switch (step) {
                case 'set':
                    console.log(field.value);
                    this.user['phone-number'].value = field.value;
                    return socket.emit('set-phone', field.value);
                  break;
                case 'verify':
                    this.user['phone-number'].code = field.value;
                    return socket.emit('verify-phone-number', JSON.stringify(this.user['phone-number']));
                  break;

                default:
                  throw new Error('phone-number: unknown step.');
                  break;
              }
              break;
            case 'authenticator':
              switch (step) {
                case 'set':
                  socket.emit('set-authenticator', field.value);
                  break;
                case 'verify':
                  socket.emit('verify-authenticator', field.value);
                  break;

                default:
                  throw new Error('authenticator: unknown step.');
                  break;
              }
              break;
            case 'password':
              switch (step) {
                case 'set':
                  socket.emit('set-password', field.value);
                  break;
                case 'verify':
                  socket.emit('verify-password', field.value);
                  break;

                default:
                  throw new Error('password: unknown step.');
                  break;
              }
              break;

            default:
              throw new Error('unknown input.');
              break;
          }

          const formData = getFormData(form);
          socket.emit('submit', formData);
        }
        catch (error) {
          this.methods.setStatus({ className: 'invalid', message: error.message });
        }
      };

    }
    catch (error) {
      throw error;
    }

  }

  connectedCallback() {
    console.info('••• element is connected:', this.tagName);
    this.socket.emit('user', 'a user has connected to sign-in.');

  }

  disconnectedCallback() {
  }

  adobtedCallback() {

  }




  attributeChangedCallback(name, oldValue, newValue) {
    try {
      if (name === 'styles') return this.shadowRoot.querySelector('link').setAttribute('href', newValue);
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
