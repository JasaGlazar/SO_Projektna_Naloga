
$(function () {
  // Create the jsTree
  var tree = $('#jstree').jstree({
    'core': {
      'data': [
        {
          'text': 'Hierarhija kriterijev',
          'state': {
            'opened': true
          },
          'children': []
        }
      ],
      'check_callback': true
    },
    'plugins': ['dnd', 'contextmenu']
  });


     // Handle add button click
     $('#add-btn').click(function() {
      var selected = tree.jstree('get_selected');
      if (selected.length === 0) {
        // No node selected, add new top-level node
        tree.jstree('create_node', '#', {
          'text': 'New Node',
          'state': {
            'opened': true
          },
          'children': []
        });
      } else {
        // Add new child node
        tree.jstree('create_node', selected[0], {
          'text': 'New Node',
          'state': {
            'opened': true
          },
          'children': []
        });
        tree.jstree('open_node', selected[0]);
      }
    });

    // Handle edit button click
    $('#edit-btn').click(function() {
      var selected = tree.jstree('get_selected');
      if (selected.length === 0) {
        alert('Please select a node to edit.');
      } else {
        tree.jstree('edit', selected[0]);
      }
    });

    // Handle delete button click
    $('#delete-btn').click(function() {
      var selected = tree.jstree('get_selected');
      if (selected.length === 0) {
        alert('Please select a node to delete.');
      } else {
        tree.jstree('delete_node', selected);
      }
    });


    $('#submit-btn').click(function() {
      // Usage example:
      $(`#table-container`).empty();
  var hierarchy = $('#jstree').jstree(true).get_json('#', { 'flat': false });
  var flattenedHierarchy = flattenHierarchy(hierarchy[0]);
  //createTables(flattenedHierarchy);
  generateTables(flattenedHierarchy);
  //var alternatives = getAlternatives();
  generateAlternativeTables();
    })






$(document).ready(function() {
  // your JavaScript code here
  
  // get the new alternative input and add a listener for the "Enter" key
  const newAlternativeInput = document.getElementById('new-alternative-input');
  newAlternativeInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      addNewAlternative();
    }
  });

// get the "Add" button and add a click listener to it
const addAlternativeBtn = document.getElementById('add-alternative-btn');
addAlternativeBtn.addEventListener('click', addNewAlternative);

// get the "Delete" buttons for each alternative and add a click listener to them
const deleteButtons = document.querySelectorAll('.delete-alternative-btn');
deleteButtons.forEach(button => button.addEventListener('click', deleteAlternative));

// function for adding a new alternative
function addNewAlternative() {
  const newAlternativeName = newAlternativeInput.value;

  // check if the input is not empty
  if (newAlternativeName.trim() !== '') {
    // create a new list item for the alternative
    const newAlternativeListItem = document.createElement('li');
    newAlternativeListItem.className = 'list-group-item';
    newAlternativeListItem.innerText = newAlternativeName;

    // create a delete button for the alternative
    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn btn-danger delete-alternative-btn';
    deleteButton.innerText = 'Odstrani';

    // append the delete button to the new list item
    newAlternativeListItem.appendChild(deleteButton);

    // append the new list item to the alternatives list
    const alternativesList = document.getElementById('alternatives-list');
    alternativesList.appendChild(newAlternativeListItem);

    // clear the input field
    newAlternativeInput.value = '';

    // add a click listener to the delete button
    deleteButton.addEventListener('click', deleteAlternative);
  }
  else{
    window.alert("Vnesite alternativo");
  }
}

// function for deleting an alternative
function deleteAlternative(event) {
  // get the parent list item of the delete button that was clicked
  const listItem = event.target.closest('li');

  // remove the list item from the list
  listItem.remove();
}
})
});
function generateTables(data) {
  // Find all nodes with children
  const nodesWithChildren = data.filter(node => node.children.length > 0);

  // Create a table for each node with children
  nodesWithChildren.forEach(node => {
    // Create table element
    const table = document.createElement('table');

    // Create table header row with child node names
    const headerRow = table.insertRow();
    const parentCell = headerRow.insertCell();
    parentCell.appendChild(document.createTextNode(node.text));
    parentCell.style.fontWeight = "bold";
    node.children.forEach(childNode => {
      const cell = headerRow.insertCell();
      cell.appendChild(document.createTextNode(childNode.text));
    });

    // Create table body rows for each child
    node.children.forEach(childNode => {
      const bodyRow = table.insertRow();
      const childCell = bodyRow.insertCell();
      childCell.appendChild(document.createTextNode(childNode.text));

      // Create table cells for each child comparison
      node.children.forEach(innerChildNode => {
        const cell = bodyRow.insertCell();
        if (childNode.id === innerChildNode.id) {
          cell.appendChild(document.createTextNode("1"));
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.addEventListener('input', function() {
            const row = this.parentNode.parentNode.rowIndex;
            const col = this.parentNode.cellIndex;
            const reciprocalInput = table.rows[col].cells[row].children[0];
            if (this.value) {
              const reciprocalValue = 1 / parseFloat(this.value);
              reciprocalInput.value = reciprocalValue.toFixed(2);
              //`1/${this.value}`;
            } else {
              reciprocalInput.value = "";
            }
          });
          input.style.width = "50px";
          input.style.textAlign = "center";
          cell.appendChild(input);
        }
      });
    });

    // Add table to the node element
    $(`#table-container`).append(table);
  });
}


