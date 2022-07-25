"use strict";

const url = "https://suebot-stats-backend.herokuapp.com";

window.onload = () => {
    updateHtml();
};

async function updateHtml() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    displayMonthlyStats(month, year);
    displayLifetimeStats();
}

async function displayLifetimeStats() {
    // DOM VARS
    const total_lifetime_messages = document.querySelector("#total-lifetime-messages");
    const top_lifetime_chatters_container = document.querySelector("#top-lifetime-chatters-container");
    const top_lifetime_online_chatters_container = document.querySelector("#top-lifetime-online-chatters-container");
    const top_lifetime_offline_chatters_container = document.querySelector("#top-lifetime-offline-chatters-container");

    fetch(`${url}/chatters?streamState=all`, {
        method: "get",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                total_lifetime_messages.textContent = 0;
                console.log(data.error);
                return;
            }
            // STOP LOADING
            top_lifetime_chatters_container.innerHTML = "";
            top_lifetime_online_chatters_container.innerHTML = "";
            top_lifetime_offline_chatters_container.innerHTML = "";

            total_lifetime_messages.textContent = data.total_all_messages;
            //
            if (data.all_chat.length > 0) {
                const top_chatters = data.all_chat.sort((a, b) => b.messages.length - a.messages.length);
                top_chatters.forEach((chatter, index) => {
                    top_lifetime_chatters_container.innerHTML += `<div>
                <p>${index + 1}</p>
                <p>${chatter.sender}</p>
                <p>${chatter.messages.length}</p>
                </div>`;
                });
            }
            //
            if (data.online_chat.length > 0) {
                const top_online_chatters = data.online_chat.sort((a, b) => b.messages.length - a.messages.length);
                top_online_chatters.forEach((chatter, index) => {
                    top_lifetime_online_chatters_container.innerHTML += `<div>
                <p>${index + 1}</p>
                <p>${chatter.sender}</p>
                <p>${chatter.messages.length}</p>
                </div>`;
                });
            }
            //
            if (data.offline_chat.length > 0) {
                const top_offline_chatters = data.offline_chat.sort((a, b) => b.messages.length - a.messages.length);
                top_offline_chatters.forEach((chatter, index) => {
                    top_lifetime_offline_chatters_container.innerHTML += `<div>
                <p>${index + 1}</p>
                <p>${chatter.sender}</p>
                <p>${chatter.messages.length}</p>
                </div>`;
                });
            }
        })
        .catch((err) => {
            console.log("Caught an error:", err);
        });
}

async function displayMonthlyStats(month, year) {
    // DOM VARS
    const monthly_messages_text = document.querySelector("#monthly-messages-text");
    const total_monthly_messages = document.querySelector("#total-monthly-messages");
    const top_monthly_all_chatters_container = document.querySelector("#top-monthly-chatters-container");
    const top_monthly_online_chatters_container = document.querySelector("#top-monthly-online-chatters-container");
    const top_monthly_offline_chatters_container = document.querySelector("#top-monthly-offline-chatters-container");

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[month];

    monthly_messages_text.textContent = `${monthName.toUpperCase()}'S MONTHLY MESSAGES`;

    fetch(`${url}/chats/filter?month=${month + 1}&year=${year}`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                total_monthly_messages.textContent = 0;
                console.log(data);
                return;
            }
            total_monthly_messages.textContent = data.total_all_messages;
            // STOP LOADING
            top_monthly_all_chatters_container.innerHTML = "";
            top_monthly_online_chatters_container.innerHTML = "";
            top_monthly_offline_chatters_container.innerHTML = "";
            //
            if (data.monthly_all_chat.length > 0) {
                data.monthly_all_chat.forEach((chatter, index) => {
                    top_monthly_all_chatters_container.innerHTML += `<div>
                    <p>${index + 1}</p>
                    <p>${chatter.sender}</p>
                    <p>${chatter.messages.length}</p>
                    </div>`;
                });
            }
            //
            if (data.monthly_online_chat.length > 0) {
                data.monthly_online_chat.forEach((chatter, index) => {
                    top_monthly_online_chatters_container.innerHTML += `<div>
                    <p>${index + 1}</p>
                    <p>${chatter.sender}</p>
                    <p>${chatter.messages.length}</p>
                    </div>`;
                });
            }
            //
            if (data.monthly_offline_chat.length > 0) {
                data.monthly_offline_chat.forEach((chatter, index) => {
                    top_monthly_offline_chatters_container.innerHTML += `<div>
                    <p>${index + 1}</p>
                    <p>${chatter.sender}</p>
                    <p>${chatter.messages.length}</p>
                    </div>`;
                });
            }
        })
        .catch((err) => {
            console.log("Caught an error:", err);
        });
}
