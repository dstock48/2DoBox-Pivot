var uniqueID;
var cardArray = [];


fromStorage();

$('.submit-btn').on('click', function(){
  addCard();
});

function addCard() {
  var title = $('.title-input').val();
  var body = $('.body-input').val();
  var uniqueID = Date.now();
  var card = new Card(title, body, uniqueID);
  $('.title-input').val("");
  $('.body-input').val("");
}

function Card(title, body, uniqueID) {
  this.title = title;
  this.body = body;
  this.uniqueID = uniqueID;
  this.qualityArray = ['swill', 'plausible', 'genius']
  this.quality = this.qualityArray[0];
  cardArray.push(this);
  qualityCount = 0;
  stringifyArray();
}

function stringifyArray() {
  cardArrayStringify = JSON.stringify(cardArray);
  toStorage(cardArrayStringify);
}

function toStorage(array) {
  var tempStore = localStorage.setItem( "cardlist",array);
  fromStorage();
}

function fromStorage() {
  var storageList = localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  if (localStorage.length > 0) {
  cardArray = parsedCardList;
  prependCards(parsedCardList);
}}


function prependCards(array) {
  var cardContainer = $('.card-container');
  cardContainer.html('');
  array.forEach(function(card){
  cardContainer.prepend(
      `<article class="card" id=${card.uniqueID}>
        <div class="text">
          <h3 class="card-title" contenteditable="true">${card.title}</h3>
          <button class="delete-btn card-btns"></button>
          <p class="card-body" contenteditable="true">${card.body}</p>
        </div>
        <button class="up-vote card-btns"></button>
        <button class="down-vote card-btns"></button>
        <h5>quality: <span class="quality">${card.quality}</h5></span>
      </article>`
  )})}

// Delete buttons

$('.card-container').on('click', '.delete-btn', function() {
  var uniqueCardIdtoParse = $(this).closest('article').attr('id');
  var uniqueCardId = parseInt(uniqueCardIdtoParse)
  $(this).closest('article').remove();
  deleteCardLocal(uniqueCardId);
})

function deleteCardLocal(uniqueCardId) {
  var cardID = uniqueCardId
  cardArray.forEach(function(card, index) {
    if(cardID == card.uniqueID) {
      cardArray.splice(index, 1)
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
}

$('.search-input').on('keyup', function() {
    var searchInput = $(this).val().toLowerCase();
    $('.text').each(function() {
      var cardText = $(this).text().toLowerCase();
      if (cardText.indexOf(searchInput) != -1) {
        $(this).parent().show();
      } else {
        $(this).parent().hide();
      }
    })

})

$('input').on('keyup', function(event){
  if (event.keyCode === 13) {
    $('.submit-btn').click();
  }
})

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

$('.card').on('focusout', function() {
  var titleText = $(this).find('h3').text()
  var cardIdString = $(this).attr('id')
  var cardId = parseInt(cardIdString)
  var storageList = localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  $(parsedCardList)
  cardArray.forEach(function(card, index) {
    if (cardId == card.uniqueID) {
      card.title = titleText;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
});

$('.card').on('focusout', function() {
  var bodyText = $(this).find('p').text()
  var cardIdString = $(this).attr('id')
  var cardId = parseInt(cardIdString)
  var storageList =localStorage.getItem("cardlist");
  var parsedCardList = JSON.parse(storageList);
  cardArray.forEach(function(card, index) {
    if (cardId == card.uniqueID) {
      card.body = bodyText;
    }
    localStorage.setItem('cardlist', JSON.stringify(cardArray) )
  })
})
