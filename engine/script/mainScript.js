/********************************* 
    All rights reserved :
    coded by alireza mhm ;
    github : github.com/wwwAlireza ;
    codepen : codepen.io/alireza ;
 ********************************/

"use strict";
// loading
const loadingElement = document.querySelector("#loading")
const loading = {
    on: () => {
        loadingElement.classList.remove("d-none");
    },
    off: () => {
        loadingElement.classList.add("d-none");
    }
}

// alert
const alertElement = {
    container: document.querySelector(".alert-container"),
    alert: document.querySelector(".alert"),
    closeBtn: document.querySelector(".alert-close"),
    text: document.querySelector(".alert-text")
}
var alertTimeOut;
const newAlert = {
    success: (text) => {
        clearTimeout(alertTimeOut);
        newAlert.close();
        alertElement.alert.classList.remove("alert-danger");
        alertElement.alert.classList.remove("alert-info");
        alertElement.alert.classList.add("alert-success");
        alertElement.alert.classList.remove("alert-warning");
        alertElement.container.classList.remove("d-none");
        alertElement.container.classList.add("openAlert");
        alertElement.text.innerHTML = text;
        alertTimeOut = setTimeout(() => {
            newAlert.close();
        }, 4000);
    },
    danger: (text) => {
        clearTimeout(alertTimeOut);
        newAlert.close();
        alertElement.alert.classList.add("alert-danger");
        alertElement.alert.classList.remove("alert-success");
        alertElement.alert.classList.remove("alert-info");
        alertElement.alert.classList.remove("alert-warning");
        alertElement.container.classList.remove("d-none");
        alertElement.container.classList.add("openAlert");
        alertElement.text.innerHTML = text;
        alertTimeOut = setTimeout(() => {
            newAlert.close();
        }, 4000);
    },
    info: (text) => {
        clearTimeout(alertTimeOut);
        newAlert.close();
        alertElement.alert.classList.add("alert-info");
        alertElement.alert.classList.remove("alert-success");
        alertElement.alert.classList.remove("alert-danger");
        alertElement.alert.classList.remove("alert-warning");
        alertElement.container.classList.remove("d-none");
        alertElement.container.classList.add("openAlert");
        alertElement.text.innerHTML = text;
        alertTimeOut = setTimeout(() => {
            newAlert.close();
        }, 5000);
    },
    warning: (text) => {
        clearTimeout(alertTimeOut);
        newAlert.close();
        alertElement.alert.classList.add("alert-warning");
        alertElement.alert.classList.remove("alert-success");
        alertElement.alert.classList.remove("alert-danger");
        alertElement.alert.classList.remove("alert-info");
        alertElement.container.classList.remove("d-none");
        alertElement.container.classList.add("openAlert");
        alertElement.text.innerHTML = text;
        alertTimeOut = setTimeout(() => {
            newAlert.close();
        }, 5000);
    },
    close: () => {
        alertElement.container.classList.add("d-none");
        alertElement.container.classList.remove("openAlert");
        alertElement.text.innerHTML = " -- ";
    }
}

var searchTabStatus = "close";
var searchBasedOn = "name";
// get | set dataBase
var database = localStorage.getItem("database");
if (database) {
    try {
        database = JSON.parse(database);
    } catch (e) {
        newAlert.danger("خطایی در پردازش دیتابیس وجود دارد")
    }
} else {
    localStorage.setItem("database", JSON.stringify([]));
    database = localStorage.getItem("database");
    database = JSON.parse(database);
}

// select elements
var table = document.getElementById("mainTableBody");
const newContainer = document.getElementsByClassName("newUser-container")[0];
const newUserBtn = document.getElementById("newUserBtn");
const searchBtn = document.getElementById("searchBtn")
const closeNewUserBtn = document.getElementsByClassName("close-newUser")[0];
const basedOnBtn = document.getElementById("basedon-btn");
const printBtn = document.getElementById("print-btn");
const infoContainer = document.getElementsByClassName("info-container")[0];
const deleteUserContainer = document.getElementsByClassName("delete-user-container")[0];

const settingItems = {
    container: document.querySelector(".setting-conteiner"),
    settingBtn: document.querySelector(".setting-btn"),
    itemsContainer: document.querySelector(".setting-items-container"),
    info: document.getElementById("setting-info"),
    password: document.getElementById("setting-password"),
    database: document.getElementById("setting-database")
}

const deleteUserElements = {
    yesBtn: document.getElementById("delete-user-true"),
    noBtn: document.getElementById("delete-user-false"),
    closeBtn: document.querySelector(".close-delete-user"),
    name: document.querySelector(".delete-user-name"),
    lastName: document.querySelector(".delete-user-lastName"),
    id: document.querySelector(".delete-user-id")
}

let searchQueries = {
    name: "",
    lastName: "",
    id: "",
    code: "",
    queries: ""
};

function getSearchQueries() {
    searchQueries.name = document.getElementsByClassName("search-query-name");
    searchQueries.lastName = document.getElementsByClassName("search-query-lastName");
    searchQueries.id = document.getElementsByClassName("search-query-id");
    searchQueries.code = document.getElementsByClassName("search-query-code");
    searchQueries.queries = document.getElementsByClassName("search-query");
}

const input = {
    name: document.querySelector("#input-name"),
    lastName: document.querySelector("#input-lastName"),
    id: document.querySelector("#input-id"),
    cancelBtn: document.querySelector("#cancel-btn"),
    recordBtn: document.querySelector("#record-btn"),
    editBtn: document.querySelector("#edit-btn"),
    search: document.querySelector(".input-search"),
    searchContainer: document.querySelector(".input-search-container")
}

const newTab = {
    title: document.querySelector(".title-newUser"),
    icon: document.querySelector(".newUser-icon"),
    addUserBtn: input.recordBtn,
    editUserBtn: document.querySelector("#edit-btn")
}

