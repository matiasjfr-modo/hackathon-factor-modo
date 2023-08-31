//
// Welcome to the annotated FaceTec Device SDK core code for performing a secure Photo ID Scan.
//

import { Config } from "../../Config";
import { FaceTecSDK } from "../../../core-sdk/FaceTecSDK.js/FaceTecSDK";

//
// This is an example self-contained class to perform Photo ID Scans with the FaceTec SDK.
// You may choose to further componentize parts of this in your own Apps based on your specific requirements.
//
export class PhotoIDScanProcessor  {
  latestNetworkRequest = new XMLHttpRequest();
  latestIDScanResult;

  //
  // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
  //
  success;
  sampleAppControllerReference;

  constructor(sessionToken, sampleAppControllerReference) {
    //
    // DEVELOPER NOTE:  These properties are for demonstration purposes only so the Sample App can get information about what is happening in the processor.
    // In the code in your own App, you can pass around signals, flags, intermediates, and results however you would like.
    //
    this.success = false;
    this.sampleAppControllerReference = sampleAppControllerReference;
    this.latestIDScanResult = null;

    // In v9.2.2+, configure the messages that will be displayed to the User in each of the possible cases.
    // Based on the internal processing and decision logic about how the flow gets advanced, the FaceTec SDK will use the appropriate, configured message.
    FaceTecSDK.FaceTecCustomization.setIDScanUploadMessageOverrides(
      "Subiendo<br/>frente DNI<br/>Encriptado", // Upload of ID front-side has started.
      "Todavía subiendo...<br/>Conexión lenta", // Upload of ID front-side is still uploading to Server after an extended period of time.
      "Subida completada", // Upload of ID front-side to the Server is complete.
      "Procesando<br/>Frente DNI", // Upload of ID front-side is complete and we are waiting for the Server to finish processing and respond.
      "Subiendo<br/>dorso DNI<br/>Encriptado", // Upload of ID back-side has started.
      "Todavía subiendo...<br/>Conexión lenta", // Upload of ID back-side is still uploading to Server after an extended period of time.
      "Subida completada", // Upload of ID back-side to Server is complete.
      "Procesando<br/>Dorso DNI", // Upload of ID back-side is complete and we are waiting for the Server to finish processing and respond.
      "Subiendo<br/>Su información confirmada", // Upload of User Confirmed Info has started.
      "Todavía subiendo...<br/>Conexión lenta", // Upload of User Confirmed Info is still uploading to Server after an extended period of time.
      "Subida completada", // Upload of User Confirmed Info to the Server is complete.
      "Procesando" // Upload of User Confirmed Info is complete and we are waiting for the Server to finish processing and respond.
    );

    //
    // Part 1:  Starting the FaceTec Photo ID Scan Session
    //
    // Required parameters:
    // - FaceTecIDScanProcessor:  A class that implements FaceTecIDScanProcessor, which handles the Photo ID Scan when the User completes a Session.  In this example, "this" implements the class.
    // - sessionToken:  A valid Session Token you just created by calling your API to get a Session Token from the Server SDK.
    //
    new FaceTecSDK.FaceTecSession(
      this,
      sessionToken
    );
  }

