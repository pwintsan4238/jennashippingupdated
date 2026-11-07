# Connecting the website forms to Google Sheets

The job application and contact forms send each submission to a Google Sheet:

- **Applications** tab: one row per applicant, with a link to their photo, plus **Status** and **Notes** columns for the office.
- **Contact messages** tab: one row per message, with a link to any attached file.
- Photos and attachments are saved in a private Google Drive folder, **Jena Shipping website uploads**.
- An email goes to `jenashipping972023@gmail.com` for each new submission (change `NOTIFY_EMAIL` in the script).

The receiver is a small Google Apps Script, `google-apps-script/Code.gs`, that runs in your Google account. It costs nothing.

## One-time setup (about 10 minutes)

Sign in to Google with the account that should own the data, ideally the company account.

1. **Create the sheet.** Go to [sheets.new](https://sheets.new) and name it, e.g. *Jena Shipping — website submissions*.
   You don't need to add any columns; the script creates the tabs and headers on the first submission.
2. **Open the script editor.** In the sheet: **Extensions → Apps Script**.
3. **Paste the script.** Delete everything in `Code.gs`, paste the whole contents of `google-apps-script/Code.gs` from this repo, and click **Save** (💾).
   To send the emails somewhere else, change the `NOTIFY_EMAIL` line near the top.
4. **Deploy it as a web app.** Click **Deploy → New deployment**, then the ⚙️ next to "Select type" → **Web app**:
   - Description: `Website forms`
   - Execute as: **Me**
   - Who has access: **Anyone**
   Click **Deploy**.
5. **Allow access.** Google asks to authorize the script: **Authorize access** → pick your account → if you see "Google hasn't verified this app", click **Advanced → Go to (project name) (unsafe)** → **Allow**.
   This is normal for your own scripts. It lets the script add rows to this sheet, save uploads to your Drive and send the notification email.
6. **Copy the Web app URL.** It looks like `https://script.google.com/macros/s/AKfy…/exec`.
   Opening it in a browser should show `{"ok":true,"service":"Jena Shipping forms"}`.
7. **Put the URL in the website.** Set `formsEndpoint` in `lib/site.ts` to that URL, commit and push to `main`. Cloudflare redeploys automatically.

## Good to know

- **"Anyone" access** only means anyone can *send* a submission to the script, which is what the public form does. Nobody can read the sheet or the Drive folder unless you share them. Keep both private: they contain personal data (NRC, passport numbers, photos).
- **Changing the script later:** after editing, use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. That keeps the same URL. "New deployment" would create a new URL that the website doesn't know about.
- **Columns:** the website decides the columns. If a form field is added, a new column appears at the end on the next submission. You can reorder, hide or add your own columns; the script matches columns by their header names, so don't rename the headers it created.
- **Reference numbers** look like `JENA-2026-00001` (applications) and `MSG-2026-00001` (messages). The applicant sees theirs on the thank-you screen.
- **Limits:** a free Google account can send about 100 notification emails a day. If that's exceeded, the row is still saved; only the email is skipped.
- **Spam:** the forms include a hidden trap field; bot submissions that fill it are thrown away without saving.
