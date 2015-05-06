//email counselor about form request
function emailCounselors() {
  
  //defult values 
  var subject = 'Merit Badge Councilor Requested';
  var ccEmail = "ryan.campione@gmail.com";
  var from = "Mountaineer Area Council";
  var aEmails = [];
  
  //establish form by id
  var form = FormApp.openById('1V5dSAVYC77KXvxK7P4N7U0_HTZ9OU7YIQmnl-BkEbgg');
  
  //establish last response
  var allResponses = form.getResponses();
  var last = allResponses.length - 1;
  var itemResponses = allResponses[last].getItemResponses();
  
  //record desired merit badge from last response
  var badge = itemResponses[6].getResponse();
  
  //establish spreadsheet
  var ss = SpreadsheetApp.openById('1G-97WcZdqg9zrEaBHBRrSpOAcllNCnd1YlbcpU4HCR0');
  
  //establish range from spreadsheet
  var mbRange = ss.getSheetByName('MB Counselors').getDataRange();
  
  //extract each merit badge from range
  var mbValues = mbRange.getValues();
  
  //iterate through all rows on sheet
  for (i=1; i < mbValues.length; i++) {
    var mbEmail = mbValues[i][1].toString().trim(); //merit badge counselor
    var mbValue = mbValues[i][5].toString().trim(); //merit badge name
    var mbPerm = mbValues[i][6].toString().trim(); //councilor's permission 
    var mbDate = mbValues[i][7].toString().trim(); //councilor's approved date
    Logger.log('Merit Badge ' + i + ': ' + mbEmail + ' / ' + mbValue + ' / ' + mbPerm + ' / ' + validDateRange(mbDate));
    
    //check if councilor is valid and willing
    if ((mbValue == badge) && (mbPerm == 'Yes') && (validDateRange(mbDate) == true)) {
      //add email to list
      aEmails.push(mbEmail);
      Logger.log("ping " + mbValue);
    }
  }
  
  //build list of all counselors' emails
  var email = aEmails[0];
  for (i=1;i<aEmails.length;i++) {
    email = email + ', ' + aEmails[i];
  }
  
  //record contact information
  var cEmail = itemResponses[4].getResponse();
  var cPhone = itemResponses[5].getResponse();
  //if phone number not provided, do not record
  if (cPhone > '') {
    cPhone = ' or by phone at ' + cPhone;
  }
    
  //build body of email
  var cName = itemResponses[0].getResponse();
  var cPos = itemResponses[1].getResponse();
  var cUnit = itemResponses[2].getResponse() + " " + itemResponses[3].getResponse();
  var comments = itemResponses[7].getResponse();
  
  //send email notification to counselor
  MailApp.sendEmail({
    to: email,
    subject: subject,
    name: from,
    replyTo: cEmail,
    cc: ccEmail,
    htmlBody: "<p>Hello, <br><br>" +
              cName + " has submitted a request for a " + badge + " merit badge counselor. Could " +
              "you please respond to the request and arrange any necessary details to " +
              "teach the merit badge. When responding, please also coordinate your " +
              "efforts with any other counselors that may also be included on this email.<br>" +
              "<br>" + cName + " can be reached at " + cEmail + cPhone + ".<br>" +
              "<br>If you have any questions or concerns about this request, please contact the " +
              "Scout Office at {email address} or by phone at {phone number} for assistance. " +
              "Thank you for serving as a Merit Badge Counselor. " +
              "<br><br>Sincerely,<br><i>Tony Wayne<br>MAC Advancement Committee</i></p>" +
              "<br><table border='0' style='width:100%'>" +
                "<tr><th colspan='2'> --- --- <b>Requestor's Recorded Responce</b> --- --- </th></tr>" +
                "<tr><td>Requestor's Name:</td> <td>" + cName + "</td></tr>" +
                "<tr><td>Requestor's Position:</td> <td>" + cPos + "</td></tr>" +
                "<tr><td>Requestor's Unit:</td> <td>" + cUnit + "</td></tr>" +
                "<tr><td>Merit Badge:</td> <td>" + badge + "</td></tr>" +
                "<tr><td>Comments:</td> <td>" + comments + "</td></tr>" +
              "</table>" 
  });
  Logger.log('Counselors: %s were emailed.',email);
}

//email form user after completion
function emailUser() {
  
  //establish form by id
  var form = FormApp.openById('1V5dSAVYC77KXvxK7P4N7U0_HTZ9OU7YIQmnl-BkEbgg');
  
  //establish last response
  var allResponses = form.getResponses();
  var last = allResponses.length - 1;
  var itemResponses = allResponses[last].getItemResponses();
  
  //record users email address
  var email = itemResponses[1].getResponse();
  
  //record desired merit badge from last response
  var badge = itemResponses[3].getResponse();

  //designate email subject 
  var subject = 'Confirmation: Merit Badge Councilor Request';
  
  //designate replyto email address
  var replyto = 'info@macbsa.org';
  
  //build body of email
  var cName = itemResponses[0].getResponse();
  var comments = itemResponses[4].getResponse(); 
  var body = 'Hello ' + cName + ', Your request for a ' + badge + ' merit badge counselor has been recieved and the counselor(s) have been notified. ';
  body = body + 'A counselor will contact you to make arrangements for the badge. If you do not hear from a merit badge counselor within a week, please ';
  body = body + 'reply to this email and let us know.';
  
  //send email notification to user
  MailApp.sendEmail(email,replyto,subject,body);
  Logger.log('Confirmation: %s was emailed at %s.',cName,email);
}
