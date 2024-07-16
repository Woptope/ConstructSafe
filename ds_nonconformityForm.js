// Define fields to show/hide based on type
var safetyFields = ["ds_hazardtype", "ds_immediateactiontaken", "ds_safetytrainingrequired", "ds_safetyinspectiondate"];
var qualityFields = ["ds_defecttype", "ds_affectedproduct", "ds_qualitycontrolmeasures"];
var environmentalFields = ["ds_environmentalimpact", "ds_incidentlocation", "ds_regulatorycomplianceissue", "ds_environmentalmitigationplan"];
var operationalFields = ["ds_operationaldisruption", "ds_estimateddowntime", "ds_operationalcostimpact", "ds_alternativeprocedures"];
var otherFields = ["ds_issuedescription", "ds_proposedsolution", "ds_deadlineforresolution"];

var stagesDict = {};
stagesDict["94c749eb-6c56-4f96-a4dd-ede1135ee209"] = "identification";
stagesDict["264ed770-531b-4466-ad9c-6c12c7125ff7"] = "corrective_actions";
stagesDict["f805fda4-8fae-4001-9eb1-5570c2edc5fd"] = "close";
stagesDict["0b919893-bcfa-497c-8275-40aeca7961b6"] = "evidences";


function onLoad(executionContext) {
    try {
        debugger;
        var formContext = executionContext.getFormContext();
        // Register the onTypeChange function to the Type field's OnChange event
        formContext.getAttribute("ds_type").addOnChange(onTypeChange);
        // Call the onTypeChange function initially to set the correct fields visibility
        onTypeChange(executionContext);

        formContext.data.process.addOnStageChange(setFocusForBPF);
        setFocusForBPF(executionContext);

    } catch (error) {
        console.error("Error in onLoad: ", error);
        var alertStrings = { confirmButtonLabel: "Ok", text: "An error occurred while loading the form. Please try again or contact support if the issue persists. Error details: " + error.message, title: "Error" };
        Alert(alertStrings);
    }
}


function setFocusForBPF(executionContext) {
    var formContext = executionContext.getFormContext();
    var nonConformityId = formContext.data.entity.getId();
    if (nonConformityId == "")
        return;

    var activeStage = formContext.data.process.getActiveStage();
    if (!activeStage)
        return
    var activeStageId = activeStage._activeStageId.toString().toLowerCase();
    var stageName = stagesDict[activeStageId];


    switch (stageName) {
        case "identification":
            formContext.ui.tabs.get("tab_general").setFocus();
            break;
        case "corrective_actions":
           // formContext.ui.tabs.get("tab_terms").sections.get("section_corrective_actions").setFocus();
            var controlSubGrid = formContext.getControl("Corrective_Actions");
            controlSubGrid.setFocus();
            break;
        case "evidences":
            formContext.ui.tabs.get("tab_evidences").setFocus();
            break;
        case "close":
            formContext.ui.tabs.get("tab_general").setFocus();
            break;
        default:
            formContext.ui.tabs.get("tab_general").setFocus();
            break;
    }
}

function onTypeChange(executionContext) {
    try {
        var formContext = executionContext.getFormContext();
        var type = formContext.getAttribute("ds_type").getValue();

        // Check if type is null or empty
        if (type === null || type === undefined) {
            hideAllFields(formContext);
            return; // Exit the function to avoid further processing
        }

        // Hide all fields initially
        hideAllFields(formContext);

        // Show relevant fields based on selected type
        switch (type) {
            case 717590000: // Safety
                showFields(formContext, safetyFields);
                break;
            case 717590001: // Quality
                showFields(formContext, qualityFields);
                break;
            case 717590002: // Environmental
                showFields(formContext, environmentalFields);
                break;
            case 717590003: // Operational
                showFields(formContext, operationalFields);
                break;
            case 717590004: // Other
                showFields(formContext, otherFields);
                break;
            default:
                console.warn("Unknown type value: " + type);
                var alertStrings = { confirmButtonLabel: "Ok", text: "Unknown type selected. Please select a valid non-conformity type.", title: "Warning" };
                Alert(alertStrings);
        }
    } catch (error) {
        console.error("Error in onTypeChange: ", error);
        var alertStrings = { confirmButtonLabel: "Ok", text: "An error occurred while processing the type change. Please try again or contact support if the issue persists. Error details: " + error.message, title: "Error" };
        Alert(alertStrings);
    }
}

function hideFields(formContext, fields) {
    try {
        fields.forEach(function (field) {
            var control = formContext.getControl(field);
            if (control) {
                control.setVisible(false);
            }
        });
    } catch (error) {
        console.error("Error in hideFields: ", error);
        var alertStrings = { confirmButtonLabel: "Ok", text: "An error occurred while hiding fields. Please try again or contact support if the issue persists. Error details: " + error.message, title: "Error" };
        Alert(alertStrings);
    }
}

// Function to hide all fields
function hideAllFields(formContext) {
    hideFields(formContext, safetyFields);
    hideFields(formContext, qualityFields);
    hideFields(formContext, environmentalFields);
    hideFields(formContext, operationalFields);
    hideFields(formContext, otherFields);
}

function showFields(formContext, fields) {
    try {
        fields.forEach(function (field) {
            var control = formContext.getControl(field);
            if (control) {
                control.setVisible(true);
            }
        });
    } catch (error) {
        console.error("Error in showFields: ", error);
        var alertStrings = { confirmButtonLabel: "Ok", text: "An error occurred while showing fields. Please try again or contact support if the issue persists. Error details: " + error.message, title: "Error" };
        Alert(alertStrings);
    }
}



function Alert(alertStrings) {
    var _alertOptions = { height: 120, width: 260 }; // Optional, adjust as needed
    Xrm.Navigation.openAlertDialog(alertStrings, _alertOptions).then(
        function (success) {
            console.log("Alert dialog closed");
        },
        function (error) {
            console.log(error.message);
        }
    );
}
