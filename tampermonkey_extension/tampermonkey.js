// ==UserScript==
// @name         Repoaster Tampermonkey
// @namespace    http://tampermonkey.net/
// @version      2025-01-25
// @description  Repoaster Browser Extension
// @author       me :)
// @match        https://www.instagram.com/reels/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// ==/UserScript==

const REPOSTER_URL = "http://localhost:3000";

let presets = {};
let selectedPreset = "";

GM_addStyle ( `
    .custom_select {
        background: url('http://www.pxleyes.com/images/contests/kiwis/fullsize/sourceimage.jpg') no-repeat center center fixed !important;
        -webkit-background-size: cover !important;
        -moz-background-size: cover !important;
        -o-background-size: cover !important;
        background-size: cover !important;
        position: relative;
    }

    .custom-select select {
      appearance: none;
      width: 100%;
      font-size: 1.15rem;
      padding: 0.675em 6em 0.675em 1em;
      background-color: rgba(0,0,0,0.5);
      border: 1px solid #caced1;
      border-radius: 0.25rem;
      color: #fff;
      cursor: pointer;
    }

    .custom-select::before,
    .custom-select::after {
      --size: 0.3rem;
      position: absolute;
      content: "";
      right: 1rem;
      pointer-events: none;
    }

    .custom-select::before {
      border-left: var(--size) solid transparent;
      border-right: var(--size) solid transparent;
      border-bottom: var(--size) solid black;
      top: 40%;
    }

    .custom-select::after {
      border-left: var(--size) solid transparent;
      border-right: var(--size) solid transparent;
      border-top: var(--size) solid black;
      top: 55%;
    }

` );

/**
 * Creates an SVG element with a predefined path and appends it to the specified element.
 *
 * @param {HTMLElement} attachElement - The parent element to which the SVG will be appended
 * @returns {void}
 */
function RENDER_createSVG(attachElement) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    svg.setAttribute("viewBox", "0 0 512 512");
    path.setAttribute("d", "M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z")

    svg.style.cssText = "width: 24px; height: 24px; fill: #fff;"

    svg.appendChild(path)

    attachElement.appendChild(svg);
}


function repoastCurrentReel() {
    const link = window.location.href;

    GM_xmlhttpRequest({
        method: "POST",
        url: "http://localhost:3000/repoast/reel",
        headers: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify({ link, preset: selectedPreset }),
        onload: function (response) {
            console.log(response.responseText);
        },
        onerror: function (err) {
            window.alert("Error: " + err);
        }
    })
}

function RENDER_addInstagramShareButton() {
    const wrapperDiv = document.createElement("div")
    wrapperDiv.style.cssText = 'display: flex; gap: 4px; position: fixed; bottom: 84%; right: 18%;'

    const shareButton = document.createElement("div")
    shareButton.style.cssText = "background-color: rgba(0,0,0,0.5); color: #fff; padding: 8px 16px; border-radius: 4px; cursor: pointer; display: flex; gap: 4px; align-items: center; border: 1px, solid, white;"
    const textNode = document.createTextNode("Repost")
    const shareButtonSpan = document.createElement("span")

    shareButtonSpan.appendChild(textNode)
    shareButton.appendChild(shareButtonSpan)


    wrapperDiv.appendChild(shareButton)
    RENDER_createSVG(shareButton)

    const mainDiv = document.getElementsByTagName("main")[0]
    mainDiv.appendChild(wrapperDiv)

    shareButton.addEventListener("click", repoastCurrentReel)
}

function RENDER_selectPreset() {
    try {
        const wrapperDiv = document.createElement("div")
        wrapperDiv.style.cssText = 'display: flex; gap: 4px; position: fixed; top: 2%; right: 2%;'

        const select = document.createElement("select")
        select.className = "custom-select"
        select.style.cssText = "width: 100%;"

        for (const preset of Object.keys(presets)) {
            const option = document.createElement("option")
            option.value = preset
            option.text = preset
            select.appendChild(option)
        }

        wrapperDiv.appendChild(select)

        const mainDiv = document.getElementsByTagName("body")[0]
        mainDiv.appendChild(wrapperDiv)

        select.value = selectedPreset;
        select.addEventListener("change", (e) => {
            selectedPreset = e.target.value;
            localStorage.setItem("selectedPreset", selectedPreset);
        })

    } catch(err) {
        console.error("===REPOASTER=== ", err);
    }
}

async function callRepoaster() {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://localhost:3000/presets",
        headers: {
            "Content-Type": "application/json"
        },
        onload: function (response) {
            presets = JSON.parse(response.responseText)
            RENDER_selectPreset();
            RENDER_addInstagramShareButton();
        },
        onerror: function (err) {
            console.error("===REPOASTER=== " + err);
            console.log(err);

        }
    })
}


(function () {
    'use strict';

    console.log("Repoaster Tampermonkey");
    setTimeout(async () => {
        callRepoaster();
    }, 500)

    selectedPreset = localStorage.getItem("selectedPreset")
    console.log("Repoaster Tampermonkey selectedPreset: ", selectedPreset)
})();


