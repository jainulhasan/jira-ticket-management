let addBtn = document.querySelector(".add-btn")
let removeBtn = document.querySelector(".remove-btn")
let modalCont = document.querySelector(".modal-cont")
let lockElem = document.querySelector(".ticket-lock")
let mainCont = document.querySelector(".main-cont")
let textareaCont = document.querySelector(".textarea-cont")
let allPriorityColor = document.querySelectorAll(".priority-color")
let toolBoxColors = document.querySelectorAll(".color")
let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock"
let unlockClass = "fa-lock-open"

let ticketArr = [];

if (localStorage.getItem("jira_tickets")) {
    // Retrieve and display tickets
    ticketsArr = JSON.parse(localStorage.getItem("jira_tickets"));
    ticketsArr.forEach((ticketObj) => {
        createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
    })
}

for (let i = 0; i < toolBoxColors.length; i++) {
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketArr.filter((ticketObj, idx) => {
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        // remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        // display new filtered tickets
        filteredTickets.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        // remove previous tickets
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for (let i = 0; i < allTicketsCont.length; i++) {
            allTicketsCont[i].remove();
        }

        ticketArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID);
        })
    })
}

//  listener for modal priority coloring
allPriorityColor.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColor.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border")
        })
        colorElem.classList.add("border")
        modalPriorityColor = colorElem.classList[0];
    })
})

addBtn.addEventListener('click', (e) => {
    // display modal 

    // generate ticket
    //  addflag = true ->modal display: 
    addFlag = !addFlag
    if (addFlag) {
        modalCont.style.display = "flex"
    } else {
        modalCont.style.display = "none"
    }
    // addflag=false -> modal none 
})

removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag
})

modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textareaCont.value);
        addFlag = false;
        setModalToDefault();
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {

    let id = ticketID || shortid();

    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class", "ticket-cont");
    ticketcont.innerHTML = `<div class="ticket-cont">
    <div class=" ticket-color ${ticketColor}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
                <i class="fas fa-lock"></i>
            </div>
    </div>`;
    mainCont.appendChild(ticketcont)



    // create object of ticket and add to array
    if (!ticketID) {
        ticketArr.push({ ticketColor, ticketTask, ticketID: id });
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
    }

    handleRemoval(ticketcont, id)
    handleLock(ticketcont, id)
    handleColor(ticketcont, id)
}

function handleRemoval(ticket, id) {
    //  removeFlag->true ->remove
    ticket.addEventListener("click", (e) => {
        if (!removeFlag) return;

        let idx = getTikcetIdx(id);

        // DB removal
        ticketArr.splice(idx, 1);
        let strTicketsArr = JSON.stringify(ticketArr);
        localStorage.setItem("jira_tickets", strTicketsArr);

        ticket.remove(); //UI removal
    })
}


function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector(".ticket-lock")
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area")
    ticketLock.addEventListener("click", (e) => {
        let ticketIdx = getTikcetIdx(id);

        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable", "false")
        }

        // Modify data in localStorage (Ticket Task)
        ticketArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketArr));
    })
}


function handleColor(ticket, id) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        // Get ticketIdx from the tickets array
        let ticketIdx = getTikcetIdx(id);

        let currentTicketColor = ticketColor.classList[1];
        // Get ticket color idx
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color;
        })
        currentTicketColorIdx++;
        console.log(currentTicketColor, currentTicketColorIdx);
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.add(newTicketColor);
        ticketColor.classList.remove(currentTicketColor);

        // Modify data in localStorage (priority color change)
        ticketArr[ticketIdx].ticketColor = newTicketColor;
        localStorage.setItem("jira_tickets", JSON.stringify(ticketsArr));
    })
}


function getTikcetIdx(id) {
    let ticketIdx = ticketArr.findIndex((ticketObj) => {
        return ticketObj.ticketID === id;
    })
    return ticketIdx;
}


function setModalToDefault() {
    allPriorityColor.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColor[allPriorityColor.length - 1].classList.add("border");
    modalCont.style.display = "none";
    textareaCont.value = "";
    modalPriorityColor = colors[colors.length - 1];
}