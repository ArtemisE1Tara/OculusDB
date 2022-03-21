﻿document.head.innerHTML += `<link href="https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700,700italic" rel="stylesheet" type="text/css">^`

document.body.innerHTML = `<div class="navBar">
<div class="navBarInner" style="cursor: pointer;" onclick="window.location.href = '/'">
    <img class="navBarElement" src="https://computerelite.github.io/assets/CE_512px.png" style="height: 100%;">
    <div class="navBarElement">
        OculusDB
    </div>
</div>
<div class="navBarInner" style="flex-direction: row-reverse;">
    <div class="navBarElement">
        <input type="text" placeholder="Query" id="query">
        <input type="button" onclick="Search('query')" value="Search">
    </div>
    <a class="underlineAnimation navBarElement" href="/login">Login</a>
    <a class="underlineAnimation navBarElement" href="/recentactivity">Recent activity</a>
    <a class="underlineAnimation navBarElement" href="/server">Server</a>
</div>
</div>` + document.body.innerHTML

const loader = `<div class="centerIt">
<div class="loader"></div>
</div>`
const noResult = `
<div class="application centerIt" style="cursor: default;">
    <b>No Results</b>
</div>
`
const noActivity = `
<div class="application centerIt" style="cursor: default;">
    <b>No Activity</b>
</div>
`

function SetCheckboxesBasedOnValue(options, value) {
    if(value != undefined) {
        var split = value.split(",")
        for (const [key, value] of Object.entries(options)) {
            split.forEach(x => {
                if(value.includes(x)) document.getElementById(key).checked = true
            })
        }
    } else {
        for (const [key, value] of Object.entries(options)) {
            document.getElementById(key).checked = true
        }
        Update()
    }
}

function GetValuesOFCheckboxes(options) {
    var filter = []

    for (const [key, value] of Object.entries(options)) {
        if(document.getElementById(key).checked) {
            value.forEach(x => {
                filter.push(x)
            })
        }
    }

    return filter.join(",")
}

function PopUp(html) {
    var popup = document.getElementById("popup")
    if(popup) popup.remove();
    document.body.innerHTML = `
        <div class="centerIt popUp" id="popup" onclick="ClosePopUp(event)"><div class="popUpContent">${html}</div></div>
    ` + document.body.innerHTML
}

function ClosePopUp(e) {
    if(e.target.id == "popup") {
        document.getElementById("popup").remove()
    }
}

function IsHeadsetAndroid(h) {
    if(h == 0 || h == 5) return false;
    return true
}

function openTab(evt, tab) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tab).style.display = "block";
    evt.currentTarget.className += " active";
  }

document.getElementById("query").onkeydown = e => {
    if(e.code == "Enter") {
        Search("query")
    }
}
const params = new URLSearchParams(window.location.search)

function GetObjectById(id) {
    return new Promise((resolve, reject) => {
        fetch("/api/id/" + id).then(res => {
            if(res.status != 200) reject(res.status)
            res.json().then(res => resolve(res))
        })
    })
    
}

function GetActivityById(id) {
    return new Promise((resolve, reject) => {
        fetch("/api/activityid/" + id).then(res => {
            if(res.status != 200) reject(res.status)
            res.json().then(res => resolve(res))
        })
    })
    
}

function Search(element)
{
    var query = document.getElementById(element).value
    if(params.get("headsets")) {
        query += "&headsets=" + params.get("headsets")
    }
    window.location = "/search?query=" + query
}

function OpenApplication(id) {
    window.location = "/id/" + id
}

function OpenActivity(id) {
    window.location = "/activity/" + id
}

function GetOculusLink(id, hmd) {
    var link = "https://www.oculus.com/experiences/"
    if(hmd == 0 || hmd == 5) link += "rift"
    else if(hmd == 1 ||hmd == 2) link += "quest"
    else if(hmd == 3) link += "gear-vr"
    else if(hmd == 4) link += "go"
    return link + "/" + id
}

