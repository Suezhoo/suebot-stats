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
                const message = { value: c.message, streamState: c.streamState, streamer: c.target };

                const chat = {
                    sender: c.sender,
                    online_messages: [],
                    offline_messages: [],
                    date: c.date,
                    all_messages: [message],
                };

                c.streamState === "online" ? chat.online_messages.push(message) : chat.offline_messages.push(message);

                const sender = senders.find((sender) => sender.sender === c.sender);
                if (!sender) {
                    senders.push(chat);
                } else {
                    c.streamState === "online" ? sender.online_messages.push(message) : sender.offline_messages.push(message);
                    sender.all_messages.push(message);
                }
            });
            // Sort by message count and pass through
            updateHtml(senders);
        });
}

function updateHtml(data) {
    displayTopChatters(data);
}

function displayTopChatters(data) {
    const top_chatters_container = document.querySelector("#top-chatters-container");
    const top_online_chatters_container = document.querySelector("#top-online-chatters-container");
    const top_offline_chatters_container = document.querySelector("#top-offline-chatters-container");

    // TOP LIFETIME CHATTERS
    const lifetime_all_chatters = data.sort((a, b) => b.all_messages.length - a.all_messages.length);
    lifetime_all_chatters.forEach((chatter, index) => {
        top_chatters_container.innerHTML += `<div><p>${index + 1}</p><p>${chatter.sender}</p><p>${chatter.all_messages.length}</p></div>`;
    });

    const lifetime_online_chatters = data.sort((a, b) => b.online_messages.length - a.online_messages.length);
    lifetime_online_chatters.forEach((chatter, index) => {
        if (chatter.online_messages.length > 0)
            top_online_chatters_container.innerHTML += `<div><p>${index + 1}</p><p>${chatter.sender}</p><p>${chatter.online_messages.length}</p></div>`;
    });

    const lifetime_offline_chatters = data.sort((a, b) => b.offline_messages.length - a.offline_messages.length);
    lifetime_offline_chatters.forEach((chatter, index) => {
        if (chatter.offline_messages.length > 0)
            top_offline_chatters_container.innerHTML += `<div><p>${index + 1}</p><p>${chatter.sender}</p><p>${chatter.offline_messages.length}</p></div>`;
    });
}

function displayTopOnlineChatters(data) {}
