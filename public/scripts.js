const baseUrl = "http://flip3.engr.oregonstate.edu:3005/"

// load table upon visiting the page initially
// also calls makeTable to display the table
document.addEventListener('DOMContentLoaded', (event) => {
    getData();
});



// gets all rows from the table, and calls makeTable to render them on the page
const getData = () => {
    let req = new XMLHttpRequest(); 
    req.open("GET", baseUrl, true); 
    req.setRequestHeader('Content-Type', 'application/json'); 
    req.addEventListener('load', () => {
        if(req.status >=200 && req.status < 400) {
            let res = JSON.parse(req.response);
            makeTable(res);
        } else {
            console.log("There was an error retrieving the data from the table");
            return;
        }
    });
    req.send(null);
}

// function that governs submit button to add a new exercise to the table
const addButton = () => {
    document.getElementById('add-exercise').addEventListener('click', (event) => {
        let req = new XMLHttpRequest();
        let context = {}

        // retrieve values submitted in HTML form
        context.name = document.getElementById('name-input').value
        context.reps = document.getElementById('reps-input').value
        context.weight = document.getElementById('weight-input').value
        context.date = document.getElementById('date-input').value;

        if (document.getElementById('kg').checked == true) {
            context.units = "kg";
        } else {
            context.units = "lbs";
        }

        req.open("POST", baseUrl, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                getData();
            } else {
                console.log("Error when trying to make request: " + req.statusText);
            }
        });

        req.send(JSON.stringify(context));
        event.preventDefault();
    })
}

// renders table with exercises from request data
const makeTable = (info) => {
    let table = document.getElementById('exercise-table');

    // remove all existing rows
    const numRows = table.childNodes.length;

    for (let i = 0; i < numRows; i++) {
        table.childNodes[0].remove();
    }

    // make brand new table with response data
    info.forEach((row) => {

        // creates a new row, and adds the data to it
        let nextRow = document.createElement('tr');

        let dispName = document.createElement('td');
        let nameForm = document.createElement('input')
        nameForm.type = 'text';
        nameForm.value = row['name'];
        nameForm.disabled = true;
        dispName.appendChild(nameForm);
        nextRow.appendChild(dispName);

        let dispReps = document.createElement('td');
        let repsForm = document.createElement('input');
        repsForm.type = 'number';
        repsForm.value = row['reps']
        repsForm.disabled = true;
        dispReps.appendChild(repsForm);
        nextRow.appendChild(dispReps);

        let dispWeight = document.createElement('td');
        let weightForm = document.createElement('input');
        weightForm.type = 'number';
        weightForm.value = row['weight'];
        weightForm.disabled = true;
        dispWeight.appendChild(weightForm);
        nextRow.appendChild(dispWeight);

        let dispDate = document.createElement('td');
        let dateForm = document.createElement('input');
        dateForm.type = 'text';
        let date = row['date'].slice(5, 10);
        let year = row['date'].slice(0, 4);
        dateForm.value = date + '-' + year;
        dateForm.disabled = true; 
        dispDate.appendChild(dateForm);
        nextRow.appendChild(dispDate);

        let dispUnits = document.createElement('td');
        let unitsForm = document.createElement('input');
        unitsForm.type = 'text';
        unitsForm.value = row['units'];
        unitsForm.disabled = true;
        dispUnits.appendChild(unitsForm);
        nextRow.appendChild(dispUnits);

        // adding update form and button to row
        let updateForm = document.createElement('form');
        let updateButton = document.createElement('input');
        updateButton.type = 'button';
        updateButton.id = row['id'];
        updateButton.value = 'Update';
        updateButton.addEventListener('click', (event) => {updateRow(event.currentTarget); });

        let updateCell = document.createElement('td');
        updateForm.appendChild(updateButton);
        updateCell.appendChild(updateForm);
        nextRow.appendChild(updateCell)

        // adding delete button to row
        let deleteButton = document.createElement('input');
        deleteButton.type = 'button';
        deleteButton.id = row['id'];
        deleteButton.value = 'Delete';
        deleteButton.addEventListener('click', (event) => {deleteRow(event.currentTarget); });

        let deleteCell = document.createElement('td');
        deleteCell.appendChild(deleteButton);
        nextRow.appendChild(deleteCell)

        table.appendChild(nextRow)
    })
}

// function to handle update button
const updateRow = (updateButton) => {
    
    const rowId = updateButton.id;
    updateButton.disabled = true;
    let row = updateButton.parentElement.parentElement.parentElement;
    console.log(row);
    
    for (let i = 0; i < row.cells.length; i++) {
        row.cells[i].childNodes[0].disabled = false;
    }
    
    row.cells[0].firstChild.id = 'name-update';
    row.cells[1].firstChild.id = 'reps-update';
    row.cells[2].firstChild.id = 'weight-update';
    row.cells[3].firstChild.type = 'date';
    row.cells[3].firstChild.id = 'date-update';
    row.cells[4].firstChild.id = 'units-update';

    const submitButton = document.createElement('input');
    submitButton.type = 'button';
    submitButton.value = 'Submit Updates';
    submitButton.addEventListener('click', (event) => {
        let req = new XMLHttpRequest();
        let context = {}

        // retrieve values submitted in HTML form
        context.name = document.getElementById('name-update').value;
        context.reps = document.getElementById('reps-update').value;
        context.weight = document.getElementById('weight-update').value;
        context.date = document.getElementById('date-update').value;
        context.units = document.getElementById('units-update').value;
        context.id = rowId;

        req.open("PUT", baseUrl, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener('load', () => {
            if (req.status >= 200 && req.status < 400) {
                getData();
            } else {
                console.log("Error when trying to make request: " + req.statusText);
            }
        });

        req.send(JSON.stringify(context));
        event.preventDefault();
        })
    
    row.appendChild(submitButton);
}

// function to handle delete button
const deleteRow = (deleteButton) => {
    const rowId = deleteButton.id;
    let req = new XMLHttpRequest();
    let context = {};
    context.id = rowId;

    req.open("DELETE", baseUrl, true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', () => {
        if (req.status >= 200 && req.status < 400) {
            getData();
        } else {
            console.log("Error when trying to make request: " + req.statusText);
        }
    });
    req.send(JSON.stringify(context));
}


document.addEventListener('DOMContentLoaded', addButton)