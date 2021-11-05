'use strict';

const {
  isEmail,
  isMobilePhone,
  isStrongPassword,
} = validator;

const accountsTemplate = document.createElement('template');
accountsTemplate.innerHTML = `

<style>



*, *::before, *::after {
  user-select: none;
  webkit-user-select: none;
}

:host {
  display: block;
  /* backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  -moz-backdrop-filter: blur(5px); */
  border-radius: 12px;
  filter: drop-shadow(0 0 0.75rem rgba(0,0,0,0.45));
  background-color: rgba(255,255,255,0.55) !important;
}

form {
  box-sizing: border-box;
  margin: 0;
  padding: 25px;
  height: 100%;
  width: 100%;
}


form #grid {
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-template-columns: 1fr;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 25px;
  height: 100%;
  width: 100%;
}

#grid div {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
}


fieldset {
  outline: none;
  border: none;
  padding: 0;
  margin: 0;
  height: 100%;
  width: 100%;
}

legend {
  display: flex;
  flex-direction: column;
  justfiy-content: center;
  align-items; center;
  position: relative;
  width: 100%;
  text-align: center;
}
legend svg {
  display: none;
  height: 20px;
  fill: white;
  filter: drop-shadow(0 0 2px rgba(0,0,0,0.75));
}

input {
  -webkit-appearance: none !important;
  box-sizing: border-box;
  padding: 10px 25px;
  margin: 0;
  border: none;
  mix-blend-mode: multiply;
  outline: none;
  border-radius: 5px;
  color: black;
  font-size: 14px;
  text-align: center;
  width: 100%;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.70);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.70);
  -moz-box-shadow: inset 0 0 10px rgba(0,0,0,0.70);
}

label {
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  top: -6px;
  background-color: grey;
  height: 16px;
  font-size: 9px;
  color: white;
  text-align: center;
  user-select: none;
  -webkit-user-select: none;
  border-radius: 0 0 5px 5px;
  margin: 0 !important;
}

input[type="submit"], button {
  // visibility: hidden;
  background-color: #388cec;
  color:  white;
  border-radius: 5px !important;
  text-transform: uppercase;
  outline: none;
  border: none;
  width: 100%;
  cursor: pointer;
  box-shadow: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;

}

input[type="submit"]:active, button:active {
  box-shadow: inset 0 0 10px rgba(0,0,0,0.70);
  -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.70);
  -moz-box-shadow: inset 0 0 10px rgba(0,0,0,0.70);
}

button {
  margin: 0 !important;
  padding: 10px;
  user-select: none;
  -webkit-user-select: none;
  visibility: visible;
  height: 32px;
  // width: 75px;
  position: relative;
  top: 32px;
  border-radius: 5px 0 0 0 !important;
  z-index: 1;
  cursor: pointer;
  font-size: 10px;
}

form[name="verify"] {
  display: none;
}


button:active {
  background-color: crimson;
}

.valid {
  background-color: seagreen !important;
}

.invalid {
  background-color: crimson !important;
}

.panel.flip .front {
	z-index: 900;
	-webkit-transform: rotateY(180deg);
	-moz-transform: rotateY(180deg);
}
.panel.flip .back {
	z-index: 1000;
	-webkit-transform: rotateX(0deg) rotateY(0deg);
	-moz-transform: rotateX(0deg) rotateY(0deg);
}

</style>
<main>
  <form id="accounts" name="accounts" method="POST" action="" autocomplete="on" class="panel flip front">
    <fieldset>
      <legend><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!-- Font Awesome Free 5.15.3 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) --><path d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"/></svg></legend>
      <div id="grid">
        <div>
          <input name="email" type="email" id="email" minLength="6" placeholder="user@email.com" autocomplete="email" enterkeyhint="next" required autofocus>
          <label for="email" id="emailValidator">email</label>
        </div>
        <div>
          <input name="phone" type="tel" id="phone" placeholder="+123456789" autocomplete="tel" enterkeyhint="next" required>
          <label for="phone" id="phoneValidator">phone</label>
        </div>
        <div>
          <input name="password" type="password" id="password" minLength=8 placeholder="********" autocomplete="current-password" required>
          <label for="password" id="passwordValidator">password</label>
        </div>
        <div>
          <input type="submit" value="Ok">
        </div>
      </div>
    </fieldset>
  </form>
  <form name="verify" method="POST" action="" autocomplete="on" class="panel flip back">
    <fieldset>
      <legend>Verification</legend>
      <div id="grid">
        <div>
          <button id="emailCode" type="button">get code</button>
          <input name="emailVerify" type="text" id="emailVerify" placeholder="123456" autocomplete="one-time-code" enterkeyhint="next" required>
          <label for="emailVerify" id="emailCodeValidator">email code</label>
          </div>
          <div>
          <button id="phoneCode" type="button">get code</button>
          <input name="phoneVerify" type="text" id="phoneVerify" placeholder="123456" autocomplete="one-time-code" enterkeyhint="submit" required>
          <label for="phoneVerify" id="phoneCodeValidator">phone code</label>
        </div>
        <div>
          <input type="submit" value="Ok">
        </div>
      </div>
    </fieldset>
  </form>
</main>

`;

