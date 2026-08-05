const button = document.querySelector("#loginButton");
const email = document.querySelector("#email_field");
const password = document.querySelector("#password_field");

button.addEventListener("click", e => {
  e.preventDefault();
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
        const home = window.HOME_POR_ROL[json.data.rol] ?? "dashboard";
        window.location.href = "/" + home;
      } else {
        alert("Credenciales incorrectas.");
      }
    })
    .catch(() => alert("No se pudo conectar con el servidor."));
});