const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet">
<div id="wrapper">
  <fieldset id="fieldsetScene">
    <div id="sections" class="email-address">
      <section id="email-address" class="set-email">
        <div id="set-email" class="active">
          <input
          type="email"
          id="email"
          name="email"
          required
          autocomplete="username email"
          inputmode="email"
          enterkeyhint="submit"
          placeholder="your@email.com"
          >
          <label for="email">account email address</label>
        </div>
        <div id="verify-email">
          <input
          type="one-time-code"
          id="email-verification-code"
          name="email-verification-code"
          required
          disabled
          autocomplete="one-time-code"
          inputmode="numeric"
          enterkeyhint="submit"
          placeholder="123456"
          maxlength="6"
          >
          <label for="email-verification-code">email verification code</label>
        </div>
      </section>
      <section id="phone-number" class="set-phone">
        <div id="set-phone" class="active">
          <input
          type="phone"
          id="phone"
          name="phone"
          required
          disabled
          autocomplete="tel"
          inputmode="numeric"
          enterkeyhint="submit"
          placeholder="+1234567890"
          >
          <label for="phone">account phone number</label>
        </div>
        <div id="verify-phone">
          <input
          type="one-time-code"
          id="phone-verification-code"
          name="phone-verification-code"
          required
          disabled
          autocomplete="one-time-code"
          inputmode="numeric"
          enterkeyhint="submit"
          placeholder="123456"
          maxlength="6"
          >
          <label for="phone-verification-code">get code</label>
        </div>
      </section>
    </div>
  </fieldset>
</div>
`;

class fieldsetInputs extends HTMLElement {
  static get observedAttributes() {
    return ['status', 'text', 'class', 'styles'];
  }

  constructor() {
    try {
      super();
      this.attachShadow({ mode: 'open' });

      const styles = this.getAttribute('styles');
      const stylesheet = template.content.querySelector('link');
      stylesheet.setAttribute('href', styles);

      this.shadowRoot.appendChild(template.content.cloneNode(true));

      const email = this.shadowRoot.querySelector('input#email');
      email.addEventListener('input', valueChangedListener );



    }
    catch (error) {
      throw error;
    }
  }

  connectedCallback() {
    this.classList.add('fieldset-input-connected');

    console.info('••• element is connected:', this);
  }

  disconnectedCallback() {
  }

  adobtedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    try {
      switch (name) {
        case 'styles':
          const stylesheet = template.content.querySelector('link');
          stylesheet.setAttribute('href', newValue);
          break;

        default:
          break;
      }

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
    const navButtons = document.querySelector('nav-buttons');
    if (event.currentTarget.value.length > 0) {
      navButtons.setAttribute('button', 'submit');
    }
    else {
      navButtons.setAttribute('button', 'back');
      navButtons.setAttribute('status', 'enabled');
    }

  }
  catch (error) {
    setStatus({ className: 'invalid', message: error.message });
    throw error;
  }
}