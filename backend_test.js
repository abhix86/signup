// Initializing the buttons to variable

const signUpBttn = document.getElementById('sign-up')
const signInBttn = document.getElementById('sign-in')
const deleteBttn = document.getElementById('del')


const errorDiv = document.getElementById("error-msg");

const inputs = [
  { id: "name", name: "Name", minLength: 4 },
  { id: "email", name: "Email", minLength: 4 },
  { id: "psswd", name: "Password", minLength: 4 }
];
let hasRun = '';

function showMessage(type, message, isHtml = false) {
  errorDiv.classList.remove("error", "success", "warning");
  errorDiv.classList.add(type);
  errorDiv.style.display = "block";
  if (isHtml) {
    errorDiv.innerHTML = message;
  } else {
    errorDiv.textContent = message;
  }
}

signInBttn.addEventListener('click', () => {
  showMessage("error", "Oopsie: No API endpoint found for sign-in!");
});
deleteBttn.addEventListener('click', () => {
  showMessage("error", "Oopsie: No API endpoint found for delete-account!");
});




signUpBttn.addEventListener("click", () => {
  let hasError = false;
  errorDiv.style.display = "none";

  const userData = {};

  for (let input of inputs) {
    const value = document.getElementById(input.id).value.trim();

    if (!value) {
      showMessage("error", `${input.name} cannot be empty`);
      hasError = true;
      break;
    }

    if (value.length < input.minLength) {
      showMessage("error", `${input.name} must be at least ${input.minLength} characters`);
      hasError = true;
      break;
    }

    userData[input.id] = value;
  }

  if (!hasError) {
    fetch("https://signup-backend-4934.onrender.com/api/v1/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.psswd
      })
    })
      .then(async (res) => {
        const responseData = await res.json().catch(() => ({}));

        if (res.status === 409) {
          showMessage("warning", "User already exists");
          throw new Error("Conflict: user already exists");
        }

        if (!res.ok) {
          throw new Error(responseData.message || "Something went wrong with the request");
        }

        return responseData;
      })
      .then((data) => {
        if (!data || !data.data || !data.data.user) {
          throw new Error("Invalid server response");
        }

        console.log("Response received:", data);

        showMessage(
          "success",
          data.message ||
            'User created successfully <br> click <a href="https://signup-backend-4934.onrender.com/api/v1/auth/users/response.json" target="_blank">here</a>',
          true
        );
      })
      .catch((err) => {
        if (!errorDiv.textContent.includes("User already exists")) {
          showMessage("error", err.message);
        }
      });
  } else {
    errorDiv.style.display = "block";
  }
});




// status: Update every 6 seconds... only if there's any change from backend

let lastStatus = null;

function statusCheck() {
  const statusDisplayIcon = document.querySelector('.st_icon');
  const statusDisplayText = document.querySelector('.st_txt');

  fetch('https://signup-backend-4934.onrender.com/')
    .then(res => {
      let newStatus = res.ok ? 'online' : 'offline';

      if (newStatus !== lastStatus) {
        statusDisplayText.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
        statusDisplayIcon.className = `st_icon ${newStatus}`;
        lastStatus = newStatus;
        console.log(`Status changed to ${newStatus} at:`, new Date().toLocaleString());
      }
    })
    .catch(error => {
      const newStatus = 'error';
      if (newStatus !== lastStatus) {
        statusDisplayText.textContent = "Error";
        statusDisplayIcon.className = `st_icon ${newStatus}`;
        lastStatus = newStatus;
        console.error("Failed to connect:", error);
      }
    });
}



statusCheck();
setInterval(statusCheck, 10000);