$( function() {
  $( "#tabs" ).tabs();
});


function getAlternatives() {
  const alternativesList = document.getElementById('alternatives-list');
  const alternatives = [];

  // Skip the first item and start iterating from the second item
  for (let i = 1; i < alternativesList.children.length; i++) {
    const alternativeName = alternativesList.children[i].innerText;

    // Remove the "Odstrani" button text
    const alternativeNameWithoutButton = alternativeName.replace('Odstrani', '').trim();

    alternatives.push(alternativeNameWithoutButton);
  }

  return alternatives;
}

function getCriteriaHierarchy() {
  const criteriaHierarchy = [];
  var hierarchy = $('#jstree').jstree(true).get_json('#', { 'flat': false });
  var flattenedHierarchy = flattenHierarchy(hierarchy[0]);

  // Use the flattenHierarchy function to get the criteria hierarchy
  // Replace the criteriaHierarchy variable with the hierarchy array returned by flattenHierarchy
  //const hierarchy = flattenHierarchy(criteria);

  // Iterate through the hierarchy and only add the most inner sub-criteria of a parent to the criteriaHierarchy array
  for (let i = 0; i < flattenedHierarchy.length; i++) {
    const current = flattenedHierarchy[i];
    const children = current.children;

    if (children.length === 0) {
      criteriaHierarchy.push(current);
    }
  }

  return criteriaHierarchy;
}

function generateAlternativeTables() {
  const alternatives = getAlternatives();
  const criteriaHierarchy = getCriteriaHierarchy();

  // Iterate through each sub-criteria and create a table for alternative grading
  criteriaHierarchy.forEach(criterion => {
    // Create table element
    const table = document.createElement('table');

    // Create table header row with alternative names
    const headerRow = table.insertRow();
    const criteriaCell = headerRow.insertCell();
    criteriaCell.appendChild(document.createTextNode(criterion.text));
    criteriaCell.style.fontWeight = "bold";
    alternatives.forEach(alternative => {
      const cell = headerRow.insertCell();
      cell.appendChild(document.createTextNode(alternative));
    });

    // Create table body rows for each alternative
    alternatives.forEach(outerAlternative => {
      const bodyRow = table.insertRow();
      const outerAlternativeCell = bodyRow.insertCell();
      outerAlternativeCell.appendChild(document.createTextNode(outerAlternative));

      alternatives.forEach(innerAlternative => {
        const cell = bodyRow.insertCell();
        if (outerAlternative === innerAlternative) {
          cell.appendChild(document.createTextNode("1"));
        } else {
          const input = document.createElement('input');
          input.type = 'text';
          input.addEventListener('input', function() {
            const row = this.parentNode.parentNode.rowIndex;
            const col = this.parentNode.cellIndex;
            const reciprocalInput = table.rows[col].cells[row].children[0];
            if (this.value) {
              const value = math.evaluate(this.value);
              if (math.isInteger(value)) {
                reciprocalInput.value = value === 0 ? "" : (1 / parseFloat(value)).toFixed(2);
                //math.format(math.fraction(1 / value), { fraction: 'ratio' });
              } else {
                const reciprocalValue = 1 / parseFloat(value);
                //math.divide(1, value);
                if (math.isNumeric(reciprocalValue)) {
                  const reciprocalFraction = math.fraction(reciprocalValue);
                  reciprocalInput.value = reciprocalValue;
                  //reciprocalFraction.n.toString();
                } else {
                  reciprocalInput.value = "";
                }
              }
            } else {
              reciprocalInput.value = "";
            }
            
            
          });
          
          input.style.width = "50px";
          input.style.textAlign = "center";
          cell.appendChild(input);
        }
      });
    });

    // Add table to the node element
    $(`#table-container-alternative`).append(table);
  });
}


