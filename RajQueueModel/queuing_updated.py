import sqlite3
import json
import datetime
import heapq
from flask import Flask, request, jsonify, g
from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn as nn
import torch.nn.functional as F
from datetime import datetime, timedelta

app = Flask(__name__)

DATABASE = 'HealthNet.db'

# ---------------------
# Database Functions
# ---------------------
def get_db():
    """Returns a connection to the SQLite database."""
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect(DATABASE)
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
    # Use the first token's embedding ([CLS] token)
    embedding = outputs.last_hidden_state[:, 0, :]
    return embedding

# ---------------------
# Define a Simple Classifier Model
# ---------------------
# This simple classifier uses a linear layer followed by softmax.
# In a production setting, this should be pre-trained and fine-tuned on labeled data.
class EmbeddingClassifier(nn.Module):
    def __init__(self, input_dim=768, num_classes=4):
        super(EmbeddingClassifier, self).__init__()
        self.linear = nn.Linear(input_dim, num_classes)
    
    def forward(self, x):
        logits = self.linear(x)
        probabilities = F.softmax(logits, dim=1)
        return probabilities

# Instantiate the classifier. In our case, the default Bio_ClinicalBERT embedding dimension is 768.
embedding_classifier = EmbeddingClassifier()

# Mapping the classifier's output indices to labels.
priority_labels = {
    0: "Critical/Emergency",
    1: "High Priority",
    2: "Moderate Priority",
    3: "Low Priority"
}

def advanced_classify(embedding):
    """
    Given an embedding tensor, use the classifier to get probabilities and a predicted label.
    The input embedding shape is assumed to be [1, 768].
    """
    probs = embedding_classifier(embedding)  # Get probabilities from classifier.
    pred_index = torch.argmax(probs, dim=1).item()  # Get the index with highest probability.
    pred_label = priority_labels.get(pred_index, "Unknown Priority")
    return pred_label, probs.squeeze().tolist()

# ---------------------
# Priority Queue Setup
# ---------------------
class PatientCase:
    def __init__(self, case_data, embedding):
        """
        Initialize a PatientCase instance with flexible arrivalTime parsing.
        """
        self.caseId = case_data.get("caseId")
        self.patientId = case_data.get("patientId")
        self.cause = case_data.get("cause")
        self.urgency = int(case_data.get("urgency", 3))  # Default to least urgent if missing
        self.hospitalId = case_data.get("hospitalId")
        self.department = case_data.get("department")
        self.embedding = embedding
        self.scheduledTime = None  # Will be set when scheduled (as "HH:MM")

        arrival_time_str = case_data.get("arrivalTime")
        self.arrivalTime = self.parse_arrival_time(arrival_time_str)

    def parse_arrival_time(self, time_str):
        if not time_str:
            print("Warning: arrivalTime missing.")
            return datetime.min  # Use very early time to avoid scheduling issues
        try:
            return datetime.fromisoformat(time_str)
        except ValueError:
            try:
                # Try fixing common issue: missing 'T'
                if 'T' not in time_str and ' ' in time_str:
                    return datetime.fromisoformat(time_str.replace(' ', 'T'))
                # Try strptime as fallback
                return datetime.strptime(time_str, "%Y-%m-%d %H:%M:%S")
            except Exception as e:
                print(f"Warning: Failed to parse arrivalTime '{time_str}': {e}")
                return datetime.min

    def __lt__(self, other):
        if self.urgency == other.urgency:
            return self.arrivalTime < other.arrivalTime
        return self.urgency < other.urgency

# Global priority queue list
priority_queue = []

def enqueue_case(case_data):
    embedding_tensor = get_text_embedding(case_data["cause"])
    case = PatientCase(case_data, embedding_tensor)
    heapq.heappush(priority_queue, case)
    return case


