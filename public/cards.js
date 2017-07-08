let cards_js = [
        {
          "id":"1",
          "question":"const",
          "answer": "Declares a read-only named constant",
          "example": "const id = 15",
          "reference":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Basics"
        },
        {
          "id":"2",
          "question":"var",
          "answer":"Declares a variable, optionally initializing it to a value.",
          "example":"var x = 5",
          "reference":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Basics"
        },
         {
          "id":"3",
          "question":"indexOf() method",
          "answer":"Returns the first index at which a given element can be found in the array, or -1 if it is not present.",
          "example": "var array = [2, 9, 9] array.indexOf(2) / 0  array.indexOf(7)  / -1",
          "reference":"https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Basics"
        }
 ];

let used = [];
//var cards_js = [];


/*function loadDb() {
  $.getJSON(
    "/cards",
    function (result){
      cards_js = result;
      currentCard = getCard(cards_js);
    }
  )
}  

loadDb();*/

let getCard = () => {
  let notUsed = true;
  while (notUsed && used.length < cards_js.length) {
    var index = Math.floor(Math.random() * cards_js.length);
    if (used.indexOf(index) === -1) {
      used.push(index);
      notUsed = false;
    }
  }
  if ((used.length - 1) === cards_js.length) {
    return false;
  } else {
    return cards_js[index];
  }
};

let currentCard = getCard(cards_js);
 
function displayCardQuestion(data){
  let resultElement = 
    `<div class="display-card-question">
      <h2>${data.question}</h2>
      </div><button id="answer-button">Flip It</button>`;

  $('#display').html(resultElement);
};

function displayCardAnswer(data){
  let resultElement = 
    `<div class="display-card-answer">
    <h2><a href="http://${data.reference}" target="_blank">${data.answer}</a></h2>
    </div><button id="next-card">Next</button>`;
    $('#answer-button').hide();
    $('#display').append(resultElement);
};

function displayEnd(data){
  let resultElement = `<div class="end-card">You have reached the end</div>
                        <button id="start-over" onclick="location.href='start.html'">Start over</button>
                        <button id="index" onclick="location.href='summary.html'">Index of Cards</button>`;

   $('#display').html(resultElement);  
};

function displaySummary(data){
 for (i = 0; i < data.length; i++){
  let summary = `<li>${data[i].question}<button id="${data[i]._id}" class="delete">Delete</button></li>`;
  $('.cards-summary').append(summary);
 }
}

function deleteCard(id){
  $.ajax({
    type: "DELETE",
    url: `/cards/${id}`,
    dataType: "json",
    success: () => {
      console.log("Deleted Successfully")
    }
  });
}

$(document).on('click', ".delete", function(){
  deleteCard($(this).attr("id"));
  $(this).parent().remove();
});

$(document).on('click', "#start-button", function(){
    $(".start-text").hide();
    displayCardQuestion(currentCard);
});

$(document).on('click', "#answer-button", function(){
    displayCardAnswer(currentCard);
});

$(document).on('click', "#next-card", function(){
    currentCard = getCard(cards_js);
    if (currentCard) {
      displayCardQuestion(currentCard);
    }
    else {
      displayEnd();
    }
});

$(document).on('submit', "#new-card-form", function(e){
    e.preventDefault();
    var newCard ={};

    newCard.question = $("#question").val();
    newCard.answer = $("#answer").val();
    newCard.reference = $("#reference").val();

    console.log(newCard);
    $.ajax({
      type: "POST",
      url: "/cards",
      data: JSON.stringify(newCard),
      success: () => console.log("Post Success"),
      dataType: "json",
      contentType: "application/json"
    });
    cards_js.push(newCard);
    document.getElementById("new-card-form").reset();
});

$(document).on('click', "#summary-button", function(){
  $('#summary-button').remove();
  $('.summary-title').addClass('hidden');
  $('.summary-list').removeClass('hidden');
  $('.cards-summary').removeClass('hidden');
  displaySummary(cards_js);
});
