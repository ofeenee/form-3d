const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet">
<div id="wrapper">
  <div id="statusScene">
    <div id="info" class="notice">
      <p id="invalid">an invalid message</p>
      <p id="notice">clear all text to go back</p>
      <p id="valid">a valid message</p>
      <button type="button" id="code">get code</button>
    </div>
  </div>
</div>
`

class statusInfo extends HTMLElement {
  static get observedAttributes() {
    return ['status', 'text', 'class', 'idle'];
  }

  constructor() {
    try {
      super();
      this.attachShadow({ mode: 'open' });

      const styles = this.getAttribute('styles');
      const stylesheet = template.content.querySelector('link');
      stylesheet.setAttribute('href', styles);

      this.shadowRoot.appendChild(template.content.cloneNode(true));


      const wrapper = this.shadowRoot.querySelector('#wrapper');
      wrapper.addEventListener('animationend', function removeShakeErrorClassName(event) {
        try {
          if (event.animationName === 'error-shake') {
            wrapper.className = '';
          }
        }
        catch(error) {
          this.setAttribute('status', 'invalid');
          this.setAttribute('text', error.message);
        }
      });
    }
    catch (error) {
      throw error;
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
      this.removeAttribute('error');

      const wrapper = this.shadowRoot.querySelector('#wrapper');
      wrapper.classList.remove('error-shake');
      wrapper.classList.remove('valid-pulse');

      const info = this.shadowRoot.querySelector('#info');

      switch (name) {
        case 'status':
          switch (newValue) {
            case "valid":
              info.className = 'valid';
              break;
            case "invalid":
              info.className = 'invalid';
              break;
            case "notice":
              info.className = 'notice';
              break;
            case "code":
              info.className = 'code';
              break;
            default:
              return this.setAttribute('error', 'status only accepts "valid", "invalid", "notice", and "code" as values.');
              break;
          }

          break;
        case 'text':
          const status = this.getAttribute('status');
          switch (status) {
            case "invalid":
              const invalid = this.shadowRoot.querySelector('#invalid');
              invalid.textContent = newValue;

              wrapper.classList.add('error-shake');
              break;
            case "valid":
              const valid = this.shadowRoot.querySelector('#valid');
              valid.textContent = newValue;

              wrapper.classList.add('valid-pulse');
              break;
            case "notice":
              const notice = this.shadowRoot.querySelector('#notice');
              notice.textContent = newValue;
              break;
            case "code":
              const code = this.shadowRoot.querySelector('#code');
              code.textContent = newValue;
              break;
            default:
              return this.setAttribute('error', 'status value is invalid. status needs to have one of the following values: "valid", "invalid", "notice", and "code".');
              break;
          }
          break;
        case 'class':
          info.className = newValue;
          break;
        case 'styles':
          const stylesheet = template.content.querySelector('link');
          stylesheet.setAttribute('href', newValue);
          break;
        case 'idle':
          switch (newValue) {
            case "true":
              wrapper.classList.add('idle-rotate');
              break;
            case "false":
              wrapper.classList.remove('idle-rotate');
              break;
            default:
              return this.setAttribute('error', 'the idle attribute only accepts "true" and "false" as values.');
              break;
          }
        default:
          return this.setAttribute('error', 'the only valid attributes are "status", "text", "class", "styles", and "idle".');
          break;
      }
    }
    catch (error) {

      const info = this.shadowRoot.querySelector('#info');

      info.className = 'invalid';

      const element = info.querySelector('#invalid');
      element.textContent = error.message;
      throw error;
    }
  }
}

window.customElements.define('status-info', statusInfo);