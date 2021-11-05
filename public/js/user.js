'use strict';

const { isEmail } = validator;

const endpoint = 'https://x4.ngrok.io/users';

const user = {
  email: null,
  phone: null,
  password: null,
}

const form = document.querySelector('form#user-account');
const fieldset = {
  // ['email-address']: document.querySelector('#email-address')
}

// fieldset['email-address'].querySelector('#email').oninput = inputChangeHandler;
form.onsubmit = formListener;

function inputChangeHandler(event) {
  try {
    event.preventDefault();
    event.stopPropagation();

    const fieldset = event.currentTarget.parentElement.parentElement;

    const nav = fieldset.querySelector('nav#nav');

    const input = event.currentTarget;
    const value = input.value;

    const status = fieldset.querySelector('p.status');
    status.className = 'status';
    status.textContent = 'delete to go back';


    if (value.length === 0) {
      nav.className = 'back';
    } else {
      nav.className = 'submit';
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

    const response = await submitFormData(step.id, endpoint);
    if (response.status === 200) {
      const status = step.querySelector('p.status');
      const nav = step.querySelector('nav#nav');
      status.textContent = '';
      status.classList.add('valid');
      nav.className = 'next';
      console.log(nav);
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