// events
newUserBtn.addEventListener("click", () => {
    newUserTab.open();
    openNewTabSetting.changeToAdd();
});
closeNewUserBtn.addEventListener("click", () => { newUserTab.close() })
input.cancelBtn.addEventListener("click", () => { newUserTab.close() })
input.recordBtn.addEventListener("click", () => { startAddNewUser() })
alertElement.closeBtn.addEventListener("click", () => { newAlert.close() })
input.editBtn.addEventListener("click", () => { startEditUser() })
searchBtn.addEventListener("click", () => { checkSearchTabStatus() })
input.search.addEventListener("input", () => { startSearch() })
input.search.addEventListener("blur", () => { clearFocusAll() });
input.search.addEventListener("focus", () => { checkForShowSearchInfo() })
settingItems.settingBtn.addEventListener("click", () => { checkSettingStatus() })
settingItems.container.addEventListener("blur", () => { settingTab.close() })
input.search.onkeydown = (e) => {
    if (e.key == "ArrowUp" || e.code == "ArowUp") {
        changeBasedOnShortCut("up")
    } else if (e.key == "ArrowDown" || e.code == "ArowDown") {
        changeBasedOnShortCut("down")
    }
}
recordWithEnter(input.name)
recordWithEnter(input.lastName)
recordWithEnter(input.id)

// functions & objects
function recordWithEnter(input) {
    input.onkeypress = (e) => {
        if (e.code == "Enter" || e.key == "Enter" || e.charCode == 13) {
            startAddNewUser()
        }
    }
}

function clearFocusAll() {
    for (let i in searchQueries.queries) {
        if (typeof searchQueries.queries[i] == "object") {
            searchQueries.queries[i].querySelector(".data").classList.remove("resultFocus");
        }
    }
}

function changeBasedOn(based) {
    let userInput = input.search.value;
    input.search.focus();
    switch (based) {
        case "name":
            {
                searchBasedOn = "name";
                basedOnBtn.innerHTML = "نام ";
                if (userInput) {
                    search.byName(userInput);
                }
            }
            break;
        case "lastName":
            {
                searchBasedOn = "lastName";
                basedOnBtn.innerHTML = "نام خانوادگی ";
                if (userInput) {
                    search.byLastName(userInput);
                }
            }
            break;
        case "id":
            {
                searchBasedOn = "id";
                basedOnBtn.innerHTML = "کدملی ";
                if (userInput) {
                    search.byId(userInput);
                }
            }
            break;
        case "code":
            {
                searchBasedOn = "code";
                basedOnBtn.innerHTML = "کد ";
                if (userInput) {
                    search.byCode(userInput);
                }
            }
            break;
        default:
            {
                newAlert.danger("خطا در انجام عملیات");
            }
            break;
    }
}

function startSearch() {
    let userInput = input.search.value;
    switch (searchBasedOn) {
        case "name":
            {
                search.byName(userInput);
            }
            break;
        case "lastName":
            {
                search.byLastName(userInput);
            }
            break;
        case "id":
            {
                search.byId(userInput);
            }
            break;
        case "code":
            {
                search.byCode(userInput);
            }
            break;
        default:
            {
                newAlert.danger("خطا در انجام عملیات")
            }
            break;
    }
}

const search = {
    byName: (key) => {
        getSearched(key, searchQueries.name);
    },
    byLastName: (key) => {
        getSearched(key, searchQueries.lastName);
    },
    byId: (key) => {
        getSearched(key, searchQueries.id);
    },
    byCode: (key) => {
        getSearched(key, searchQueries.code);
    }
}

function getSearched(key, query) {
    if (key) {
        for (let i in query) {
            if (typeof query[i] == "object") {
                if (query[i].innerText.indexOf(key) != -1) {
                    query[i].parentElement.classList.remove("displayNone");
                    query[i].querySelector(".data").classList.add("resultFocus");
                } else {
                    query[i].parentElement.classList.add("displayNone");
                    query[i].querySelector(".data").classList.remove("resultFocus");
                }
            }
        }
    } else {
        for (let i in query) {
            if (typeof query[i] == "object") {
                query[i].parentElement.classList.remove("displayNone");
                query[i].querySelector(".data").classList.remove("resultFocus");
            }
        }
    }
}

function checkSearchTabStatus() {
    switch (searchTabStatus) {
        case "close":
            {
                searchTab.open();
            }
            break;
        case "open":
            {
                searchTab.close();
            }
            break;
        default:
            {
                newAlert.danger("خطا در انجام عملیات")
            }
            break;
    }
}
const searchTab = {
    open: () => {
        searchTabStatus = "open";
        input.searchContainer.style.width = "265px";
        input.searchContainer.style.overflow = "visible";
        searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
        searchBtn.classList.remove("btn-primary");
        searchBtn.classList.add("btn-inputColor")
        input.search.focus();
    },
    close: () => {
        searchTabStatus = "close";
        input.search.value = "";
        input.searchContainer.style.width = "0";
        searchBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
        searchBtn.classList.add("btn-primary");
        searchBtn.classList.remove("btn-inputColor");
        input.searchContainer.style.overflow = "hidden";
        for (let i in searchQueries.queries) {
            if (typeof searchQueries.queries[i] == "object") {
                searchQueries.queries[i].querySelector(".data").classList.remove("resultFocus");
                searchQueries.queries[i].parentElement.classList.remove("displayNone");
            }
        }
    }
}
const openNewTabSetting = {
    changeToAdd: () => {
        clearInputValues();
        newTab.title.innerHTML = "افزودن کاربر"
        newTab.icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>`
        newTab.addUserBtn.classList.remove("d-none");
        newTab.editUserBtn.classList.add("d-none")
    },
    changeToEdit: () => {
        clearInputValues();
        newTab.title.innerHTML = "ویرایش کاربر"
        newTab.icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`
        newTab.addUserBtn.classList.add("d-none");
        newTab.editUserBtn.classList.remove("d-none")
    },
    clearAll: () => {
        clearInputValues();
        newTab.title.innerHTML = " -- "
        newTab.icon.innerHTML = ` -- `
        newTab.addUserBtn.classList.add("d-none");
        newTab.editUserBtn.classList.add("d-none")
    }
}

