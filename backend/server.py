from flask import Flask, request, jsonify
from flask_cors import CORS
from classifier import ImageClassifier


app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def analyze():
  if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

  image_file = request.files["image"]
  model = ImageClassifier()
  processed_img = model.preprocess_image(image_file)
  probs, idxs = model.make_prediction(processed_img)
  categories = model.get_categories(idxs)
  return jsonify({"predictions": [categories[i] for i in idxs], "probabilities": probs.tolist()}), 200

if __name__ == '__main__':
  app.run(debug=True, port=5001)