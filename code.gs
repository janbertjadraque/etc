const updateDateColumnName = "updated_at";

function getTable(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const table = spreadsheet.getSheetByName(sheetName);
  return table;
}

function createTodo(content) {
  const table = getTable("Todo");

  const now = new Date();
  // [ id	content	created_at	updated_at ]
  const newRow = [
    Utilities.getUuid(),
    content,
    now.toISOString(),
    now.toISOString(),
  ];

  table.appendRow(newRow);
}

function getTodoData() {
  const table = getTable("Todo");
  const dataRange = table.getDataRange();
  const data = dataRange.getValues();

  return data;
}

function getRowIndexFromColumnValue(idColumnIndex, idValue) {
  var data = getTodoData();
  var rowIndex = -1;
  for (var i = 1; i < data.length; i++) {
    if (data[i][idColumnIndex] == idValue) {
      rowIndex = i;
      break;
    }
  }
  return rowIndex;
}

function getRowByColumnValue(columnValue, columnName) {
  var data = getTodoData();

  var columnIndex = data[0].indexOf(columnName);
  if (columnIndex === -1) {
    return "ID column not found";
  }

  var rowIndex = getRowIndexFromColumnValue(columnIndex, columnValue);

  if (rowIndex != -1) {
    return data[rowIndex];
  } else {
    return "ID not found";
  }
}

function updateCellValueById(idValue, idColumnName, columnToUpdate, newValue) {
  var table = getTable("Todo");
  var data = getTodoData();
  // Get the index of the ID column and the column to update
  const idColumnIndex = data[0].indexOf(idColumnName);
  const updateColumnIndex = data[0].indexOf(columnToUpdate);
  const updateDateColumnIndex = data[0].indexOf(updateDateColumnName);

  var rowIndex = getRowIndexFromColumnValue(idColumnIndex, idValue, data);

  // If the ID was found, update the cell value
  if (rowIndex != -1) {
    table.getRange(rowIndex + 1, updateColumnIndex + 1).setValue(newValue);
    table
      .getRange(rowIndex + 1, updateDateColumnIndex + 1)
      .setValue(new Date().toISOString());
    return "Value updated successfully";
  } else {
    return "ID not found";
  }
}

function getTodo(id) {
  return getRowByColumnValue(id, "id");
}

function updateTodo(id, value) {
  const result = updateCellValueById(id, "id", "content", value);

  return result;
}

function testDrive1() {
  const table = getTable("Email");
  const dataRange = table.getDataRange();
  const data = dataRange.getValues();

  const headers = data[0];

  const nameIndex = headers.indexOf("Name");
  const fileIndex = headers.indexOf("Files");
  const titleIndex = headers.indexOf("Title");
  const messageIndex = headers.indexOf("Message");
  const emailIndex = headers.indexOf("Email");

  data.shift();
  for (index in data) {
    let nameDraft = data[index][nameIndex];
    let fileDraft = data[index][fileIndex].split(",");
    let titleDraft = data[index][titleIndex] + " - " + nameDraft;
    let messageDraft = data[index][messageIndex];
    messageDraft = messageDraft.toString().replace("{{Name}}", nameDraft);

    let emailDraft = data[index][emailIndex].split(",");

    let attachments = fileDraft
      .map((fileName) => {
        let files = DriveApp.getFilesByName(fileName.trim());

        if (!files.hasNext()) {
          console.log("No file of such name:[" + fileName.trim() + "]");
          return "No such file";
        }
        const file = files.next();
        return file.getBlob();
      })
      .filter((fileBlob) => fileBlob !== "No such file");

    console.log(nameDraft, fileDraft, titleDraft, messageDraft, emailDraft);

    emailDraft.forEach((email) => {
      GmailApp.sendEmail(email.trim(), titleDraft, messageDraft, {
        attachments: attachments,
      });
    });

    console.log("finished successfully");
  }
}