var indexOfEditingUser;

function editUser(index) {
    indexOfEditingUser = index;
    newUserTab.open();
    openNewTabSetting.changeToEdit();
    input.name.value = database[index].name;
    input.lastName.value = database[index].lastName;
    input.id.value = database[index].id;
}

function startEditUser() {
    let name = input.name.value || "empty";
    let lastName = input.lastName.value || "empty";
    let id = input.id.value || "empty";
    let thisUserId = database[indexOfEditingUser].id;
    if (id == "empty" || id.length > 10 || id.length < 10) {
        invalidInput.id.on();
        input.id.focus();
    }
    if (lastName == "empty") {
        invalidInput.lastName.on();
        input.lastName.focus();
    }
    if (name == "empty") {
        invalidInput.name.on();
        input.name.focus();
    }
    let lastRecorded = false;
    for (let i in database) {
        if (database[i] != null) {
            if (database[i].id == id) {
                if (thisUserId != database[i].id) {
                    console.log(true);
                    lastRecorded = true;
                    break;
                }
            }
        }
    }
    if (name != "empty" && lastName != "empty" && id != "empty" && id.length == 10) {
        if (!lastRecorded) {
            setEdited(indexOfEditingUser, name, lastName, id);
        } else {
            newAlert.danger("خظا ! کاربری با این کدملی در سیستم موجود است");
            input.id.value = "";
            input.id.focus();
        }
    }
}

function setEdited(index, name, lastName, id) {
    database[index].name = name;
    database[index].lastName = lastName;
    database[index].id = id;
    record();
    readDataBase();
    newAlert.success(`کاربر { ${database[index].id} } با موفقیت ویرایش شد`)
}


function startAddNewUser() {
    let inputedName = input.name.value || "empty";
    let inputedLastName = input.lastName.value || "empty";
    let inputedId = input.id.value || "empty";


    if (inputedId == "empty" || inputedId.length > 10 || inputedId.length < 10) {
        invalidInput.id.on();
        input.id.focus();
    }
    if (inputedLastName == "empty") {
        invalidInput.lastName.on();
        input.lastName.focus();
    }
    if (inputedName == "empty") {
        invalidInput.name.on();
        input.name.focus();
    }

    let lastRecorded = false;
    let lastRecordedId;
    for (let i in database) {
        if (database[i] != null) {
            if (database[i].id == inputedId) {
                lastRecorded = true;
                lastRecordedId = database[i].id;
                break;
            }
        }
    }
    if (inputedName != "empty" && inputedLastName != "empty" && inputedId != "empty" && inputedId.length == 10) {
        if (!lastRecorded) {
            addNewUser(inputedName, inputedLastName, inputedId)
        } else {
            newAlert.danger(`خطا ! کاربری با کدملی { ${lastRecordedId} } در سیستم موجود است`);
            input.id.value = "";
            input.id.focus();
        }
    }
}

function addNewUser(Pname, PlastName, Pid) {
    let lastDatabaseIndex = database.length;
    database[lastDatabaseIndex] = {
        name: Pname,
        lastName: PlastName,
        id: Pid,
        status: false,
        code: '--'
    }
    record();
    clearInputValues();
    readDataBase();
    newAlert.success(`کاربر { ${Pid} } با موفقیت اضافه شد`);
}



const invalidInput = {
    name: {
        on: () => {
            document.querySelector(".invalid-name").style.visibility = "visible";
            input.name.classList.add("invalid-border");
            document.querySelector(".name-icon").classList.add("invalid-border-svg");
        },
        off: () => {
            document.querySelector(".invalid-name").style.visibility = "hidden";
            input.name.classList.remove("invalid-border");
            document.querySelector(".name-icon").classList.remove("invalid-border-svg");
        }
    },
    lastName: {
        on: () => {
            document.querySelector(".invalid-lastName").style.visibility = "visible";
            input.lastName.classList.add("invalid-border");
            document.querySelector(".lastName-icon").classList.add("invalid-border-svg");
        },
        off: () => {
            document.querySelector(".invalid-lastName").style.visibility = "hidden";
            input.lastName.classList.remove("invalid-border");
            document.querySelector(".lastName-icon").classList.remove("invalid-border-svg");
        }
    },
    id: {
        on: () => {
            document.querySelector(".invalid-id").style.visibility = "visible";
            input.id.classList.add("invalid-border");
            document.querySelector(".id-icon").classList.add("invalid-border-svg");
        },
        off: () => {
            document.querySelector(".invalid-id").style.visibility = "hidden";
            input.id.classList.remove("invalid-border");
            document.querySelector(".id-icon").classList.remove("invalid-border-svg");
        }
    }
}

groupInputSetting(input.name, invalidInput.name.off)
groupInputSetting(input.lastName, invalidInput.lastName.off)
groupInputSetting(input.id, invalidInput.id.off)

function groupInputSetting(inputElement, invalidOff) {
    inputElement.addEventListener("input", () => { invalidOff() })

}

const newUserTab = {
    open: () => {
        clearInputValues();
        newContainer.classList.remove("closeNewTab");
        newContainer.classList.remove("d-none");
        newContainer.classList.add("openNewTab");
    },
    close: () => {
        openNewTabSetting.clearAll();
        clearInputValues();
        newContainer.classList.remove("openNewTab");
        newContainer.classList.add("closeNewTab");
        setTimeout(() => {
            newContainer.classList.add("d-none");
        }, 500)
    }
}

