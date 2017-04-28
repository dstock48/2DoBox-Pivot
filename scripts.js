prependCards(pendingTasks());

$('.submit-btn').on('click', addCard);

$('.card-container').on('click', '.delete-btn', deleteCard);

$('.search-input').on('input', filterMatches);

$('input, textarea').on('keydown', enterSubmit);

$('.card-container').on('focusout', '.card', editCardText);

$('.card-container').on('click', '.up-vote', changeImportance);

$('.card-container').on('click', '.down-vote', changeImportance);

$('.card-container').on('click', '.complete-btn', completeTask);

$('main').on('click', '.show-complete-btn', toggleCompleted);

$('main').on('click', '.show-all-btn', showAllTasks);

$('.button-container').on('click', '.none, .low, .normal, .high, .critical', filterImportance);

$('.button-container').on('click', '.all', filterAll);

$('.input-container').on('input', '.title-input, .body-input', updateCharacterCount);

function Card(title, body, uniqueID) {
  this.title = title;
  this.body = body;
  this.uniqueID = uniqueID;
  this.importance = 'Normal';
  this.complete = false;
}

function getFromStorage() {
  return JSON.parse(localStorage.getItem('cardlist')) || [];
}

function stringifyArray(array) {
  var cardArrayStringify = JSON.stringify(array);
  sendToStorage(cardArrayStringify);
}

function sendToStorage(array) {
  var tempStore = localStorage.setItem('cardlist', array);
  getFromStorage();
}

function addCard() {
  var cardArray = getFromStorage();
  var title = $('.title-input').val();
  var body = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, body, uniqueID);
  cardArray.push(card);
  stringifyArray(cardArray);
  clearInputs();
  resetCharacterCount();
  disableSave();
  clearCardContainer();
  $('.show-complete-btn').text('Show Completed');
  prependCards(pendingTasks());
  $('.title-input').focus();
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

function clearInputs() {
  $('.title-input').val('');
  $('.body-input').val('');
}

function clearCardContainer() {
  var cardContainer = $('.card-container');
  cardContainer.html('');
}

function disableSave() {
  var userTitle = $('.title-input').val();
  var userBody = $('.body-input').val();
  if (userTitle !== '' && userBody !== '') {
    $('.submit-btn').prop('disabled', false);
  } else {
    $('.submit-btn').prop('disabled', true);
  }
}

function prependCards(array) {
  var cardContainer = $('.card-container');
  array.forEach(function(card){
    if (card.complete === true) {
      var completeClass = 'completed';
    }
  cardContainer.prepend(
    `<article class="card ${completeClass}" id=${card.uniqueID}>
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
  );}
);
  $('article:visible').slice(10).hide();
}

function completeTask() {
  var cardArray = getFromStorage();
  var cardID = parseInt($(this).closest('article').attr('id'));
  $(this).closest('.card').toggleClass('completed');
  cardArray.forEach(function(card) {
    if (cardID == card.uniqueID) {
      card.complete = !card.complete;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray));
  });
}

function deleteCard() {
  var cardArray = getFromStorage();
  var cardID = parseInt($(this).closest('article').attr('id'));
  $(this).closest('article').remove();
  cardArray.forEach(function(card, index) {
    if (cardID == card.uniqueID) {
      cardArray.splice(index, 1);
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray));
  });
}

function editCardText(event) {
  var cardTitle = $(this).find('h3').text();
  var cardBody = $(this).find('p').text();
  var cardIdString = $(this).attr('id');
  var cardId = parseInt(cardIdString);
  var cardArray = getFromStorage();
  cardArray.forEach(function(card) {
    if (cardId == card.uniqueID && event.target.className == 'card-body') {
      card.body = cardBody;
    } else if (cardId == card.uniqueID && event.target.className == 'card-title') {
      card.title = cardTitle;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray));
  });
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
  });
}

function filterImportance() {
  var filterName = $(this).text().toLowerCase();
  $('.card').each(function() {
    var cardText = $(this).text().toLowerCase();
    if (cardText.indexOf(filterName) != -1) {
      $(this).show();
    } else {
      $(this).hide();
    }
  });
}

function filterAll() {
  $('.show-complete-btn').text('Show Completed');
  clearCardContainer();
  prependCards(pendingTasks());
}

function showAllTasks() {
  $('.show-all-btn').hide();
  $('article').show();
}

function toggleCompleted() {
  var cardArray = getFromStorage();
  switch (cardArray.length > $('.card-container').children().length) {
    case true:
      $('.show-complete-btn').text('Hide Completed');
      clearCardContainer();
      prependCards(pendingTasks());
      prependCards(completedTasks());
      break;
    case false:
    $('.show-complete-btn').text('Show Completed');
      clearCardContainer();
      prependCards(pendingTasks());
      break;
    default:
  }
}

function completedTasks() {
  var cardArray = getFromStorage();
  var completeTasksArray = cardArray.filter(function(card) {
    return card.complete;
  });
  return completeTasksArray;
}

function pendingTasks() {
  var cardArray = getFromStorage();
  var pendingArray = cardArray.filter(function(card) {
    return !card.complete;
  });
  return pendingArray;
}

function changeImportance() {
  var button = $(this).prop('class');
  var cardID = $(this).closest('.card').attr('id');
  var importanceArray = ['None', 'Low', 'Normal', 'High', 'Critical'];
  var currentImportance = $(this).parent().find('.importance').text();
  var newImportance;
  switch (button) {
    case 'up-vote card-btns':
      newImportance = importanceArray[importanceArray.indexOf(currentImportance) + 1] || currentImportance;
      break;
    case 'down-vote card-btns':
      newImportance = importanceArray[importanceArray.indexOf(currentImportance) - 1] || currentImportance;
      break;
    default:
  }
  updateCardDisplay($(this).parent().find('.importance'), newImportance);
  updateCardObject(cardID, 'importance', newImportance);
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

function updateCharacterCount() {
  var className = $(this).prop('class');
  if (className === 'title-input') {
    $('.title-counter').text($(this).val().length);
  }
  if (className === 'body-input') {
    $('.body-counter').text($(this).val().length);
  }
}

function resetCharacterCount() {
  $('.title-counter').text('0');
  $('.body-counter').text('0');
}
