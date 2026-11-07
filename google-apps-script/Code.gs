/**
 * Jena Shipping website → Google Sheets receiver.
 *
 * Paste this into the Apps Script editor of the Google Sheet that should collect submissions
 * (Extensions → Apps Script), set NOTIFY_EMAIL, then Deploy → New deployment → Web app,
 * "Execute as: Me", "Who has access: Anyone". Full steps: docs/GOOGLE_SHEETS_SETUP.md.
 *
 * The website POSTs JSON (as text/plain, so browsers send it without a CORS preflight):
 *   { kind: "application" | "contact", fields: [[label, value], ...],
 *     file?: { name, type, base64 }, website: "" }   // `website` is a spam trap and must be empty
 * Each submission becomes one row. The labels are the column headers; new labels are added as
 * new columns, so the website can add form fields without changing this script.
 */

// Who gets an email for each new submission (comma-separate several addresses). Leave "" for no email.
var NOTIFY_EMAIL = "jenashipping972023@gmail.com";

// Name of the Google Drive folder for photos and attachments (created on first upload, private).
var UPLOAD_FOLDER = "Jena Shipping website uploads";

var SHEETS = {
  application: { name: "Applications", prefix: "JENA" },
  contact: { name: "Contact messages", prefix: "MSG" },
};
var MAX_FILE_BYTES = 6 * 1024 * 1024;
var FILE_TYPES = [
  "image/jpeg", "image/png", "image/webp", "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

function doPost(e) {
  try {
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (body.website) return json({ ok: true, reference: "OK" }); // bot filled the spam trap: pretend success
    var conf = SHEETS[body.kind];
    if (!conf) return json({ ok: false, error: "Unknown form." });
    var fields = sanitizeFields(body.fields);
    if (!fields.length) return json({ ok: false, error: "The form was empty." });

    var lock = LockService.getScriptLock();
    lock.waitLock(30000);
    try {
      var sheet = getSheet(conf.name);
      var reference = nextReference(sheet, conf.prefix);
      var fileUrl = body.file ? saveFile(body.file, reference) : "";

      var labels = ["Received", "Reference"].concat(fields.map(function (f) { return f[0]; }));
      if (body.kind === "application" || fileUrl) labels.push(body.kind === "application" ? "Photo" : "Attachment");
      var headers = ensureHeaders(sheet, labels);

      var values = {};
      values["Received"] = new Date();
      values["Reference"] = reference;
      fields.forEach(function (f) { values[f[0]] = f[1]; });
      if (fileUrl) values[body.kind === "application" ? "Photo" : "Attachment"] = fileUrl;
      if (body.kind === "application") values["Status"] = "New";

      sheet.appendRow(headers.map(function (h) { return h in values ? safeCell(values[h]) : ""; }));
    } finally {
      lock.releaseLock();
    }

    notify(conf.name, reference, fields, fileUrl);
    return json({ ok: true, reference: reference });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "We couldn't save your submission. Please try again, or call or message the office." });
  }
}

// A plain GET (e.g. opening the web-app URL in a browser) just confirms the script is deployed.
function doGet() {
  return json({ ok: true, service: "Jena Shipping forms" });
}

function sanitizeFields(fields) {
  if (!Array.isArray(fields)) return [];
  return fields
    .filter(function (f) { return Array.isArray(f) && typeof f[0] === "string" && f[0].trim(); })
    .slice(0, 60)
    .map(function (f) { return [f[0].trim().slice(0, 60), String(f[1] == null ? "" : f[1]).slice(0, 5000)]; });
}

function getSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

/** Make sure every label has a column; returns the full header row. Office columns are added for applications. */
function ensureHeaders(sheet, labels) {
  var lastCol = sheet.getLastColumn();
  var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String) : [];
  if (sheet.getName() === SHEETS.application.name) labels = labels.concat(["Status", "Notes"]);
  var missing = labels.filter(function (l) { return headers.indexOf(l) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return headers;
}

/** JENA-2026-00001 style: counts this year's rows in the Reference column. */
function nextReference(sheet, prefix) {
  var year = new Date().getFullYear();
  var stem = prefix + "-" + year + "-";
  var n = 0;
  var lastRow = sheet.getLastRow();
  var lastCol = sheet.getLastColumn();
  if (lastRow > 1 && lastCol) {
    var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var col = headers.indexOf("Reference") + 1;
    if (col) {
      sheet.getRange(2, col, lastRow - 1, 1).getValues().forEach(function (r) {
        var v = String(r[0]);
        if (v.indexOf(stem) === 0) n = Math.max(n, parseInt(v.slice(stem.length), 10) || 0);
      });
    }
  }
  return stem + ("00000" + (n + 1)).slice(-5);
}

function saveFile(file, reference) {
  if (!file || !file.base64 || FILE_TYPES.indexOf(file.type) === -1) return "";
  var bytes = Utilities.base64Decode(file.base64);
  if (bytes.length > MAX_FILE_BYTES) return "";
  var ext = String(file.name || "").split(".").pop().replace(/[^a-z0-9]/gi, "").slice(0, 5) || "bin";
  var blob = Utilities.newBlob(bytes, file.type, reference + "." + ext);
  return getFolder().createFile(blob).getUrl(); // private: only you (and people you share the folder with) can open it
}

function getFolder() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty("UPLOAD_FOLDER_ID");
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* deleted: make a new one */ }
  }
  var folder = DriveApp.createFolder(UPLOAD_FOLDER);
  props.setProperty("UPLOAD_FOLDER_ID", folder.getId());
  return folder;
}

function notify(sheetName, reference, fields, fileUrl) {
  if (!NOTIFY_EMAIL) return;
  try {
    var lines = fields
      .filter(function (f) { return f[1]; })
      .map(function (f) { return f[0] + ": " + (f[1].indexOf("\n") > -1 ? "\n  " + f[1].split("\n").join("\n  ") : f[1]); });
    if (fileUrl) lines.push("File: " + fileUrl);
    lines.push("", "Sheet: " + SpreadsheetApp.getActiveSpreadsheet().getUrl());
    var name = (fields.filter(function (f) { return f[0] === "English name" || f[0] === "Name"; })[0] || [])[1] || "";
    var subject = (sheetName === SHEETS.application.name ? "New application " : "New message ") + reference + (name ? " — " + name : "");
    MailApp.sendEmail({ to: NOTIFY_EMAIL, subject: subject, body: lines.join("\n") });
  } catch (err) {
    console.error("Email failed (the row was still saved): " + err);
  }
}

/** Stop text like "=HYPERLINK(...)" or "+95 9 ..." from being read as a formula. */
function safeCell(v) {
  if (typeof v === "string" && /^[=+\-@]/.test(v)) return "'" + v;
  return v;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
