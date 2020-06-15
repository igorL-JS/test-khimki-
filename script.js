let dataTable = [];
let sorted = false;
let select = false;
let index = null;

function createTable(data) {
    let table = document.getElementById("table");
    let rows = '';
    for (let el of data) {
        rows += `<tr>
                     <td>${el.ID}</td>
                     <td>${el.Name}</td>
                     <td>${el.Age}</td>
                     <td>
                        <button class="button button4" onClick='editRow(this)' >Edit</button>
                        <button class="button button4" onClick='deleteRow(this)'>Delete</button>
                     </td>
                   </tr>`;
    }
    table.innerHTML = rows
}

// Создал локальный JSON-Server, с помощью fetch выгрузил данные и запушил в массив dataTable, отрисовал таблицу
async function fetchData() {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();
    dataTable.push(...data);
    createTable(dataTable);
}

fetchData();

// Общая ф-ция для сортировки (меняем направление сортировки)
function sortCol(nameCol) {
    sorted = !sorted;
    sorted
        ? document.getElementById(nameCol).innerHTML = `${nameCol} &#9660`
        : document.getElementById(nameCol).innerHTML = `${nameCol} &#9650`;
    (nameCol === 'Age' || nameCol === 'ID') ? sortNumberColumn(sorted, nameCol) : sortLetterColumn(sorted, nameCol);
    createTable(dataTable);
}

// сортируем ID или Age (числа)
function sortNumberColumn(sorted, nameCol) {
    dataTable.sort((user1, user2) => {
        return sorted ? user1[nameCol] - user2[nameCol] : user2[nameCol] - user1[nameCol]
    });

}

// в зависимости от index либо имя, либо фамилия
function sortByPartName(index) {
    dataTable.sort((user1, user2) => {
        const name1 = user1.Name.split(' ')[index];
        const name2 = user2.Name.split(' ')[index];
        return sorted ? name1.localeCompare(name2) : name2.localeCompare(name1)
    })
}

// сортируем Full name
function sortLetterColumn(sorted, nameCol) {
    (nameCol === 'Last name') ? sortByPartName(0)
        : sortByPartName(1)
}


function onFormSubmit() {
    const formData = readFormData();

    if (select) {
        dataTable[index] = formData;
        select = !select;
    } else
        dataTable.unshift(formData);

    createTable(dataTable);
    resetForm();
    showHide('none')

}

// кладем данные из формы в объект formData
function readFormData() {
    const formData = {};
    formData.ID = document.getElementById("formID").value;
    formData.Name = document.getElementById("formName").value;
    formData.Age = document.getElementById("formAge").value;
    return formData;
}

// Очищаем форму
function resetForm() {
    document.getElementById("formID").value = '';
    document.getElementById("formName").value = '';
    document.getElementById("formAge").value = '';
}

// Удаляем строку из массива и отрисовываем таблицу.
function deleteRow(td) {
    if (confirm('Are you sure to delete this record')) {
        let rowIndex = td.parentElement.parentElement.rowIndex;
        dataTable.splice(rowIndex - 1, 1);
        createTable(dataTable)
    }

}

// прокидываем данные выбранной строки в форму, вытаскиваем index
function editRow(td) {
    showHide('block');
    select = !select;
    const selectedRow = td.parentElement.parentElement;
    index = selectedRow.rowIndex - 1; //индекс объекта в массиве dataTable
    document.getElementById("formID").value = selectedRow.cells[0].innerHTML;
    document.getElementById("formName").value = selectedRow.cells[1].innerHTML;
    document.getElementById("formAge").value = selectedRow.cells[2].innerHTML;
}

// показываем/скрываем форму
function showHide(e) {
    document.getElementById('hide').style.display = e
}

/*
function closeForm() {
debugger
    showHide('none');
    resetForm()
}*/


/*
function validate() {
    let id = document.getElementById('formID');
    let name = document.getElementById('formName');
    let age = document.getElementById('formAge');

    if (!id.value || !name.value || !age.value) {
        alert('Поля не могут быть пустыми')
    } else {
        if (typeof(id.value.trim()) === 'string' || typeof(age.value.trim()) === 'string') {
            alert('Поля ID и Age должны быть числами')
        }
    }
}*/
