from flask import Flask, request, jsonify
import joblib
import numpy as np
from student_chatbot import student_chat
from flask_cors import CORS

# Load the trained model
model = joblib.load("student_performance_model.pkl")

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.register_blueprint(student_chat)

# Define prediction route
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()
        input_data = [
            data["attendance"],
            data["avg_test_score"],
            data["project_score"],
            data["assignment_score"],
            data["study_hours"],
            data["past_backlogs"]
        ]
        
        prediction = model.predict([input_data])[0]

        # Convert back to label
        label_map = {0: "Low", 1: "Medium", 2: "High"}
        predicted_label = label_map[prediction]

        return jsonify({"prediction": predicted_label})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Run the app
if __name__ == "__main__":
    app.run(debug=True)
