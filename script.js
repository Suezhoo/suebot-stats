"use strict";

const url = "https://suebot-stats-backend.herokuapp.com";

window.onload = () => {
    init();
};

async function init() {
    const lifetime_messages = document.querySelector("#total-lifetime-messages");

    await fetch(`${url}/chats`, { method: "get" })
        .then((res) => res.json())
        .then((data) => {
            lifetime_messages.textContent = data.chats.length;

            // Make a map [senderA = [chatA,chatB], senderB = [chatA,chatB]]
            const senders = [];

            data.chats.forEach((c) => {
                const chat = {
                    sender: c.sender,
                    messages: [{ value: c.message, streamState: c.streamState }],
                    streamer: c.target,
                    date: c.date,
                };

                const sender = senders.find((sender) => sender.sender === c.sender);
                if (!sender) {
                    senders.push(chat);
                } else {
                    sender.messages.push({ value: c.message, streamState: c.streamState });
                }
            });
            // Sort by message count and pass through
            updateHtml(senders.sort((a, b) => a.messages.length + b.messages.length));
        });
}

function updateHtml(data) {
    displayTopChatters(data);
}

function displayTopChatters(data) {
    console.log(data);
    const top_chatters_container = document.querySelector("#top-chatters-container");
    const top_online_chatters_container = document.querySelector("#top-online-chatters-container");
    const top_offline_chatters_container = document.querySelector("#top-offline-chatters-container");

    data.forEach((chatter) => {
        // TOP LIFETIME CHATTERS
        top_chatters_container.innerHTML += `<p>${chatter.sender} | ${chatter.messages.length}</p>`;
        // TOP ONLINE CHATTERS
        const online_messages = chatter.messages.filter((message) => (message.streamState === "online" ? true : false));
        if (online_messages.length > 0) top_online_chatters_container.innerHTML += `<p>${chatter.sender} | ${online_messages.length}</p>`;
        // TOP OFFLINE CHATTERS
        const offline_messages = chatter.messages.filter((message) => (message.streamState === "offline" ? true : false));
        if (offline_messages.length > 0) top_offline_chatters_container.innerHTML += `<p>${chatter.sender} | ${offline_messages.length}</p>`;
    });
}

function displayTopOnlineChatters(data) {}
