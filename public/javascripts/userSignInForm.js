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

const signInForm = $("form#signIn");

signInForm.submit((e) => {
  e.preventDefault();
  signIn(JSON.stringify(serializeToJson(signInForm)));
});