function clearInputValues() {
    input.name.value = "";
    input.lastName.value = "";
    input.id.value = "";
}

function changeStatus(status, parentId, index) {
    let button;
    if (typeof parentId == "object") {
        button = document.getElementById(parentId.id);
    } else {
        button = document.getElementById(parentId);
    }

    switch (status) {
        case true:
            {
                button.classList.remove("btn-danger");
                button.classList.add("btn-success");
                button.innerText = "انجام شده ";
                database[index].status = true;
            }
            break;
        case false:
            {
                button.classList.remove("btn-success");
                button.classList.add("btn-danger");
                button.innerText = "انجام نشده ";
                database[index].status = false;
            }
            break;
        default:
            {
                newAlert.danger("خطا در انجام عملیات")
            }
            break;
    }
    record();
}

function readDataBase() {
    database = JSON.parse(localStorage.getItem("database"))
    var counter = 0;
    table.innerHTML = "";
    try {
        loading.on();
        for (let i in database) {
            if (database[i] != null && database[i] != undefined) {
                counter++
                setInTable(
                    counter,
                    i,
                    database[i].name,
                    database[i].lastName,
                    database[i].id,
                    database[i].status,
                    database[i].code,
                )
            }
        }
        loading.off();
    } catch (e) {
        newAlert.danger("خطایی در پردازش دیتابیس وجود دارد")
    }
    if (counter == 0) {
        printBtn.classList.add("d-none");
    } else {
        printBtn.classList.remove("d-none");
    }
    getSearchQueries();
}

function setInTable(counter, index, name, lastName, id, status, code) {
    let beforeId = "";
    if (id[0] == 0) {
        beforeId = "A"
    }
    let statusBtnClass, statusText, statusCode;
    switch (status) {
        case true:
        case "true":
            {
                statusBtnClass = "btn-success";
                statusText = " انجام شده";
                statusCode = code;
            }
            break;
        case false:
        case "false":
            {
                statusBtnClass = "btn-danger";
                statusText = " انجام نشده";
                statusCode = "--";
            }
            break;
        default:
            {
                newAlert.danger("خطا در انجام عملیات")
                console.log(status)
            }
            break;
    }
    table.innerHTML += `<tr data-index="${index}">
    <th scope="row">${counter}</th>
    <td class="search-query-name search-query"><span class="data">${name}</span></td>
    <td class="search-query-lastName search-query"><span class="data">${lastName}</span></td>
    <td class="search-query-id search-query"><span class="data">${id}</span></td>
    <td>
        <div class="dropdown" data-id="${id}">
            <button id="${beforeId}${id}" class="btn ${statusBtnClass} dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="-25%,5px">
                ${statusText}
            </button>
            <ul class="dropdown-menu dropdown-menu-dark text-end">
                <li><button onclick="changeStatus(true,${beforeId}${id},${index})" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                انجام شده
                </button></li>
                <li><button onclick="changeStatus(false,${beforeId}${id},${index})" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                انجام نشده
                </button></li>
            </ul>
        </div>
    </td>
    <td class="search-query-code search-query" contenteditable="true" oninput="setCodeInDateBase(${index},this.innerText)"><span class="data">${statusCode}</span></td>
    <td class="user-setting">
        <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" data-bs-offset="-40%,5px">
                تنظیمات
            </button>
            <ul class="dropdown-menu dropdown-menu-dark text-end dropdown-menu-start">
                <li><button onclick="deleteUser(${index})" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                حذف کاربر
                </button></li>
                <li><button onclick="editUser(${index})" class="dropdown-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                ویرایش اطلاعات
                </button></li>
            </ul>
        </div>
    </td>
</tr>`
}

function record() {
    localStorage.setItem("database", JSON.stringify(database))
}

function setCodeInDateBase(index, val) {
    database[index].code = val;
    record()
}
readDataBase()


printBtn.addEventListener("click", () => {
    window.print();
})

// shortCut
let basedOnShortCut = 0;

function changeBasedOnShortCut(arrow) {
    switch (arrow) {
        case "up":
            {
                switch (basedOnShortCut) {
                    case 0:
                        {
                            basedOnShortCut = 3;
                            changeBasedOn("code");
                        }
                        break;
                    case 1:
                        {
                            basedOnShortCut--;
                            changeBasedOn("name");
                        }
                        break;
                    case 2:
                        {
                            basedOnShortCut--;
                            changeBasedOn("lastName");
                        }
                        break;
                    case 3:
                        {
                            basedOnShortCut--;
                            changeBasedOn("id");
                        }
                        break;
                }
            }
            break;
        case "down":
            {
                switch (basedOnShortCut) {
                    case 0:
                        {
                            basedOnShortCut++;
                            changeBasedOn("lastName");
                        }
                        break;
                    case 1:
                        {
                            basedOnShortCut++;
                            changeBasedOn("id");
                        }
                        break;
                    case 2:
                        {
                            basedOnShortCut++;
                            changeBasedOn("code");
                        };
                    case 3:
                        {
                            basedOnShortCut = 0;
                            changeBasedOn("name");
                        }
                }
            }
    }
}

function checkForShowSearchInfo() {
    let lastInfo = localStorage.getItem("SHOW_INFO_SEARCH");
    if (lastInfo != "True") {
        localStorage.setItem("SHOW_INFO_SEARCH", "True");
        newAlert.info(
            `میتوانید از کلید های
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-down"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            و
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
            برای تغییر (جستجو بر اساس) استفاده کنید
            `
        )
    }
}

