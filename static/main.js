(function () {
    console.log("I exist!"); // sanity check
  })();

  // turn input into JSON before prediction & add predictions to page
  document.getElementById('prediction-form').addEventListener('submit', function (e) {
    const inputText = document.getElementById('input-text').value;

    // if automatic validation failed 
    if (!inputText){
      return false; 
    }
    
    // in case navigation from form submission 
    e.preventDefault(); 

    fetch('/predict', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: inputText })
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        if (data.prediction) {
            console.log(`Prediction was successful: ${data.prediction}`);
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
            location.reload();
        } else {
            console.error("Failed to get a prediction");
        }
    })
    .catch(function (error) {
        console.error("Error:", error);
    });
  });
  

  // allow user to delete old predictions
  const predictionElements = document.getElementsByClassName("prediction");
    // add event listener to each prediction to allow user to delete by click
  for (var i = 0; i < predictionElements.length; i++) {
    predictionElements[i].addEventListener("click", function () {
      const predictionId = this.getElementsByTagName("h2")[0].getAttribute("id");
      const node = this;

      fetch(`/delete/${predictionId}`, {"method": "DELETE"})
        .then(function (response) {
          return response.json();
        })
        .then(function (result) {
          node.parentNode.removeChild(node);
          console.log(result);
          location.reload();
        })
        .catch(function (err) {
          console.error("Error in delete: ", err);
        });
    });
  }