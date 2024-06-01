const addVertexButton = document.createElement("edgeButton");
document.getElementById("addGraphButton").addEventListener("click", addGraph);
document.getElementById("saveNewGraphButton").addEventListener("click",
    readInputData);
document.getElementById("saveNewGraphButton").style.display = "none";
let vertexIndex = 0;

defaultGraph();

function defaultGraph() {
  const defaultGraph = {
    0: {1: 4, 2: 12, 3: 21, 4: 7},
    1: {2: 8, 3: 19, 4: 3},
    2: {3: 2, 4: 7},
    3: {4: 10, 5: 8},
    4: {5:14},
    5: {}
  }

  getGraph(defaultGraph);
}

function getGraph(weightedGraph) {
  let graphString = "Граф: " + "\n";

  for (let vertex in weightedGraph) {
    for (let neighborVertex in weightedGraph[vertex]) {
      const weight = weightedGraph[vertex][neighborVertex];
      console.log("Дефолтний граф: "+weightedGraph);
      graphString = graphString + vertex + " та "
          + neighborVertex
          + ": вага "
          + weight + "\n";
    }
  }
  document.getElementById("graphLabel").textContent = graphString;
  document.getElementById("findDistances").addEventListener("click",
      function () {
        findTerms(weightedGraph);
      });
}

function findTerms(graph) {
  let graphLength = Object.keys(graph).length;

  let earlyTerms = new Array(graphLength).fill(0);
  earlyTerms[0] = 0;

  for (let i = 0; i < graphLength - 1; i++) {
    for (let neighborVertex in graph[i]) {
      let weight = parseInt(graph[i][neighborVertex]);
      if (earlyTerms[i] + weight > earlyTerms[neighborVertex]) {
        earlyTerms[neighborVertex] = earlyTerms[i] + weight;
      }
    }
  }

  console.log("Ранні терміни: ", earlyTerms);

  let lateTerms = new Array(graphLength).fill(
      earlyTerms[earlyTerms.length - 1]);

  for (let i = graphLength - 1; i > 0; i--) {

    for (let j = 0; j < i; j++) {
      for (let neighborVertex in graph[j]) {
        neighborVertex = parseInt(neighborVertex);
        if (neighborVertex === i) {
          let weight = parseInt(graph[j][neighborVertex]);

          if (lateTerms[i] - weight < earlyTerms[i]) {
            lateTerms[j] = earlyTerms[i] - weight;
          }
        }
      }
    }
  }
  console.log("Пізні терміни: ", lateTerms);

  let reserves = new Array(graphLength);
  for (let i = 0; i < earlyTerms.length; i++) {
    reserves[i] = parseInt(lateTerms[i]) - parseInt(earlyTerms[i]);
  }
  console.log("Резерви часу: ", reserves);

  let criticalPath = [];
  for (let i = 0; i < reserves.length; i++) {
    if (parseInt(reserves[i]) === 0) {
      criticalPath.push(i.valueOf());
    }
  }
  console.log("Критичний шлях: ", criticalPath);

  let earlyTermsString = "T раннє: ";
  let lateTermsString = "T пізнє: ";
  let reservesString = "Резерв часу: ";

  for (let i = 0; i < reserves.length; i++) {
    earlyTermsString = earlyTermsString + i + "(" + earlyTerms[i] + "), ";
    lateTermsString = lateTermsString + i + "(" + lateTerms[i] + "), ";
    reservesString = reservesString + i + "(" + reserves[i] + "), ";
  }

  let criticalPathString = "Критичний шлях: 0";

  for (let i = 1; i < criticalPath.length; i++) {
    criticalPathString = criticalPathString + "-" + criticalPath[i];
  }

  let totalResources = 0;
  let criticalPathLength = earlyTerms[earlyTerms.length - 1];

  for (let i = 0; i < graphLength; i++) {
    for (let neighborVertex in graph[i]) {
      let weight = parseInt(graph[i][neighborVertex]);
      totalResources = totalResources + weight;
    }
  }

  console.log(criticalPathString);
  console.log("Потрібні ресурси: " + totalResources);
  console.log("Потрібні ресурси на критичному шляху: " + criticalPathLength);
  document.getElementById("distanceLabel").textContent = earlyTermsString + "\n"
      + lateTermsString + "\n" + reservesString + "\n" + criticalPathString
      + "\n" + "Потрібні ресурси: " + totalResources + "\n"
      + "Потрібні ресурси на критичному шляху: " + criticalPathLength;
}

function addGraph() {
  document.getElementById("findDistances").style.display = "none";
  document.getElementById("saveNewGraphButton").style.display = "block";
  vertexIndex = 0;
  document.getElementById("graphLabel").textContent = null;
  document.getElementById("distanceLabel").textContent = null;
  document.getElementById("addGraphButton").style.display = "none";

  let infoString = "";

  const infoLabel = document.createElement("label");
  infoLabel.textContent = infoString;
  document.getElementById("panelContainer").appendChild(infoLabel);

  for (let i = 0; i < 3; i++) {
    addVertexElements(vertexIndex);
  }

  addVertexButton.classList.add("myButton")
  addVertexButton.textContent = "Додати вершину";
  addVertexButton.addEventListener("click", function () {
    addVertexElements(vertexIndex);
  });

  document.getElementById("mainPanel").appendChild(addVertexButton);
}

function addVertexElements() {
  const panelContainer = document.getElementById("panelContainer");

  const panel = document.createElement("div");
  panel.classList.add("panel");

  const vertexLabel = document.createElement("label");
  vertexLabel.textContent = "Вершина " + vertexIndex;
  vertexIndex++;

  const edgePanel = document.createElement("edgePanel");
  edgePanel.classList.add("edgePanel");

  const edgeButton = document.createElement("edgeButton");
  edgeButton.classList.add("myButton")
  edgeButton.textContent = "Додати ребро";
  edgeButton.addEventListener("click", function () {
    addEdgeElements(edgePanel);
  });

  panel.appendChild(vertexLabel);
  panel.appendChild(edgePanel)
  panel.appendChild(edgeButton);
  addEdgeElements(edgePanel);

  panelContainer.appendChild(panel);
}

function addEdgeElements(panel) {
  const edgeLabel = document.createElement("label");
  edgeLabel.textContent = " => ребро ";

  const edgeInput = document.createElement("input");

  const weightLabel = document.createElement("label");
  weightLabel.textContent = " вага: ";

  const weightInput = document.createElement("input");

  panel.appendChild(edgeLabel);
  panel.appendChild(edgeInput);
  panel.appendChild(weightLabel);
  panel.appendChild(weightInput);
}

function readInputData() {
  const panelContainer = document.getElementById("panelContainer");
  const panels = panelContainer.querySelectorAll(".panel");

  const inputData = {};

  panels.forEach((panel, index) => {
    const inputs = panel.querySelectorAll("input");

    inputData[index] = {};

    for (let i = 0; i < inputs.length; i = i + 2) {
      inputData[index][inputs[i].value] = inputs[i + 1].value;
    }
  });
  inputData[Object.keys(inputData).length-1] = {};

  document.getElementById("findDistances").style.display = "block";
  document.getElementById("saveNewGraphButton").style.display = "none";
  document.getElementById("addGraphButton").style.display = "block";
  document.getElementById("panelContainer").textContent = null;
  addVertexButton.style.display = "none";

  getGraph(inputData);
}