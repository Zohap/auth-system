const signupForm = document.querySelector("#signupForm");

if (signupForm) {

    signupForm.addEventListener("submit", function (e) {

        const username = document.querySelector("#username").value.trim();

        const email = document.querySelector("#email").value.trim();

        const password = document.querySelector("#password").value;

        if (!username || !email || !password) {

            e.preventDefault();

            alert("All fields are required.");

            return;

        }

        if (password.length < 8) {

            e.preventDefault();

            alert("Password must be at least 8 characters.");

            return;

        }

    });

}

const loginForm = document.querySelector("#loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (e) {

        const username = document.querySelector("#username").value.trim();

        const password = document.querySelector("#password").value;

        if (!username || !password) {

            e.preventDefault();

            alert("Please fill all fields.");

        }

    });

}