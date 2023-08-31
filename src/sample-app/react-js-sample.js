import { Config } from "../Config";
import { FaceTecSDK } from "../../core-sdk/FaceTecSDK.js/FaceTecSDK";
import { LivenessCheckProcessor } from "./processors/LivenessCheckProcessor"
import { SampleAppUtilities } from "./utilities/SampleAppUtilities"
import { FaceTecStringsES } from "./utilities/locationEs";
import { PhotoIDScanProcessor } from "./processors/PhotoIDScanProcessor"

export var SampleApp = (function() {
  var latestEnrollmentIdentifier = "";
  var latestSessionResult = null;
  var latestIDScanResult = null;
  var latestProcessor;

  // Wait for onload to be complete before attempting to access the Browser SDK.
  window.onload = function() {

    // Set a the directory path for other FaceTec Browser SDK Resources.
    FaceTecSDK.setResourceDirectory("../../core-sdk/FaceTecSDK.js/resources");

    // Set the directory path for required FaceTec Browser SDK images.
    FaceTecSDK.setImagesDirectory("../../core-sdk/FaceTec_images");

    // Initialize FaceTec Browser SDK and configure the UI features.
    FaceTecSDK.initializeInDevelopmentMode(Config.DeviceKeyIdentifier,Config.PublicFaceScanEncryptionKey,function(initializedSuccessfully) {
      if(initializedSuccessfully) {
        FaceTecSDK.configureLocalization(FaceTecStringsES)
        SampleAppUtilities.enableAllButtons();
      }
      SampleAppUtilities.displayStatus(FaceTecSDK.getFriendlyDescriptionForFaceTecSDKStatus(FaceTecSDK.getStatus()));
    });

    SampleAppUtilities.formatUIForDevice();

  }

  // Initiate a 3D Liveness Check.
  function onLivenessCheckPressed() {
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();

    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.
    getSessionToken(function(sessionToken) {
      latestProcessor = new LivenessCheckProcessor(sessionToken, SampleApp);
    })

  }

  // Show the final result and transition back into the main interface.
  function onComplete() {
    SampleAppUtilities.showMainUI();

    if(!latestProcessor.isSuccess()) {
      // Reset the enrollment identifier.
      latestEnrollmentIdentifier = "";

      // Show early exit message to screen.  If this occurs, please check logs.
      SampleAppUtilities.displayStatus("Sesión expirada. Por favor, inténtelo de nuevo.");
      return;
    }

    // Show successful message to screen
    SampleAppUtilities.displayStatus("Se ha completado la validación!!");
  }

  // Get the Session Token from the server
  function getSessionToken(sessionTokenCallback) {
    var XHR = new XMLHttpRequest();
    XHR.open("GET", Config.BaseURL + "/session-token");
    XHR.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    XHR.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(""));
    XHR.onreadystatechange = function () {
      if (this.readyState === XMLHttpRequest.DONE) {
        var sessionToken = "";
        try {
          // Attempt to get the sessionToken from the response object.
          sessionToken = JSON.parse(this.responseText).sessionToken;
           // Something went wrong in parsing the response. Return an error.
           if(typeof sessionToken !== "string") {
            onServerSessionTokenError();
            return;
          }
        }
        catch {
          // Something went wrong in parsing the response. Return an error.
          onServerSessionTokenError();
          return;
        }
        sessionTokenCallback(sessionToken);
      }
    };

    XHR.onerror = function () {
      onServerSessionTokenError();
    }
    XHR.send();
  }

  function onServerSessionTokenError() {
    SampleAppUtilities.handleErrorGettingServerSessionToken();
  }

  //
  // DEVELOPER NOTE:  This is a convenience function for demonstration purposes only so the Sample App can have access to the latest session results.
  // In your code, you may not even want or need to do this.
  //
  function setLatestSessionResult(sessionResult) {
    latestSessionResult = sessionResult;
  }

  function setIDScanResult(idScanResult) {
    latestIDScanResult = idScanResult;
  }

  function getLatestEnrollmentIdentifier() {
    return latestEnrollmentIdentifier
  }

  function setLatestServerResult(responseJSON) {
  }


  function initializeResultObjects() {
    latestSessionResult = null;
    latestIDScanResult = null;
}
  function onPhotoIDScanPressed() {
    initializeResultObjects();
    SampleAppUtilities.fadeOutMainUIAndPrepareForSession();
    // Get a Session Token from the FaceTec SDK, then start the 3D Liveness Check.  On Success, ID Scanning will start automatically.
    getSessionToken(function (sessionToken) {
        latestProcessor = new PhotoIDScanProcessor(sessionToken, SampleApp);
    });
}

  return {
    onLivenessCheckPressed,
    onPhotoIDScanPressed,
    onComplete,
    setLatestSessionResult,
    setIDScanResult,
    getLatestEnrollmentIdentifier,
    setLatestServerResult
  }

})();
