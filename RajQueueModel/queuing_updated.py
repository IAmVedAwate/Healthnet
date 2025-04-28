import sqlite3
import json
import datetime
import uuid
from flask import Flask, request, jsonify, g
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn as nn
import torch.nn.functional as F
from datetime import datetime, timedelta

app = Flask(__name__)
DATABASE = 'D:\Healthnet\Healthnet-Backend\HealthNet.db'

# ---------------------
# Database Functions
# ---------------------
def get_db():
    """Returns a connection to the SQLite database."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
        db.row_factory = sqlite3.Row
    db.execute("PRAGMA foreign_keys = ON;")
    return db

@app.teardown_appcontext
def close_connection(exception):
    """Close database connection on app context teardown."""
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

# ---------------------
# Load Hugging Face Model
# ---------------------
print("Loading Hugging Face tokenizer and model...")
tokenizer = AutoTokenizer.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
model = AutoModel.from_pretrained("emilyalsentzer/Bio_ClinicalBERT")
print("Transformer model loaded successfully.")

def get_text_embedding(text):
    """Extract the [CLS] embedding for the input text using Bio_ClinicalBERT."""
    inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=128)
    with torch.no_grad():
        outputs = model(**inputs)
    embedding = outputs.last_hidden_state[:, 0, :]
    return embedding

# ---------------------
# Define a Simple Classifier Model
# ---------------------
class EmbeddingClassifier(nn.Module):
    def __init__(self, input_dim=768, num_classes=4):
        super(EmbeddingClassifier, self).__init__()
        self.linear = nn.Linear(input_dim, num_classes)
    def forward(self, x):
        logits = self.linear(x)
        return F.softmax(logits, dim=1)

embedding_classifier = EmbeddingClassifier()
priority_labels = {0: "Critical/Emergency", 1: "High Priority", 2: "Moderate Priority", 3: "Low Priority"}

def advanced_classify(embedding):
    probs = embedding_classifier(embedding)
    pred_index = torch.argmax(probs, dim=1).item()
    pred_label = priority_labels.get(pred_index, "Unknown Priority")
    return pred_label, probs.squeeze().tolist()

# ---------------------
# Time Utilities
# ---------------------
def increment_time_str(time_str):
    t = datetime.strptime(time_str, "%H:%M")
    t += timedelta(minutes=15)
    return t.strftime("%H:%M")

def time_str_to_minutes(time_str):
    h, m = map(int, time_str.split(":"))
    return h * 60 + m

def get_available_slot(hospitalId, department):
    """
    Finds the next available 15-minute slot within the doctor's shift using 'HH:MM' format.
    Updates the DoctorSlot's nextAvailableTime if a valid slot is found.
    """
    db = get_db()
    cursor = db.cursor()
    query = """
        SELECT ds.slotId, ds.doctorId, ds.startTime, ds.endTime, ds.nextAvailableTime
        FROM DoctorSlot ds
        JOIN Doctor d ON ds.doctorId = d.doctorId
        WHERE ds.isActive = 1 
          AND d.hospitalId = ? 
          AND d.departmentId = ?
        ORDER BY ds.nextAvailableTime ASC
    """
    cursor.execute(query, (hospitalId, department))
    slots = cursor.fetchall()

    for slot in slots:
        slotId, doctorId, startTime, endTime, nextAvailableTime = slot

        if time_str_to_minutes(nextAvailableTime) + 15 <= time_str_to_minutes(endTime):
            scheduled_time = nextAvailableTime
            updated_time = increment_time_str(scheduled_time)

            update_query = "UPDATE DoctorSlot SET nextAvailableTime = ? WHERE slotId = ?"
            cursor.execute(update_query, (updated_time, slotId))
            db.commit()

            return {
                "slotId": slotId,
                "doctorId": doctorId,
                "slotStartTime": scheduled_time,
                "slotEndTime": updated_time
            }

    return None


# ---------------------
# Appointment Operations
# ---------------------
@app.route('/')
def index():
    return "Welcome to the HealthNet API Queueing System"

@app.route('/enqueue_case', methods=['POST'])
def api_enqueue_case():
    """
    Insert a new appointment into the Appointment table.
    Expects JSON with: hospitalId, departmentId,
    patientId, arrivalTime (ISO), cause, urgency (int/string).
    (appointmentId is auto-generated as a UUID)
    """
    data = request.get_json()
    required = ["hospitalId", "departmentId", "patientId", "arrivalTime", "cause"]
    if not all(field in data for field in required):
        return jsonify({"error": "Missing one or more required fields"}), 400

    appointment_id = str(uuid.uuid4())  # <-- generate a new UUID for appointmentId
    # urgency = classify_case(data['urgency'])
    db = get_db()
    try:
        db.execute(
            """
            INSERT INTO Appointment
            (appointmentId, hospitalId, departmentId, patientId, arrivalTime, status, cause, urgency)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                appointment_id, data['hospitalId'], data['departmentId'],
                data['patientId'], data['arrivalTime'], "Pending" , data['cause'], str(0)
            )
        )
        db.commit()
        return jsonify({"message": "Appointment enqueued successfully.", "appointmentId": appointment_id}), 201
    except sqlite3.IntegrityError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_queue', methods=['GET'])
