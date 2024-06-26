document.addEventListener("DOMContentLoaded", function (event) {

    const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById(toggleId),
            nav = document.getElementById(navId),
            bodypd = document.getElementById(bodyId),
            headerpd = document.getElementById(headerId)

        // Validate that all variables exist
        if (toggle && nav && bodypd && headerpd) {
            toggle.addEventListener('click', () => {
                // show navbar
                nav.classList.toggle('show')
                // change icon
                toggle.classList.toggle('bx-x')
                // add padding to body
                bodypd.classList.toggle('body-pd')
                // add padding to header
                headerpd.classList.toggle('body-pd')
            })

            // Trigger the click event to open the navbar by default
            toggle.click();
        }
    }

    showNavbar('header-toggle', 'nav-bar', 'body-pd', 'header')

    /*===== LINK ACTIVE =====*/
    const linkColor = document.querySelectorAll('.nav_link')

    function colorLink() {
        if (linkColor) {
            linkColor.forEach(l => l.classList.remove('active'))
            this.classList.add('active')
        }
    }
    linkColor.forEach(l => l.addEventListener('click', colorLink))

    // My code to run since DOM is loaded and ready

});

// --------------------- Own methods ----------------------------
function confirmLogOut() {
    if (confirm('Are you sure you want to log out?')) {
        window.location.href = '/user-logout';
    }
}

document.getElementById('retrieve-btn').addEventListener('click', retrieveContacts);
const contentDiv = document.getElementById('contacts-div');

function retrieveContacts() {
    let xhttpReq = new XMLHttpRequest();

    var url = "/retrieve-contacts";
    xhttpReq.open('GET', url);
    xhttpReq.send();
    alert("Request sent. Waiting for response from server.");

    xhttpReq.onreadystatechange = function () {
        if (xhttpReq.readyState == 4 && xhttpReq.status == 200) {
            // const JSONResponse = JSON.parse(xhttpReq.responseText);

            // for (let item in JSONResponse) {
            //     contentDiv.innerHTML += JSONResponse[item].name + "<br>";
            //     contentDiv.innerHTML += JSONResponse[item].email + "<hr>";
            //     console.log(JSONResponse[item].name);
            //     console.log(JSONResponse[item].email);
            //     console.log("----------------");
            // }

            // alert('Success: ' + JSONResponse);

            contentDiv.innerText = xhttpReq.responseText;

        }
        else {
            // alert('Error Response: \nStatus: ' + xhttpReq.status + "\nStatusText: " + xhttpReq.statusText + "\nReadyState: " + xhttpReq.readyState);
        }
    };
}

const dashboardNav = document.getElementById("dashboardNav");
const cardsNav = document.getElementById("cardsNav");
const contactsNav = document.getElementById("contactsNav");
const bookmarksNav = document.getElementById("bookmarksNav");
const helpNav = document.getElementById("helpNav");
const settingsNav = document.getElementById("settingsNav");

dashboardNav.addEventListener('click', dashboardClicked);
cardsNav.addEventListener('click', cardsNavClicked);
contactsNav.addEventListener('click', contactsNavClicked);
bookmarksNav.addEventListener('click', bookmarksNavClicked);
helpNav.addEventListener('click', helpNavClicked);
settingsNav.addEventListener('click', settingsNavClicked);

function dashboardClicked() {
    document.getElementById('main-content').innerHTML =
        "<h4>Welcome {{ session('name') }},</h4>\
        <button id=\"retrieve-btn\">Retrieve Contacts</button>\
        <div id=\"contacts-div\"></div>";
}

document.getElementById('close-button').addEventListener('click', function () {
    document.getElementById('copy-message-div').style.visibility = 'hidden';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('details-modal').style.display = 'none';
});

document.getElementById('contact-modal-close-button').addEventListener('click', function () {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('contact-modal').style.display = 'none';
});

