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

// Membuat elemen container div
var containerDiv = document.createElement("div");
containerDiv.classList.add("col-md-3");

// Membuat elemen box div
var boxDiv = document.createElement("div");
boxDiv.classList.add("box");

// Membuat elemen gambar (img)
var imgElement = document.createElement("img");
imgElement.src = data.image

// Membuat elemen title div
var titleDiv = document.createElement("div");
titleDiv.classList.add("title");
titleDiv.style.textAlign = "center";
titleDiv.style.marginTop = "10px";
titleDiv.innerText = data.name;

// Menyusun elemen-elemen menjadi struktur yang diinginkan
boxDiv.appendChild(imgElement);
boxDiv.appendChild(titleDiv);
containerDiv.appendChild(boxDiv);

// Menyisipkan elemen container ke dalam body dokumen

cardArea.appendChild(containerDiv);

containerDiv.addEventListener('click', function(){
  fetch(url)
  .then(function (){
    localStorage.setItem('clicked',JSON.stringify(data));
    localStorage.setItem(JSON.parse(JSON.stringify(data)).id,JSON.stringify(data));
    window.location.href = '/detail.html';
  })
  .catch(function (error){
    localStorage.setItem('off',JSON.stringify(data));
    var listKey = Object.keys(localStorage);

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

function clicked(slug){
  // var url = 'https://ambwslug-default-rtdb.asia-southeast1.firebasedatabase.app/posts/' + slug +'.json';
  // fetch(url)
  //     .then(function (res) {
  //       return res.json();
  //     })
  //     .then(function (data) {
  //       localStorage.setItem('recent',JSON.stringify(data));
  //       var arr = [];
  //       arr.push(data.slug);
  //     })
  //     .catch(function (error) {
  //             console.error('Fetch error:', error);
  //             window.location.href = '/offline.html'; 
  //     });


  // if (!sessionStorage.getItem(slug)) {
  //   fetch(url)
  //     .then(function (res) {
  //       return res.json();
  //     })
  //     .then(function (data) {
  //       console.log(data);
  //       networkDataReceived = true;
  //       localStorage.setItem('recently', JSON.stringify(data));
  //       console.log(data);
  //       localStorage.setItem(slug, JSON.stringify(data)); 
  //       window.location.href = '/detail.html'; 
  //     })
  //     .catch(function (error) {
  //       console.error('Fetch error:', error);
  //       window.location.href = '/offline.html'; 
  //     });
  // } 
  // else {
  //   localStorage.setItem('recently', localStorage.getItem(slug));
  //   window.location.href = '/detail.html';
  // }

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