// delete user tab
const deleteUserTab = {
    open: () => {
        deleteUserContainer.classList.remove("d-none");
        deleteUserContainer.classList.add("openDeleteUserTab");
    },
    close: () => {
        deleteUserContainer.classList.add("d-none");
        deleteUserContainer.classList.remove("openDeleteUserTab");
    }
}


function deleteUser(index) {
    deleteUserTab.open();
    deleteUserElements.name.innerHTML = database[index].name;
    deleteUserElements.lastName.innerHTML = database[index].lastName;
    deleteUserElements.id.innerHTML = database[index].id;

    deleteUserElements.yesBtn.onclick = () => {
        try {
            newAlert.success(
                `کاربر { ${database[index].id} } با موفقیت حذف شد`
            )
            delete database[index];
            record();
            readDataBase();
            deleteUserTab.close();
        } catch {
            newAlert.danger(
                `خطا در انجام فرایند حذف کاربر`
            )
        }
    }
    deleteUserElements.noBtn.onclick = () => {
        deleteUserTab.close();
    }
}
deleteUserElements.closeBtn.addEventListener("click", () => {
    deleteUserTab.close();
})

// setting
let settingStatus = "close";
var overflowDeleter;
const settingTab = {
    open: () => {
        settingStatus = "open"
        settingItems.settingBtn.classList.add("settingBtnOpen");
        settingItems.settingBtn.style.stroke = "rgb(12, 98, 226)"
        settingItems.itemsContainer.style.height = "100px";
        overflowDeleter = setTimeout(() => {
            settingItems.itemsContainer.style.overflow = "visible";
        }, 500)
    },
    close: () => {
        settingStatus = "close";
        settingItems.itemsContainer.style.overflow = "hidden";
        settingItems.settingBtn.classList.remove("settingBtnOpen");
        settingItems.settingBtn.removeAttribute("style")
        settingItems.itemsContainer.style.height = "0";
        clearTimeout(overflowDeleter);
        settingInfoTab.close();
    }
}

function checkSettingStatus() {
    switch (settingStatus) {
        case "close":
            {
                settingTab.open();
            }
            break;
        case "open":
            {
                settingTab.close();
            }
            break;
    }
}

//setting general
function closeAllSettingTabs() {
    settingInfoTab.close();
    settingPasswordTab.close();
}

// setting info
let settingInfoStatus = "close";
const settingInfo = {
    infoBtn: document.querySelector("#setting-info"),
    infoTab: document.querySelector(".setting-info-container"),
    closeBtn: document.querySelector(".close-setting-info")
}
const settingInfoTab = {
    open: () => {
        closeAllSettingTabs()
        settingInfoStatus = "open";
        settingInfo.infoTab.classList.remove("d-none")
        settingInfo.infoTab.classList.add("openInfoTab")
        settingInfo.infoBtn.classList.add("activeItems")
    },
    close: () => {
        settingInfoStatus = "close";
        settingInfo.infoTab.classList.add("d-none")
        settingInfo.infoTab.classList.remove("openInfoTab")
        settingInfo.infoBtn.classList.remove("activeItems")
    }
}

function checkSettingInfoStatus() {
    switch (settingInfoStatus) {
        case "close":
            {
                settingInfoTab.open();
            }
            break;
        case "open":
            {
                settingInfoTab.close();
            }
            break;
    }
}
settingInfo.infoBtn.addEventListener("click", () => { checkSettingInfoStatus() })
settingInfo.closeBtn.addEventListener("click", () => { settingInfoTab.close(); })

// setting password
let settingPasswordStatus = "close";
const settingPassword = {
    passwordBtn: document.querySelector("#setting-password"),
    passwordTab: document.querySelector(".setting-password-container"),
    closeBtn: document.querySelector(".close-setting-password"),
    title: document.querySelector("#setting-password-title"),
    options: {
        visibilityPassword: document.querySelector(".visible-passowrd"),
        deletePassword: document.querySelector(".delete-password")
    },
    input: {
        lastPassword: document.querySelector("#last-password"),
        newPassword: document.querySelector("#new-password"),
        repetPassword: document.querySelector("#repet-password"),
        recordBtn: document.querySelector("#setting-password-record"),
        cancelBtn: document.querySelector("#setting-password-cancel"),
        clearAll: () => {
            settingPassword.input.lastPassword.value = "";
            settingPassword.input.newPassword.value = "";
            settingPassword.input.repetPassword.value = "";
        }
    },
    invalid: {
        lastPassword: document.querySelector(".invalid-last-password"),
        newPassword: document.querySelector(".invalid-new-password"),
        repetPassword: document.querySelector(".invalid-repet-password")
    }
}

const invalidPassword = {
    lastPassword: {
        on: () => {
            settingPassword.invalid.lastPassword.style.visibility = "visible";
            settingPassword.input.lastPassword.classList.remove("border-dark");
            settingPassword.input.lastPassword.classList.add("border-danger");
            settingPassword.input.lastPassword.focus();
        },
        off: () => {
            settingPassword.invalid.lastPassword.style.visibility = "hidden";
            settingPassword.input.lastPassword.classList.add("border-dark");
            settingPassword.input.lastPassword.classList.remove("border-danger");
        }
    },
    newPassword: {
        on: () => {
            settingPassword.invalid.newPassword.style.visibility = "visible";
            settingPassword.input.newPassword.classList.remove("border-dark");
            settingPassword.input.newPassword.classList.add("border-danger");
            settingPassword.input.newPassword.focus();
        },
        off: () => {
            settingPassword.invalid.newPassword.style.visibility = "hidden";
            settingPassword.input.newPassword.classList.add("border-dark");
            settingPassword.input.newPassword.classList.remove("border-danger");
        }
    },
    repetPassword: {
        on: () => {
            settingPassword.invalid.repetPassword.style.visibility = "visible";
            settingPassword.input.repetPassword.classList.remove("border-dark");
            settingPassword.input.repetPassword.classList.add("border-danger");
            settingPassword.input.repetPassword.focus();
        },
        off: () => {
            settingPassword.invalid.repetPassword.style.visibility = "hidden";
            settingPassword.input.repetPassword.classList.add("border-dark");
            settingPassword.input.repetPassword.classList.remove("border-danger");
        }
    }
}

