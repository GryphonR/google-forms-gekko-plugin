ss = SpreadsheetApp.getActiveSpreadsheet();
formSheet = ss.getSheetByName("Form Responses");

function onFormSubmit() {  
  newSubmission();
}

function newSubmission(){
  var lastSubmissionRow = formSheet.getLastRow();
  var exchange = formSheet.getRange(lastSubmissionRow, 2).getValue();
  var currency = formSheet.getRange(lastSubmissionRow, 3).getValue();
  var asset = formSheet.getRange(lastSubmissionRow, 4).getValue();
  var targetSheetName = asset+':'+currency+' '+exchange;
  var targetSheet;
  
  if(ss.getSheetByName(targetSheetName)){
     addEntry(targetSheetName);
  }else{
    yourNewSheet = ss.insertSheet();
    yourNewSheet.setName(targetSheetName);
    //Initialise new sheet...
    newSheet(targetSheetName);
  }
    
}

function addEntry(targetSheet){
  targetSheet = ss.getSheetByName(targetSheet);

  var newRow = targetSheet.getLastRow()+1;
  var lastSubmissionRow = formSheet.getLastRow();
  
  targetSheet.getRange(newRow,1).setValues(formSheet.getRange(lastSubmissionRow,1).getValues());
  targetSheet.getRange(newRow,2).setValues(formSheet.getRange(lastSubmissionRow,5).getValues());
  targetSheet.getRange(newRow,3).setValues(formSheet.getRange(lastSubmissionRow,7).getValues());
  targetSheet.getRange(newRow,4).setValues(formSheet.getRange(lastSubmissionRow,6).getValues());
  targetSheet.getRange(newRow,5).setValues(formSheet.getRange(lastSubmissionRow,8).getValues());
  targetSheet.getRange(newRow,6).setValues(formSheet.getRange(lastSubmissionRow,9).getValues());
  //Latest new balance
  targetSheet.getRange(2,4).setValues(formSheet.getRange(lastSubmissionRow,9).getValues());
  //P/L calculation
  targetSheet.getRange(newRow,7).setValue('=IF(B'+newRow+' = "sell", (1-(F'+(newRow-1)+'/F'+newRow+')),)');
  
}

function newSheet(targetSheetName){
  targetSheet = ss.getSheetByName(targetSheetName);
  var lastSubmissionRow = formSheet.getLastRow();
  
  targetSheet.getRange(1,1).setValue("Pair");
  targetSheet.getRange(1,2).setValue("Exchange");
  targetSheet.getRange(1,3).setValue("Starting Balance");
  targetSheet.getRange(1,4).setValue("Latest Balance");
  targetSheet.getRange(1,5).setValue("P/L");
  targetSheet.getRange(1,6).setValue("% Profitable Trades");
  
  targetSheet.getRange(4,1).setValue("Time");
  targetSheet.getRange(4,2).setValue("Action");
  targetSheet.getRange(4,3).setValue("Price");
  targetSheet.getRange(4,4).setValue("Asset");
  targetSheet.getRange(4,5).setValue("Currency");
  targetSheet.getRange(4,6).setValue("Balance");
  targetSheet.getRange(4,7).setValue("% Profit");
  
  //Fill in data from form responses sheet
  targetSheet.getRange("A2").setValue(formSheet.getRange(lastSubmissionRow, 4).getValue()+':'+formSheet.getRange(lastSubmissionRow, 3).getValue());
  targetSheet.getRange("B2").setValue(formSheet.getRange(lastSubmissionRow, 2).getValue());
  targetSheet.getRange("C2").setValue(formSheet.getRange(lastSubmissionRow, 10).getValue());
  
  //P/L formula
  targetSheet.getRange("E2").setValue("=IF((1-D2/C2) > 1, (1-D2/C2), -(1-D2/C2))");
  targetSheet.getRange("F2").setValue('=COUNTIF(G5:G1000, ">0")/COUNTIF(G5:G1000, "<>")');
  
  
  
  addEntry(targetSheetName);
  
}
