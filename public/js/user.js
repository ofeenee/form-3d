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

const form = document.querySelector('form#user-account');
window.addEventListener('DOMContentLoaded', formLoad);

function formLoad(event) {
  try {
    form.onsubmit = SUBMIT['set-email'];


    INPUTS['email'].oninput = inputChangeHandler;
    INPUTS['email-verification-code'].oninput = inputChangeHandler;


    if (INPUTS['email'].value.length > 0) {
      BUTTONS['submit'].removeAttribute('disabled');
      SCENES['buttons'].className = 'submit';
    }
  }
  catch (error) {
    console.warn(error.message);
  }
};

// ////////////////////////////////////////////////

const INPUTS = {
  ['email']: document.querySelector('fieldset#fieldsetScene section#email-address input#email'),
  ['phone']: document.querySelector('fieldset#fieldsetScene section#phone-number input#phone'),
  ['email-verification-code']: document.querySelector('fieldset#fieldsetScene section#email-address input#email-verification-code'),
  ['phone-verification-code']: document.querySelector('fieldset#fieldsetScene section#phone-number input#phone-verification-code'),
}

const BUTTONS = {
  ['back']: document.querySelector('#buttons > button#back'),
  ['submit']: document.querySelector('#buttons > button#submit'),
  ['next']: document.querySelector('#buttons > button#next'),
  ['code']: document.querySelector('#info button#code'),
}

const SCENES = {
  ['sections']: document.querySelector('#fieldset > div#sections'),
  ['email-address']: document.querySelector('section#email-address'),
  ['phone-number']: document.querySelector('section#phone-number'),
  ['info']: document.querySelector('#statusScene > div#info'),
  ['buttons']: document.querySelector('#navScene > nav#buttons'),
}

const SUBMIT = {
  ['set-email']: async function setEmail(event) {
    try {
      event.preventDefault();
      event.stopPropagation();

      // var section = document.querySelector('#email-address');

      BUTTONS['submit'].setAttribute('disabled', 'true');
      SCENES['info'].parentElement.classList.remove('error_shake');
      const response = await submitFormData('set-email', endpoint);
      console.info(response);

      if (response.status === 200) {
        const existing = response?.existing === null ? 'null' : response.existing.toString();
        const verified = response?.verified === null ? 'null' : response.verified.toString();

        if (existing === 'false' && (verified === 'null' || verified === 'false')) {
          SCENES['buttons'].className = 'next';
          BUTTONS['next'].removeAttribute('disabled');
          BUTTONS['next'].onclick = NEXT['verify-email'];
          return setStatus({className: 'valid', message: `existing: ${existing} // verified: ${verified}`});
        }
        else if (existing === 'false' && verified === 'true') {
          SCENES['next'].className = 'next';
          BUTTONS['next'].removeAttribute('disabled');
          BUTTONS['next'].onclick = NEXT['phone-number'];
          return setStatus({className: 'valid', message: 'email address valid (verified)'});
        }
        else if (existing === 'true' && verified === 'true') {
          SCENES['buttons'].className = 'next';
          BUTTONS['next'].removeAttribute('disabled');
          BUTTONS['next'].onclick = NEXT['get-jwt'];
          return setStatus({className: 'valid', message: 'welcome back'});
        }
        else {
          BUTTONS['next'].removeAttribute('disabled');
          return setStatus({className: 'invalid', message: `existing: ${response.existing}, verified: ${response.verified}`});
        }
      }
      else throw new Error(response.error);
    }
    catch (error) {
      BUTTONS['submit'].removeAttribute('disabled');
     return formErrorHandler(error);
    }
  },
  ['verify-email']: async function verifyEmailAddress(event) {
    try {
      event.preventDefault();
      event.stopPropagation();

      BUTTONS['submit'].setAttribute('disabled', 'true');

      const response = await submitFormData('verify-email', endpoint);
      if (response?.status === 200) {

        INPUTS['email-verification-code'].setAttribute('placeholder', INPUTS['email-verification-code'].value);
        setStatus({ className: 'valid', message: 'email address verified!' });
        SCENES['buttons'].className = 'next';
        BUTTONS['next'].removeAttribute('disabled');
        BUTTONS['next'].onclick = NEXT['phone-number'];
        // next.onclick = formTwo;


        console.log(response);
      }
      else throw new Error(response?.error);

    }
    catch (error) {
      formErrorHandler(error);
      // throw error;
    } finally {
      BUTTONS['submit'].removeAttribute('disabled');
    }
  },
  ['email-verification-code']: async function emailVerificationCode(event) {
    try {


      BUTTONS['code'].setAttribute('disabled', 'true');

      const response = await submitFormData('email-verification-code', endpoint);
      console.log(response);

      if (response.status === 200) {

        const expireIn = (response?.ttl) ? response.ttl : 60;

        const timeout = setTimeout(() => {
          BUTTONS['code'].removeAttribute('disabled');
          clearTimeout(timeout);
        }, 1000 * expireIn);

        if (response?.ttl) return setStatus({ className: 'valid', message: 'email verification code already sent!' });
        else return setStatus({ className: 'valid', message: 'email verification code sent!' });
      }
      else {
        throw new Error(response.error);
      }
    }
    catch (error) {
      return formErrorHandler(error);
    }
  },
  ['phone-number']: async function setPhone(event) {
    try {

    }
    catch(error) {
      return formErrorHandler(error);
    }
  }
};


