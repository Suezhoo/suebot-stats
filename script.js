"use strict";

const url = "https://suebot-stats-backend.herokuapp.com";

window.onload = () => {
    updateHtml();
};

async function updateHtml() {
    const top_chatters_container = document.querySelector("#top-chatters-container");
    const top_online_chatters_container = document.querySelector("#top-online-chatters-container");
    const top_offline_chatters_container = document.querySelector("#top-offline-chatters-container");

    const total_messages = document.querySelector("#total-lifetime-messages");

    await fetch(`${url}/chatters?streamState=all`)
        .then((res) => res.json())
        .then((data) => {
            if (data.error) {
                total_messages.textContent = 0;
                return;
            }
            total_messages.textContent = data.total_all_messages;
            //
            if (data.all_chat.length > 0) {
                const top_chatters = data.all_chat.sort((a, b) => b.messages.length - a.messages.length);
                top_chatters.forEach((chatter, index) => {
                    top_chatters_container.innerHTML += `<div>
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
                    top_online_chatters_container.innerHTML += `<div>
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
                    top_offline_chatters_container.innerHTML += `<div>
                    <p>${index + 1}</p>
                    <p>${chatter.sender}</p>
                    <p>${chatter.messages.length}</p>
                    </div>`;
                });
            }
        });
}