def increment_time_str(time_str):
    """Increment a time string (HH:MM) by 15 minutes."""
    t = datetime.strptime(time_str, "%H:%M")
    t += timedelta(minutes=15)
    return t.strftime("%H:%M")

def time_str_to_minutes(time_str):
    """Convert HH:MM to total minutes."""
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
# API Endpoints
# ---------------------
@app.route('/')
def index():
    return "Welcome to the HealthNet API Queueing System"

@app.route('/enqueue_case', methods=['POST'])
def api_enqueue_case():
    """
    Enqueue a case record into the priority queue.
    Expects JSON with fields: caseId, patientId, cause, urgency, arrivalTime, hospitalId, department.
    """
    try:
        case_data = request.get_json()
        required_fields = ["caseId", "patientId", "cause", "urgency", "arrivalTime", "hospitalId", "department"]
        if not all(field in case_data for field in required_fields):
            return jsonify({"error": "Missing one or more required fields"}), 400

        case = enqueue_case(case_data)
        response = {
            "message": "Case enqueued successfully.",
            "caseId": case.caseId,
            "urgency": case.urgency,
            "arrivalTime": case.arrivalTime.isoformat()
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get_queue', methods=['GET'])
def get_queue():
    """
    Returns the current priority queue listing caseId, urgency, arrivalTime, hospitalId, and department.
    """
    try:
        sorted_queue = sorted(priority_queue)
        data = [
            {
                "caseId": case.caseId,
                "urgency": case.urgency,
                "arrivalTime": case.arrivalTime.isoformat(),
                "hospitalId": case.hospitalId,
                "department": case.department
            }
            for case in sorted_queue
        ]
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/schedule_next', methods=['POST'])
def schedule_next():
    try:
        if not priority_queue:
            return jsonify({"message": "No cases in the queue."}), 200

        next_case = heapq.heappop(priority_queue)
        slot = get_available_slot(next_case.hospitalId, next_case.department)
        if slot:
            scheduled_info = {
                "caseId": next_case.caseId,
                "patientId": next_case.patientId,
                "scheduledDoctor": slot["doctorId"],
                "slotId": slot["slotId"],
                "slotStartTime": slot["slotStartTime"],
                "slotEndTime": slot["slotEndTime"],
                "hospitalId": next_case.hospitalId,
                "department": next_case.department
            }
            return jsonify({
                "message": "Case scheduled successfully.",
                "scheduling": scheduled_info
            })
        else:
            heapq.heappush(priority_queue, next_case)
            return jsonify({"message": "No available slots at this time. Case remains in queue."}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/classify_case', methods=['POST'])
def classify_case():
    """
    A simple classification endpoint based solely on the provided urgency field.
    """
    try:
        data = request.get_json()
        if "urgency" not in data:
            return jsonify({"error": "Field 'urgency' is required."}), 400
        urgency = int(data["urgency"])
        if urgency == 1:
            label = "Critical/Emergency"
        elif urgency == 2:
            label = "High Priority"
        elif urgency == 3:
            label = "Moderate Priority"
        elif urgency >= 4:
            label = "Low Priority"
        else:
            label = "Unknown Priority"
        return jsonify({"urgency": urgency, "priorityLabel": label})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/classify_advanced', methods=['POST'])
def classify_advanced():
    """
    An advanced classification endpoint that uses the extracted embedding from the case "cause" text.
    It passes the embedding through a classifier (a simple linear layer) to predict a priority label.
    Expects JSON with a "cause" field (and other case data optionally).
    """
    try:
        data = request.get_json()
        if "cause" not in data:
            return jsonify({"error": "Field 'cause' is required for classification."}), 400

        # Extract embedding from the cause text
        embedding_tensor = get_text_embedding(data["cause"])
        # Use the classifier to get predicted label and probabilities
        predicted_label, probabilities = advanced_classify(embedding_tensor)

        response = {
            "predictedPriorityLabel": predicted_label,
            "probabilities": probabilities
        }
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
