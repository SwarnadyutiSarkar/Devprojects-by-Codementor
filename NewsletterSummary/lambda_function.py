import imaplib
import email
from email.policy import default
from datetime import datetime, timedelta
import boto3
from config import EMAIL_ADDRESS, EMAIL_PASSWORD, IMAP_SERVER, S3_BUCKET

S3 = boto3.client('s3')
SES = boto3.client('ses')

def lambda_handler(event, context):
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
    save_to_s3(summary_content)
    send_email(summary_content)

    return {
        'statusCode': 200,
        'body': 'Summary email sent successfully!'
    }

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

def save_to_s3(content):
    filename = f"newsletter_summary_{datetime.now().strftime('%Y%m%d')}.txt"
    S3.put_object(Bucket=S3_BUCKET, Key=filename, Body=content)

def send_email(content):
    response = SES.send_email(
        Source=EMAIL_ADDRESS,
        Destination={
            'ToAddresses': [EMAIL_ADDRESS],
        },
        Message={
            'Subject': {
                'Data': 'Weekly Newsletter Summary',
            },
            'Body': {
                'Text': {
                    'Data': content,
                },
            }
        }
    )
    return response
