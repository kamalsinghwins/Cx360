var token, clientId, reportedBy, generalInformationID, cansVersioningID, sectionStatus, currentRow,
    selectedText = "", blankGeneralInformationID,
    cansRolePermissions, editPermission, deletePermission,jsonResult='',sigValueId='',sigDisplayId='';
var sectionChanged = false;
var dataTableEstabilishedSupportsFlg = false;
var dataTableFamilyMembersFlg = false;
var dataTableSubstanceAbuseTreatmentFlg = false;
var dataTableOutpatientMentalHealthFlg = false;
var dataTablePsychiatricallyHospitalizedFlg = false;
var dataTableAdditionalHospitalizationsFlg = false;
var dataTableMedicationFlg = false;
var dataTableDiagnosisFlg = false;
var dataTableProviderFlg = false;
var currentRowFamilyMembers;
var currentRowEstabilishedSupports;
var currentRowSubstanceAbuseTreatment;
var currentRowAdditionalHospitalizations;
var currentRowMedication;
var currentRowProviders;
var currentRowPsychiatricallyHospitalized;
var currentRowDiagnosis;
var currentRowMentalHealthServices;
var EstablishedSupports;
var FamilyMembers;
var selectedValue;
var selectedText;
var className;
var documentMode="";

$(document).ready(function () {

    if (!authenticateUser()) return;
    $(".select2").select2();
    //InitializeSignaturePad();
    $sigdiv = $("#Signature").jSignature({ 'UndoButton': true });

    generalInformationID = GetParameterValues('GeneralInformationID');
    cansVersioningID = GetParameterValues('CansVersioningID');
    InitalizeDateControls();
    CloseErrorMeeage();
    BindDropDownCANS();
    GetCansRolesPermissions();
    InitializeSectionTables();
    AddEstabilishedSupports();
    AddFamilyConstellation();
    ValidateStaffSignatures();
    AddPriorAbuseTreatment();
    AddDiagnosisCode();
    $('.close').click(function () {
        $('.collapse').removeClass('show');
        $('.modal-backdrop').removeClass('show');
    });

    $(".close").click(function () {
        $(this).closest("span").addClass("hidden");
    });
    $(".section17 .clearData").on('click', function () {
        $(".section17 select").val("");
        $(".section17 input").val("");
        $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "1");
    });
    clientId = GetParameterValues('ClientId');



    $("#AddPriorOutpatientMentalHealthServices").on("click", function () {
        if (!$("#AddPriorOutpatientMentalHealthServices").hasClass("editRow")) {
            if ($("#TextBoxMentalhealthhistwhen").val() == '' && $("#TextBoxMentalhealthhistwhere").val() == '' && $("#TextBoxMentalhealthhistwithwhom").val() == '' && $("#TextBoxMentalhealthhistreason").val() == '') {
                showErrorMessage(" select atleast one field.");
                return;
            }

            if (dataTableOutpatientMentalHealthFlg) {
                newRow = $('#PriorMentalHealthServices').DataTable();
                var rowExists = false;
             
                var rowCount = $('#PriorMentalHealthServices tr').length;
                if (rowCount > 5) {
                    showErrorMessage(" Not allowed more than 5 records");
                    return;

                }
                else {
                var text = [{
                    "Actions": CreateChildBtnWithPermission("EditPriorOutpatientMentalHealthServices", "DeleteEditPriorOutpatientMentalHealthServices"), 

                    "Mentalhealthhistwhen": $("#TextBoxMentalhealthhistwhen").val(),
                    "Mentalhealthhistwhere": $("#TextBoxMentalhealthhistwhere").val(),
                    "Mentalhealthhistwithwhom": $("#TextBoxMentalhealthhistwithwhom").val(),
                    "Mentalhealthhistreason": $("#TextBoxMentalhealthhistreason").val(),
                    "OutpatientMentalHealthServicesID": $("#TextBoxOutpatientMentalHealthServicesID").val() == undefined ? '' : $("#TextBoxOutpatientMentalHealthServicesID").val(),

                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw(false);
                showRecordSaved("Prior Outpatient MentalHealth Services added successfully.");

                clearOutpatientMentalHealth();
                }

            }
            else {
                var rowExists = false;
                newRow = $('#PriorMentalHealthServices').DataTable();
               
                var rowCount = $('#PriorMentalHealthServices tr').length;
                if (rowCount > 5) {
                    showErrorMessage("Not allowed more than 5 records");
                    return;
                }
                else {
                newRow.row.add([
                    CreateChildBtnWithPermission("EditPriorOutpatientMentalHealthServices", "DeleteEditPriorOutpatientMentalHealthServices"), 
                    //  selectedText.trim(),
                    $("#TextBoxMentalhealthhistwhen").val(),
                    $("#TextBoxMentalhealthhistwhere").val(),
                    $("#TextBoxMentalhealthhistwithwhom").val(),
                    $("#TextBoxMentalhealthhistreason").val(),
                    $("#TextBoxOutpatientMentalHealthServicesID").val() == undefined ? '' : $("#TextBoxOutpatientMentalHealthServicesID").val(),
                ]).draw(false);
                showRecordSaved("Prior Outpatient MentalHealth Services added successfully.");

                clearOutpatientMentalHealth();
                 }

            }

        }

    });
   


    $("#AddPsychiatricallyHospitalized").on("click", function () {
        if (!$("#AddPsychiatricallyHospitalized").hasClass("editRow")) {
            if ($("#TextBoxPsychHospitalName").val() == '' && $("#TextBoxPsychHospitalLocation").val() == '' && $("#TextBoxPsychHospitalizationDate").val() == '' && $("#TextBoxReasonHospitalizedPsych").val() == '') {
                showErrorMessage(" select atleast one field.");
                return;
            }

            if (dataTablePsychiatricallyHospitalizedFlg) {
                newRow = $('#PsychiatricallyHospitalized').DataTable();
                var rowExists = false;
                var rowCount = $('#PsychiatricallyHospitalized tr').length;
                if (rowCount > 5) {
                    showErrorMessage("Not allowed more than 5 records");
                    return;
                }
                else {
                var text = [{
                    "Actions": CreateChildBtnWithPermission("EditPsychiatricallyHospitalized", "DeleteEditPsychiatricallyHospitalized"),  

                    "PsychHospitalName": $("#TextBoxPsychHospitalName").val(),
                    "PsychHospitalLocation": $("#TextBoxPsychHospitalLocation").val(),
                    "PsychHospitalizationDate": $("#TextBoxPsychHospitalizationDate").val(),
                    "ReasonHospitalizedPsych": $("#TextBoxReasonHospitalizedPsych").val(),
                    "MedicalHistoryPsychHospitalID": $("#TextBoxMedicalHistoryPsychHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryPsychHospitalID").val(),

                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw(false);
                showRecordSaved("Psychiatrically Hospitalized added successfully.");

                ClearFieldsValue('PsychiatricallyHospitalized');
                }

            }
            else {
                var rowExists = false;
                newRow = $('#PsychiatricallyHospitalized').DataTable();
                var rowCount = $('#PsychiatricallyHospitalized tr').length;
                if (rowCount > 5) {
                    showErrorMessage("Not allowed more than 5 records");
                    return;
                }
                else {
                newRow.row.add([
                    CreateChildBtnWithPermission("EditPsychiatricallyHospitalized", "DeleteEditPsychiatricallyHospitalized"), 
                    //  selectedText.trim(),
                    $("#TextBoxPsychHospitalName").val(),
                    $("#TextBoxPsychHospitalLocation").val(),
                    $("#TextBoxPsychHospitalizationDate").val(),
                    $("#TextBoxReasonHospitalizedPsych").val(),
                    $("#TextBoxMedicalHistoryPsychHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryPsychHospitalID").val(),
                ]).draw(false);
                showRecordSaved("Psychiatrically Hospitalized added successfully.");

                ClearFieldsValue('PsychiatricallyHospitalized');
                 }

            }

        }

    });

    $("#AddAdditHospital").on("click", function () {
        if (!$("#AddAdditHospital").hasClass("editRow")) {
            if ($("#TextBoxHospitalName").val() == '' && $("#TextBoxHospitalLocation").val() == '' && $("#TextBoxHospitalizationDate").val() == '' && $("#TextBoxReasonHospitalized").val() == '') {
                showErrorMessage(" select atleast one field.");
                return;
            }

            if (dataTableAdditionalHospitalizationsFlg) {
                newRow = $('#additionalHospitalizations').DataTable();
                var rowExists = false;
                var rowCount = $('#additionalHospitalizations tr').length;
                if (rowCount > 3) {
                    showErrorMessage("Not allowed more than 5 records");
                    return;
                }
                else {
                var text = [{
                    "Actions": CreateChildBtnWithPermission("EditAdditionalHospitalizations", "DeleteEditAdditionalHospitalizations"), 

                    "HospitalName": $("#TextBoxHospitalName").val(),
                    "HospitalLocation": $("#TextBoxHospitalLocation").val(),
                    "HospitalizationDate": $("#TextBoxHospitalizationDate").val(),
                    "ReasonHospitalized": $("#TextBoxReasonHospitalized").val(),
                    "MedicalHistoryAdditHospitalID": $("#TextBoxMedicalHistoryAdditHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryAdditHospitalID").val(),

                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw(false);
                showRecordSaved("Additional Hospitalizations added successfully.");

                ClearFieldsValue('AdditionalHospitalizations');
                }

            }
            else {
                var rowExists = false;
                newRow = $('#additionalHospitalizations').DataTable();
                var rowCount = $('#additionalHospitalizations tr').length;
                if (rowCount > 3) {
                    showErrorMessage("Not allowed more than 5 records");
                    return;
                }
                else {
                newRow.row.add([
                    CreateChildBtnWithPermission("EditAdditionalHospitalizations", "DeleteEditAdditionalHospitalizations"), 
                    //  selectedText.trim(),
                    $("#TextBoxHospitalName").val(),
                    $("#TextBoxHospitalLocation").val(),
                    $("#TextBoxHospitalizationDate").val(),
                    $("#TextBoxReasonHospitalized").val(),
                    $("#TextBoxMedicalHistoryAdditHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryAdditHospitalID").val(),
                ]).draw(false);
                showRecordSaved("Additional Hospitalizations added successfully.");

                ClearFieldsValue('AdditionalHospitalizations');
                  }

            }

        }

    });

    $("#AddProvider").on("click", function () {
        if (!$("#AddProvider").hasClass("editRow")) {
            if ($("#TextBoxProviderName").val() == '' && $("#TextBoxProviderSpecialty").val() == '' && $("#TextBoxProviderServices").val() == '') {
                showErrorMessage(" select atleast one field.");
                return;
            }

            if (dataTableProviderFlg) {
                newRow = $('#specialtiesProviders').DataTable();
                var rowExists = false;
                var rowCount = $('#specialtiesProviders tr').length;
                if (rowCount > 3) {
                    showErrorMessage("Not allowed more than 3 records");
                    return;
                }
                else {
                    var text = [{
                        "Actions": CreateChildBtnWithPermission("EditProvider", "DeleteEditProvider"),

                        "ProviderName": $("#TextBoxProviderName").val(),
                        "ProviderSpecialty": $("#TextBoxProviderSpecialty").val(),
                        "ProviderServices": $("#TextBoxProviderServices").val(),
                        "MedicalHistoryProviderID": $("#TextBoxMedicalHistoryProviderID").val() == undefined ? '' : $("#TextBoxMedicalHistoryProviderID").val(),

                    }];
                    var stringyfy = JSON.stringify(text);
                    var data = JSON.parse(stringyfy);
                    newRow.rows.add(data).draw(false);
                    showRecordSaved("Provider added successfully.");

                    ClearFieldsValue('Provider');
                }

            }
            else {
                var rowExists = false;
                newRow = $('#specialtiesProviders').DataTable();
                var rowCount = $('#specialtiesProviders tr').length;
                if (rowCount > 3) {
                    showErrorMessage("Not allowed more than 3 records");
                    return;
                }
                else {
                newRow.row.add([
                    CreateChildBtnWithPermission("EditProvider", "DeleteEditProvider"), 
                    //  selectedText.trim(),
                    $("#TextBoxProviderName").val(),
                    $("#TextBoxProviderSpecialty").val(),
                    $("#TextBoxProviderServices").val(),
                    $("#TextBoxMedicalHistoryProviderID").val() == undefined ? '' : $("#TextBoxMedicalHistoryProviderID").val(),
                ]).draw(false);
                showRecordSaved("Provider added successfully.");

                ClearFieldsValue('Provider');
                 }

            }

        }

    });

    $("#Addmedication").on("click", function () {
        if (!$("#Addmedication").hasClass("editRow")) {
            if ($("#TextBoxMedicationName").val() == '' && $("#TextBoxMedicationPrescriberName").val() == '' && $("#TextBoxMedicationDosage").val() == '' && $("#TextBoxMedicationPrescriptionBeginDate").val() == '' && $("#TextBoxMedicationPrescriptionEndDate").val() == '' && $("#TextBoxMedicationIssues").val() == '') {
                showErrorMessage(" select atleast one field.");
                return;
            }

            if (dataTableMedicationFlg) {
                newRow = $('#medication').DataTable();
                var rowExists = false;
                var rowCount = $('#medication tr').length;

                if (rowCount > 8) {
                    showErrorMessage("Not allowed more than 3 records");
                    return;
                }
                else {
                var text = [{
                    "Actions": CreateChildBtnWithPermission("EditMedication", "DeleteEditMedication"), 

                    "MedicationName": $("#TextBoxMedicationName").val(),
                    "MedicationPrescriberName": $("#TextBoxMedicationPrescriberName").val(),
                    "MedicationDosage": $("#TextBoxMedicationDosage").val(),
                    "MedicationPrescriptionBeginDate": $("#TextBoxMedicationPrescriptionBeginDate").val(),
                    "MedicationPrescriptionEndDate": $("#TextBoxMedicationPrescriptionEndDate").val(),
                    "MedicationIssues": $("#TextBoxMedicationIssues").val(),
                    "MedicationDetailID": $("#TextBoxMedicationDetailID").val() == undefined ? '' : $("#TextBoxMedicationDetailID").val(),

                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw(false);
                showRecordSaved("Medication added successfully.");

                ClearFieldsValue('Medication');
                }

            }
            else {
                var rowExists = false;
                newRow = $('#medication').DataTable();
                var rowCount = $('#medication tr').length;

                if (rowCount > 8) {
                    showErrorMessage("Not allowed more than 3 records");
                    return;
                }
                else {
                newRow.row.add([
                    CreateChildBtnWithPermission("EditMedication", "DeleteEditMedication"), 
                    //  selectedText.trim(),
                    $("#TextBoxMedicationName").val(),
                    $("#TextBoxMedicationPrescriberName").val(),
                    $("#TextBoxMedicationDosage").val(),
                    $("#TextBoxMedicationPrescriptionBeginDate").val(),
                    $("#TextBoxMedicationPrescriptionEndDate").val(),
                    $("#TextBoxMedicationIssues").val(),
                    $("#TextBoxMedicationDetailID").val() == undefined ? '' : $("#TextBoxMedicationDetailID").val(),
                ]).draw(false);
                showRecordSaved("Medication added successfully.");

                ClearFieldsValue('Medication');
               }

            }

        }

    });





    
    if (generalInformationID > 0 && cansVersioningID > 0) {
        ManageCANSAssessment(generalInformationID);
    }
    else {
        DisableSaveButtonChildSection();
        setTimeout(function () {
            AddNewPermission();
        }, 5000);
    }
   
});

//#region binding cans
function ManageCANSAssessment(generalInformationId) {
    DisableBackGround();
    $.ajax({
        type: "POST",
        data: { TabName: "GetCANSAssessmentDetails", GeneralInformationID: generalInformationId },
        url: GetAPIEndPoints("GETCANSASSESSMENTDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {


                setTimeout(function () {
                    EnableBackGround();
                    fillAllCANSAssessmentSection(result);
                }, 5000);
               
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
    
}

function fillAllCANSAssessmentSection(result) {
   
    BindGeneralSection(result);
    BindTraumaExposureSection(result);
    BindPresentingPromblemImpact(result);
    BindSafetySection(result);
    BindSubstanceUseHistory(result);
    BindPlacementHistory(result);
    BindPsychiatricInformation(result);
    BindClientStrength(result);
    BindFamilyInformation(result);
    BindNeedsResourceAssessment(result);
    BindMentalHealthSummary(result);
    BindAddClientFunctioningEvaluation(result);
    BindIndividualTreatmentPlan(result);
    BindCansSignature(result);
    BindGeneralInformationHRA(result);
    BindMedication(result);
    BindHealthStatus(result);
    BindDevelopmentHistory(result);
    BindMedicalHistory(result);
    BindCaregiverAddendum(result);
    BindGeneralInformationDCFS(result);
    BindSexuallyAggrBehavior(result);
    BindParentGuardSafety(result);
    BindParentGuardWellbeing(result);
    BindParentGuardPermananence(result);
    BindSubstituteCommitPermananence(result);
    BindIntactFamilyService(result);
    BindIntensivePlacementStabilization(result);

    BindAllChildTables(result);

    ShowHideButtonsAndSections(result.GeneralInformation[0].DocumentStatus, result.GeneralInformation[0].LatestVersion);
    CheckUserPermission();

}

function BindAllChildTables(result) {
    if (result.AllChildTables[0].JSONSubstanceAbuseTreatmentData != null) {
        var table = $('#PriorSubstanceAbuseTreatment').DataTable();
        table.clear();
        $('#PriorSubstanceAbuseTreatment').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONSubstanceAbuseTreatmentData),
            "columns": [{ "data": "Actions" }, { "data": "Subabusehistwhen" }, { "data": "Subabusehistwhere" }, { "data": "Subabusehistwithwhom" }, { "data": "Subabusehistreason" }, { "data": "SubstanceAbuseTreatmentID" }]
        });
        dataTableSubstanceAbuseTreatmentFlg = true;
    }
    if (result.AllChildTables[0].JSONEstabilishedSupportsData != null) {
        var table = $('#establishedSupports').DataTable();
        table.clear();
        $('#establishedSupports').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [1, 7] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONEstabilishedSupportsData),
            "columns": [{ "data": "Actions" }, { "data": "EstabilishedSupportsType" }, { "data": "EstabilishedSupports" }, { "data": "EsAgency" }, { "data": "EsContact" }, { "data": "EsPhone" }, { "data": "EsEmail" }, { "data": "GeneraInfoEstabilishedSupportsId" }]
        });
        dataTableEstabilishedSupportsFlg = true;
    }
    if (result.AllChildTables[0].JSONFamilyMembersData != null) {
        var table = $('#MembersFamilyConstellation').DataTable();
        table.clear();
        $('#MembersFamilyConstellation').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONFamilyMembersData),
            "columns": [{ "data": "Actions" }, { "data": "FamilyMemberName" }, { "data": "FamilyMemberAge" }, { "data": "FamilyMemberRelation" }, { "data": "FamilyMemberInHome" }, { "data": "GeneralInfoFamilyMembersId" }]
        });
        dataTableFamilyMembersFlg = true;
    }
    if (result.AllChildTables[0].JSONOutpatientMentalHealthServicesData != null) {
        var table = $('#PriorMentalHealthServices').DataTable();
        table.clear();
        $('#PriorMentalHealthServices').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONOutpatientMentalHealthServicesData),
            "columns": [{ "data": "Actions" }, { "data": "Mentalhealthhistwhen" }, { "data": "Mentalhealthhistwhere" }, { "data": "Mentalhealthhistwithwhom" }, { "data": "Mentalhealthhistreason" }, { "data": "OutpatientMentalHealthServicesID" }]
        });
        dataTableOutpatientMentalHealthFlg = true;

    }

    if (result.AllChildTables[0].JSONMedicationDetailData != null) {
        var table = $('#medication').DataTable();
        table.clear();
        $('#medication').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [7] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONMedicationDetailData),
            "columns": [{ "data": "Actions" }, { "data": "MedicationName" }, { "data": "MedicationPrescriberName" }, { "data": "MedicationDosage" }, { "data": "MedicationPrescriptionBeginDate" }, { "data": "MedicationPrescriptionEndDate" }, { "data": "MedicationIssues" }, { "data": "MedicationDetailID" }]
        });
        dataTableMedicationFlg = true;

    }
    if (result.MedicalHistory.length >0 && result.MedicalHistory[0].PsychiatricallyHospitalizedText == "Yes") {

        $('.PsychiatricallyHospitalized').removeAttr('hidden');
        $('.PsychiatricallyHospitalized').show();
        if (result.AllChildTables[0].JSONMedicalHistoryPsychData != null) {
            var table = $('#PsychiatricallyHospitalized').DataTable();
            table.clear();
            $('#PsychiatricallyHospitalized').DataTable({
                "stateSave": true,
                "bDestroy": true,
                "paging": false,
                "searching": false,
                'columnDefs': [
                    { 'visible': false, 'targets': [5] }
                ],
                "aaData": JSON.parse(result.AllChildTables[0].JSONMedicalHistoryPsychData),
                "columns": [{ "data": "Actions" }, { "data": "PsychHospitalName" }, { "data": "PsychHospitalLocation" }, { "data": "PsychHospitalizationDate" }, { "data": "ReasonHospitalizedPsych" }, { "data": "MedicalHistoryPsychHospitalID" }]
            });
            dataTablePsychiatricallyHospitalizedFlg = true;
        }}
    else {
        $('.PsychiatricallyHospitalized').addClass('hidden');
        $('#PsychiatricallyHospitalized').DataTable().clear().draw();
    }
    if (result.MedicalHistory.length > 0 &&  result.MedicalHistory[0].IsAdditionalPagesNeeded == false) {
        $('.AdditionalPagesNeeded').removeAttr('hidden');
        $('.AdditionalPagesNeeded').show();
        if (result.AllChildTables[0].JSONMedicalHistoryAdditData != null) {
            var table2 = $('#additionalHospitalizations').DataTable();
            table2.clear();
            $('#additionalHospitalizations').DataTable({
                "stateSave": true,
                "bDestroy": true,
                "paging": false,
                "searching": false,
                'columnDefs': [
                    { 'visible': false, 'targets': [5] }
                ],
                "aaData": JSON.parse(result.AllChildTables[0].JSONMedicalHistoryAdditData),
                "columns": [{ "data": "Actions" }, { "data": "HospitalName" }, { "data": "HospitalLocation" }, { "data": "HospitalizationDate" }, { "data": "ReasonHospitalized" }, { "data": "MedicalHistoryAdditHospitalID" }]
            });
            dataTableAdditionalHospitalizationsFlg = true;
        }
    }
    else {
        if (result.MedicalHistory.length <= 0) {
            $('.AdditionalPagesNeeded').removeAttr('hidden');
            $('.AdditionalPagesNeeded').show();
           
        }
        else{
            $('.AdditionalPagesNeeded').addClass('hidden');
            $("#additionalHospitalizations").DataTable().clear().draw();
        }
    }
    
  
    if (result.AllChildTables[0].JSONMedicalHistoryProviderData != null) {
        var table3 = $('#specialtiesProviders').DataTable();
        table3.clear();
        $('#specialtiesProviders').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [4] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONMedicalHistoryProviderData),
            "columns": [{ "data": "Actions" }, { "data": "ProviderName" }, { "data": "ProviderSpecialty" }, { "data": "ProviderServices" }, { "data": "MedicalHistoryProviderID" }]
        });
        dataTableProviderFlg = true;
    }

    //Section 11 diagnosis  table if
    if (result.AllChildTables[0].JSONDiagnosisData != null) {

        var diganosisStatus = JSON.parse(result.AllChildTables[0].JSONDiagnosisData)[0].Status;
        if (diganosisStatus == "Completed") {
            HandleCompleteSection("DsmDiagnosis");
        } else {
            HandleInprogressSection("DsmDiagnosis");
        }

        var table = $('#diagnosis').DataTable();
        table.clear();
        $('#diagnosis').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [1, 6] }
            ],
            "aaData": JSON.parse(result.AllChildTables[0].JSONDiagnosisData),
            "columns": [{ "data": "Actions" }, { "data": "DiagnosisCode" }, { "data": "DiagnosticCodeDescription" }, { "data": "ICD5Name" }, { "data": "ICD10Name" }, { "data": "Diagnosis" }, { "data": "DsmDiagnosisID" }]
        });
        dataTableDiagnosisFlg = true;
    }
    else {
        HandleStartSection("DsmDiagnosis");
    }

    //Section 16 treatment plan  tables
    var table = $('#tblTreatmentPlans').DataTable();
    table.clear();
    $('#tblTreatmentPlans').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "aaData": JSON.parse(result.AllChildTables[0].JSONTreatmentPlanData),
        "aoColumns": [{ "mData": "Actions" }, { "mData": "StartDate" }, { "mData": "TreatmentPlan" }, { "mData": "CANSLink" }, { "mData": "CansTreatmentPlanGoalText" }]
    });
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');

    //Sectin 14 summary priottrized needs and strength
    if (result.AllChildTables[0].JSONNeedsStrengthData != null) {
        var needsStrengthStatus = JSON.parse(result.AllChildTables[0].JSONNeedsStrengthData)[0].Status;
        if (needsStrengthStatus == "Completed") {
            HandleCompleteSection("section14");
        } else {
            HandleInprogressSection("section14");
        }
        CreateNeedsStrengthSectionsAfterSave(JSON.parse(result.AllChildTables[0].JSONNeedsStrengthData));

    }
    else {
        HandleStartSection("section14");
    }
    //Section 17 service interventions tables
    FillServiceInterventionTable(result.AllChildTables[0].JSONServiceInterventionsData);

}

function BindGeneralSection(result) {
    if (result.GeneralInformation[0] != undefined) {
        $("#labelCansStatus").text(result.GeneralInformation[0].DocumentStatus);
        $("#labelDocumentVersion").text(result.GeneralInformation[0].DocumentVersion);
        $('#TextBoxGeneralInformationId').val(result.GeneralInformation[0].GeneralInformationID);
        $('#TextBoxCansVersioningID').val(result.GeneralInformation[0].CansVersioningID);
        $("input[name='RadioCansType'][value = " + result.GeneralInformation[0].CansType + "]").prop('checked', true)
        $('#DropDownClientId').val(result.GeneralInformation[0].ClientID);
        clientId = result.GeneralInformation[0].ClientID;
        $('#TextBoxDateofbirth').val(result.GeneralInformation[0].Dateofbirth);
        $('#TextBoxRin').val(result.GeneralInformation[0].Rin);
        $('#TextBoxGender').val(result.GeneralInformation[0].Gender);
        $('#TextBoxRefSource').val(result.GeneralInformation[0].RefSource);
        $('#TextBoxDateFirstCont').val(result.GeneralInformation[0].DateFirstCont);
        $('#TextBoxPhone').val(result.GeneralInformation[0].Phone);
        $('#TextBoxLanguage').val(result.GeneralInformation[0].Language);
        $('#DropDownInterpreterServices').val(result.GeneralInformation[0].InterpreterServicesId);
        if (result.GeneralInformation[0].InterpreterServicesId > 0 && result.GeneralInformation[0].InterpreterServices == "Spoken Language") {
            $(".interspoken").removeAttr("hidden");
            $(".interspoken").show();
            $('#TextBoxInterSpoken').val(result.GeneralInformation[0].InterSpoken);
        }
        if (result.GeneralInformation[0].InterpreterServicesId > 0 && result.GeneralInformation[0].InterpreterServices == "Other") {
            $(".InterpreterOtherDetails").removeAttr("hidden");
            $(".InterpreterOtherDetails").show();
            $('#TextBoxInterOther').val(result.GeneralInformation[0].InterOther);
        }
        $('#TextBoxInterOther').val(result.GeneralInformation[0].InterOther);
        $('#TextBoxInterSpoken').val(result.GeneralInformation[0].InterSpoken);
        $('#TextBoxAddress').val(result.GeneralInformation[0].Address);
        $('#TextBoxCity').val(result.GeneralInformation[0].City);
        $('#TextBoxState').val(result.GeneralInformation[0].State);
        $('#TextBoxZipCode').val(result.GeneralInformation[0].ZipCode);
        $('#TextBoxCounty').val(result.GeneralInformation[0].County);
        if (result.GeneralInformation[0].UsCitizen != null) {
            $("input[name='RadioUsCitizen'][value = " + (result.GeneralInformation[0].UsCitizen == true ? 1 : 0) + "]").prop('checked', true);
        }
        $('#TextBoxRace').val(result.GeneralInformation[0].Race);
        if (result.GeneralInformation[0].Race == "Other") {
            $('.RaceOtherDescription').removeAttr('hidden');
            $('.RaceOtherDescription').show();
            $('#TextBoxRaceOth').val(result.GeneralInformation[0].RaceOth);

        }
        $('#TextBoxMaritalStatus').val(result.GeneralInformation[0].MaritalStatus);
        $('#TextBoxEthnicity').val(result.GeneralInformation[0].Ethnicity);
        if (result.GeneralInformation[0].InsurCoverage == true) {
            $("input[name='CheckboxInsurCoverage']").prop('checked', true);
            $(".insurancecompany").removeAttr("hidden");
            $('#TextBoxInsuranceCompany').val(result.GeneralInformation[0].InsuranceCompany);
        }
        if (result.GeneralInformation[0].DCFSInvolvement != null) {
            $("input[name='RadioDCFSInvolvement'][value = " + (result.GeneralInformation[0].DCFSInvolvement == true ? 1 : 0) + "]").prop('checked', true);
        }
        if (result.GeneralInformation[0].Caregiver != null) {
            $("input[name='RadioCaregiver'][value = " + (result.GeneralInformation[0].Caregiver == true ? 1 : 0) + "]").prop('checked', true);
        }
        $('#TextBoxHouseHoldSize').val(result.GeneralInformation[0].HouseHoldSize);
        $('#TextBoxHouseHoldIncome').val(result.GeneralInformation[0].HouseHoldIncome);
       
        $('#DropDownGuardianStatus').val(result.GeneralInformation[0].GuardianStatusId);
        if (result.GeneralInformation[0].GuardianStatus=="Other") {
            $('.GuradianStatusOtherDesc').removeAttr('hidden');
            $('.GuradianStatusOtherDesc').show();
            $('#TextBoxGuardStatusOth').val(result.GeneralInformation[0].GuardStatusOth);
        }
        $('#DropDownEmploymentStatus').val(result.GeneralInformation[0].EmploymentStatusId);
        $('#DropDownLivingArrangement').val(result.GeneralInformation[0].LivingArrangementId);
        if (result.GeneralInformation[0].LivingArrangement=="Other") {
            $('.LivingArrangementOtherDesc').removeAttr('hidden');
            $('.LivingArrangementOtherDesc').show();
            $('#TextBoxlivArrangeOther').val(result.GeneralInformation[0].livArrangeOther);
        }
        $('#DropDownEducationLevel').val(result.GeneralInformation[0].EducationLevelId);
        $('#TextBoxParentFirstName').val(result.GeneralInformation[0].ParentFirstName);
        $('#TextBoxParentLastName').val(result.GeneralInformation[0].ParentLastName);
        $("input[name='RadioRelationshipToClient'][value = " + result.GeneralInformation[0].RelationshipToClient + "]").prop('checked', true);
        $('#TextBoxParentPhone').val(result.GeneralInformation[0].ParentPhone);
        $('#TextBoxParentAddress').val(result.GeneralInformation[0].ParentAddress);
        $('#TextBoxParentCity').val(result.GeneralInformation[0].ParentCity);
        $('#TextBoxParentState').val(result.GeneralInformation[0].ParentState);
        $('#TextBoxParentZip').val(result.GeneralInformation[0].ParentZip);
        $('#TextBoxParentCounty').val(result.GeneralInformation[0].ParentCounty);
        $('#TextBoxEmergConFirstName').val(result.GeneralInformation[0].EmergConFirstName);
        $('#TextBoxEmergConLastName').val(result.GeneralInformation[0].EmergConLastName);
        $('#TextBoxEcRelToClient').val(result.GeneralInformation[0].EcRelToClient);
        $('#TextBoxEcAddress').val(result.GeneralInformation[0].EcAddress);
        $('#TextBoxEcCity').val(result.GeneralInformation[0].EcCity);
        $('#TextBoxEcState').val(result.GeneralInformation[0].EcState);
        $('#TextBoxEcZip').val(result.GeneralInformation[0].EcZip);
        $('#TextBoxEcPhone').val(result.GeneralInformation[0].EcPhone);
        $('#TextBoxEmergencyCounty').val(result.GeneralInformation[0].EmergencyCounty);
        documentMode = result.GeneralInformation[0].DocumentStatus;
    }
}

function BindTraumaExposureSection(result) {
    if (result.TraumaExposure[0] != undefined) {
        if (result.TraumaExposure[0].Status == "Completed") {
            HandleCompleteSection("TraumaExposure");
        } else {
            HandleInprogressSection("TraumaExposure");
        }
        $('#TextBoxTraumaExposureID').val(result.TraumaExposure[0].TraumaExposureID);
        $("input[name='RadioTeSexualAbuse'][value = " + result.TraumaExposure[0].TeSexualAbuse + "]").prop('checked', true);
        $("input[name='RadioTeMedicalTrauma'][value = " + result.TraumaExposure[0].TeMedicalTrauma + "]").prop('checked', true);
        $("input[name='RadioTeVictimCriminalActivity'][value = " + result.TraumaExposure[0].TeVictimCriminalActivity + "]").prop('checked', true);
        $("input[name='RadioTePhysicalAbuse'][value = " + result.TraumaExposure[0].TePhysicalAbuse + "]").prop('checked', true);
        $("input[name='RadioTeNaturalDisaster'][value = " + result.TraumaExposure[0].TeNaturalDisaster + "]").prop('checked', true);
        $("input[name='RadioTeWarTerrorismAffected'][value = " + result.TraumaExposure[0].TeWarTerrorismAffected + "]").prop('checked', true);
        $("input[name='RadioTeNeglect'][value = " + result.TraumaExposure[0].TeNeglect + "]").prop('checked', true);
        $("input[name='RadioTewWitnessFamilyViolence'][value = " + result.TraumaExposure[0].TewWitnessFamilyViolence + "]").prop('checked', true);
        $("input[name='RadioTeDisruptionsCaregiving'][value = " + result.TraumaExposure[0].TeDisruptionsCaregiving + "]").prop('checked', true);
        $("input[name='RadioTeEmotionalAbuse'][value = " + result.TraumaExposure[0].TeEmotionalAbuse + "]").prop('checked', true);
        $("input[name='RadioTeWitnessCommunityViolence'][value = " + result.TraumaExposure[0].TeWitnessCommunityViolence + "]").prop('checked', true);
        $("input[name='RadioTeParentalCriminalBehavior'][value = " + result.TraumaExposure[0].TeParentalCriminalBehavior + "]").prop('checked', true);
        $('#TextBoxTeSupportingInfo').val(result.TraumaExposure[0].TeSupportingInfo);
    }

    else {
        HandleStartSection("TraumaExposure");
    }

}

