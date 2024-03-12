/// Utility Functions for Strength Training sheet automation

function getDataSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(DATA_SHEET);
}

function getDataRange() {
  getDataSheet().getDataRange();
}

function getDateCell(range, row) {
  return range.getCell(row, DATE);
}

function getCategoryCell(range, row) {
  return range.getCell(row, CATEGORY);
}

function getSetsCell(range, row) {
  return range.getCell(row, SETS);
}

function getCellValue(range, row, col) {
  var cell = range.getCell(row, col);
  return cell.isBlank() ? null : cell.getValue();
}

function getCurrentDateString() {
  return Utilities.formatDate(new Date(), TIMEZONE_STRING, DATE_FORMAT);
}

// get the string in the date cell of the given row
function getCellDateString(dataRange, row) {
  var cell = getDateCell(dataRange, row);
  return cell.isBlank()
    ? ''
    : Utilities.formatDate(cell.getValue(), TIMEZONE_STRING, DATE_FORMAT);
}