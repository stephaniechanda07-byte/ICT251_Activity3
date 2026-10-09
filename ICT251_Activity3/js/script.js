/* ICT251 Activity 3 - js/script.js
   Features:
   1. Contact form validation and preview (compulsory)
   2. Gallery viewer (Previous / Next)
   3. Theme switch (light / dark)
   4. Study hours calculator
*/

/* ==========================================================
   1. CONTACT FORM VALIDATION AND PREVIEW
   ========================================================== */
const form = document.getElementById("contact-form");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const messageInput = document.getElementById("message");
const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const messageError = document.getElementById("message-error");
const preview = document.getElementById("preview");

// Checks email format: something@something.something (no spaces)
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Shows or clears an error message under a field
function setError(input, errorElement, message) {
  errorElement.textContent = message;
  if (message) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
}

// Validates all fields; returns true only if everything is valid
function validateForm() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const message = messageInput.value.trim();
  let valid = true;

  if (name === "") {
    setError(nameInput, nameError, "Please enter your name (spaces only is not allowed).");
    valid = false;
  } else {
    setError(nameInput, nameError, "");
  }

  if (email === "") {
    setError(emailInput, emailError, "Please enter your email address.");
    valid = false;
  } else if (!isValidEmail(email)) {
    setError(emailInput, emailError, "Please enter a valid email, e.g. name@example.com.");
    valid = false;
  } else {
    setError(emailInput, emailError, "");
  }

  if (message === "") {
    setError(messageInput, messageError, "Please enter a message (spaces only is not allowed).");
    valid = false;
  } else {
    setError(messageInput, messageError, "");
  }

  return valid;
}

// Builds a preview summary on the page using textContent (safe for user text)
function showPreview(name, email, message) {
  preview.textContent = "";

  const heading = document.createElement("h3");
  heading.textContent = "Form data validated (browser demonstration only, no message was sent)";

  const pName = document.createElement("p");
  pName.textContent = "Name: " + name;

  const pEmail = document.createElement("p");
  pEmail.textContent = "Email: " + email;

  const pMessage = document.createElement("p");
  pMessage.textContent = "Message: " + message;

  preview.append(heading, pName, pEmail, pMessage);
}

if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // keep submission local, no page reload

    if (validateForm()) {
      showPreview(
        nameInput.value.trim(),
        emailInput.value.trim(),
        messageInput.value.trim()
      );
      form.reset();
    } else {
      preview.textContent = "";
    }
  });
}

/* ==========================================================
   2. GALLERY VIEWER
   Edit the array below so it matches YOUR photos, alt text
   and captions (use the exact file names and capitalisation).
   ========================================================== */
const photos = [
  { src: "images/photo1.jpg", alt: "Photo 1 of Stephanie Chanda", caption: "My first photo" },
  { src: "images/photo2.jpg", alt: "Photo 2 of Stephanie Chanda", caption: "My second photo" },
  { src: "images/photo3.jpg", alt: "Photo 3 of Stephanie Chanda", caption: "My third photo" }
];

let currentPhoto = 0;

const galleryImage = document.getElementById("gallery-image");
const galleryCaption = document.getElementById("gallery-caption");
const prevBtn = document.getElementById("prev-photo");
const nextBtn = document.getElementById("next-photo");
const galleryCount = document.getElementById("gallery-count");

// Updates the image, alt text, caption and button states
function showPhoto(index) {
  const photo = photos[index];
  galleryImage.src = photo.src;
  galleryImage.alt = photo.alt;
  galleryCaption.textContent = photo.caption;
  if (galleryCount) {
    galleryCount.textContent = "Photo " + (index + 1) + " of " + photos.length;
  }
  // Disable buttons at the first and last photo
  prevBtn.disabled = index === 0;
  nextBtn.disabled = index === photos.length - 1;
}

if (galleryImage && galleryCaption && prevBtn && nextBtn) {
  prevBtn.addEventListener("click", function () {
    if (currentPhoto > 0) {
      currentPhoto--;
      showPhoto(currentPhoto);
    }
  });

  nextBtn.addEventListener("click", function () {
    if (currentPhoto < photos.length - 1) {
      currentPhoto++;
      showPhoto(currentPhoto);
    }
  });

  // If a photo file is missing or the name is wrong, tell the visitor
  galleryImage.addEventListener("error", function () {
    galleryCaption.textContent =
      "Photo could not load. Check the file name in the images folder.";
  });

  showPhoto(currentPhoto);
}

/* ==========================================================
   3. THEME SWITCH (light / dark)
   ========================================================== */
const themeBtn = document.getElementById("theme-toggle");

// Applies a theme and updates the button text
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  if (themeBtn) {
    themeBtn.textContent = isDark ? "Switch to Light Mode" : "Switch to Dark Mode";
    themeBtn.setAttribute("aria-pressed", String(isDark));
  }
}

if (themeBtn) {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("theme") || "light";
  } catch (e) {
    // storage not available, use light theme
  }
  applyTheme(savedTheme);

  themeBtn.addEventListener("click", function () {
    const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch (e) {
      // ignore: saving is optional
    }
  });
}

/* ==========================================================
   4. STUDY HOURS CALCULATOR
   ========================================================== */
const studyForm = document.getElementById("study-form");
const hoursInput = document.getElementById("hours");
const daysInput = document.getElementById("days");
const studyError = document.getElementById("study-error");
const studyResult = document.getElementById("study-result");

// Checks the inputs and returns an error message, or "" if all is valid
function checkStudyInputs(hoursText, daysText) {
  if (hoursText === "" || daysText === "") {
    return "Please fill in both hours per day and days per week.";
  }
  const hours = Number(hoursText);
  const days = Number(daysText);
  if (Number.isNaN(hours) || Number.isNaN(days)) {
    return "Please enter numbers only.";
  }
  if (hours < 0) {
    return "Hours per day cannot be negative.";
  }
  if (hours > 24) {
    return "Hours per day cannot be more than 24.";
  }
  if (!Number.isInteger(days) || days < 1 || days > 7) {
    return "Days per week must be a whole number from 1 to 7.";
  }
  return "";
}

// Calculates total weekly study hours and shows the result on the page
function calculateStudyHours(event) {
  event.preventDefault();
  const hoursText = hoursInput.value.trim();
  const daysText = daysInput.value.trim();
  const error = checkStudyInputs(hoursText, daysText);

  if (error) {
    studyError.textContent = error;
    studyResult.textContent = "";
    return;
  }

  studyError.textContent = "";
  const total = Number(hoursText) * Number(daysText);
  studyResult.textContent =
    "Total planned study time: " + total + " hours per week.";
}

if (studyForm) {
  studyForm.addEventListener("submit", calculateStudyHours);
}