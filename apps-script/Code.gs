/**
 * stampcal feedback → Gmail (nova0818@gmail.com)
 * Deploy as Web App: Execute as Me, Who has access: Anyone
 */
var TO = "nova0818@gmail.com";
var SUBJECT = "郵票計數機意見";

function doOptions() {
  return cors_(ContentService.createTextOutput(""));
}

function doGet() {
  return cors_(
    ContentService.createTextOutput(
      JSON.stringify({ ok: true, service: "stampcal-feedback" })
    ).setMimeType(ContentService.MimeType.JSON)
  );
}

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || "";
    var data = {};
    try {
      data = JSON.parse(raw);
    } catch (err) {
      data = { message: raw };
    }
    var name = String(data.name || data.from_name || "未填").trim() || "未填";
    var opinion = String(data.opinion || data.message || "").trim();
    if (!opinion) {
      return cors_(
        ContentService.createTextOutput(
          JSON.stringify({ success: false, message: "意見必填" })
        ).setMimeType(ContentService.MimeType.JSON)
      );
    }
    var body =
      "姓名：" +
      name +
      "\n\n意見：\n" +
      opinion +
      "\n\n—\nstampcal feedback";
    GmailApp.sendEmail(TO, SUBJECT, body, {
      name: "Stampcal",
      replyTo: TO
    });
    return cors_(
      ContentService.createTextOutput(
        JSON.stringify({ success: true, message: "ok" })
      ).setMimeType(ContentService.MimeType.JSON)
    );
  } catch (err) {
    return cors_(
      ContentService.createTextOutput(
        JSON.stringify({
          success: false,
          message: String(err && err.message ? err.message : err)
        })
      ).setMimeType(ContentService.MimeType.JSON)
    );
  }
}

function cors_(out) {
  return out;
}
