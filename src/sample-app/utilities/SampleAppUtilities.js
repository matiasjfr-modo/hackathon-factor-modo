import { FaceTecSDK } from "../../../core-sdk/FaceTecSDK.js/FaceTecSDK"

export var SampleAppUtilities = (function() {
    var currentTheme = "FaceTec Theme";

    function displayStatus(message) {
      document.getElementById("status").innerHTML = message;
    }

    function showMainUI(){
      document.querySelector(".wrapping-box-container").style.opacity = 1;
      SampleAppUtilities.enableAllButtons();
    }

    // Disable buttons to prevent hammering, fade out main interface elements, and shuffle the guidance images.
    function fadeOutMainUIAndPrepareForSession() {
      disableAllButtons();
      document.querySelector(".wrapping-box-container").style.opacity = 0;
    }

    function disableAllButtons() {
      document.querySelectorAll("button").forEach(function(button) {
        button.disabled = true;
      });
    }

    function enableAllButtons() {
      document.querySelectorAll("button").forEach(function(button) {
        button.disabled = false;
      })
    }

    function handleErrorGettingServerSessionToken() {
      fadeInMainUI();
      enableAllButtons();
      displayStatus("Session could not be started due to an unexpected issue during the network request.");
    }

    function generateUUId() {
      //@ts-ignore
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      )
    }

    function formatUIForDevice() {
      if(isLikelyMobileDevice()) {
        // Adjust button sizing
        // document.querySelectorAll(".controls > button").forEach(function(element) {
        //   if(element.className === "big-button") {
        //     (element).style.height = "40px";
        //     (element).style.fontSize = "18px";
        //   }
        //   else if(element.className === "medium-button") {
        //     (element).style.height = "30px";
        //     (element).style.fontSize = "14px";
        //   }

        //   (element).style.width = "220px";
        // });
        // // Hide border around control panel
        // (document.getElementById("controls")).style.borderColor = "transparent";
        // // Hide status label text background and decrease label font size
        // (document.getElementById("status")).style.backgroundColor = "transparent";
        // (document.getElementById("status")).style.fontSize = "12px";
        // // Center control interface on screen
        // (document.getElementsByClassName("wrapping-box-container")[0]).style.top = "50%";
        // (document.getElementsByClassName("wrapping-box-container")[0]).style.left = "50%";
        // (document.getElementsByClassName("wrapping-box-container")[0]).style.transform = "translate(-50%, -50%)";
      }
    }

    function isLikelyMobileDevice() {
      var isMobileDeviceUA = !!(/Android|iPhone|iPad|iPod|IEMobile|Mobile|mobile/i.test(navigator.userAgent || ""));
      // ChromeOS/Chromebook detection.
      if(isMobileDeviceUA && ((navigator.userAgent.indexOf("CrOS") != -1 ) || (navigator.userAgent.indexOf("Chromebook") != -1 ) )) {
        isMobileDeviceUA = false;
      }
      // Mobile device determination based on portrait / landscape and user agent.
      if(screen.width < screen.height || isMobileDeviceUA) {
        // Assume mobile device when in portrait mode or when determined by the user agent.
        return true;
      }
      else {
        return false;
      }
    }

    return {
      displayStatus,
      showMainUI,
      fadeOutMainUIAndPrepareForSession,
      disableAllButtons,
      enableAllButtons,
      generateUUId,
      formatUIForDevice,
      handleErrorGettingServerSessionToken
    }
})()