  //
  // Part 2:  Handling the Result of a Photo ID Scan
  //
  processIDScanResultWhileFaceTecSDKWaits = (idScanResult, idScanResultCallback) => {
    this.latestIDScanResult = idScanResult;

    //
    // Part 3:  Handles early exit scenarios where there is no Photo ID Scan result to handle -- i.e. User Cancellation, Timeouts, etc.
    //
    if(idScanResult.status !== FaceTecSDK.FaceTecIDScanStatus.Success) {
      console.log("Photo ID Scan was not completed successfully, cancelling.  Session Status: " + FaceTecSDK.FaceTecIDScanStatus[idScanResult.status]);
      this.latestNetworkRequest.abort();
      this.latestNetworkRequest = new XMLHttpRequest();
      idScanResultCallback.cancel();
      return;
    }

    // IMPORTANT:  FaceTecSDK.FaceTecIDScanStatus.Success DOES NOT mean the Photo ID Scan was Successful.
    // It simply means the User completed the Session.  You still need to perform the Photo ID Scan result checks on your Servers.

    //
    // Part 4:  Get essential data off the FaceTecIDScanResult
    //
    var parameters = {
      idScan: idScanResult.idScan
    };

    //
    // Sending up front and back images are non-essential, but are useful for auditing purposes, and are required in order for the FaceTec Server Dashboard to render properly.
    //
    if(idScanResult.frontImages && idScanResult.frontImages[0]) {
      parameters.idScanFrontImage = idScanResult.frontImages[0];
    }

    if(idScanResult.backImages && idScanResult.backImages[0]) {
      parameters.idScanBackImage = idScanResult.backImages[0];
    }

    //
    // Part 5:  Make the Networking Call to Your Servers.  Below is just example code, you are free to customize based on how your own API works.
    //

    this.latestNetworkRequest = new XMLHttpRequest();
    this.latestNetworkRequest.open("POST", Config.BaseURL + "/idscan-only");
    this.latestNetworkRequest.setRequestHeader("Content-Type", "application/json");

    this.latestNetworkRequest.setRequestHeader("X-Device-Key", Config.DeviceKeyIdentifier);
    this.latestNetworkRequest.setRequestHeader("X-User-Agent", FaceTecSDK.createFaceTecAPIUserAgentString(idScanResult.sessionId));

    this.latestNetworkRequest.onreadystatechange = () => {
      //
      // Part 6:  In our Sample, we evaluate a boolean response and treat true as was successfully processed and should proceed to next step,
      // and handle all other responses by cancelling out.
      // You may have different paradigms in your own API and are free to customize based on these.
      //

      if(this.latestNetworkRequest.readyState === XMLHttpRequest.DONE) {
        try {
          const responseJSON = JSON.parse(this.latestNetworkRequest.responseText);
          const scanResultBlob = responseJSON.scanResultBlob;

          // In v9.2.0+, we key off a new property called wasProcessed to determine if we successfully processed the Session result on the Server.
          // Device SDK UI flow is now driven by the proceedToNextStep function, which should receive the scanResultBlob from the Server SDK response.
          if(responseJSON.wasProcessed === true) {
            // In v9.2.0+, configure the messages that will be displayed to the User in each of the possible cases.
            // Based on the internal processing and decision logic about how the flow gets advanced, the FaceTec SDK will use the appropriate, configured message.
            // Please note that this programmatic API overrides these same Strings that can also be set via our standard, non-programmatic Text Customization & Localization APIs.
            FaceTecSDK.FaceTecCustomization.setIDScanResultScreenMessageOverrides(
              "Escaneo completado", // Successful scan of ID front-side (ID Types with no back-side).
              "Frente el DNI<br/>Escaneado", // Successful scan of ID front-side (ID Types that do have a back-side).
              "Escaneo completado", // Successful scan of the ID back-side.
              "Escaneo pasaporte completado", // Successful scan of a Passport
              "Foto escaneo DNI<br/>Completado", // Successful upload of final Photo ID Scan result containing User-Confirmed ID Text.
              "La cara no coincide<br/>Demasiado", // Case where a Retry is needed because the Face on the Photo ID did not Match the User's Face highly enough.
              "El DNI<br/>No es está muy visible", // Case where a Retry is needed because a Full ID was not detected with high enough confidence.
              "El texto del DNI no es visible", // Case where a Retry is needed because the OCR did not produce good enough results and the User should Retry with a better capture.
              "El tipo de DNI no coincide<br/>Inténtelo de nuevo" // Case where there is likely no OCR Template installed for the document the User is attempting to scan.
            );

            // In v9.2.0+, simply pass in scanResultBlob to the proceedToNextStep function to advance the User flow.
            // scanResultBlob is a proprietary, encrypted blob that controls the logic for what happens next for the User.
            // Cases:
            //   1.  User must re-scan the same side of the ID that they just tried.
            //   2.  User succeeded in scanning the Front Side of the ID, there is no Back Side, and the User is now sent to the User OCR Confirmation UI.
            //   3.  User succeeded in scanning the Front Side of the ID, there is a Back Side, and the User is sent to the Auto-Capture UI for the Back Side of their ID.
            //   4.  User succeeded in scanning the Back Side of the ID, and the User is now sent to the User OCR Confirmation UI.
            //   5.  The entire process is complete.  This occurs after sending up the final Photo ID Scan result that contains the User OCR Data.
            idScanResultCallback.proceedToNextStep(scanResultBlob);
          }
          else {
            // CASE:  UNEXPECTED response from API.  Our Sample Code keys off a wasProcessed boolean on the root of the JSON object --> You define your own API contracts with yourself and may choose to do something different here based on the error.
            console.log("Unexpected API response, cancelling out.");
            idScanResultCallback.cancel();
          }
        }
        catch{
          // CASE:  Parsing the response into JSON failed --> You define your own API contracts with yourself and may choose to do something different here based on the error.  Solid server-side code should ensure you don't get to this case.
          console.log("Exception while handling API response, cancelling out.");
          idScanResultCallback.cancel();
        }
      }
    };

    this.latestNetworkRequest.onerror = () => {
      // CASE:  Network Request itself is erroring --> You define your own API contracts with yourself and may choose to do something different here based on the error.
      console.log("XHR error, cancelling.");
      idScanResultCallback.cancel();
    };

    //
    // Part 7:  Demonstrates updating the Progress Bar based on the progress event.
    //
    this.latestNetworkRequest.upload.onprogress = (event) => {
      var progress = event.loaded / event.total;
      idScanResultCallback.uploadProgress(progress);
    };

    //
    // Part 8:  Actually send the request.
    //
    var jsonStringToUpload = JSON.stringify(parameters);
    this.latestNetworkRequest.send(jsonStringToUpload);
  };

  //
  // Part 9:  This function gets called after the FaceTec SDK is completely done.  There are no parameters because you have already been passed all data in the processSessionWhileFaceTecSDKWaits function and have already handled all of your own results.
  //
  onFaceTecSDKCompletelyDone = () => {
    //
    // DEVELOPER NOTE:  onFaceTecSDKCompletelyDone() is called after the Session has completed or you signal the FaceTec SDK with cancel().
    // Calling a custom function on the Sample App Controller is done for demonstration purposes to show you that here is where you get control back from the FaceTec SDK.
    //

    // If the Photo ID Scan was processed get the success result from isCompletelyDone
    if(this.latestIDScanResult !== null) {
      this.success = this.latestIDScanResult.isCompletelyDone;
    }

    this.sampleAppControllerReference.onComplete(null, this.latestIDScanResult, this.latestNetworkRequest.status);
  };

  //
  // DEVELOPER NOTE:  This public convenience method is for demonstration purposes only so the Sample App can get information about what is happening in the processor.
  // In your code, you may not even want or need to do this.
  //
  isSuccess = () => {
    return this.success;
  };
}
