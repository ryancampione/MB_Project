//trigger when form is opened
ScriptApp.newTrigger('updateForm')
  .timeBased()
  .everyDays(1)
  .atHour(3)
  .create();

//trigger everytime form is edited
ScriptApp.newTrigger('updateForm')
  .forForm('1V5dSAVYC77KXvxK7P4N7U0_HTZ9OU7YIQmnl-BkEbgg')
  .onOpen()
  .create();

//trigger on every submission
ScriptApp.newTrigger('emailCouncilors')
   .forForm('1V5dSAVYC77KXvxK7P4N7U0_HTZ9OU7YIQmnl-BkEbgg')
   .onFormSubmit()
   .create();
