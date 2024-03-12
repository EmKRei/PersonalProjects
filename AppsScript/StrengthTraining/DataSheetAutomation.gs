/// Google Apps Script support for Strength Training sheet.
/// Includes functions for filling in blanks based on previous data
/// or defaults and related helpers.

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
  var sheet = getDataSheet();
  var dataRange = sheet.getDataRange();

  fillDateFromEnd(dataRange, getCurrentDateString());
  fillDefaultsFrom(dataRange, HEADER_COUNT);

  moveDrawings(sheet, dataRange.getNumRows() + ROW_BUTTON_BUFFER);
}

// from the end, fill blanks with current date, and fill defaults for
// all of today's rows. also update button (drawing) locations to 
// after data range.
function fillDefaultsFromEnd() {
  var sheet = getDataSheet();
  var dataRange = sheet.getDataRange();
  var dateString = getCurrentDateString();

  var rowChecked = fillDateFromEnd(dataRange, dateString);
  while (getCellDateString(dataRange, rowChecked) == dateString) {
    rowChecked--;
  }

  fillDefaultsFrom(dataRange, rowChecked);
  moveDrawings(sheet, dataRange.getNumRows() + ROW_BUTTON_BUFFER);
}
