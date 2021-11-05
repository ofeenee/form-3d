
try {

  console.log('page ready.');

  mainBackground = document.querySelector('main-background');
  usernameEmail = document.querySelector('username-email');



  mainBackground.addEventListener('backgroundLoaded', function(e) {
    console.log('background ready.');
  });

}
catch (error) {
  throw error;
}

async function submit(event) {
  try {
    console.log('GET user:');
    event.preventDefault();
    event.stopPropagation();
    const data = new FormData(form);

    const user = {
      email: data.get('email-address'),
      // phone: data.get('phone'),
      // password: data.get('password')
    };

    const response = await postData('https://x4.ngrok.io/users/get', user);
    if (response.existing === false) {

    }
    else {
      console.log(response);
    }
  }
  catch (error) {
    console.error(error.message);
    throw error;
  }
}


function scrollToFieldset({to = null, fieldset = null, from = null}) {
  try {
    if (from === null && typeof from !== 'number') throw new Error('"from" argument invalid.');
    if (to === null && typeof to !== 'number') throw new Error('"to" argument invalid.');
    if (fieldset === null) throw new Error('"fieldset" argument is invalid.');



    Object.freeze(fieldset);

  }
  catch (error) {

  }
}

function prepareElements(elements = []) {
  try {
    if (elements.length === 0 || typeof elements !== 'object') throw new Error('elements argument invalid.');

    elements.forEach((element, i) => {
      element.id = i;
    });

    console.info(elements);
  }
  catch (error) {
    console.error(error.message);
  }
}

// HELPER FUNCTIONS
async function postData(url = null, data = null) {
  try {
    if (!url || !data) throw new Error('required field missing.');
    console.log('url:', url);
    console.log('data:', data);
    const response = await fetch(url, {
      method: 'POST',
      // mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    console.log('response:', response);
    const result = await response.json();
    return result;
  }
  catch (error) {
    throw error;
    console.log('error', error.message);
    return error;
  }
}
