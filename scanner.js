let modelLoading;
let initialized = false;

let templateSelect = document.getElementById("template");
templateSelect.onchange = async function (){
  let template = document.getElementById("template").selectedOptions[0].value;
  await recognizer.updateRuntimeSettingsFromString(template); // will load model
}

let startButton = document.getElementById("startButton");
startButton.onclick = function(){
  startScan();
}

let correctButton = document.getElementById("correctButton");
correctButton.onclick = function(){
  var modal = document.getElementById("modal");
  modal.className = modal.className.replace("active", "");
  recognizer.stopScanning(true);
  document.getElementById("confirmedResult").innerText = "Result: " + document.getElementById("result").innerText;
}

let rescanButton = document.getElementById("rescanButton");
rescanButton.onclick = function(){
  var modal = document.getElementById("modal");
  modal.className = modal.className.replace("active", "");
  recognizer.resumeScanning();
}

// Specify a license, you can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=guide&product=dlr&package=js to get your own trial license good for 30 days. 
Dynamsoft.DLR.LabelRecognizer.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxMDc0MDY2LVRYbFhaV0pRY205cSIsIm9yZ2FuaXphdGlvbklEIjoiMTAxMDc0MDY2In0=';
let recognizer;
let cameraEnhancer;
// Initialize and use the library
init();

async function init(){
  Dynamsoft.DLR.LabelRecognizer.onResourcesLoadStarted = (resourcePath) => {
    console.log("Loading " + resourcePath);
    // Show a visual cue that a model file is being downloaded
    modelLoading = document.createElement("div");
    modelLoading.innerText = "Loading model...";
    document.body.prepend(modelLoading);
  };
  Dynamsoft.DLR.LabelRecognizer.onResourcesLoaded = (resourcePath) => {
      console.log("Finished loading " + resourcePath);
      if (modelLoading) {
        modelLoading.remove();
        modelLoading = null;
      }
  };
  recognizer = await Dynamsoft.DLR.LabelRecognizer.createInstance();
  Dynamsoft.DCE.CameraEnhancer.defaultUIElementURL = Dynamsoft.DLR.LabelRecognizer.defaultUIElementURL;
  cameraEnhancer = await Dynamsoft.DCE.CameraEnhancer.createInstance();
  recognizer.setImageSource(cameraEnhancer);
  recognizer.onImageRead = results => {
    if (results.length>0) {
      recognizer.pauseScanning();
      let text = "";
      for (let result of results) {
        for (let lineResult of result.lineResults) {
          text = text + lineResult.text + "\n";
        }
      }
      document.getElementById("result").innerText = text;
      document.getElementById("modal").className += " active";
    }
  };
  let template = document.getElementById("template").selectedOptions[0].value;
  await recognizer.updateRuntimeSettingsFromString(template); // will load model
  document.getElementById("status").remove();
  initialized = true;
}

async function startScan(){
  if (recognizer) {
    await recognizer.startScanning(true);
    return true;
  }else{
    return false;
  }
}

function hideControls(){
  document.getElementById("controls").style.display = "none";
}

