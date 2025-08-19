/*     async function testApi() {
      try {
        const res = await fetch("http://localhost:5500/api/v1/auth/sign-up");
        const data = await res.json();

        // Pretty-print JSON to <pre>
        document.getElementById("output").textContent =
          JSON.stringify(data, null, 2);
      } catch (err) {
        document.getElementById("output").textContent =
          "Error: " + err.message;
      }
    }

    testApi(); */

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

signUpBttn.addEventListener("click", () => {
  let hasError = false;
  errorDiv.style.display = "none"; 
  errorDiv.textContent = "";       

  const userData = {};

  for (let input of inputs) {
    const value = document.getElementById(input.id).value.trim();

    if (!value) {
      errorDiv.textContent = `${input.name} cannot be empty`;
      hasError = true;
      break;
    }

    if (value.length < input.minLength) {
      errorDiv.textContent = `${input.name} must be at least ${input.minLength} characters`;
      hasError = true;
      break;
    }

    userData[input.id] = value;
  }
  let anew = userData.name
  console.log(JSON.stringify(anew))

  if (!hasError) {
    fetch("http://localhost:5500/api/v1/auth/sign-up", {
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
        console.warn("Conflict:", responseData);
        errorDiv.style.cssText = "color: #ff9800; background-color: #fff4e5; border: 1px solid #ffd699; display: block;";
        errorDiv.textContent = "User already exists";
        throw new Error("Conflict: user already exists");
      }

      if (!res.ok) {
        console.error("HTTP Error:", res.status, responseData);
        throw new Error(responseData.message || "Something went wrong with the request");
      }

      return responseData;
    })
    .then((data) => {
      if (!data || !data.data || !data.data.user) {
        console.error("Invalid server response:", data);
        throw new Error("Invalid server response");
      }

      const userId = data.data.user._id;

      console.log("Response received:", data);

      window.open('http://localhost:5500/api/v1/auth/users/json', '_blank');

      errorDiv.style.cssText = "color: #2deb14; background-color: #c8f3c8af; border: 1px solid #c6f5c8; display: block;";
      errorDiv.textContent = data.message || "User created successfully";

      localStorage.setItem(userId, JSON.stringify(data.data.user));
    })
    .catch((err) => {
      console.error("Error:", err);
      if (!errorDiv.textContent.includes("User already exists")) {
        errorDiv.style.cssText = "color: #ff0000; background-color: #f8d7da; border: 1px solid #f5c2c7; display: block;";
        errorDiv.textContent = err.message;
      }
    });
  }
   else {
    errorDiv.style.display = "block"; 
  }

  hasRun = true;
});



