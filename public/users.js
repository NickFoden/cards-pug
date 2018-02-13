function showMessage(message) {
  console.log(message);
  let result = `<h3>${message}</h3>`;
  $("#message").html(result);
}

$(document).on("submit", "#new-user-form", function(e) {
  e.preventDefault();
  var newUser = {};

  newUser.username = $("#username").val();
  newUser.password = $("#password").val();
  $.ajax({
    type: "POST",
    url: "/users",
    data: JSON.stringify(newUser),
    success: () => (window.location.href = "/login"),
    error: data => showMessage(data.responseJSON.message),
    dataType: "json",
    contentType: "application/json"
  });
  document.getElementById("new-user-form").reset();
});
