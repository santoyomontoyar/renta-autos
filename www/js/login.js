const button = document.querySelector("#loginButton");
const email = document.querySelector("#email_field");
const password = document.querySelector("#password_field");

button.addEventListener("click", e => {
  e.preventDefault()
  fetch("php/user.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: email.value,
      password: password.value,
      action: "login"
    })
  }).then(res => res.json())
    .then(json => {
      if (json.status === "success") {
        localStorage.setItem("user", JSON.stringify(json.data))
        window.location.href = "users"
      }
    })
})
