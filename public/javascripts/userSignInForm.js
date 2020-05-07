const signIn = (data) => {
  sendAjaxQuery(
    `/users/sign_in`,
    data,
    () => {
      alert("We couldn't sign you in. Please try again.");
    },
    (data) => {
      console.log(data);
      localStorage.setItem("id", data.id);
      localStorage.setItem("username", data.username);
      localStorage.setItem("token", data.token);
      signInForm.slideUp();
    }
  );
};

const signInForm = $("form#signIn");

signInForm.submit((e) => {
  e.preventDefault();
  signIn(JSON.stringify(serializeToJson(signInForm)));
});
