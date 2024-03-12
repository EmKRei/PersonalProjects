/// Google Apps Script support for Strength Training sheet.
/// Includes functions for filling in blanks based on previous data
/// or defaults and related helpers.

// Declare columns
var POUNDS = 5; // 'Pounds';
var REPS = 4; // 'Reps';
var SETS = 3; // 'Sets';
var DATE = 2; // 'Date';
var CATEGORY = 1;

var HEADER_COUNT = 1;
var ROW_BUTTON_BUFFER = 5;

var SETS_DEFAULT = 1;

function getDateCell(range, row) {
  return range.getCell(row, DATE);
}

function getCategoryCell(range, row) {
  return range.getCell(row, CATEGORY);
}

function getSetsCell(range, row) {
  return range.getCell(row, SETS);
}

function setValueIfBlank(cell, value) {
  if (cell.isBlank()) {
    cell.setValue(value);
  }
}

// starting at the end of the dataRange, fill blank date cells
// with given dateString
function fillDateFromEnd(dataRange, dateString) {
  var lastEmpty = dataRange.getNumRows();
  while (getDateCell(dataRange, lastEmpty).isBlank()) {
    getDateCell(dataRange, lastEmpty).setValue(dateString);
    lastEmpty--;
  }

  return lastEmpty;
}

// fill blank spaces in the dataRange starting at the given row.
// sets date and category cells to the most recent value (unless 
// there is a note in the category cell) and fills set cells with 
// the default value.
function fillDefaultsFrom(dataRange, startingRow) {
  var cachedDate, cachedCategory;
  for (var i = startingRow; i <= dataRange.getNumRows(); i++) {
    var dateCell = getDateCell(dataRange, i);
    if (!dateCell.isBlank()) {
      cachedDate = dateCell.getValue();
    } else if (cachedDate != null) {
      dateCell.setValue(cachedDate);
    }
  
    var categoryCell = getCategoryCell(dataRange, i);
    if (!categoryCell.isBlank()) {
      cachedCategory = categoryCell.getValue();
    } if (categoryCell.getNote()) {
      // when there's a note, it may indicate a new category
      // so do not autofill it or the next one(s)
      cachedCategory = null;
    } else if (cachedCategory != null){
      categoryCell.setValue(cachedCategory);
    }

    setValueIfBlank(getSetsCell(dataRange, i), SETS_DEFAULT);
  }
}

function getCurrentDateString() {
  return Utilities.formatDate(new Date(), 'GMT-6', 'M/d/yyyy');
}

// get the string in the date cell of the given row
function getCellDateString(dataRange, row) {
  var cell = getDateCell(dataRange, row);
  return cell.isBlank()
    ? ''
    : Utilities.formatDate(cell.getValue(), 'GMT-6', cell.getNumberFormat());
}

// move all drawings in the sheet to after the data range
function moveDrawings(sheet, row){
  sheet.getDrawings().forEach(d => {
    var info = d.getContainerInfo();
    d.setPosition(row, info.getAnchorColumn(), info.getOffsetX(), info.getOffsetY());
  });
}

// fills default values in all empty cells, and update button (drawing)
// locations to after data range.
function autofillAll() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange();

  fillDateFromEnd(dataRange, getCurrentDateString());
  fillDefaultsFrom(dataRange, HEADER_COUNT);

  moveDrawings(sheet, dataRange.getNumRows() + ROW_BUTTON_BUFFER);
}

// from the end, fill blanks with current date, and fill defaults for
// all of today's rows. also update button (drawing) locations to 
// after data range.
function fillDefaultsFromEnd() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var dataRange = sheet.getDataRange();
  var dateString = getCurrentDateString();

  var rowChecked = fillDateFromEnd(dataRange, dateString);
  while (getCellDateString(dataRange, rowChecked) == dateString) {
    rowChecked--;
  }

  fillDefaultsFrom(dataRange, rowChecked);
  moveDrawings(sheet, dataRange.getNumRows() + ROW_BUTTON_BUFFER);
}