def get_queue():
    """
    Fetch pending appointments for a specific hospital, ordered by:
      1) arrivalTime (ascending)
      2) urgency (ascending) for ties on arrivalTime.

    Expects query parameter:
      - hospitalId: UUID of the hospital
    """
    hospital_id = request.args.get('hospitalId')
    if not hospital_id:
        return jsonify({"error": "Query parameter 'hospitalId' is required."}), 400

    db = get_db()
    try:
        cursor = db.execute(
            """
            SELECT
                appointmentId,
                hospitalId,
                departmentId,
                patientId,
                arrivalTime,
                cause,
                urgency
            FROM Appointment
            WHERE hospitalId = ? AND status = 'Approved'
            ORDER BY
                DATE(arrivalTime)     ASC,
                CAST(urgency AS INTEGER) ASC
            """,
            (hospital_id,)
        )
        rows = cursor.fetchall()
        data = [dict(r) for r in rows]
        return jsonify(data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/schedule_next', methods=['POST'])
def schedule_next():
    """
    Schedule the highest-priority appointment and remove it from DB.
    """
    db = get_db()
    try:
        # Fetch next appointment
        row = db.execute(
            "SELECT * FROM Appointment WHERE status = 'Approved'"
            " ORDER BY CAST(urgency AS INTEGER) ASC, arrivalTime ASC LIMIT 1"
        ).fetchone()
        if not row:
            return jsonify({"message": "No appointments pending."}), 200

        # Find slot
        slot = get_available_slot(row['hospitalId'], row['departmentId'])
        if slot:
            # Delete the appointment
            db.execute("DELETE FROM Appointment WHERE appointmentId = ?", (row['appointmentId'],))
            db.commit()
            scheduled_info = {
                "appointmentId": row['appointmentId'],
                "patientId": row['patientId'],
                "scheduledDoctor": slot['doctorId'],
                "slotId": slot['slotId'],
                "slotStartTime": slot['slotStartTime'],
                "slotEndTime": slot['slotEndTime'],
                "hospitalId": row['hospitalId'],
                "departmentId": row['departmentId']
            }
            return jsonify({"message": "Appointment scheduled successfully.", "scheduling": scheduled_info}), 200
        else:
            return jsonify({"message": "No available slots. Appointment remains pending."}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def classify_case(urgency):
    """
    Classification based on provided urgency field.
    """
    try:
        if "urgency" == None:
            return jsonify({"error": "Field 'urgency' is required."}), 400
        u = int(urgency)
        if u == 1:
            label = "Critical/Emergency"
        elif u == 2:
            label = "High Priority"
        elif u == 3:
            label = "Moderate Priority"
        elif u >= 4:
            label = "Low Priority"
        else:
            label = "Unknown Priority"
        return label
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/classify_advanced', methods=['POST'])
def classify_advanced():
    """
    Advanced classification using text embedding.
    """
    try:
        data = request.get_json()
        if "cause" not in data:
            return jsonify({"error": "Field 'cause' is required."}), 400
        emb = get_text_embedding(data["cause"])
        label, probs = advanced_classify(emb)
        return jsonify({"predictedPriorityLabel": label, "probabilities": probs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5050)
