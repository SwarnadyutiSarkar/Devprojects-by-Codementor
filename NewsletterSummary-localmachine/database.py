import sqlite3

def init_db():
    conn = sqlite3.connect('summaries.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS summaries
                      (id INTEGER PRIMARY KEY AUTOINCREMENT,
                       date TEXT,
                       content TEXT)''')
    conn.commit()
    conn.close()

def save_summary(date, content):
    conn = sqlite3.connect('summaries.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO summaries (date, content) VALUES (?, ?)', (date, content))
    conn.commit()
    conn.close()