const settingPasswordTab = {
    open: () => {
        closeAllSettingTabs();
        startSettingPassword();
        settingPasswordStatus = "open";
        settingPassword.passwordTab.classList.remove("d-none");
        settingPassword.passwordTab.classList.add("openNewTab");
    },
    close: () => {
        settingPasswordStatus = "close";
        settingPassword.passwordTab.classList.add("d-none");
        settingPasswordDelete.container.classList.add("d-none");
        settingPassword.passwordTab.classList.remove("openNewTab");
        settingPassword.input.clearAll();
        invalidPassword.lastPassword.off();
        invalidPassword.newPassword.off();
        invalidPassword.repetPassword.off();
        settingPasswordvisibility.hidden();
    },
}

function checkSettingPasswordStatus() {
    switch (settingPasswordStatus) {
        case "open":
            {
                settingPasswordTab.close();
            }
            break;
        case "close":
            {
                settingPasswordTab.open();
            }
    }
}
settingPassword.passwordBtn.addEventListener("click", () => { checkSettingPasswordStatus() })
settingPassword.closeBtn.addEventListener("click", () => { settingPasswordTab.close() })
settingPassword.input.recordBtn.addEventListener("click", () => { changingSettingPassword() })
settingPassword.input.cancelBtn.addEventListener("click", () => { settingPasswordTab.close() })

function startSettingPassword() {
    let password = localStorage.getItem("USER_LOGIN") || "empty";
    if (password == "empty") {
        settingPassword.input.lastPassword.setAttribute("disabled", "disabled");
        settingPassword.input.lastPassword.style.display = "none";
        settingPassword.options.deletePassword.classList.add("d-none");
        settingPassword.title.innerText = "تنظیم گذرواژه";
    } else {
        settingPassword.input.lastPassword.removeAttribute("disabled");
        settingPassword.input.lastPassword.removeAttribute("style");
        settingPassword.options.deletePassword.classList.remove("d-none");
        settingPassword.title.innerText = "تغییر گذرواژه";
    }
}

function changingSettingPassword() {
    let password = localStorage.getItem("USER_LOGIN") || "empty";
    let newPassword = settingPassword.input.newPassword.value;
    let repetPassword = settingPassword.input.repetPassword.value;
    if (password == "empty") {
        newAndRepetPasswordControl(newPassword, repetPassword);
    } else {
        newAndRepetAndLastPasswordControl(newPassword, repetPassword, password)
    }
}

function newAndRepetPasswordControl(newPassword, repetPassword) {
    if (newPassword.length >= 4 && newPassword.length <= 16) {
        if (newPassword == repetPassword) {
            localStorage.setItem("USER_LOGIN", CryptoJS.MD5(newPassword));
            newAlert.success(`گذرواژه شما با موفقیت ثبت شد`);
            sessionStorage.setItem("UNLOCKED", true)
            lockItmes.lockBtn.classList.remove("d-none")
            settingPasswordTab.close();
            settingPassword.input.clearAll();
        } else {
            invalidPassword.repetPassword.on();
        }
    } else {
        invalidPassword.newPassword.on();
    }
}

function newAndRepetAndLastPasswordControl(newPassword, repetPassword, password) {
    let lastPassword = CryptoJS.MD5(settingPassword.input.lastPassword.value);
    if (lastPassword == password) {
        if (newPassword.length >= 4 && newPassword.length <= 16) {
            if (newPassword == repetPassword) {
                if (newPassword != lastPassword) {
                    localStorage.setItem("USER_LOGIN", CryptoJS.MD5(newPassword));
                    newAlert.success(`گذرواژه شما با موفقیت تغییر یافت`);
                    settingPasswordTab.close();
                    settingPassword.input.clearAll();
                } else {
                    newAlert.info(`گذرواژه جدید شما مشابه گذرواژه فعلی است`);
                    settingPassword.input.newPassword.focus();
                }
            } else {
                invalidPassword.repetPassword.on();
            }
        } else {
            invalidPassword.newPassword.on();
        }
    } else {
        invalidPassword.lastPassword.on();
    }
}

settingPassword.input.lastPassword.addEventListener("input", () => { invalidPassword.lastPassword.off() });
settingPassword.input.newPassword.addEventListener("input", () => { invalidPassword.newPassword.off() });
settingPassword.input.repetPassword.addEventListener("input", () => { invalidPassword.repetPassword.off() });

var visibilityPassword = "hidden";
settingPassword.options.visibilityPassword.addEventListener("click", () => { checkVisibilityPassword() });

const settingPasswordvisibility = {
    visible: () => {
        visibilityPassword = "visible";
        settingPassword.input.lastPassword.setAttribute("type", "text");
        settingPassword.input.newPassword.setAttribute("type", "text");
        settingPassword.input.repetPassword.setAttribute("type", "text");
        settingPassword.options.visibilityPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye-off"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
    },
    hidden: () => {
        visibilityPassword = "hidden";
        settingPassword.input.lastPassword.setAttribute("type", "password");
        settingPassword.input.newPassword.setAttribute("type", "password");
        settingPassword.input.repetPassword.setAttribute("type", "password");
        settingPassword.options.visibilityPassword.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    }
}

function checkVisibilityPassword() {
    switch (visibilityPassword) {
        case "hidden":
            {
                settingPasswordvisibility.visible();
            }
            break;
        case "visible":
            {
                settingPasswordvisibility.hidden();
            }
            break;
    }
}