function flattenHierarchy(node) {
  var flattened = [];
  flattened.push({
    id: node.id,
    text: node.text,
    parent: node.parent,
    children: node.children
  });
  if (node.children) {
    node.children.forEach(function(child) {
      flattened = flattened.concat(flattenHierarchy(child));
    });
  }
  return flattened;
}


/*document.getElementById("calculate-btn").addEventListener("click", function() {
  //Pridobitev matrik
  let matrices = retrieveTablesData();
  let matricesAlternatives = retrieveTablesDataAlternatives();
  
  //Normaliziranje matrik
  let normalizedMatrices = normalizeMatrices(matrices);
  let normalizedMatricesAlternatives = normalizeMatrices(matricesAlternatives);

  //Uteži in koristnost
  let priorityVectors = computePriorityVectors(normalizedMatrices);
  let priorityVectorsAlternatives = computePriorityVectors(normalizedMatricesAlternatives);


 

  var hierarchy = $('#jstree').jstree(true).get_json('#', { 'flat': false });
  var root = hierarchy[0];  // Assuming that the root of your criteria hierarchy is the first item in hierarchy
  var allPaths = getAllPaths(root);

  calculateFinalScores(allPaths, priorityVectors, priorityVectorsAlternatives);
   

});*/
document.getElementById("calculate-btn").addEventListener("click", function() {
  // Retrieve matrices
  let matrices = retrieveTablesData();
  let matricesAlternatives = retrieveTablesDataAlternatives();
  
  console.log('matrices - KALKULIRANJE:', matrices);
  console.log('matricesAlternatives - KALKULIRANJE:', matricesAlternatives);

  // Normalize matrices
  let normalizedMatrices = normalizeMatrices(matrices);
  let normalizedMatricesAlternatives = normalizeMatrices(matricesAlternatives);

  console.log('normalizedMatrices - KALKULIRANJE:', normalizedMatrices);
  console.log('normalizedMatricesAlternatives - KALKULIRANJE:', normalizedMatricesAlternatives);

  // Compute priority vectors
  let priorityVectors = computePriorityVectors(normalizedMatrices);
  let priorityVectorsAlternatives = computePriorityVectors(normalizedMatricesAlternatives);

  console.log('priorityVectors - KALKULIRANJE:', priorityVectors);
  console.log('priorityVectorsAlternatives - KALKULIRANJE:', priorityVectorsAlternatives);

  var hierarchy = $('#jstree').jstree(true).get_json('#', { 'flat': false });
  var root = hierarchy[0];  // Assuming that the root of your criteria hierarchy is the first item in hierarchy
  
  var allPaths = getAllPaths(root);
  console.log('allPaths - KALKULIRANJE:', allPaths);

  var flattenedHierarchy = flattenHierarchy(root);
  console.log('flattenedHierarchy - KALKULIRANJE:', flattenedHierarchy);

  calculateFinalScores(priorityVectors, priorityVectorsAlternatives);
});



function retrieveTablesData() {
  // Get all tables
  //const tables = document.querySelectorAll('table');
  const tables = document.querySelectorAll('#table-container table');

// Loop through each table and retrieve the data
let allTablesData = Array.from(tables).map((table) => {
  // Get the number of rows (or columns) in the table, excluding the header row
  let n = table.rows.length - 1;

  // Create an empty matrix to hold the data
  let matrix = Array.from({ length: n }, () => Array(n).fill(1));

  // Loop through each row and column
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      // Get the cell at the intersection of the current row and column
      let cell = table.rows[i].cells[j];

      // Check if the cell has an input field
      if (cell.children.length > 0 && cell.children[0].tagName === 'INPUT') {
        // Get the input field
        let inputField = cell.children[0];

        // Get the input value
        let value = parseFloat(inputField.value);

        // Log the input field and its value
        console.log('Input field:', inputField, 'Value:', value);

        // Save the value and its reciprocal to the matrix
        matrix[i - 1][j - 1] = value;
        matrix[j - 1][i - 1] = 1 / value;
      }
    }
  }

  // Log the matrix
  console.log('Matrix:', matrix);

  return matrix;
});

return allTablesData;
}

