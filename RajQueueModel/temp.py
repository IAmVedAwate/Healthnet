import sqlite3

# Connect to the HealthNet database
conn = sqlite3.connect('D:\Healthnet\Healthnet-Backend\HealthNet.db')
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE Appointment ADD COLUMN patientAssignId TEXT;")
    slots = cursor.fetchall()

    # # Step 2: Cleanly update each slot with ISO formatted time
    # for slotId, startTime in slots:
    #     print(startTime)
    #     try:

    #         # Update nextAvailableTime
    #         cursor.execute(
    #             "UPDATE DoctorSlot SET nextAvailableTime = ? WHERE slotId = ?",
    #             (startTime, slotId)
    #         )

    #     except Exception as e:
    #         print(f"[Error] Slot {slotId} has invalid startTime '{startTime}': {e}")
    conn.commit()
    conn.close()
    print("[✔] nextAvailableTime initialized for all active slots.")
    
except Exception as e:
    print("Error dropping Doctor table:", e)