const settingPasswordDelete = {
    container: document.querySelector(".setting-password-delete"),
    cancelBtn: document.querySelector("#setting-password-delete-cancel"),
    deleteBtn: document.querySelector("#setting-password-delete-delete")
}
settingPassword.options.deletePassword.addEventListener("click", () => {
    if (settingPassword.input.lastPassword.value) {
        let lastPassword = localStorage.getItem("USER_LOGIN");
        if (lastPassword == CryptoJS.MD5(settingPassword.input.lastPassword.value)) {
            settingPasswordDelete.container.classList.remove("d-none");
        } else {
            invalidPassword.lastPassword.on();
            settingPassword.input.lastPassword.focus();
        }
    } else {
        invalidPassword.lastPassword.on();
        settingPassword.input.lastPassword.focus();
        newAlert.warning("برای دسترسی به این بخش باید گذرواژه قبلی خود را وارد کنید")
    }
})
settingPasswordDelete.cancelBtn.addEventListener("click", () => {
    settingPasswordDelete.container.classList.add("d-none");
})
settingPasswordDelete.deleteBtn.addEventListener("click", () => {
    localStorage.removeItem("USER_LOGIN");
    settingPasswordTab.close();
    newAlert.success("گذرواژه شما با موفقیت حذف شد !");
    lockItmes.lockBtn.classList.add("d-none");
})

// setting database

// ask before open
const databaseBefore = {
    container: document.querySelector(".database-ask-container"),
    agreeBtn: document.querySelector("#database-ask-agree"),
    cancelBtn: document.querySelector("#database-ask-cancel"),
    closeBtn: document.querySelector(".database-ask-close")
}
const databaseBeforeTab = {
    open: () => {
        databaseBefore.container.classList.remove("d-none");
        databaseBefore.container.classList.add("openDeleteUserTab");
    },
    close: () => {
        databaseBefore.container.classList.add("d-none");
        databaseBefore.container.classList.remove("openDeleteUserTab");
    }
}
settingItems.database.addEventListener("click", () => { startSettingDataBase() })
databaseBefore.closeBtn.addEventListener("click", () => { databaseBeforeTab.close() })
databaseBefore.cancelBtn.addEventListener("click", () => { databaseBeforeTab.close() })
databaseBefore.agreeBtn.addEventListener("click", () => {
    localStorage.setItem("AGREE_OPEN_DATABASE", "true");
    databaseBeforeTab.close();
    setDataBaseInEditDataBase();
    databaseTab.open();
})

function startSettingDataBase() {
    let agreeOpenDatabase = localStorage.getItem("AGREE_OPEN_DATABASE");
    if (agreeOpenDatabase == "true") {
        setDataBaseInEditDataBase();
        databaseTab.open();
    } else {
        databaseBeforeTab.open();
    }
}

// database
const databaseItems = {
    container: document.querySelector(".setting-database-container"),
    closeBtn: document.querySelector(".setting-database-close"),
    saveBtn: document.querySelector("#edit-database-save"),
    cancelBtn: document.querySelector("#edit-database-cancel"),
    value: document.querySelector("#database-value")
}
const databaseTab = {
    open: () => {
        databaseItems.container.classList.remove("d-none");
        databaseItems.container.classList.add("openNewTab");
        setDataBaseInEditDataBase()
    },
    close: () => {
        databaseItems.container.classList.add("d-none");
        databaseItems.container.classList.remove("openNewTab");
    }
};

databaseItems.closeBtn.addEventListener("click", () => { databaseTab.close() });
databaseItems.cancelBtn.addEventListener("click", () => { databaseTab.close() });
databaseItems.saveBtn.addEventListener("click", () => { startSavingDatabase() });

function startSavingDatabase() {
    let databaseValue = databaseItems.value.innerText;
    let errorLog;

    function jsonTest(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            errorLog = e.message;
            return false;
        }
        return true;
    }
    let isDatabaseJson = jsonTest(`[${databaseValue}]`);
    if (isDatabaseJson) {
        loading.on();
        setTimeout(() => {
            loading.off();
            newAlert.success(`تغییرات اعمال شده با موفقیت در دیتابیس ثبت شد`);
            localStorage.setItem("database", `[${databaseValue}]`)
            readDataBase();
        }, 3000);
    } else {
        newAlert.danger(`خطا! ورودی نامعتبر در دیتابیس <br> <span class="w-100 d-flex justify-content-start" style="direction: ltr;">
        Log :<br>
        ${errorLog}
        </span>`)
    }
}

// lock

var loginVisibilityStatus = "hidden";
const lockItmes = {
    visibilityBtn: document.querySelector(".lock-profile-visibility-icon"),
    input: document.querySelector(".lock-profile-input-password"),
    loginBtn: document.querySelector(".unlock-button"),
    inputContainer: document.querySelector(".lock-profile-input"),
    lockBtn: document.querySelector(".lock-btn")
}

lockItmes.visibilityBtn.addEventListener("click", () => { checkLoginVisibilityStatus() });
lockItmes.loginBtn.addEventListener("click", () => { startUnlockingSystem() });
lockItmes.lockBtn.addEventListener("click", () => { system.lock() });
document.addEventListener("keypress", (e) => {
    if (e.ctrlKey == true && e.code == "KeyL" || e.key == "\f" || e.charCode == 12) {
        system.lock();
    }
})
lockItmes.input.onkeypress = (e) => {
    if (e.key == "Enter" || e.charCode == 13 || e.code == "Enter") {
        startUnlockingSystem()
    }
}
lockItmes.input.addEventListener("input", () => {
    lockItmes.inputContainer.classList.remove("border-danger");
    lockItmes.inputContainer.classList.add("border-dark")
})