function retrieveTablesDataAlternatives() {
  // Get all tables
  //const tables = document.querySelectorAll('table');
  const tables = document.querySelectorAll('#table-container-alternative table');

// Loop through each table and retrieve the data
let allTablesData = Array.from(tables).map((table) => {
  // Get the number of rows (or columns) in the table, excluding the header row
  let n = table.rows.length - 1;

  // Create an empty matrix to hold the data
  let matrix = Array.from({ length: n }, () => Array(n).fill(1));

  // Loop through each row and column
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= n; j++) {
      // Get the cell at the intersection of the current row and column
      let cell = table.rows[i].cells[j];

      // Check if the cell has an input field
      if (cell.children.length > 0 && cell.children[0].tagName === 'INPUT') {
        // Get the input field
        let inputField = cell.children[0];

        // Get the input value
        let value = parseFloat(inputField.value);

        // Log the input field and its value
        //console.log('Input field:', inputField, 'Value:', value);

        // Save the value and its reciprocal to the matrix
        matrix[i - 1][j - 1] = value;
        matrix[j - 1][i - 1] = 1 / value;
      }
    }
  }

  // Log the matrix
  console.log('Matrix:', matrix);

  return matrix;
});

return allTablesData;
}


function normalizeMatrices(matrices) {
  return matrices.map((matrix, idx) => {
    console.log(`Matrix ${idx + 1} before normalization:`);
    console.log(matrix);

    // Calculate the sum of each column
    let columnSums = matrix[0].map((col, j) => matrix.reduce((sum, row) => sum + row[j], 0));

   // console.log(`Column sums for matrix ${idx + 1}:`);
   // console.log(columnSums);

    // Divide each element in a column by the sum of the column
    let normalizedMatrix = matrix.map(row => row.map((value, j) => value / columnSums[j]));

    console.log(`Matrix ${idx + 1} after normalization:`);
    console.log(normalizedMatrix);

    return normalizedMatrix;
  });
}

function computePriorityVectors(normalizedMatrices) {
  return normalizedMatrices.map((matrix) => {
    // Calculate the average of each row
    let priorityVector = matrix.map((row) => row.reduce((sum, value) => sum + value, 0) / row.length);

    console.log('Priority vector:');
    console.log(priorityVector);

    return priorityVector;
  });
}


function getAllPaths(node) {
  if (node.children.length === 0) {
    return [[node.id]];
  } else {
    let paths = [];
    for (let child of node.children) {
      let childPaths = getAllPaths(child);
      for (let childPath of childPaths) {
        paths.push([node.id].concat(childPath));
      }
    }
    return paths;
  }
}


/*function calculateFinalScores(paths, priorityVectors, alternativePriorityVectors) {
  let finalScores = {};
  for (let path of paths) {
    // Get the product of priorities along the path
    let product = path.reduce((product, nodeId, index) => {
      if (index === path.length - 1) {
        // If it's the last node in the path, get the alternative priority vector
        let alternativePriorityVector = alternativePriorityVectors[nodeId];
        for (let alternative in alternativePriorityVector) {
          if (!(alternative in finalScores)) {
            finalScores[alternative] = 0;
          }
          // Add the product of priorities to the final score of the alternative
          finalScores[alternative] += product * alternativePriorityVector[alternative];
        }
      } else {
        // If it's not the last node, get the priority vector
        return product * priorityVectors[nodeId];
      }
    }, 1);
  }
  console.log(finalScores);
  return finalScores;
}*/
/*function calculateFinalScores(criterionPriorityVectors, alternativePriorityVectors, paths) {
  console.log("Criterion priority vectors: ", criterionPriorityVectors);
  console.log("Alternative priority vectors: ", alternativePriorityVectors);
  console.log("Paths: ", paths);

  // Initialize an empty object to store the final scores
  let finalScores = {};

  // For each path
  paths.forEach((path) => {
    console.log("Processing path: ", path);

    // Get the priority vector for alternatives for the last node in the path
    let lastNode = path[path.length - 1];
    let alternatives = alternativePriorityVectors[lastNode];

    console.log("Alternatives for last node in path: ", alternatives);

    // Calculate the product of priority vectors along the path
    let pathProduct = path.reduce((product, nodeId) => {
      return product * (criterionPriorityVectors[nodeId] || 1);
    }, 1);

    console.log("Path product: ", pathProduct);

    // Add the products to the final scores for each alternative
    for (let alternative in alternatives) {
      if (!(alternative in finalScores)) {
        finalScores[alternative] = 0;
      }

      finalScores[alternative] += pathProduct * alternatives[alternative];
    }
  });

  console.log("Final scores: ", finalScores);
  return finalScores;
}*/
/*function calculateFinalScores(allPaths, criterionPriorityVectors, alternativePriorityVectors) {
  console.log('Criterion priority vectors: ', criterionPriorityVectors);
  console.log('Alternative priority vectors: ', alternativePriorityVectors);
  console.log('Paths: ', allPaths);

  const finalScores = {};

  allPaths.forEach((path, pathIndex) => {
    console.log('Processing path: ', path);

    let pathProduct = 1;
    path.forEach((nodeId, nodeIndex) => {
      const criterionPriority = criterionPriorityVectors[0][nodeIndex];
      pathProduct *= criterionPriority;

      console.log('Criterion priority for node ' + nodeId + ': ', criterionPriority);
    });

    const lastNodeInPath = path[path.length - 1];
    const alternatives = alternativePriorityVectors[pathIndex];

    console.log('Alternatives for last node in path: ', alternatives);

    if (alternatives) {
      alternatives.forEach((alternativePriority, alternativeIndex) => {
        if (!finalScores[alternativeIndex]) {
          finalScores[alternativeIndex] = 0;
        }

        finalScores[alternativeIndex] += pathProduct * alternativePriority;

        console.log('Intermediate score for alternative ' + alternativeIndex + ': ', finalScores[alternativeIndex]);
      });
    }

    console.log('Path product: ', pathProduct);
  });

  console.log('Final scores: ', finalScores);
}*/

