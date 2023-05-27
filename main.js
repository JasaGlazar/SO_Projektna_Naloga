
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

//Funkcija za generiranje tabel za ocenjevanje kriterijev
function generateTables(data) {
  // Loop over all nodes in data
  data.forEach(node => {
    // Check if node has children
    if (node.children.length > 0) {
      // Create a new div for this node and add it to the table-container
      const nodeDiv = document.createElement('div');
      nodeDiv.id = node.text;  // use the node name as the div ID
      document.getElementById('table-container').appendChild(nodeDiv);

      // Create table element
      const table = document.createElement('table');
      table.classList.add("table", "table-bordered");

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

      // Add table to the node div
      nodeDiv.appendChild(table);
    }
  });
}

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

function getCriteriaHierarchyWithParents() {
  const criteriaHierarchyWithParents = [];
  const hierarchy = $('#jstree').jstree(true).get_json('#', { 'flat': false });
  const flattenedHierarchy = flattenHierarchy(hierarchy[0]);

  // Iterate through the flattened hierarchy and only add the most inner sub-criteria (leaf nodes)
  for (let i = 0; i < flattenedHierarchy.length; i++) {
    const current = flattenedHierarchy[i];
    const children = current.children;

    if (children.length === 0) {
      const parent = flattenedHierarchy.find(criterion => criterion.id === current.parent);
      const parentText = parent ? parent.text : null;
      const criterionWithParent = {...current, parentText: parentText};
      criteriaHierarchyWithParents.push(criterionWithParent);
    }
  }
  return criteriaHierarchyWithParents;
}

