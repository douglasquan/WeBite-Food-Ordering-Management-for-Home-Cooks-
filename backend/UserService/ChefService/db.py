import sqlite3

conn = sqlite3.connect("../users.db")

cursor = conn.cursor()
cursor.execute('''DROP TABLE IF EXISTS chef;''')

sql_query = """ CREATE TABLE chef (
    id BIGINT PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    phone_num INTEGER NOT NULL,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL
)"""
cursor.execute(sql_query)