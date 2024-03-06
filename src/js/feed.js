var installButton = document.querySelector('#installation');
// var createPostArea = document.querySelector('#create-post');
// var closeCreatePostModalButton = document.querySelector('#close-create-post-modal-btn');
var cardArea = document.querySelector('#body-post');
var CACHE_STATIC_NAME = 'static-v10';

function openCreatePostModal() {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function(choiceResult) {
      console.log(choiceResult.outcome);

      if (choiceResult.outcome === 'dismissed') {
        console.log('User cancelled installation');
      } else {
        console.log('User added to home screen');
      }
    });

    deferredPrompt = null;
  }
}

installButton.addEventListener('click', openCreatePostModal);


function clearCards() {
  while(cardArea.hasChildNodes()) {
    cardArea.removeChild(cardArea.lastChild);
  }
}

function createCard(data) {
  var exploreCard = document.createElement('div');
  exploreCard.classList.add('explore__card');

  // Create an img element with a source and style
  var image = document.createElement('img');
  image.src = data.image;
  image.style.borderRadius = '10px';
  image.style.width = '100%';
  image.style.height = '67%';

  // Create an h4 element with the text 'Gymnastic'
  var heading = document.createElement('h4');
  heading.textContent = data.name;

  var text = document.createElement('p');
  text.textContent = 'Click to See Details';

  // Create an i element with a class
  var arrowIcon = document.createElement('i');
  arrowIcon.classList.add('ri-arrow-right-line');

  // Append elements to the explore card div
  exploreCard.appendChild(image);
  exploreCard.appendChild(heading);
  exploreCard.appendChild(text);

  cardArea.appendChild(exploreCard);

  exploreCard.addEventListener('click', function(){
    clicked(data.slug);
  })
  
}

function clicked(slug){
  alert(slug);
  var url = 'https://ambwslug-default-rtdb.asia-southeast1.firebasedatabase.app/posts/' + slug +'.json';

  if (!sessionStorage.getItem(slug)) {
    fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        console.log(data);
        networkDataReceived = true;
        localStorage.setItem('recently', JSON.stringify(data));
        console.log(data);
        localStorage.setItem(slug, JSON.stringify(data)); 
        window.location.href = '/detail.html'; 
      })
      .catch(function (error) {
        console.error('Fetch error:', error);
        window.location.href = '/offline.html'; 
      });
  } 
  else {
    localStorage.setItem('recently', localStorage.getItem(slug));
    window.location.href = '/detail.html';
  }

}
function updateUI(data) {
  clearCards();
  for (var i = 0; i < data.length; i++) {
    createCard(data[i]);
  }
}

var url = 'https://ambw-4cb69-default-rtdb.asia-southeast1.firebasedatabase.app/posts.json';
var networkDataReceived = false;

fetch(url)
  .then(function(res) {
    return res.json();
  })
  .then(function(data) {
    networkDataReceived = true;
    console.log('From web', data);
    var dataArray = [];
    for (var key in data) {
      dataArray.push(data[key]);
    }
    updateUI(dataArray);
  });

if ('indexedDB' in window) {
  readAllData('posts')
    .then(function(data) {
      if (!networkDataReceived) {
        console.log('From cache', data);
        updateUI(data);
      }
    });
}