function generateAlternativeTables() {
  const alternatives = getAlternatives();
  const criteriaHierarchy = getCriteriaHierarchy();

  // Iterate through each sub-criteria and create a table for alternative grading
  criteriaHierarchy.forEach(criterion => {
    // Create div for this criterion
    const criterionDiv = document.createElement('div');
    criterionDiv.id = criterion.text.replace(/\s+/g, '-');

    // Create table element
    const table = document.createElement('table');
    table.classList.add("table", "table-bordered");

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
              } else {
                const reciprocalValue = 1 / parseFloat(value);
                if (math.isNumeric(reciprocalValue)) {
                  const reciprocalFraction = math.fraction(reciprocalValue);
                  reciprocalInput.value = reciprocalValue;
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

    // Add table to the div
    criterionDiv.appendChild(table);

    // Add div to the table container
    $(`#table-container-alternative`).append(criterionDiv);
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

function flattenHierarchy2(data, parent = null) {
  var result = [];
  if (data) {
    result.push({ id: data.id, text: data.text, parentId: parent ? parent.id : null, parentName: parent ? parent.text : null });

    if (data.children) {
      data.children.forEach(child => {
        result = result.concat(flattenHierarchy(child, data));
      });
    }
  }
  return result;
}

function createHierarchySequentially(flatHierarchy) {
  const findNodeDetails = (id) => {
      const node = flatHierarchy.find(item => item.id === id);
      if (!node) return null;
      const { priorityVector, criteria } = node;

      // Recursive call to add sub-criteria details
      const detailedCriteria = criteria.map(criterion => findNodeDetails(criterion) || criterion);

      return {
          id,
          priorityVector,
          criteria: detailedCriteria
      };
  };

  // The first node in flatHierarchy is considered as the root node
  const root = findNodeDetails(flatHierarchy[0].id);

  console.log(root);
  return root;
}

function createLeafToParentMapping(hierarchy) {
  let mapping = {};

  hierarchy.forEach(node => {
    if (node.criteria) {
      node.criteria.forEach(criteria => {
        mapping[criteria] = node.id;
      });
    }
  });

  return mapping;
}

function groupAlternativeGradesByParent(alternativeGrades, hierarchy) {
  const leafToParentMapping = createLeafToParentMapping(hierarchy);

  let groupedGrades = {};

  alternativeGrades.forEach(({id, priorityVector}) => {
    const parent = leafToParentMapping[id];
    if (!groupedGrades[parent]) {
      groupedGrades[parent] = [];
    }
    groupedGrades[parent].push({id, priorityVector});
  });

  return groupedGrades;
}

function calculateScore(hierarchy, grades) {
  // Recursive function to calculate the score
  function helper(hierarchy, parentWeight = 1) {
      let scores = [];

      for (let i = 0; i < hierarchy.criteria.length; i++) {
          const id = hierarchy.criteria[i].id || hierarchy.criteria[i];
          const weight = hierarchy.priorityVector[i];

          if (typeof hierarchy.criteria[i] === 'object') {
              // If this criteria has subcriteria, recurse
              scores = addScores(scores, helper(hierarchy.criteria[i], weight * parentWeight));
          } else {
              // Else, get the scores for this criteria from grades
              const gradeScores = grades[hierarchy.id].find(e => e.id === id).priorityVector.map(g => g * weight * parentWeight);
              scores = addScores(scores, gradeScores);
          }
      }
      return scores;
  }

  // Helper function to add two arrays of scores
  function addScores(arr1, arr2) {
      if (arr1.length === 0) return arr2;
      if (arr2.length === 0) return arr1;
      return arr1.map((val, i) => val + arr2[i]);
  }

  // Call the helper function for the root of the hierarchy
  return helper(hierarchy);
}





document.getElementById("calculate-btn").addEventListener("click", function() {
  // Retrieve matrices
  let matrices = retrieveTablesData();
  let matricesAlternatives = retrieveTablesDataAlternatives();
  
  console.log('matrices - KALKULIRANJE:', matrices);
  console.log('matricesAlternatives - KALKULIRANJE:', matricesAlternatives);

  // Normalize matrices
  let normalizedMatrices = normalizeCriterionMatrices(matrices);
  let normalizedMatricesAlternatives = normalizeMatrices(matricesAlternatives);

  console.log('normalizedMatrices - KALKULIRANJE:', normalizedMatrices);
  console.log('normalizedMatricesAlternatives - KALKULIRANJE:', normalizedMatricesAlternatives);
  
  // Compute priority vectors
  let priorityVectors = computeCriteriaPriorityVectors(normalizedMatrices);
  let priorityVectorsAlternatives = computePriorityVectors(normalizedMatricesAlternatives);

  console.log('priorityVectors - KALKULIRANJE:', priorityVectors);
  console.log('priorityVectorsAlternatives - KALKULIRANJE:', priorityVectorsAlternatives);

  

  const nestedHierarchy = createHierarchySequentially(priorityVectors);
  console.log("Nested hierarchy: ",nestedHierarchy);

  const groupedAlternativeGrades = groupAlternativeGradesByParent(priorityVectorsAlternatives, priorityVectors);

  console.log("Grupirane ocene alternativ: ",groupedAlternativeGrades);


  console.log("Rezultati: ",calculateScore(nestedHierarchy, groupedAlternativeGrades));

  let alternatives = getAlternatives();
  let scores = calculateScore(nestedHierarchy, groupedAlternativeGrades);

    // Create results HTML string
    let resultsHtml = "";
    for (let i = 0; i < alternatives.length; i++) {
      resultsHtml += `<p>Alternative: ${alternatives[i]}, Score: ${scores[i]}</p>`;
    }
  
    // Add results to div
    document.getElementById("results").innerHTML = resultsHtml;
  
});

function retrieveTablesData() {
  // Get all divs
  const divs = document.querySelectorAll('#table-container div');

  // Loop through each div and retrieve the data
  let allTablesData = Array.from(divs).map((div) => {
    const tables = div.querySelectorAll('table');
    let divData = Array.from(tables).map((table) => {
      // Get the number of rows (or columns) in the table, excluding the header row
      let n = table.rows.length - 1;

      // Create an empty matrix to hold the data
      let matrix = Array.from({ length: n }, () => Array(n).fill(1));

      // Create an empty array to hold the criterion names
      let criterionNames = Array(n);

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

            // Save the value and its reciprocal to the matrix
            matrix[i - 1][j - 1] = value;
            matrix[j - 1][i - 1] = 1 / value;
          }
        }

        // Retrieve the criterion name from the first cell of the current row
        criterionNames[i - 1] = table.rows[i].cells[0].innerText;
      }

      return {
        id: div.id,
        matrix,
        criteria: criterionNames,
      };
    });

    return divData;
  });

  return allTablesData.flat();
}


function retrieveTablesDataAlternatives() {
  // Get all divs
  const divs = document.querySelectorAll('#table-container-alternative div');

  // Loop through each div and retrieve the data
  let allTablesData = Array.from(divs).map((div) => {
    const tables = div.querySelectorAll('table');
    let divData = Array.from(tables).map((table) => {
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

            // Save the value and its reciprocal to the matrix
            matrix[i - 1][j - 1] = value;
            matrix[j - 1][i - 1] = 1 / value;
          }
        }
      }

      return {
        id: div.id,
        matrix
      };
    });

    return divData;
  });

  return allTablesData.flat();
}

