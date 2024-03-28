import os
import certifi
import torchvision
from torchvision.models import resnet50, ResNet50_Weights
from PIL import Image
import numpy as np
# This will let us download the pretrained model
os.environ['SSL_CERT_FILE'] = certifi.where()

class ImageClassifier:
  def __init__(self):
    self.model = self.load_model()
  def load_model(self):
    model = torchvision.models.resnet50(weights='IMAGENET1K_V1')
    model.eval()
    return model

  def preprocess_image(self, image):
    preprocessFunc = ResNet50_Weights.IMAGENET1K_V1.transforms()
    img = Image.open(image)
    preprocessedImg = preprocessFunc(img)
    return preprocessedImg
  
  def make_prediction(self, processedImg):
    probs = self.model(processedImg.unsqueeze(0))
    probs = probs.softmax(1)
    probs = probs[0].detach().numpy()
    probs, idxs = probs[probs.argsort()[-5:][::-1]], probs.argsort()[-5:][::-1]
    return probs, idxs
  
  def get_categories(self, idxs):
    return np.array(ResNet50_Weights.IMAGENET1K_V1.meta['categories'])

# Example usage
if __name__ == "__main__":
    classifier = ImageClassifier()
    image_path = "doberman.jpg"
    processed_img = classifier.preprocess_image(image_path)
    probs, idxs = classifier.make_prediction(processed_img)