document.getElementById('copy-button').addEventListener('click', function () {
    const inputValue = document.getElementById('text-to-copy');

    inputValue.select();
    document.getElementById('copy-message-div').style.visibility = 'visible';

    const messageDiv = document.getElementById('copy-message-div');
    navigator.clipboard.writeText(inputValue.value)
        .then(() => {
            // console.log('Text has been copied to the clipboard.');
            messageDiv.style.backgroundColor = "#a8ffbe";
            messageDiv.style.color = "#039828";
            messageDiv.textContent = "Copied successfully";

        })
        .catch(err => {
            // console.error('Unable to copy text to clipboard', err);
            messageDiv.style.backgroundColor = "#ffcccc";
            messageDiv.style.color = "#9f0000";
            messageDiv.textContent = "Error in copying." + err;
        });
});

document.getElementById('add-contact-button').addEventListener('click', function () {
    // TODO ----------------
    alert("Adding card functionality pending. Please reach back in a moment.");

    document.getElementById('overlay').style.display = 'none';
    document.getElementById('contact-modal').style.display = 'none';
});

function cardsNavClicked() {
    const container = document.getElementById('main-content');
    const userId = container.getAttribute('data-user-id');

    container.innerHTML = "";

    try {
        const first_container = document.createElement('div');
        first_container.classList.add('new-option-container');

        first_container.innerHTML += `
        <div class="personalcard-div" id="personalcard-div">
            <img src="images/plus-green.png"></img>
            <p>Add Personal Card</p>
        </div>`;

        first_container.innerHTML += `
        <div class="workcard-div" id="workcard-div">
            <img src="images/plus-orange.png"></img>
            <p>Add Work Card</p>
        </div>`;

        container.appendChild(first_container);

        document.getElementById('personalcard-div').addEventListener('click', function () {
            window.location.href = "/create-personal-card";
        });

        document.getElementById('workcard-div').addEventListener('click', function () {
            window.location.href = "/create-work-card";
        });

        const headingDiv = document.createElement('div');
        headingDiv.className = 'heading-div';
        headingDiv.innerText = "Saved Cards";
        container.appendChild(headingDiv);

    } catch (error) {
        alert("An error occured.", error);
    }

    // Now loading saved cards using fetch
    var url = "/request-cards?user_id=" + userId;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);

            if (data == null || data.length <= 0) {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'empty-msg';
                msgDiv.innerText = "You've no saved cards to display";

                container.appendChild(msgDiv);
            }

            else {
                const tableContainer = document.createElement('div');
                tableContainer.className = 'table-container';

                data.forEach(card => {
                    const cardContainer = document.createElement('div');
                    cardContainer.className = `table-column card ${card.organization_name ? 'work-card' : 'personal-card'}`;

                    const cardContent = document.createElement('div');
                    cardContent.className = 'card-content';

                    const cardTitle = document.createElement('h3');
                    cardTitle.textContent = card.fullname;
                    cardContent.appendChild(cardTitle);

                    const cardEmail = document.createElement('p');
                    cardEmail.textContent = card.email;
                    cardContent.appendChild(cardEmail);

                    const cardContact = document.createElement('p');
                    cardContact.textContent = card.contact_number;
                    cardContent.appendChild(cardContact);

                    if (card.designation != null) {
                        // Work card
                        const cardOrg = document.createElement('p');
                        cardOrg.textContent = card.designation;
                        cardContent.appendChild(cardOrg);
                    }

                    if (card.organization_name != null) {
                        // Work card
                        const cardOrg = document.createElement('p');
                        cardOrg.textContent = card.organization_name;
                        cardContent.appendChild(cardOrg);
                    }

                    const exportIcon = document.createElement('i');
                    exportIcon.className = `bx bx-export export-icon`;
                    try {
                        exportIcon.addEventListener('click', function () {
                            document.getElementById('overlay').style.display = 'block';
                            document.getElementById('details-modal').style.display = 'block';

                            const input = document.getElementById('text-to-copy');
                            input.removeAttribute('readonly');
                            const link = generateShareableLink(card);
                            input.value = link;
                            input.setAttribute('readonly', 'true');
                        });
                    }
                    catch (error) {
                        console.error("Error: " + error);
                    }


                    cardContainer.appendChild(exportIcon);

                    cardContainer.appendChild(cardContent);
                    tableContainer.appendChild(cardContainer);

                });

                container.appendChild(tableContainer);
            }
        })
        // .catch(error => alert('Error fetching data:', error));
        .catch(error => console.error(error));


    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}


