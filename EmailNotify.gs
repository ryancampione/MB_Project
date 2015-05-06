//email counselor about form request
function emailConfirmation() {

  //establish form by id
  var form = FormApp.openById('14XftKcdP_zCkFy9Zca5N2fm3cHYuaAesO0EWOUp4f8U');
    
  //establish last response
  var allResponses = form.getResponses();
  var last = allResponses.length - 1;
  var itemResponses = allResponses[last].getItemResponses();
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    Logger.log('Response #%s to the question "%s" was "%s"', (i).toString(), itemResponse.getItem().getTitle(), itemResponse.getResponse());
  }
  
  //record item responses
  var name = itemResponses[0].getResponse();
  var email = itemResponses[1].getResponse();
  var phone = itemResponses[2].getResponse();
  var unit = itemResponses[3].getResponse();
  var unitNum = itemResponses[4].getResponse();
  var help = itemResponses[5].getResponse();
  
  //record mb responses as array
  var mb = itemResponses[6].getResponse().toString();
  mbList = mb.split(',');
  
  //default email values
  var ccEmail = "ryan.campione@gmail.com";
  var from = "Mountaineer Area Council";
  
  //pull html email template
  var html = HtmlService.createHtmlOutputFromFile('AppConfirmation');  
  
  //send email
  MailApp.sendEmail({
    to: email,
    subject: "Merit Badge Counselor Application Confirmation",
    name: name,
    replyTo: from,
    cc: ccEmail,
    htmlBody: "Hello " + name + ", <br>" + html.getContent() +
              "<br><table border='0' style='width:100%'>" +
                "<tr><th colspan='2'> --- --- <b>Requestor's Recorded Responce</b> --- --- </th></tr>" +
                "<tr><td>Name:</td> <td>" + name + "</td></tr>" +
                "<tr><td>Email:</td> <td>" + email + "</td></tr>" +
                "<tr><td>Phone:</td> <td>" + phone + "</td></tr>" +
                "<tr><td>Merit Badge(s):</td> <td>" + mb + "</td></tr>" +
                "<tr><td>Unit:</td> <td>" + unit + " " + unitNum + "</td></tr>" +
                "<tr><td>Willing to help other Units?:</td> <td>" + help + "</td></tr>" +
              "</table>"
  });
  Logger.log('Request: %s was emailed.',email);
}
