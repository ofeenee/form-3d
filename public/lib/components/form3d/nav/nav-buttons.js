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
    return ['button', 'class', 'status', 'styles'];
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
    this.className = 'idle-rotate';
    console.info('••• element is connected:', this.tagName);
  }

  disconnectedCallback() {
  }

  adobtedCallback() {
  }

  attributeChangedCallback(name, oldValue, newValue) {
    try {

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
              throw new Error('button value is invalid');
              break;
          }
          break;
        //////////////////////////////////
        case 'status':
          const button = this.shadowRoot.querySelector(`button#${newValue}`);
          switch (newValue) {
            case 'disabled':
              button.setAttribute('disabled', 'true');
              console.info(button, 'button is disabled');
              break;
            case 'enabled':
              button.removeAttribute('disabled');
              break;
            default:
              throw new Error(`${name} value is invalid`);
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
        default:
          throw new Error(`${name} attribute is invalid`);
          break;

      }
    }
    catch (error) {
      console.info(error.message);
      // setStatus({className: 'invalid', message: error.message});
    }
  }
}


window.customElements.define('nav-buttons', NavButtons);