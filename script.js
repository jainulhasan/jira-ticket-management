let addBtn = document.querySelector(".add-btn")
let removeBtn = document.querySelector(".remove-btn")
let modalCont = document.querySelector(".modal-cont")
let lockElem = document.querySelector(".ticket-lock")
let mainCont = document.querySelector(".main-cont")
let textareaCont = document.querySelector(".textarea-cont")
let allPriorityColor = document.querySelectorAll(".priority-color")

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock"
let unlockClass = "fa-lock-open"

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
        createTicket(modalPriorityColor, textareaCont.value, shortid());
        modalCont.style.display = "none";
        addFlag = false;
        textareaCont.value = "";
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let ticketcont = document.createElement("div");
    ticketcont.setAttribute("class", "ticket-cont");
    ticketcont.innerHTML = `<div class="ticket-cont">
    <div class="${ticketColor} ticket-color"></div>
    <div class="ticket-id">#${ticketID}</div>
    <div class="task-area">${ticketTask}</div>
    <div class="ticket-lock">
                <i class="fas fa-lock"></i>
            </div>
    </div>`;
    mainCont.appendChild(ticketcont)

    handleRemoval(ticketcont)
    handleLock(ticketcont)
    handleColor(ticketcont)
}

function handleRemoval(ticket) {
    //  removeFlag->true ->remove
    if (removeFlag) ticket.remove();
}


function handleLock(ticket) {
    let ticketLockElem = ticket.querySelector(".ticket-lock")
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area")
    ticketLock.addEventListener("click", (e) => {
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass)
            ticketLock.classList.add(unlockClass)
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass)
            ticketLock.classList.add(lockClass)
            ticketTaskArea.setAttribute("contenteditable", "false")
        }
    })
}

function handleColor(ticket) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {
        let currentTicketColor = ticketColor.classList[0];
        // get ticket color idx 
        let currentTicketColorIdx = colors.findIndex((color) => {
            return currentTicketColor === color
        })
        currentTicketColorIdx++;
        let newTicketColorIdx = currentTicketColorIdx % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
    })
}