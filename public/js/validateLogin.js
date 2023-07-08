//walidacja emaila przy logowaniu
function InvalidMsg(textbox) {
  if (textbox.value === "") {
    textbox.setCustomValidity("Entering an email-id is necessary!");
  } else if (textbox.validity.typeMismatch) {
    textbox.setCustomValidity("Please enter an email address which is valid!");
  } else {
    textbox.setCustomValidity("");
  }

  return true;
}