/*function calculateNodeScore(node, alternativePriorityVectors, criterionPriorityVectors, depth = 0) {
  let nodeScore = 0;

  if(node.children.length > 0) {
      // If the node has children, its score is the sum of its children's scores
      for(const child of node.children) {
          const childScore = calculateNodeScore(child, alternativePriorityVectors, criterionPriorityVectors, depth + 1);
          nodeScore += childScore;
      }
  } else {
      // If the node is a leaf (i.e., has no children), its score is the product of its own priority and the priority of the alternative
      for(let i = 0; i < alternativePriorityVectors[depth].length; i++) {
          if(!finalScores[i]) finalScores[i] = 0;
          const alternativePriority = alternativePriorityVectors[depth][i];
          const criterionPriority = criterionPriorityVectors[0][depth];
          nodeScore = criterionPriority * alternativePriority;
          finalScores[i] += nodeScore;
      }
  }

  return nodeScore;
}

let finalScores = {};
function calculateFinalScores(root, criterionPriorityVectors, alternativePriorityVectors) {
  finalScores = {};  // Reset finalScores for each calculation
  calculateNodeScore(root, alternativePriorityVectors, criterionPriorityVectors);
  console.log('Final scores: ', finalScores);
}
*/

//Tota sploh ni vreji ->
/*function calculateFinalScores(allPaths, criterionPriorityVectors, alternativePriorityVectors) {
  const finalScores = {};

  allPaths.forEach((path) => {
    const pathProduct = path.reduce((product, nodeId, index) => {
      return product * criterionPriorityVectors[index][nodeId];
    }, 1);

    Object.keys(alternativePriorityVectors).forEach((alternativeId) => {
      const alternativeScore = alternativePriorityVectors[alternativeId][path[path.length - 1]];
      finalScores[alternativeId] = (finalScores[alternativeId] || 0) + pathProduct * alternativeScore;
    });
  });

  console.log('Final scores: ', finalScores);

  return finalScores;
}*/

function calculateFinalScores(criterionPriorityVectors, alternativesPriorityVectors) {
  // Initialize an empty array for the final scores
  let finalScores = [];

  // Initialize an array for the number of alternatives
  let numAlternatives = alternativesPriorityVectors[0].length;
  for (let i = 0; i < numAlternatives; i++) {
      finalScores[i] = 0;
  }

  // Iterate through each criterion
  for (let i = 0; i < criterionPriorityVectors.length; i++) {
      let criterionWeight = criterionPriorityVectors[i][0]; // Get the weight of the current criterion
      let alternativesGrades = alternativesPriorityVectors[i]; // Get the grades of the alternatives for the current criterion

      // Add the weighted grade of each alternative to its final score
      for (let j = 0; j < numAlternatives; j++) {
          finalScores[j] += criterionWeight * alternativesGrades[j];
      }
  }
  console.log(finalScores);
  return finalScores;
}



