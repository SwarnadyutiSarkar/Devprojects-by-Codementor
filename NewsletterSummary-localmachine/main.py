import imaplib
import email
from email.policy import default
from datetime import datetime, timedelta
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import EMAIL_ADDRESS, EMAIL_PASSWORD, IMAP_SERVER, SMTP_SERVER, SMTP_PORT
from database import init_db, save_summary

def main():
    init_db()
    conn = imaplib.IMAP4_SSL(IMAP_SERVER)
    conn.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
    conn.select('inbox')

    date = (datetime.now() - timedelta(days=7)).strftime("%d-%b-%Y")
    result, data = conn.search(None, f'(SINCE "{date}")')

    emails = data[0].split()
    summaries = []

    for num in emails:
        result, data = conn.fetch(num, '(RFC822)')
        raw_email = data[0][1]
        msg = email.message_from_bytes(raw_email, policy=default)

        if 'newsletter' in msg['Subject'].lower():
            summaries.append({
                'subject': msg['Subject'],
                'from': msg['From'],
                'date': msg['Date'],
                'body': get_body(msg)
            })

    summary_content = generate_summary(summaries)
    save_summary(datetime.now().strftime('%Y-%m-%d %H:%M:%S'), summary_content)
    send_email(summary_content)

def get_body(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == 'text/plain':
                return part.get_payload(decode=True).decode()
    else:
        return msg.get_payload(decode=True).decode()

def generate_summary(summaries):
    content = "Weekly Newsletter Summary\n\n"
    for summary in summaries:
        content += f"From: {summary['from']}\n"
        content += f"Subject: {summary['subject']}\n"
        content += f"Date: {summary['date']}\n"
        content += f"Body:\n{summary['body']}\n\n"
    return content

def send_email(content):
    msg = MIMEMultipart()
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = EMAIL_ADDRESS
    msg['Subject'] = 'Weekly Newsletter Summary'
    msg.attach(MIMEText(content, 'plain'))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)

if __name__ == "__main__":
    main()
