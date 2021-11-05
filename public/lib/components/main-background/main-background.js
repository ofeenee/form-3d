'use strict';

let src1;
let src2;
let src3;
let src4;

const style = document.createElement('style');

style.textContent =
`:host {
  position: absolute !important;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  z-index: -99999 !important;
  overflow: hidden!;
}

img#mainBackground {
  position: absolute;
  padding: 0;
  margin: 0;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  object-position: center;
  object-fit: cover;
  opacity: 0;
  transition: opacity 2.0s ease-in 1.0s;
  background-color: transparent;
  z-index: -9999999;
}`;


class mainBackground extends HTMLElement {
  constructor() {
    try {
      super();

    this.attachShadow({ mode: 'open' });

    this.onerror = function(event) {
      try {
        console.log('umm....');
      }
      catch (error) {
        console.log('did not load, but whatever.');
      }
    }
    const id = this.getAttribute('id');

    src1 = this.getAttribute('src-1') ?? 'src-1';
    src2 = this.getAttribute('src-2') ?? 'src-2';
    src3 = this.getAttribute('src-3') ?? 'src-3';
    src4 = this.getAttribute('src-4') ?? 'src-4';

    if (!id) throw new Error('main-background element id attribute is missing (required).');

    const element = document.getElementById(id);

    const eventName = this.getAttribute('name');

    const img = createImageElement({eventName, element});

    console.log(img);

    this.shadowRoot.append(style, img);

    }
    catch (error) {
      console.error(error.message);
      console.info('main-background failed to load. background set to color: "transparent" instead.')
    }
  }
}

window.customElements.define('main-background', mainBackground);

function createImageElement({eventName, element}) {
  try {

    const loaded = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: false,
      detail: null,
    });

    const img = document.createElement('img');
    img.setAttribute('id', 'mainBackground');
    img.setAttribute('src', src1);

    img.onload = function (event) {
      try {
        img.style.opacity = 1;
      }
      catch (error) {
        console.error(error.message);
      }
    };

    img.ontransitionend = backgroundImageLoaded;
    img.onerror = setFallbackBackground;

    function backgroundImageLoaded(event) {
      try {
        element.dispatchEvent(loaded);
      }
      catch (error) {
        console.log(error.message);
        throw error;
      }
    }

    function setFallbackBackground(event) {
      try {
        event.preventDefault();
        event.stopPropagation();

        console.warn(`failed to load background image src="${event.currentTarget.src}"`);

        if (event.currentTarget.src.includes(src1)) {
          throw new Error('src-1');
        }

        if (event.currentTarget.src.includes(src2)) {
          throw new Error('src-2');
        }

        if (event.currentTarget.src.includes(src3)) {
          throw new Error('src-3');
        }

        if (event.currentTarget.src.includes(src4)) {
          throw new Error('src-4');
        }



        element.style.backgroundColor = 'lightgray';
        return element.dispatchEvent(loaded);


      }
      catch (error) {

        if (error.message === 'src-1') {
          console.info('falling back to src-2');
          return img.setAttribute('src', src2);
        }
        if (error.message === 'src-2') {
          console.info('falling back to src-3.')
          return img.setAttribute('src', src3);
        }
        if (error.message === 'src-3') {
          console.info('falling back to src-4.');
          return img.setAttribute('src', src4);
        }

        console.error(`falling back to solid color.`);
        element.style.backgroundColor = 'lightgray';
        return element.dispatchEvent(loaded);

        // return img.setAttribute('src', `${dir}lib/components/main-background/src/background.jpg`);


      }
    }

    return img;
  }
  catch (error) {
    console.info('something went wrong:');
    console.warn(error.message);
  }
}