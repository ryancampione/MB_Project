//update form to reflect merit badge choices from spreadsheet
function UpdateSettings() {
 
  //defult values 
  var frmItemDesc = 'Merit Badge';
  var frmItemId=-1;
  var mbList = [];
  var mbChoices = [];
  
  //establish form by id
  var form = FormApp.openById('14XftKcdP_zCkFy9Zca5N2fm3cHYuaAesO0EWOUp4f8U');
  Logger.log('Form: ' + form.getTitle()); 
  
  //gets all items inside the form
  var allItems = form.getItems();
  Logger.log('Total items in this form ' + allItems.length)
   
  //iterate through all items in form
  for (i=0; i < allItems.length; i++) {
    var itemTitle = allItems[i].getTitle();
    Logger.log('Item ' + i + ': ' + itemTitle);
    
    //find item's id by searching for the item with proper title
    if (itemTitle == frmItemDesc) {
      frmItemId = allItems[i].getId();
    }
  }
  
  //error checking in case item to edit was not found
  if (frmItemId == -1) {
    Logger.log('Error: item ' + frmItemDesc + ' not found!');
    return; 
  } 
  
  //establishing item to listItem by id
  var frmItem = form.getItemById(frmItemId).asCheckboxItem();  
  
  //establish spreadsheet
  var ss = SpreadsheetApp.openById('1G-97WcZdqg9zrEaBHBRrSpOAcllNCnd1YlbcpU4HCR0');
  Logger.log('Spreadsheet: ' + ss.getName());
  
  //establish range from spreadsheet
  var mbRange = ss.getSheetByName('Settings').getDataRange();
  
  //extract each merit badge from range
  var mbValues = mbRange.getValues();
    
  //iterate through all rows on sheet
  for (i=1; i < mbValues.length; i++) {
    var mbValue = mbValues[i][0].toString().trim(); //merit badge name
    Logger.log('Merit Badge ' + i + ': ' + mbValue );
    mbChoices.push(frmItem.createChoice(mbValue));
  }
  
  if (mbChoices.length > 1) {
    //setting the choice array to drop down item
    frmItem.setChoices(mbChoices);
  } else {
    Logger.log('Error: No merit badges found!');
  }
}
