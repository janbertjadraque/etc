function testCreateTodo() {
  createTodo("Buy Xiaomi pad 6s");
}

function testGetTodo() {
  const idValue = "6792727c-1bb0-442a-8d01-0932488e969d";

  const row = getTodo(idValue);

  console.log(row);
}

function testUpdateTodo() {
  const idValue = "6792727c-1bb0-442a-8d01-0932488e969d";
  const newValue = "Make pingping sleep faster";

  const result = updateTodo(idValue, newValue);

  console.log(result);
}

function testEmail() {
  // Replace with your desired email address
  var recipientEmail = "janbertw@gmail.com";
  var subject = "Email with Attachment";
  var body = "This is an email with an attachment.";

  // Get the ID of the file you want to attach
  var fileIds = ["1XEdAi25jrswGTnszA21VFYh9o6ZKxcSy"]; // Replace with actual file IDs from Google Drive

  var attachments = fileIds.map(function (id) {
    return DriveApp.getFileById(id).getBlob();
  });

  // Send the email
  GmailApp.sendEmail(recipientEmail, subject, body, {
    attachments: attachments,
  });
}

function testDrive() {
  let fileName = "ORCR_1.jpeg";

  let files = DriveApp.getFilesByName(fileName);

  if (!files.hasNext()) {
    console.log("No file of such name");
    return "No files of such name";
  }

  const file = files.next();

  console.log(file.getId());
}
