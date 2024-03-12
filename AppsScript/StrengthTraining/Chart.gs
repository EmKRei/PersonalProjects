function buildDataTable() {
  var sheet = getDataSheet();
  var dataRange = sheet.getDataRange();

  var dt = Charts.newDataTable();
  dt.addColumn(Charts.ColumnType['STRING'], 'Category');
  dt.addColumn(Charts.ColumnType['DATE'], 'Date');
  dt.addColumn(Charts.ColumnType['NUMBER'], 'Sets')
  dt.addColumn(Charts.ColumnType['NUMBER'], 'Reps');
  dt.addColumn(Charts.ColumnType['NUMBER'], 'Pounds');

  for (var i = HEADER_COUNT + 1; i <= dataRange.getNumRows(); i++) {
    var category = getCellValue(dataRange, i, CATEGORY);
    if (category != null) {
      dt.addRow([
        getCellValue(dataRange, i, CATEGORY),
        getCellValue(dataRange, i, DATE),
        getCellValue(dataRange, i, SETS) ?? SETS_DEFAULT,
        getCellValue(dataRange, i, REPS) ?? REPS_MINIMUM,
        getCellValue(dataRange, i, POUNDS) ?? 0
      ]);
    }
  }

  return dt;
}

function getChartSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CHART_SHEET);
  if (sheet == null) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet();
    sheet.setName(CHART_SHEET);
  }
  return sheet;
}

function refreshChart() {
  var dataSheet = getDataSheet();
  var entireRange = dataSheet.getActiveRange();
  var dataRange = dataSheet.getRange((HEADER_COUNT + 1) + ':' + entireRange.getNumRows());

  var chartSheet = getChartSheet();

  var chart = chartSheet.newChart()
    .setChartType(Charts.ChartType.SCATTER)
    .setPosition(1, 1, 0, 0)
    .addRange(dataRange)
    .build();

  chartSheet.insertChart(chart);
}