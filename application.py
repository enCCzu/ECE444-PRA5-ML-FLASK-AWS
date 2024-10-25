from flask import Flask, jsonify, request, render_template, session, flash, url_for, redirect
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
import pickle
import uuid

# config 
SECRET_KEY = "mango_secret"

# create and initialize a new Flask app
app = Flask(__name__)

# load the config
app.config.from_object(__name__)

###########################
# how to use model to predict
#prediction = loaded_model.predict(vectorizer.transform(['This is fake news']))[0]
# output will be 'FAKE' if fake, 'REAL' if real

# temporarily store a dictionary 
predictions_dict = {}

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html", predictions=predictions_dict)
    
# Load the model
def load_model():
    
    # Load the model
    with open('basic_classifier.pkl', 'rb') as fid:
        loaded_model = pickle.load(fid)
        
    # Load the vectorizer
    with open('count_vectorizer.pkl', 'rb') as fid:
        vectorizer = pickle.load(fid)
    
    return vectorizer, loaded_model

vectorizer, loaded_model = load_model()

@app.route('/predict', methods=['POST'])
def predict():
    
    data = request.json 
    text = data["text"]
    
    # Check for text in case validation failed
    if text is None:
        return jsonify({'error': 'Missing text'}), 400
    
    flash("Predicting...", "info")
    
    # Transform the input text
    text_vectorized = vectorizer.transform([text])
    
    # Make prediction
    prediction = loaded_model.predict(text_vectorized)[0]
    
    if prediction == 1: 
        result = 'FAKE'
    else: 
        result = 'REAL'
        
    flash("Prediction: It is {result}!", "success")
    
    # Store prediction temporarily
    prediction_id = uuid.uuid4().int
    predictions_dict[prediction_id] = {'text': text, 'result': result}
    
    return jsonify({'prediction_id': prediction_id, 'prediction': result}), 200

@app.route("/delete/<int:prediction_id>", methods=["GET"])
def delete_prediction(prediction_id):
    result = {"success": 1}
    flash("The prediction was deleted.", "success")
    predictions_dict.pop(prediction_id)
    return jsonify(result), 200

if __name__ == '__main__':
    app.run(debug=True)
    
    