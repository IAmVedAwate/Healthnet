import sqlite3

# Connect to the HealthNet database
conn = sqlite3.connect('HealthNet.db')
cursor = conn.cursor()

try:
    cursor.execute("DROP TABLE IF EXISTS DoctorSlot;")
    print("Doctor table dropped successfully.")
except Exception as e:
    print("Error dropping Doctor table:", e)

conn.commit()
conn.close()