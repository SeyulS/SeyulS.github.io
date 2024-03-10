var installButton = document.querySelector('#installation');
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

  var colDiv = document.createElement("div");
  colDiv.className = "col-md-3 mb-3";
  colDiv.style.borderWidth = "5px";
  colDiv.style.borderRadius = "5px";

  var cardDiv = document.createElement("div");
  cardDiv.className = "card mt-2 bg-dark";

  var imgElement = document.createElement("img");
  imgElement.className = "card-img-top";
  imgElement.src = data.image;
  imgElement.alt = "Card image cap";

  var titleDiv = document.createElement("h5");
  titleDiv.className = "card-title text-center mt-2 mb-2";
  titleDiv.style.color = "white";
  titleDiv.textContent = data.name;

  cardDiv.appendChild(imgElement);
  colDiv.appendChild(cardDiv);
  colDiv.appendChild(titleDiv);

  cardArea.appendChild(colDiv);
  var cards = document.getElementsByClassName('col-md-3');

  for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('mouseenter', function() {
          enlargeCard(this);
      });

      cards[i].addEventListener('mouseleave', function() {
          shrinkCard(this);
      });
  }

  cardDiv.addEventListener('click', function(){
  fetch(url)
  .then(function (){
    localStorage.setItem('clicked',JSON.stringify(data));
    localStorage.setItem(JSON.parse(JSON.stringify(data)).id,JSON.stringify(data));
    window.location.href = '/detail.html';
  })
  .catch(function (error){
    localStorage.setItem('off',JSON.stringify(data));

    var listKey = Object.keys(localStorage);
    var count = 0;
    for (var i = 0; i < listKey.length; i++) {
      var key = listKey[i];i
      if(localStorage.getItem(key) == localStorage.getItem("off")){
        count = count + 1;
      }
    }

      if (count == 1){
        console.error('Fetch error:', error);
        window.location.href = '/offline.html';
      }
      else{
        localStorage.setItem('clicked', localStorage.getItem('off'));
        window.location.href = '/detail.html';
      }
    

  })
  
})

  
}
function enlargeCard(card) {
  card.classList.add('enlarged');
}

function shrinkCard(card) {
  card.classList.remove('enlarged');
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
