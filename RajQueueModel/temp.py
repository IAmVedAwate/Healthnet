import sqlite3

# Connect to the HealthNet database
conn = sqlite3.connect('HealthNet.db')
cursor = conn.cursor()

try:
    cursor.execute("SELECT slotId, startTime FROM DoctorSlot WHERE isActive = 1")
    slots = cursor.fetchall()

    # Step 2: Cleanly update each slot with ISO formatted time
    for slotId, startTime in slots:
        print(startTime)
        try:

            # Update nextAvailableTime
            cursor.execute(
                "UPDATE DoctorSlot SET nextAvailableTime = ? WHERE slotId = ?",
                (startTime, slotId)
            )

        except Exception as e:
            print(f"[Error] Slot {slotId} has invalid startTime '{startTime}': {e}")
    conn.commit()
    conn.close()
    print("[✔] nextAvailableTime initialized for all active slots.")
    
except Exception as e:
    print("Error dropping Doctor table:", e)

