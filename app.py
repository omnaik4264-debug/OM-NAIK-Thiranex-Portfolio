from flask import Flask, render_template, request, jsonify
import sqlite3
from pathlib import Path

app = Flask(__name__)
DB_PATH = Path(__file__).with_name("portfolio.db")


def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db():
    with get_db() as db:
        db.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        db.commit()


@app.route("/")
def home():
    return render_template("index.html")


@app.post("/contact")
def contact():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    message = str(data.get("message", "")).strip()

    if not name or not email or not message:
        return jsonify({"error": "Please fill in all fields."}), 400

    if "@" not in email or "." not in email:
        return jsonify({"error": "Please enter a valid email address."}), 400

    with get_db() as db:
        db.execute(
            "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
            (name, email, message)
        )
        db.commit()

    return jsonify({"success": True, "message": "Message saved successfully."})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
