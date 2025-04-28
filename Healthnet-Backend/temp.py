import sqlite3

# Connect to the HealthNet database
conn = sqlite3.connect('D:\Mega project git\Healthnet-Backend\HealthNet.db')
cursor = conn.cursor()

try:
    cursor.execute("DROP TABLE IF EXISTS Bed;")
    print("Appointment table dropped successfully.")

except Exception as e:
    print("SignupRequest dropping Doctor table:", e)

conn.commit()
conn.close()