function contactsNavClicked() {
    const container = document.getElementById('main-content');
    const userId = container.getAttribute('data-user-id');

    container.innerHTML = "";

    try {
        const first_container = document.createElement('div');
        first_container.classList.add('new-option-container');

        first_container.innerHTML += `
        <div class="new-contact-div" id="new-contact-div">
            <img src="images/plus-purple.png"></img>
            <p>Add Contact</p>
        </div>
        <div class="load-link-div" id="load-link-div">
            <p>Save a contact from link</p>
            <input type="text" id="load-link-input">
            <button id="load-contact-button">Load</button>
        </div>`;

        container.appendChild(first_container);

        document.getElementById('new-contact-div').addEventListener('click', function () {
            window.location.href = "/create-contact";
        });

        const loadLinkButton = document.getElementById('load-contact-button');
        loadLinkButton.addEventListener('click', function () {
            try {
                const linkInput = document.getElementById('load-link-input');
                const link = linkInput.value;

                if (link == "") {
                    alert("Please paste a link in the corresponding field.");
                    return;
                }

                const data = extractCardDataFromLink(link);

                const nameInput = document.getElementById('contact-modal-name-input');
                const emailInput = document.getElementById('contact-modal-email-input');
                const contactInput = document.getElementById('contact-modal-contact-input');
                const designationInput = document.getElementById('contact-modal-designation-input');
                const organizationInput = document.getElementById('contact-modal-organization-input');
                const addressInput = document.getElementById('contact-modal-address-input');
                const addContactButton = document.getElementById('add-contact-button');

                if (data.user_id == userId) {
                    if (data.organization_name == null)
                        alert("It looks like you've provided a link for your personal card. You'll not be able to save it as your contacts.");
                    else
                        alert("It looks like you've provided a link for your work card. You'll not be able to save it as your contacts.");

                    addContactButton.innerText = "Can't add";
                    addContactButton.setAttribute('disabled', 'true');
                }
                else {
                    addContactButton.innerText = "Add Contact";
                    addContactButton.removeAttribute('disabled');
                }

                nameInput.removeAttribute('readonly');
                nameInput.value = data.fullname;
                nameInput.setAttribute('readonly', 'true');

                emailInput.removeAttribute('readonly');
                emailInput.value = data.email;
                emailInput.setAttribute('readonly', 'true');

                contactInput.removeAttribute('readonly');
                contactInput.value = data.contact_number;
                contactInput.setAttribute('readonly', 'true');

                // console.log(nameInput);
                // console.log(emailInput);
                // console.log(contactInput);
                // console.log(organizationInput);
                // console.log(addressInput);

                if (data.designation) {
                    designationInput.style.display = 'block';
                    document.getElementById('contact-modal-designation-title').style.display = 'block';

                    designationInput.removeAttribute('readonly');
                    designationInput.value = data.designation;
                    designationInput.setAttribute('readonly', 'true');
                }
                else {
                    // Hide the designation <input> and <p>
                    designationInput.style.display = 'none';
                    document.getElementById('contact-modal-designation-title').style.display = 'none';
                }

                if (data.organization_name) {
                    organizationInput.style.display = 'block';
                    document.getElementById('contact-modal-organization-title').style.display = 'block';

                    organizationInput.removeAttribute('readonly');
                    organizationInput.value = data.organization_name;
                    organizationInput.setAttribute('readonly', 'true');
                }
                else {
                    // Hide the organization name <input> and <p>
                    organizationInput.style.display = 'none';
                    document.getElementById('contact-modal-organization-title').style.display = 'none';
                }

                if (!data.organization_name)
                    // Change the <p> text to only "Address"
                    document.getElementById('contact-modal-address-title').innerText = "Address";
                else
                    document.getElementById('contact-modal-address-title').innerText = "Organization Address";

                addressInput.removeAttribute('readonly');
                addressInput.value = data.organization_address;
                addressInput.setAttribute('readonly', 'true');

                document.getElementById('overlay').style.display = 'block';
                // Adding a delay to give a feel of data fetching from server
                setTimeout(function() {
                    document.getElementById('contact-modal').style.display = 'block';
                }, 1000);
            }
            catch (error) {
                alert("An error occured while trying to load the link data. The link might not be valid.");
                console.error(error);
            }

        });

        const headingDiv = document.createElement('div');
        headingDiv.className = 'heading-div';
        headingDiv.innerText = "Saved Contacts";
        container.appendChild(headingDiv);

    } catch (error) {
        alert("An error occured.", error);
    }

    // Now loading saved cards using fetch
    var url = "/request-contacts?user_id=" + userId;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // console.log(data);

            if (data == null || data.length <= 0) {
                const msgDiv = document.createElement('div');
                msgDiv.className = 'empty-msg';
                msgDiv.innerText = "You've no saved contacts to display";

                container.appendChild(msgDiv);
            }

            else {
                const tableContainer = document.createElement('div');
                tableContainer.className = 'table-container';

                data.forEach(card => {
                    const cardContainer = document.createElement('div');
                    cardContainer.className = `table-column card contact-card`;

                    const cardContent = document.createElement('div');
                    cardContent.className = 'card-content';

                    const cardTitle = document.createElement('h3');
                    cardTitle.textContent = card.fullname;
                    cardContent.appendChild(cardTitle);

                    const cardEmail = document.createElement('p');
                    cardEmail.textContent = card.email;
                    cardContent.appendChild(cardEmail);

                    const cardContact = document.createElement('p');
                    cardContact.textContent = card.contact_number;
                    cardContent.appendChild(cardContact);

                    const cardOrg = document.createElement('p');
                    cardOrg.textContent = card.organization_name;
                    cardContent.appendChild(cardOrg);

                    const cardOrgAddress = document.createElement('p');
                    cardOrgAddress.textContent = card.organization_address;
                    cardContent.appendChild(cardOrgAddress);

                    cardContainer.appendChild(cardContent);
                    tableContainer.appendChild(cardContainer);

                });

                container.appendChild(tableContainer);
            }
        })
        // .catch(error => alert('Error fetching data:', error));
        .catch(error => console.error(error));

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });

}

// Link generation

function encryptData(data) {
    const encrypted = data
        .split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) + 1))
        .join('');
    return encodeURIComponent(encrypted);
}

function generateShareableLink(card) {
    const serializedData = JSON.stringify(card);
    const encryptedData = encryptData(serializedData);
    const localhostURL = 'http://localhost:8000';
    const shareLink = `${localhostURL}/card?data=${encryptedData}`;
    return shareLink;
}


function decryptData(encryptedData) {
    const decrypted = decodeURIComponent(encryptedData)
        .split('')
        .map(char => String.fromCharCode(char.charCodeAt(0) - 1))
        .join('');
    return decrypted;
}

function extractCardDataFromLink(shareableLink) {
    const encryptedData = shareableLink.split('=')[1];
    const decryptedData = decryptData(encryptedData);

    return JSON.parse(decryptedData);
}


function bookmarksNavClicked() {
}

function helpNavClicked() {
}

function settingsNavClicked() {
}