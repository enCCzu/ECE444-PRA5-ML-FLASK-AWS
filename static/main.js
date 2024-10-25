(function () {
    console.log("I exist!"); // sanity check
  })();

  // turn input into JSON before prediction & add predictions to page
  document.getElementById('prediction-form').addEventListener('submit', async function (e) {
    const inputText = document.getElementById('input-text').value;

    // if automatic validation failed 
    if (!inputText){
      return false; 
    }
    
    // in case navigation from form submission 
    e.preventDefault(); 

    try {
      const response = await fetch('/predict', {
        "method": "POST",
        "headers": {"Content-Type": "application/json"},
        "body": JSON.stringify({ text: inputText })
      });

      const data = await response.json();
      const result = data["prediction"];
      const resultID = data["prediction_id"];

      // create new prediction 
      const newPrediction = document.createElement('li');
        // format properly
      const newPredictionH2Result = document.createElement('h2');
      newPredictionH2Result.textContent = `Result: ${ result }`;
      newPredictionH2Result.setAttribute("id", resultID);
      newPrediction.appendChild(newPredictionH2Result);
      const newPredictionTextNodeText = document.createTextNode(`Input text: ${ inputText }`);
      newPrediction.appendChild(newPredictionTextNodeText);

      // add new prediction to the list
      const predictionsList = document.getElementById('predictions-list');
      predictionsList.appendChild(newPrediction);

    } catch (error) {
      console.error("Error in prediction form: ", error);
    }
  });
  

  // allow user to delete old predictions
  const predictionElements = document.getElementsByClassName("prediction");
    // add event listener to each prediction to allow user to delete by click
  for (var i = 0; i < predictionElements.length; i++) {
    predictionElements[i].addEventListener("click", async function (e) {
      // in case navigation from form submission 
      e.preventDefault();

      const predictionId = this.getElementsByTagName("h2")[0].getAttribute("id");
      const node = this;

      try{ 
        const response = await fetch(`/delete/${predictionId}`);
        node.parentNode.removeChild(node);
        console.log(result);
      } catch (error) {
        console.error("Error in deleting prediction: ", error);
      }
    });
  }