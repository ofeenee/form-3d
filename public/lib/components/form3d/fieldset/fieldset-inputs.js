const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet">
<div id="fieldset">
  <div id="sections" class="email-address">
    <div id="email-address">
      <div id="set-verify-wrapper" class="set">
        <section id="set">
          <div class="input">
            <input type="email" id="email" name="email" required autocomplete="username email" inputmode="email"
              enterkeyhint="submit" placeholder="your@email.com">
            <label for="email">account email address</label>
          </div>
        </section>
        <section id="verify">
          <div class="input">
            <input type="one-time-code" id="email-verification-code" name="email-verification-code" required disabled
              autocomplete="one-time-code" inputmode="numeric" enterkeyhint="submit" placeholder="1234567" maxlength="7">
            <label for="email-verification-code">email verification code</label>
          </div>
        </section>
        <div id="ceiling"></div>
        <div id="left-plane"></div>
        <div id="right-plane"></div>
        <div id="floor"></div>
      </div>
    </div>
    <div id="phone-number">
      <div id="set-verify-wrapper" class="set">
        <section id="set">
          <div class="input">
            <input type="phone" id="phone" name="phone" required autocomplete="tel" inputmode="numeric"
              enterkeyhint="submit" placeholder="+1234567890">
            <label for="phone">account phone number</label>
          </div>
        </section>
        <section id="verify">
          <div class="input">
            <input type="one-time-code" id="phone-verification-code" name="phone-verification-code" required disabled
              autocomplete="one-time-code" inputmode="numeric" enterkeyhint="submit" placeholder="1234567" maxlength="7">
            <label for="phone-verification-code">phone verification code</label>
          </div>
        </section>
        <div id="ceiling"></div>
        <div id="left-plane"></div>
        <div id="right-plane"></div>
        <div id="floor"></div>
      </div>
    </div>
    <div id="authenticator">
      <div id="set-verify-wrapper" class="set">
        <section id="set">
          <div class="input">
            <input type="authenticator" id="authenticator" name="authenticator" required autocomplete="one-time-code" inputmode="numeric"
              enterkeyhint="submit" placeholder="123456" maxlength="6">
            <label for="authenticator">account authenticator code</label>
          </div>
        </section>
        <section id="verify">
          <div class="input">
            <input type="one-time-code" id="authenticator-verification-code" name="authenticator-verification-code" required disabled
              autocomplete="one-time-code" inputmode="numeric" enterkeyhint="submit" placeholder="123456" maxlength="6">
            <label for="authenticator-verification-code">confirm verification code</label>
          </div>
        </section>
        <div id="ceiling"></div>
        <div id="left-plane"></div>
        <div id="right-plane"></div>
        <div id="floor"></div>
      </div>
    </div>
    <div id="password">
      <div id="set-verify-wrapper" class="set">
        <section id="set">
          <div class="input">
            <input type="password" id="set-new-password" name="set-new-password" required autocomplete="new-password" inputmode="text"
              enterkeyhint="submit" placeholder="********" maxlength="24">
            <label for="set-new-password">account password</label>
          </div>
        </section>
        <section id="verify">
          <div class="input">
            <input type="password" id="confirm-new-password" name="confirm-new-password" required disabled
              autocomplete="new-password" inputmode="text" enterkeyhint="submit" placeholder="********" maxlength="24">
            <label for="confirm-new-password">confirm password</label>
          </div>
        </section>
        <div id="ceiling"></div>
        <div id="left-plane"></div>
        <div id="right-plane"></div>
        <div id="floor"></div>
      </div>
    </div>
  </div>