function BindPresentingPromblemImpact(result) {
    if (result.PresentingProblemAndImpact[0] != undefined) {
        if (result.PresentingProblemAndImpact[0].Status == "Completed") {
            HandleCompleteSection("PresentinProblemAndImpact");
        } else {
            HandleInprogressSection("PresentinProblemAndImpact");
        }
        $('#TextBoxPresentinProblemAndImpactID').val(result.PresentingProblemAndImpact[0].PresentinProblemAndImpactID)
        $("input[name='RadioBeNeedAdjustTrauma'][value = " + result.PresentingProblemAndImpact[0].BeNeedAdjustTrauma + "]").prop('checked', true);
        $("input[name='RadioBeNeedAngerControl'][value = " + result.PresentingProblemAndImpact[0].BeNeedAngerControl + "]").prop('checked', true);
        $("input[name='RadioBeNeedAntisocial'][value = " + result.PresentingProblemAndImpact[0].BeNeedAntisocial + "]").prop('checked', true);
        $("input[name='RadioBeNeedAnxiety'][value = " + result.PresentingProblemAndImpact[0].BeNeedAnxiety + "]").prop('checked', true);
        $("input[name='RadioBeNeedAtypical'][value = " + result.PresentingProblemAndImpact[0].BeNeedAtypical + "]").prop('checked', true);
        $("input[name='RadioBeNeedDepression'][value = " + result.PresentingProblemAndImpact[0].BeNeedDepression + "]").prop('checked', true);
        $("input[name='RadioBeNeedEatingDist'][value = " + result.PresentingProblemAndImpact[0].BeNeedEatingDist + "]").prop('checked', true);
        $("input[name='RadioBeNeedFailTrive'][value = " + result.PresentingProblemAndImpact[0].BeNeedFailTrive + "]").prop('checked', true);
        $("input[name='RadioBeNeedImpulsivity'][value = " + result.PresentingProblemAndImpact[0].BeNeedImpulsivity + "]").prop('checked', true);
        $("input[name='RadioBeNeedInterpersonal'][value = " + result.PresentingProblemAndImpact[0].BeNeedInterpersonal + "]").prop('checked', true);
        $("input[name='RadioBeNeedMania'][value = " + result.PresentingProblemAndImpact[0].BeNeedMania + "]").prop('checked', true);
        $("input[name='RadioBeNeedOppositional'][value = " + result.PresentingProblemAndImpact[0].BeNeedOppositional + "]").prop('checked', true);
        $("input[name='RadioBeNeedPsychosis'][value = " + result.PresentingProblemAndImpact[0].BeNeedPsychosis + "]").prop('checked', true);
        $("input[name='RadioBeNeedRegulatory'][value = " + result.PresentingProblemAndImpact[0].BeNeedRegulatory + "]").prop('checked', true);
        $("input[name='RadioBeNeedSomatization'][value = " + result.PresentingProblemAndImpact[0].BeNeedSomatization + "]").prop('checked', true);
        $("input[name='RadioBeNeedSubstance'][value = " + result.PresentingProblemAndImpact[0].BeNeedSubstance + "]").prop('checked', true);
        $("input[name='RadioTraumaAttachment'][value = " + result.PresentingProblemAndImpact[0].TraumaAttachment + "]").prop('checked', true);
        $("input[name='RadioTraumaAvoidance'][value = " + result.PresentingProblemAndImpact[0].TraumaAvoidance + "]").prop('checked', true);
        $("input[name='RadioTraumaDissaociation'][value = " + result.PresentingProblemAndImpact[0].TraumaDissaociation + "]").prop('checked', true);
        $("input[name='RadioTraumaDysregulation'][value = " + result.PresentingProblemAndImpact[0].TraumaDysregulation + "]").prop('checked', true);
        $("input[name='RadioTraumaGrief'][value = " + result.PresentingProblemAndImpact[0].TraumaGrief + "]").prop('checked', true);
        $("input[name='RadioTraumaHyperarousal'][value = " + result.PresentingProblemAndImpact[0].TraumaHyperarousal + "]").prop('checked', true);
        $("input[name='RadioTraumaIntrusions'][value = " + result.PresentingProblemAndImpact[0].TraumaIntrusions + "]").prop('checked', true);
        $("input[name='RadioTraumaNumbing'][value = " + result.PresentingProblemAndImpact[0].TraumaNumbing + "]").prop('checked', true);
        $("input[name='RadioLifeBasicActivities'][value = " + result.PresentingProblemAndImpact[0].LifeBasicActivities + "]").prop('checked', true);
        $("input[name='RadioLifeCommunication'][value = " + result.PresentingProblemAndImpact[0].LifeCommunication + "]").prop('checked', true);
        $("input[name='RadioLifeDecisionMaking'][value = " + result.PresentingProblemAndImpact[0].LifeDecisionMaking + "]").prop('checked', true);
        $("input[name='RadioLifeDevelopmental'][value = " + result.PresentingProblemAndImpact[0].LifeDevelopmental + "]").prop('checked', true);
        $("input[name='RadioLifeElimination'][value = " + result.PresentingProblemAndImpact[0].LifeElimination + "]").prop('checked', true);
        $("input[name='RadioLifeFamFunctioning'][value = " + result.PresentingProblemAndImpact[0].LifeFamFunctioning + "]").prop('checked', true);
        $("input[name='RadioLifeFunctionalCommunication'][value = " + result.PresentingProblemAndImpact[0].LifeFunctionalCommunication + "]").prop('checked', true);
        $("input[name='RadioLifeIndependentLiving'][value = " + result.PresentingProblemAndImpact[0].LifeIndependentLiving + "]").prop('checked', true);
        $("input[name='RadioLifeIntimateRelationships'][value = " + result.PresentingProblemAndImpact[0].LifeIntimateRelationships + "]").prop('checked', true);
        $("input[name='RadioLifeJobFunctioning'][value = " + result.PresentingProblemAndImpact[0].LifeJobFunctioning + "]").prop('checked', true);
        $("input[name='RadioLifeLegal'][value = " + result.PresentingProblemAndImpact[0].LifeLegal + "]").prop('checked', true);
        $("input[name='RadioLifeLivingSituation'][value = " + result.PresentingProblemAndImpact[0].LifeLivingSituation + "]").prop('checked', true);
        $("input[name='RadioLifeLoneliness'][value = " + result.PresentingProblemAndImpact[0].LifeLoneliness + "]").prop('checked', true);
        $("input[name='RadioLifeMedicalPhysical'][value = " + result.PresentingProblemAndImpact[0].LifeMedicalPhysical + "]").prop('checked', true);
        $("input[name='RadioLifeMedication'][value = " + result.PresentingProblemAndImpact[0].LifeMedication + "]").prop('checked', true);
        $("input[name='RadioLifeMotor'][value = " + result.PresentingProblemAndImpact[0].LifeMotor + "]").prop('checked', true);
        $("input[name='RadioLifeParentalRole'][value = " + result.PresentingProblemAndImpact[0].LifeParentalRole + "]").prop('checked', true);
        $("input[name='RadioLifePersistence'][value = " + result.PresentingProblemAndImpact[0].LifePersistence + "]").prop('checked', true);
        $("input[name='RadioLifeRecreation'][value = " + result.PresentingProblemAndImpact[0].LifeRecreation + "]").prop('checked', true);
        $("input[name='RadioLifeResidentialStability'][value = " + result.PresentingProblemAndImpact[0].LifeResidentialStability + "]").prop('checked', true);
        $("input[name='RadioLifeRoutines'][value = " + result.PresentingProblemAndImpact[0].LifeRoutines + "]").prop('checked', true);
        $("input[name='RadioLifeSchoolPreschoolDaycare'][value = " + result.PresentingProblemAndImpact[0].LifeSchoolPreschoolDaycare + "]").prop('checked', true);
        $("input[name='RadioLifeSensory'][value = " + result.PresentingProblemAndImpact[0].LifeSensory + "]").prop('checked', true);
        $("input[name='RadioLifeSexualDevelopment'][value = " + result.PresentingProblemAndImpact[0].LifeSexualDevelopment + "]").prop('checked', true);
        $("input[name='RadioLifeSleep'][value = " + result.PresentingProblemAndImpact[0].LifeSleep + "]").prop('checked', true);
        $("input[name='RadioLifeSocialFunctioning'][value = " + result.PresentingProblemAndImpact[0].LifeSocialFunctioning + "]").prop('checked', true);
        $("input[name='RadioLifeTransportation'][value = " + result.PresentingProblemAndImpact[0].LifeTransportation + "]").prop('checked', true);
        $("input[name='RadioDDAutism'][value = " + result.PresentingProblemAndImpact[0].DDAutism + "]").prop('checked', true);
        $("input[name='RadioDDCognivtive'][value = " + result.PresentingProblemAndImpact[0].DDCognivtive + "]").prop('checked', true);
        $("input[name='RadioDDDevelopmental'][value = " + result.PresentingProblemAndImpact[0].DDDevelopmental + "]").prop('checked', true);
        $("input[name='RadioDDMotor'][value = " + result.PresentingProblemAndImpact[0].DDMotor + "]").prop('checked', true);
        $("input[name='RadioDDRegulatory'][value = " + result.PresentingProblemAndImpact[0].DDRegulatory + "]").prop('checked', true);
        $("input[name='RadioDDSelfcare'][value = " + result.PresentingProblemAndImpact[0].DDSelfcare + "]").prop('checked', true);
        $("input[name='RadioDDSensory'][value = " + result.PresentingProblemAndImpact[0].DDSensory + "]").prop('checked', true);
        $("input[name='RadioSPDAchievement'][value = " + result.PresentingProblemAndImpact[0].SPDAchievement + "]").prop('checked', true);
        $("input[name='RadioSPDAttendance'][value = " + result.PresentingProblemAndImpact[0].SPDAttendance + "]").prop('checked', true);
        $("input[name='RadioSPDBehavior'][value = " + result.PresentingProblemAndImpact[0].SPDBehavior + "]").prop('checked', true);
        $("input[name='RadioSPDPreschoolDaycare'][value = " + result.PresentingProblemAndImpact[0].SPDPreschoolDaycare + "]").prop('checked', true);
        $("input[name='RadioSPDTeacherRelationship'][value = " + result.PresentingProblemAndImpact[0].SPDTeacherRelationship + "]").prop('checked', true);
        $("input[name='RadioEmploymentCareerAspirations'][value = " + result.PresentingProblemAndImpact[0].EmploymentCareerAspirations + "]").prop('checked', true);
        $("input[name='RadioEmploymentJobAttendance'][value = " + result.PresentingProblemAndImpact[0].EmploymentJobAttendance + "]").prop('checked', true);
        $("input[name='RadioEmploymentJobPerformance'][value = " + result.PresentingProblemAndImpact[0].EmploymentJobPerformance + "]").prop('checked', true);
        $("input[name='RadioEmploymentJobRelations'][value = " + result.PresentingProblemAndImpact[0].EmploymentJobRelations + "]").prop('checked', true);
        $("input[name='RadioEmploymentJobSkills'][value = " + result.PresentingProblemAndImpact[0].EmploymentJobSkills + "]").prop('checked', true);
        $("input[name='RadioEmploymentJobTime'][value = " + result.PresentingProblemAndImpact[0].EmploymentJobTime + "]").prop('checked', true);
        $("input[name='RadioParentingInvolvement'][value = " + result.PresentingProblemAndImpact[0].ParentingInvolvement + "]").prop('checked', true);
        $("input[name='RadioParentingKnowledgeOfNeeds'][value = " + result.PresentingProblemAndImpact[0].ParentingKnowledgeOfNeeds + "]").prop('checked', true);
        $("input[name='RadioParentingMaritalViolence'][value = " + result.PresentingProblemAndImpact[0].ParentingMaritalViolence + "]").prop('checked', true);
        $("input[name='RadioParentingOrganization'][value = " + result.PresentingProblemAndImpact[0].ParentingOrganization + "]").prop('checked', true);
        $("input[name='RadioParentingSupervision'][value = " + result.PresentingProblemAndImpact[0].ParentingSupervision + "]").prop('checked', true);
        $("input[name='RadioIndependentCommDeviceUse'][value = " + result.PresentingProblemAndImpact[0].IndependentCommDeviceUse + "]").prop('checked', true);
        $("input[name='RadioIndependentHouseWork'][value = " + result.PresentingProblemAndImpact[0].IndependentHouseWork + "]").prop('checked', true);
        $("input[name='RadioIndependentHousingSafety'][value = " + result.PresentingProblemAndImpact[0].IndependentHousingSafety + "]").prop('checked', true);
        $("input[name='RadioIndependentMealPrep'][value = " + result.PresentingProblemAndImpact[0].IndependentMealPrep + "]").prop('checked', true);
        $("input[name='RadioIndependentMoneyManagement'][value = " + result.PresentingProblemAndImpact[0].IndependentMoneyManagement + "]").prop('checked', true);
        $("input[name='RadioIndependentShopping'][value = " + result.PresentingProblemAndImpact[0].IndependentShopping + "]").prop('checked', true);
        //$("input[name='RadioSPDSchoolneeds'][value = " + result.PresentingProblemAndImpact[0].SPDSchoolneeds + "]").prop('checked', true);
        $('#TextBoxPresentingpProbSuppInfo').val(result.PresentingProblemAndImpact[0].PresentingpProbSuppInfo);
    }
    else {
        HandleStartSection("PresentinProblemAndImpact");
    }
}

function BindSafetySection(result) {
    if (result.Safety[0] != undefined) {
        if (result.Safety[0].Status == "Completed") {
            HandleCompleteSection("Safety");
        } else {
            HandleInprogressSection("Safety");
        }
        $('#TextBoxSafetyID').val(result.Safety[0].SafetyID);
        $("input[name='RadioRbvictexpl'][value = " + result.Safety[0].Rbvictexpl + "]").prop('checked', true);
        $("input[name='RadioRbdelcrimbehav'][value = " + result.Safety[0].Rbdelcrimbehav + "]").prop('checked', true);
        $("input[name='RadioRbselfharm'][value = " + result.Safety[0].Rbselfharm + "]").prop('checked', true);
        $("input[name='RadioRbselfmutil'][value = " + result.Safety[0].Rbselfmutil + "]").prop('checked', true);
        $("input[name='RadioRbflightrisk'][value = " + result.Safety[0].Rbflightrisk + "]").prop('checked', true);
        $("input[name='RadioRbothselfharm'][value = " + result.Safety[0].Rbothselfharm + "]").prop('checked', true);
        $("input[name='RadioRbsuiciderisk'][value = " + result.Safety[0].Rbsuiciderisk + "]").prop('checked', true);
        $("input[name='RadioRbdngrtothers'][value = " + result.Safety[0].Rbdngrtothers + "]").prop('checked', true);
        $("input[name='RadioRbintenmisb'][value = " + result.Safety[0].Rbintenmisb + "]").prop('checked', true);
        $("input[name='RadioRbfiresetting'][value = " + result.Safety[0].Rbfiresetting + "]").prop('checked', true);
        $("input[name='RadioRbrunaway'][value = " + result.Safety[0].Rbrunaway + "]").prop('checked', true);
        $("input[name='RadioRbgrdisability'][value = " + result.Safety[0].Rbgrdisability + "]").prop('checked', true);
        $("input[name='RadioRbsexprobehav'][value = " + result.Safety[0].Rbsexprobehav + "]").prop('checked', true);
        $("input[name='RadioRbhoarding'][value = " + result.Safety[0].Rbhoarding + "]").prop('checked', true);
        $("input[name='RadioRbbullying'][value = " + result.Safety[0].Rbbullying + "]").prop('checked', true);
        $("input[name='RadioRunfrequency'][value = " + result.Safety[0].Runfrequency + "]").prop('checked', true);
        $("input[name='RadioRunreturnonown'][value = " + result.Safety[0].Runreturnonown + "]").prop('checked', true);
        $("input[name='RadioRunconsistdest'][value = " + result.Safety[0].Runconsistdest + "]").prop('checked', true);
        $("input[name='RadioRuninvolvothers'][value = " + result.Safety[0].Runinvolvothers + "]").prop('checked', true);
        $("input[name='Radiorunsafetydest'][value = " + result.Safety[0].runsafetydest + "]").prop('checked', true);
        $("input[name='RadioRunrealexpect'][value = " + result.Safety[0].Runrealexpect + "]").prop('checked', true);
        $("input[name='RadioRunillegacts'][value = " + result.Safety[0].Runillegacts + "]").prop('checked', true);
        $("input[name='RadioRunplanning'][value = " + result.Safety[0].Runplanning + "]").prop('checked', true);
        $("input[name='RadioSpbhypersex'][value = " + result.Safety[0].Spbhypersex + "]").prop('checked', true);
        $("input[name='RadioSpbsexaggr'][value = " + result.Safety[0].Spbsexaggr + "]").prop('checked', true);
        $("input[name='RadioSpbhirisksexbeh'][value = " + result.Safety[0].Spbhirisksexbeh + "]").prop('checked', true);
        $("input[name='RadioSpbsexreactbeh'][value = " + result.Safety[0].Spbsexreactbeh + "]").prop('checked', true);
       
        if (result.Safety[0].SPDEdTesting == true) {
            $("#CheckboxSPDEdTesting").prop('checked', true)
        }
        if (result.Safety[0].SPDCredRecovery == true) {
            $("#CheckboxSPDCredRecovery").prop('checked', true)
        }
        if (result.Safety[0].SPDStudentStudyTeam == true) {
            $("#CheckboxSPDStudentStudyTeam").prop('checked', true)
        }
        if (result.Safety[0].SPD504Plan == true) {
            $("#CheckboxSPD504Plan").prop('checked', true)
        }
        if (result.Safety[0].SPDIEP== true) {
            $("#CheckboxSPDIEP").prop('checked', true)
        }
        if (result.Safety[0].SPDTutoring == true) {
            $("#CheckboxSPDTutoring").prop('checked', true)
        }
      


        $("input[name='RadioSpbmastur'][value = " + result.Safety[0].Spbmastur + "]").prop('checked', true);
        $("input[name='RadioSabrelationship'][value = " + result.Safety[0].Sabrelationship + "]").prop('checked', true);
        $("input[name='RadioSabpowerdifferential'][value = " + result.Safety[0].Sabpowerdifferential + "]").prop('checked', true);
        $("input[name='RadioSabphysforce'][value = " + result.Safety[0].Sabphysforce + "]").prop('checked', true);
        $("input[name='RadioSabtypesexact'][value = " + result.Safety[0].Sabtypesexact + "]").prop('checked', true);
        $("input[name='RadioSabplanning'][value = " + result.Safety[0].Sabplanning + "]").prop('checked', true);
        $("input[name='RadioSabresptoaccusation'][value = " + result.Safety[0].Sabresptoaccusation + "]").prop('checked', true);
        $("input[name='RadioSabagediff'][value = " + result.Safety[0].Sabagediff + "]").prop('checked', true);
        $("input[name='RadioDangerousnesshostility'][value = " + result.Safety[0].Dangerousnesshostility + "]").prop('checked', true);
        $("input[name='RadioDangerousnessplanning'][value = " + result.Safety[0].Dangerousnessplanning + "]").prop('checked', true);
        $("input[name='RadioDangerousnessparanthinking'][value = " + result.Safety[0].Dangerousnessparanthinking + "]").prop('checked', true);
        $("input[name='RadioDangerousnessviolencehistory'][value = " + result.Safety[0].Dangerousnessviolencehistory + "]").prop('checked', true);
        $("input[name='RadioDangerousnessecondgainsange'][value = " + result.Safety[0].Dangerousnessecondgainsange + "]").prop('checked', true);
        $("input[name='RadioDangerousnessawareviolencepotential'][value = " + result.Safety[0].Dangerousnessawareviolencepotential + "]").prop('checked', true);
        $("input[name='RadioDangerousnessviolenthinking'][value = " + result.Safety[0].Dangerousnessviolenthinking + "]").prop('checked', true);
        $("input[name='RadioDangerousnessresptoconsequences'][value = " + result.Safety[0].Dangerousnessresptoconsequences + "]").prop('checked', true);
        $("input[name='RadioDangerousnessintent'][value = " + result.Safety[0].Dangerousnessintent + "]").prop('checked', true);
        $("input[name='RadioDangerousnesscommitselfctrl'][value = " + result.Safety[0].Dangerousnesscommitselfctrl + "]").prop('checked', true);
        $("input[name='RadioFiresetseriousness'][value = " + result.Safety[0].Firesetseriousness + "]").prop('checked', true);
        $("input[name='RadioFiresetcommunsafety'][value = " + result.Safety[0].Firesetcommunsafety + "]").prop('checked', true);
        $("input[name='RadioFiresethistory'][value = " + result.Safety[0].Firesethistory + "]").prop('checked', true);
        $("input[name='RadioFiresetresponsetoaccusation'][value = " + result.Safety[0].Firesetresponsetoaccusation + "]").prop('checked', true);
        $("input[name='RadioFiresetplanning'][value = " + result.Safety[0].Firesetplanning + "]").prop('checked', true);
        $("input[name='RadioFiresetremorse'][value = " + result.Safety[0].Firesetremorse + "]").prop('checked', true);
        $("input[name='RadioFiresetuseaccelerants'][value = " + result.Safety[0].Firesetuseaccelerants + "]").prop('checked', true);
        $("input[name='RadioFiresetlikelihoodfuturefireset'][value = " + result.Safety[0].Firesetlikelihoodfuturefireset + "]").prop('checked', true);
        $("input[name='RadioFiresetintentoharm'][value = " + result.Safety[0].Firesetintentoharm + "]").prop('checked', true);
        $('#TextBoxRiskbehaviorsupportinfo').val(result.Safety[0].Riskbehaviorsupportinfo);
        $("input[name='RadioJustcrimeseriousness'][value = " + result.Safety[0].Justcrimeseriousness + "]").prop('checked', true);
        $("input[name='RadioJustcrimecommunsafety'][value = " + result.Safety[0].Justcrimecommunsafety + "]").prop('checked', true);
        $("input[name='RadioJustcrimehistory'][value = " + result.Safety[0].Justcrimehistory + "]").prop('checked', true);
        $("input[name='RadioJustcrimelegalcompliance'][value = " + result.Safety[0].Justcrimelegalcompliance + "]").prop('checked', true);
        $("input[name='RadioJustcrimearrests'][value = " + result.Safety[0].Justcrimearrests + "]").prop('checked', true);
        $("input[name='RadioJustcrimepeerinfluences'][value = " + result.Safety[0].Justcrimepeerinfluences + "]").prop('checked', true);
        $("input[name='RadioJustcrimeplanning'][value = " + result.Safety[0].Justcrimeplanning + "]").prop('checked', true);
        $("input[name='RadioJustcrimenvironinfluences'][value = " + result.Safety[0].Justcrimenvironinfluences + "]").prop('checked', true);
        if (result.Safety[0].Justcrimeust != null) {
            $("input[name='RadioJustcrimeust'][value = " + (result.Safety[0].Justcrimeust == true ? 1 : 0) + "]").prop('checked', true);
        }
        $('#TextBoxJustcrimeustdate').val(result.Safety[0].Justcrimeustdate);
        if (result.Safety[0].Justcrimengri != null) {
            $("input[name='RadioJustcrimengri'][value = " + (result.Safety[0].Justcrimengri == true ? 1 : 0) + "]").prop('checked', true);
        }
        $('#TextBoxJustcrimengridate').val(result.Safety[0].Justcrimengridate);
        $("#TextBoxJusticesupportinginformation").val(result.Safety[0].Justicesupportinginformation);
        $("#TextBoxSafetyfactorscurrentenvironment").val(result.Safety[0].Safetyfactorscurrentenvironment);
    }
    else {
        HandleStartSection( "Safety");
    }
}

function BindSubstanceUseHistory(result) {
    if (result.SubstanceUseHistory[0] != undefined) {
        if (result.SubstanceUseHistory[0].Status == "Completed") {
            HandleCompleteSection("SubstanceUseHistory");
        } else {
            HandleInprogressSection("SubstanceUseHistory");
        }
        $('#TextBoxSubstanceUseHistoryID').val(result.SubstanceUseHistory[0].SubstanceUseHistoryID);
        $("input[name='RadioSubstanceusehistseverity'][value = " + result.SubstanceUseHistory[0].Substanceusehistseverity + "]").prop('checked', true);
        $("input[name='RadioSubstanceusehistpeerinfluences'][value = " + result.SubstanceUseHistory[0].Substanceusehistpeerinfluences + "]").prop('checked', true);
        $("input[name='RadioSubstanceusehistduration'][value = " + result.SubstanceUseHistory[0].Substanceusehistduration + "]").prop('checked', true);
        $("input[name='RadioSubstanceusehistparentinfluence'][value = " + result.SubstanceUseHistory[0].Substanceusehistparentinfluence + "]").prop('checked', true);
        $("input[name='RadioSubstanceusehiststageofrecovery'][value = " + result.SubstanceUseHistory[0].Substanceusehiststageofrecovery + "]").prop('checked', true);
        $("input[name='RadioSubstanceusehistrecovsupcommun'][value = " + result.SubstanceUseHistory[0].Substanceusehistrecovsupcommun + "]").prop('checked', true);
        $("input[name='RadioSubstanceusehistenvironinfluences'][value = " + result.SubstanceUseHistory[0].Substanceusehistenvironinfluences + "]").prop('checked', true);
        $('#TextBoxSubstanceusehistsuppinfo').val(result.SubstanceUseHistory[0].Substanceusehistsuppinfo)
        if (result.SubstanceUseHistory[0].Subabusehisttreatment != null) {
            $("input[name='RadioSubabusehisttreatment'][value = " + (result.SubstanceUseHistory[0].Subabusehisttreatment == true ? 1 : 0) + "]").prop('checked', true);
        } 
        if (result.SubstanceUseHistory[0].Subabusehisttreatment == true) {
            $('.AbuseTreatment').removeAttr('hidden');
            $('.AbuseTreatment').show();
        }
    }
    else {
        HandleStartSection("SubstanceUseHistory");
    }
}

function BindPlacementHistory(result) {
    if (result.PlacementHistory[0] != undefined) {
        if (result.PlacementHistory[0].Status == "Completed") {
            HandleCompleteSection( "PlacementHistory");
        } else {
            HandleInprogressSection( "PlacementHistory");
        }
        $('#TextBoxPlacementHistoryID').val(result.PlacementHistory[0].PlacementHistoryID);
        if (result.PlacementHistory[0].OutOfHomePlacementHistory == true) {
            $("input[name='RadioOutOfHomePlacementHistory']").prop('checked', true);
            $('.OutOfHomePlacementHistory').hide();
        }
        else {
            $('.OutOfHomePlacementHistory').show();
            $('#TextBoxPlacementHistory').val(result.PlacementHistory[0].PlacementHistory);
        }

    }
    else {
        HandleStartSection("PlacementHistory");
    }
}

