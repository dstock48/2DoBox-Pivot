// var cardArray = [];

getFromStorage();

function createCardArray() {
  var cardArray = localStorage.getItem('cardlist') || '[]'
}

function addCard() {
  var title = $('.title-input').val();
  var body = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, body, uniqueID);
  createCardArray();
  clearInputs();
  cardArray.push(card);
  stringifyArray();

}

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
}

function Card(title, body, uniqueID) {
  this.title = title;
  this.body = body;
  this.uniqueID = uniqueID;
  this.qualityArray = ['swill', 'plausible', 'genius'];
  this.quality = this.qualityArray[0]; // TODO: change index 0 to qualityCount
  this.qualityCount = 0;
}

function stringifyArray() {
  createCardArray();
  cardArrayStringify = JSON.stringify(cardArray);
  sendToStorage(cardArrayStringify);
}

function sendToStorage(array) {
  var tempStore = localStorage.setItem('cardlist', array);
  getFromStorage();
}

function getFromStorage() {
  var storageList = localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  createCardArray();
  if (localStorage.length > 0) {
    cardArray = parsedCardList;
    prependCards(parsedCardList);
  }
}

function prependCards(array) {
  var cardContainer = $('.card-container');
  cardContainer.html('');
  array.forEach(function(card){
  cardContainer.prepend(
    `<article class="card" id=${card.uniqueID}>
      <h3 class="card-title" contenteditable="true">${card.title}</h3>
      <button class="delete-btn card-btns"></button>
      <p class="card-body" contenteditable="true">${card.body}</p>
      <button class="up-vote card-btns"></button>
      <button class="down-vote card-btns"></button>
      <h5>quality: <span class="quality">${card.quality}</h5></span>
    </article>`
  )}
)}

function deleteCard() {
  createCardArray();
  var cardID = parseInt($(this).closest('article').attr('id'));
  $(this).closest('article').remove();
  cardArray.forEach(function(card, index) {
    if (cardID == card.uniqueID) {
      cardArray.splice(index, 1);
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray));
  })
}

function filterMatches() {
  var searchInput = $(this).val().toLowerCase();
  $('.card').each(function() {
    var cardText = $(this).text().toLowerCase();
    if (cardText.indexOf(searchInput) != -1) {
      $(this).parent().show();
    } else {
      $(this).parent().hide();
    }
  })
}

function enterSubmit(event) {
  if (event.keyCode === 13) {
    $('.submit-btn').click();
  }
}

function editCardText(event) {
  var cardTitle = $(this).find('h3').text();
  var cardBody = $(this).find('p').text();
  var cardIdString = $(this).attr('id');
  var cardId = parseInt(cardIdString);
  var storageList = localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  createCardArray();
  cardArray.forEach(function(card) {
    if (cardId == card.uniqueID && event.target.className == 'card-body') {
      card.body = cardBody;
    } else if (cardId == card.uniqueID && event.target.className == 'card-title') {
      card.title = cardTitle;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray))
  })
}

$('.submit-btn').on('click', addCard);

$('.card-container').on('click', '.delete-btn', deleteCard)

$('.search-input').on('input', filterMatches)

$('input').on('keyup', enterSubmit)

$('.card-container').on('focusout', '.card', editCardText);

// Upvote WIP

// $('.card-container').on('click', '.up-vote', function() {
//   console.log('this', this);
//   var qualityText = $(this).siblings('h5').children('.quality').text();
//   console.log('qualitytext',qualityText);
//   var id = $(this).closest('.idea-card').attr('id');
//   var card = $(this).closest('.idea-card');  // Review with James
//   console.log('card', card); // Review with James
//   var quality = ['swill', 'plausible', 'genius']
//   for(var i = 0; i < quality.length; i++) {
//     if (qualityArray[i] == qualityText) {
//       qualityText = quality[i += 1];
//       $(this).siblings('h5').children('.quality').text(qualityText);
//     }
//   }
// })