const BACK = {
  ['set-email']: function backToEmail(event) {
    try {
      SCENES["email-address"].className = 'set-email';
      SCENES["buttons"].className = 'next';

      INPUTS["email"].removeAttribute('disabled');
      INPUTS["email-verification-code"].setAttribute('disabled', 'true');

      setStatus({ className: 'valid', message: 'email address valid' });
      BUTTONS["back"].setAttribute('disabled', 'true');
      BUTTONS["submit"].setAttribute('disabled', 'true');

      BUTTONS['back'].setAttribute('disabled', 'true');
      BUTTONS['back'].onclick = null;
      if (INPUTS["email"].value.length) {
        SCENES['buttons'].className = 'next';
        BUTTONS['next'].removeAttribute('disabled');
      }
      else SCENES['buttons'].className = 'back';
      form.onsubmit = SUBMIT['set-email'];
    }
    catch (error) {
      throw error;
    }
  },
};

const NEXT = {
  ['verify-email']: function toVerifyEmail(event) {
    try {
      SCENES["email-address"].className = 'verify-email';
      SCENES.buttons.className = 'back';
      SCENES.info.className = 'code';
      BUTTONS.code.onclick = SUBMIT['email-verification-code'];

      INPUTS['email'].setAttribute('disabled', 'true');
      INPUTS['email-verification-code'].removeAttribute('disabled');
      form.onsubmit = SUBMIT['verify-email'];

      INPUTS['email-verification-code'].removeAttribute('disabled');

      BUTTONS['next'].setAttribute('disabled', 'true');
      BUTTONS['submit'].setAttribute('disabled', 'true');

      BUTTONS['back'].removeAttribute('disabled');
      BUTTONS['back'].onclick = BACK['set-email'];


    }
    catch (error) {
      throw error;
    }
  },
  ['phone-number']: function nextToPhoneNumber(event) {
    try {

      INPUTS['email'].setAttribute('disabled', 'true');
      INPUTS['email-verification-code'].setAttribute('disabled', 'true');

      BUTTONS['back'].removeAttribute('disabled');
      BUTTONS['back'].onclick = BACK['verify-email'];

      form.onsubmit = SUBMIT['phone-number'];

      SCENES['sections'].className = 'phone-number';
      SCENES['buttons'].className = 'back';

      INPUTS['phone-number'].removeAttribute('disabled');

      setStatus({ className: 'notice', message: 'clear all text to go back' });


    }
    catch (error) {
      return formErrorHandler(error);
      throw error;
    }
  },
}






const user = {
  email: null,
  phone: null,
  password: null,
}

function setStatus({className, message} = {className: null, message: null}) {
  try {
    if (!className || !message) throw new Error('missing className or message');

    // const status = document.querySelector('div#statusScene');
    const status = {
      ['notice']: document.querySelector('#info #notice'),
      ['valid']: document.querySelector('#info #valid'),
      ['invalid']: document.querySelector('#info #invalid'),
      ['code']: document.querySelector('#info #code'),
    }
    // reset all strings
    status.valid.textContent = '';
    status.notice.textContent = '';
    status.invalid.textContent = '';

    SCENES['info'].className = className;
    if (className === 'invalid') SCENES['info'].parentElement.className = 'error_shake';
    else SCENES['info'].parentElement.className = '';

    status[className].textContent = message;
    return true;
  }
  catch (error) {
    return formErrorHandler(error);
  }
}


function inputChangeHandler(event) {
  try {
    event.preventDefault();
    event.stopPropagation();


    const input = event.currentTarget;
    const value = input.value;

    if (!BUTTONS['next'].getAttribute('disabled')) BUTTONS['next'].setAttribute('disabled', 'true');

    if (document.querySelector('p#notice').value !== 'clear all text to go back')
      setStatus({ className: 'notice', message: 'clear all text to go back' });


    if (value.length === 0) {
      console.info(input.id);
      if (input.id === 'email-verification-code') {
        SCENES['info'].className = 'code';
      }

      BUTTONS['submit'].setAttribute('disabled', 'true');
      SCENES['buttons'].className = 'back';
    }
    else {
      BUTTONS['submit'].removeAttribute('disabled');
      SCENES['buttons'].className = 'submit';
    }


  }
  catch (error) {
    console.warn(error.message);
    throw error;
  }
}



async function submitFormData(id, endpoint) {
  try {
    switch (id) {
      case 'set-email':
        user.email = INPUTS['email'].value;
        return await postData(`${endpoint}/get/email`, user);
        break;
      case 'verify-email':
        // user.email = email.value;
        user.code = INPUTS['email-verification-code'].value;
        return await postData(`${endpoint}/verify/code/email`, user);
        break;
      case 'email-verification-code':
        return await postData(`${endpoint}/send/code/email`, user);
        break;

      default:
        break;
    }
  }
  catch (error) {
    console.warn(error.message);
    throw error;
  }
}


function formErrorHandler(error) {
  try {
    console.log('errorhandler:', error.message);
    setStatus({ className: 'invalid', message: error.message });
  }
  catch (error) {
    console.warn(error.message);
    // throw error;
  }
}


// HELPER FUNCTIONS
//

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
    console.error(error.message);
  }
}


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