function BindPsychiatricInformation(result) {
    if (result.PsychiatricInformation[0] != undefined) {
        if (result.PsychiatricInformation[0].Status == "Completed") {
            HandleCompleteSection("PsychiatricInformation");
        } else {
            HandleInprogressSection( "PsychiatricInformation");
        }
        $('#TextBoxPsychiatricInformationID').val(result.PsychiatricInformation[0].PsychiatricInformationID);
        $('#TextBoxPsychiatricproblems').val(result.PsychiatricInformation[0].Psychiatricproblems);
        if (result.PsychiatricInformation[0].Gmhhpriorpsychologicalassessment != null) {
            $("input[name='RadioGmhhpriorpsychologicalassessment'][value = " + (result.PsychiatricInformation[0].Gmhhpriorpsychologicalassessment == true ? 1 : 0) + "]").prop('checked', true);
            if (result.PsychiatricInformation[0].Gmhhpriorpsychologicalassessment == true) {
                $('.Gmhhpriorpsychologicalassessment').removeAttr('hidden');
                $('.Gmhhpriorpsychologicalassessment').show();
                $('#TextBoxGmhhpriorpsyschologicalassessmentdate').val(result.PsychiatricInformation[0].Gmhhpriorpsyschologicalassessmentdate);
                $('#TextBoxGmhhpriorpsychologicalassessmentiq').val(result.PsychiatricInformation[0].Gmhhpriorpsychologicalassessmentiq);
            }
           
        }
        
        if (result.PsychiatricInformation[0].Gmhhpriorpsychiatricevaluation != null) {
            $("input[name='RadioGmhhpriorpsychiatricevaluation'][value = " + (result.PsychiatricInformation[0].Gmhhpriorpsychiatricevaluation == true ? 1 : 0) + "]").prop('checked', true);
            if (result.PsychiatricInformation[0].Gmhhpriorpsychiatricevaluation == true) {
                $('.Gmhhpriorpsychiatricevaluation').removeAttr('hidden');
                $('.Gmhhpriorpsychiatricevaluation').show();
                $('#TextBoxGmhhpriorpsychiatricevaluationdate').val(result.PsychiatricInformation[0].Gmhhpriorpsychiatricevaluationdate);
            }
           
        }
        if (result.PsychiatricInformation[0].Gmhhassessmentpsychologicaltesting==true) {
            $("input[name='RadioGmhhassessmentpsychologicaltesting']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Gmhhpsychiatricevaluation == true) {
            $("input[name='RadioGmhhpsychiatricevaluation']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Gmhhprioroutpatientmentalhealthservices != null) {
            $("input[name='RadioGmhhprioroutpatientmentalhealthservices'][value = " + (result.PsychiatricInformation[0].Gmhhprioroutpatientmentalhealthservices == true ? 1 : 0) + "]").prop('checked', true);
            if (result.PsychiatricInformation[0].Gmhhprioroutpatientmentalhealthservices == true) {
                $('.patientmentalhealthservices').removeAttr('hidden');
                $('.patientmentalhealthservices').show();
            }
           
        }
        $('#TextBoxMentalstatappearancebehavior').val(result.PsychiatricInformation[0].Mentalstatappearancebehavior);
        if (result.PsychiatricInformation[0].Mentalstathreatening != null) {
            $("input[name='RadioMentalstathreatening'][value = " +result.PsychiatricInformation[0].Mentalstathreatening+"]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatsuicidal != null) {
            $("input[name='RadioMentalstatsuicidal'][value = " +result.PsychiatricInformation[0].Mentalstatsuicidal+ "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstathomicidal != null) {
            $("input[name='RadioMentalstathomicidal'][value = " + result.PsychiatricInformation[0].Mentalstathomicidal + "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatimpulsecontrol != null) {
            $("input[name='RadioMentalstatimpulsecontrol'][value = " + result.PsychiatricInformation[0].Mentalstatimpulsecontrol + "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstathallucinatory != null) {
            $("input[name='RadioMentalstathallucinatory'][value = " +result.PsychiatricInformation[0].Mentalstathallucinatory + "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatdelusional != null) {
            $("input[name='RadioMentalstatdelusional'][value = " + result.PsychiatricInformation[0].Mentalstatdelusional  + "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatjudgement != null) {
            $("input[name='RadioMentalstatjudgement'][value = " + result.PsychiatricInformation[0].Mentalstatjudgement  + "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatmemory != null) {
            $("input[name='RadioMentalstatmemory'][value = " + result.PsychiatricInformation[0].Mentalstatmemory + "]").prop('checked', true);
        }

        if (result.PsychiatricInformation[0].Mentalstatmoodwnl == true) {
            $("input[name='RadioMentalstatmoodwnl']").prop('checked', true);
        }

        if (result.PsychiatricInformation[0].Mentalstatmooddepressed == true) {
            $("input[name='RadioMentalstatmooddepressed']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatmoodmanic == true) {
            $("input[name='RadioMentalstatmoodmanic']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatmoodanxious == true) {
            $("input[name='RadioMentalstatmoodanxious']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatmoodangry == true) {
            $("input[name='RadioMentalstatmoodangry']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatexpansive == true) {
            $("input[name='RadioMentalstatexpansive']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatlabile == true) {
            $("input[name='RadioMentalstatlabile']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstataffectwnl == true) {
            $("input[name='RadioMentalstataffectwnl']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatsad == true) {
            $("input[name='RadioMentalstatsad']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstataffectangry == true) {
            $("input[name='RadioMentalstataffectangry']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatflat == true) {
            $("input[name='RadioMentalstatflat']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatconstricted == true) {
            $("input[name='RadioMentalstatconstricted']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatinappropriate == true) {
            $("input[name='RadioMentalstatinappropriate']").prop('checked', true);
        }

        if (result.PsychiatricInformation[0].Mentalstatdepressed == true) {
            $("input[name='CheckboxMentalstatdepressed']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatmanic == true) {
            $("input[name='CheckboxMentalstatmanic']").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatanxious == true) {
            $("input[name='CheckboxMentalstatanxious']").prop('checked', true);
        }


        $("input[name='RadioMentalstatinsight'][value = " + result.PsychiatricInformation[0].Mentalstatinsight + "]").prop('checked', true);
        if (result.PsychiatricInformation[0].Mentalstatorientation != null) {
            $("input[name='RadioMentalstatorientation'][value = " + result.PsychiatricInformation[0].Mentalstatorientation + "]").prop('checked', true);
        }
        if (result.PsychiatricInformation[0].Mentalstatcognition != null) {
            $("input[name='RadioMentalstatcognition'][value = " + result.PsychiatricInformation[0].Mentalstatcognition  + "]").prop('checked', true);
        }
    }
    else {
        HandleStartSection( "PsychiatricInformation");
    }
}

function BindClientStrength(result) {
    if (result.ClientStrengths[0] != undefined) {
        if (result.ClientStrengths[0].Status == "Completed") {
            HandleCompleteSection( "ClientStrength");
        } else {
            HandleInprogressSection( "ClientStrength");
        }
        $('#TextBoxClientStrengthID').val(result.ClientStrengths[0].ClientStrengthID);
        $("input[name='RadioClientStrengthsFamilySupport'][value = " + result.ClientStrengths[0].ClientStrengthsFamilySupport + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsTalentsInterests'][value = " + result.ClientStrengths[0].ClientStrengthsTalentsInterests + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsInterSocialConnect'][value = " + result.ClientStrengths[0].ClientStrengthsInterSocialConnect + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsCultIdentity'][value = " + result.ClientStrengths[0].ClientStrengthsCultIdentity + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsNaturalSupp'][value = " + result.ClientStrengths[0].ClientStrengthsNaturalSupp + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsCommunConnection'][value = " + result.ClientStrengths[0].ClientStrengthsCommunConnection + "]").prop('checked', true);
        $("input[name='RadioClientStrengthSpiritualReligious'][value = " + result.ClientStrengths[0].ClientStrengthSpiritualReligious + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsInvolveCare'][value = " + result.ClientStrengths[0].ClientStrengthsInvolveCare + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsEducatSetting'][value = " + result.ClientStrengths[0].ClientStrengthsEducatSetting + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsVocational'][value = " + result.ClientStrengths[0].ClientStrengthsVocational + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsRelatPermanence'][value = " + result.ClientStrengths[0].ClientStrengthsRelatPermanence + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsJobHistVolunteer'][value = " + result.ClientStrengths[0].ClientStrengthsJobHistVolunteer + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsResiliency'][value = " + result.ClientStrengths[0].ClientStrengthsResiliency + "]").prop('checked', true);
        $("input[name='RadioClientStrengthSelfCare'][value = " + result.ClientStrengths[0].ClientStrengthSelfCare + "]").prop('checked', true);
        $("input[name='RadioClientStrengthsOptimism'][value = " + result.ClientStrengths[0].ClientStrengthsOptimism + "]").prop('checked', true);
        $('#TextBoxClientStrengthSupportingInformation').val(result.ClientStrengths[0].ClientStrengthSupportingInformation);
    }
    else {
        HandleStartSection("ClientStrength");
    }
}

function BindFamilyInformation(result) {
    if (result.FamilyInformation[0] != undefined) {
        if (result.FamilyInformation[0].Status == "Completed") {
            HandleCompleteSection("FamilyInformation");
        } else {
            HandleInprogressSection("FamilyInformation");
        }
        $('#TextBoxFamilyInformationID').val(result.FamilyInformation[0].FamilyInformationID);
        $('#TextBoxRelevantFamilyHistory').val(result.FamilyInformation[0].RelevantFamilyHistory);
        $("input[name='RadioCulturalFactorsLanguage'][value = " + result.FamilyInformation[0].CulturalFactorsLanguage + "]").prop('checked', true);
        $("input[name='RadioCulturalFactorsStress'][value = " + result.FamilyInformation[0].CulturalFactorsStress + "]").prop('checked', true);
        $("input[name='RadioCulturalFactorsTraditionsRituals'][value = " + result.FamilyInformation[0].CulturalFactorsTraditionsRituals + "]").prop('checked', true);
        $('#TextBoxCulturalFactorSupportingInformation').val(result.FamilyInformation[0].CulturalFactorSupportingInformation);
    }
    else {
        HandleStartSection("FamilyInformation");
    }
}

function BindNeedsResourceAssessment(result) {
    if (result.NeedsResourceAssessment[0] != undefined) {
        if (result.NeedsResourceAssessment[0].Status == "Completed") {
            HandleCompleteSection("NeedsResourceAssessment");
        } else {
            HandleInprogressSection("NeedsResourceAssessment");
        }
        $('#TextBoxNeedsResourceAssessmentID').val(result.NeedsResourceAssessment[0].NeedsResourceAssessmentID);
        if (result.NeedsResourceAssessment[0].NeedsAssessmentNone == true) {
            $("input[name='RadioNeedsAssessmentNone']").prop('checked', true);
            $('.NeedsAssessmentNone').addClass('hidden');
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentAccessToFood == true) {
            $("input[name='RadioNeedsAssessmentAccessToFood']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentEducationalTesting == true) {
            $("input[name='RadioNeedsAssessmentEducationalTesting']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentMentoring == true) {
            $("input[name='RadioNeedsAssessmentMentoring']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentFinancialAssistance == true) {
            $("input[name='RadioNeedsAssessmentFinancialAssistance']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentImmigrationAssistance == true) {
            $("input[name='RadioNeedsAssessmentImmigrationAssistance']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentClothing == true) {
            $("input[name='RadioNeedsAssessmentClothing']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentEmployment == true) {
            $("input[name='RadioNeedsAssessmentEmployment']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentLegalAssistance == true) {
            $("input[name='RadioNeedsAssessmentLegalAssistance']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentPhysicalHealth == true) {
            $("input[name='RadioNeedsAssessmentPhysicalHealth']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentMentalHealthService == true) {
            $("input[name='RadioNeedsAssessmentMentalHealthService']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentShelter == true) {
            $("input[name='RadioNeedsAssessmentShelter']").prop('checked', true);
        }
        if (result.NeedsResourceAssessment[0].NeedsAssessmentOther == true) {
            $("input[name='RadioNeedsAssessmentOther']").prop('checked', true);
            $(".NeedsAssessmentOther").removeAttr('hidden');
            $(".NeedsAssessmentOther").show();
        }
        $('#TextBoxNeedsAssessmentOtherDescription').val(result.NeedsResourceAssessment[0].NeedsAssessmentOtherDescription);

    }
    else {
        HandleStartSection("NeedsResourceAssessment");
    }
}

function BindMentalHealthSummary(result) {
    if (result.MentalHealthSummary[0] != undefined) {
        if (result.MentalHealthSummary[0].Status == "Completed") {
            HandleCompleteSection( "MentalHealthSummary");
        } else {
            HandleInprogressSection( "MentalHealthSummary");
        }
        $('#TextBoxMentalHealthSummaryID').val(result.MentalHealthSummary[0].MentalHealthSummaryID);
        $('#TextBoxMentalHealthSummary').val(result.MentalHealthSummary[0].MentalHealthSummary);
    } else {
        HandleStartSection( "MentalHealthSummary");
    }
}

function BindAddClientFunctioningEvaluation(result) {
    if (result.AddClientFunctioningEvaluations[0] != undefined) {
        if (result.AddClientFunctioningEvaluations[0].Status == "Completed") {
            HandleCompleteSection( "AddClientFunctioningEvaluation");
        } else {
            HandleInprogressSection( "AddClientFunctioningEvaluation");
        }
        $('#TextBoxAddClientFunctioningEvaluationID').val(result.AddClientFunctioningEvaluations[0].AddClientFunctioningEvaluationID);
        if (result.AddClientFunctioningEvaluations[0].NoAdditionalEvaluations == true) {
            $("input[name='RadioNoAdditionalEvaluations']").prop('checked', true);
            $('.evaluations').addClass('hidden');
        }
        $('#TextBoxAdditionalEvaluations').val(result.AddClientFunctioningEvaluations[0].AdditionalEvaluations);

    }
    else {
        HandleStartSection( "AddClientFunctioningEvaluation");
    }
}
function BindIndividualTreatmentPlan(result) {
    if (result.IndividualTreatmentPlan[0] != undefined) {
        if (result.IndividualTreatmentPlan[0].Status == "Completed") {
            HandleCompleteSection("IndividualTreatmentPlan");
        } else {
            HandleInprogressSection("IndividualTreatmentPlan");
        }
        $('#TextBoxIndividualTreatmentPlanID').val(result.IndividualTreatmentPlan[0].IndividualTreatmentPlanID);
        $('#TextBoxTreatmentVisionStatement').val(result.IndividualTreatmentPlan[0].TreatmentVisionStatement);

        $('#TextBoxClientServicePreferences').val(result.IndividualTreatmentPlan[0].ClientServicePreferences);
        $('#TextBoxTreatmentPlanDate').val(result.IndividualTreatmentPlan[0].TreatmentPlanDate);
    }
    else {
        HandleStartSection("IndividualTreatmentPlan");
    }
}
function BindCansSignature(result) {
    if (result.CansSignature[0] != undefined) {
        if (result.CansSignature[0].Status == "Completed") {
            HandleCompleteSection("PresentingSignatures");
        } else {
            HandleInprogressSection("PresentingSignatures");
        }
        $('#TextBoxCansSignatureID').val(result.CansSignature[0].CansSignatureID);
        $('#TextBoxClientName').val(result.CansSignature[0].ClientName);

        $('#TextBoxClientSignatureDate').val(result.CansSignature[0].ClientSignatureDate);
        if (!isEmpty(result.CansSignature[0].ClientSignature)) {
            $('#imgClientSignature').attr("src", "data:" + "image/png;base64" + "," + result.CansSignature[0].ClientSignature).removeClass("hidden");
            $("#TextBoxParentLegalGuardianSignature").val(result.CansSignature[0].ClientSignature);
        }

        $('#TextBoxParentLegalGuardianName').val(result.CansSignature[0].ParentLegalGuardianName);

        $('#TextBoxParentLegalGuardianSignatureDate').val(result.CansSignature[0].ParentLegalGuardianSignatureDate);
        if (!isEmpty(result.CansSignature[0].ParentLegalGuardianSignature)) {
            $('#imgParentLegalGuardSignature').attr("src", "data:" + "image/png;base64" + "," + result.CansSignature[0].ParentLegalGuardianSignature).removeClass("hidden");
            $("#TextBoxParentLegalGuardianSignature").val(result.CansSignature[0].ParentLegalGuardianSignature);

        }

        $('#TextBoxMHPSigature').val(result.CansSignature[0].MHPSigature);

        $('#TextBoxMHPStaffName').val(result.CansSignature[0].MHPStaffName);

        $('#TextBoxMHPStaffTitle').val(result.CansSignature[0].MHPStaffTitle);

        $('#TextBoxMHPSignedDateTime').val(result.CansSignature[0].MHPSignedDateTime);


        $('#TextBoxQMHPSignature').val(result.CansSignature[0].QMHPSignature);

        $('#TextBoxQMHPStaffName').val(result.CansSignature[0].QMHPStaffName);

        $('#TextBoxQMHPStaffTitle').val(result.CansSignature[0].QMHPStaffTitle);

        $('#TextBoxQMHPSignedDateTime').val(result.CansSignature[0].QMHPSignedDateTime);


        $('#TextBoxLPHASignature').val(result.CansSignature[0].LPHASignature);

        $('#TextBoxLPHAStaffName').val(result.CansSignature[0].LPHAStaffName);

        $('#TextBoxLPHAStaffTitle').val(result.CansSignature[0].LPHAStaffTitle);

        $('#TextBoxLPHASignedDateTime').val(result.CansSignature[0].LPHASignedDateTime);
    }
    else {
        HandleStartSection("PresentingSignatures");
    }
}
function BindGeneralInformationHRA(result) {
    if (result.GeneralInformationHRA[0] != undefined) {
        if (result.GeneralInformationHRA[0].Status == "Completed") {
            HandleCompleteSection( "GeneralInformatioinHRA");
        } else {
            HandleInprogressSection( "GeneralInformatioinHRA");
        }
        $('.GeneralInformatioinHRA #TextBoxGeneralInformatioinHRAID').val(result.GeneralInformationHRA[0].GeneralInformatioinHRAID);
        $('.GeneralInformatioinHRA #TextBoxStaffName').val(result.GeneralInformationHRA[0].StaffName);
        $('.GeneralInformatioinHRA #TextBoxHRAClientFirstName').val(result.GeneralInformationHRA[0].ClientFirstName);
        $('.GeneralInformatioinHRA #TextBoxHRAClientLastName').val(result.GeneralInformationHRA[0].ClientLastName);
        $('.GeneralInformatioinHRA #TextBoxRecipientId').val(result.GeneralInformationHRA[0].RecipientId);
        $('.GeneralInformatioinHRA #TextBoxClientDateOfBirth').val(result.GeneralInformationHRA[0].ClientDateOfBirth);
        $('.GeneralInformatioinHRA #TextBoxClientGender').val(result.GeneralInformationHRA[0].ClientGender);
        $('.GeneralInformatioinHRA #TextBoxClientHeightFeet').val(result.GeneralInformationHRA[0].ClientHeightFeet);
        $('.GeneralInformatioinHRA #TextBoxClientHeightInches').val(result.GeneralInformationHRA[0].ClientHeightInches);
        $('.GeneralInformatioinHRA #TextBoxClientWeight').val(result.GeneralInformationHRA[0].ClientWeight);
        $('.GeneralInformatioinHRA #TextBoxPrimaryPhysicianName').val(result.GeneralInformationHRA[0].PrimaryPhysicianName);
        if (result.GeneralInformationHRA[0].PhysicalExamDue == true) {
            $("input[name='RadioPhysicalExamDue']").prop('checked', true);
        }
        $('.GeneralInformatioinHRA #TextBoxLastPhysicalExamDate').val(result.GeneralInformationHRA[0].LastPhysicalExamDate);
        $('.GeneralInformatioinHRA #TextBoxLastFluShotDate').val(result.GeneralInformationHRA[0].LastFluShotDate);
    }
    else {
        HandleStartSection("GeneralInformatioinHRA");
        if (!isEmpty($("select[id$=DropDownClientId]").attr("josn"))) {
            var jsonObject = $("select[id$=DropDownClientId]").attr("josn");
            var parse = jQuery.parseJSON(jsonObject);
            var res = $.grep(parse, function (IndividualName) {
                return IndividualName.ClientID == clientId;
            });
            var DBO = (res[0].BirthDate);
            if (DBO != null) {
                DBO = DBO.slice(0, 10).split('-');
                DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
            }
            $('.GeneralInformatioinHRA #TextBoxHRAClientFirstName').val(res[0].FirstName);
            $('.GeneralInformatioinHRA #TextBoxHRAClientLastName').val(res[0].LastName);
            $('.GeneralInformatioinHRA #TextBoxClientDateOfBirth').val(DBO);
            $('.GeneralInformatioinHRA #TextBoxClientGender').val(res[0].Gender);
        }
      
    }
}

function BindMedication(result) {
    if (result.Medications[0] != undefined) {
        if (result.Medications[0].Status == "Completed") {
            HandleCompleteSection( "Medication");
        } else {
            HandleInprogressSection("Medication");
        }
        $('#TextBoxMedicationID').val(result.Medications[0].MedicationID);
        $("input[name='RadioPsychotropicMedicationUse'][value = " + (result.Medications[0].PsychotropicMedicationUse == true ? 1 : 0) + "]").prop('checked', true);
        $('#TextBoxMedicationCompliance').val(result.Medications[0].MedicationCompliance);
        $("input[name='RadioPsychotropicLabWork'][value = " + (result.Medications[0].PsychotropicLabWork == true ? 1 : 0) + "]").prop('checked', true);
    }
    else {
        HandleStartSection( "Medication");
    }
}

function BindHealthStatus(result) {
    if (result.HealthStatus[0] != undefined) {
        if (result.HealthStatus[0].Status == "Completed") {
            HandleCompleteSection( "HealthStatus");
        } else {
            HandleInprogressSection("HealthStatus");
        }
        $('#TextBoxHealthStatusID').val(result.HealthStatus[0].HealthStatusID);
        $("input[name='RadioClientSelfReportedPhysicalHealth'][value = " + result.HealthStatus[0].ClientSelfReportedPhysicalHealth + "]").prop('checked', true);
        $("input[name='RadioDailySnackIntake'][value = " + result.HealthStatus[0].DailySnackIntake + "]").prop('checked', true);
        $("input[name='RadioDailyFruitVegetableIntake'][value = " + result.HealthStatus[0].DailyFruitVegetableIntake + "]").prop('checked', true);
        if (result.HealthStatus[0].RegularPhysicalActivity != null) {
            $("input[name='RadioRegularPhysicalActivity'][value = " + (result.HealthStatus[0].RegularPhysicalActivity) + "]").prop('checked', true);
            if (result.HealthStatus[0].RegularPhysicalActivityText == "Yes") {
                $('.PhysicalActivity').removeAttr('hidden');
                $('.PhysicalActivity').show();
                $('#TextBoxPhysicalActivityFrequency').val(result.HealthStatus[0].PhysicalActivityFrequency);
            }
        }
        
        if (result.HealthStatus[0].TobaccoUse != null) {
            $("input[name='RadioTobaccoUse'][value = " + (result.HealthStatus[0].TobaccoUse) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].AlcoholUse != null) {
            $("input[name='RadioAlcoholUse'][value = " + (result.HealthStatus[0].AlcoholUse) + "]").prop('checked', true);
            if (result.HealthStatus[0].AlcoholUseText == "Yes") {
                $('.AlcohalUse').removeAttr('hidden');
                $('.AlcohalUse').show();
                $('#TextBoxAlcoholConsumptionFrequency').val(result.HealthStatus[0].AlcoholConsumptionFrequency);
                $('#TextBoxAlcoholConsumptionNumber').val(result.HealthStatus[0].AlcoholConsumptionNumber);
            }
        }
       
       
        if (result.HealthStatus[0].FaintingHistory != null) {
            $("input[name='RadioFaintingHistory'][value = " + (result.HealthStatus[0].FaintingHistory) + "]").prop('checked', true);
            if (result.HealthStatus[0].FaintingHistoryText == "Yes") {
                $('.FaintingHistory').removeAttr('hidden');
                $('.FaintingHistory').show();
                $('#TextBoxFaintingDescription').val(result.HealthStatus[0].FaintingDescription);
            }
        }
        
        if (result.HealthStatus[0].KnownAllergy != null) {
            $("input[name='RadioKnownAllergy'][value = " + (result.HealthStatus[0].KnownAllergy) + "]").prop('checked', true);
            if (result.HealthStatus[0].KnownAllergyText == "Yes") {
                $('.KnownAllergy').removeAttr('hidden');
                $('.KnownAllergy').show();
                $('#TextBoxAllergyDescription').val(result.HealthStatus[0].AllergyDescription);
            }
        }
        
        if (result.HealthStatus[0].FallingHistory != null) {
            $("input[name='RadioFallingHistory'][value = " + (result.HealthStatus[0].FallingHistory) + "]").prop('checked', true);
            if (result.HealthStatus[0].FallingHistoryText == "Yes") {
                $('.FallingHistory').removeAttr('hidden');
                $('.FallingHistory').show();
                $('#TextBoxFallingDescription').val(result.HealthStatus[0].FallingDescription);

            }
        }
       
        if (result.HealthStatus[0].RequestQuitSmoking != null) {
            $("input[name='RadioRequestQuitSmoking'][value = " + (result.HealthStatus[0].RequestQuitSmoking) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].HealthConcerns != null) {
            $("input[name='RadioHealthConcerns'][value = " + (result.HealthStatus[0].HealthConcerns) + "]").prop('checked', true);
            if (result.HealthStatus[0].HealthConcernsText == "Yes") {
                $('.HealthConcerns').removeAttr('hidden');
                $('.HealthConcerns').show();
                $('#TextBoxHealthConcernsDescription').val(result.HealthStatus[0].HealthConcernsDescription);
            }
        }
        
        if (result.HealthStatus[0].GeneralIllness != null) {
            $("input[name='RadioGeneralIllness'][value = " + (result.HealthStatus[0].GeneralIllness) + "]").prop('checked', true);
            if (result.HealthStatus[0].GeneralIllnessText == "Yes") {
                $('.GeneralIllness').removeAttr('hidden');
                $('.GeneralIllness').show();
                $('#TextBoxGeneralIllnessDescription').val(result.HealthStatus[0].GeneralIllnessDescription);
            }
        }
       
        if (result.HealthStatus[0].BreathingIssues != null) {
            $("input[name='RadioBreathingIssues'][value = " + (result.HealthStatus[0].BreathingIssues) + "]").prop('checked', true);
            if (result.HealthStatus[0].BreathingIssuesText == "Yes") {
                $('.BreathingIssues').removeAttr('hidden');
                $('.BreathingIssues').show();
                if (result.HealthStatus[0].BreathingIssuesCause == 2)//others
                {
                    $('.BreathingIssuesCause').removeAttr('hidden');
                    $('.BreathingIssuesCause').show();
                    $("input[name='RadioBreathingIssuesCause'][value = " + result.HealthStatus[0].BreathingIssuesCause + "]").prop('checked', true);
                    $('#TextBoxBreathingIssuesCauseDescription').val(result.HealthStatus[0].BreathingIssuesCauseDescription);

                }
                if (result.HealthStatus[0].BreathingIssueMedicated != null) {
                    $("input[name='RadioBreathingIssueMedicated'][value = " + (result.HealthStatus[0].BreathingIssueMedicated) + "]").prop('checked', true);
                }
            }
        }
        
               
       
        if (result.HealthStatus[0].HeadInjury != null) {
            $("input[name='RadioHeadInjury'][value = " + (result.HealthStatus[0].HeadInjury) + "]").prop('checked', true);
            if (result.HealthStatus[0].HeadInjuryText == "Yes") {
                $('.HeadInjury').removeAttr('hidden');
                $('.HeadInjury').show();
                $('#TextBoxHeadInjuryDate').val(result.HealthStatus[0].HeadInjuryDate);
            }
        }
        
        if (result.HealthStatus[0].MemoryLapses != null) {
            $("input[name='RadioMemoryLapses'][value = " + (result.HealthStatus[0].MemoryLapses) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].CurrentDateAware != null) {
            $("input[name='RadioCurrentDateAware'][value = " + (result.HealthStatus[0].CurrentDateAware) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].AboveAverageUrination != null) {
            $("input[name='RadioAboveAverageUrination'][value = " + (result.HealthStatus[0].AboveAverageUrination) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].AboveAverageThirst != null) {
            $("input[name='RadioAboveAverageThirst'][value = " + (result.HealthStatus[0].AboveAverageThirst) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].SpecialBloodSugarDiet != null) {
            $("input[name='RadioSpecialBloodSugarDiet'][value = " + (result.HealthStatus[0].SpecialBloodSugarDiet) + "]").prop('checked', true);
            if (result.HealthStatus[0].SpecialBloodSugarDietText == "Yes") {
                $('.BloodSugarDiet').removeAttr('hidden');
                $('#TextBoxSpecialDietDescription').val(result.HealthStatus[0].SpecialDietDescription);

            }
        }
        
        if (result.HealthStatus[0].BloodSugarMedicated != null) {
            $("input[name='RadioBloodSugarMedicated'][value = " + (result.HealthStatus[0].BloodSugarMedicated) + "]").prop('checked', true);
        }
        if (result.HealthStatus[0].ChronicPain != null) {
            $("input[name='RadioChronicPain'][value = " + (result.HealthStatus[0].ChronicPain) + "]").prop('checked', true);
            if (result.HealthStatus[0].ChronicPainText == "Yes") {
                $('.ChronicPain').removeAttr('hidden');
                $('.ChronicPain').show();
                $('#TextBoxPainIntensityLocationDescription').val(result.HealthStatus[0].PainIntensityLocationDescription);

                if (result.HealthStatus[0].PainMedicationHistory != null) {
                    $("input[name='RadioPainMedicationHistory'][value = " + (result.HealthStatus[0].PainMedicationHistory) + "]").prop('checked', true);
                    if (result.HealthStatus[0].PainMedicationHistoryText == "Yes") {
                        $('.MedicationHistory').removeAttr('hidden');
                        $('.MedicationHistory').show();
                        if (result.HealthStatus[0].PainMedicationCategory != null) {
                            $("input[name='RadioPainMedicationCategory'][value = " + (result.HealthStatus[0].PainMedicationCategory) + "]").prop('checked', true);
                            if (result.HealthStatus[0].PainMedicationCategory=="2") {
                                $('.PainMedicationDescription').removeAttr('hidden');
                                $('.PainMedicationDescription').show();
                                $('#TextBoxPainMedicationDescription').val(result.HealthStatus[0].PainMedicationDescription);
                            }
                           

                        }
                    }
                }
            }
        }
       
        if (result.HealthStatus[0].SexuallyActive != null) {
            $("input[name='RadioSexuallyActive'][value = " + (result.HealthStatus[0].SexuallyActive) + "]").prop('checked', true);
            if (result.HealthStatus[0].SexuallyActiveText == "Yes") {
                $('.SexuallyActive').removeAttr('hidden');
                $('.SexuallyActive').show();
                if (result.HealthStatus[0].STDProtection != null) {
                    $("input[name='RadioSTDProtection'][value = " + (result.HealthStatus[0].STDProtection) + "]").prop('checked', true);
                }
                if (result.HealthStatus[0].STDDiagnosed != null) {
                    $("input[name='RadioSTDDiagnosed'][value = " + (result.HealthStatus[0].STDDiagnosed) + "]").prop('checked', true);
                    if (result.HealthStatus[0].STDDiagnosedText == "Yes") {
                        $('.STDDiagnosed').removeAttr('hidden');
                        $('.STDDiagnosed').show();
                        $('#TextBoxSTDDiagnosisDescription').val(result.HealthStatus[0].STDDiagnosisDescription);
                    }
                }
                $('#TextBoxLastSTDTestDate').val(result.HealthStatus[0].LastSTDTestDate);

            }
        }
       
       
      
       
        if (result.HealthStatus[0].WomenHealthProviderVisit != null) {
            $("input[name='RadioWomenHealthProviderVisit'][value = " + (result.HealthStatus[0].WomenHealthProviderVisit) + "]").prop('checked', true);
            if (result.HealthStatus[0].WomenHealthProviderVisit == 1) {
                $('.HealthProviderVisitDate').removeAttr('hidden');
                $('.HealthProviderVisitDate').show();
                $('#TextBoxWomenHealthProviderVisitDate').val(result.HealthStatus[0].WomenHealthProviderVisitDate);
            }
        }
       
        if (result.HealthStatus[0].MenstrualCycleorMenopauseIssue != null) {
            $("input[name='RadioMenstrualCycleorMenopauseIssue'][value = " + (result.HealthStatus[0].MenstrualCycleorMenopauseIssue) + "]").prop('checked', true);
            if (result.HealthStatus[0].MenstrualCycleorMenopauseIssueText == "Yes") {
                $('.MenstrualCycleorMenopause').removeAttr('hidden');
                $('.MenstrualCycleorMenopause').show();
                $('#TextBoxMenstrualCycleorMenopauseDescription').val(result.HealthStatus[0].MenstrualCycleorMenopauseDescription);
            }
        }
        if (result.HealthStatus[0].PregnancyHistory != null) {
            $("input[name='RadioPregnancyHistory'][value = " + result.HealthStatus[0].PregnancyHistory + "]").prop('checked', true);
            if (result.HealthStatus[0].PregnancyHistory == 1 || result.HealthStatus[0].PregnancyHistory == 2) {
                $('.PregnancyOutcomeDescription').removeAttr('hidden');
                $('.PregnancyOutcomeDescription').show();
                $('#TextBoxPregnancyOutcomeDescription').val(result.HealthStatus[0].PregnancyOutcomeDescription);

            }
        }
       

    }
    else {
        HandleStartSection("HealthStatus");
    }
}

function BindDevelopmentHistory(result) {
    if (result.DevelopmentHistory[0] != undefined) {
        if (result.DevelopmentHistory[0].Status == "Completed") {
            HandleCompleteSection( "DevelopmentHistory");
        } else {
            HandleInprogressSection( "DevelopmentHistory");
        }
        $('#TextBoxDevelopmentHistoryID').val(result.DevelopmentHistory[0].DevelopmentHistoryID);
        $("input[name='RadioClientMotherPrenatalCare'][value = " + result.DevelopmentHistory[0].ClientMotherPrenatalCare + "]").prop('checked', true);
       
        if (!isEmpty(result.DevelopmentHistory[0].ClientMotherPregnancyComplications)) {
            $("input[name='RadioClientMotherPregnancyComplications'][value = " + result.DevelopmentHistory[0].ClientMotherPregnancyComplications + "]").prop('checked', true);
            if (result.DevelopmentHistory[0].ClientMotherPregnancyComplications == 1) {
                $('.MotherPregnancyComplications').removeAttr('hidden');
                $('.MotherPregnancyComplications').show();
                $('#TextBoxClientMotherPregnancyComplicationsDescription').val(result.DevelopmentHistory[0].ClientMotherPregnancyComplicationsDescription);
            }
        }
        $("input[name='RadioClientBirthStatus'][value = " + result.DevelopmentHistory[0].ClientBirthStatus + "]").prop('checked', true);
        if (!isEmpty(result.DevelopmentHistory[0].ClientInUteroSubstanceExposure)) {
            $("input[name='RadioClientInUteroSubstanceExposure'][value = " + result.DevelopmentHistory[0].ClientInUteroSubstanceExposure + "]").prop('checked', true);
            if (result.DevelopmentHistory[0].ClientInUteroSubstanceExposure == 1) {
                $('.InUteroSubstanceExposure').removeAttr('hidden');
                $('.InUteroSubstanceExposure').show();
                $('#TextBoxClientInUteroSubstanceExposureDescription').val(result.DevelopmentHistory[0].ClientInUteroSubstanceExposureDescription);

            }
        }
        if (!isEmpty(result.DevelopmentHistory[0].ClientMotherLaborIssues)) {
            $("input[name='RadioClientMotherLaborIssues'][value = " + result.DevelopmentHistory[0].ClientMotherLaborIssues + "]").prop('checked', true);
            if (result.DevelopmentHistory[0].ClientMotherLaborIssues == 1) {
                $('.MotherLaborIssues').removeAttr('hidden');
                $('.MotherLaborIssues').show();
                $('#TextBoxClientMotherLaborIssuesDescription').val(result.DevelopmentHistory[0].ClientMotherLaborIssuesDescription);
            }
        }
       
        $('#TextBoxClientWeightHRA').val(result.DevelopmentHistory[0].ClientWeight);
        $('#TextBoxDevelopmentMilestoneCrawlAge').val(result.DevelopmentHistory[0].DevelopmentMilestoneCrawlAge);
        $('#TextBoxDevelopmentMilestoneWalkAge').val(result.DevelopmentHistory[0].DevelopmentMilestoneWalkAge);
        $('#TextBoxDevelopmentMilestoneTalkAge').val(result.DevelopmentHistory[0].DevelopmentMilestoneTalkAge);
        $('#TextBoxDevelopmentMilestoneToiletTrainedAge').val(result.DevelopmentHistory[0].DevelopmentMilestoneToiletTrainedAge);
        $("input[name='RadioFamilyHistoryBehavioralProblems'][value = " + result.DevelopmentHistory[0].FamilyHistoryBehavioralProblems + "]").prop('checked', true);
        $('#TextBoxSupportingClientHistoryDescription').val(result.DevelopmentHistory[0].SupportingClientHistoryDescription);
    }
    else {
        HandleStartSection("DevelopmentHistory");
    }
}

function BindMedicalHistory(result) {
    if (result.MedicalHistory[0] != undefined) {
        if (result.MedicalHistory[0].Status == "Completed") {
            HandleCompleteSection( "MedicalHistory");
        } else {
            HandleInprogressSection( "MedicalHistory");
        }
        $('#TextBoxMedicalHistoryID').val(result.MedicalHistory[0].MedicalHistoryID);
        $("input[name='RadioEmergencyRoomFrequency'][value = " + result.MedicalHistory[0].EmergencyRoomFrequency + "]").prop('checked', true);
        $('#TextBoxEmergencyRoomVisitDescription').val(result.MedicalHistory[0].EmergencyRoomVisitDescription);
        if (result.MedicalHistory[0].PsychiatricallyHospitalized != null) {
            $("input[name='RadioPsychiatricallyHospitalized'][value = " + (result.MedicalHistory[0].PsychiatricallyHospitalized) + "]").prop('checked', true);
            if (result.MedicalHistory[0].PsychiatricallyHospitalizedText == "Yes") {
                $('.PsychiatricallyHospitalized').removeAttr('hidden');
                $('.PsychiatricallyHospitalized').show();
            }
            else {
                $('.PsychiatricallyHospitalized').addClass('hidden');
                $("#PsychiatricallyHospitalized").DataTable().clear().draw();
            }
        }
        else {
            $('.PsychiatricallyHospitalized').addClass('hidden');
            $("#PsychiatricallyHospitalized").DataTable.clear().draw();
        }
        if (result.MedicalHistory[0].IsAdditionalPagesNeeded == true) {
            $("input[name='RadioIsAdditionalPagesNeeded']").prop('checked', true);
            $('.AdditionalPagesNeeded').addClass('hidden');
            $("#additionalHospitalizations").DataTable().clear().draw();
        }
        else {
            $('.AdditionalPagesNeeded').removeAttr('hidden');
            $('.AdditionalPagesNeeded').show();

        }
        $('#TextBoxSupportingHospitalHistoryDescription').val(result.MedicalHistory[0].SupportingHospitalHistoryDescription);
    }
    else {
        HandleStartSection( "MedicalHistory");
    }
}

function BindCaregiverAddendum(result) {
    if (result.CaregiverAddendum[0] != undefined) {
        if (result.CaregiverAddendum[0].Status == "Completed") {
            HandleCompleteSection( "CaregiverAddendum");
        } else {
            HandleInprogressSection( "CaregiverAddendum");
        }
        $('.CaregiverAddendum #TextBoxCaregiverAddendumID').val(result.CaregiverAddendum[0].CaregiverAddendumID);
        $('.CaregiverAddendum #TextBoxAddendumClientFirstName').val(result.CaregiverAddendum[0].ClientFirstName);
        $('.CaregiverAddendum #TextBoxAddendumClientLastName').val(result.CaregiverAddendum[0].ClientLastName);
        $('.CaregiverAddendum #TextBoxClientRIN').val(result.CaregiverAddendum[0].ClientRIN);
        $('.CaregiverAddendum #TextBoxStaffCompletingForm').val(result.CaregiverAddendum[0].StaffCompletingForm);
        $('.CaregiverAddendum #TextBoxDateCompleted').val(result.CaregiverAddendum[0].DateCompleted);
        $('.CaregiverAddendum #TextBoxCaregiverFullName').val(result.CaregiverAddendum[0].CaregiverFullName);
        $('.CaregiverAddendum #TextBoxCaregiverRelationshipToClient').val(result.CaregiverAddendum[0].CaregiverRelationshipToClient);
        $('.CaregiverAddendum #TextBoxCaregiverAddtlPrimary').val(result.CaregiverAddendum[0].CaregiverAddtlPrimary);
        $("input[name='RadioCaregiverSupervision'][value = " + result.CaregiverAddendum[0].CaregiverSupervision + "]").prop('checked', true);
        $("input[name='RadioCaregiverSafety'][value = " + result.CaregiverAddendum[0].CaregiverSafety + "]").prop('checked', true);
        $("input[name='RadioCaregiverInvolvementWithCare'][value = " + result.CaregiverAddendum[0].CaregiverInvolvementWithCare + "]").prop('checked', true);
        $("input[name='RadioCaregiverFamilyStress'][value = " + result.CaregiverAddendum[0].CaregiverFamilyStress + "]").prop('checked', true);
        $("input[name='RadioCaregiverKnowledge'][value = " + result.CaregiverAddendum[0].CaregiverKnowledge + "]").prop('checked', true);
        $("input[name='RadioCaregiverMaritalPartnerViolence'][value = " + result.CaregiverAddendum[0].CaregiverMaritalPartnerViolence + "]").prop('checked', true);
        $("input[name='RadioCaregiverSocialResources'][value = " + result.CaregiverAddendum[0].CaregiverSocialResources + "]").prop('checked', true);
        $("input[name='RadioCaregiverMilitaryTrans'][value = " + result.CaregiverAddendum[0].CaregiverMilitaryTrans + "]").prop('checked', true);
        $("input[name='RadioCaregiverFinancialResources'][value = " + result.CaregiverAddendum[0].CaregiverFinancialResources + "]").prop('checked', true);
        $("input[name='RadioCaregiverSelfcareLivingSkills'][value = " + result.CaregiverAddendum[0].CaregiverSelfcareLivingSkills + "]").prop('checked', true);
        $("input[name='RadioCaregiverResidentialStability'][value = " + result.CaregiverAddendum[0].CaregiverResidentialStability + "]").prop('checked', true);
        $("input[name='RadioCaregiverEmployEducFunc'][value = " + result.CaregiverAddendum[0].CaregiverEmployEducFunc + "]").prop('checked', true);
        $("input[name='RadioCaregiverMedicalPhysical'][value = " + result.CaregiverAddendum[0].CaregiverMedicalPhysical + "]").prop('checked', true);
        $("input[name='RadioCaregiverLegalInvolvement'][value = " + result.CaregiverAddendum[0].CaregiverLegalInvolvement + "]").prop('checked', true);
        $("input[name='RadioCaregiverMentalHealth'][value = " + result.CaregiverAddendum[0].CaregiverMentalHealth + "]").prop('checked', true);
        $("input[name='RadioCaregiverFamRelationToSystem'][value = " + result.CaregiverAddendum[0].CaregiverFamRelationToSystem + "]").prop('checked', true);
        $("input[name='RadioCaregiverSubstanceUse'][value = " + result.CaregiverAddendum[0].CaregiverSubstanceUse + "]").prop('checked', true);
        $("input[name='RadioCaregiverAccessToChildCare'][value = " + result.CaregiverAddendum[0].CaregiverAccessToChildCare + "]").prop('checked', true);
        $("input[name='RadioCaregiverDevelopmental'][value = " + result.CaregiverAddendum[0].CaregiverDevelopmental + "]").prop('checked', true);
        $("input[name='RadioCaregiverEmathyChildren'][value = " + result.CaregiverAddendum[0].CaregiverEmathyChildren + "]").prop('checked', true);
        $("input[name='RadioCaregiverOrganization'][value = " + result.CaregiverAddendum[0].CaregiverOrganization + "]").prop('checked', true);

        $('.CaregiverAddendum #TextBoxCaregiverSupportingInformation').val(result.CaregiverAddendum[0].CaregiverSupportingInformation);
    }
    else {
        HandleStartSection("CaregiverAddendum");
        if (!isEmpty($("select[id$=DropDownClientId]").attr("josn"))) {
            var jsonObject = $("select[id$=DropDownClientId]").attr("josn");
            var parse = jQuery.parseJSON(jsonObject);
            var res = $.grep(parse, function (IndividualName) {
                return IndividualName.ClientID == clientId;
            });
            $('.CaregiverAddendum #TextBoxAddendumClientFirstName').val(res[0].FirstName);
            $('.CaregiverAddendum #TextBoxAddendumClientLastName').val(res[0].LastName);
           
        }
    }
}
function BindGeneralInformationDCFS(result) {
    if (result.GeneralInformationDCFS[0] != undefined) {
        if (result.GeneralInformationDCFS[0].Status == "Completed") {
            HandleCompleteSection( "GeneralInformationDCFS");
        } else {
            HandleInprogressSection( "GeneralInformationDCFS");
        }
        $('#TextBoxGeneralInformationDCFSID').val(result.GeneralInformationDCFS[0].GeneralInformationDCFSID);
        $('#TextBoxDCFSYouthName').val(result.GeneralInformationDCFS[0].DCFSYouthName);
        $('#TextBoxDCFSRIN').val(result.GeneralInformationDCFS[0].DCFSRIN);
        $('#TextBoxDCFSStaffCompletingForm').val(result.GeneralInformationDCFS[0].DCFSStaffCompletingForm);
        $('#TextBoxDCFSCompletedDate').val(result.GeneralInformationDCFS[0].DCFSCompletedDate);
        if (result.GeneralInformationDCFS[0].DCFSInvlvYthInCare == true) {
            $("input[name='RadioDCFSInvlvYthInCare']").prop('checked', true)
        }
        if (result.GeneralInformationDCFS[0].DCFSInvlvIntFam == true) {
            $("input[name='RadioDCFSInvlvIntFam']").prop('checked', true)
        }
        if (result.GeneralInformationDCFS[0].DCFSInvlvIPS == true) {
            $("input[name='RadioDCFSInvlvIPS']").prop('checked', true)
        }
    }
    else {
        HandleStartSection("GeneralInformationDCFS");
        if (!isEmpty($("select[id$=DropDownClientId]").attr("josn"))) {
            var jsonObject = $("select[id$=DropDownClientId]").attr("josn");
            var parse = jQuery.parseJSON(jsonObject);
            var res = $.grep(parse, function (IndividualName) {
                return IndividualName.ClientID == clientId;
            });
            $('.GeneralInformationDCFS #TextBoxDCFSYouthName').val(res[0].LastName + ' ,' + res[0].FirstName)

        }
    }
}

function BindSexuallyAggrBehavior(result) {
    if (result.SexuallyAggrBehavior[0] != undefined) {
        if (result.SexuallyAggrBehavior[0].Status == "Completed") {
            HandleCompleteSection( "SexuallyAggrBehavior");
        } else {
            HandleInprogressSection("SexuallyAggrBehavior");
        }
        $('#TextBoxSexuallyAggrBehaviorID').val(result.SexuallyAggrBehavior[0].SexuallyAggrBehaviorID);
        $("input[name='RadioSXAGBhTemporalConsist'][value = " + result.SexuallyAggrBehavior[0].SXAGBhTemporalConsist + "]").prop('checked', true);
        $("input[name='RadioSXAGbhSeveritySxAbuse'][value = " + result.SexuallyAggrBehavior[0].SXAGbhSeveritySxAbuse + "]").prop('checked', true);
        $("input[name='RadioSXAGBhsHistsexAbuseBeh'][value = " + result.SexuallyAggrBehavior[0].SXAGBhsHistsexAbuseBeh + "]").prop('checked', true);
        $("input[name='RadioSXAGbhPriorTreatmnt'][value = " + result.SexuallyAggrBehavior[0].SXAGbhPriorTreatmnt + "]").prop('checked', true);
        $('#TextBoxSXAGbhSuppInfo').val(result.SexuallyAggrBehavior[0].SXAGbhSuppInfo);
    }
    else {
        HandleStartSection( "SexuallyAggrBehavior");
    }

}

function BindParentGuardSafety(result) {
    if (result.ParentGuardSafety[0] != undefined) {
        if (result.ParentGuardSafety[0].Status == "Completed") {
            HandleCompleteSection( "ParentGuardSafety");
        } else {
            HandleInprogressSection( "ParentGuardSafety");
        }
        $('#TextBoxParentGuardSafetyID').val(result.ParentGuardSafety[0].ParentGuardSafetyID);
        $("input[name='RadioPgsafediscipln'][value = " + result.ParentGuardSafety[0].Pgsafediscipln + "]").prop('checked', true);
        $("input[name='RadioPgsafefrsutrtoler'][value = " + result.ParentGuardSafety[0].Pgsafefrsutrtoler + "]").prop('checked', true);
        $("input[name='RadioPgsafehomecond'][value = " + result.ParentGuardSafety[0].Pgsafehomecond + "]").prop('checked', true);
        $("input[name='RadioPgsafemaltreatment'][value = " + result.ParentGuardSafety[0].Pgsafemaltreatment + "]").prop('checked', true);
        $('#TextBoxPgsafesuppinfo').val(result.ParentGuardSafety[0].Pgsafesuppinfo);
    }
    else {
        HandleStartSection( "ParentGuardSafety");
    }
}

function BindParentGuardWellbeing(result) {
    if (result.ParentGuardWellbeing[0] != undefined) {
        if (result.ParentGuardWellbeing[0].Status == "Completed") {
            HandleCompleteSection( "ParentGuardWellbeing");
        } else {
            HandleInprogressSection( "ParentGuardWellbeing");
        }
        $('#TextBoxParentGuardWellbeingID').val(result.ParentGuardWellbeing[0].ParentGuardWellbeingID)
        $("input[name='RadioPgwelltraumreact'][value = " + result.ParentGuardWellbeing[0].Pgwelltraumreact + "]").prop('checked', true);
        $("input[name='RadioPgwellindeplivskills'][value = " + result.ParentGuardWellbeing[0].Pgwellindeplivskills + "]").prop('checked', true);
        $("input[name='RadioPgwellcntctcasewrker'][value = " + result.ParentGuardWellbeing[0].Pgwellcntctcasewrker + "]").prop('checked', true);
        $("input[name='RadioPgwellimpactownbeh'][value = " + result.ParentGuardWellbeing[0].Pgwellimpactownbeh + "]").prop('checked', true);
        $("input[name='RadioPgwellresponsmaltrtmnt'][value = " + result.ParentGuardWellbeing[0].Pgwellresponsmaltrtmnt + "]").prop('checked', true);
        $("input[name='RadioPgwelleffctparntapprch'][value = " + result.ParentGuardWellbeing[0].Pgwelleffctparntapprch + "]").prop('checked', true);
        $("input[name='RadioPgwellrelatwthabuser'][value = " + result.ParentGuardWellbeing[0].Pgwellrelatwthabuser + "]").prop('checked', true);
        $('#TextBoxPgwellsuppinfo').val(result.ParentGuardWellbeing[0].Pgwellsuppinfo);
    }
    else {
        HandleStartSection( "ParentGuardWellbeing");
    }
}

function BindParentGuardPermananence(result) {
    if (result.ParentGuardPermananence[0] != undefined) {
        if (result.ParentGuardPermananence[0].Status == "Completed") {
            HandleCompleteSection( "ParentGuardPermananence");
        } else {
            HandleInprogressSection( "ParentGuardPermananence");
        }
        $('#TextBoxParentGuardPermananenceID').val(result.ParentGuardPermananence[0].ParentGuardPermananenceID);
        $("input[name='RadioPgpermfamconnect'][value = " + result.ParentGuardPermananence[0].Pgpermfamconnect + "]").prop('checked', true);
        $("input[name='RadioPgpermparticvisit'][value = " + result.ParentGuardPermananence[0].Pgpermparticvisit + "]").prop('checked', true);
        $("input[name='RadioPgpermpersonaltrtmnt'][value = " + result.ParentGuardPermananence[0].Pgpermpersonaltrtmnt + "]").prop('checked', true);
        $("input[name='RadioPgpermcommitreunifi'][value = " + result.ParentGuardPermananence[0].Pgpermcommitreunifi + "]").prop('checked', true);
        $('#TextBoxPgpermsuppinfo').val(result.ParentGuardPermananence[0].Pgpermsuppinfo);
    }
    else {
        HandleStartSection( "ParentGuardPermananence");
    }
}

function BindSubstituteCommitPermananence(result) {
    if (result.SubstituteCommitPermananence[0] != undefined) {
        if (result.SubstituteCommitPermananence[0].Status == "Completed") {
            HandleCompleteSection("SubstituteCommitPermananence");
        } else {
            HandleInprogressSection("SubstituteCommitPermananence");
        }
        $('#TextBoxSubstituteCommitPermananenceID').val(result.SubstituteCommitPermananence[0].SubstituteCommitPermananenceID);
        if (result.SubstituteCommitPermananence[0].Subcomitpermna == true) {
            $("input[name='RadioSubcomitpermna']").prop('checked', true);
            $('.Subcomitpermna').addClass('hidden');

        }
        else {
            $('.Subcomitpermna').removeAttr('hidden');
            $('.Subcomitpermna').show();

            $("input[name='RadioSubcomitpermcollabothprnt'][value = " + result.SubstituteCommitPermananence[0].Subcomitpermcollabothprnt + "]").prop('checked', true);
            $("input[name='RadioSubcomitperminclusythfstfam'][value = " + result.SubstituteCommitPermananence[0].Subcomitperminclusythfstfam + "]").prop('checked', true);
            $("input[name='RadioSubcomitpermsupptpermplan'][value = " + result.SubstituteCommitPermananence[0].Subcomitpermsupptpermplan + "]").prop('checked', true);
            $('#TextBoxSubcomitpermsuppinfo').val(result.SubstituteCommitPermananence[0].Subcomitpermsuppinfo);
        }
    }
    else {
        HandleStartSection("SubstituteCommitPermananence");
    }
}

function BindIntactFamilyService(result) {
    if (result.IntactFamilyService[0] != undefined) {
        if (result.IntactFamilyService[0].Status == "Completed") {
            HandleCompleteSection("IntactFamilyService");
        } else {
            HandleInprogressSection("IntactFamilyService");
        }
        $('#TextBoxIntactFamilyServiceID').val(result.IntactFamilyService[0].IntactFamilyServiceID);
        if (result.IntactFamilyService[0].Intfamsvcna == true) {
            $("input[name='RadioIntfamsvcna']").prop('checked', true);
            $('.Intfamsvcna').addClass('hidden');
        }
        else {
            $('.Intfamsvcna').removeAttr('hidden');
            $('.Intfamsvcna').show();
            $("input[name='RadioIntfamsvccaregvrcollab'][value = " + result.IntactFamilyService[0].Intfamsvccaregvrcollab + "]").prop('checked', true);
            $("input[name='RadioIntfamsvcfamroleapprop'][value = " + result.IntactFamilyService[0].Intfamsvcfamroleapprop + "]").prop('checked', true);
            $("input[name='RadioIntfamsvcfamconflict'][value = " + result.IntactFamilyService[0].Intfamsvcfamconflict + "]").prop('checked', true);
            $("input[name='RadioIntfamsvchomemaint'][value = " + result.IntactFamilyService[0].Intfamsvchomemaint + "]").prop('checked', true);
            $("input[name='RadioIntfamsvcfamcommunic'][value = " + result.IntactFamilyService[0].Intfamsvcfamcommunic + "]").prop('checked', true);
            $('#TextBoxIntfamsvcsuppinfo').val(result.IntactFamilyService[0].Intfamsvcsuppinfo);
        }
        
    }
    else {
        HandleStartSection("IntactFamilyService");
    }
}

function BindIntensivePlacementStabilization(result) {
    if (result.IntensivePlacementStabilization[0] != undefined) {
        if (result.IntensivePlacementStabilization[0].Status == "Completed") {
            HandleCompleteSection("IntensivePlacementStabilization");
        } else {
            HandleInprogressSection( "IntensivePlacementStabilization");
        }
        $('#TextBoxIntensivePlacementStabilizationID').val(result.IntensivePlacementStabilization[0].IntensivePlacementStabilizationID);
        if (result.IntensivePlacementStabilization[0].Ipsna == true) {
            $("input[name='RadioIpsna']").prop('checked', true);
            $('.Ipsna').addClass('hidden');
        }
        else {
            $('.Ipsna').removeAttr('hidden');
            $('.Ipsna').show();
            $("input[name='RadioIpsouthyrsincare'][value = " + result.IntensivePlacementStabilization[0].Ipsouthyrsincare + "]").prop('checked', true);
            $("input[name='RadioIpssubcargvrknwythdevneeds'][value = " + result.IntensivePlacementStabilization[0].Ipssubcargvrknwythdevneeds + "]").prop('checked', true);
            $("input[name='RadioIpsyouthplacemnthist'][value = " + result.IntensivePlacementStabilization[0].Ipsyouthplacemnthist + "]").prop('checked', true);
            $("input[name='RadioIpssubcargvrdiscipline'][value = " + result.IntensivePlacementStabilization[0].Ipssubcargvrdiscipline + "]").prop('checked', true);
            $("input[name='RadioIpssubcargvrmngmntemot'][value = " + result.IntensivePlacementStabilization[0].Ipssubcargvrmngmntemot + "]").prop('checked', true);
            $('#TextBoxIpssuppinfo').val(result.IntensivePlacementStabilization[0].Ipssuppinfo);
        }
        
    }
    else {
        HandleStartSection("IntensivePlacementStabilization");
    }
}
//#endregion

//#region Disable buttons enable sections
function DisableSaveButtonChildSection() {
    $(".btnDisable").prop("disabled", true);
    $(".btnNoStatus").prop("disabled", true);
    $("#btnSaveAsNew, #btnPublishVersion").addClass("hidden");
    $("#btnPrintPDf").hide();
    $("#labelAssessmentStatus, #labelDocumentVersion").text("");
    $(".bgProgress").hide();
    $(".bgInprogress").hide();
}
function ShowHideButtonsAndSections(status, version) {
    if (status == "Published" && version == true) {
        $("#btnSaveAsNew").removeClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").addClass("hidden");
        $(".btnChildTbales").prop("disabled", true);
        $(".btnDisable").hide();
        $(".btnNoStatus").hide();
        $(".btnMaster").hide();
        
        $(".form-control").prop("disabled", true);
        $(".editSubRows").addClass("disable-click").prop("disabled", true);;
        $(".deleteSubRows").addClass("disable-click").prop("disabled", true);;
    }
    else if (status == "Published" && version == false) {
        $("#btnSaveAsNew,  #btnPublishVersion").addClass("hidden");
        $("#btnPrintPDf").show();
        $(".btnChildTbales").prop("disabled", true);
        $(".btnDisable").hide();
        $(".btnNoStatus").hide();
        $(".btnMaster").hide();
      
        $(".form-control").prop("disabled", true);
        $(".editSubRows").addClass("disable-click").prop("disabled", true);;
        $(".deleteSubRows").addClass("disable-click").prop("disabled", true);;
    }
    else if (status == "Draft") {
        $("#btnSaveAsNew").addClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").removeClass("hidden");
        $(".btnChildTbales").prop("disabled", false);
        $(".btnDisable").text("Edit");
        $(".btnDisable").show();
        $(".btnNoStatus").show();
        $(".btnMaster").text("Edit");
        $(".btnMaster").show();
        $(".editSubRows").removeClass("disable-click").prop("disabled", false);;
        $(".deleteSubRows").removeClass("disable-click").prop("disabled", false);;
        $(".form-control").prop("disabled", true);
        $(".ModalTreatmentPlans .form-control").prop("disabled", false);
    }
}
//#endregion 
//#region section dropdwons
function BindDropDownCANS() {
    token = _token;
    reportedBy = _userId;
    //get all clients
   
    BindClientDropDowns();
    BindUserDefinedCodesRadio("radio", "ThreeScaleRating");
    BindUserDefinedCodesRadio("radioYesNo", "YesNo");
    BindCansDiagnosiscodes("#DropDownInterpreterServices");



    BindUserDefinedCodes("#DropDownInterpreterServices", "CANS_InterpretativeServices");
    BindUserDefinedCodes("#DropDownGuardianStatus", "CANS_GuardianshipStatus");
    BindUserDefinedCodes("#DropDownEmploymentStatus", "Employment Status");
    BindUserDefinedCodes("#DropDownLivingArrangement", "Livingarrangement");
    BindUserDefinedCodes("#DropDownEducationLevel", "EducationLevel");

    //////////////////////////////////////////////////////////
    BindUserDefinedCodes("#DropDownServiceType", "CANS_ServiceType");
    BindUserDefinedCodes("#DropDownServiceMode", "CANS_Mode");
    BindUserDefinedCodes("#DropDownServicePlace", "CANS_PlaceOfService");
    BindUserDefinedCodes("#DropDownServiceFrequency", "CANS_Frequency");
    BindUserDefinedCodes("#DropDownServiceDuration", "CANS_Duration");
    if (generalInformationID >0)
    GetServicesInterventionsObjectives();
}
function GetServicesInterventionsObjectives() {
    $.ajax({
        type: "POST",
        data: { TabName: "ServiceInterventionObjecives", GeneralInformationID:generalInformationID, ReportedBy: reportedBy },
        url: GetAPIEndPoints("GETTREATMENTPLANDETAILS"),
        headers: {
            'TOKEN': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            BindServiceObjectiveDropDown(JSON.parse(result.CommonCANSRsponse[0].JSONData));
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
//#endregion 
//#region manage roles and permissions
function GetCansRolesPermissions() {
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Common/FormUserAccess',
        data: { 'FormName': 'Incident Report Utility' },
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            cansRolePermissions = result;
            editPermission =cansRolePermissions[1].IsEnable ;
            deletePermission = cansRolePermissions[2].IsEnable;
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function CheckBtnPermissionAfterSave() {
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            $(".editSubRows").removeClass("disable-click").prop("disabled",false);
            $(".deleteSubRows").addClass("disable-click").prop("disabled", true);
            
        }
        if (editPermission == "false" && deletePermission == "true") {
            $(".editSubRows").addClass("disable-click").prop("disabled", true);
            $(".deleteSubRows").removeClass("disable-click").prop("disabled", false);
        }
        if (editPermission == "false" && deletePermission == "false") {
            $(".editSubRows").addClass("disable-click").prop("disabled", true);
            $(".deleteSubRows").addClass("disable-click").prop("disabled", true);
        }
        if (editPermission == "true" && deletePermission == "true") {
            $(".editSubRows").removeClass("disable-click").prop("disabled", false);
            $(".deleteSubRows").removeClass("disable-click").prop("disabled", false);
        }
    }
}
function AddNewPermission() {
    if (!isEmpty(cansRolePermissions)) {
        if ((cansRolePermissions[0].Action == "Add" && cansRolePermissions[0].IsEnable == "true") && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "false")) {
            $(".printDoc").addClass('hidden');
            $(".btnDisable").removeClass('hidden').text('Ok');
        }
        if ((cansRolePermissions[0].Action == "Add" && cansRolePermissions[0].IsEnable == "true") && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "true")) {
            $(".printDoc").removeClass('hidden');
            $(".btnDisable").removeClass('hidden').text('Ok');
        }
        if ((cansRolePermissions[0].Action == "Add" && cansRolePermissions[0].IsEnable == "false") && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "false")) {
            $(".printDoc").addClass('hidden');
            $(".btnDisable").addClass('hidden').text('Ok');
        }
    }

}
function CheckUserPermission() {
    if (!isEmpty(cansRolePermissions)) {
        if (cansRolePermissions[3].Action == "View" && cansRolePermissions[3].IsEnable == "true"
            && ((cansRolePermissions[1].Action == "Edit" && cansRolePermissions[1].IsEnable == "false")
                && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "false")
                && cansRolePermissions[2].Action == "Delete" && cansRolePermissions[2].IsEnable == "false")) {
            ViewPermission();
        }
        if (cansRolePermissions[3].Action == "View" && cansRolePermissions[3].IsEnable == "true"
            && ((cansRolePermissions[1].Action == "Edit" && cansRolePermissions[1].IsEnable == "true")
                && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "false")
                && (cansRolePermissions[2].Action == "Delete" && cansRolePermissions[2].IsEnable == "false"))) {
            EditViewPermission();
        }
        if (cansRolePermissions[3].Action == "View" && cansRolePermissions[3].IsEnable == "true"
            && ((cansRolePermissions[1].Action == "Edit" && cansRolePermissions[1].IsEnable == "false")
                && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "true")
                && (cansRolePermissions[2].Action == "Delete" && cansRolePermissions[2].IsEnable == "false"))) {
            ViewPdfPermission();
        }
        if (cansRolePermissions[3].Action == "View" && cansRolePermissions[3].IsEnable == "true"
            && ((cansRolePermissions[1].Action == "Edit" && cansRolePermissions[1].IsEnable == "false")
                && (cansRolePermissions[4].Action == "Print" && cansRolePermissions[4].IsEnable == "false")
                && (cansRolePermissions[2].Action == "Delete" && cansRolePermissions[2].IsEnable == "true"))) {
            ViewDeletePermission();
        }
        if (cansRolePermissions[1].IsEnable == "true" && cansRolePermissions[1].IsEnable == "true"
            && cansRolePermissions[3].IsEnable == "true" && cansRolePermissions[3].IsEnable == "true") {
            AllPermission();
        }
        if (cansRolePermissions[3].Action == "View" && cansRolePermissions[3].IsEnable == "false") {
            window.location.href = 'PermissionDenied.html';
        }
    }


}
function ViewPermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").addClass('hidden');
    $(".btnDisable").addClass('hidden');
    $(".btnNoStatus").addClass('hidden');
    $(".editSubRows").addClass("disable-click").prop("disabled",true);
    $(".deleteSubRows").addClass("disable-click").prop("disabled", true);;
}
function EditViewPermission() {

    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").addClass('hidden');
    $(".btnDisable").removeClass('hidden').text('Edit');
    $(".btnNoStatus").removeClass('hidden');
    $(".editSubRows").removeClass("disable-click").prop("disabled", false);
    $(".deleteSubRows").addClass("disable-click").prop("disabled", true);;
    $(".ModalTreatmentPlans .form-control").prop("disabled", false);
    if (documentMode == "Published") {
        $(".editSubRows").addClass("disable-click").prop("disabled", true);
        $(".deleteSubRows").addClass("disable-click").prop("disabled", true);
    }
}
function ViewPdfPermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").removeClass('hidden');
    $(".btnDisable").addClass('hidden')
    $(".btnNoStatus").addClass('hidden');
    $(".editSubRows").addClass("disable-click").prop("disabled", true);;
    $(".deleteSubRows").addClass("disable-click").prop("disabled", true);;
    $(".disabledownloadpdf").removeClass("disable-click");

}
function ViewDeletePermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").addClass('hidden');
    $(".btnDisable").addClass('hidden')
    $(".btnNoStatus").addClass('hidden');
    $(".editSubRows").addClass("disable-click").prop("disabled", true);
    $(".deleteSubRows").removeClass("disable-click").prop("disabled", false);;

}
function AllPermission() {
    $(".form-control").prop("disabled", true);
    $("input[type=radio]").prop("disabled", true);
    $(".printDoc").removeClass('hidden');
    $(".btnDisable").removeClass('hidden').text('Edit');
    $(".btnNoStatus").removeClass('hidden');
    $(".editSubRows").removeClass("disable-click").prop("disabled", false);
    $(".deleteSubRows").removeClass("disable-click").prop("disabled", false);;
    $(".disabledownloadpdf").removeClass("disable-click");
    $(".ModalTreatmentPlans .form-control").prop("disabled", false);
    if (documentMode == "Published") {
        $(".editSubRows").addClass("disable-click").prop("disabled", true);
        $(".deleteSubRows").addClass("disable-click").prop("disabled", true);
    }
}

function CreateChildBtnWithPermission(editEvent,deleteEvent) {
    var notificationBtn = "";
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            notificationBtn = '<a href="#" class="editSubRows"  onclick="' + editEvent +'(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows disable-click" onclick="' + deleteEvent+'(this);event.preventDefault();">Delete</a></span>';
        }
        if (editPermission == "false" && deletePermission == "true") {
            notificationBtn = '<a href="#" class="editSubRows disable-click" onclick="' + editEvent +'(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows" onclick="' + deleteEvent +'(this); event.preventDefault();">Delete</a></span>';
        }
        if (editPermission == "true" && deletePermission == "true") {
            notificationBtn = '<a href="#" class="editSubRows" onclick="' + editEvent +'(this);event.preventDefault();">Edit</a>'
                + '<span><a href="#" class="deleteSubRows" onclick="' + deleteEvent +'(this); event.preventDefault();">Delete</a></span>';
        }
    }
    return notificationBtn;
}
//#endregion  

//#region jquery datatbales
function InitializeSectionTables() {

    $('#MembersFamilyConstellation').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],

    });
    $('#establishedSupports').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [1, 7] }
        ],

    });
    $("#PriorSubstanceAbuseTreatment").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],

    });
    $("#PriorMentalHealthServices").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
    });
    $("#diagnosis").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [1,6] }
        ],
    });
    $("#tableServicesIntervention").dataTable();
    $("#medication").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [7] }
        ],
    });
    $("#PsychiatricallyHospitalized").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
    });
    $("#additionalHospitalizations").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
    });
    $("#specialtiesProviders").DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [4] }
        ],
    });
    $("#tblTreatmentPlans").dataTable();
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');

}
function InitalizeDateControls() {
    InitCalendar($(".date"), "date controls");
    $('.time').timepicker(getTimepickerOptions());
    $('.time').on("timeFormatError", function (e) { timepickerFormatError($(this).attr('id')); });
}
//#endregion
//#region Validate methods for CANS
function ValidateRequiredFields(parentSection) {
    var checked = null;
    $("." + parentSection + " .req_feild").each(function () {
        if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if ($(this).val() == "" || $(this).val() == "-1") {
            $(this).siblings("span.errorMessage").removeClass("hidden");
            $(this).focus();
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}
function CloseErrorMeeage() {

    $('select').click(function () {
        if ($(this).hasClass("req_feild") && ($(this).val() != '' || $(this).val() > 1)) {
            $(this).siblings("span.errorMessage").addClass("hidden");
        }
    });
    $('input').blur(function () {
        if ($(this).attr("type") == "radio" && $(this).hasClass("req_feild")) {
            var radio = $(this).attr("name");
            $('input[name=' + radio + ']').change(function () {
                $(this).parent().parent().parent().next().children().addClass("hidden");

            })
        }
        else if ($(this).attr("type") == "checkbox" && $(this).hasClass("req_feild")) {
            $('input[type=checkbox').change(function () {
                $(this).parent().parent().parent().next().children().addClass("hidden");

            })
        }
        else if ($(this).hasClass("req_feild")) {
            $(this).siblings("span.errorMessage").addClass("hidden");

        }
    })
    $('textarea').blur(function () {
        $(this).siblings("span.errorMessage").addClass("hidden");
    })
    $('span').click(function () {
        $(this).siblings("span.errorMessage").addClass("hidden");
    })
}
//#endregion

//#region Insert/Modify common functions
function InsertModifySectionTabsCommon(parentClass, elem) {
   
    if ($(elem).text() == "Edit") {
        $(elem).text("Ok");
        $('.' + parentClass + ' .form-control').attr("disabled", false);
        if (parentClass == "section14") {
            $('#btnNeedsStrengthItems').attr("disabled", false);
        }
        return;
    }
    var validateMethod = $(elem).attr("validate-method");
    if (typeof validateMethod != undefined && validateMethod != false) {
        if (!eval(validateMethod)) return;
    }
    var methodName = $(elem).attr("data-item");
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        eval(methodName);
    }, function no() {
        sectionStatus = "Inprogress"
        eval(methodName);
    });
}
function GenerateJSONData(parentSection) {
    var json = [],
        item = {},
        tag;
    $("." + parentSection + " .form-control").each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithDiffCheckBox(tag, this);
            }
        }

    });
    item["CansVersioningId"] = $("#TextBoxCansVersioningID").val();
    item["GeneralInformationID"] = $("#TextBoxGeneralInformationId").val();
    item["Status"] = sectionStatus;

    return item;
}
function commonAjaxRequest(tabName, json, methodName) {
    $.ajax({
        type: "POST",
        data: { TabName: tabName, Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLCANSDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                showRecordSaved("Record saved successfully");
                jsonResult = result;
                eval(methodName);

            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function updateSectionStatus(currentStatus, parentClass) {
    if (currentStatus == "Completed") {
        $("." + parentClass).find(".bgProgress").show();
        $("." + parentClass).find(".bgStart").hide();
        $("." + parentClass).find(".bgInprogress").hide();

    }
    else {
        $("." + parentClass).find(".bgProgress").hide();
        $("." + parentClass).find(".bgStart").hide();
        $("." + parentClass).find(".bgInprogress").show();
    }


}
function ChildTable(parentClass) {
    var json = [],
        jsonChildFirst = [],
        jsonChildSecond = [],
        jsonChildThird = [],
        item = {},

        tag;
    if (parentClass == 'SubstanceUseHistory') {
        var oTable = $("#PriorSubstanceAbuseTreatment").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["Subabusehistwhen"] = value[1] == undefined ? value.Subabusehistwhen : value[1];
            itemBodyFirst["Subabusehistwhere"] = value[2] == undefined ? value.Subabusehistwhere : value[2];
            itemBodyFirst["Subabusehistwithwhom"] = value[3] == undefined ? value.Subabusehistwithwhom : value[3];
            itemBodyFirst["Subabusehistreason"] = value[4] == undefined ? value.Subabusehistreason : value[4];
            itemBodyFirst["SubstanceAbuseTreatmentID"] = value[5] == undefined ? value.SubstanceAbuseTreatmentID : value[5];
            jsonChildFirst.push(itemBodyFirst);

        });
        return jsonChildFirst;
    }
    else if (parentClass == 'PsychiatricInformation') {
        var oTable = $("#PriorMentalHealthServices").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["Mentalhealthhistwhen"] = value[1] == undefined ? value.Mentalhealthhistwhen : value[1];
            itemBodyFirst["Mentalhealthhistwhere"] = value[2] == undefined ? value.Mentalhealthhistwhere : value[2];
            itemBodyFirst["Mentalhealthhistwithwhom"] = value[3] == undefined ? value.Mentalhealthhistwithwhom : value[3];
            itemBodyFirst["Mentalhealthhistreason"] = value[4] == undefined ? value.Mentalhealthhistreason : value[4];
            itemBodyFirst["OutpatientMentalHealthServicesID"] = value[5] == undefined ? value.OutpatientMentalHealthServicesID : value[5];
            jsonChildFirst.push(itemBodyFirst);
        });
        return jsonChildFirst;
    }
    else if (parentClass == 'DsmDiagnosis') {
        var oTable = $("#diagnosis").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["DiagnosticCode"] = value[1] == undefined ? value.DiagnosisCode : value[1];
            itemBodyFirst["ICD5Name"] = value[3] == undefined ? value.ICD5Name : value[3];
            itemBodyFirst["ICD10Name"] = value[4] == undefined ? value.ICD10Name : value[4];
            itemBodyFirst["Diagnosis"] = value[5] == undefined ? value.Diagnosis == 'Yes' ? 1 : 0 : value[5] == 'Yes' ? 1 : 0;
            itemBodyFirst["DsmDiagnosisID"] = value[6] == undefined ? value.DsmDiagnosisID : value[6];
            itemBodyFirst["GeneralInformationId"] = $("#TextBoxGeneralInformationId").val();
            itemBodyFirst["CansVersioningID"] = $("#TextBoxCansVersioningID").val();
            itemBodyFirst["Status"] = sectionStatus;
            jsonChildFirst.push(itemBodyFirst);
        });
        return jsonChildFirst;
    }
    else if (parentClass == 'Medication') {
        var oTable = $("#medication").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["MedicationName"] = value[1] == undefined ? value.MedicationName : value[1];
            itemBodyFirst["MedicationPrescriberName"] = value[2] == undefined ? value.MedicationPrescriberName : value[2];
            itemBodyFirst["MedicationDosage"] = value[3] == undefined ? value.MedicationDosage : value[3];
            itemBodyFirst["MedicationPrescriptionBeginDate"] = value[4] == undefined ? value.MedicationPrescriptionBeginDate : value[4];
            itemBodyFirst["MedicationPrescriptionEndDate"] = value[5] == undefined ? value.MedicationPrescriptionEndDate : value[5];
            itemBodyFirst["MedicationIssues"] = value[6] == undefined ? value.MedicationIssues : value[6];
            itemBodyFirst["MedicationDetailID"] = value[7] == undefined ? value.MedicationDetailID : value[7];
            jsonChildFirst.push(itemBodyFirst);

        });
        return jsonChildFirst;
    }
    else if (parentClass == 'PsychiatricallyHospitalized') {
        var oTable = $("#PsychiatricallyHospitalized").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["PsychHospitalName"] = value[1] == undefined ? value.PsychHospitalName : value[1];
            itemBodyFirst["PsychHospitalLocation"] = value[2] == undefined ? value.PsychHospitalLocation : value[2];
            itemBodyFirst["PsychHospitalizationDate"] = value[3] == undefined ? value.PsychHospitalizationDate : value[3];
            itemBodyFirst["ReasonHospitalizedPsych"] = value[4] == undefined ? value.ReasonHospitalizedPsych : value[4];
            itemBodyFirst["MedicalHistoryPsychHospitalID"] = value[5] == undefined ? value.MedicalHistoryPsychHospitalID : value[5];
            jsonChildFirst.push(itemBodyFirst);
        });
        return jsonChildFirst;
    }
    else if (parentClass == 'AdditHospital') {
        var oTable = $("#additionalHospitalizations").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["HospitalName"] = value[1] == undefined ? value.HospitalName : value[1];
            itemBodyFirst["HospitalLocation"] = value[2] == undefined ? value.HospitalLocation : value[2];
            itemBodyFirst["HospitalizationDate"] = value[3] == undefined ? value.HospitalizationDate : value[3];
            itemBodyFirst["ReasonHospitalized"] = value[4] == undefined ? value.ReasonHospitalized : value[4];
            itemBodyFirst["MedicalHistoryAdditHospitalID"] = value[5] == undefined ? value.MedicalHistoryAdditHospitalID : value[5];
            jsonChildSecond.push(itemBodyFirst);


        });
        return jsonChildSecond;
    }
    else if (parentClass == 'Provider') {
        var oTable = $("#specialtiesProviders").DataTable().rows().data();
        $.each(oTable, function (index, value) {
            var itemBodyFirst = {};
            itemBodyFirst["ProviderName"] = value[1] == undefined ? value.ProviderName : value[1];
            itemBodyFirst["ProviderSpecialty"] = value[2] == undefined ? value.ProviderSpecialty : value[2];
            itemBodyFirst["ProviderServices"] = value[3] == undefined ? value.ProviderServices : value[3];
            itemBodyFirst["MedicalHistoryProviderID"] = value[4] == undefined ? value.MedicalHistoryProviderID : value[4];
            jsonChildThird.push(itemBodyFirst);
        });
        return jsonChildThird;
    }


}
function jsonWrapperWithDiffCheckBox(tag, elem) {
    if ($(elem).hasClass('date') && $(elem).val() != '' && $(elem).val() != null) {
        return $(elem).is(":visible") == true ? $(elem).val() + (($('#TextBox' + tag + 'Time').length != 0) ? ' ' + $('#TextBox' + tag + 'Time').val() : '') : '';
    }
    else if ($(elem).attr('type') == 'checkbox') {
        return ($(elem).prop('checked') == true) ? 1 : 0;
    }
    else if ($(elem).attr('id').indexOf("TextBox") > -1) {
        return ($(elem).val());
    }
    else {
        if ($(elem).prop('tagName') == 'SELECT') {
            return (($(elem).val() == null || $(elem).val() == '-1') ? '' : $(elem).val());
        } else {
            return (($(elem).val() == null) ? '' : $(elem).val());
        }
    }

}
function InsertModifySectionTabs(parentClass) {
    className = parentClass;
    if ($("#Btn" + parentClass + "Ok").text() == "Edit") {
        $('.' + parentClass + ' .form-control').attr("disabled", false);
        $('.' + parentClass + '  input[type=radio]').prop("disabled", false);
        $("#Btn" + parentClass + "Ok").text("Ok");
        return;
    }

    var json = [],
        item = {},
        tag;

    $("." + parentClass + " .form-control").each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithDiffCheckBox(tag, this);
            }

        }
    });
    item["GeneralInformationId"] = $("#TextBoxGeneralInformationId").val();
    item["CansVersioningID"] = $("#TextBoxCansVersioningID").val();
    item["Status"] = sectionStatus;
    json.push(item)
    var flag = false;
    var flag1 = false;
    var flag2 = false;
    var jsonChildFirst = [];
    var jsonChildSecond = [];
    var jsonChildThird = [];
    if (parentClass == 'SubstanceUseHistory' || parentClass == 'PsychiatricInformation' || parentClass == 'DsmDiagnosis' || parentClass == 'Medication') {
        jsonChildFirst = ChildTable(parentClass);
        flag = true;
    }
    if (parentClass == 'MedicalHistory') {
        jsonChildFirst = ChildTable('PsychiatricallyHospitalized');
        jsonChildSecond = ChildTable('AdditHospital');
        jsonChildThird = ChildTable('Provider');
        flag = true;
        flag1 = true;
        flag2 = true;
    }

    $.ajax({
        type: "POST",
        data: { TabName: parentClass, Json: JSON.stringify(json), JsonChildFirstTable: (flag == true) ? JSON.stringify(jsonChildFirst) : '', JsonChildSecondTable: (flag1 == true) ? JSON.stringify(jsonChildSecond) : '', JsonChildThirdTable: (flag2 == true) ? JSON.stringify(jsonChildThird) : '', ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLCANSDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            CansSectionsSaved(result)

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function CansSectionsSaved(result) {
    if (result.Success == true && result.IsException == false) {
        showRecordSaved("Record saved successfully");
        if (result.CommonCANSRsponse[0].TraumaExposureID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].TraumaExposureID);
        }
        if (result.CommonCANSRsponse[0].PresentinProblemAndImpactID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].PresentinProblemAndImpactID);
        }
        if (result.CommonCANSRsponse[0].SafetyID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].SafetyID);
        }
        if (result.CommonCANSRsponse[0].SubstanceUseHistoryID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].SubstanceUseHistoryID);
            BindChildTable(result, className);
        }
        if (result.CommonCANSRsponse[0].PsychiatricInformationID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].PsychiatricInformationID);
            BindChildTable(result, className);
        }
        if (result.CommonCANSRsponse[0].PlacementHistoryID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].PlacementHistoryID);
        }
        if (result.CommonCANSRsponse[0].ClientStrengthID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].ClientStrengthID);
        }
        if (result.CommonCANSRsponse[0].FamilyInformationID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].FamilyInformationID);
        }
        if (result.CommonCANSRsponse[0].NeedsResourceAssessmentID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].NeedsResourceAssessmentID);
        }
        if (result.CommonCANSRsponse[0].DsmDiagnosisID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].DsmDiagnosisID);
            BindChildTable(result, className);
        }
        if (result.CommonCANSRsponse[0].MentalHealthSummaryID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].MentalHealthSummaryID);
        }
        if (result.CommonCANSRsponse[0].AddClientFunctioningEvaluationID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].AddClientFunctioningEvaluationID);
        }
        if (result.CommonCANSRsponse[0].CaregiverAddendumID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].CaregiverAddendumID);
        }
        if (result.CommonCANSRsponse[0].GeneralInformationDCFSID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].GeneralInformationDCFSID);
        }
        if (result.CommonCANSRsponse[0].SexuallyAggrBehaviorID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].SexuallyAggrBehaviorID);
        }
        if (result.CommonCANSRsponse[0].ParentGuardSafetyID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].ParentGuardSafetyID);
        }
        if (result.CommonCANSRsponse[0].ParentGuardWellbeingID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].ParentGuardWellbeingID);
        }
        if (result.CommonCANSRsponse[0].ParentGuardPermananenceID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].ParentGuardPermananenceID);
        }
        if (result.CommonCANSRsponse[0].SubstituteCommitPermananenceID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].SubstituteCommitPermananenceID);
        }
        if (result.CommonCANSRsponse[0].IntactFamilyServiceID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].IntactFamilyServiceID);
        }
        if (result.CommonCANSRsponse[0].IntensivePlacementStabilizationID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].IntensivePlacementStabilizationID);
        }
        if (result.CommonCANSRsponse[0].GeneralInformatioinHRAID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].GeneralInformatioinHRAID);
        }
        if (result.CommonCANSRsponse[0].HealthStatusID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].HealthStatusID);
        }
        if (result.CommonCANSRsponse[0].DevelopmentHistoryID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].DevelopmentHistoryID);
        }
        if (result.CommonCANSRsponse[0].MedicationID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].MedicationID);
            BindChildTable(result, className);
        }
        if (result.CommonCANSRsponse[0].MedicalHistoryID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].MedicalHistoryID);
            BindChildTable(result, className);
        }
        if (result.CommonCANSRsponse[0].CansSignatureID > 0) {
            $("#TextBoxCansSignatureID").val(result.CommonCANSRsponse[0].CansSignatureID);
        }
        if (result.CommonCANSRsponse[0].IndividualTreatmentPlanID > 0) {
            $("#TextBox" + className + "ID").val(result.CommonCANSRsponse[0].IndividualTreatmentPlanID);
        }
        if (className =="DsmDiagnosis") {
            BindChildTable(result, className);
        }
        var status = result.CommonCANSRsponse[0].Status;
        updateSectionStatus(status, className);

        $('.' + className + ' .form-control').prop("disabled", true);
        if ($("#Btn" + className + "Ok").text() == 'Ok') {
            $("#Btn" + className + "Ok").text('Edit');
            className = '';
        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
//#endregion


//#region section1 general info
function AddFamilyConstellation() {
    $("#AddMemberOfFamilyConstellation").on("click", function () {
        var LivingInHome = '';
        if (!$("#AddMemberOfFamilyConstellation").hasClass("editRow")) {
            if ($("#TextBoxFamilyMemberName").val() == '' && $("#TextBoxFamilyMemberAge").val() == '' && $("#TextBoxFamilyMemberRelation").val() == '' && $('input[name=RadioFamilyMemberInHome]:checked').val() == undefined) {
                showErrorMessage(" select atleast one field.");
                return;
            }
            LivingInHome = $('input[name=RadioFamilyMemberInHome]:checked').val();
            if (LivingInHome == 1) {
                LivingInHome = 'Yes';
            }
            else if (LivingInHome == 0) {
                LivingInHome = 'No';
            }
            else {
                LivingInHome = '';
            }
            if (dataTableFamilyMembersFlg) {
                newRow = $('#MembersFamilyConstellation').DataTable();
                var rowExists = false;
                var valueCol = $('#MembersFamilyConstellation').DataTable().column(1).data();
                var index = valueCol.length;
                //for (var k = 0; k < index; k++) {
                //    if (valueCol[k].toLowerCase().includes(selectedText.trim().toLowerCase())) {
                //        rowExists = true;
                //        break;
                //    }
                //}
                var rowCount = $('#MembersFamilyConstellation tr').length;
                if (rowCount > 8) {
                    showErrorMessage(" Not allowed more than 8 records");
                    return;

                }
                else {
                    var text = [{
                        "Actions": CreateChildBtnWithPermission("EditFamilyMembers","DeleteFamilyMembers"),

                        "FamilyMemberName": $("#TextBoxFamilyMemberName").val(),
                        "FamilyMemberAge": $("#TextBoxFamilyMemberAge").val(),
                        "FamilyMemberRelation": $("#TextBoxFamilyMemberRelation").val(),
                        "FamilyMemberInHome": LivingInHome,
                        "GeneralInfoFamilyMembersId": $("#TextBoxGeneralInfoFamilyMembersId").val() == undefined ? '' : $("#TextBoxGeneralInfoFamilyMembersId").val(),

                    }];
                    var stringyfy = JSON.stringify(text);
                    var data = JSON.parse(stringyfy);
                    newRow.rows.add(data).draw(false);
                    showRecordSaved("Family Member added successfully.");

                    clearFamilyMembersFields();
                }

            }
            else {
                var rowExists = false;
                newRow = $('#MembersFamilyConstellation').DataTable();
                var valueCol = $('#MembersFamilyConstellation').DataTable().column(1).data();
                var index = valueCol.length;
                //for (var k = 0; k < index; k++) {
                //    if (valueCol[k].toLowerCase().includes(selectedText.trim().toLowerCase())) {
                //        rowExists = true;
                //        break;
                //    }
                //}
                var rowCount = $('#MembersFamilyConstellation tr').length;
                if (rowCount > 8) {
                    showErrorMessage("Not allowed more than 8 records");
                    return;
                }
                else {
                    newRow.row.add([
                        CreateChildBtnWithPermission("EditFamilyMembers", "DeleteFamilyMembers"),
                        //  selectedText.trim(),
                        $("#TextBoxFamilyMemberName").val(),
                        $("#TextBoxFamilyMemberAge").val(),
                        $("#TextBoxFamilyMemberRelation").val(),
                        LivingInHome,
                        $("#TextBoxGeneralInfoFamilyMembersId").val() == undefined ? '' : $("#TextBoxGeneralInfoFamilyMembersId").val(),
                    ]).draw(false);
                    showRecordSaved("Family Member added successfully.");

                    clearFamilyMembersFields();
                }

            }

        }

    });
}
function AddEstabilishedSupports() {
    $("#DropDownEstabilishedSupports").change(function () {
        selectedText = $(this).find("option:selected").text();
        selectedValue = $(this).val();
    });

    $("#AddEstabilishedSupports").on("click", function () {

        if (!$("#AddEstabilishedSupports").hasClass("editRow")) {
            if ($("#DropDownEstabilishedSupports option:selected").val() == '') {
                showErrorMessage("Estabilished Supports should be selected.");
                return;
            }
            if (dataTableEstabilishedSupportsFlg) {
                newRow = $('#establishedSupports').DataTable();
                var rowExists = false;
                var valueCol = $('#establishedSupports').DataTable().column(2).data();
                var index = valueCol.length;
                for (var k = 0; k < index; k++) {
                    if (valueCol[k].toLowerCase().includes(selectedText.trim().toLowerCase())) {
                        rowExists = true;
                        break;
                    }
                }
                if (rowExists) {
                    showErrorMessage("option already exist in table");
                    return;

                }
                else {
                    var text = [{
                        "Actions": CreateChildBtnWithPermission("EditEstabilishedSupports", "DeleteEstabilishedSupports"),

                        "EstabilishedSupportsType": $("#DropDownEstabilishedSupports").val(),
                        "EstabilishedSupports": $("#DropDownEstabilishedSupports option:selected").text(),
                        "EsAgency": $("#TextBoxEsAgency").val(),
                        "EsContact": $("#TextBoxEsContact").val(),
                        "EsPhone": $("#TextBoxEsPhone").val(),
                        "EsEmail": $("#TextBoxEsEmail").val(),
                        "GeneraInfoEstabilishedSupportsId": $("#TextBoxGeneraInfoEstabilishedSupportsId").val(),

                    }];
                    var stringyfy = JSON.stringify(text);
                    var data = JSON.parse(stringyfy);
                    newRow.rows.add(data).draw(false);
                    showRecordSaved("Estabilished Supports added successfully.");

                    clearEstabilishedSupports();
                }

            }
            else {
                var rowExists = false;
                newRow = $('#establishedSupports').DataTable();
                var valueCol = $('#establishedSupports').DataTable().column(2).data();
                var index = valueCol.length;
                for (var k = 0; k < index; k++) {
                    if (valueCol[k].toLowerCase().includes(selectedText.trim().toLowerCase())) {
                        rowExists = true;
                        break;
                    }
                }

                if (rowExists) {
                    showErrorMessage("option already exist in table");
                    return;
                }
                else {
                    newRow.row.add([
                        CreateChildBtnWithPermission("EditEstabilishedSupports", "DeleteEstabilishedSupports"),
                        // selectedText.trim(),
                        $("#DropDownEstabilishedSupports").val(),
                        $("#DropDownEstabilishedSupports option:selected").text(),
                        $("#TextBoxEsAgency").val(),
                        $("#TextBoxEsContact").val(),
                        $("#TextBoxEsPhone").val(),
                        $("#TextBoxEsEmail").val(),
                        $("#TextBoxGeneraInfoEstabilishedSupportsId").val(),
                    ]).draw(false);
                    showRecordSaved("Estabilished Supports added successfully.");

                    clearEstabilishedSupports();
                }

            }

        }

    });
}
function EditFamilyMembers(object) {
    var table = $('#MembersFamilyConstellation').DataTable();
    currentRowFamilyMembers = $(object).parents("tr");

    //FamilyMembers = table.row(currentRowFamilyMembers).data()[1] == undefined ? table.row(currentRowFamilyMembers).data().Notification : table.row(currentRowFamilyMembers).data()[1];
    var Name = table.row(currentRowFamilyMembers).data()[1] == undefined ? table.row(currentRowFamilyMembers).data().FamilyMemberName : table.row(currentRowFamilyMembers).data()[1];
    var Age = table.row(currentRowFamilyMembers).data()[2] == undefined ? table.row(currentRowFamilyMembers).data().FamilyMemberAge : table.row(currentRowFamilyMembers).data()[2];
    var RelationToClient = table.row(currentRowFamilyMembers).data()[3] == undefined ? table.row(currentRowFamilyMembers).data().FamilyMemberRelation : table.row(currentRowFamilyMembers).data()[3];
    var LivingInHome = table.row(currentRowFamilyMembers).data()[4] == undefined ? table.row(currentRowFamilyMembers).data().FamilyMemberInHome : table.row(currentRowFamilyMembers).data()[4];
    var GeneralInfoFamilyMembersId = table.row(currentRowFamilyMembers).data()[5] == undefined ? table.row(currentRowFamilyMembers).data().GeneralInfoFamilyMembersId : table.row(currentRowFamilyMembers).data()[5];

    $("#TextBoxFamilyMemberName").val(Name);
    $("#TextBoxFamilyMemberAge").val(Age);
    $("#TextBoxFamilyMemberRelation").val(RelationToClient);
    if (LivingInHome == 'Yes') {
        LivingInHome = 1;
    }
    else if (LivingInHome == 'No') {
        LivingInHome = 0;
    }
    else {
        LivingInHome = '';
    }
    LivingInHome == '' ? $("input[name='RadioFamilyMemberInHome']").prop('checked', false) : $("input[name='RadioFamilyMemberInHome'][value=" + LivingInHome + "]").prop('checked', true);
    $("GeneralInfoFamilyMembersId").val(GeneralInfoFamilyMembersId);
    $("#AddMemberOfFamilyConstellation").attr("onclick", "EditExistingRowFamilyMembers();return false;");
    $("#AddMemberOfFamilyConstellation").addClass("editRow");
    $("#AddMemberOfFamilyConstellation").text("Edit");
    return false;
}
function DeleteFamilyMembers(object) {
    var table = $('#MembersFamilyConstellation').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddMemberOfFamilyConstellation").attr("onclick") != undefined) {
        $("#AddMemberOfFamilyConstellation").removeAttr("onclick");
        $("#AddMemberOfFamilyConstellation").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditEstabilishedSupports(object) {
    var table = $('#establishedSupports').DataTable();
    currentRowEstabilishedSupports = $(object).parents("tr");
    // Notification = table.row(currentRowNotification).data()[1] == undefined ? table.row(currentRowNotification).data().Notification : table.row(currentRowNotification).data()[1];
    var EstablishedSupportsType = table.row(currentRowEstabilishedSupports).data()[1] == undefined ? table.row(currentRowEstabilishedSupports).data().EstabilishedSupportsType : table.row(currentRowEstabilishedSupports).data()[1];
    EstablishedSupports = table.row(currentRowEstabilishedSupports).data()[2] == undefined ? table.row(currentRowEstabilishedSupports).data().EstabilishedSupports : table.row(currentRowEstabilishedSupports).data()[2];
    var EsAgency = table.row(currentRowEstabilishedSupports).data()[3] == undefined ? table.row(currentRowEstabilishedSupports).data().EsAgency : table.row(currentRowEstabilishedSupports).data()[3];
    var EsContact = table.row(currentRowEstabilishedSupports).data()[4] == undefined ? table.row(currentRowEstabilishedSupports).data().EsContact : table.row(currentRowEstabilishedSupports).data()[4];
    var EsPhone = table.row(currentRowEstabilishedSupports).data()[5] == undefined ? table.row(currentRowEstabilishedSupports).data().EsPhone : table.row(currentRowEstabilishedSupports).data()[5];
    var EsEmail = table.row(currentRowEstabilishedSupports).data()[6] == undefined ? table.row(currentRowEstabilishedSupports).data().EsEmail : table.row(currentRowEstabilishedSupports).data()[6];
    var GeneraInfoEstabilishedSupportsId = table.row(currentRowEstabilishedSupports).data()[7] == undefined ? table.row(currentRowEstabilishedSupports).data().GeneraInfoEstabilishedSupportsId : table.row(currentRowEstabilishedSupports).data()[7];

    $("#DropDownEstabilishedSupports").val(EstablishedSupportsType);
    //$("#DropDownEstabilishedSupports").text(EstablishedSupports);
    $("#TextBoxEsAgency").val(EsAgency);
    $("#TextBoxEsContact").val(EsContact);
    $("#TextBoxEsPhone").val(EsPhone);
    $("#TextBoxEsEmail").val(EsEmail);
    $("#TextBoxGeneraInfoEstabilishedSupportsId").val(GeneraInfoEstabilishedSupportsId);
    $("#AddEstabilishedSupports").attr("onclick", "EditExistingRowEstabilishedSupports();return false;");
    $("#AddEstabilishedSupports").addClass("editRow");
    $("#AddEstabilishedSupports").text("Edit");

    return false;
}
function DeleteEstabilishedSupports(object) {
    var table = $('#establishedSupports').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddEstabilishedSupports").attr("onclick") != undefined) {
        $("#AddEstabilishedSupports").removeAttr("onclick");
        $("#AddEstabilishedSupports").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRowEstabilishedSupports() {
    if ($("#AddEstabilishedSupports").text() == 'Edit') {
        $("#AddEstabilishedSupports").text('Add');
    };
    var table = $('#establishedSupports').DataTable();
    var currentata = "";
    if (dataTableEstabilishedSupportsFlg) {
        var rowExists = false;
        var valueCol = $('#establishedSupports').DataTable().column(2).data();
        var index = valueCol.length;
       
        if (rowExists) {
            showErrorMessage("option already exist in table");
            return;
        }
        else {
            var data = {
                "Actions": CreateChildBtnWithPermission("EditEstabilishedSupports", "DeleteEstabilishedSupports"),

                "EstabilishedSupportsType": $("#DropDownEstabilishedSupports").val(),
                "EstabilishedSupports": $("#DropDownEstabilishedSupports option:selected").text(),
                "EsAgency": $("#TextBoxEsAgency").val(),
                "EsContact": $("#TextBoxEsContact").val(),
                "EsPhone": $("#TextBoxEsPhone").val(),
                "EsEmail": $("#TextBoxEsEmail").val(),
                "GeneraInfoEstabilishedSupportsId": $("#TextBoxGeneraInfoEstabilishedSupportsId").val(),

            };
            table.row(currentRowEstabilishedSupports).data(data).draw(false);
            $("#AddEstabilishedSupports").removeAttr("onclick");
            $("#AddEstabilishedSupports").removeClass("editRow");
            showRecordSaved("Estabilished Support edited successfully.");
            clearEstabilishedSupports();
        }
    }
    else {
        var rowExists = false;
        var valueCol = $('#establishedSupports').DataTable().column(1).data();
        var index = valueCol.length;
        for (var k = 0; k < index; k++) {
            if (valueCol[k].toLowerCase().includes($("#DropDownEstabilishedSupports").find("option:selected").text().trim().toLowerCase())) {
                rowExists = true;
                currentata = $("#DropDownEstabilishedSupports").find("option:selected").text().trim().toLowerCase();
                break;
            }
        }
        if (rowExists && currentata != EstablishedSupports.trim().toLowerCase()) {
            showErrorMessage("option already exist in table");
            return;

        }
        else {
            var data1 = [
                CreateChildBtnWithPermission("EditEstabilishedSupports", "DeleteEstabilishedSupports"),
                // selectedText.trim(),
                $("#DropDownEstabilishedSupports").val(),
                $("#DropDownEstabilishedSupports option:selected").text(),
                $("#TextBoxEsAgency").val(),
                $("#TextBoxEsContact").val(),
                $("#TextBoxEsPhone").val(),
                $("#TextBoxEsEmail").val(),
                $("#TextBoxGeneraInfoEstabilishedSupportsId").val(),
            ];
            table.row(currentRowEstabilishedSupports).data(data1).draw(false);
            $("#AddEstabilishedSupports").removeAttr("onclick");
            $("#AddEstabilishedSupports").removeClass("editRow");
            showRecordSaved("Estabilished Supports edited successfully.");
            clearEstabilishedSupports();
        }
    }
}
function EditExistingRowFamilyMembers() {
    if ($("#AddMemberOfFamilyConstellation").text() == 'Edit') {
        $("#AddMemberOfFamilyConstellation").text('Add');
    };
    var table = $('#MembersFamilyConstellation').DataTable();
    var currentata = "";
    var memberInHome = '';

    if ($("input[name=RadioFamilyMemberInHome]:checked").val() == 1) {
        memberInHome = 'Yes'
    }
    if ($("input[name=RadioFamilyMemberInHome]:checked").val() == 0) {
        memberInHome = 'No'
    };
    if (dataTableFamilyMembersFlg) {
        var rowExists = false;
        var valueCol = $('#MembersFamilyConstellation').DataTable().column(1).data();
        var index = valueCol.length;
        
        var rowCount = $('#MembersFamilyConstellation tr').length;
        if (rowCount > 8) {
            showErrorMessage(" Not allowed more than 8 records");
            return;

        }
        else {


            var data = {
                "Actions": CreateChildBtnWithPermission("EditFamilyMembers", "DeleteFamilyMembers"),

                "FamilyMemberName": $("#TextBoxFamilyMemberName").val(),
                "FamilyMemberAge": $("#TextBoxFamilyMemberAge").val(),
                "FamilyMemberRelation": $("#TextBoxFamilyMemberRelation").val(),
                "FamilyMemberInHome": memberInHome,
                "GeneralInfoFamilyMembersId": $("TextBoxGeneralInfoFamilyMembersId").val() == undefined ? '' : $("TextBoxGeneralInfoFamilyMembersId").val(),

            };
            table.row(currentRowFamilyMembers).data(data).draw(false);
            $("#AddMemberOfFamilyConstellation").removeAttr("onclick");
            $("#AddMemberOfFamilyConstellation").removeClass("editRow");
            showRecordSaved("Family member edited successfully.");
            clearFamilyMembersFields();
        }
    }
    else {
        var rowExists = false;
        var valueCol = $('#MembersFamilyConstellation').DataTable().column(1).data();
        var index = valueCol.length;
        //for (var k = 0; k < index; k++) {
        //    if (valueCol[k].toLowerCase().includes($("#DropDownNotificationType").find("option:selected").text().trim().toLowerCase())) {
        //        rowExists = true;
        //        currentata = $("#DropDownNotificationType").find("option:selected").text().trim().toLowerCase();
        //        break;
        //    }
        //}
        var rowCount = $('#MembersFamilyConstellation tr').length;
        if (rowCount > 8) {
            showErrorMessage(" Not allowed more than 8 records");
            return;

        }
        else {
            var data1 = [
                CreateChildBtnWithPermission("EditFamilyMembers", "DeleteFamilyMembers"),

                $("#TextBoxFamilyMemberName").val(),
                $("#TextBoxFamilyMemberAge").val(),
                $("#TextBoxFamilyMemberRelation").val(),
                memberInHome,
                $("TextBoxGeneralInfoFamilyMembersId").val() == undefined ? '' : $("TextBoxGeneralInfoFamilyMembersId").val(),

            ];
            table.row(currentRowFamilyMembers).data(data1).draw(false);
            $("#AddMemberOfFamilyConstellation").removeAttr("onclick");
            $("#AddMemberOfFamilyConstellation").removeClass("editRow");
            showRecordSaved("Family member edited successfully.");
            clearFamilyMembersFields();
        }
    }
}
function BindClientDropDowns() {
 
    $.ajax({
        type: "GET",
        url: Cx360URL + '/api/Incident/GetClientDetails',
        headers: {
            'TOKEN': token
        },
        success: function (result) {
            BindDropDownIndividualName(result);

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function BindDropDownIndividualName(result) {
    $.each(result, function (data, value) {
        $("#DropDownClientId").append($("<option></option>").val(value.ClientID).html(value.LastName + "," + " " + value.FirstName));
    });
    $("#DropDownClientId").attr("josn", JSON.stringify(result))

    $("#DropDownClientId").attr("onchange", "FillClientDetails(this)");
    $("#DropDownClientId").attr("disabled", true);

    clientId = GetParameterValues('ClientId');
    if (clientId != undefined) {
        $("select[id$=DropDownClientId]").val(clientId);



        var jsonObject = $("select[id$=DropDownClientId]").attr("josn");
        var parse = jQuery.parseJSON(jsonObject);
        var res = $.grep(parse, function (IndividualName) {
            return IndividualName.ClientID == clientId;
        });
        var DBO = (res[0].BirthDate);
        if (DBO != null) {
            DBO = DBO.slice(0, 10).split('-');
            DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
        }


        var EnrollmentDate = (res[0]["Enrollment Date"]);
        if (EnrollmentDate != null) {
            EnrollmentDate = EnrollmentDate.slice(0, 10).split('-');
            EnrollmentDate = EnrollmentDate[1] + '/' + EnrollmentDate[2] + '/' + EnrollmentDate[0];
        }

        //var phone = (res[0].Phone);
        //phone = phone, formatted = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4)
        $("#TextBoxFirstname").val(res[0].FirstName)
        $("#TextBoxHRAClientFirstName").val(res[0].FirstName)
        $("#TextBoxAddendumClientFirstName").val(res[0].FirstName)
        $("#TextBoxDCFSYouthName").val(res[0].LastName+' ,'+res[0].FirstName)

        $("#TextBoxLastname").val(res[0].LastName)
        $("#TextBoxHRAClientLastName").val(res[0].LastName)
        $("#TextBoxAddendumClientLastName").val(res[0].LastName)
        $("#TextBoxDateofbirth").val(DBO)
        $("#TextBoxClientDateOfBirth").val(DBO)
        $("#TextBoxAddress").val(res[0].Address1 + ' ' + res[0].Address2)
        // $("#TextBoxMemberAddress2").val(res[0].Address2)
        $("#TextBoxCity").val(res[0].City)
        $("#TextBoxState").val(res[0].State)
        $("#TextBoxZipCode").val(res[0].ZipCode)
        $("#TextBoxGender").val(res[0].Gender)
        $("#TextBoxClientGender").val(res[0].Gender)
        //$("#TextBoxPhone").val(res[0].Phone)
        $('#TextBoxPhone').val(formatPhoneNumberClient(res[0].Phone));
        $("#TextBoxMedicaid").val(res[0]["Medicaid Number"])
        $("#TextBoxMedicare").val(res[0]["Medicare Number"])
        $("#TextBoxEnrollmentDate").val(EnrollmentDate)//.val(res[0]["Enrollment Date"])
        $("#TextBoxWillowbrookMember").val(res[0].WillowBrook);
        $("#TextBoxEthnicity").val(res[0].Ethnicity);
        $("#TextBoxRace").val(res[0].Race);
        if (res[0].Race == "Other") {
            $('.RaceOtherDescription').removeAttr('hidden');
            $('.RaceOtherDescription').show();
        }
        $("#TextBoxMaritalStatus").val(res[0].MaritalStatus);

    }

}
function FillClientDetails(object) {
    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownClientId").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    var res = $.grep(parse, function (IndividualNmae) {
        return IndividualNmae.ClientID == selectedValue;
    });
    var DBO = (res[0].BirthDate);
    if (DBO != null) {

        DBO = DBO.slice(0, 10).split('-');
        DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
    }
    //var EnrollmentDate = (res[0]["Enrollment Date"]);
    //if (EnrollmentDate != null) {
    //    EnrollmentDate = EnrollmentDate.slice(0, 10).split('-');
    //    EnrollmentDate = EnrollmentDate[1] + '/' + EnrollmentDate[2] + '/' + EnrollmentDate[0];
    //}



    //var phone = (res[0].Phone);
    //phone = phone, formatted = phone.substr(0, 3) + '-' + phone.substr(3, 3) + '-' + phone.substr(6, 4)
    $("#TextBoxFirstname").val(res[0].FirstName)
    $("#TextBoxLastname").val(res[0].LastName)
    $("#TextBoxDateofbirth").val(DBO)//.val(res[0].BirthDate)
    $("#TextBoxAddress").val(res[0].Address1 + ' ' + res[0].Address2)
    // $("#TextBoxMemberAddress2").val(res[0].Address2)
    $("#TextBoxCity").val(res[0].City)
    $("#TextBoxState").val(res[0].State)
    $("#TextBoxZipCode").val(res[0].ZipCode)
    //$("#TextBoxPhone").val(res[0].Phone)
    $('#TextBoxPhone').val(formatPhoneNumberClient(res[0].Phone));
    //$("#TextBoxMedicaid").val(res[0].MedicaidNumber)
    //$("#TextBoxMedicare").val(res[0].MedicareNumber)
    //$("#TextBoxEnrollmentDate").val(EnrollmentDate)//.val(res[0]["Enrollment Date"])
    //$("#TextBoxWillowbrookMember").val(res[0].WillowBrook)

}
function InsertModifyGeneralInformation() {
    if ($("#BtnGeneralInformationOk").text() == "Edit") {
        $('.generalForm .form-control').attr("disabled", false);
        $('.generalForm  input[type=radio]').prop("disabled", false);
      
        $("#BtnGeneralInformationOk").text("Ok");
        return;
    }

    var json = [],
        jsonChildFirst = [],
        jsonChildSecond = [],
        item = {},
        tag;
    blankGeneralInformationID = $("#TextBoxGeneralInformationId").val();
    if (!ValidateGeneralInformation()) return;
    $('.generalForm .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithDiffCheckBox(tag, this);
            }

        }
    });
    json.push(item)

    var oTable = $("#MembersFamilyConstellation").DataTable().rows().data();
    $.each(oTable, function (index, value) {
        var itemBodyFirst = {};
        itemBodyFirst["FamilyMemberName"] = value[1] == undefined ? value.FamilyMemberName : value[1];
        itemBodyFirst["FamilyMemberAge"] = value[2] == undefined ? value.FamilyMemberAge : value[2];
        itemBodyFirst["FamilyMemberRelation"] = value[3] == undefined ? value.FamilyMemberRelation : value[3];
        itemBodyFirst["FamilyMemberInHome"] = value[4] == undefined ? value.FamilyMemberRelation = 'Yes' ? 1 : 0 : value[4] == 'Yes' ? 1 : 0;
        itemBodyFirst["GeneralInfoFamilyMembersId"] = value[5] == undefined ? value.GeneralInfoFamilyMembersId : value[5];
        jsonChildFirst.push(itemBodyFirst);
    });

    var oTable1 = $("#establishedSupports").DataTable().rows().data();
    $.each(oTable1, function (index, value) {
        itemBodySecond = {};
        itemBodySecond["GeneraInfoEstabilishedSupportsId"] = value[7] == undefined ? value.GeneraInfoEstabilishedSupportsId : value[7];
        itemBodySecond["EstabilishedSupportsType"] = value[1] == undefined ? value.EstabilishedSupportsType : value[1];
        itemBodySecond["EstabilishedSupports"] = value[2] == undefined ? value.EstabilishedSupports : value[2];
        itemBodySecond["EsAgency"] = value[3] == undefined ? value.EsAgency : value[3];
        itemBodySecond["EsContact"] = value[4] == undefined ? value.EsContact : value[4];
        itemBodySecond["EsPhone"] = value[5] == undefined ? value.EsPhone : value[5];
        itemBodySecond["EsEmail"] = value[6] == undefined ? value.EsEmail : value[6];

        jsonChildSecond.push(itemBodySecond);
    });

    $.ajax({
        type: "POST",
        data: { TabName: "GeneralInformation", Json: JSON.stringify(json), JsonChildFirstTable: JSON.stringify(jsonChildFirst), JsonChildSecondTable: JSON.stringify(jsonChildSecond), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLCANSDETAIL"),
        headers: { 'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5" },
        success: function (result) {
            GeneralInformationSectionSaved(result)

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function GeneralInformationSectionSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.CommonCANSRsponse[0].ValidatedRecord == false) {
            showErrorMessage("Comprehensvie Assessment already exists in Draft for client");
            return;
        }
        else {
            if (result.CommonCANSRsponse[0].GeneralInformationID > -1) {
                showRecordSaved("Record saved successfully");
                $("#TextBoxGeneralInformationId").val(result.CommonCANSRsponse[0].GeneralInformationID);
                $("#TextBoxCansVersioningID").val(result.CommonCANSRsponse[0].CansVersioningID);
                $("#labelCansStatus").text(result.CommonCANSRsponse[0].DocumentStatus);
                $("#labelDocumentVersion").text(result.CommonCANSRsponse[0].DocumentVersion);
                $(".btnDisable").prop("disabled", false);
                $(".btnNoStatus").prop("disabled", false);
                
                $("#btnSaveAsNew").addClass("hidden");
                $("#btnPublishVersion").show();
                $("#btnPrintPDf").show();
                BindGeneralInformationFamilyMembers(result.CommonCANSRsponse[0].JSONChildFirstData);
                BindGeneralInformationEstabilsihedSupports(result.CommonCANSRsponse[0].JSONChildSecondData);
                $('.generalForm .form-control').prop("disabled", true);
                if ($("#BtnGeneralInformationOk").text() == 'Ok') {
                    $("#BtnGeneralInformationOk").text('Edit');
                }
                changeCANSURL(result.CommonCANSRsponse[0].GeneralInformationID, result.CommonCANSRsponse[0].CansVersioningID);
            }
        }
     
    }
    else {

        showErrorMessage(result.Message);
    }
}
function changeCANSURL(generalinformationid, cansversioningid) {
    if (blankGeneralInformationID < 1) {
        var currentURL = window.location.href.split('?')[0];
        var newURL = currentURL + "?GeneralInformationID=" + generalinformationid + "&CansVersioningID=" + cansversioningid;
        history.pushState(null, 'CANS Template', newURL);
        generalInformationID = generalinformationid;
        cansVersioningID = cansversioningid;
    }
}
//#endregion
//#region section5 
function AddPriorAbuseTreatment() {
    $("#AddPriorSubstanceAbuseTreatment").on("click", function () {
        if (!$("#AddPriorSubstanceAbuseTreatment").hasClass("editRow")) {
            if ($("#TextBoxSubabusehistwhen").val() == '' && $("#TextBoxSubabusehistwhere").val() == '' && $("#TextBoxSubabusehistwithwhom").val() == '' && $("#TextBoxSubabusehistwithwhom").val() == '') {
                showErrorMessage(" select atleast one field.");
                return;
            }

            if (dataTableSubstanceAbuseTreatmentFlg) {
                newRow = $('#PriorSubstanceAbuseTreatment').DataTable();
                var rowExists = false;
                var valueCol = $('#PriorSubstanceAbuseTreatment').DataTable().column(1).data();
                var index = valueCol.length;
              
                var rowCount = $('#PriorSubstanceAbuseTreatment tr').length;
                if (rowCount > 3) {
                    showErrorMessage(" Not allowed more than 3 records");
                    return;

                }
                else {
                var text = [{
                    "Actions": CreateChildBtnWithPermission("EditPriorSubstanceAbuseTreatment", "DeleteEditPriorSubstanceAbuseTreatment"), 

                    "Subabusehistwhen": $("#TextBoxSubabusehistwhen").val(),
                    "Subabusehistwhere": $("#TextBoxSubabusehistwhere").val(),
                    "Subabusehistwithwhom": $("#TextBoxSubabusehistwithwhom").val(),
                    "Subabusehistreason": $("#TextBoxSubabusehistreason").val(),
                    "SubstanceAbuseTreatmentID": $("#TextBoxSubstanceAbuseTreatmentID").val() == undefined ? '' : $("#TextBoxSubstanceAbuseTreatmentID").val(),

                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw(false);
                showRecordSaved("Prior Substance Abuse Treatment added successfully.");

                clearPriorSubstanceAbuseTreatment();
                }

            }
            else {
                var rowExists = false;
                newRow = $('#PriorSubstanceAbuseTreatment').DataTable();
                var valueCol = $('#PriorSubstanceAbuseTreatment').DataTable().column(1).data();
                var index = valueCol.length;
             
                var rowCount = $('#PriorSubstanceAbuseTreatment tr').length;
                if (rowCount > 3) {
                    showErrorMessage("Not allowed more than 3 records");
                    return;
                }
                //else {
                newRow.row.add([
                    CreateChildBtnWithPermission("EditPriorSubstanceAbuseTreatment", "DeleteEditPriorSubstanceAbuseTreatment"),
                    //  selectedText.trim(),
                    $("#TextBoxSubabusehistwhen").val(),
                    $("#TextBoxSubabusehistwhere").val(),
                    $("#TextBoxSubabusehistwithwhom").val(),
                    $("#TextBoxSubabusehistreason").val(),
                    $("#TextBoxSubstanceAbuseTreatmentID").val() == undefined ? '' : $("#TextBoxSubstanceAbuseTreatmentID").val(),
                ]).draw(false);
                showRecordSaved("Prior Substance Abuse Treatment added successfully.");

                clearPriorSubstanceAbuseTreatment();
                //  }

            }

        }

    });

}
function EditPriorSubstanceAbuseTreatment(object) {
    var table = $('#PriorSubstanceAbuseTreatment').DataTable();
    currentRowSubstanceAbuseTreatment = $(object).parents("tr");
    var SubstanceAbuseTreatmentID = table.row(currentRowSubstanceAbuseTreatment).data()[5] == undefined ? table.row(currentRowSubstanceAbuseTreatment).data().SubstanceAbuseTreatmentID : table.row(currentRowSubstanceAbuseTreatment).data()[5];
    var Subabusehistwhen = table.row(currentRowSubstanceAbuseTreatment).data()[1] == undefined ? table.row(currentRowSubstanceAbuseTreatment).data().Subabusehistwhen : table.row(currentRowSubstanceAbuseTreatment).data()[1];
    var Subabusehistwhere = table.row(currentRowSubstanceAbuseTreatment).data()[2] == undefined ? table.row(currentRowSubstanceAbuseTreatment).data().Subabusehistwhere : table.row(currentRowSubstanceAbuseTreatment).data()[2];
    var Subabusehistwithwhom = table.row(currentRowSubstanceAbuseTreatment).data()[3] == undefined ? table.row(currentRowSubstanceAbuseTreatment).data().Subabusehistwithwhom : table.row(currentRowSubstanceAbuseTreatment).data()[3];
    var Subabusehistreason = table.row(currentRowSubstanceAbuseTreatment).data()[4] == undefined ? table.row(currentRowSubstanceAbuseTreatment).data().Subabusehistreason : table.row(currentRowSubstanceAbuseTreatment).data()[4];

    $("#TextBoxSubstanceAbuseTreatmentID").val(SubstanceAbuseTreatmentID);
    //$("#DropDownEstabilishedSupports").text(EstablishedSupports);
    $("#TextBoxSubabusehistwhen").val(Subabusehistwhen);
    $("#TextBoxSubabusehistwhere").val(Subabusehistwhere);
    $("#TextBoxSubabusehistwithwhom").val(Subabusehistwithwhom);
    $("#TextBoxSubabusehistreason").val(Subabusehistreason);
    $("#AddPriorSubstanceAbuseTreatment").attr("onclick", "EditExistingRowSubstanceAbuseTreatment();return false;");
    $("#AddPriorSubstanceAbuseTreatment").addClass("editRow");
    $("#AddPriorSubstanceAbuseTreatment").text("Edit");

    return false;
}
function DeleteEditPriorSubstanceAbuseTreatment(object) {
    var table = $('#PriorSubstanceAbuseTreatment').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddPriorSubstanceAbuseTreatment").attr("onclick") != undefined) {
        $("#AddPriorSubstanceAbuseTreatment").removeAttr("onclick");
        $("#AddPriorSubstanceAbuseTreatment").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRowSubstanceAbuseTreatment() {
    if ($("#AddPriorSubstanceAbuseTreatment").text() == 'Edit') {
        $("#AddPriorSubstanceAbuseTreatment").text('Add');
    };
    var table = $('#PriorSubstanceAbuseTreatment').DataTable();
    var currentata = "";
    if (dataTableSubstanceAbuseTreatmentFlg) {
        var rowExists = false;
        var valueCol = $('#PriorSubstanceAbuseTreatment').DataTable().column(2).data();
        var index = valueCol.length;
     
        if (rowExists) {
            showErrorMessage("option already exist in table");
            return;
        }
        else {
            var data = {
                "Actions": CreateChildBtnWithPermission("EditPriorSubstanceAbuseTreatment", "DeleteEditPriorSubstanceAbuseTreatment"), 

                "Subabusehistwhen": $("#TextBoxSubabusehistwhen").val(),
                "Subabusehistwhere": $("#TextBoxSubabusehistwhere").val(),
                "Subabusehistwithwhom": $("#TextBoxSubabusehistwithwhom").val(),
                "Subabusehistreason": $("#TextBoxSubabusehistreason").val(),
                "SubstanceAbuseTreatmentID": $("#TextBoxSubstanceAbuseTreatmentID").val() == undefined ? '' : $("#TextBoxSubstanceAbuseTreatmentID").val(),
            };
            table.row(currentRowSubstanceAbuseTreatment).data(data).draw(false);
            $("#AddPriorSubstanceAbuseTreatment").removeAttr("onclick");
            $("#AddPriorSubstanceAbuseTreatment").removeClass("editRow");
            showRecordSaved("Prior Substance Abuse Treatment edited successfully.");
            clearPriorSubstanceAbuseTreatment();
        }
    }
    else {
        var rowExists = false;
        var valueCol = $('#PriorSubstanceAbuseTreatment').DataTable().column(1).data();
        var index = valueCol.length;
        var data1 = [
            CreateChildBtnWithPermission("EditPriorSubstanceAbuseTreatment", "DeleteEditPriorSubstanceAbuseTreatment"), 
            //  selectedText.trim(),
            $("#TextBoxSubabusehistwhen").val(),
            $("#TextBoxSubabusehistwhere").val(),
            $("#TextBoxSubabusehistwithwhom").val(),
            $("#TextBoxSubabusehistreason").val(),
            $("#TextBoxSubstanceAbuseTreatmentID").val() == undefined ? '' : $("#TextBoxSubstanceAbuseTreatmentID").val(),
        ];
        table.row(currentRowSubstanceAbuseTreatment).data(data1).draw(false);
        $("#AddPriorSubstanceAbuseTreatment").removeAttr("onclick");
        $("#AddPriorSubstanceAbuseTreatment").removeClass("editRow");
        showRecordSaved("Prior Substance Abuse Treatment edited successfully.");
        clearPriorSubstanceAbuseTreatment();
        //}
    }
}
//#endregion

//#region section 7 psychatric infromation
function EditExistingRowPsychiatricallyHospitalized() {

    if ($("#TextBoxPsychHospitalName").val() == '' && $("#TextBoxPsychHospitalLocation").val() == '' && $("#TextBoxPsychHospitalizationDate").val() == '' && $("#TextBoxReasonHospitalizedPsych").val() == '') {
        showErrorMessage(" select atleast one field.");
        return;
    }
    if ($("#AddPsychiatricallyHospitalized").text() == 'Edit') {
        $("#AddPsychiatricallyHospitalized").text('Add');
    };
    var table = $('#PsychiatricallyHospitalized').DataTable();
    var currentata = "";
    if (dataTablePsychiatricallyHospitalizedFlg) {
        var rowExists = false;
        var valueCol = $('#PsychiatricallyHospitalized').DataTable().column(2).data();

        var data = {
            "Actions": CreateChildBtnWithPermission("EditPriorOutpatientMentalHealthServices", "DeleteEditPriorOutpatientMentalHealthServices"),  

            "PsychHospitalName": $("#TextBoxPsychHospitalName").val(),
            "PsychHospitalLocation": $("#TextBoxPsychHospitalLocation").val(),
            "PsychHospitalizationDate": $("#TextBoxPsychHospitalizationDate").val(),
            "ReasonHospitalizedPsych": $("#TextBoxReasonHospitalizedPsych").val(),
            "MedicalHistoryPsychHospitalID": $("#TextBoxMedicalHistoryPsychHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryPsychHospitalID").val(),
        };
        table.row(currentRowPsychiatricallyHospitalized).data(data).draw(false);
        $("#AddPsychiatricallyHospitalized").removeAttr("onclick");
        $("#AddPsychiatricallyHospitalized").removeClass("editRow");
        showRecordSaved("Psychiatrically Hospitalized edited successfully.");
        ClearFieldsValue('PsychiatricallyHospitalized');

    }
    else {
        var rowExists = false;
        var valueCol = $('#PsychiatricallyHospitalized').DataTable().column(1).data();
        var index = valueCol.length;

        var data1 = [
            CreateChildBtnWithPermission("EditPriorOutpatientMentalHealthServices", "DeleteEditPriorOutpatientMentalHealthServices"), 
            //  selectedText.trim(),
            $("#TextBoxPsychHospitalName").val(),
            $("#TextBoxPsychHospitalLocation").val(),
            $("#TextBoxPsychHospitalizationDate").val(),
            $("#TextBoxReasonHospitalizedPsych").val(),
            $("#TextBoxMedicalHistoryPsychHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryPsychHospitalID").val(),
        ];
        table.row(currentRowPsychiatricallyHospitalized).data(data1).draw(false);
        $("#AddPsychiatricallyHospitalized").removeAttr("onclick");
        $("#AddPsychiatricallyHospitalized").removeClass("editRow");
        showRecordSaved("Psychiatrically Hospitalized edited successfully.");
        ClearFieldsValue('PsychiatricallyHospitalized');
        //}
    }
}
function EditPsychiatricallyHospitalized(object) {
    var table = $('#PsychiatricallyHospitalized').DataTable();
    currentRowPsychiatricallyHospitalized = $(object).parents("tr");
    var MedicalHistoryPsychHospitalID = table.row(currentRowPsychiatricallyHospitalized).data()[5] == undefined ? table.row(currentRowPsychiatricallyHospitalized).data().MedicalHistoryPsychHospitalID : table.row(currentRowPsychiatricallyHospitalized).data()[5];
    var PsychHospitalName = table.row(currentRowPsychiatricallyHospitalized).data()[1] == undefined ? table.row(currentRowPsychiatricallyHospitalized).data().PsychHospitalName : table.row(currentRowPsychiatricallyHospitalized).data()[1];
    var PsychHospitalLocation = table.row(currentRowPsychiatricallyHospitalized).data()[2] == undefined ? table.row(currentRowPsychiatricallyHospitalized).data().PsychHospitalLocation : table.row(currentRowPsychiatricallyHospitalized).data()[2];
    var PsychHospitalizationDate = table.row(currentRowPsychiatricallyHospitalized).data()[3] == undefined ? table.row(currentRowPsychiatricallyHospitalized).data().PsychHospitalizationDate : table.row(currentRowPsychiatricallyHospitalized).data()[3];
    var ReasonHospitalizedPsych = table.row(currentRowPsychiatricallyHospitalized).data()[4] == undefined ? table.row(currentRowPsychiatricallyHospitalized).data().ReasonHospitalizedPsych : table.row(currentRowPsychiatricallyHospitalized).data()[4];

    $("#TextBoxMedicalHistoryPsychHospitalID").val(MedicalHistoryPsychHospitalID);
    //$("#DropDownEstabilishedSupports").text(EstablishedSupports);
    $("#TextBoxPsychHospitalName").val(PsychHospitalName);
    $("#TextBoxPsychHospitalLocation").val(PsychHospitalLocation);
    $("#TextBoxPsychHospitalizationDate").val(PsychHospitalizationDate);
    $("#TextBoxReasonHospitalizedPsych").val(ReasonHospitalizedPsych);
    $("#AddPsychiatricallyHospitalized").attr("onclick", "EditExistingRowPsychiatricallyHospitalized();return false;");
    $("#AddPsychiatricallyHospitalized").addClass("editRow");
    $("#AddPsychiatricallyHospitalized").text("Edit");

    return false;
}
function DeleteEditPsychiatricallyHospitalized(object) {
    var table = $('#PsychiatricallyHospitalized').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddPsychiatricallyHospitalized").attr("onclick") != undefined) {
        $("#AddPsychiatricallyHospitalized").removeAttr("onclick");
        $("#AddPsychiatricallyHospitalized").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
//#endregion
//#region section 11 diagnosis codes
function BindCansDiagnosiscodes() {
    $.ajax({
        type: "GET",
        data: { "FormName": "Diagnosis Codes", "Criteria": "1=1" },
        url: 'https://staging-api.cx360.net/api/Common/GetList',
        headers: {
            'TOKEN': _token
        },
        success: function (result) {
            BindCansDiagnosisOptions(result, "#DropDownDiagnosticCode", "DiagnosisID", "DiagnosisCode");

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function BindCansDiagnosisOptions(json, id, val, options) {
    $.each(json, function (data, value) {
        $(id).append($("<option></option>").val(value[val]).html(value[options]));
    });

    $(id).attr("josn", JSON.stringify(json))
    $(id).attr("onchange", "FillDiagnosisCodes(this)")
}
function FillDiagnosisCodes(object) {
    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownDiagnosticCode").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    var res = $.grep(parse, function (code) {
        return code.DiagnosisID == selectedValue;
    });
    if (res[0] == undefined) {
        $("#TextBoxDSM5Name").val('');
        $("#TextBoxICD10Name").val('');
    }
    else {
        $("#TextBoxDSM5Name").val(res[0].DiagnosisDescription);
        $("#TextBoxICD10Name").val(res[0].ICDDescription);
    }
   
}
function AddDiagnosisCode() {
    $("#AddDiagnosis").on("click", function () {
        var RadioDiagnosis = '';
        RadioDiagnosis = $('input[name=RadioDiagnosis]:checked').val();
        if (RadioDiagnosis == 'on') {
            RadioDiagnosis = 'Yes';
        }
        else if (RadioDiagnosis == undefined) {
            RadioDiagnosis = 'No';
        }
        else {
            RadioDiagnosis = '';
        }
        if (!$("#AddDiagnosis").hasClass("editRow")) {
            if ($("#DropDownDiagnosticCode").val() <= 0) { showErrorMessage("Please select diagnosis code"); return; } 
            if (dataTableDiagnosisFlg) {
                newRow = $('#diagnosis').DataTable();
                var rowExists = false;
                var valueCol = $('#diagnosis').DataTable().column(1).data();
                var index = valueCol.length;
              
                var rowCount = $('#diagnosis tr').length;
               
                var text = [{
                    "Actions": '<a href="#" onclick="EditDsmDiagnosis(this);event.preventDefault();">Edit</a> <span><a href="#" onclick="DeleteEditDsmDiagnosis(this);event.preventDefault();">Delete</a><span>',

                    "DiagnosisCode": $("#DropDownDiagnosticCode option:selected").val() == undefined ? '' : $("#DropDownDiagnosticCode option:selected").val(),
                    "DiagnosticCodeDescription":$("#DropDownDiagnosticCode").select2('data')[0]['text'],
                    "ICD5Name": $("#TextBoxDSM5Name").val(),
                    "ICD10Name": $("#TextBoxICD10Name").val(),
                    "Diagnosis": RadioDiagnosis,
                    "DsmDiagnosisID":"",
                }];
                var stringyfy = JSON.stringify(text);
                var data = JSON.parse(stringyfy);
                newRow.rows.add(data).draw(false);
                showRecordSaved("Diagnosis added successfully.");

                clearDiagnosis();
               

            }
            else {
                if ($("#DropDownDiagnosticCode").val() <= 0) { showErrorMessage("Please select diagnosis code"); return; } 

                var rowExists = false;
                newRow = $('#diagnosis').DataTable();
                var valueCol = $('#diagnosis').DataTable().column(1).data();
                var index = valueCol.length;
               
                var rowCount = $('#diagnosis tr').length;
                
                newRow.row.add([
                    '<a href="#" onclick="EditDsmDiagnosis(this);event.preventDefault();">Edit</a> <span><a href="#" onclick="DeleteEditDsmDiagnosis(this);event.preventDefault();">Delete</a><span>',
                    $("#DropDownDiagnosticCode option:selected").val() == undefined ? '' : $("#DropDownDiagnosticCode option:selected").val(),
                    $("#DropDownDiagnosticCode").select2('data')[0]['text'],
                    $("#TextBoxDSM5Name").val(),
                    $("#TextBoxICD10Name").val(),
                    RadioDiagnosis,
                    "",
                ]).draw(false);
                showRecordSaved("Diagnosis added successfully.");

                clearDiagnosis();
               

            }

        }

    });
}
function EditDsmDiagnosis(object) {
    var table = $('#diagnosis').DataTable();
    currentRowDiagnosis = $(object).parents("tr");
    var DsmDiagnosisID = table.row(currentRowDiagnosis).data()[6] == undefined ? table.row(currentRowDiagnosis).data().DsmDiagnosisID : table.row(currentRowDiagnosis).data()[6];
    var DiagnosticCode = table.row(currentRowDiagnosis).data()[1] == undefined ? table.row(currentRowDiagnosis).data().DiagnosisCode : table.row(currentRowDiagnosis).data()[1];
    var DSM5Name = table.row(currentRowDiagnosis).data()[3] == undefined ? table.row(currentRowDiagnosis).data().ICD5Name : table.row(currentRowDiagnosis).data()[3];
    var ICD10Name = table.row(currentRowDiagnosis).data()[4] == undefined ? table.row(currentRowDiagnosis).data().ICD10Name : table.row(currentRowDiagnosis).data()[4];
    var Diagnosis = table.row(currentRowDiagnosis).data()[5] == undefined ? table.row(currentRowDiagnosis).data().Diagnosis : table.row(currentRowDiagnosis).data()[5];

    $("#TextBoxDsmDiagnosisID").val(DsmDiagnosisID);
    $("#DropDownDiagnosticCode").select2('val', [DiagnosticCode])
    $("#TextBoxDSM5Name").val(DSM5Name);
    $("#TextBoxICD10Name").val(ICD10Name);
   
    Diagnosis == 'Yes' ? $("input[name='RadioDiagnosis']").prop('checked', true) : $("input[name='RadioDiagnosis']").prop('checked', false);

    $("#AddDiagnosis").attr("onclick", "EditExistingRowDsmDiagnosis();return false;");
    $("#AddDiagnosis").addClass("editRow");
    $("#AddDiagnosis").text("Edit");

    return false;
}
function DeleteEditDsmDiagnosis(object) {
    var table = $('#diagnosis').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddDiagnosis").attr("onclick") != undefined) {
        $("#AddDiagnosis").removeAttr("onclick");
        $("#AddDiagnosis").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRowDsmDiagnosis() {
    if ($("#AddDiagnosis").text() == 'Edit') {
        $("#AddDiagnosis").text('Add');
    };
    var RadioDiagnosis = '';
    RadioDiagnosis = $('input[name=RadioDiagnosis]:checked').val();
    if (RadioDiagnosis == 'on') {
        RadioDiagnosis = 'Yes';
    }
    else if (RadioDiagnosis == undefined) {
        RadioDiagnosis = 'No';
    }
    else {
        RadioDiagnosis = '';
    }
    var table = $('#diagnosis').DataTable();
    var currentata = "";
    if (dataTableDiagnosisFlg) {
        if ($("#DropDownDiagnosticCode").val() <= 0) { showErrorMessage("Please select diagnosis code"); return; } 

        var rowExists = false;
        var valueCol = $('#diagnosis').DataTable().column(2).data();
        var index = valueCol.length;
        if (rowExists) {
            showErrorMessage("option already exist in table");
            return;
        }
        else {
            var data = {
                "Actions": '<a href="#" onclick="EditDsmDiagnosis(this);event.preventDefault();">Edit</a> <span><a href="#" onclick="DeleteEditDsmDiagnosis(this);event.preventDefault();">Delete</a><span>',

                "DiagnosisCode": $("#DropDownDiagnosticCode").val(),
                "DiagnosticCodeDescription": $("#DropDownDiagnosticCode").select2('data')[0]['text'],
                "ICD5Name": $("#TextBoxDSM5Name").val(),
                "ICD10Name": $("#TextBoxICD10Name").val(),
                "Diagnosis": RadioDiagnosis,
                "DsmDiagnosisID": $("#TextBoxDsmDiagnosisID").val() == undefined ? '' : $("#TextBoxDsmDiagnosisID").val(),
            };
            table.row(currentRowDiagnosis).data(data).draw(false);
            $("#AddDiagnosis").removeAttr("onclick");
            $("#AddDiagnosis").removeClass("editRow");
            showRecordSaved("Diagnosis edited successfully.");
            clearDiagnosis();
        }
    }
    else {
        if ($("#DropDownDiagnosticCode").val() <= 0) { showErrorMessage("Please select diagnosis code"); return; } 

        var rowExists = false;
        var valueCol = $('#diagnosis').DataTable().column(1).data();
        var index = valueCol.length;
        var data1 = [
            '<a href="#" onclick="EditDsmDiagnosis(this);event.preventDefault();">Edit</a> <span><a href="#" onclick="DeleteEditDsmDiagnosis(this);event.preventDefault();">Delete</a><span>',
            $("#DropDownDiagnosticCode").val(),
            $("#DropDownDiagnosticCode").select2('data')[0]['text'],
            $("#TextBoxDSM5Name").val(),
            $("#TextBoxICD10Name").val(),
            RadioDiagnosis,
            ""
        ];
        table.row(currentRowDiagnosis).data(data1).draw(false);
        $("#AddDiagnosis").removeAttr("onclick");
        $("#AddDiagnosis").removeClass("editRow");
        showRecordSaved("Diagnosis edited successfully.");
        clearDiagnosis();
        //}
    }
}
function clearDiagnosis() {
    $(".DsmDiagnosis select").val("");

    $(".DsmDiagnosis #DropDownDiagnosticCode").val(null).trigger('change');
    $(".DsmDiagnosis #TextBoxDSM5Name").val("");
    $(".DsmDiagnosis #TextBoxICD10Name").val("");

    $("input[name=RadioDiagnosis]").prop('checked', false);
}

//#endregion



//#region section 17 service intervantions
function ShowServiceInterventionModal() {
    $("#ServiceInterventionsModal").modal("show");
    $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "0");
}
function InsertModifyServiceInterventions() {
    var json = [];
    var item = GenerateJSONData("section17");

    json.push(item);
    commonAjaxRequest("ServiceInterventions", json, "ServiceInterventionsSaved()");
}

function ServiceInterventionsSaved() {
    $("#ServiceInterventionsModal").modal("hide");
    $(".section17 select").val("");
    $(".section17 input").val("");
    showRecordSaved("Record saved successfully.");
    $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "1");
    FillServiceInterventionTable(jsonResult.CommonCANSRsponse[0].JSONData)
}
function BindServiceObjectiveDropDown(result) {
    $("#DropDownGoalObjSvcNum").empty();

    $.each(result, function (data, value) {
        $("#DropDownGoalObjSvcNum").append($("<option></option>").val(value.CansTreatmentPlanObjctiveID).html(value.CansTreatmentPlanObjctive));
    });
    $("#DropDownGoalObjSvcNum").prepend("<option value='' selected='selected'>--Select--</option>");
}

function EditServiceInterventions(e, id) {
    $.ajax({
        type: "POST",
        data: { TabName: "selectById", GeneralInformationID: $("#TextBoxGeneralInformationID").val(), ServiceInterventionID: id, ReportedBy: reportedBy },
        url: GetAPIEndPoints("MANAGESERVICEINTERVENTIONS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                if (result.CommonCANSRsponse[0].JSONData.length > 0) {
                    result = JSON.parse(result.CommonCANSRsponse[0].JSONData);
                    $(".section17 #DropDownGoalObjSvcNum").val(result[0].GoalObjSvcNumID);
                    $(".section17 #DropDownServiceType").val(result[0].ServiceTypeID);
                    $(".section17 #DropDownServiceMode").val(result[0].ServiceModeID);
                    $(".section17 #DropDownServicePlace").val(result[0].ServicePlaceID);
                    $(".section17 #TextBoxServiceAmount").val(result[0].ServiceAmount);
                    $(".section17 #DropDownServiceFrequency").val(result[0].ServiceFrequency);
                    $(".section17 #DropDownServiceDuration").val(result[0].ServiceDuration);
                    $(".section17 #TextBoxAgencyAndStaffResponsible").val(result[0].AgencyAndStaffResponsible);
                    $(".section17 #TextBoxServiceIntervensionID").val(result[0].ServiceIntervensionID);
                }
                //$("#ServiceInterventionsModal").modal("show");
                e.preventDefault();
                $('#ServiceInterventionsModal').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
                $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "0");

            }   
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }

    });
}
function DeleteServiceInterventions(id) {
    
    $.ajax({
        type: "POST",
        data: { TabName: "deleteById", GeneralInformationID: $("#TextBoxGeneralInformationID").val(), ServiceInterventionID: id, ReportedBy: reportedBy},
        url: GetAPIEndPoints("MANAGESERVICEINTERVENTIONS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                FillServiceInterventionTable(result.CommonCANSRsponse[0].JSONData);
                showRecordSaved("Record Deleted.");
            }
            else {
                showErrorMessage(result.Message);
            }


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function FillServiceInterventionTable(result) {
    var table = $('#tableServicesIntervention').DataTable();
    table.clear();
    $('#tableServicesIntervention').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": true,
        "searching": false,
        "autoWidth": false,
        "aaData": JSON.parse(result),
        "columns": [{ "data": "GoalObjSvcNum" }, { "data": "ServiceType" }, { "data": "ServiceMode" }, { "data": "ServicePlace" },
        { "data": "ServiceDuration" }, { "data": "AgencyAndStaffResponsible" }, { "data": "Actions" }]
    });
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
    CheckBtnPermissionAfterSave();

}
//#endregion
//#region section 16 adding treatment plans 
function IsTreatmentPlanExists() {
    if ($('#tblTreatmentPlans').DataTable().data().any()) {
        showErrorMessage("treatment plan  already exists");
        return false;
    }
    return true;
}
function ShowTreatmentPlanModal() {
    if (!IsTreatmentPlanExists()) return;
    $("#ModalTreatmentPlans").modal("show");
    $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "0");
}
function EditTreatmentPlans(treatmentPlanId){
    $.ajax({
        type: "POST",
        data: { TabName: "EditTreatmentPlan", TreatmentPlanId: treatmentPlanId, ReportedBy: reportedBy },
        url: GetAPIEndPoints("GETTREATMENTPLANDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                 result = JSON.parse(result.CommonCANSRsponse[0].JSONData);
                $(".ModalTreatmentPlans #TextBoxCansTreatmentPlanId").val(result[0].CansTreatmentPlanId);
                $(".ModalTreatmentPlans #DropDownTreatmentPlan").val(result[0].TreatmentPlan);
                $(".ModalTreatmentPlans #TextBoxStartDate").val(result[0].StartDate);
                $('#ModalTreatmentPlans').modal({
                    show: true,
                    backdrop: 'static',
                    keyboard: true
                });
                $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "0");
            }
            else {
                showErrorMessage(result.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function AddTreatmentPlan() {
    if (!ValidateRequiredFields("ModalTreatmentPlans")) return;

    var json = [];
    var jsonItem = GenerateJSONData("ModalTreatmentPlans");
   
    json.push(jsonItem);
    $.ajax({
        type: "POST",
        data: { TabName: "TreatmentPlan", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYLCANSDETAIL"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {
                $(".ModalTreatmentPlans .form-control").val("");
                TreatmentPlanSaved(result);
            }
            else {
                showErrorMessage(result.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function TreatmentPlanSaved(result) {
   
        showRecordSaved("Treatment plan created successfully.");
    $("#ModalTreatmentPlans").modal("hide");
    $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "1");
    var jsonStringyfy = JSON.stringify(result.CommonCANSRsponse[0].JSONData) == "null" ? "{}" : JSON.stringify(result.CommonCANSRsponse[0].JSONData);
        $('#tblTreatmentPlans').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": true,
            "searching": true,
            "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONData),
            "aoColumns": [{ "mData": "Actions" }, { "mData": "StartDate" }, { "mData": "TreatmentPlan" }, { "mData": "CANSLink" },{ "mData": "CansTreatmentPlanGoalText" }]
        });
        jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
  
}
function ShowTreatmentPlans(TreatmentPlanId) {
    if (TreatmentPlanId <= 0) return;

    window.location.href = "../../TreatmentPlanDetail.html?TreatmentPlanId=" + TreatmentPlanId + "&GeneralInformationID=" + generalInformationID + "&CansVersioningID=" + cansVersioningID;
}
function CloneTreatmentPlan(TreatmentPlanId) {
    var data = CloneAndDeleteTreatmentGoals(TreatmentPlanId,"CloneTreatmentPlan");

}
function DeleteTreatmentPlanDetail(TreatmentPlanId) {
    var data = CloneAndDeleteTreatmentGoals(TreatmentPlanId,"DeleteTreatmentPlan");
}
function CloneAndDeleteTreatmentGoals(treatmentPlanId,tabName) {
    $.ajax({
        type: "POST",
        data: { TabName: tabName, TreatmentPlanId: treatmentPlanId, ReportedBy: reportedBy },
        url: GetAPIEndPoints("GETTREATMENTPLANDETAILS"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {

                CloneAndDeleteTreatmentGoalsResponse(result.CommonCANSRsponse[0].JSONData);
            }
            else {
                showErrorMessage(result.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function CloneAndDeleteTreatmentGoalsResponse(result) {
    result = JSON.parse(result);
    showRecordSaved("Recored deleted successfully.");
    //var jsonStringyfy = JSON.stringify(result) == "null" ? "{}" : JSON.stringify(result);
    $('#tblTreatmentPlans').DataTable().clear();
    $('#tblTreatmentPlans').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "aaData": result,
        "aoColumns": [{ "mData": "Actions" }, { "mData": "StartDate" }, { "mData": "TreatmentPlan" }, { "mData": "CANSLink" }, { "mData": "CansTreatmentPlanGoalText" }]
    });
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
}
function CloseTreatmentModal() {
    $("#DropDownTreatmentPlan").val("");
    $("#TextBoxStartDate").val("");
    $("#ModalTreatmentPlans").modal("hide");
    $(".bgStart, .bgProgress, .bgInprogress").css("opacity", "1");
}
//#endregion



//#region section 14 region summary needs and strength
function AddNeedsStrengthItems() {
    if (isEmpty($("#DropDownNeedsStrength").val())) {
        showErrorMessage("Please select the needs and strength section to add item.");
        return;
    }
    var lastid, split_id, nextindex, htmlTags;
    var selectedItem = $("#DropDownNeedsStrength").val();
    var selectdText = $("#DropDownNeedsStrength option:selected").text();
    if (selectedItem == "BackgroundTraumaExperiences") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "backgroundTraumaExperiences", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".backgroundTraumaExperiences").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "backgroundTraumaExperiences", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".backgroundTraumaExperiences").is(":visible")) {
            lastid = $(".backgroundTraumaExperiences:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "backgroundTraumaExperiences", selectdText);
            $(".backgroundTraumaExperiences .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "TreatmentTargetNeeds") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "treatmentTargetNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".treatmentTargetNeeds").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "treatmentTargetNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".treatmentTargetNeeds").is(":visible")) {
            lastid = $(".treatmentTargetNeeds:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "treatmentTargetNeeds", selectdText);
            $(".treatmentTargetNeeds .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "CenterpieceUsefulStrengths") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "centerpieceUsefulStrengths", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".centerpieceUsefulStrengths").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "centerpieceUsefulStrengths", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".centerpieceUsefulStrengths").is(":visible")) {
            lastid = $(".centerpieceUsefulStrengths:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "centerpieceUsefulStrengths");
            $(".centerpieceUsefulStrengths .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "ChildWelfareWorker") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "childWelfareWorker", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".childWelfareWorker").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "childWelfareWorker", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".childWelfareWorker").is(":visible")) {
            lastid = $(".childWelfareWorker:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "childWelfareWorker", selectdText);
            $(".childWelfareWorker .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "CaregiverResources") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "caregiverResources", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".caregiverResources").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "caregiverResources", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".caregiverResources").is(":visible")) {
            lastid = $(".caregiverResources:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "caregiverResources", selectdText);
            $(".caregiverResources .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "BackgroundOtherNeeds") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "backgroundOtherNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".backgroundOtherNeeds").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "backgroundOtherNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".backgroundOtherNeeds").is(":visible")) {
            lastid = $(".backgroundOtherNeeds:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "backgroundOtherNeeds", selectdText);
            $(".backgroundOtherNeeds .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "AnticipatedOutcomeNeeds") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "anticipatedOutcomeNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".anticipatedOutcomeNeeds").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "anticipatedOutcomeNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".anticipatedOutcomeNeeds").is(":visible")) {
            lastid = $(".anticipatedOutcomeNeeds:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "anticipatedOutcomeNeeds", selectdText);
            $(".anticipatedOutcomeNeeds .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "StrengthstoBuild") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "strengthstoBuild", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".strengthstoBuild").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "strengthstoBuild", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".strengthstoBuild").is(":visible")) {
            lastid = $(".strengthstoBuild:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "strengthstoBuild", selectdText);
            $(".strengthstoBuild .lastElement:last").after(htmlTags)
        }
    }
    else if (selectedItem == "CaregiverNeeds") {
        if (!$(".elements").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSection(selectedItem, nextindex, "caregiverNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);

        }
        else if ($(".elements").is(":visible") && !$(".caregiverNeeds").is(":visible")) {
            nextindex = 1;
            htmlTags = GetNeedsStrengthHTMLWithSectionHRLine(selectedItem, nextindex, "caregiverNeeds", selectdText);
            $(".summary_prioritzed_needs_strength_parent").append(htmlTags);
        }
        else if ($(".elements").is(":visible") && $(".caregiverNeeds").is(":visible")) {
            lastid = $(".caregiverNeeds:last").attr("name");
            split_id = lastid.split("_");
            nextindex = Number(split_id[1]) + 1;
            htmlTags = GetNeedsStrengthHTMLItems(selectedItem, nextindex, "caregiverNeeds", selectdText);
            $(".caregiverNeeds .lastElement:last").after(htmlTags)
        }
    }
}
function GetNeedsStrengthHTMLWithSection(strengthItemHeading, index, dynmaicClass, mainHeading) {
    var sectionHTMLBlockHeading = '<div class="' + dynmaicClass + ' elements">'
        + '<div class="col-sm-12"> <div class="sectionDescription"><h2>' + mainHeading + '</h2></div>'
        + GetNeedsStrengthHTMLItems(strengthItemHeading, index, dynmaicClass)
        + '</div>';
    return sectionHTMLBlockHeading;
}
function GetNeedsStrengthHTMLWithSectionHRLine(strengthItemHeading, index, dynmaicClass, mainHeading) {
    var sectionHTMLBlockHRLine = '<div class="col-md-12 col-sm-12"><hr /></div>'
        + '<div class="' + dynmaicClass + ' elements">'
        + '<div class="col-sm-12"> <div class="sectionDescription"><h2>' + mainHeading + '</h2></div>'
        + GetNeedsStrengthHTMLItems(strengthItemHeading, index, dynmaicClass)
        + '</div>';
    return sectionHTMLBlockHRLine;
}
function GetNeedsStrengthHTMLItems(strengthItemMainClass, index, dynmaicClass) {
    var sectionHTMLBlock = '<div class="col-md-6 col-sm-12"><label class="labelStrong">Item ' + index + '</label></div>'//create item label
        + '<div class="col-md-12 col-sm-12 lastElement"><div class="form-group icbField">'//create item input
        + '<textarea type = "text" class="form-control ' + dynmaicClass + ' item-text" id="TextBox' + strengthItemMainClass + "_" + index + '" name="' + strengthItemMainClass + "_" + index + '" ></textarea>'//create item input
        + '<ul><li><label class="checkboxField">'//create radio button Yes
        + 'Yes<input type="radio" name="Radio' + strengthItemMainClass + "_" + index + '" value="1" class="form-control ' + dynmaicClass + ' item-radio" />'//create radio button Yes
        + '<span class="checkmark"></span></label></li>'//create radio button Yes
        + '<li><label class="checkboxField">No<input type="radio"name="Radio' + strengthItemMainClass + "_" + index + '" value="0" class="form-control ' + dynmaicClass + ' item-radio" />'//create radio button No
        + '<span class="checkmark" ></span></label></li>'//create radio button No
        + '</ul></div></div>'//close parent div
    return sectionHTMLBlock;
}
function ValidateNeedsAndStrength() {
    if ($(".summary_prioritzed_needs_strength_parent").find(".form-control").val() == "".length && $(".summary_prioritzed_needs_strength_parent").find("input:radio:checked").length <= 0) {
        showErrorMessage("No item or radio button selected");
        return false;
    }
    if (!$(".elements").is(":visible")) {
        showErrorMessage("Add atleast one section item.");
        return false;
    }
    return true;
}
function SubmitNeedsAndStrength() {
    var json = [];
      
    $(".summary_prioritzed_needs_strength_parent .elements .icbField").each(function (index) {
       var  item = {};
        item["SectionName"] = $(this).parent().siblings().find("h2").text();
        var rowIndexList = $(this).find(".item-text").attr("id").split("_"),
            rowIndex = Number(rowIndexList[1]);
        item["RowIndex"] = rowIndex;
        item["ItemText"] = $(this).find(".item-text").val();
        var radioBtnValue = $(this).find(".item-radio:checked").length;
        item["ItemOption"] = radioBtnValue == 0 ? null : $(this).find(".item-radio:checked").val();
        var $currentElemClass = $(this).parent().closest(".elements");
        var indexOfClass = $currentElemClass.index(".elements");
        item["Position"] = indexOfClass;
        item["Status"] = sectionStatus;
        item["CansVersioningID"] = $("#TextBoxCansVersioningID").val();
        item["GeneralInformationID"] = $("#TextBoxGeneralInformationId").val();
        json.push(item);
    });
    commonAjaxRequest("SummaryPrioritzedNeedsStrength", json,"NeedsAndStrengthSaved()")
}
function NeedsAndStrengthSaved() {

    updateSectionStatus(JSON.parse(jsonResult.CommonCANSRsponse[0].JSONData)[0].Status, "section14")
    if ($("#btnSummaryNeedsAndStrength").text() == "Ok") {
        $("#btnSummaryNeedsAndStrength").text("Edit");
    }
    if (JSON.parse(jsonResult.CommonCANSRsponse[0].JSONData).length > 0) {
        $(".summary_prioritzed_needs_strength_parent").html("");
        CreateNeedsStrengthSectionsAfterSave(JSON.parse(jsonResult.CommonCANSRsponse[0].JSONData));
    }
    $('.section14 .form-control').prop("disabled", true);
    $('#btnNeedsStrengthItems').prop("disabled", true);
}
function CreateNeedsStrengthSectionsAfterSave(json) {
    var jsonSort = [];
    var filteredBackgroundTrauma = $.grep(json, function (n, i) {
        return n.SectionName === 'Background - Trauma Experiences';
    });
    if (filteredBackgroundTrauma.length > 0) {
        jsonSort.push(filteredBackgroundTrauma[0]);
    }
    var filteredTreatmentTarget = $.grep(json, function (n, i) {
        return n.SectionName === 'Treatment Target Needs';
    }); 
    if (filteredTreatmentTarget.length > 0) {
        jsonSort.push(filteredTreatmentTarget[0]);
    }
    var filteredCenterpieceStrengths = $.grep(json, function (n, i) {
        return n.SectionName === 'Centerpiece/Useful Strengths';
    }); 
    if (filteredCenterpieceStrengths.length > 0) {
        jsonSort.push(filteredCenterpieceStrengths[0]);
    }
    var filteredChildWelfare = $.grep(json, function (n, i) {
        return n.SectionName === 'Child Welfare Worker';
    });
    if (filteredChildWelfare.length > 0) {
        jsonSort.push(filteredChildWelfare[0]);
    }
    var filteredCaregiverResources = $.grep(json, function (n, i) {
        return n.SectionName === 'Caregiver Resources';
    }); 
    if (filteredCaregiverResources.length > 0) {
        jsonSort.push(filteredCaregiverResources[0]);
    }
    var filteredBackgroundOtheNeeds = $.grep(json, function (n, i) {
        return n.SectionName === 'Background - Other Needs';
    }); 
    if (filteredBackgroundOtheNeeds.length > 0) {
        jsonSort.push(filteredBackgroundOtheNeeds[0]);
    }
    var filteredAnticipatedOutcome= $.grep(json, function (n, i) {
        return n.SectionName === 'Anticipated Outcome Needs';
    }); 
    if (filteredAnticipatedOutcome.length > 0) {
        jsonSort.push(filteredAnticipatedOutcome[0]);
    }
    var filteredStrengthsBuild = $.grep(json, function (n, i) {
        return n.SectionName === 'Strengths to Build';
    }); 
    if (filteredStrengthsBuild.length > 0) {
        jsonSort.push(filteredStrengthsBuild[0]);
    }
    var filteredCaregiverNeeds = $.grep(json, function (n, i) {
        return n.SectionName === 'Caregiver Needs';
    }); 
    if (filteredCaregiverNeeds.length > 0) {
        jsonSort.push(filteredCaregiverNeeds[0]);
    }
    CreateSecionOnly(jsonSort, json);
}
function CreateSecionOnly(json,parentJSON) {
    var sortedArray = json.sort(dynamicSort("Position"));

    $.each(sortedArray, function (key, value) {
        var sortSeectionClass = value.SectionName.replace(/ +/g, '').replace("-", "").replace("/","");
        var sectionName = value.SectionName;
        var filteredSection = $.grep(parentJSON, function (n, i) {
            return n.SectionName === value.SectionName
        });;
        CreateScetionOnlyWithHTML(sortSeectionClass, sectionName,filteredSection);
    });
}
function CreateScetionOnlyWithHTML(sectionClass, sectionName, sectionJSON) {
    sectionJSON = sectionJSON.sort(dynamicSort("RowIndex"));
    var sectionClassWith = sectionClass.substr(0, 1).toLowerCase() + sectionClass.substr(1);

    var sectionHTMLBlockHeading = '<div class="' + sectionClassWith + ' elements">'
        + '<div class="col-sm-12"> <div class="sectionDescription"><h2>' + sectionName + '</h2></div>'
        + CreateNeedsStrengthHTMLWithData(sectionClassWith,sectionClass, sectionJSON)
        + '</div>'
        + '<div class="col-md-12 col-sm-12"> <hr /></div>';
    $(".summary_prioritzed_needs_strength_parent").append(sectionHTMLBlockHeading);
}
function CreateNeedsStrengthHTMLWithData(mainClass,sectionClass, sectionJSON) {
    var sectionItemHTML = '';
    $.each(sectionJSON, function (key, value) {
        var radioValue = value.ItemOption;
        var checkedFlag='',uncheckedFlag='';
        if (radioValue == true) {
            checkedFlag = "Checked"
        }
        else if (!isEmpty(radioValue) &&  radioValue==false) {
            uncheckedFlag = "Checked"
        }
        else if (isEmpty(radioValue)) {
            checkedFlag = "";
            uncheckedFlag = "";
        }
        sectionItemHTML += '<div class="col-md-6 col-sm-12"><label class="labelStrong">Item ' + value.RowIndex + '</label></div>'//create item label
            + '<div class="col-md-12 col-sm-12 lastElement"><div class="form-group icbField">'//create item input
            + '<textarea type = "text" class="form-control ' + mainClass + ' item-text" id="TextBox' + sectionClass + "_" + value.RowIndex + '" name="' + sectionClass + "_" + value.RowIndex + '">' + value.ItemText+'</textarea>'//create item input
            + '<ul><li><label class="checkboxField">'//create radio button Yes
            + 'Yes<input type="radio" name="Radio' + sectionClass + "_" + value.RowIndex + '" value="1" class="form-control ' + mainClass + ' item-radio" ' + checkedFlag + ' />'//create radio button Yes
            + '<span class="checkmark"></span></label></li>'//create radio button Yes
            + '<li><label class="checkboxField">No<input type="radio"name="Radio' + sectionClass + "_" + value.RowIndex + '" value="0" class="form-control ' + mainClass + ' item-radio" ' + uncheckedFlag + ' />'//create radio button No
            + '<span class="checkmark" ></span></label></li>'//create radio button No
            + '</ul></div></div>'//close parent div
       
    });
    return sectionItemHTML;
}
function dynamicSort(property) {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}
//#endregion  
//#region show hide controls
function ShowHideFields(current, type, hideFieldClass) {
    if (type == 'radio') {
        if ($(current).is(':checked') == true) {
            $('.' + hideFieldClass).removeAttr('hidden');
            $('.' + hideFieldClass).show();
        }
    }
    else if (type == 'check') {
        if (hideFieldClass == 'OutOfHomePlacementHistory' || hideFieldClass == 'evaluations') {
            if ($(current).is(':checked') == true && hideFieldClass == 'OutOfHomePlacementHistory') {
                $('.homePlacementHistory').children().val("");
                $('.' + hideFieldClass).hide();
            }
            else if ($(current).is(':checked') == true && hideFieldClass == 'evaluations') {
                $('.' + hideFieldClass).children().val("");
                $('.' + hideFieldClass).hide();
            }
            else {
                $('.' + hideFieldClass).removeAttr('hidden');
                $('.' + hideFieldClass).show();
            }
        }
        else if ($(current).is(':checked') == true && (hideFieldClass == 'Subcomitpermna' || hideFieldClass == 'Intfamsvcna' || hideFieldClass == 'Ipsna' || hideFieldClass == 'AdditionalPagesNeeded' || hideFieldClass == 'NeedsAssessmentNone')) {
            if (hideFieldClass == 'Ipsna') {
                $("input[name=RadioIpsouthyrsincare]").prop('checked', false);
                $("input[name=RadioIpssubcargvrknwythdevneeds]").prop('checked', false);
                $("input[name=RadioIpsyouthplacemnthist]").prop('checked', false);
                $("input[name=RadioIpssubcargvrdiscipline]").prop('checked', false);
                $("input[name=RadioIpssubcargvrmngmntemot]").prop('checked', false);
                $('.Ipssuppinfo').children().val("");
            }
            else if (hideFieldClass == 'AdditionalPagesNeeded') {
                $('.additHospital').val("");
            }
            else if (hideFieldClass == 'NeedsAssessmentNone') {
                $("input[name=RadioNeedsAssessmentAccessToFood]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentEducationalTesting]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentMentoring]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentFinancialAssistance]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentImmigrationAssistance]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentClothing]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentEmployment]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentLegalAssistance]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentPhysicalHealth]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentMentalHealthService]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentShelter]").prop('checked', false);
                $("input[name=RadioNeedsAssessmentOther]").prop('checked', false);
                $('#TextBoxNeedsAssessmentOtherDescription').val("");
            }
            else if (hideFieldClass == 'Intfamsvcna') {
                $("input[name=RadioIntfamsvccaregvrcollab]").prop('checked', false);
                $("input[name=RadioIntfamsvcfamconflict]").prop('checked', false);
                $("input[name=RadioIntfamsvcfamcommunic]").prop('checked', false);
                $("input[name=RadioIntfamsvcfamroleapprop]").prop('checked', false);
                $("input[name=Intfamsvcfamroleapprop]").prop('checked', false);
                $("input[name=RadioIntfamsvchomemaint]").prop('checked', false);
                $('.Intfamsvcsuppinfo').children().val("");
            }
            else if (hideFieldClass == 'Subcomitpermna') {
                $("input[name=RadioSubcomitpermcollabothprnt]").prop('checked', false);
                $("input[name=RadioSubcomitpermsupptpermplan]").prop('checked', false);
                $("input[name=RadioSubcomitperminclusythfstfam]").prop('checked', false);
                $('.Subcomitpermsuppinfo').children().val("");
            }
            $('.' + hideFieldClass).hide();
        }
        else {
            if ($(current).is(':checked') == true && hideFieldClass == 'NeedsAssessmentOther') {
                $('.' + hideFieldClass).removeAttr('hidden');
                $('.' + hideFieldClass).show();
            }
            else if ($(current).is(':checked') == true) {
                $('.' + hideFieldClass).removeAttr('hidden');
                $('.' + hideFieldClass).show();
            }
            else if ($(current).is(':checked') == false && (hideFieldClass == 'Subcomitpermna' || hideFieldClass == 'Intfamsvcna' || hideFieldClass == 'Ipsna' || hideFieldClass == 'AdditionalPagesNeeded' || hideFieldClass == 'NeedsAssessmentNone')) {

                $('.' + hideFieldClass).show();
            }
            else {
                $('.' + hideFieldClass).children().val("");
                $('.' + hideFieldClass).hide();
            }
        }
    }
    else if (type == 'dropdown') {
        if (hideFieldClass == 'race' && $(current).children("option:selected").text() == 'Other') {
            $('.RaceOtherDescription').removeAttr('hidden');
            $('.RaceOtherDescription').show();
        }
        else if ($(current).attr("id") == "DropDownInterpreterServices" && $(current).children("option:selected").text() == 'Other') {
            $('.InterpreterOtherDetails').removeAttr('hidden');
            $('.InterpreterOtherDetails').show();
            $('.interspoken').hide();
        }
        else if ($(current).attr("id") == "DropDownInterpreterServices" && $(current).children("option:selected").text() == 'Spoken Language'  ) {
            $('.interspoken').removeAttr('hidden');
            $('.interspoken').show();
            $('.InterpreterOtherDetails').hide();
        }
        else if (hideFieldClass == 'GuardianStatus' && $(current).children("option:selected").text() == 'Other') {
            $('.GuradianStatusOtherDesc').removeAttr('hidden');
            $('.GuradianStatusOtherDesc').show();
        }
        else if (hideFieldClass == 'LivingArrangement' && $(current).children("option:selected").text() == 'Other') {
            $('.LivingArrangementOtherDesc').removeAttr('hidden');
            $('.LivingArrangementOtherDesc').show();
        }
        else {
            if (hideFieldClass == 'race' && $(current).children("option:selected").text() != 'Other') {
                $('.RaceOtherDescription').hide();
                $('#TextBoxRaceOth').val("");
            }
            else if ($(current).attr("id") == "DropDownInterpreterServices" && ($(current).children("option:selected").text() != 'Other' || $(current).children("option:selected").text() != 'Spoken Language')) {
                $('.InterpreterOtherDetails').hide();
                $('.interspoken').hide();
                $('#TextBoxInterOther').val("");
                $('#TextBoxInterSpoken').val("");

            }
            else if (hideFieldClass == 'GuardianStatus' && $(current).children("option:selected").text() != 'Other') {
                $('.GuradianStatusOtherDesc').hide();
                $('#TextBoxGuardStatusOth').val("");
            }
            else if (hideFieldClass == 'LivingArrangement' && $(current).children("option:selected").text() != 'Other') {
                $('.LivingArrangementOtherDesc').hide();
                $('#TextBoxLivingArrangementOtherDesc').val("");
            }
        }
    }
    else {
        if (hideFieldClass == 'AbuseTreatment') {
            $('.abuseTreatment1').children().val("");
            $('.abuseTreatment2').children().val("");
            $('.abuseTreatment3').children().val("");
            $('.abuseTreatment4').children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'Gmhhpriorpsychologicalassessment') {
            $('.psyschologicalassessmentdate').children().val("");
            $('.psychologicalassessmentiq').children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'Gmhhpriorpsychiatricevaluation') {
            $('.psychiatricevaluationdate').children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'patientmentalhealthservices') {
            $('.healthservices1').children().val("");
            $('.healthservices2').children().val("");
            $('.healthservices3').children().val("");
            $('.healthservices4').children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'PsychiatricallyHospitalized') {
            $('.PsychHospitalName').children().val("");
            $('.PsychHospitalLocation').children().val("");
            $('.PsychHospitalizationDate').children().val("");
            $('.ReasonHospitalizedPsych').children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'BreathingIssues') {
            $("input[name=RadioBreathingIssuesCause]").prop('checked', false);
            $("input[name=RadioBreathingIssueMedicated]").prop('checked', false);
            $('.BreathingIssuesCause').children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'MedicationHistory') {
            $("input[name=RadioPainMedicationCategory]").prop('checked', false);
            $('.PainMedicationDescription').children().val("");
            $('.PainMedicationDescription').hide();
            $('.' + hideFieldClass).children().val("");
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'ChronicPain') {
            $('.IntensityLocationDescription').children().val("");
            $("input[name=RadioPainMedicationHistory]").prop('checked', false);
            $("input[name=RadioPainMedicationCategory]").prop('checked', false);
            $('.MedicationHistory').children().val("");
            $('.PainMedicationDescription').children().val("");
            $('.MedicationHistory').hide();
            $('.' + hideFieldClass).hide();
        }
        else if (hideFieldClass == 'SexuallyActive') {
            $("input[name=TextBoxLastSTDTestDate]").val("");
            $("input[name=RadioSTDProtection]").prop('checked', false);
            $("input[name=RadioSTDDiagnosed]").prop('checked', false);
            $('.STDDiagnosed').children().val("");
            $('.' + hideFieldClass).hide();
        }

        else {
            $('.' + hideFieldClass).hide();
            $('.' + hideFieldClass).children().val("");
        }
    }

}


//Cancel btn collapse section
function collapseSection(section) {
    $('.' + section).find(".medicalHeader").click();
}
//#endregion 
//#region create and publish the cans records.
function CreatePublishVersion() {
    $.ajax({
        type: "POST",
        data: { TabName: "PublishCansModule", GeneralInformationID: $("#TextBoxGeneralInformationId").val(), CansVersioningID: $("#TextBoxCansVersioningID").val(), ReportedBy: reportedBy },
        url: GetAPIEndPoints("HANDLECANSVERSIONING"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {

                location.href = "list-page.html?ClientID=" + clientId;
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function CreateNewDraft() {
    $.ajax({
        type: "POST",
        data: { TabName: "CreateNewVersionCans", GeneralInformationID: $("#TextBoxGeneralInformationId").val(), CansVersioningID: $("#TextBoxCansVersioningID").val(), ReportedBy: reportedBy },
        url: GetAPIEndPoints("HANDLECANSVERSIONING"),
        headers: {
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (result) {
            if (result.Success == true) {

                NewVersioncreated(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function NewVersioncreated(result) {
    if (result.Success == true) {
        if (JSON.parse(result.NewVersionDetails[0].JSONData).length>0) {
            showRecordSaved("New version created successfully");
            FillMasterChildPrimaryKeys(JSON.parse(result.NewVersionDetails[0].JSONData));
            ShowHideButtons(JSON.parse(result.NewVersionDetails[0].JSONData));
            BindChildTables(result);
            ShowHideSectionStatus(JSON.parse(result.NewVersionDetails[0].JSONData)[0]);
            changeURL(JSON.parse(result.NewVersionDetails[0].JSONData));
            BindServiceObjectiveDropDown(JSON.parse(result.CommonCANSRsponse[0].JSONServiceObjectiveData));


        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
function FillMasterChildPrimaryKeys(result) {
    if (result != undefined) {




        $("#labelCansStatus").text(result[0].DocumentStatus);
        $("#labelDocumentVersion").text(result[0].DocumentVersion);

        documentMode = result[0].DocumentStatus;
        $("#TextBoxCansVersioningID").val(result[0].CansVersioningID);
        $("#TextBoxGeneralInformationId").val(result[0].GeneralInformationID);
        $("#TextBoxTraumaExposureID").val(result[0].TraumaExposureID);
        $("#TextBoxPresentinProblemAndImpactID").val(result[0].PresentinProblemAndImpactID);
        $("#TextBoxSafetyID").val(result[0].SafetyID);
        $("#TextBoxSubstanceUseHistoryID").val(result[0].SubstanceUseHistoryID);
        $("#TextBoxPlacementHistoryID").val(result[0].PlacementHistoryID);
        $("#TextBoxPsychiatricInformationID").val(result[0].PsychiatricInformationID);
        $("#TextBoxClientStrengthID").val(result[0].ClientStrengthID);
        $("#TextBoxFamilyInformationID").val(result[0].FamilyInformationID);
        $("#TextBoxNeedsResourceAssessmentID").val(result[0].NeedsResourceAssessmentID);
        $("#TextBoxMentalHealthSummaryID").val(result[0].MentalHealthSummaryID);
        $("#TextBoxAddClientFunctioningEvaluationID").val(result[0].AddClientFunctioningEvaluationID);
        $("#TextBoxIndividualTreatmentPlanID").val(result[0].IndividualTreatmentPlanID);
        $("#TextBoxCansSignatureID").val(result[0].CansSignatureID);
        $("#TextBoxGeneralInformatioinHRA").val(result[0].GeneralInformatioinHRAID);
        $("#TextBoxMedicationID").val(result[0].MedicationID);
        $("#TextBoxHealthStatusID").val(result[0].HealthStatusID);
        $("#TextBoxDevelopmentHistoryID").val(result[0].DevelopmentHistoryID);


        $("#TextBoxMedicalHistoryID").val(result[0].MedicalHistoryID);
        $("#TextBoxCaregiverAddendumID").val(result[0].CaregiverAddendumID);
        $("#TextBoxGeneralInformationDCFSID").val(result[0].GeneralInformationDCFSID);
        $("#TextBoxSexuallyAggrBehaviorID").val(result[0].SexuallyAggrBehaviorID);
        $("#TextBoxParentGuardSafetyID").val(result[0].ParentGuardSafetyID);
        $("#TextBoxParentGuardWellbeingID").val(result[0].ParentGuardWellbeingID);
        $("#TextBoxParentGuardPermananenceID").val(result[0].ParentGuardPermananenceID);
        $("#TextBoxSubstituteCommitPermananenceID").val(result[0].SubstituteCommitPermananenceID);

        $("#TextBoxIntactFamilyServiceID").val(result[0].IntactFamilyServiceID);
        $("#TextBoxIntensivePlacementStabilizationID").val(result[0].IntensivePlacementStabilizationID);
    }

}
function ShowHideButtons() {
    $("#btnSaveAsNew").addClass("hidden");
    $("#btnPrintPDf").show();
    $("#btnPublishVersion").show();
    $(".btnDisable").show();
    $(".btnDisable").text("Edit");
    $(".btnNoStatus").show();
    $(".btnMaster").show();
    $(".btnMaster").text("Edit");
    $(".btnChildTbales").prop("disabled", false);
    $('.imuForm .form-control').prop("disabled", true);
    $('.section17 .form-control').prop("disabled", false);
    $('.ModalJSignature .form-control').prop("disabled", false);
}
function BindChildTables(result) {
    //General Section tables
    BindGeneralInformationFamilyMembers(result.NewVersionDetails[0].JSONFamilyMembersData);
    BindGeneralInformationEstabilsihedSupports(result.NewVersionDetails[0].JSONEstablishedData);

    // section 5 tables
    var table = $('#PriorSubstanceAbuseTreatment').DataTable();
    table.clear();
    $('#PriorSubstanceAbuseTreatment').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONSubstanceAbuseData),
        "columns": [{ "data": "Actions" }, { "data": "Subabusehistwhen" }, { "data": "Subabusehistwhere" }, { "data": "Subabusehistwithwhom" }, { "data": "Subabusehistreason" }, { "data": "SubstanceAbuseTreatmentID" }]
    });
    dataTableSubstanceAbuseTreatmentFlg = true;
 

    // psychatric information section 7  tables
    var table = $('#PriorMentalHealthServices').DataTable();
    table.clear();
    $('#PriorMentalHealthServices').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONOutpatientData),
        "columns": [{ "data": "Actions" }, { "data": "Mentalhealthhistwhen" }, { "data": "Mentalhealthhistwhere" }, { "data": "Mentalhealthhistwithwhom" }, { "data": "Mentalhealthhistreason" }, { "data": "OutpatientMentalHealthServicesID" }]
    });
    dataTableOutpatientMentalHealthFlg = true;


    //Section 11 diagnosis  table 
    if (result.NewVersionDetails[0].JSONDSMData != null) {
        var diganosisStatus = JSON.parse(result.NewVersionDetails[0].JSONDSMData)[0].Status;
        if (diganosisStatus == "Completed") {
            HandleCompleteSection("DsmDiagnosis");
        } else {
            HandleInprogressSection("DsmDiagnosis");
        }

        var table = $('#diagnosis').DataTable();
        table.clear();
        $('#diagnosis').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [1, 6] }
            ],
            "aaData": JSON.parse(result.NewVersionDetails[0].JSONDSMData),
            "columns": [{ "data": "Actions" }, { "data": "DiagnosisCode" }, { "data": "DiagnosticCodeDescription" }, { "data": "ICD5Name" }, { "data": "ICD10Name" }, { "data": "Diagnosis" }, { "data": "DsmDiagnosisID" }]
        });
        dataTableOutpatientMentalHealthFlg = true;
    }
    else {
        $(".DsmDiagnosis").show();
        HandleStartSection("DsmDiagnosis");
    }
     //Section 14 summary and prioritzed needs and strength
    if (result.NewVersionDetails[0].JSONNeedsStrengthData != null) {
        var needsStrengthStatus = JSON.parse(result.NewVersionDetails[0].JSONNeedsStrengthData)[0].Status;
        if (needsStrengthStatus == "Completed") {
            HandleCompleteSection("section14");
        } else {
            HandleInprogressSection("section14");
        }
        CreateNeedsStrengthSectionsAfterSave(JSON.parse(result.NewVersionDetails[0].JSONNeedsStrengthData));

    }
    else {
       $(".section14").show();
        HandleStartSection("section14");
    }

    //Section 16 treatment plan  tables
    var table = $('#tblTreatmentPlans').DataTable();
    table.clear();
    $('#tblTreatmentPlans').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": true,
        "searching": true,
        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONTreatmentPlan),
        "aoColumns": [{ "mData": "Actions" }, { "mData": "StartDate" }, { "mData": "TreatmentPlan" }, { "mData": "CANSLink" },{ "mData": "CansTreatmentPlanGoalText" }]
    });
    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');

    //Section 17 service interventions tables
    FillServiceInterventionTable(result.NewVersionDetails[0].JSONServiceInterventionsData);


    //section 20 Medical   tables
    var table = $('#medication').DataTable();
    table.clear();
    $('#medication').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [7] }
        ],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONMedicalData),
        "columns": [{ "data": "Actions" }, { "data": "MedicationName" }, { "data": "MedicationPrescriberName" }, { "data": "MedicationDosage" }, { "data": "MedicationPrescriptionBeginDate" }, { "data": "MedicationPrescriptionEndDate" }, { "data": "MedicationIssues" }, { "data": "MedicationDetailID" }]
    });
    dataTableMedicationFlg = true;
    //section 23 medical history section 
    var table = $('#PsychiatricallyHospitalized').DataTable();
    table.clear();
    $('#PsychiatricallyHospitalized').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONHistoryPsychData),
        "columns": [{ "data": "Actions" }, { "data": "PsychHospitalName" }, { "data": "PsychHospitalLocation" }, { "data": "PsychHospitalizationDate" }, { "data": "ReasonHospitalizedPsych" }, { "data": "MedicalHistoryPsychHospitalID" }]
    });
    dataTablePsychiatricallyHospitalizedFlg = true;

    var table2 = $('#additionalHospitalizations').DataTable();
    table2.clear();
    $('#additionalHospitalizations').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONHistAddData),
        "columns": [{ "data": "Actions" }, { "data": "HospitalName" }, { "data": "HospitalLocation" }, { "data": "HospitalizationDate" }, { "data": "ReasonHospitalized" }, { "data": "MedicalHistoryAdditHospitalID" }]
    });
    dataTableAdditionalHospitalizationsFlg = true;

    var table3 = $('#specialtiesProviders').DataTable();
    table3.clear();
    $('#specialtiesProviders').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [4] }
        ],
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONHistProviderData),
        "aaData": JSON.parse(result.NewVersionDetails[0].JSONHistProviderData),
        "columns": [{ "data": "Actions" }, { "data": "ProviderName" }, { "data": "ProviderSpecialty" }, { "data": "ProviderServices" }, { "data": "MedicalHistoryProviderID" }]
    });
    dataTableProviderFlg = true;
}
function ShowHideSectionStatus(result) {
    if (result !=undefined) {
        //var parseJson = result.AllTabsComprehensiveAssessment[0];
        if (result.TraumaExposureStatus == "Start") {
            $(".TraumaExposure").show();
            HandleStartSection("TraumaExposure");

        }
        else {
            if (result.TraumaExposureStatus == "Completed") {
                HandleCompleteSection("TraumaExposure");
            } else {
                HandleInprogressSection("TraumaExposure");
            }
        }


        if (result.PresentinProblemAndImpactStatus == "Start") {
            $(".PresentinProblemAndImpact").show();
            HandleStartSection("PresentinProblemAndImpact");
        }
        else {
            if (result.PresentinProblemAndImpactStatus == "Completed") {
                HandleCompleteSection("PresentinProblemAndImpact");
            } else {
                HandleInprogressSection("PresentinProblemAndImpact");
            }
        }



        if (result.SafetyStatus == "Start") {
            $(".Safety").show();
            HandleStartSection("Safety");
        }
        else {
            if (result.SafetyStatus == "Completed") {
                HandleCompleteSection("Safety");
            } else {
                HandleInprogressSection("Safety");
            }
        }



        if (result.SubstanceUseHistoryStatus == "Start") {
            $(".SubstanceUseHistory").show();
            HandleStartSection("SubstanceUseHistory");
        }
        else {
            if (result.SubstanceUseHistoryStatus == "Completed") {
                HandleCompleteSection("SubstanceUseHistory");
            } else {
                HandleInprogressSection("SubstanceUseHistory");
            }
        }




        if (result.PlacementHistoryStatus == "Start") {
            $(".PlacementHistory").show();
            HandleStartSection("PlacementHistory");
        }
        else {
            if (result.PlacementHistoryStatus == "Completed") {
                HandleCompleteSection("PlacementHistory");
            } else {
                HandleInprogressSection("PlacementHistory");
            }
        }



        if (result.PsychiatricInformationStatus == "Start") {
            $(".PsychiatricInformation").show();
            HandleStartSection("PsychiatricInformation");
        }
        else {
            if (result.PsychiatricInformationStatus == "Completed") {
                HandleCompleteSection("PsychiatricInformation");
            } else {
                HandleInprogressSection("PsychiatricInformation");
            }
        }


        if (result.ClientStrengthStatus == "Start") {
            $(".ClientStrength").show();
            HandleStartSection("ClientStrength");
        }
        else {
            if (result.ClientStrengthStatus == "Completed") {
                HandleCompleteSection("ClientStrength");
            } else {
                HandleInprogressSection("ClientStrength");
            }
        }



        if (result.FamilyInformationStatus == "Start") {
            $(".FamilyInformation").show();
            HandleStartSection("FamilyInformation");
        }
        else {
            if (result.FamilyInformationStatus == "Completed") {
                HandleCompleteSection("FamilyInformation");
            } else {
                HandleInprogressSection("FamilyInformation");
            }
        }



        if (result.NeedsResourceAssessmentStatus == "Start") {
            $(".NeedsResourceAssessment").show();
            HandleStartSection("NeedsResourceAssessment");
        }
        else {
            if (result.NeedsResourceAssessmentStatus == "Completed") {
                HandleCompleteSection("NeedsResourceAssessment");
            } else {
                HandleInprogressSection("NeedsResourceAssessment");
            }
        }


        if (result.MentalHealthSummaryStatus == "Start") {
            $(".MentalHealthSummary").show();
            HandleStartSection("MentalHealthSummary");
        }
        else {
            if (result.MentalHealthSummaryStatus == "Completed") {
                HandleCompleteSection("MentalHealthSummary");
            } else {
                HandleInprogressSection("MentalHealthSummary");
            }
        }


        if (result.AddClientFunctioningEvaluationStatus == "Start") {
            $(".AddClientFunctioningEvaluation").show();
            HandleStartSection("AddClientFunctioningEvaluation");

        }
        else {
            if (result.AddClientFunctioningEvaluationStatus == "Completed") {
                HandleCompleteSection("AddClientFunctioningEvaluation");
            } else {
                HandleInprogressSection("AddClientFunctioningEvaluation");
            }
        }


        if (result.IndividualTreatmentPlanStatus == "Start") {
            $(".IndividualTreatmentPlan").show();
            HandleStartSection("IndividualTreatmentPlan");

        }
        else {
            if (result.IndividualTreatmentPlanStatus  == "Completed") {
                HandleCompleteSection("IndividualTreatmentPlan");
            } else {
                HandleInprogressSection("IndividualTreatmentPlan");
            }
        }



        if (result.CansSignatureStatus == "Start") {
            $(".PresentingSignatures").show();
            HandleStartSection("PresentingSignatures");
        }
        else {
            if (result.CansSignatureStatus == "Completed") {
                HandleCompleteSection("PresentingSignatures");
            } else {
                HandleInprogressSection("PresentingSignatures");
            }
        }


        if (result.GeneralInformatioinHRAStatus == "Start") {
            $(".GeneralInformatioinHRA").show();
            HandleStartSection("GeneralInformatioinHRA");

        }
        else {
            if (result.GeneralInformatioinHRAStatus == "Completed") {
                HandleCompleteSection("GeneralInformatioinHRA");
            } else {
                HandleInprogressSection("GeneralInformatioinHRA");
            }
        }


        if (result.MedicationStatus == "Start") {
            $(".Medication").show();
            HandleStartSection("Medication");

        }
        else {
            if (result.MedicationStatus == "Completed") {
                HandleCompleteSection("Medication");
            } else {
                HandleInprogressSection("Medication");
            }
        }

        if (result.HealthStatusStatus == "Start") {
            $(".HealthStatus").show();
            HandleStartSection("HealthStatus");
        }
        else {
            if (result.HealthStatusStatus == "Completed") {
                HandleCompleteSection("HealthStatus");
            } else {
                HandleInprogressSection("HealthStatus");
            }
        }


        if (result.DevelopmentHistoryStatus == "Start") {
            $(".DevelopmentHistory").show();
            HandleStartSection("DevelopmentHistory");
        }
        else {
            if (result.DevelopmentHistoryStatus == "Completed") {
                HandleCompleteSection("DevelopmentHistory");
            } else {
                HandleInprogressSection("DevelopmentHistory");
            }
        }

        if (result.MedicalHistoryStatus == "Start") {
            $(".MedicalHistory").show();
            HandleStartSection("MedicalHistory");
        }
        else {
            if (result.MedicalHistoryStatus == "Completed") {
                HandleCompleteSection("MedicalHistory");
            } else {
                HandleInprogressSection("MedicalHistory");
            }
        }

        if (result.CaregiverAddendumStatus == "Start") {
            $(".MedicalHistory").show();
            HandleStartSection("CaregiverAddendum");
        }
        else {
            if (result.CaregiverAddendumStatus == "Completed") {
                HandleCompleteSection("CaregiverAddendum");
            } else {
                HandleInprogressSection("CaregiverAddendum");
            }
        }

        if (result.GeneralInformationDCFSStatus == "Start") {
            $(".GeneralInformationDCFS").show();
            HandleStartSection("GeneralInformationDCFS");
        }
        else {
            if (result.GeneralInformationDCFSStatus == "Completed") {
                HandleCompleteSection("GeneralInformationDCFS");
            } else {
                HandleInprogressSection("GeneralInformationDCFS");
            }
        }

        if (result.SexuallyAggrBehaviorStatus == "Start") {
            $(".SexuallyAggrBehavior").show();
            HandleStartSection("SexuallyAggrBehavior");
        }
        else {
            if (result.SexuallyAggrBehaviorStatus == "Completed") {
                HandleCompleteSection("SexuallyAggrBehavior");
            } else {
                HandleInprogressSection("SexuallyAggrBehavior");
            }
        }

        if (result.ParentGuardSafetyStatus == "Start") {
            $(".ParentGuardSafety").show();
            HandleStartSection("ParentGuardSafety");
        }
        else {
            if (result.ParentGuardSafetyStatus == "Completed") {
                HandleCompleteSection("ParentGuardSafety");
            } else {
                HandleInprogressSection("ParentGuardSafety");
            }
        }

        if (result.ParentGuardWellbeingStatus == "Start") {
            $(".ParentGuardWellbeing").show();
            HandleStartSection("ParentGuardWellbeing");
        }
        else {
            if (result.ParentGuardWellbeingStatus == "Completed") {
                HandleCompleteSection("ParentGuardWellbeing");
            } else {
                HandleInprogressSection("ParentGuardWellbeing");
            }
        }

        if (result.ParentGuardPermananenceStatus == "Start") {
            $(".ParentGuardPermananence").show();
            HandleStartSection("ParentGuardPermananence");
        }
        else {
            if (result.ParentGuardPermananenceStatus == "Completed") {
                HandleCompleteSection("ParentGuardPermananence");
            } else {
                HandleInprogressSection("ParentGuardPermananence");
            }
        }


        if (result.SubstituteCommitPermananenceStatus == "Start") {
            $(".SubstituteCommitPermananence").show();
            HandleStartSection("SubstituteCommitPermananence");
        }
        else {
            if (result.SubstituteCommitPermananenceStatus == "Completed") {
                HandleCompleteSection("SubstituteCommitPermananence");
            } else {
                HandleInprogressSection("SubstituteCommitPermananence");
            }
        }


        if (result.IntactFamilyServiceStatus == "Start") {
            $(".IntactFamilyService").show();
            HandleStartSection("IntactFamilyService");
        }
        else {
            if (result.IntactFamilyServiceStatus == "Completed") {
                HandleCompleteSection("IntactFamilyService");
            } else {
                HandleInprogressSection("IntactFamilyService");
            }
        }

        if (result.IntensivePlacementStabilizationStatus == "Start") {
            $(".IntensivePlacementStabilization").show();
            HandleStartSection("IntensivePlacementStabilization");
        }
        else {
            if (result.IntensivePlacementStabilizationStatus == "Completed") {
                HandleCompleteSection("IntensivePlacementStabilization");
            } else {
                HandleInprogressSection("IntensivePlacementStabilization");
            }
        }
    }
}

function changeURL(result) {

    var currentURL = $(location).attr("href");
    if (currentURL.indexOf('?') > -1) {
        var newURL = new URL(currentURL),
            changeAssessmentId = newURL.searchParams.set("GeneralInformationID", result[0].GeneralInformationID),
            changeVersionId = newURL.searchParams.set("CansVersioningID", result[0].CansVersioningID);
        history.pushState(null, 'CANS', newURL.href);
    }

}
//#endregion 

//#region new code
function ClearFieldsValue(classname) {
    if (classname == 'AdditionalHospitalizations') {
        $(".additHospital").val("");
    }
    if (classname == 'PsychiatricallyHospitalized') {
        $(".PsychHospital").val("");
    }
    if (classname == 'Provider') {
        $(".providerSpecialties").val("");
    }
    if (classname == 'Medication') {
        $(".mediDetail").val("");
    }

}
function EditExistingRowAdditionalHospitalizations() {
    if ($("#TextBoxHospitalName").val() == '' && $("#TextBoxHospitalLocation").val() == '' && $("#TextBoxHospitalizationDate").val() == '' && $("#TextBoxReasonHospitalized").val() == '') {
        showErrorMessage(" select atleast one field.");
        return;
    }
    if ($("#AddAdditHospital").text() == 'Edit') {
        $("#AddAdditHospital").text('Add');
    };
    var table = $('#additionalHospitalizations').DataTable();
    var currentata = "";
    if (dataTableAdditionalHospitalizationsFlg) {
        var rowExists = false;
        var valueCol = $('#additionalHospitalizations').DataTable().column(2).data();

        var data = {
            "Actions": CreateChildBtnWithPermission("EditAdditionalHospitalizations", "DeleteEditAdditionalHospitalizations"),  

            "HospitalName": $("#TextBoxHospitalName").val(),
            "HospitalLocation": $("#TextBoxHospitalLocation").val(),
            "HospitalizationDate": $("#TextBoxHospitalizationDate").val(),
            "ReasonHospitalized": $("#TextBoxReasonHospitalized").val(),
            "MedicalHistoryAdditHospitalID": $("#TextBoxMedicalHistoryAdditHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryAdditHospitalID").val(),

        };
        table.row(currentRowAdditionalHospitalizations).data(data).draw(false);
        $("#AddAdditHospital").removeAttr("onclick");
        $("#AddAdditHospital").removeClass("editRow");
        showRecordSaved("Additional Hospitalizations edited successfully.");
        ClearFieldsValue('AdditionalHospitalizations');

    }
    else {
        var rowExists = false;
        var valueCol = $('#additionalHospitalizations').DataTable().column(1).data();
        var index = valueCol.length;

        var data1 = [
            CreateChildBtnWithPermission("EditAdditionalHospitalizations", "DeleteEditAdditionalHospitalizations"),
            //  selectedText.trim(),
            $("#TextBoxHospitalName").val(),
            $("#TextBoxHospitalLocation").val(),
            $("#TextBoxHospitalizationDate").val(),
            $("#TextBoxReasonHospitalized").val(),
            $("#TextBoxMedicalHistoryAdditHospitalID").val() == undefined ? '' : $("#TextBoxMedicalHistoryAdditHospitalID").val(),
        ];
        table.row(currentRowAdditionalHospitalizations).data(data1).draw(false);
        $("#AddAdditHospital").removeAttr("onclick");
        $("#AddAdditHospital").removeClass("editRow");
        showRecordSaved("Additional Hospitalizations edited successfully.");
        ClearFieldsValue('AdditionalHospitalizations');
        //}
    }
}
function EditAdditionalHospitalizations(object) {
    var table = $('#additionalHospitalizations').DataTable();
    currentRowAdditionalHospitalizations = $(object).parents("tr");
    var MedicalHistoryAdditHospitalID = table.row(currentRowAdditionalHospitalizations).data()[5] == undefined ? table.row(currentRowAdditionalHospitalizations).data().MedicalHistoryAdditHospitalID : table.row(currentRowAdditionalHospitalizations).data()[5];
    var HospitalName = table.row(currentRowAdditionalHospitalizations).data()[1] == undefined ? table.row(currentRowAdditionalHospitalizations).data().HospitalName : table.row(currentRowAdditionalHospitalizations).data()[1];
    var HospitalLocation = table.row(currentRowAdditionalHospitalizations).data()[2] == undefined ? table.row(currentRowAdditionalHospitalizations).data().HospitalLocation : table.row(currentRowAdditionalHospitalizations).data()[2];
    var HospitalizationDate = table.row(currentRowAdditionalHospitalizations).data()[3] == undefined ? table.row(currentRowAdditionalHospitalizations).data().HospitalizationDate : table.row(currentRowAdditionalHospitalizations).data()[3];
    var ReasonHospitalized = table.row(currentRowAdditionalHospitalizations).data()[4] == undefined ? table.row(currentRowAdditionalHospitalizations).data().ReasonHospitalized : table.row(currentRowAdditionalHospitalizations).data()[4];

    $("#TextBoxMedicalHistoryPsychHospitalID").val(MedicalHistoryAdditHospitalID);
    //$("#DropDownEstabilishedSupports").text(EstablishedSupports);
    $("#TextBoxHospitalName").val(HospitalName);
    $("#TextBoxHospitalLocation").val(HospitalLocation);
    $("#TextBoxHospitalizationDate").val(HospitalizationDate);
    $("#TextBoxReasonHospitalized").val(ReasonHospitalized);
    $("#AddAdditHospital").attr("onclick", "EditExistingRowAdditionalHospitalizations();return false;");
    $("#AddAdditHospital").addClass("editRow");
    $("#AddAdditHospital").text("Edit");

    return false;
}
function DeleteEditAdditionalHospitalizations(object) {
    var table = $('#additionalHospitalizations').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddAdditHospital").attr("onclick") != undefined) {
        $("#AddAdditHospital").removeAttr("onclick");
        $("#AddAdditHospital").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRowProvider() {
    if ($("#TextBoxProviderName").val() == '' && $("#TextBoxProviderSpecialty").val() == '' && $("#TextBoxProviderServices").val() == '') {
        showErrorMessage(" select atleast one field.");
        return;
    }
    if ($("#AddProvider").text() == 'Edit') {
        $("#AddProvider").text('Add');
    };
    var table = $('#specialtiesProviders').DataTable();
    var currentata = "";
    if (dataTableProviderFlg) {
        var rowExists = false;
        var valueCol = $('#specialtiesProviders').DataTable().column(2).data();

        var data = {
            "Actions": CreateChildBtnWithPermission("EditProvider", "DeleteEditProvider"), 

            "ProviderName": $("#TextBoxProviderName").val(),
            "ProviderSpecialty": $("#TextBoxProviderSpecialty").val(),
            "ProviderServices": $("#TextBoxProviderServices").val(),
            "MedicalHistoryProviderID": $("#TextBoxMedicalHistoryProviderID").val() == undefined ? '' : $("#TextBoxMedicalHistoryProviderID").val(),
        };
        table.row(currentRowProviders).data(data).draw(false);
        $("#AddProvider").removeAttr("onclick");
        $("#AddProvider").removeClass("editRow");
        showRecordSaved("Provider edited successfully.");
        ClearFieldsValue('Provider');

    }
    else {
        var rowExists = false;
        var valueCol = $('#specialtiesProviders').DataTable().column(1).data();
        var index = valueCol.length;

        var data1 = [
            CreateChildBtnWithPermission("EditProvider", "DeleteEditProvider"),
            //  selectedText.trim(),
            $("#TextBoxProviderName").val(),
            $("#TextBoxProviderSpecialty").val(),
            $("#TextBoxProviderServices").val(),
            $("#TextBoxMedicalHistoryProviderID").val() == undefined ? '' : $("#TextBoxMedicalHistoryProviderID").val(),
        ];
        table.row(currentRowProviders).data(data1).draw(false);
        $("#AddProvider").removeAttr("onclick");
        $("#AddProvider").removeClass("editRow");
        showRecordSaved("Provider edited successfully.");
        ClearFieldsValue('Provider');
        //}
    }
}
function EditProvider(object) {
    var table = $('#specialtiesProviders').DataTable();
    currentRowProviders = $(object).parents("tr");
    var MedicalHistoryProviderID = table.row(currentRowProviders).data()[4] == undefined ? table.row(currentRowProviders).data().MedicalHistoryProviderID : table.row(currentRowProviders).data()[4];
    var ProviderName = table.row(currentRowProviders).data()[1] == undefined ? table.row(currentRowProviders).data().ProviderName : table.row(currentRowProviders).data()[1];
    var ProviderSpecialty = table.row(currentRowProviders).data()[2] == undefined ? table.row(currentRowProviders).data().ProviderSpecialty : table.row(currentRowProviders).data()[2];
    var ProviderServices = table.row(currentRowProviders).data()[3] == undefined ? table.row(currentRowProviders).data().ProviderServices : table.row(currentRowProviders).data()[3];

    $("#TextBoxMedicalHistoryProviderID").val(MedicalHistoryProviderID);
    //$("#DropDownEstabilishedSupports").text(EstablishedSupports);
    $("#TextBoxProviderName").val(ProviderName);
    $("#TextBoxProviderSpecialty").val(ProviderSpecialty);
    $("#TextBoxProviderServices").val(ProviderServices);
    $("#AddProvider").attr("onclick", "EditExistingRowProvider();return false;");
    $("#AddProvider").addClass("editRow");
    $("#AddProvider").text("Edit");

    return false;
}
function DeleteEditProvider(object) {
    var table = $('#specialtiesProviders').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddProvider").attr("onclick") != undefined) {
        $("#AddProvider").removeAttr("onclick");
        $("#AddProvider").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRowMedication() {
    if ($("#TextBoxMedicationName").val() == '' && $("#TextBoxMedicationPrescriberName").val() == '' && $("#TextBoxMedicationDosage").val() == '' && $("#TextBoxMedicationPrescriptionBeginDate").val() == '' && $("#TextBoxMedicationPrescriptionEndDate").val() == '' && $("#TextBoxMedicationIssues").val() == '') {
        showErrorMessage(" select atleast one field.");
        return;
    }
    if ($("#Addmedication").text() == 'Edit') {
        $("#Addmedication").text('Add');
    };
    var table = $('#medication').DataTable();
    var currentata = "";
    if (dataTableMedicationFlg) {
        var rowExists = false;
        var valueCol = $('#medication').DataTable().column(2).data();

        var data = {
            "Actions": CreateChildBtnWithPermission("EditMedication", "DeleteEditMedication"),

            "MedicationName": $("#TextBoxMedicationName").val(),
            "MedicationPrescriberName": $("#TextBoxMedicationPrescriberName").val(),
            "MedicationDosage": $("#TextBoxMedicationDosage").val(),
            "MedicationPrescriptionBeginDate": $("#TextBoxMedicationPrescriptionBeginDate").val(),
            "MedicationPrescriptionEndDate": $("#TextBoxMedicationPrescriptionEndDate").val(),
            "MedicationIssues": $("#TextBoxMedicationIssues").val(),
            "MedicationDetailID": $("#TextBoxMedicationDetailID").val() == undefined ? '' : $("#TextBoxMedicationDetailID").val(),
        };
        table.row(currentRowMedication).data(data).draw(false);
        $("#Addmedication").removeAttr("onclick");
        $("#Addmedication").removeClass("editRow");
        showRecordSaved("Medication edited successfully.");
        ClearFieldsValue('Medication');

    }
    else {
        var rowExists = false;
        var valueCol = $('#medication').DataTable().column(1).data();
        var index = valueCol.length;

        var data1 = [
            CreateChildBtnWithPermission("EditMedication", "DeleteEditMedication"),
            //  selectedText.trim(),
            $("#TextBoxMedicationName").val(),
            $("#TextBoxMedicationPrescriberName").val(),
            $("#TextBoxMedicationDosage").val(),
            $("#TextBoxMedicationPrescriptionBeginDate").val(),
            $("#TextBoxMedicationPrescriptionEndDate").val(),
            $("#TextBoxMedicationIssues").val(),
            $("#TextBoxMedicationDetailID").val() == undefined ? '' : $("#TextBoxMedicationDetailID").val(),
        ];
        table.row(currentRowMedication).data(data1).draw(false);
        $("#Addmedication").removeAttr("onclick");
        $("#Addmedication").removeClass("editRow");
        showRecordSaved("Medication edited successfully.");
        ClearFieldsValue('Medication');
        //}
    }
}
function EditMedication(object) {
    var table = $('#medication').DataTable();
    currentRowMedication = $(object).parents("tr");
    var MedicationDetailID = table.row(currentRowMedication).data()[7] == undefined ? table.row(currentRowMedication).data().MedicationDetailID : table.row(currentRowMedication).data()[7];
    var MedicationName = table.row(currentRowMedication).data()[1] == undefined ? table.row(currentRowMedication).data().MedicationName : table.row(currentRowMedication).data()[1];
    var MedicationPrescriberName = table.row(currentRowMedication).data()[2] == undefined ? table.row(currentRowMedication).data().MedicationPrescriberName : table.row(currentRowMedication).data()[2];
    var MedicationDosage = table.row(currentRowMedication).data()[3] == undefined ? table.row(currentRowMedication).data().MedicationDosage : table.row(currentRowMedication).data()[3];
    var MedicationPrescriptionBeginDate = table.row(currentRowMedication).data()[4] == undefined ? table.row(currentRowMedication).data().MedicationPrescriptionBeginDate : table.row(currentRowMedication).data()[4];
    var MedicationPrescriptionEndDate = table.row(currentRowMedication).data()[5] == undefined ? table.row(currentRowMedication).data().MedicationPrescriptionEndDate : table.row(currentRowMedication).data()[5];
    var MedicationIssues = table.row(currentRowMedication).data()[6] == undefined ? table.row(currentRowMedication).data().MedicationIssues : table.row(currentRowMedication).data()[6];

    $("#TextBoxMedicationDetailID").val(MedicationDetailID);
    $("#TextBoxMedicationName").val(MedicationName);
    $("#TextBoxMedicationPrescriberName").val(MedicationPrescriberName);
    $("#TextBoxMedicationDosage").val(MedicationDosage);
    $("#TextBoxMedicationPrescriptionBeginDate").val(MedicationPrescriptionBeginDate);
    $("#TextBoxMedicationPrescriptionEndDate").val(MedicationPrescriptionEndDate);
    $("#TextBoxMedicationIssues").val(MedicationIssues);
    $("#Addmedication").attr("onclick", "EditExistingRowMedication();return false;");
    $("#Addmedication").addClass("editRow");
    $("#Addmedication").text("Edit");
    return false;
}
function DeleteEditMedication(object) {
    var table = $('#medication').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#Addmedication").attr("onclick") != undefined) {
        $("#Addmedication").removeAttr("onclick");
        $("#Addmedication").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditPriorOutpatientMentalHealthServices(object) {
    var table = $('#PriorMentalHealthServices').DataTable();
    currentRowMentalHealthServices = $(object).parents("tr");
    var OutpatientMentalHealthServicesID = table.row(currentRowMentalHealthServices).data()[5] == undefined ? table.row(currentRowMentalHealthServices).data().OutpatientMentalHealthServicesID : table.row(currentRowMentalHealthServices).data()[5];
    var Mentalhealthhistwhen = table.row(currentRowMentalHealthServices).data()[1] == undefined ? table.row(currentRowMentalHealthServices).data().Mentalhealthhistwhen : table.row(currentRowMentalHealthServices).data()[1];
    var Mentalhealthhistwhere = table.row(currentRowMentalHealthServices).data()[2] == undefined ? table.row(currentRowMentalHealthServices).data().Mentalhealthhistwhere : table.row(currentRowMentalHealthServices).data()[2];
    var Mentalhealthhistwithwhom = table.row(currentRowMentalHealthServices).data()[3] == undefined ? table.row(currentRowMentalHealthServices).data().Mentalhealthhistwithwhom : table.row(currentRowMentalHealthServices).data()[3];
    var Mentalhealthhistreason = table.row(currentRowMentalHealthServices).data()[4] == undefined ? table.row(currentRowMentalHealthServices).data().Mentalhealthhistreason : table.row(currentRowMentalHealthServices).data()[4];

    $("#TextBoxOutpatientMentalHealthServicesID").val(OutpatientMentalHealthServicesID);
    //$("#DropDownEstabilishedSupports").text(EstablishedSupports);
    $("#TextBoxMentalhealthhistwhen").val(Mentalhealthhistwhen);
    $("#TextBoxMentalhealthhistwhere").val(Mentalhealthhistwhere);
    $("#TextBoxMentalhealthhistwithwhom").val(Mentalhealthhistwithwhom);
    $("#TextBoxMentalhealthhistreason").val(Mentalhealthhistreason);
    $("#AddPriorOutpatientMentalHealthServices").attr("onclick", "EditExistingRowPriorOutpatientMentalHealthServices();return false;");
    $("#AddPriorOutpatientMentalHealthServices").addClass("editRow");
    $("#AddPriorOutpatientMentalHealthServices").text("Edit");

    return false;
}
function DeleteEditPriorOutpatientMentalHealthServices(object) {
    var table = $('#PriorMentalHealthServices').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddPriorOutpatientMentalHealthServices").attr("onclick") != undefined) {
        $("#AddPriorOutpatientMentalHealthServices").removeAttr("onclick");
        $("#AddPriorOutpatientMentalHealthServices").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    return false;

}
function EditExistingRowPriorOutpatientMentalHealthServices() {
    if ($("#AddPriorOutpatientMentalHealthServices").text() == 'Edit') {
        $("#AddPriorOutpatientMentalHealthServices").text('Add');
    };
    var table = $('#PriorMentalHealthServices').DataTable();
    var currentata = "";
    if (dataTableOutpatientMentalHealthFlg) {
        var rowExists = false;
        var valueCol = $('#PriorMentalHealthServices').DataTable().column(2).data();
        var index = valueCol.length;
        //for (var k = 0; k < index; k++) {
        //    if (valueCol[k].toLowerCase().includes($("#DropDownEstabilishedSupports").find("option:selected").text().trim().toLowerCase())) {
        //        rowExists = true;
        //        currentata = $("#DropDownEstabilishedSupports").find("option:selected").text().trim().toLowerCase();
        //        break;
        //    }
        //}
        if (rowExists) {
            showErrorMessage("option already exist in table");
            return;
        }
        else {
            var data = {
                "Actions": CreateChildBtnWithPermission("EditPriorSubstanceAbuseTreatment", "DeleteEditPriorSubstanceAbuseTreatment"), 

                "Mentalhealthhistwhen": $("#TextBoxMentalhealthhistwhen").val(),
                "Mentalhealthhistwhere": $("#TextBoxMentalhealthhistwhere").val(),
                "Mentalhealthhistwithwhom": $("#TextBoxMentalhealthhistwithwhom").val(),
                "Mentalhealthhistreason": $("#TextBoxMentalhealthhistreason").val(),
                "OutpatientMentalHealthServicesID": $("#TextBoxOutpatientMentalHealthServicesID").val() == undefined ? '' : $("#TextBoxOutpatientMentalHealthServicesID").val(),
            };
            table.row(currentRowMentalHealthServices).data(data).draw(false);
            $("#AddPriorOutpatientMentalHealthServices").removeAttr("onclick");
            $("#AddPriorOutpatientMentalHealthServices").removeClass("editRow");
            showRecordSaved("Prior Outpatient MentalHealth Services edited successfully.");
            clearOutpatientMentalHealth();
        }
    }
    else {
        var rowExists = false;
        var valueCol = $('#PriorMentalHealthServices').DataTable().column(1).data();
        var index = valueCol.length;
        //for (var k = 0; k < index; k++) {
        //    if (valueCol[k].toLowerCase().includes($("#DropDownEstabilishedSupports").find("option:selected").text().trim().toLowerCase())) {
        //        rowExists = true;
        //        currentata = $("#DropDownEstabilishedSupports").find("option:selected").text().trim().toLowerCase();
        //        break;
        //    }
        //}
        //if (rowExists && currentata != EstablishedSupports.trim().toLowerCase()) {
        //    showErrorMessage("option already exist in table");
        //    return;

        //}
        //else {
        var data1 = [
            CreateChildBtnWithPermission("EditPriorSubstanceAbuseTreatment", "DeleteEditPriorSubstanceAbuseTreatment"), 
            //  selectedText.trim(),
            $("#TextBoxMentalhealthhistwhen").val(),
            $("#TextBoxMentalhealthhistwhere").val(),
            $("#TextBoxMentalhealthhistwithwhom").val(),
            $("#TextBoxMentalhealthhistreason").val(),
            $("#TextBoxOutpatientMentalHealthServicesID").val() == undefined ? '' : $("#TextBoxOutpatientMentalHealthServicesID").val(),
        ];
        table.row(currentRowMentalHealthServices).data(data1).draw(false);
        $("#AddPriorOutpatientMentalHealthServices").removeAttr("onclick");
        $("#AddPriorOutpatientMentalHealthServices").removeClass("editRow");
        showRecordSaved("Prior Outpatient MentalHealth Services edited successfully.");
        clearOutpatientMentalHealth();
        //}
    }
}
function GetValueZipCode(current, city, state, county) {
    if ($(current).val() != "") {
        $.ajax({
            type: "GET",
            data: { "ZipCode": $(current).val() },
            url: "https://staging-api.cx360.net/api/Incident/GetZipDetails",
            headers: {
                'Token': token,
            },
            success: function (response) {
                if (response.length > 0) {
                    $("#TextBox" + city).val(response[0].City);
                    $("#TextBox" + state).val(response[0].State);
                    $("#TextBox" + county).val(response[0].County);
                }
                else {
                    $("#TextBox" + city).val("");
                    $("#TextBox" + state).val("");
                    $("#TextBox" + county).val("");
                }
            },
            error: function (xhr) { HandleAPIError(xhr) }
        });
    }
};
function clearFamilyMembersFields() {
    $(".familyConstellation").val("");
    $("input[name=RadioFamilyMemberInHome]").prop('checked', false);
}
function clearPriorSubstanceAbuseTreatment() {
    $(".SubstanceAbuse").val("");
    // $("input[name=RadioFamilyMemberInHome]").prop('checked', false);
}
function clearOutpatientMentalHealth() {
    $(".OutpatientMentalHealth").val("");
    // $("input[name=RadioFamilyMemberInHome]").prop('checked', false);
}
function clearEstabilishedSupports() {
    $(".esSupports").val("");
}
function ValidateGeneralInformation() {
    var checked = null;
    $(".generalForm .req_feild").each(function () {
        if ($(this).attr("type") == "radio") {
            var radio = $(this).attr("name");
            if ($('input[name=' + radio + ']:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if ($(this).attr("type") == "checkbox") {
            if ($('input[type=checkbox]:checked').length == 0) {
                $(this).parent().parent().parent().next().children().removeClass("hidden");
                $(this).focus();
                checked = false;
                return checked;
            }
        }
        else if ($(this).val() == "" || $(this).val() == "-1") {
            $(this).siblings("span.errorMessage").removeClass("hidden");
            $(this).focus();
            checked = false;
            return checked;
        }
    });
    if (checked == null) {
        return true;
    }
}

function CloseErrorMessage() {

    $('select').click(function () {
        if ($(this).hasClass("req_feild") && ($(this).val() != '' || $(this).val() > 1)) {
            $(this).siblings("span.errorMessage").addClass("hidden");
        }
    });
    $('input').blur(function () {
        if ($(this).attr("type") == "radio" && $(this).hasClass("req_feild")) {
            var radio = $(this).attr("name");
            $('input[name=' + radio + ']').change(function () {
                $(this).parent().parent().parent().next().children().addClass("hidden");

            })
        }
        else if ($(this).attr("type") == "checkbox" && $(this).hasClass("req_feild")) {
            $('input[type=checkbox').change(function () {
                $(this).parent().parent().parent().next().children().addClass("hidden");

            })
        }
        else if ($(this).hasClass("req_feild")) {
            $(this).siblings("span.errorMessage").addClass("hidden");

        }
    })
    $('textarea').blur(function () {
        $(this).siblings("span.errorMessage").addClass("hidden");
    })
    $('span').click(function () {
        $(this).siblings("span.errorMessage").addClass("hidden");
    })
}

function BindGeneralInformationFamilyMembers(json) {
    var table = $('#MembersFamilyConstellation').DataTable();
    table.clear();
    $('#MembersFamilyConstellation').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [5] }
        ],
        "aaData": JSON.parse(json),
        "columns": [{ "data": "Actions" }, { "data": "FamilyMemberName" }, { "data": "FamilyMemberAge" }, { "data": "FamilyMemberRelation" }, { "data": "FamilyMemberInHome" }, { "data": "GeneralInfoFamilyMembersId" }]
    });
    dataTableFamilyMembersFlg = true;
}
function BindChildTable(result, className) {
    if (className == 'SubstanceUseHistory') {
        var table = $('#PriorSubstanceAbuseTreatment').DataTable();
        table.clear();
        $('#PriorSubstanceAbuseTreatment').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildFirstData),
            "columns": [{ "data": "Actions" }, { "data": "Subabusehistwhen" }, { "data": "Subabusehistwhere" }, { "data": "Subabusehistwithwhom" }, { "data": "Subabusehistreason" }, { "data": "SubstanceAbuseTreatmentID" }]
        });
        dataTableSubstanceAbuseTreatmentFlg = true;
    }
    else if (className == 'PsychiatricInformation') {
        var table = $('#PriorMentalHealthServices').DataTable();
        table.clear();
        $('#PriorMentalHealthServices').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildFirstData),
            "columns": [{ "data": "Actions" }, { "data": "Mentalhealthhistwhen" }, { "data": "Mentalhealthhistwhere" }, { "data": "Mentalhealthhistwithwhom" }, { "data": "Mentalhealthhistreason" }, { "data": "OutpatientMentalHealthServicesID" }]
        });
        dataTableOutpatientMentalHealthFlg = true;

    }
    else if (className == 'DsmDiagnosis') {
        var table = $('#diagnosis').DataTable();
        table.clear();
        $('#diagnosis').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [1,6] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildFirstData),
            "columns": [{ "data": "Actions" }, { "data": "DiagnosisCode" }, { "data": "DiagnosticCodeDescription" }, { "data": "ICD5Name" }, { "data": "ICD10Name" }, { "data": "Diagnosis" }, { "data": "DsmDiagnosisID" }]
        });
        dataTableDiagnosisFlg = true;

    }
    else if (className == 'Medication') {
        var table = $('#medication').DataTable();
        table.clear();
        $('#medication').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [7] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildFirstData),
            "columns": [{ "data": "Actions" }, { "data": "MedicationName" }, { "data": "MedicationPrescriberName" }, { "data": "MedicationDosage" }, { "data": "MedicationPrescriptionBeginDate" }, { "data": "MedicationPrescriptionEndDate" }, { "data": "MedicationIssues" }, { "data": "MedicationDetailID" }]
        });
        dataTableMedicationFlg = true;

    }
    else if (className == 'MedicalHistory') {
        var table = $('#PsychiatricallyHospitalized').DataTable();
        table.clear();
        $('#PsychiatricallyHospitalized').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildFirstData),
            "columns": [{ "data": "Actions" }, { "data": "PsychHospitalName" }, { "data": "PsychHospitalLocation" }, { "data": "PsychHospitalizationDate" }, { "data": "ReasonHospitalizedPsych" }, { "data": "MedicalHistoryPsychHospitalID" }]
        });
        dataTablePsychiatricallyHospitalizedFlg = true;

        var table2 = $('#additionalHospitalizations').DataTable();
        table2.clear();
        $('#additionalHospitalizations').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [5] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildSecondData),
            "columns": [{ "data": "Actions" }, { "data": "HospitalName" }, { "data": "HospitalLocation" }, { "data": "HospitalizationDate" }, { "data": "ReasonHospitalized" }, { "data": "MedicalHistoryAdditHospitalID" }]
        });
        dataTableAdditionalHospitalizationsFlg = true;

        var table3 = $('#specialtiesProviders').DataTable();
        table3.clear();
        $('#specialtiesProviders').DataTable({
            "stateSave": true,
            "bDestroy": true,
            "paging": false,
            "searching": false,
            'columnDefs': [
                { 'visible': false, 'targets': [4] }
            ],
            "aaData": JSON.parse(result.CommonCANSRsponse[0].JSONChildThirdData),
            "columns": [{ "data": "Actions" }, { "data": "ProviderName" }, { "data": "ProviderSpecialty" }, { "data": "ProviderServices" }, { "data": "MedicalHistoryProviderID" }]
        });
        dataTableProviderFlg = true;
    }
}
function BindGeneralInformationEstabilsihedSupports(json) {
    var table = $('#establishedSupports').DataTable();
    table.clear();
    $('#establishedSupports').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "paging": false,
        "searching": false,
        'columnDefs': [
            { 'visible': false, 'targets': [1, 7] }
        ],
        "aaData": JSON.parse(json),
        "columns": [{ "data": "Actions" }, { "data": "EstabilishedSupportsType" }, { "data": "EstabilishedSupports" }, { "data": "EsAgency" }, { "data": "EsContact" }, { "data": "EsPhone" }, { "data": "EsEmail" }, { "data": "GeneraInfoEstabilishedSupportsId" }]
    });
    dataTableEstabilishedSupportsFlg = true;
}




