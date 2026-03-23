function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

//    fetch("http://backend:5000/login", {
     fetch("http://65.1.42.5:5000/login", {
      method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("message").innerText = data.message;
    })
    .catch(error => {
        console.error("Error:", error);
    });
}
