let used = [];
let cards_js = [];

let currentCard = {
  question: "Math.random()",
  answer:
    "returns a floating-point, pseudo-random number in the range [0, 1) that is, from 0 (inclusive) up to but not including 1 (exclusive)",
  reference:
    "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random"
};

function showMessage(message) {
  let result = `<h3>${message}</h3>`;
  $("#message").html(result);
}

function loadDb() {
  $.ajax({
    type: "GET",
    url: "/cards",
    success: function(result) {
      cards_js = result;
      currentCard = getCard(cards_js);
    },
    failure: function(message) {
      showMessage(message);
    }
  });
}

loadDb();

let getCard = () => {
  let notUsed = true;
  while (notUsed && used.length < cards_js.length) {
    var index = Math.floor(Math.random() * cards_js.length);
    if (used.indexOf(index) === -1) {
      used.push(index);
      notUsed = false;
    }
  }
  if (used.length - 1 === cards_js.length) {
    return false;
  } else {
    return cards_js[index];
  }
};

function displayCardQuestion(data) {
  let resultElement = `<div class="display-card-question">
      <h2>${data.question}</h2>
      </div><button id="answer-button">Show Answer</button>`;

  $("#display").html(resultElement);
}

function displayCardAnswer(data) {
  let resultElement = `<div class="display-card-answer">
    <h2><a href="${data.reference}" target="_blank">${data.answer}</a></h2>
    </div><button id="next-card">Next</button>`;
  $("#answer-button").hide();
  $("#display").append(resultElement);
}

function displayEnd(data) {
  let resultElement = `<div class="end-card">You have reached the end</div>
                        <button id="start-over" onclick="location.href='start.html'">Start over</button>
                        <button id="index" onclick="location.href='summary'">Index of Cards</button>`;

  $("#display").html(resultElement);
}

function displaySummary(data) {
  let check = sessionStorage.getItem("user");
  let erase = "hidden";
  if (check) {
    erase = "";
  }
  for (i = 0; i < data.length; i++) {
    let summary = `<li><h5><a href="${data[i].reference}" target="_blank">${
      data[i].question
    }</a><button id="${
      data[i]._id
    }" class="delete ${erase}">Delete</button></h5></li>`;
    $(".cards-summary").append(summary);
  }
}

function deleteCard(id) {
  $.ajax({
    type: "DELETE",
    url: `/cards/${id}`,
    dataType: "json",
    success: () => {
      console.log("Deleted Successfully");
    },
    failure: data => {
      console.log(data.message);
    }
  });
}

$(document).on("click", ".delete", function() {
  deleteCard($(this).attr("id"));
  $(this)
    .parent()
    .remove();
});

$(document).on("click", "#start-button", function() {
  $(".start-text").hide();
  displayCardQuestion(currentCard);
});

$(document).on("click", "#answer-button", function() {
  displayCardAnswer(currentCard);
});

$(document).on("click", "#next-card", function() {
  currentCard = getCard(cards_js);
  if (currentCard) {
    displayCardQuestion(currentCard);
  } else {
    displayEnd();
  }
});

$(document).on("submit", "#new-card-form", function(e) {
  e.preventDefault();
  var newCard = {};

  newCard.question = $("#question").val();
  newCard.answer = $("#answer").val();
  newCard.reference = $("#reference").val();
  $.ajax({
    type: "POST",
    url: "/cards",
    data: JSON.stringify(newCard),
    success: () => console.log("Post Success"),
    error: data => showMessage(data),
    dataType: "json",
    contentType: "application/json"
  });
  cards_js.push(newCard);
  document.getElementById("new-card-form").reset();
});

$(document).on("click", "#summary-button", function() {
  $("#summary-button").remove();
  $(".summary-title").addClass("hidden");
  $(".summary-list").removeClass("hidden");
  $(".cards-summary").removeClass("hidden");
  displaySummary(cards_js);
});

// END
