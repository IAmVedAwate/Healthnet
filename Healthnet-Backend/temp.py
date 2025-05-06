import sqlite3

# Connect to the HealthNet database
conn = sqlite3.connect('HealthNet.db')
cursor = conn.cursor()

try:
    cursor.execute("DELETE FROM MedicalHistory WHERE historyId = 'c73ac87f-af31-46ec-9d28-b1cd5813cc93';")
    print("Appointment table dropped successfully.")

except Exception as e:
    print("SignupRequest dropping Doctor table:", e)

conn.commit()
conn.close()