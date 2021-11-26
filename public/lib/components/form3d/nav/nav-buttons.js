const form = document.querySelector('form#user-account');

const template = document.createElement('template');
template.innerHTML = `
<link rel="stylesheet">
<div id="wrapper">
  <div id="navScene">
    <nav id="buttons" class="submit">
      <button type="button" id="back" disabled>back</button>
      <button type="submit" id="submit" disabled>submit</button>
      <button type="button" id="next" disabled>next</button>
      <button type="button" id="reset" disabled>reset</button>
    </nav>
  </div>
</div>
`;


class NavButtons extends HTMLElement {
  static get observedAttributes() {
    return ['button', 'class', 'status', 'styles', 'idle'];
  }

  constructor() {
    try {
      super();

      const styles = this.getAttribute('styles');
      const stylesheet = template.content.querySelector('link');
      stylesheet.setAttribute('href', styles);

      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(template.content.cloneNode(true));



      const wrapper = this.shadowRoot.querySelector('#wrapper');
      wrapper.addEventListener('animationend', function removeShakeErrorClassName(event) {
        try {
          if (event.animationName === 'error-shake') {
            wrapper.className = '';
          }
        }
        catch (error) {
          this.setAttribute('status', 'invalid');
          this.setAttribute('text', error.message);
        }

      });
    console.info('statusInfo', fieldset, nav);
    }
    catch(error) {

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

      const buttons = this.shadowRoot.querySelectorAll('button');
      buttons.forEach(button => {
        try {
          // console.log(button);
          button.setAttribute('disabled', 'true');
        }
        catch (error) {
          throw error;
        }
      });

      const nav = this.shadowRoot.querySelector('nav#buttons');


      const back = this.shadowRoot.querySelector('button#back');
      const submit = this.shadowRoot.querySelector('button#submit');
      const next = this.shadowRoot.querySelector('button#next');
      const reset = this.shadowRoot.querySelector('button#reset');




      switch (name) {
        //////////////////////////////////
        case 'button':
          switch (newValue) {
            case 'back':
              nav.className = 'back';
              back.removeAttribute('disabled');
              break;
            case 'submit':
              submit.onclick = form.onsubmit;

              nav.className = 'submit';
              submit.removeAttribute('disabled');
              break;
            case 'next':
              nav.className = 'next';
              next.removeAttribute('disabled');
              break;
            case 'reset':
              nav.className = 'reset';
              next.removeAttribute('disabled');
              break;
            case 'none':
              nav.className = 'back';
              back.setAttribute('disabled', 'true');
              submit.setAttribute('disabled', 'true');
              next.setAttribute('disabled', 'true');
              reset.setAttribute('disabled', 'true');
              break;

            default:
              this.setAttribute('button', oldValue);
              this.setAttribute('error', 'button can only accept "back", "submit", "next", "reset", and "none" as values.');
              break;
          }
          break;
        //////////////////////////////////
        case 'status':
          switch (newValue) {
            case 'disabled':
              if (this.getAttribute('button') === 'none') {
                return this.setAttribute('error', 'all buttons are already disabled.');
              }
              else {
                const currentButton = this.getAttribute('button');
                const button = nav.querySelector(`button#${currentButton}`);
                button.setAttribute('disabled', 'true');
              }
              break;
            case 'enabled':
              if (this.getAttribute('button') === 'none') {
                this.setAttribute('status', oldValue);
                return this.setAttribute('error', 'cannot set status to enabled when the button attribute is set to "none".')
              }
              else {
                const currentButton = this.getAttribute('button');
                const button = nav.querySelector(`button#${currentButton}`)
                button.removeAttribute('disabled');
              }
              break;
            case 'none':
              back.setAttribute('disabled', 'true');
              submit.setAttribute('disabled', 'true');
              next.setAttribute('disabled', 'true');
              reset.setAttribute('disabled', 'true');
              break;
            default:
              this.setAttribute('status', oldValue);
              this.setAttribute('error', 'status can only accept "disabled", "enabled", and "none" as values.')
              break;
          }
          break;
        //////////////////////////////////
        case 'styles':
          const stylesheet = template.content.querySelector('link');
          stylesheet.setAttribute('href', newValue);
          break;
        //////////////////////////////////
        case 'class':
          nav.className = newValue;
          break;
        //////////////////////////////////
        case 'idle':
          const wrapper = this.shadowRoot.querySelector('#wrapper');
          switch (newValue) {
            case 'true':
              wrapper.classList.add('idle-rotate');
              break;
            case 'false':
              wrapper.classList.remove('idle-rotate');
              break;
            default:
              this.setAttribute('idle', oldValue);
              this.setAttribute('error', 'idle can only accept "true" and "false" values.')
              break;
          }
        default:
          this.setAttribute('error', 'the only accepted attributes are "button", "status", "styles", "class", and "idle".')
          break;

      }
    }
    catch (error) {
      throw error;
    }
  }
}


window.customElements.define('nav-buttons', NavButtons);