function checkLoginVisibilityStatus() {
    switch (loginVisibilityStatus) {
        case "hidden":
            {
                loginPassword.visible();
            }
            break;
        case "visible":
            {
                loginPassword.hidden();
            }
            break;
    }
}
const loginPassword = {
    visible: () => {
        loginVisibilityStatus = "visible";
        lockItmes.visibilityBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"  stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        lockItmes.input.type = "text";
    },
    hidden: () => {
        loginVisibilityStatus = "hidden";
        lockItmes.visibilityBtn.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`
        lockItmes.input.type = "password";
    }
}

function startUnlockingSystem() {
    if (lockItmes.input.value != "") {
        let password = localStorage.getItem("USER_LOGIN");
        if (password == CryptoJS.MD5(lockItmes.input.value)) {
            system.unlock();
            newAlert.info("خوش آمدید - admin");
            sessionStorage.setItem("UNLOCKED", true)
            lockItmes.input.value = "";
        } else {
            lockItmes.inputContainer.classList.remove("border-dark");
            lockItmes.inputContainer.classList.add("border-danger");
            newAlert.danger("گذرواژه وارد شده نامعتبر است");
            lockItmes.input.focus();
            lockItmes.input.value = "";
        }
    }
}


const lockContainer = document.querySelector(".lock-container");
const system = {
    lock: () => {
        lockContainer.style.transition = "height 0s";
        lockContainer.style.height = "100vh";
        sessionStorage.removeItem("UNLOCKED")
    },
    unlock: () => {
        lockContainer.style.transition = "height 1s";
        lockContainer.style.height = "0vh";
    }
}

function checkPassword() {
    let password = localStorage.getItem("USER_LOGIN");
    if (password) {
        lockItmes.lockBtn.classList.remove("d-none")
        let unlocked = sessionStorage.getItem("UNLOCKED");
        if (!unlocked) {
            system.lock();
        }
    } else {
        lockItmes.lockBtn.classList.add("d-none")
    }
}
checkPassword()



// header status

// clock
const headerClock = {
    hour: document.querySelector("#header-clock-hour"),
    minute: document.querySelector("#header-clock-minute"),
    ampm: document.querySelector("#header-clock-ampm")
}

function getAndSetClock(hour, minute, ampm) {
    let date = new Date();
    let h = String(date.getHours());
    let m = String(date.getMinutes());
    if (h.length == 1) {
        hour.innerHTML = `0${h}`;
    } else {
        hour.innerHTML = h;
    }
    if (m.length == 1) {
        minute.innerHTML = `0${m}`;
    } else {
        minute.innerHTML = m;
    }
    if (h == "0" && m == "1") {
        getAndSetDate(
            headerDate.year,
            headerDate.month,
            headerDate.day
        )
    }
    ampm.innerHTML = (date.getHours() > 12) ? "PM" : "AM";
}
getAndSetClock(
    headerClock.hour,
    headerClock.minute,
    headerClock.ampm
)
setInterval(() => {
    getAndSetClock(
        headerClock.hour,
        headerClock.minute,
        headerClock.ampm
    )
}, 1000);

// date
const headerDate = {
    year: document.querySelector("#header-date-year"),
    month: document.querySelector("#header-date-month"),
    day: document.querySelector("#header-date-day")
}

function getAndSetDate(year, month, day) {
    let date = new persianDate();
    year.innerHTML = date.toLocale("en").format("YYYY");
    month.innerHTML = date.toLocale("en").format("MM");
    day.innerHTML = date.toLocale("en").format("DD")
}
getAndSetDate(
    headerDate.year,
    headerDate.month,
    headerDate.day
)



// openLink
function openLink(link) {
    window.open(link, '_blank')
}


function setDataBaseInEditDataBase() {
    document.querySelector(".setting-database-value").innerHTML = "";
    database = JSON.parse(localStorage.getItem("database"))
    for (let i in database) {
        if (database[i] != null && database[i] != undefined) {
            if (i == database.length - 1) {
                document.querySelector(".setting-database-value").innerHTML += `
<span class="bracket">{</span>
    <span class="bracket">"</span><span class="key">name</span><span class="bracket"">"</span>:<span class="bracket">"</span><bdo dir="rtl"><span class="value">${database[i].name}</span></bdo><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">lastName</span><span class="bracket">"</span>:<span class="bracket">"</span><bdo dir="rtl"><span class="value">${database[i].lastName}</span></bdo><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">id</span><span class="bracket">"</span>:<span class="bracket">"</span><span class="value">${database[i].id}</span><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">status</span><span class="bracket">"</span>:<span class="bracket">"</span><span class="value">${database[i].status}</span><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">code</span><span class="bracket">"</span>:<span class="bracket">"</span><span class="value">${database[i].code}</span><span class="bracket">"</span>
<span class="bracket">}</span>
    `
            } else {
                document.querySelector(".setting-database-value").innerHTML += `
<span class="bracket">{</span>
    <span class="bracket">"</span><span class="key">name</span><span class="bracket"">"</span>:<span class="bracket">"</span><bdo dir="rtl"><span class="value">${database[i].name}</span></bdo><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">lastName</span><span class="bracket">"</span>:<span class="bracket">"</span><bdo dir="rtl"><span class="value">${database[i].lastName}</span></bdo><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">id</span><span class="bracket">"</span>:<span class="bracket">"</span><span class="value">${database[i].id}</span><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">status</span><span class="bracket">"</span>:<span class="bracket">"</span><span class="value">${database[i].status}</span><span class="bracket">"</span>,
    <span class="bracket">"</span><span class="key">code</span><span class="bracket">"</span>:<span class="bracket">"</span><span class="value">${database[i].code}</span><span class="bracket">"</span>
<span class="bracket">}</span>,
    `
            }
        }
    }
}
setDataBaseInEditDataBase()