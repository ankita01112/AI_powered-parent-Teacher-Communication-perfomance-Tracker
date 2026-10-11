# student_chatbot.py
from flask import Blueprint, request, jsonify
import mysql.connector
import nltk
from nltk.tokenize import word_tokenize
import json
import os

# 🧠 Download tokenizer (only once)
nltk.download('punkt')

# 📥 Load intent definitions
with open(os.path.join(os.path.dirname(__file__), 'intents.json'), 'r', encoding='utf-8') as f:
    INTENTS = json.load(f)


# 🔹 Create Flask Blueprint
student_chat = Blueprint('student_chat', __name__)

# 🔌 Database connection helper
def get_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # 🔁 Replace with your actual MySQL password
        database="ai_chatbot"  # 🔁 Replace with your actual DB name
    )

# 🧠 Process student query
def get_student_data(student_id, question):
    question = question.lower()
    tokens = word_tokenize(question)
    matched_intent = None

    # 🔍 Match question to intent
    for intent in INTENTS:
        for pattern in intent["patterns"]:
            if pattern in question:
                matched_intent = intent
                break
        if matched_intent:
            break

    conn = None
    cursor = None

    try:
        conn = get_connection()
        cursor = conn.cursor(dictionary=True)

        if matched_intent:
            tag = matched_intent["tag"]

            # 1. Static Response
            if "response" in matched_intent:
                return matched_intent["response"]

            # 2. Field-based lookup
            elif "db_field" in matched_intent:
                field = matched_intent["db_field"]
                cursor.execute(f"SELECT {field} FROM students WHERE id = %s", (student_id,))
                result = cursor.fetchone()
                if result and field in result:
                    emoji = {
                        "attendance": "📊",
                        "avg_test_score": "📝",
                        "project_score": "📂",
                        "assignment_score": "📚",
                        "past_backlogs": "⚠️",
                        "last_prediction": "📈"
                    }.get(field, "📌")
                    return f"{emoji} Your {field.replace('_', ' ')} is: {result[field]}"

            # 3. Subject-wise score logic
            elif matched_intent.get("action") == "subject_scores":
                cursor.execute("""
                    SELECT 
                        sm.marks_obtained, sm.total_marks, sub.subject_name
                    FROM student_marks sm
                    JOIN subjects sub ON sm.subject_id = sub.id
                    WHERE sm.student_id = %s
                """, (student_id,))
                results = cursor.fetchall()

                if results:
                    response_lines = ["📘 Here's your subject-wise performance:\n"]
                    total_obtained = 0
                    total_possible = 0

                    for row in results:
                        subject = row['subject_name']
                        obtained = row['marks_obtained']
                        total = row['total_marks']
                        total_obtained += obtained
                        total_possible += total
                        response_lines.append(f"• {subject}: {obtained}/{total}")

                    response_lines.append(f"\n📊 Total: {total_obtained}/{total_possible}")
                    return "\n".join(response_lines)
                else:
                    return "📄 No subject marks found."

        # Default fallback
        fallback = next((i for i in INTENTS if i["tag"] == "fallback"), None)
        return fallback["response"] if fallback else "🤖 I didn’t get that."

    except Exception as e:
        return f"❌ Internal error: {str(e)}"

    finally:
        if cursor: cursor.close()
        if conn: conn.close()

# 🚀 Route to handle POST /chat
@student_chat.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        print("Received data:", data)  # Add this line
        message = data.get("message")
        student_id = data.get("student_id")

        if not message or not student_id:
            return jsonify({"error": "❗ Missing 'message' or 'student_id'"}), 400

        reply = get_student_data(student_id, message)
        return jsonify({"reply": reply})

    except Exception as e:
        return jsonify({"error": str(e)}), 500