//Funkcija za normaliziranje matrik:
function normalizeMatrices(matricesData) {
  return matricesData.map(({ id, matrix }, idx) => {
    console.log(`Matrix ${idx + 1} (ID: ${id}) before normalization:`);
    console.log(matrix);

    // Calculate the sum of each column
    let columnSums = matrix[0].map((col, j) => matrix.reduce((sum, row) => sum + row[j], 0));

    // console.log(`Column sums for matrix ${idx + 1}:`);
    // console.log(columnSums);

    // Divide each element in a column by the sum of the column
    let normalizedMatrix = matrix.map(row => row.map((value, j) => value / columnSums[j]));

    console.log(`Matrix ${idx + 1} (ID: ${id}) after normalization:`);
    console.log(normalizedMatrix);

    return {
      id,
      matrix: normalizedMatrix
    };
  });
}


function normalizeCriterionMatrices(matricesData) {
  return matricesData.map(({ id, matrix, criteria }, idx) => {
    console.log(`Matrix ${idx + 1} (ID: ${id}) before normalization:`);
    console.log(matrix);

    // Calculate the sum of each column
    let columnSums = matrix[0].map((col, j) => matrix.reduce((sum, row) => sum + row[j], 0));

    // console.log(`Column sums for matrix ${idx + 1}:`);
    // console.log(columnSums);

    // Divide each element in a column by the sum of the column
    let normalizedMatrix = matrix.map(row => row.map((value, j) => value / columnSums[j]));

    console.log(`Matrix ${idx + 1} (ID: ${id}) after normalization:`);
    console.log(normalizedMatrix);

    return {
      id,
      matrix: normalizedMatrix,
      criteria,
    };
  });
}

//Funkcija za računanje uteži/ koristnosti:
function computePriorityVectors(normalizedMatricesData) {
  return normalizedMatricesData.map(({ id, matrix }) => {
    // Calculate the average of each row
    let priorityVector = matrix.map((row) => row.reduce((sum, value) => sum + value, 0) / row.length);

    console.log(`Priority vector for ${id}:`);
    console.log(priorityVector);

    return {
      id,
      priorityVector
    };
  });
}


function computeCriteriaPriorityVectors(normalizedMatricesData) {
  return normalizedMatricesData.map(({ id, matrix, criteria }) => {
    // Calculate the average of each row
    let priorityVector = matrix.map((row) => row.reduce((sum, value) => sum + value, 0) / row.length);

    console.log(`Priority vector for ${id}:`);
    console.log(priorityVector);

    return {
      id,
      priorityVector,
      criteria,
    };
  });
}