</div>
`;

class fieldsetInputs extends HTMLElement {
  static get observedAttributes() {
    return ['input', 'text', 'idle', 'styles', 'step'];
  }

  constructor() {
    try {
      super();
      this.attachShadow({ mode: 'open' });

      const styles = this.getAttribute('styles');
      const stylesheet = template.content.querySelector('link');
      stylesheet.setAttribute('href', styles);

      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const setEmail = this.shadowRoot.querySelector('#email-address #set input');
      const verifyEmail = this.shadowRoot.querySelector('#email-address #verify input');

      setEmail.addEventListener('input', valueChangedListener);
      verifyEmail.addEventListener('input', valueChangedListener);

      setEmail.onsubmit = function getEmail(event) {
        try {
          event.preventDefault();
          event.stopPropagation();
          event.stopImmediatePropagation();

          const value = event.target.value;
          console.info('email address value: ', value);
        }
        catch (error) {
          throw error;
        }
      }

      const setPhone = this.shadowRoot.querySelector('#phone-number #set input');
      const verifyPhone = this.shadowRoot.querySelector('#phone-number #verify input');

      setPhone.addEventListener('input', valueChangedListener);
      verifyPhone.addEventListener('input', valueChangedListener);

      const setAuth = this.shadowRoot.querySelector('#authenticator #set input');
      const verifyAuth = this.shadowRoot.querySelector('#authenticator #verify input');

      setAuth.addEventListener('input', valueChangedListener);
      verifyAuth.addEventListener('input', valueChangedListener);

      const setPassword = this.shadowRoot.querySelector('#password #set input');
      const verifyPassword = this.shadowRoot.querySelector('#password #verify input');

      setPassword.addEventListener('input', valueChangedListener);
      verifyPassword.addEventListener('input', valueChangedListener);

    }
    catch (error) {
      throw error;
    }
  }

  connectedCallback() {
    // this.setAttribute('idle', true);

    console.info('????????? element is connected:', this.tagName);
  }

  disconnectedCallback() {
  }

  adobtedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    try {
      if (newValue === oldValue) this.setAttribute('error', 'new value and old value are the same.');
      const sections = this.shadowRoot.querySelector('#sections');
      const inputs = sections.querySelectorAll('input');

      const navButtons = document.querySelector('form-3d').shadowRoot.querySelector('nav-buttons');


      function enableInput(enable = null) {

        inputs.forEach(input => {
          input.setAttribute('disabled', 'disabled');
        });

        if (enable) {
          const input = sections.querySelector(`#${enable} section#set input`);
          input.removeAttribute('disabled');
          return input;
        }
      }

      switch (name) {
        case 'styles':
          const stylesheet = this.shadowRoot.querySelector('link');
          stylesheet.setAttribute('href', newValue);
          break;
        //////////////////////////////////////////
        case 'idle':
          if (newValue === 'true') sections.classList.add('idle-rotate');
          else if (newValue === 'false') sections.classList.remove('idle-rotate');
          else {
            this.setAttribute('idle', oldValue);
            return this.setAttribute('error', 'valid idle values are "true" or "false".')
          };
          break;
        //////////////////////////////////////////
        case 'input':
          switch (newValue) {
            case 'none':
              navButtons.setAttribute('status', 'none');
              return enableInput();
              break;
            case 'email-address': {
              const input = enableInput(newValue);
              sections.className = newValue;
              console.info(input);
              if (input.value.length) {
                navButtons.setAttribute('button', 'submit');
                navButtons.setAttribute('status', 'enabled');
              }
              else {
                navButtons.setAttribute('button', 'back');
                navButtons.setAttribute('status', 'disabled');
              }
              break;
            }
            case 'phone-number': {
              const input = enableInput(newValue);
              console.info(input);

              sections.className = newValue;
              if (input.value.length) {
                navButtons.setAttribute('button', 'submit');
                navButtons.setAttribute('status', 'enabled');
              }
              else {
                navButtons.setAttribute('button', 'back');
                navButtons.setAttribute('status', 'enabled');
              }
              break;
            }
            case 'authenticator': {
              const input = enableInput(newValue);
              console.info(input);

              sections.className = newValue;
              if (input.value.length) {
                navButtons.setAttribute('button', 'submit');
                navButtons.setAttribute('status', 'enabled');
              }
              else {
                navButtons.setAttribute('button', 'back');
                navButtons.setAttribute('status', 'enabled');
              }
              break;
            }
            case 'password': {
              const input = enableInput(newValue);
              console.info(input);

              sections.className = newValue;
              if (input.value.length) {
                navButtons.setAttribute('button', 'submit');
                navButtons.setAttribute('status', 'enabled');
              }
              else {
                navButtons.setAttribute('button', 'back');
                navButtons.setAttribute('status', 'enabled');
              }
              break;
            }
            default:
              this.setAttribute('input', oldValue);
              return this.setAttribute('error', 'valid input values are "email-address", "phone-number", "authenticator", "password", and "none".')
          }
          break;
        //////////////////////////////////////////
        case 'step':
          const id = this.getAttribute('input');
          switch (newValue) {
            case 'set':
              if (id && id !== 'none') {
                const wrapper = sections.querySelector(`#${id} #set-verify-wrapper`);

                const setInput = wrapper.querySelector('#set input');
                const verifyInput = wrapper.querySelector('#verify input');

                setInput.removeAttribute('disabled');
                verifyInput.setAttribute('disabled', 'true');

                wrapper.className = `set`;

                if (setInput.value.length) {
                  navButtons.setAttribute('button', 'submit');
                  navButtons.setAttribute('status', 'enabled');
                }
                else {
                  if (id === 'email-address') {
                    navButtons.setAttribute('button', 'back');
                    navButtons.setAttribute('status', 'disabled');
                  }
                  else {
                    navButtons.setAttribute('button', 'back');
                    navButtons.setAttribute('status', 'enabled');
                  }
                }
              }
              break;
            case 'verify':
              if (id && id !== 'none') {
                const wrapper = sections.querySelector(`#${id} > #set-verify-wrapper`);

                const setInput = wrapper.querySelector('#set input');
                const verifyInput = wrapper.querySelector('#verify input');

                setInput.setAttribute('disabled', 'true');
                verifyInput.removeAttribute('disabled');

                wrapper.className = `verify`;
                console.log(verifyInput.value);
                if (verifyInput.value.length) {
                  navButtons.setAttribute('button', 'submit');
                  navButtons.setAttribute('status', 'enabled');
                }
                else {
                  navButtons.setAttribute('button', 'back');
                  navButtons.setAttribute('status', 'enabled');
                }
              }

              break;
            default:
              this.setAttribute('step', oldValue);
              return this.setAttribute('error', 'valid step values are "set" and "verify".');
          }
          break;
        default:
          return this.setAttribute('error', 'valid attributes are: "styles", "idle", "input", and "step".');
      }

      this.removeAttribute('error');

    }
    catch (error) {
      throw error;
    }
  }
}

window.customElements.define('fieldset-inputs', fieldsetInputs);



function valueChangedListener(event) {
  try {
    console.log('input change listened!');
    const navButtons = document.querySelector('form-3d').shadowRoot.querySelector('nav-buttons');
    if (event.currentTarget.value.length > 0) {
      navButtons.setAttribute('button', 'submit');
    }
    else {
      navButtons.setAttribute('button', 'back');
      if (event.currentTarget.id === 'email') return navButtons.setAttribute('status', 'disabled');
      else navButtons.setAttribute('status', 'enabled');
    }

  }
  catch (error) {
    setStatus({ className: 'invalid', message: error.message });
    throw error;
  }
}

function setStatus({className = 'notice', message = 'clear all text to go back'}) {
  try {
    const status = document.querySelector('form-3d').shadowRoot.querySelector('status-info');
    status.setAttribute('status', className);
    status.setAttribute('text', message);
  }
  catch (error) {
    throw error;
  }
}
