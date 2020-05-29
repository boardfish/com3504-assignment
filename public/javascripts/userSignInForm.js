/**
 * This function sends a POST request to /users/sign_in with the supplied data.
 * If this is successful, the page is reloaded.
 * @param {object} data a JS object containing fields username and password.
 */
const signIn = (data) => {
  sendAjaxQuery(
    `/users/sign_in`,
    data,
    () => {
      alert("We couldn't sign you in. Please try again.");
    },
    () => {
      window.location.reload();
      signInForm.slideUp();
    }
  );
};

const signUp = (data) => {
  sendAjaxQuery(
    `/users`,
    data,
    () => {
      alert("We couldn't sign you up. Please try again.");
    },
    () => {
      alert("You've made an account! Please re-enter your details to sign in.");
      setFormTo("logIn");
    }
  );
};

const pageHeadingToCamelCase = (headingText) =>
  headingText
    .toLowerCase()
    .split("")
    .map((char, index) => {
      return (index === (headingText.indexOf(" ") + 1) ? char.toUpperCase() : char)
    }
    )
    .join("")
    .replace(" ", "");

const setFormTo = (state) => {
  signInForm.trigger("reset");
  const currentState = pageHeadingToCamelCase(signInForm.find("h2").text());
  console.log(state, currentState)
  if (currentState === state) { return }
  if (state === "logIn" || (currentState === "signUp" && state !== currentState)) {
    $("#signUp").slideUp();
    $("#signUp").find("button").text("Log In");
    $(signInForm).find("#formToggleButton").text("Not a member?")
    $(signInForm).find("h2").text("Log In")
  } else {
    $("#signUp").slideDown();
    $("#signUp").find("button").text("Sign Up");
    $(signInForm).find("#formToggleButton").text("Already a member?")
    $(signInForm).find("h2").text("Sign Up")
  }
};

const signInForm = $("form#signIn");

signInForm.submit((e) => {
  e.preventDefault();
  var formContent = serializeToJson(signInForm);
  if (formContent.email === "" || formContent.nickname === "") {
    signIn(JSON.stringify(formContent));
  } else {
    signUp(JSON.stringify(formContent));
  }
});

$(signInForm)
  .find("#formToggleButton")
  .click((e) => {
    e.preventDefault();
    setFormTo("toggle");
  });
