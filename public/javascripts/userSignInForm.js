const signIn = (data) => {
  sendAjaxQuery(
    `/users/sign_in`,
    data,
    () => {
      alert("We couldn't sign you in. Please try again.");
    },
    (data) => {
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