function FormatApplication(application, htmlId = "") {
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${htmlId}_${application.id}')">
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${htmlId}_${application.id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">${application.displayName}</div>
        </div>
        <div class="hidden" id="${htmlId}_${application.id}">
            
            <table>
                <tr><td class="label">Description</td><td class="value">${application.display_long_description.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">Current price</td><td class="value">${application.current_offer.price.formatted}</td></tr>
                <tr><td class="label">Baseline price</td><td class="value">${application.baseline_offer.price.offset_amount != 0 && application.baseline_offer.price.offset_amount < application.current_offer.price.offset_amount ? application.baseline_offer.price.formatted : application.current_offer.price.formatted}</td></tr>
                <tr><td class="label">Rating</td><td class="value">${application.quality_rating_aggregate.toFixed(2)}</td></tr>
                <tr><td class="label">Supported Headsets</td><td class="value">${GetHeadsets(application.supported_hmd_platforms)}</td></tr>
                <tr><td class="label">Publisher</td><td class="value">${application.publisher_name}</td></tr>
                <tr><td class="label">Canonical name</td><td class="value">${application.canonicalName}</td></tr>
                <tr><td class="label">Link to Oculus</td><td class="value"><a href="${GetOculusLink(application.id, application.hmd)}">${GetOculusLink(application.id, application.hmd)}</a></td></tr>
                <tr><td class="label">Id</td><td class="value">${application.id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenApplication('${application.id}')">
    </div>
</div>`
}

function FormatDLC(dlc, htmlid = "") {
    if(htmlid == "") htmlid = dlc.id
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${htmlid}')">
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${htmlid}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">${dlc.display_name}</div>
        </div>
        <div class="hidden" id="${htmlid}">
            
            <table>
                <tr><td class="label">Description</td><td class="value">${dlc.display_short_description.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">Price</td><td class="value">${dlc.current_offer.price.formatted}</td></tr>
                <tr><td class="label">Id</td><td class="value">${dlc.id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Download" onclick="window.open('https://securecdn.oculus.com/binaries/download/?id=${dlc.id}', '_blank')">
    </div>
</div>`
}

function FormatDLCPack(dlc, dlcs) {
    var included = ""
    dlc.bundle_items.forEach(d => {
        included += FormatDLC(GetDLC(dlcs, d.node.id), dlc.id + "_" + d.node.id)
    })
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${dlc.id}')">
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${dlc.id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">${dlc.display_name}</div>
        </div>
        <div class="hidden" id="${dlc.id}">
            
            <table>
                <tr><td class="label">Description</td><td class="value">${dlc.display_short_description.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">Price</td><td class="value">${dlc.current_offer.price.formatted}</td></tr>
                <tr><td class="label">Included DLCs</td><td class="value">${included}</td></tr>
                <tr><td class="label">Id</td><td class="value">${dlc.id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Download" onclick="window.open('https://securecdn.oculus.com/binaries/download/?id=${dlc.id}', '_blank')">
    </div>
</div>`
}


function FormatDLCActivity(a) {
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${a.__id}')">
            <div>${GetTimeString(a.__lastUpdated)}</div>
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${a.__id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">DLC <b>${a.displayName}</b> ${a.__OculusDBType == "ActivityNewDLC" ? " has been added to " : " has been updated for "} <b>${a.parentApplication.displayName}</b></div>
        </div>
        <div class="hidden" id="${a.__id}">
            <table>
                <tr><td class="label">Description</td><td class="value">${a.displayShortDescription.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">Price</td><td class="value">${a.priceFormatted}</td></tr>
                <tr><td class="label">DLC id</td><td class="value">${a.id}</td></tr>
                <tr><td class="label">Parent Application</td><td class="value">${FormatParentApplication(a.parentApplication, a.__id)}</td></tr>
                <tr><td class="label">Activity id</td><td class="value">${a.__id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenActivity('${a.__id}')">
    </div>
</div>`
}

function FormatDLCPackActivityDLC(a, i) {
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${i}_${a.__id}')" >
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${i}_${a.__id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;"></div>
        </div>
        <div class="hidden" id="${i}_${a.__id}">
            <table>
                <tr><td class="label">Description</td><td class="value">${a.displayShortDescription.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">DLC id</td><td class="value">${a.id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenApplication('${a.id}')">
    </div>
</div>`
}

function FormatDLCPackActivity(a) {
    var included = ""
    a.includedDLCs.forEach(d => {
        included += FormatDLCPackActivityDLC(d, a.__id)
    })
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${a.id}')">
            <div>${GetTimeString(a.__lastUpdated)}</div>
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${a.id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">DLC Pack ${a.displayName} ${a.__OculusDBType == "ActivityNewDLCPack" ? " has been added to " : " has been updated for "} <b>${a.parentApplication.displayName}</div>
        </div>
        <div class="hidden" id="${a.id}">
            
            <table>
                <tr><td class="label">Description</td><td class="value">${a.displayShortDescription.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">Price</td><td class="value">${a.priceFormatted}</td></tr>
                <tr><td class="label">Included DLCs</td><td class="value">${included}</td></tr>
                <tr><td class="label">Parent Application</td><td class="value">${FormatParentApplication(a.parentApplication, a.__id)}</td></tr>
                <tr><td class="label">DLC pack id</td><td class="value">${a.id}</td></tr>
                <tr><td class="label">Activity id</td><td class="value">${a.__id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Download" onclick="window.open('https://securecdn.oculus.com/binaries/download/?id=${a.id}', '_blank')">
    </div>
</div>`
}

function GetHeadsetName(headset) {
    switch (headset)
    {
        case "RIFT":
            return "Rift";
        case "LAGUNA":
            return "Rift S";
        case "MONTEREY":
            return "Quest 1";
        case "HOLLYWOOD":
            return "Quest 2";
        case "GEARVR":
            return "GearVR";
        case "PACIFIC":
            return "Go";
        default:
            return "unknown";
    }
}

function GetHeadsets(list) {
    var names = []
    list.forEach(x => names.push(GetHeadsetName(x)))
    return names.join(", ")
}

function FormatParentApplication(a, activityId) {
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${activityId}_${a.id}')">
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${activityId}_${a.id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">${a.displayName}</div>
        </div>
        <div class="hidden" id="${activityId}_${a.id}">
            <table>
                <tr><td class="label">Canonical name</td><td class="value">${a.canonicalName}</td></tr>
                <tr><td class="label">Id</td><td class="value">${a.id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenApplication('${a.id}')">
    </div>
</div>`
}

function FormatApplicationActivity(a) {
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${a.__id}')">
            <div>${GetTimeString(a.__lastUpdated)}</div>
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${a.__id}_trigger" class="anim noselect">&gt;</div>
            
            <div stlye="font-size: 1.25em;">New Application released! <b>${a.displayName}</b></div>
        </div>
        <div class="hidden" id="${a.__id}">
            <table>
                <tr><td class="label">Description</td><td class="value">${a.displayLongDescription.replace("\n", "<br>")}</td></tr>
                <tr><td class="label">Price</td><td class="value">${a.priceFormatted}</td></tr>
                <tr><td class="label">Supported Headsets</td><td class="value">${GetHeadsets(a.supportedHmdPlatforms)}</td></tr>
                <tr><td class="label">Publisher</td><td class="value">${a.publisherName}</td></tr>
                <tr><td class="label">Release time</td><td class="value">${new Date(a.releaseDate).toLocaleString()}</td></tr>
                <tr><td class="label">Link to Oculus</td><td class="value"><a href="${GetOculusLink(a.id, a.hmd)}">${GetOculusLink(a.id, a.hmd)}</a></td></tr>
                <tr><td class="label">Application id</td><td class="value">${a.id}</td></tr>
                <tr><td class="label">Activity id</td><td class="value">${a.__id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenActivity('${a.__id}')">
    </div>
</div>`
}

function FormatPriceChanged(a) {
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${a.__id}')">
            <div>${GetTimeString(a.__lastUpdated)}</div>
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${a.__id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">Price of <b>${a.parentApplication.displayName}</b> changed from ${a.oldPriceFormatted} to <b>${a.newPriceFormatted}</b></div>
        </div>
        <div class="hidden" id="${a.__id}">
            <table>
                <tr><td class="label">New Price</td><td class="value">${a.newPriceFormatted}</td></tr>
                <tr><td class="label">Old Price</td><td class="value">${a.oldPriceFormatted}</td></tr>
                <tr><td class="label">Parent Application</td><td class="value">${FormatParentApplication(a.parentApplication, a.__id)}</td></tr>
                <tr><td class="label">Activity id</td><td class="value">${a.__id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenActivity('${a.__id}')">
    </div>
</div>`
}

function AutoFormat(e, connected, htmlid = "") {
    if(e.__OculusDBType == "Application") return FormatApplication(e, htmlid)
    if(e.__OculusDBType == "IAPItem") return FormatDLC(e)
    if(e.__OculusDBType == "IAPItemPack") return FormatDLCPack(e, connected.dlcs)
    if(e.__OculusDBType == "Version") return FormatVersion(e)
    if(e.__OculusDBType == "ActivityNewDLC" || e.__OculusDBType == "ActivityDLCUpdated") return FormatDLCActivity(e)
    if(e.__OculusDBType == "ActivityNewDLCPack" || e.__OculusDBType == "ActivityDLCPackUpdated") return FormatDLCPackActivity(e)
    if(e.__OculusDBType == "ActivityNewVersion" || e.__OculusDBType == "ActivityVersionUpdated") return FormatVersionActivity(e)
    if(e.__OculusDBType == "ActivityNewApplication") return FormatApplicationActivity(e)
    if(e.__OculusDBType == "ActivityPriceChanged") return FormatPriceChanged(e)
    return ""
}

function GetDLC(dlcs, id) {
    return dlcs.filter(x => x.id == id)[0]
}

function FormatVersionActivity(v) {
    var releaseChannels = ""
    v.releaseChannels.forEach(x => {
        releaseChannels += `${x.channel_name}, `
    })
    if(releaseChannels.length > 0) releaseChannels = releaseChannels.substring(0, releaseChannels.length - 2)
    var downloadable = releaseChannels != ""
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${v.id}')">
            <div>${GetTimeString(v.__lastUpdated)}</div>
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${v.id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">Version <b>${v.version} &nbsp;&nbsp;&nbsp;&nbsp;(${v.versionCode})</b> of <b>${v.parentApplication.displayName}</b> ${v.__OculusDBType == "ActivityVersionUpdated" ? `has been updated` : `has been uploaded`}</div>
        </div>
        <div class="hidden" id="${v.id}">
            <table>
                <tr><td class="label">Uploaded</td><td class="value">${new Date(v.uploadedTime).toLocaleString()}</td></tr>
                <tr><td class="label">Release Channels</td><td class="value">${downloadable ? releaseChannels : "none"}</td></tr>
                <tr><td class="label">Downloadable</td><td class="value">${downloadable}</td></tr>
                <tr><td class="label">Version</td><td class="value">${v.version}</td></tr>
                <tr><td class="label">Version code</td><td class="value">${v.versionCode}</td></tr>
                <tr><td class="label">Parent Application</td><td class="value">${FormatParentApplication(v.parentApplication, v.__id)}</td></tr>
                <tr><td class="label">Id</td><td class="value">${v.id}</td></tr>
                <tr><td class="label">Activity id</td><td class="value">${v.__id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        <input type="button" value="Details" onclick="OpenActivity('${v.__id}')">
        ${GetDownloadButtonVersion(downloadable, v.id, v.parentApplication.hmd, v.parentApplication, v.version)}
    </div>
</div>`
}

function GetDownloadButtonVersion(downloadable, id, hmd, parentApplication, version) {
    if(IsHeadsetAndroid(hmd)) {
        return `<input type="button" value="Download${downloadable ? '"' : ' (Developer only)" class="red"'} onclick="window.open('https://securecdn.oculus.com/binaries/download/?id=${id}', '_blank')">`
    }
    return `<input type="button" value="Download${downloadable ? '"' : ' (Developer only)" class="red"'} onclick="RiftDownloadPopUp('${parentApplication.id}','${id}','${version}', '${parentApplication.displayName}')">`
}

function RiftDownloadPopUp(appid, versionid, version, appname) {
    PopUp(`
        <div>
            <b>Rift apps can not be downloaded via the Website. To download Rift apps follow the following instructions:</b>
            <br>
            <b>1. </b> Setup Oculus Downgrader by following <a href="https://computerelite.github.io/tools/Oculus/OculusDowngraderGuide.html">these instructions</a>
            <br>
            <b>2. </b> Using Option 2 in Oculus Downgraders main menu search for <code>${appname}</code>. Then select version <code>${version}</code> and follow the provided instructions.
            <br>
            <br>
            <b>Like automation? </b> Use <code>"Oculus Downgrader.exe" -nU d --appid ${appid} --versionid ${versionid}</code> to download the version with once command
            <br>
            <br>
            <i>To close this pop up click </i>
        </div>
    `)
}

function FormatVersion(v) {
    var releaseChannels = ""
    v.binary_release_channels.nodes.forEach(x => {
        releaseChannels += `${x.channel_name}, `
    })
    if(releaseChannels.length > 0) releaseChannels = releaseChannels.substring(0, releaseChannels.length - 2)
    var downloadable = releaseChannels != ""
    return `<div class="application">
    <div class="info">
        <div class="flex header" onclick="RevealDescription('${v.id}')">
            <div style="padding: 15px; font-weight: bold; color: var(--highlightedColor);" id="${v.id}_trigger" class="anim noselect">&gt;</div>
            <div stlye="font-size: 1.25em;">${v.version} &nbsp;&nbsp;&nbsp;&nbsp;(${v.versionCode})</div>
        </div>
        <div class="hidden" id="${v.id}">
            <table>
                <tr><td class="label">Uploaded</td><td class="value">${new Date(v.created_date * 1000).toLocaleString()}</td></tr>
                <tr><td class="label">Release Channels</td><td class="value">${downloadable ? releaseChannels : "none"}</td></tr>
                <tr><td class="label">Downloadable</td><td class="value">${downloadable}</td></tr>
                <tr><td class="label">Version</td><td class="value">${v.version}</td></tr>
                <tr><td class="label">Version code</td><td class="value">${v.versionCode}</td></tr>
                <tr><td class="label">Id</td><td class="value">${v.id}</td></tr>
            </table>
        </div>
    </div>
    <div class="buttons">
        ${GetDownloadButtonVersion(downloadable, v.id, v.parentApplication.hmd, v.parentApplication, v.version)}
    </div>
</div>`
}

function GetTimeString(d) {
    var date = new Date(d)
    if(date.toLocaleDateString() == new Date(Date.now()).toLocaleDateString()) {
        return date.toLocaleTimeString()
    }
    return date.toLocaleString()
}

function RevealDescription(id) {
    var elem = document.getElementById(id)
    if(elem.className.includes("hidden")) {
        elem.classList.remove("hidden")
    } else {
        elem.classList.add("hidden")
    }
    var trigger = document.getElementById(`${id}_trigger`)
    if(trigger.className.includes("rotate")) {
        trigger.classList.remove("rotate")
    } else {
        trigger.classList.add("rotate")
    }
}

function TextBoxError(id, text) {
    ChangeTextBoxProperty(id, "var(--red)", text)
}

function TextBoxText(id, text) {
    ChangeTextBoxProperty(id, "var(--highlightedColor)", text)
}

function TextBoxGood(id, text) {
    ChangeTextBoxProperty(id, "var(--textColor)", text)
}

function HideTextBox(id) {
    document.getElementById(id).style.visibility = "hidden"
}

function ChangeTextBoxProperty(id, color, innerHtml) {
    var text = document.getElementById(id)
    text.style.visibility = "visible"
    text.style.border = color + " 1px solid"
    text.innerHTML = innerHtml
}

function GetCookie(cookieName) {
    var name = cookieName + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function SetCookie(name, value, expiration) {
    var d = new Date();
    d.setTime(d.getTime() + (expiration * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


// Local convenience stuff
var script = document.createElement("script")
script.src = "/debug.js"
document.head.appendChild(script)