class userAccount extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(accountsTemplate.content.cloneNode(true));


    const form = this.shadowRoot.querySelector('#accounts');
    form.addEventListener('submit', submitForm);



    const email = this.shadowRoot.querySelector('#email');
    email.addEventListener('change', validateElement);
    email.addEventListener('input', validateElement);
    email.addEventListener('invalid', markInvalid);

    const phone = this.shadowRoot.querySelector('#phone');
    phone.addEventListener('change', validateElement);
    phone.addEventListener('input', validateElement);
    phone.addEventListener('invalid', markInvalid);

    const password = this.shadowRoot.querySelector('#password');
    password.addEventListener('change', validateElement);
    password.addEventListener('input', validateElement);
    password.addEventListener('invalid', markInvalid);



    const api = this.getAttribute('api');

    async function submitForm(event) {
      try {

        event.preventDefault();
        event.stopPropagation();

        email.value = email.value.trim();
        phone.value = phone.value.trim();
        password.value = password.value.trim();
        console.log(form.reportValidity());

        if (isEmail(email.value)) email.nextElementSibling.className = 'valid';
        else {
          email.setCustomValidity('Email address is invalid.\nFormat e.g. you@email.com');
          // email.reportValidity();
        }

        if (isMobilePhone(phone.value, 'any', {strictMode: true})) phone.nextElementSibling.className = 'valid';
        else {
          phone.setCustomValidity('Phone number is invalid.\nFormat e.g. +123456789');
          // phone.reportValidity();
        }

        if (isStrongPassword(password.value)) password.nextElementSibling.className = 'valid';
        else {
          password.setCustomValidity('Password is invalid.\nFormat e.g. ABCabc123!@#');
          // password.reportValidity();
        }



        const user = {
          email: email.value,
          phone: phone.value,
          password: password.value
        };

        console.log(user);
        const response = await postData(api, user);
        return console.log(response);
      }
      catch (error) {
        console.error(error.message);
      }
    }
  }
}


window.customElements.define('user-account', userAccount);


// function validateElementChange(event) {
//   const element = event.target;
//   const label = element.nextElementSibling;

//   element.value = element.value.trim();

//   element.setCustomValidity('');

//   if (!value) return label.className = '';

//   switch(element.getAttribute('name')) {
//     case 'email':
//       if (isEmail(value)) return label.className = 'valid';
//       else {
//         label.className = 'invalid';
//         element.setCustomValidity('Email address is invalid.\nFormat e.g. you@email.com');
//       }
//     case 'phone':
//       const regex = /^[0+]{2,}(\d*)/;
//       element.value = value.replace(regex, '+$1');

//       if (isMobilePhone(value, 'any', {strictMode: true})) return label.className = 'valid';
//       else {
//         label.className = 'invalid';
//         element.setCustomValidity('Phone number is invalid.\nFormat e.g. +123456789');
//       }
//     case 'password':
//       if(isStrongPassword(value)) return label.className = 'valid';
//       else {
//         label.className = 'invalid';
//         element.setCustomValidity('Password is invalid.\nFormat e.g. ABCabc123!@#');
//       }
//   }

// }

function validateElement(event) {
  const element = event.target;
  const label = element.nextElementSibling;

  const value = element.value.trim();

  element.setCustomValidity('');


  if (!value) return label.className = '';
  switch(element.getAttribute('name')) {
    case 'email':
      if (isEmail(value)) return label.className = 'valid';
      else {
        label.className = 'invalid';
        element.setCustomValidity('Email address is invalid.\nFormat e.g. you@email.com');
      }
    case 'phone':
      const regex = /^[0+]{2,}(\d*)/;
      if (regex.test(value)) element.value = value.replace(regex, '+$1');
      if (isMobilePhone(value, 'any', {strictMode: true})) return label.className = 'valid';
      else {
        label.className = 'invalid';
        element.setCustomValidity('Phone number is invalid.\nFormat e.g. +123456789');
      }
    case 'password':
      if(isStrongPassword(value)) return label.className = 'valid';
      else {
        label.className = 'invalid';
        element.setCustomValidity('Password is invalid.\nFormat e.g. ABCabc123!@#');
      }
  }

}

function markInvalid(event) {
  const label = event.target.nextElementSibling;
  return label.className = 'invalid';
}

async function postData(url = null, data = null) {
  if (!url || !data) return;
  try {
    console.log('url:', url);
    console.log('data:', data);
    const response = await fetch(url, {
      method: 'POST',
      // mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log('response:', response);
    const registration = await response.json();
    return registration;
  }
  catch (error) {
    console.log('error', error.message);
    return error;
  }
}
