prependCards(pendingTasks());

function getFromStorage() {
  return JSON.parse(localStorage.getItem('cardlist')) || [];
}

function addCard() {
  var title = $('.title-input').val();
  var body = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, body, uniqueID);
  var cardArray = getFromStorage();
  cardArray.push(card);
  stringifyArray(cardArray);
  clearInputs();
  disableSave();
  prependCards(cardArray);
}

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
}

function Card(title, body, uniqueID) {
  this.title = title;
  this.body = body;
  this.uniqueID = uniqueID;
  this.importance = 'Normal';
  this.complete = false;
}

function stringifyArray(array) {
  cardArrayStringify = JSON.stringify(array);
  sendToStorage(cardArrayStringify);
}

function sendToStorage(array) {
  var tempStore = localStorage.setItem('cardlist', array);
  getFromStorage();
}

function prependCards(array) {
  var cardContainer = $('.card-container');
  cardContainer.html('');
  array.forEach(function(card){
  cardContainer.prepend(
    `<article class="card" id=${card.uniqueID}>
      <div class="card-header">
        <h3 class="card-title" contenteditable="true">${card.title}</h3>
        <button class="delete-btn card-btns"></button>
        <button class="complete-btn card-btns"></button>
      </div>
      <p class="card-body" contenteditable="true">${card.body}</p>
      <div class="card-footer">
        <button class="up-vote card-btns"></button>
        <button class="down-vote card-btns"></button>
        <h5>Importance: <span class="importance">${card.importance}</h5></span>
      </div>
    </article>`
  )}
)}

function deleteCard() {
  var cardArray = getFromStorage();
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
      $(this).show();
    } else {
      $(this).hide();
    }
  })
}

function enterSubmit(event) {
  disableSave();
  var userTitle = $('.title-input').val();
  var userBody = $('.body-input').val();
  if (event.keyCode === 13 && userTitle !== '' && userBody !== '') {
    addCard();
  } else if (event.keyCode === 13) {
    return false;
  }
}

function disableSave() {
  var userTitle = $('.title-input').val();
  var userBody = $('.body-input').val();
  if (userTitle !== '' && userBody !== '') {
    $('.submit-btn').prop('disabled', false)
  } else {
    $('.submit-btn').prop('disabled', true)
  }
}

function editCardText(event) {
  var cardTitle = $(this).find('h3').text();
  var cardBody = $(this).find('p').text();
  var cardIdString = $(this).attr('id');
  var cardId = parseInt(cardIdString);
  var storageList = localStorage.getItem('cardlist');
  var parsedCardList = JSON.parse(storageList);
  var cardArray = getFromStorage();
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

$('input, textarea').on('keydown', enterSubmit)

$('.card-container').on('focusout', '.card', editCardText);

$('.card-container').on('click', '.up-vote', changeImportance);

$('.card-container').on('click', '.down-vote', changeImportance);

$('.card-container').on('click', '.complete-btn', completeTask);

function completeTask() {
  var cardArray = getFromStorage();
  var cardID = parseInt($(this).closest('article').attr('id'));
  $(this).closest('.card').toggleClass('completed');
  cardArray.forEach(function(card, index) {
    if (cardID == card.uniqueID) {
      card.complete = true;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray));
  })
}

function pendingTasks() {
  var cardArray = getFromStorage();
  var pendingArray = cardArray.filter(function(card) {
    return !card.complete
  })
  return pendingArray;
}

function changeImportance() {
  var $button = $(this).prop('class');
  var $cardID = $(this).closest('.card').attr('id');
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var $currentImportance = $(this).parent().find('.importance').text();
  switch ($button) {
    case 'up-vote card-btns':
      var newImportance = importanceArray[importanceArray.indexOf($currentImportance) + 1] || $currentImportance;
      break;
    case 'down-vote card-btns':
      var newImportance = importanceArray[importanceArray.indexOf($currentImportance) - 1] || $currentImportance;
      break;
    default:
  }
  updateCardDisplay($(this).parent().find('.importance'), newImportance);
  updateCardObject($cardID, 'importance', newImportance);
}

function updateCardDisplay(element, newValue) {
  element.text(newValue);
}

function updateCardObject(id, property, newValue) {
  var oldCardArray = JSON.parse(localStorage.getItem('cardlist'));
  var newCardArray = oldCardArray.map(function(card) {
    if (card.uniqueID == id) {
      card[property] = newValue;
    }
    return card;
  });
  localStorage.setItem('cardlist', JSON.stringify(newCardArray));
}
