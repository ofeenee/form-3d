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
    return ['status', 'text', 'class'];
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
    this.classList.add('idle-rotate');

    console.info('••• element is connected:', this.tagName);
  }

  disconnectedCallback() {
  }

  adobtedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    try {
      const classNames = ['valid', 'invalid', 'notice', 'code'];
      const info = this.shadowRoot.querySelector('#info');
      switch (name) {
        case 'status':
          if (classNames.includes(newValue)) {
          info.className = newValue;
          }
          else {
            throw new Error('className is invalid.');
          }

          break;
        case 'text':
          if (classNames.includes(info.className)) {
            const element = info.querySelector(`#${info.className || 'null'}`);
            if (element) {
              if (info.className === 'invalid') {
                const wrapper = this.shadowRoot.querySelector('#wrapper');
                wrapper.className = 'error-shake';
              }

              element.textContent = newValue;
            }
          }
          else {
            throw new Error('className is invalid.');
          }
          break;
        case 'class':
          info.className = newValue;
          break;
        case 'styles':
          const stylesheet = template.content.querySelector('link');
          stylesheet.setAttribute('href', newValue);
          break;

        default:
          // info.className = 'invalid';
          throw new Error(`Unknown attribute: ${name}`);
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