function InsertModifyTraumaExposure() {
    if ($("#BtnTraumaExposureOk").text() == "Edit") {
        $('.traumaExposure .form-control').attr("disabled", false);
        $('.traumaExposure  input[type=radio]').prop("disabled", false);
        $("#BtnTraumaExposureOk").text("Ok");
        return;
    }

    var json = [],
        item = {},

        tag;

    //  if (!validateMeetingHistoryTab()) return;
    //if (!ValidateGeneralInformation()) return;
    $('.traumaExposure .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithDiffCheckBox(tag, this);
            }

        }
    });
    item["GeneralInformationId"] = $("#TextBoxGeneralInformationId").val();
    item["CansVersioningID"] = $("#TextBoxCansVersioningID").val();
    json.push(item)


    $.ajax({
        type: "POST",
        data: { TabName: "TraumaExposure", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYGENERALINFORMATION"),
        headers: {
            'Token': _token
        },
        success: function (result) {
            TraumaExposureSectionSaved(result)

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function TraumaExposureSectionSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.CommonCANSRsponse[0].TraumaExposureID > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxTraumaExposureID").val(result.CommonCANSRsponse[0].TraumaExposureID);
            $('.traumaExposure .form-control').prop("disabled", true);
            if ($("#BtnTraumaExposureOk").text() == 'Ok') {
                $("#BtnTraumaExposureOk").text('Edit');
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}

function HandleStartSection(parentClass) {
    if (documentMode == "Published") {
        $("." + parentClass).hide();
    }
    else {
        $("." + parentClass).find(".bgStart").show();
        $("." + parentClass).find(".bgProgress").hide();
        $("." + parentClass).find(".bgInprogress").hide();
    }
}

function HandleCompleteSection(parentClass) {
    if (documentMode == "Published") {
        $(".bgStart").hide();
        $(".bgProgress").hide();
        $(".bgInprogress").hide();
    }
    else {
        $("." + parentClass).find(".bgStart").hide();
        $("." + parentClass).find(".bgProgress").show();
        $("." + parentClass).find(".bgInprogress").hide();
    }
}
function HandleInprogressSection(parentClass) {
    if (documentMode == "Published") {
        $(".bgStart").hide();
        $(".bgProgress").hide();
        $(".bgProgress").hide();
    }
    else {
        $("." + parentClass).find(".bgStart").hide();
        $("." + parentClass).find(".bgProgress").hide();
        $("." + parentClass).find(".bgInprogress").show();
    }
}

function InsertUpdatePresentingProblemAndImpact() {
    if ($("#BtnPresentingProblemAndImpactOk").text() == "Edit") {
        $('.presentingFuntioning .form-control').attr("disabled", false);
        $('.presentingFuntioning  input[type=radio]').prop("disabled", false);
        $("#BtnPresentingProblemAndImpactOk").text("Ok");
        return;
    }
    var json = [],
        item = {},
        tag;

    //  if (!validateMeetingHistoryTab()) return;
    //if (!ValidateGeneralInformation()) return;
    $('.presentingFuntioning .form-control').each(function () {
        tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "");
        if ($(this).hasClass("required")) {
            if ($(this).val() == "") {
                item[tag] = $(this).val(-1);
            }
            else {
                item[tag] = $(this).val();
            }
        }
        else {
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag] = $(this).val();
                else { }
            }
            else {
                item[tag] = jsonWrapperWithDiffCheckBox(tag, this);
            }

        }
    });
    item["GeneralInformationId"] = $("#TextBoxGeneralInformationId").val();
    item["CansVersioningID"] = $("#TextBoxCansVersioningID").val();
    json.push(item)
    $.ajax({
        type: "POST",
        data: { TabName: "PresentingProblemAndImpact", Json: JSON.stringify(json), ReportedBy: reportedBy },
        url: GetAPIEndPoints("INSERTMODIFYGENERALINFORMATION"),
        headers: {
            'Token': _token
        },
        success: function (result) {
            PresentingProblemImpactSectionSaved(result)

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function PresentingProblemImpactSectionSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.CommonCANSRsponse[0].PresentinProblemAndImpactID > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxPresentinProblemAndImpactID").val(result.CommonCANSRsponse[0].PresentinProblemAndImpactID);
            $('.presentingFuntioning .form-control').prop("disabled", true);
            if ($("#BtnPresentingProblemAndImpactOk").text() == 'Ok') {
                $("#BtnPresentingProblemAndImpactOk").text('Edit');
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}


function SubstanceUseHistorySectionSaved(result) {
    if (result.Success == true && result.IsException == false) {
        if (result.CommonCANSRsponse[0].SubstanceUseHistoryID > -1) {
            showRecordSaved("Record saved successfully");
            $("#TextBoxSubstanceUseHistoryID").val(result.CommonCANSRsponse[0].SubstanceUseHistoryID);
            $('.presentingHistory .form-control').prop("disabled", true);
            if ($("#BtnSubstanceUseHistoryOk").text() == 'Ok') {
                $("#BtnSubstanceUseHistoryOk").text('Edit');
            }
        }
    }
    else {

        showErrorMessage(result.Message);
    }
}



function InsertModifyCANSAssessment(parentClass) {
    className = parentClass;
    if ($("#Btn" + parentClass + "Ok").text() == "Edit") {
        $('.' + parentClass + ' .form-control').attr("disabled", false);
        $('.' + parentClass + '  input[type=radio]').prop("disabled", false);
        $("#Btn" + parentClass + "Ok").text("Ok");
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        return;
    }
 
    doConfirm("Have you completed the section ?", function yes() {
        sectionStatus = "Completed";
        InsertModifySectionTabs(parentClass);
    }, function no() {
        sectionStatus = "Inprogress"
        InsertModifySectionTabs(parentClass);
    });


}
//#endregion


//#region section 18 signatures
function ValidateStaffSignatures() {
    $(document).on("change", '.epinPassword', function () {
        if ($(this).val() != "") {
            var $id ="#"+ $(this).attr('id');
            $.ajax({
                type: "GET",
                data: { "EPIN": $("#"+$(this).attr("id")).val() },
                url: Cx360URL + "/api/Client/ValidateEPIN",
                headers: {
                    'Token': token,
                },
                success: function (response) {
                    if (response.length > 0) {
                        var date = new Date();
                       
                        $("#TextBox" + $($id).attr("staff-type")+"StaffName").val(response[0].FirstName + " , " + response[0].LastName);
                        $("#TextBox" + $($id).attr("staff-type") +"StaffTitle").val(response[0].Title);
                        $("#TextBox" + $($id).attr("staff-type") +"SignedDateTime").val(formatDate(date, 'MM/dd/yyyy hh:mm a'));
                    }
                    else {
                        $("#TextBox" + $($id).attr("staff-type") + "StaffName").val("");
                        $("#TextBox" + $($id).attr("staff-type") + "StaffTitle").val("");
                        $("#TextBox" + $($id).attr("staff-type") + "SignedDateTime").val("");
                    }
                },
                error: function (xhr) {
                    HandleAPIError(xhr); $(this).val("");
                    $("#TextBox" + $($id).attr("staff-type") + "StaffName").val("");
                    $("#TextBox" + $($id).attr("staff-type") + "StaffTitle").val("");
                    $("#TextBox" + $($id).attr("staff-type") + "SignedDateTime").val("");
                }

            });
        }
    });
}
function AddSignaure(sigValue, sigDisplay) {
    // This is the part where jSignature is initialized.
    sigValueId = sigValue;
    sigDisplayId = sigDisplay;
    $("#ModalJSignature").modal("show");
    $("#Signature").resize();
}
function ResetSignature() {
    $sigdiv.jSignature('reset');
}
function InsertSignature() {
    var data = $sigdiv.jSignature('getData', 'image');
    var signaturLength = $sigdiv.jSignature('getData', 'native').length;

    if (signaturLength > 0) {
        var date = new Date();
        $("#" + sigValueId).val(data[1]);
        $("#" + sigDisplayId).attr("src", 'data:' + data[0] + ',' + data[1]).removeClass("hidden");
        $("#" + sigValueId + "Date").val(formatDate(date, 'MM/dd/yyyy hh:mm a'));
    }
    else {
        $("#" + sigValueId).val("");
        $("#" + sigValueId + "Date").val("");
        $("#" + sigDisplayId).attr("src", '').addClass("hidden");
    }
    $sigdiv.jSignature('reset');
    $("#ModalJSignature").modal("hide");
}
function CloseSigModal() {
    $sigdiv.jSignature('reset');
  

    $("#ModalJSignature").modal("hide");
}
//#endregion

//#region import export xml 
function ImportExportXML() {
    var data = {
        "BeginDate": "2020-11-19",
        "EndDate": "2020-11-20",
        "ImportType": "HFSStaging",
        "RecordTotal": 0,
        "RunType": 0,
        "ReportedBy": reportedBy   
    }

    jQuery.ajax({
        url: GetAPIEndPoints("GENERATEANDIMPORTXML"),
        cache: false,
        data: data,
        type:"POST",
        xhrFields: {
            responseType: 'blob'
        },
        success: function (response) {
            const blob = new Blob([response], { type: 'application/xml' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "HFS"+"_" + getFormattedTime() + ".xml";
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(a);
            }, 0);
        },
        error: function (xhr) {
            showErrorMessage("no publised record exists or internal server error.");
        }
    });
}
//#endregion

//#region Pdf 
function DownloadPDFCANSAssessmentPlan() {
    var data = {
        TabName: "PrintCANSAssessment", GeneralInformationId: $("#TextBoxGeneralInformationId").val(), AssessmentVersioningId: $("#TextBoxAssessmentVersioningId").val(), ReportedBy: reportedBy
    };

    fetch(GetAPIEndPoints("GETCANSASSESSMENTPDFTEMPLATE"), {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Token': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5"
        },
    })
        .then(response => response.blob())
        .then(response => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const downloadUrl = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "cans_assessment_1_" + $("#TextBoxGeneralInformationId").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        })
}
//#endregion
