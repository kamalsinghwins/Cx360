var parentClass = "";
var _age, _companyID;
var sectionStatus;
var counter = 2;
var medicationsCounter = 0;
var dataTableGuardianshipAndAdvocacysFlg = false;
var editPermission = "true", deletePermission = "true";
var base64 = "";
var json = [];
var jsonChildFirstTable = [];
var jsonChildSecondTable = [];
var item = {};
var countUnknown = 0;
var prevElementVal = "";
var unknownCountArray = [];
var circleOfSupport = "[{\n\t\"CircleofSupportContact\": \"Contact1\",\n\"ContactID\":\"1\",\n\t\"ContactPhoneNumber\": \"123456789\",\n\t\"ContactAddressLine1\": \"AddressLine1\",\n\t\"ContactAddressLine2\": \"AddressLine2\",\n\t\"ContactCity\": \"ContactCity\",\n\t\"ContactState\": \"ContactState\",\n\t\"ContactZIPCode\": \"ContactZIPCode\",\n\t\"TypeofContact\": \"Professional\",\n\t\"RelationshipToMember\": \"RelationshipToMember\"\n}, {\n\t\"CircleofSupportContact\": \"Contact2\",\n\"ContactID\":\"2\",\n\t\"ContactPhoneNumber\": \"123456789\",\n\t\"ContactAddressLine1\": \"AddressLine12\",\n\t\"ContactAddressLine2\": \"AddressLine22\",\n\t\"ContactCity\": \"ContactCity2\",\n\t\"ContactState\": \"ContactState2\",\n\t\"ContactZIPCode\": \"ContactZIPCode\",\n\t\"TypeofContact\": \"Professional\",\n\t\"RelationshipToMember\": \"RelationshipToMember\"\n}, {\n\t\"CircleofSupportContact\": \"Contact2\",\n\"ContactID\":\"3\",\n\n\t\"ContactPhoneNumber\": \"123456789\",\n\t\"ContactAddressLine1\": \"AddressLine12\",\n\t\"ContactAddressLine2\": \"AddressLine22\",\n\t\"ContactCity\": \"ContactCity2\",\n\t\"ContactState\": \"ContactState2\",\n\t\"ContactZIPCode\": \"ContactZIPCode\",\n\t\"TypeofContact\": \"Other\",\n\t\"RelationshipToMember\": \"RelationshipToMember\"\n}]";
var commonId = '', _diagnosis, _medications;
var clientId, _commonToken = "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5";
$(document).ready(function () {

    comprehensiveAssessmentId = GetParameterValues('CCOComprehensiveAssessmentId');
    assessmentVersioiningId = GetParameterValues('CCOAssessmentVersioningId');
    if (comprehensiveAssessmentId > 0 && assessmentVersioiningId > 0) {
        ManageCCOComprehensiveAssessment(comprehensiveAssessmentId);
    }
    else {
        setTimeout(function () {
            IntializeDataTables();
            BindDropDowns();
            BindDiagnosis();
            BindCircleOfSupport();
            CloseErrorMeeage();
            InitalizeDateControls();
            $('.bgStart').show();
            DisableSaveButtonChildSection();
            ValidateUploadedFile();
            BindCircleAndSupportTable();
            $(".loader").hide();
            // CircleAndSupportSection(result);   
        }, 5000);
       
    }

    $(".close").click(function () {
        $(this).closest("span").addClass("hidden");
    });
    $('.btn-link').click(function (e) {
        var id = this.dataset.target;
        if ($(id).hasClass('show')) {
            $('.collapse').removeClass('show');
            $(id).removeClass('show');
            $(id).addClass('hide');
        }
        else {
            $('.collapse').removeClass('show');
            $(id).removeClass('hide');
            $(id).addClass('show');
        }
    });
});

function IntializeDataTables() {
    $('#GuardianshipAndAdvocacy').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "searching": false,
        "autoWidth": false,
        'columnDefs': [
            { 'visible': false, 'targets': [6, 7, 8, 9, 10, 11, 12] }
        ]
    });
    $('#CircleOfSupport').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "searching": false,
        "autoWidth": false,
        'columnDefs': [
            { 'visible': false, 'targets': [1] }
        ]
    });
    $('#tblCircleOfSupport').DataTable({
        "stateSave": true,
        "bDestroy": true,
        "searching": false,
        "autoWidth": false,
        'columnDefs': [
            { 'visible': false, 'targets': [1] }
        ]
    });


    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');

}
function OpenOfflinePdf() {
    var url = "Assessts/OfflinePDF/CCO_ComprehensiveAssessment.pdf";
    window.open(url);
}
function ValidateUploadedFile() {
    $('#TextBoxUploadPdf').on('change', function () {
        var fileExtension = 'pdf';
        if ($(this).val().substr($(this).val().lastIndexOf('.')).toLowerCase() != ".pdf") {
            showErrorMessage("Please select the pdf file.");
            return false;
        }
        else {
            var fileName = $('#TextBoxUploadPdf')[0].files.length ? $('#TextBoxUploadPdf')[0].files[0].name : "";
            $("#uploadFile").val(fileName);
            return true;
        }
    });
    return true;
}
function handleFileSelect(evt) {
    var f = evt.target.files[0]; // FileList object
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            var binaryData = e.target.result;
            //Converting Binary Data to base 64
            base64 = window.btoa(binaryData);
        };
    })(f);
    reader.readAsBinaryString(f);
}

function UploadStateFormPDF() {

    if ($("#btnUploadPDf").text() == 'Edit') {
        $('.uploadPDF .form-control').prop("disabled", false);
        $("#btnUploadPDf").text('Ok');
        return;
    }
    if (!ValidateUploadPDF()) return;
    var json = [],
        item = {};
    var data = new FormData();
    var files = $("#TextBoxUploadPdf").get(0).files;
    if ($("#TextBoxCCOUplaodPDFId").val() != "") {
        data.append('CCOUplaodPDFId', $("#TextBoxCCOUplaodPDFId").val());
    }
    if (files.length > 0) {
        data.append("File", files[0]);
    }
    data.append('ReportedBy', reportedBy);
    data.append('ClientId', GetParameterValues('ClientId'));
    $.ajax({
        type: "POST",
        url: GetAPIEndPoints("UPLOADOFFLINEPDF"),
        contentType: false,
        processData: false,
        data: data,
        headers: {
            'TOKEN': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            DocumentUploaded(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function DocumentUploaded(result) {
    var stringyfy = JSON.stringify(result.AllTabsComprehensiveAssessment);
    $("#TextBoxCCOUplaodPDFId").val(result.AllTabsComprehensiveAssessment[0].CCOUplaodPDFId);
    $('.uploadPDF .form-control').prop("disabled", true);
    if ($("#btnUploadPDf").text() == "Ok") {
        $("#btnUploadPDf").text("Edit");
    }
    showRecordSaved("PDF uploaded successfully.");
}

function ValidateUploadPDF() {
    if ($("#TextBoxUploadPdf").val() == "") {
        $("#TextBoxUploadPdf").siblings("span.errorMessage").removeClass("hidden");
        showErrorMessage("Please Select File");
        return false;
    }
    return true;
}
function InitalizeDateControls() {
    InitCalendar($(".date"), "date controls");
    $('.time').timepicker(getTimepickerOptions());
    $('.time').on("timeFormatError", function (e) { timepickerFormatError($(this).attr('id')); });
}
function BindDropDowns() {
    token = _token;
    reportedBy = _userId;

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
function BindDiagnosis() {
    const div = document.createElement('div');
    div.innerHTML = "No Records Found";
    document.getElementById('activeDiagnosis').append(div);

    token = _token;
    $.ajax({
        type: "GET",
        data: { "FormName": "Diagnosis Codes", "Criteria": "1=1" },
        url: Cx360URL + '/api/Common/GetList',
        headers: {
            'TOKEN': token
        },
        success: function (response) {
            if (response != 'undefined') {
                $('#activeDiagnosis').empty();
                _diagnosis = response;
                ActiveDiagnosis(response);

            }
            else {
                const div = document.createElement('div');
                div.innerHTML = "No Records Found";
                document.getElementById('activeDiagnosis').append(div);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function BindCircleOfSupport() {
    var circleOfSupportJSON = JSON.parse(circleOfSupport);
    // var actionContent="<button type='button' class='btn commonBtn btnCommon btn-font-size' onclick='ModifyProfessionaContact()'>";
    clientId = $("#DropDownClientId").val() == "" ? GetParameterValues('ClientId') : $("#DropDownClientId").val();
    $.ajax({
        type: "Get",
        url: 'https://staging-api.cx360.net/api/Incident/GetContactsandCircleofSupport?ClientID=' + clientId + '',
        headers: {
            'Token': "5nbcWSMDrRJjsdyjrACopeL67Bk6SjhFbo9jGVeCjIlKvmLiA0dlTYERs6hrhC8PCu7Tyr/YzB1XTdc3Of6w6A==",
        },
        success: function (result) {
            result.filter(function (contact) { return contact.ContactType == "Professional" }).
                map(function (contact1) {
                    return contact1.Actions = "<button type='button' class='btn commonBtn btnCommon btn-font-size' onclick='ModifyProfessionalContact(" + contact1.ContactID + ");return false;'>Modify</button>";
                });
            result.filter(function (contact) { return contact.ContactType != "Professional" }).
                map(function (contact) {
                    return contact.Actions = "";
                });
            //$('#CircleOfSupport').DataTable({
            //    "stateSave": true,
            //    "bDestroy": true,
            //    "searching": false,
            //    "autoWidth": false,
            //    'columnDefs': [
            //        { 'visible': false, 'targets': [1] }
            //    ],
            //    "aaData": result,
            //    "columns": [{ "data": "Actions" }, { "data": "ContactID" }, { "data": "LastName" }, { "data": "ContactPhoneNumber" }, { "data": "Address Line 1" }, { "data": "Address Line 2" }, { "data": "City" }, { "data": "State" }, { "data": "Zip Code" }, { "data": "ContactType" }, { "data": "RelationshipToMember" }]
            //});
            if (result.length > 0) {
                if (result.length > 0) {
                    $('#tblCircleOfSupport').DataTable({
                        "stateSave": true,
                        "bDestroy": true,
                        "paging": true,
                        "searching": true,
                        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                        "aaData": result,
                        "columns": [{ "data": "LastName" }, { "data": "ContactType" }, { "data": "Relationship" }, { "data": "OrganizationName" }, { "data": "EffectiveFrom" }, { "data": "EffectiveTo" }]
                    });
                    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                }
            }

        },
        error: function (xhr) {
            showErrorMessage("Record Not Found");
        }
    });
}
function ActiveDiagnosis(response) {
    //DiagnosisID = 3
    for (let i = 0; i < counter; i++) {
        const div = document.createElement('div');
        div.innerHTML = "";
        div.innerHTML = "<div class='medicalHealth parentMedictions mainLayout'><div class='row'><div class='col' hidden><label>Medication List ID:</label><input type='text' name='TextBoxDiagnosisId'" + i + " id='TextBoxDiagnosisId' class='form-control medication medical' value='" + response[i].DiagnosisID + "'  readonly/></div><div class='col'><label>Diagnosis Date:</label><input type='text'  class='form-control' value='26-02-2021'readonly/></div>" +
            "<div class='col'><label>Code:</label><input type='text' class='form-control' value='" + response[i].DiagnosisCode + "'  readonly/></div><div class='col'><label>Description:</label><input type='text' class='form-control' value='" + response[i].DiagnosisDescription + "'  readonly/></div></div>" +
            "<div class='row'><div class='col'><label>Type:</label><input type='text' class='form-control' value='" + response[i].DiagnosisType + "'  readonly/></div><div class='col'><label>Diagnosed By:</label><input type='text' class='form-control' value='test'readonly/></div>" +
            "<div class='col'><label>Expiration Date:</label><input type='text' class='form-control' value='26-02-2021'readonly/>" +
            "</div></div><hr />" + medicalHealthFormat(i) + "</div>" +
            "";
        document.getElementById('activeDiagnosis').append(div);

        // const div1 = document.createElement('div');
        // div1.innerHTML="";
        // div1.innerHTML=medicalHealthFormat();   
        // document.getElementById('activeDiagnosis').appendChild(div1);
    }

}
function medicalHealthFormat(i) {

    return "<div class=''><div class='row'><div class='col-sm-6'><div class='rowData'>" +
        " <label class='labelAlign lineHeightAligh'><span class='red'>* </span> " +
        " Have any of the " +
        " member's symptoms gotten worse since onset of " +
        " condition? " +
        "</label> " +
        "<div class='form-group'> " +
        "<input type='text' " +
        " name='TextBoxMedicalHealthDiagnosisId" + i + "'" +
        "  id='TextBoxMedicalHealthDiagnosisId'" +
        " class='req_feild form-control medical' hidden /> " +
        " <ul class='hasListing1'> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Yes " +
        " <input type='radio' value='1' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        //onkeypress="CloseErrorMeeage('memberProviders')"
        " name='RadioMemSymptomsGottenWorse" + i + "' " +
        " id='RadioMemSymptomsGottenWorse' " +

        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " No " +
        " <input type='radio' value='2' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemSymptomsGottenWorse" + i + "' " +
        " id='RadioMemSymptomsGottenWorse' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Unknown " +
        " <input type='radio' value='3' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemSymptomsGottenWorse" + i + "' " +
        " id='RadioMemSymptomsGottenWorse' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " " +
        " </ul> " +
        "<div class='col - md - 6 col - sm - 12'>" +
        "<span class='errorMessage hidden' >" +
        "This field is required" +
        "<i class='fa fa-times close' aria - hidden='true'></i >" +
        "</span >" +
        "</div >" +
        "</div> " +
        "</div> " +
        "</div> " +
        "<div class='col-sm-6'><div class='rowData'>" +
        " <label class='labelAlign lineHeightAligh'><span class='red'>* </span> " +
        " Has the member " +
        " experienced any new symptoms since onset of " +
        " diagnosis? " +
        "</label> " +
        "<div class='form-group mb-0'> " +
        " <ul class='hasListing1'> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Yes " +
        " <input type='radio' value='1' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemNewSymptoms" + i + "' " +
        " id='RadioMemNewSymptoms' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " No " +
        " <input type='radio' value='2' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemNewSymptoms" + i + "'' " +
        " id='RadioMemNewSymptoms ' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Unknown " +
        " <input type='radio' value='3' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemNewSymptoms" + i + "' " +
        " id='RadioMemNewSymptoms' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " " +
        " </ul> " +
        "<div class='col - md - 6 col - sm - 12'>" +
        "<span class='errorMessage hidden' >" +
        "This field is required" +
        "<i class='fa fa-times close' aria - hidden='true'></i >" +
        "</span >" +
        "</div >" +
        "</div> " +
        "</div> " +
        "</div> " +
        "<div class='col-sm-6'><div class='rowData'>" +
        "<label class='labelAlign lineHeightAligh'><span class='red'>* </span> " +
        " Is the member " +
        " experiencing financial, transportation, or other " +
        " barriers to " +
        " being able to follow their physician's " +
        " recommendations for " +
        " this condition? " +
        "</label> " +
        "<div class='form-group mb-0'> " +
        " <ul class='hasListing1'> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " No Concerns at this time " +
        " <input type='radio' value='1' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemFinacTranspOtherBarriers" + i + "' " +
        " id='RadioMemFinacTranspOtherBarriers' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Financial " +
        " <input type='radio' value='2' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemFinacTranspOtherBarriers" + i + "' " +
        " id='RadioMemFinacTranspOtherBarriers' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Transportation " +
        " <input type='radio' value='3' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemFinacTranspOtherBarriers" + i + "' " +
        " id='RadioMemFinacTranspOtherBarriers' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Other " +
        " <input type='radio' value='4' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioMemFinacTranspOtherBarriers" + i + "' " +
        " id='RadioMemFinacTranspOtherBarriers' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " </ul> " +
        "<div class='col - md - 6 col - sm - 12'>" +
        "<span class='errorMessage hidden' >" +
        "This field is required" +
        "<i class='fa fa-times close' aria - hidden='true'></i >" +
        "</span >" +
        "</div >" +
        "</div> " +
        "</div> " +
        "</div> " +
        "<div class='col-sm-6'><div class='rowData'>" +
        "<label class='labelAlign lineHeightAligh'><span class='red'>* </span> " +
        " Does this condition interfere with the individual's ability to perform activies of daily living, including leisure skills or activities? " +
        "</label> " +
        "<div class='form-group mb-0'> " +
        " <ul class='hasListing1'> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Yes " +
        " <input type='radio' value='1' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioIndvAbilityToDailyLiving" + i + "' " +
        " id='RadioIndvAbilityToDailyLiving' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " No " +
        " <input type='radio' value='2' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioIndvAbilityToDailyLiving" + i + "' " +
        " id='RadioIndvAbilityToDailyLiving' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " <li> " +
        " <label class='checkboxField'> " +
        " Unknown " +
        " <input type='radio' value='3' " +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medicalHealth" + "'" + ")" +
        " name='RadioIndvAbilityToDailyLiving" + i + "' " +
        " id='RadioIndvAbilityToDailyLiving' " +
        " class='req_feild form-control memberCurrentDiagnoses medical' /> " +
        " <span class='checkmark'></span> " +
        " </label> " +
        " </li> " +
        " </ul> " + "<div class='col - md - 6 col - sm - 12'>" +
        "<span class='errorMessage hidden' >" +
        "This field is required" +
        "<i class='fa fa-times close' aria - hidden='true'></i >" +
        "</span >" +
        "</div >" +
        "</div> " +
        "</div> " +
        "</div></div></div>";
}
function medicationsFormat(i) {
    return "<div><div class='row'><div class='col-md-6'><div class='rowData'>" +
        "<label class='labelAlign lineHeightAligh'>" +
        " <span class='red'>*</span>PRN Medication?" +
        " </label>" +
        "<div class='form-group'>" +
        "<input type='text' " +
        " name='TextBoxMedicationId" + i + "'" +
        "  id='TextBoxMedicationId'" +
        " class='req_feild form-control medication' hidden/> " +
        " <ul class='hasListing1'>" +
        " <li>" +
        " <label class='checkboxField'>" +
        " Yes" +
        " <input type='radio' value='1'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        " name='RadioPRNMedication" + i + "'" +
        "  id='RadioPRNMedication'" +
        " class='req_feild form-control medication' />" +
        "<span class='checkmark'></span>" +
        " </label>" +
        "</li>" +
        " <li>" +
        " <label class='checkboxField'>" +
        "       No" +
        " <input type='radio' value='2'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "   name='RadioPRNMedication" + i + "'" +
        "    id='RadioPRNMedication'" +
        "    class='req_feild form-control medication' />" +
        " <span class='checkmark'></span>" +
        "</label>" +
        " </li>" +
        " </ul>" +
        "<div class='col-md-6'>" +
        "<span class='errorMessage hidden'>" +
        "  This field is" +
        " required<i class='fa fa-times close'" +
        "          aria-hidden='true'></i>" +
        " </span>" +
        " </div>" +
        "</div>" +
        "</div>" +
        " </div>" +
        " <div class='col-md-6'> <div class='rowData'>" +
        " <label class='labelAlign lineHeightAligh'>" +
        "     <span class='red'>*</span>Medication Monitoring" +
        "    Plan?" +
        "</label>" +
        "<div class='form-group'>" +
        " <ul class='hasListing1'>" +
        "     <li>" +
        "       <label class='checkboxField'>" +
        "       Yes" +
        " <input type='radio' value='1'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "   name='RadioMedicationMonitoringPlan" + i + "'" +
        "    id='RadioMedicationMonitoringPlan'" +
        "    class='req_feild form-control medication' />" +
        " <span class='checkmark'></span>" +
        " </label>" +
        "</li>" +
        "<li>" +
        "   <label class='checkboxField'>" +
        "       No" +
        "      <input type='radio' value='2'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "             name='RadioMedicationMonitoringPlan" + i + "'" +
        "            id='RadioMedicationMonitoringPlan'" +
        "            class='req_feild form-control medication' />" +
        "    <span class='checkmark'></span>" +
        "  </label>" +
        " </li>" +
        "</ul>" +
        " <div class='col-md-6'>" +
        "  <span class='errorMessage hidden'>" +
        "     This field is" +
        "     required<i class='fa fa-times close'" +
        "                 aria-hidden='true'></i>" +
        "  </span>" +
        " </div>" +
        "  </div>" +
        "</div>" +
        "</div>" +
        " <div class='col-md-6'><div class='rowData'>" +
        "     <label class='labelAlign lineHeightAligh'>" +
        "       <span class='red'>*</span>Pain Management" +
        "      Medication?" +
        " </label>" +
        " <div class='form-group'>" +
        "    <ul class='hasListing1'>" +
        "      <li>" +
        "       <label class='checkboxField'>" +
        "         Yes" +
        "        <input type='radio' value='1'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "            name='RadioPainManagementMedication" + i + "'" +
        "            id='RadioPainManagementMedication'" +
        "          class='req_feild form-control medication' />" +
        "   <span class='checkmark'></span>" +
        "</label>" +
        "</li>" +
        "<li>" +
        " <label class='checkboxField'>" +
        "    No" +
        "     <input type='radio' value='2'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "           name='RadioPainManagementMedication" + i + "'" +
        "         id='RadioPainManagementMedication'" +
        "         class='req_feild form-control medication' />" +
        "  <span class='checkmark'></span>" +
        " </label>" +
        "</li>" +
        " </ul>" +
        "<div class='col-md-6 col-sm-12'>" +
        "    <span class='errorMessage hidden'>" +
        "        This field is" +
        "      required<i class='fa fa-times close'" +
        "               aria-hidden='true'></i>" +
        " </span>" +
        " </div>" +
        "</div>" +
        "</div>" +
        " </div>" +
        " <div class='col-md-6'> <div class='rowData'>" +
        "    <label class='labelAlign lineHeightAligh'>" +
        "      <span class='red'>*</span>Does the member and/or" +
        "       family" +
        "     understand the use of each medication?" +
        "  </label>" +
        " <div class='form-group'>" +
        "  <ul class='hasListing1'>" +
        "   <li>" +
        " <label class='checkboxField'>" +
        "         Yes" +
        "    <input type='radio' value='1'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "         name='RadioMemUnderstandMedication" + i + "'" +
        "          id='RadioMemUnderstandMedication'" +
        "          class='req_feild form-control medication' />" +
        "    <span class='checkmark'></span>" +
        "   </label>" +
        " </li>" +
        " <li>" +
        "    <label class='checkboxField'>" +
        "       No" +
        "      <input type='radio' value='2'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "           name='RadioMemUnderstandMedication" + i + "'" +
        "        id='RadioMemUnderstandMedication'" +
        "          class='req_feild form-control medication' />" +
        "    <span class='checkmark'></span>" +
        "  </label>" +
        " </li>" +
        "  <li>" +
        "     <label class='checkboxField'>" +
        "        Unknown" +
        "       <input type='radio' value='3'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "             name='RadioMemUnderstandMedication" + i + "'" +
        "             id='RadioMemUnderstandMedication'" +
        "            class='req_feild form-control medication' />" +
        "     <span class='checkmark'></span>" +
        "  </label>" +
        "  </li>" +
        " </ul>" +
        " <div class='col-md-6'>" +
        "    <span class='errorMessage hidden'>" +
        "     This field is" +
        "    required<i class='fa fa-times close'" +
        "               aria-hidden='true'></i>" +
        "  </span>" +
        " </div>" +
        " </div>" +
        "</div>" +
        " </div>" +
        " <div class='col-md-6'><div class='rowData'>" +
        "    <label class='labelAlign lineHeightAligh'>" +
        "     <span class='red'>*</span>Does the individual and/or family feel that the medication is effective at treating its intended condition/illness?" +
        " </label>" +
        " <div class='form-group mb-0'>" +
        "  <ul class='hasListing1'>" +
        "      <li>" +
        "         <label class='checkboxField'>" +
        "           Yes" +
        "           <input type='radio' value='1'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "                name='RadioMemFeelMedicationEffective" + i + "'" +
        "                id='RadioMemFeelMedicationEffective'" +
        "              class='req_feild form-control medication' />" +
        "       <span class='checkmark'></span>" +
        "    </label>" +
        " </li>" +
        "   <li>" +
        "    <label class='checkboxField'>" +
        "       No" +
        "       <input type='radio' value='2'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "              name='RadioMemFeelMedicationEffective" + i + "'" +
        "            id='RadioMemFeelMedicationEffective'" +
        "            class='req_feild form-control medication' />" +
        "      <span class='checkmark'></span>" +
        "   </label>" +
        "     </li>" +
        "    <li>" +
        " <label class='checkboxField'>" +
        "   Unknown" +
        "  <input type='radio' value='3'" +
        "onclick=" + "CloseErrorMeeage(" + "'" + "medications" + "'" + ")" +
        "        name='RadioMemFeelMedicationEffective" + i + "'" +
        "      id='RadioMemFeelMedicationEffective'" +
        "      class='req_feild form-control medication' />" +
        "<span class='checkmark'></span>" +
        " </label>" +
        " </li>" +
        "  </ul>" +
        " <div class='col-md-6 col-sm-12'>" +
        "      <span class='errorMessage hidden'>" +
        "        This field is" +
        "      required<i class='fa fa-times close'" +
        "                 aria-hidden='true'></i>" +
        " </span>" +
        " </div>" +
        " </div>" +
        "</div>" +
        "  </div> </div> </div>";

}
function BindMedications(clientId) {
    $.ajax({
        type: "GET",
        data: { "ClientID": clientId },
        url: Cx360URL + '/api/Incident/GetClientMedication',
        headers: {
            'TOKEN': _token
        },
        success: function (response) {
            if (response != undefined) {
                _medications = response;
                medicationsCounter = response.length;
                BindMedicationsTable(response);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });

}
function BindMedicationsTable(response) {

    if (response.length > 0 && response != null && response != undefined) {
        for (let i = 0; i < response.length; i++) {
            const div = document.createElement('div');
            div.innerHTML = "";
            div.innerHTML = "<div class='medications" + i + " parentMedictions mainLayout medications'><div class='row'><div class='col'><label>Medication List ID:</label><input type='text' id='TextBoxMedicationListId' class='form-control medication' value='" + response[i]["Medication List ID"] + "'  readonly/> </div>" +
                "<div class='col'><label>Medication Brand Name:</label><input type='text' class='form-control medications' value='" + response[i]["Medication Brand Name"] + "'  readonly/></div></div>" +
                "<div class='row'><div class='col'> <label>Medication Generic Name:</label><input type='text' class='form-control medications' value='" + response[i]["Medication Brand Name"] + "'  readonly/></div></div><hr />" + medicationsFormat(i) + "</div>" +
                "";
            document.getElementById('allMadications').append(div);
        }
    }
    else {
        const div = document.createElement('div');
        div.innerHTML = "No Records Found";
        document.getElementById('allMadications').append(div);
    }

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
        var DBO = '';
        if (res.length != 0) {
            DBO = (res[0].BirthDate);
            var limit = DBO.indexOf(' ');
            if (DBO != null) {
                DBO = DBO.slice(0, limit);
                // DBO = DBO.slice(0, limit).split('-');
                //DBO = DBO[1] + '/' + DBO[2] + '/' + DBO[0];
                //DBO = DBO;
            }
        }
        $("#IndividualMiddleName").val(res[0].ClientMiddleName);
        $("#TextBoxIndividualSuffix").val(res[0].ClientSuffix);
        // $("#TextBoxAssessmentDate").val(res[0].AssessmentDate);
        $("#TextBoxAssessmentDate").val(currentDate());
        $("#TextBoxTABSId").val(res[0].TABSID);
        $("#TextBoxMedicaidId").val(res[0].MedicaidID);
        $("#TextBoxDateofBirth").val(DBO);
        $("#TextBoxStreetAddress1").val(res[0].Address1);
        $("#TextBoxStreetAddress2").val(res[0].Address2);
        $("#TextBoxCity").val(res[0].City);
        $("#TextBoxState").val(res[0].State);
        $("#TextBoxZipCode").val(res[0].ZipCode);
        $('#TextBoxPhoneNumber').val(formatPhoneNumberClient(res[0].Phone));
        $("#TextBoxAge").val(res[0].Age);
        $("#TextBoxGender").val(res[0].Gender);
        $("#TextBoxEthnicity").val(res[0].Ethnicity);
        $("#TextBoxRace").val(res[0].Race);
        $("#TextBoxWillowbrookStatus").val(res[0].WillowBrook);
        validateUnknownAndCount(res[0].Ethnicity);
        BindMedications(clientId);
    }
    showHideFieldsBindOnStart();
}
function FillClientDetails(object) {

    var selectedValue = $(object).val();
    var jsonObject = $("#DropDownClientId").attr("josn");
    var parse = jQuery.parseJSON(jsonObject);
    var res = $.grep(parse, function (IndividualName) {
        return IndividualName.ClientID == selectedValue;
    });

}
//#region Save functions tab
function InsertModify(sectionName, _class, tabName) {
    if ($("." + sectionName + " .ComprehensiveAssessmentSaveBtn").text() == "Edit") {
        $("." + sectionName + " .ComprehensiveAssessmentSaveBtn").text("Ok");
        $('.' + sectionName + ' .form-control').attr("disabled", false);
        //$('#imuLifePlan input[type=radio]').prop("disabled", false);
        $("." + sectionName + " .ComprehensiveAssessmentSaveBtn").text("Ok");
        $("." + sectionName + " .lookup").removeAttr('style');
        return;
    }

    json = [];
    jsonChildFirstTable = [];
    jsonChildSecondTable = [];
    item = {};
    if (sectionName == "guardianshipAndAdvocacy") {
        var oTable = $("#GuardianshipAndAdvocacy").DataTable().rows().data();
        if ($('#CheckboxNoActiveGuardian').prop("checked") || $('#CheckboxNotApplicableGuardian').prop("checked")) {
            if (oTable.length == 0) {
                if (!validateMasterSectionTab(sectionName)) return;
            }
        }
    }
    else if (!validateMasterSectionTab(sectionName)) {
        return;
    }


    className = parentClass;
    if ($("#Btn" + parentClass + "Ok").text() == "Edit") {
        $('.' + parentClass + ' .form-control').attr("disabled", false);
        $('.' + parentClass + ' input[type=radio]').prop("disabled", false);
        $("#Btn" + parentClass + "Ok").text("Ok");
        $(".greenColor").prop("disabled", false);
        $(".redColor").prop("disabled", false);
        return;
    }

    if (sectionName != 'masterSection' && sectionName != 'unknown') {

        doConfirm("Have you completed the section ?", function yes() {
            sectionStatus = "Completed";
            InsertModifySectionTabs(sectionName, _class, tabName);
        }, function no() {
            sectionStatus = "Inprogress"
            InsertModifySectionTabs(sectionName, _class, tabName);
        });

    } else {
        InsertModifySectionTabs(sectionName, _class, tabName);
    }


}
function InsertModifySectionTabs(sectionName, _class, tabName) {
    var tag;

    blankComprehensiveAssessmentId = $("#TextBoxCompAssessmentId").val();
    if (sectionName == 'medications') {
        json = GetMedicationsJson(sectionName, _class);
    }
    else if (sectionName == 'guardianshipAndAdvocacy') {
        var oTable = $("#GuardianshipAndAdvocacy").DataTable().rows().data();

        if (oTable.length == 0) {
            item["CompanyId"] = "1";
            item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
            item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
            item["Status"] = sectionStatus;
            json.push(item);
        }
        else {
            item["CompanyId"] = "1";
            item["GuardianshipAndAdvocacyId"] = $("#TextBoxGuardianshipAndAdvocacyId").val();
            item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
            item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();

            item["Status"] = sectionStatus;
            item["NoActiveGuardian"] = $("#CheckboxNoActiveGuardian").prop("checked") == true ? 'Y' : 'N';
            item["NotApplicableGuardian"] = $("#CheckboxNotApplicableGuardian").prop("checked") == true ? 'Y' : 'N';

            json.push(item);

            $.each(oTable, function (index, value) {
                var itemBodyFirst = {};
                itemBodyFirst["Status"] = sectionStatus;

                itemBodyFirst["HelpMemberMakeDecisionInLife"] = value[1] == undefined ? value.HelpMemberMakeDecisionInLife : value[1];
                itemBodyFirst["PersonHelpMemberMakeDecision"] = value[11] == undefined ? value.PersonHelpMemberMakeDecision : value[11];
                itemBodyFirst["GuardianshipAndAdvocacyTableId"] = value[12] == undefined ? value.GuardianshipAndAdvocacyTableId : value[12];
                itemBodyFirst["PersonInvolvementWithMember"] = value[3] == undefined ? value.PersonInvolvementWithMember : value[3];
                itemBodyFirst["Other"] = value[9] == undefined ? value.Other : value[9];
                itemBodyFirst["GuardianshipProof"] = value[10] == undefined ? value.GuardianshipProof : value[10];

                itemBodyFirst["HelpSignApproveLifePlan"] = value[6] == undefined ? value.HelpSignApproveLifePlan : value[6];
                itemBodyFirst["HelpSignApproveMedical"] = value[7] == undefined ? value.HelpSignApproveMedical : value[7];
                itemBodyFirst["HelpSignApproveFinancial"] = value[8] == undefined ? value.HelpSignApproveFinancial : value[8];
                jsonChildFirstTable.push(itemBodyFirst);
            });
        }
    }
    else if (sectionName == 'medicalHealth') {
        GetMedicalHealthAndDiagnosisJson(sectionName, _class);

    }
    // else if (sectionName == 'memberProviders') {
    //     $('.' + sectionName + ' .' + _class).each(function () {
    //         tag = $(this).attr('id').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
    //     })
    // }
    else {
        $('.' + sectionName + ' .' + _class).each(function () {

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
                else if ($(this).attr("type") == "checkbox") {
                    if ($(this).prop("checked") == true) item[tag] = true;
                    else {
                        item[tag] = false;
                    }
                }
                else if ($(this).hasClass("lookup") == true && $(this).text().trim() != 'select') {

                    item[tag] = $(this).text();
                }
                else {
                    item[tag] = jsonWrapperWithTimePicker(tag, this);
                }
            }
        });
        item["CompanyId"] = "1";
        if (sectionName != 'masterSection') {
            item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
            item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
            item["Status"] = sectionStatus;
        }
        item["ClientId"] = clientId == undefined ? $("#DropDownClientId").val() : clientId;
        json.push(item);
    }
    $.ajax({
        type: "POST",
        data: {
            TabName: tabName,
            Json: JSON.stringify(json),
            jsonchildfirsttable: JSON.stringify(isEmptyArray(jsonChildFirstTable)),
            ReportedBy: reportedBy
        },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                ComprehensiveAssessmentSaved(result, sectionName);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function validateMasterSectionTab(sectionName) {

    var checked = null; var checkBoxLength = 0;
    parentClass = sectionName;
    $("." + parentClass + " .req_feild").each(function () {
        if ($(this).is(":visible"))
            if ((($(this).val() == "" && $(this).hasClass('lookup') != true) || ($(this).text().trim() == "select" && $(this).hasClass('lookup') == true) || $(this).val() == "-1") && ($(this).attr("type") != "checkbox" && $(this).attr("type") != "radio")) {
                $(this).siblings("span.errorMessage").removeClass("hidden");
                $(this).siblings("span.errorMessage").show();
                $(this).focus();
                checked = false;
                return checked;
            }
            else if ($(this).attr("type") == "radio") {
                var element = $(this).attr("name");
                checkBoxLength = $('input[name=' + element + ']:checked').length;
                if ($('input[name=' + element + ']:checked').length == 0 && $(this).is(":visible")) {
                    $(this).parent().parent().parent().next().children().removeClass("hidden");
                    $(this).siblings("span.errorMessage").show();
                    $(this).focus();
                    checked = false;
                    return checked;
                }
            }
            else if ($(this).attr("type") == "checkbox") {
                var _classes = $(this).attr("class").split(" ");
                var _classCheck = _classes[_classes.length - 1];
                checkBoxLength = $('input:checkbox.' + _classCheck + ':checked').length

                if (checkBoxLength == 0 && $(this).is(":visible")) {
                    $(this).parent().parent().parent().next().children().removeClass("hidden");
                    $(this).siblings("span.errorMessage").show();
                    $(this).focus();
                    checked = false;
                    return checked;
                }

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
        if (($(this).attr("type") == "radio" && $(this).hasClass("req_feild"))) {
            var radio = $(this).attr("name");
            $('input[name=' + radio + ']').change(function () {
                $(this).parent().parent().parent().next().children().addClass("hidden");

            })
        }
        else if ($(this).attr("type") == "checkbox" && $(this).hasClass("req_feild")) {
            var checkboxId = $(this).attr("name");
            $('input[name=' + checkboxId + ']').change(function () {
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

function showFields(hideFieldClass) {
    $('.' + hideFieldClass).removeAttr('hidden');
    $('.' + hideFieldClass).show();
}

function hideFields(hideFieldClass) {

    if (hideFieldClass == 'guardianAndApplicable') {
        $('.' + hideFieldClass + ' .guardianship').val('');
    }
    else if (hideFieldClass == 'paroleOrProbationClass') {
        $('.paroleOrProbationClass').attr('hidden');
        $(".paroleOrProbationClass").hide();
        $('#DropDownProbationContact').val('');
    }
    else if (hideFieldClass == 'supervisionNeedsClass') {
        $("input[name=RadioSupervisionNeedOfTheMemberInCommunity]").prop('checked', false);
        $("input[name=RadioSupervisionNeedOfTheMemberAtHome]").prop('checked', false);
        $("input[name=RadioSupervisionNeedOfTheMemberAtNight]").prop('checked', false);
        $('.' + hideFieldClass).children().children().val("");
        $('.' + hideFieldClass).hide();
    }
    else {
        $('.' + hideFieldClass).children().children().val("");
        $('.' + hideFieldClass).hide();
    }
}

function uncheckedFields(hideFieldClass, check = false) {
    if (check == true) {
        var newClass = hideFieldClass.replace('Class', 'NoConcerns')
        $('.' + newClass).prop('checked', false);
    }
    else {
        var newClass = hideFieldClass.replace('Class', '')
        $('.' + newClass).prop('checked', false);
    }

}
//#region show hide controls
function ShowHideFields(current, type, hideFieldClass) {

    if (type == 'radio') {
        CountNumberOfUnknowns(current);
        if ($(current).parent().text().trim() == 'Yes' || ($(current).parent().text().trim() == 'Unknown' && hideFieldClass == 'ConcernsNotAddressed')) {
            showFields(hideFieldClass);
            if (hideFieldClass == 'educationProgramsClass') {
                $("input[name=RadioMemPursuingAdditionalEducation]").prop('checked', false);
                $('.educationProgramsNoClass').hide();
            }
        }
        else if (hideFieldClass == 'fallenInLastMonthClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'diarrheaVomitingClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        // else if (( hideFieldClass == 'supervisionNeedsClass' ) && $(current).parent().text().trim() != 'No concerns at this time') {
        //     showFields(hideFieldClass);
        // }
        // else if (( hideFieldClass == 'supervisionNeedsClass') && $(current).parent().text().trim() == 'No concerns at this time') {
        //     hideFields(hideFieldClass);
        // }
        // else if (hideFieldClass == 'swallowingNeedsClass' && $(current).parent().text().trim() == 'No concerns at this time') {
        //     uncheckedFields(hideFieldClass);
        //     hideFields(hideFieldClass);
        // }
        else if ((hideFieldClass == 'individualMedicaitonClass' || hideFieldClass == 'medication_s_Class') && $(current).parent().text().trim() != 'Never') {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'individualMedicaitonClass' && $(current).parent().text().trim() == 'Never') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'medication_s_Class' && $(current).parent().text().trim() == 'Never ') {
            hideFields(hideFieldClass);
        }
        else if ((hideFieldClass == 'publicTransportationClass') && ($(current).parent().text().trim() != 'Independent')) {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'publicTransportationClass' && $(current).parent().text().trim() == 'Independent ') {
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'administerMedicationsClass' && $(current).parent().text().trim() != 'Independent with taking medications at this time') {
            uncheckedFields(hideFieldClass);
            $('.administerMedicationsTextClass').removeAttr('hidden');
            $('.administerMedicationsTextClass').show();
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'administerMedicationsClass' && $(current).parent().text().trim() == 'Independent with taking medications at this time') {
            $(".administerMedicationsTextClass").hide();
            $('.administerMedicationsTextClass').children().children().val("");
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'psychiatricSymptomsClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'behavioralSupportPlanClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
            $('.intrusiveInterventionsClass').hide();

        }
        else if (hideFieldClass == 'maintainSafetyClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'intrusiveInterventionsClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if ($(current).parent().text().trim() == 'No' && hideFieldClass == 'educationProgramsClass') {
            $("input[name=RadioCurreEducationMeetNeed]").prop('checked', false);
            $("input[name=RadioChooseCurrentEducation]").prop('checked', false);
            hideFields(hideFieldClass);
            $('.educationProgramsNoClass').removeAttr('hidden');
            $('.educationProgramsNoClass').show();
        }
        else if (hideFieldClass == 'educationProgramsClass') {
            $("input[name=RadioCurreEducationMeetNeed]").prop('checked', false);
            $("input[name=RadioChooseCurrentEducation]").prop('checked', false);
            $("input[name=RadioMemPursuingAdditionalEducation]").prop('checked', false);
            hideFields(hideFieldClass);
            $('.educationProgramsNoClass').hide();
        }
        else if (hideFieldClass == 'accessVRClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if ($(current).parent().text().trim() != 'No known history' && hideFieldClass == 'significantChallengingClass') {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'significantChallengingClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'memberCurrentEmploymentStatusClass' && $(current).parent().text().trim() != 'Retired' && $(current).parent().text().trim() != 'Not employed') {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'memberCurrentEmploymentStatusClass' && ($(current).parent().text().trim() == 'Retired' || $(current).parent().text().trim() == 'Not employed')) {
            $("input[name=RadioMemSatisfiedWithCurrentEmployer]").prop('checked', false);
            $("input[name=RadioMemPaycheck]").prop('checked', false);
            $("input[name=RadioDescMemEmploymentSetting]").prop('checked', false);
            $("input[name=RadioSatisfiedCurrentEmploymentSetting]").prop('checked', false);
            $("input[name=RadioMemWorkInIntegratedSetting]").prop('checked', false);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'involvementInCriminalClass') {
            $("input[name=RadioMemCurrOnProbation]").prop('checked', false);
            // $("input[name=RadioMemInvolCriminalJusticeSystem]").prop('checked', false);
            $("input[name=RadioMemNeedLegalAid]").prop('checked', false);
            $("input[name=RadioCrimJustSystemImpactHousing]").prop('checked', false);
            $("input[name=RadioCrimJustSystemImpactEmployment]").prop('checked', false);
            $("#TextBoxExpInvolCriminalJusticeSystem").val("");
            $('.paroleOrProbationClass').hide();
            $('.paroleOrProbationClass').children().children().val("");
            $('.imapctHousingClass').hide();
            $('.imapctHousingClass').children().children().val("");
            $('.impactCurrentEmploymentClass').hide();
            $('.impactCurrentEmploymentClass').children().children().val("");
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'sexuallyActiveClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'mentalHealthConditionClass') {
            // uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'suicidalThoughtsBehaviorsClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'healthProfessionalSuicidalRiskClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'monitoredByPsychiatristClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'textBoxMemCompletedEducationLevelOther') {
            if ($(current).parent().text().trim() == 'Other') {
                showFields(hideFieldClass);
            } else {
                hideFields(hideFieldClass);
            }

        }
        else {
            hideFields(hideFieldClass);
        }


    }
    else if (type == 'radioNo') {
        CountNumberOfUnknowns(current);
        if ($(current).parent().text().trim() == 'No' && hideFieldClass != 'satisfiedWithProviderClass') {
            showFields(hideFieldClass);
        }

        else if (hideFieldClass == 'selfDirectSupportsClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'satisfiedWithProviderClass' && $(current).parent().text().trim() != 'No') {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'satisfiedWithProviderClass' && $(current).parent().text().trim() == 'No') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else {
            hideFields(hideFieldClass);
        }
    }
    else if (type == 'radioWithName') {
        if (hideFieldClass == 'paroleOrProbationClass' && $(current).parent().text().trim() == 'Probation' || $(current).parent().text().trim() == 'Parole') {
            // showFields(hideFieldClass);
            $(".paroleOrProbationClass").removeAttr('hidden');
            $(".paroleOrProbationClass").show();
        }
        else {
            hideFields(hideFieldClass);
        }
    }
    else if (type == 'dropdown') {

        if ($(current).children("option:selected").text() == 'Co Representation' && hideFieldClass == 'representationStatusClass') {
            $('.cabRepContact2').removeAttr('hidden');
            $('.cabRepContact1').removeAttr('hidden');
            $('.cabRepContact1').show();
            $('.cabRepContact2').show();
        }
        else if (hideFieldClass == 'representationStatusClass' && $(current).children("option:selected").text() == 'Full Representation') {
            $('.cabRepContact1').removeAttr('hidden');
            $('.cabRepContact1').show();
            $('.cabRepContact2').hide();
            // $('.cabRepContact2').children().children().val("Select");
            $('.TextBoxCABRepContact1').text("Select");

        }
        else if ($(current).children("option:selected").text() == 'No Representation' || $(current).children("option:selected").val() == '' && hideFieldClass == 'representationStatusClass') {
            $('.cabRepContact1').children().children().val("Select");
            $('.cabRepContact2').children().children().val("Select");
            $('.cabRepContact1').hide();
            $('.cabRepContact2').hide();
        }
        else if (hideFieldClass == 'memberMakeDecisionClass' && $(current).children("option:selected").text() == 'Legal Guardian') {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'memberMakeDecisionClass') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'memberCurrentDiagnosesClass' && $(current).children("option:selected").text() != null && $(current).children("option:selected").val() > 0) {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'memberCurrentDiagnosesClass' && ($(current).children("option:selected").text() == null || $(current).children("option:selected").val() == "")) {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else {

        }
    }
    else if (type == 'text') {
        if (hideFieldClass == 'circleSupportContactClass') {
            if ($(current).val() != null && $(current).val() != '') {
                showFields(hideFieldClass);
            }
        }

        else if ($('#TextBoxNicknamePreferredName').text() == 'Professional') {
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'genderClass') {
            if ($(current).text() == 'Female') {
                $('.femaleGenderClass').removeAttr('hidden');
                $('.femaleGenderClass').show();
            }
            else if ($(current).text() == 'Male') {
                $('.maleGenderClass').removeAttr('hidden');
                $('.maleGenderClass').show();
            }
            showFields(hideFieldClass);
        }
        else {
            hideFields(hideFieldClass);
        }
    }
    else if (type == 'checkbox') {
        if (($(current).prop("checked") && (hideFieldClass == 'mentalHealthServiceClass' || hideFieldClass == 'mentalHealthServiceOtherClass'))) {
            showFields(hideFieldClass);
        }
        else if ($(current).prop("checked") && hideFieldClass == 'individualsAges5Class') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (($('input[name=CheckboxLongTermInpatientTreatment]:checked').length == 1 || $('input[name=CheckboxAcuteInpatientTreatment]:checked').length == 1) && hideFieldClass == 'acuteInpatientClass') {
            showFields(hideFieldClass);
        }
        else if ($('input[name=CheckboxindividualsAges5]:checked').length == 0 && _age <= 5) {
            showFields(hideFieldClass);
        }

        else if ((hideFieldClass == 'skinIntegrityClass' || hideFieldClass == 'nutritionalNeedsClass' || hideFieldClass == 'dentalOralCareNeedsClass' || hideFieldClass == 'CholesterolClass' || hideFieldClass == 'RespiratoryConcernsClass' || hideFieldClass == 'MembersNeedDiabetesClass' || hideFieldClass == 'PressureOrHypertensionClass' || hideFieldClass == 'memberSeizureDisorderClass' || hideFieldClass == 'constipationConcernsClass' || hideFieldClass == 'oralCareNeedsClass' || hideFieldClass == 'riskForFallClass' || hideFieldClass == 'swallowingNeedsClass' || hideFieldClass == 'gerdClass' || hideFieldClass == 'supervisionNeedsClass') && $(current).parent().text().trim() != 'No concerns at this time') {
            var check = true;
            uncheckedFields(hideFieldClass, check);
            showFields(hideFieldClass);
        }
        else if ((hideFieldClass == 'skinIntegrityClass' || hideFieldClass == 'nutritionalNeedsClass' || hideFieldClass == 'dentalOralCareNeedsClass' || hideFieldClass == 'CholesterolClass' || hideFieldClass == 'RespiratoryConcernsClass' || hideFieldClass == 'MembersNeedDiabetesClass' || hideFieldClass == 'PressureOrHypertensionClass' || hideFieldClass == 'memberSeizureDisorderClass' || hideFieldClass == 'constipationConcernsClass' || hideFieldClass == 'oralCareNeedsClass' || hideFieldClass == 'riskForFallClass' || hideFieldClass == 'swallowingNeedsClass' || hideFieldClass == 'gerdClass' || hideFieldClass == 'supervisionNeedsClass') && $(current).parent().text().trim() == 'No concerns at this time') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (hideFieldClass == 'budgetingMoneyClass' && $(current).parent().text().trim() != 'Independent') {
            var check = true;
            uncheckedFields(hideFieldClass, check);
            showFields(hideFieldClass);
        }
        else if (hideFieldClass == 'budgetingMoneyClass' && $(current).parent().text().trim() == 'Independent') {
            uncheckedFields(hideFieldClass);
            hideFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'guardianAndApplicable'))) {
            if ($('#CheckboxNoActiveGuardian').prop("checked") || $('#CheckboxNotApplicableGuardian').prop("checked")) {
                showFields(hideFieldClass);
                AddGuardianshipAndAdvocacy();
                $("#GuardianshipAndAdvocacy").val("");
            }
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textboxGuardianshipOther'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textBoxSocialOther'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textBoxOtherHousingAssistance'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textBoxMentalHealthInPastOther'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textBoxCurrentChallengingBehaviorOther'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textBoxBehaviorServiceInPastOther'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop("checked") && (hideFieldClass == 'textBoxPreVocationalPrograms'))) {
            showFields(hideFieldClass);
        }
        else if (($(current).prop != "checked" && (hideFieldClass == 'guardianAndApplicable'))) {
            if ($('#CheckboxNoActiveGuardian').prop("checked") || $('#CheckboxNotApplicableGuardian').prop("checked")) {
                showFields(hideFieldClass);
                AddGuardianshipAndAdvocacy();
                $("#GuardianshipAndAdvocacy").val("");
            }
            else {
                hideFields(hideFieldClass);
            }
        }
        else {
            hideFields(hideFieldClass);
        }

    }

}

function showHideFieldsBindOnStart() {
    var hideFieldClass = 'willowbrookStatusClass';
    if ($('#TextBoxWillowbrookStatus').val().toLowerCase() == "true") {
        showFields(hideFieldClass);
    }

    if ($('#TextBoxCircleofSupportContact').val() != null) {
        $('.circleSupportContactClass').removeAttr('hidden');
        $('.circleSupportContactClass').show();
    }
    if ($('#TextBoxTypeofContact').val() == 'Professional') {
        $('.typeOfContactClass').removeAttr('hidden');
        $('.typeOfContactClass').show();
    }
    if ($('#TextBoxDateofBirth').val() != null && $('#TextBoxDateofBirth').val() != '') {
        var birthday = $('#TextBoxDateofBirth').val();
        var age = getAge(birthday);
        _age = age;
        if (age >= 45) {
            $('.ageClass').removeAttr('hidden');
            $('.ageClass').show();
        }
        if (age >= 65) {
            $('.ageOlder65Class').removeAttr('hidden');
            $('.ageOlder65Class').show();
        }
        if (age <= 19) {
            $('.ageLess18Class').removeAttr('hidden');
            $('.ageLess18Class').show();
        }
        if (age >= 5) {
            $('.ageLess5Class').removeAttr('hidden');
            $('.ageLess5Class').show();
        }

    }
    if ($('#TextBoxGender').val() == 'Female') {
        $('.femaleGenderClass').removeAttr('hidden');
        $('.femaleGenderClass').show();
    }
    if ($('#TextBoxGender').val() == 'Male') {
        $('.maleGenderClass').removeAttr('hidden');
        $('.maleGenderClass').show();
    }
}

function getAge(dateString) {
    let birth = new Date(dateString);
    let now = new Date();
    let beforeBirth = ((() => { birth.setDate(now.getDate()); birth.setMonth(now.getMonth()); return birth.getTime() })() < birth.getTime()) ? 0 : 1;
    return now.getFullYear() - birth.getFullYear() - beforeBirth;
}
function disableOnAdd(sectionName) {
    $("." + sectionName + " .form-control").attr('disabled', true);
    if (sectionName == 'memberProviders') {
        $('.lookup').attr("style", "pointer-events: none");
    }
    if ($("." + sectionName + " .ComprehensiveAssessmentSaveBtn").text().trim() == "Ok") {
        $("." + sectionName + " .ComprehensiveAssessmentSaveBtn").text("Edit");
    }
}
function ComprehensiveAssessmentSaved(result, sectionName) {

    if (result.Success == true && result.IsException == false) {
        if (result.AllTabsComprehensiveAssessment[0].ValidatedRecord == false) {
            showErrorMessage("Comprehensvie Assessment already exists in Draft for client");
            return;
        }
        else {
            showRecordSaved("Record Saved Successfully.");
            $(".btnDisable").prop("disabled", false);
            $("#btnSaveAsNew").addClass("hidden");
            $("#btnPublishVersion").show();
            $("#btnPrintPDf").show();

            if (sectionName == 'masterSection') {
                $("#TextBoxCompAssessmentId").val(result.AllTabsComprehensiveAssessment[0].CompAssessmentId);
                $("#TextBoxCompAssessmentVersioningId").val(result.AllTabsComprehensiveAssessment[0].CompAssessmentVersioningId);
                $("#labelCCOAssessmentStatus").val(result.AllTabsComprehensiveAssessment[0].DocumentStatus);
                $("#labelDocumentVersion").val(result.AllTabsComprehensiveAssessment[0].DocumentVersion);
                disableOnAdd(sectionName);
            }

            if (result.AllTabsComprehensiveAssessment[0].DocumentVersion != "") {
                $("#TextBoxDocumentStatus").text(result.AllTabsComprehensiveAssessment[0].DocumentStatus);
                $("#TextBoxDocumentVersion").text(result.AllTabsComprehensiveAssessment[0].DocumentVersion);
            }

            if (result.AllTabsComprehensiveAssessment[0].EligibilityInformationId != 0) {
                $("#TextBoxEligibilityInformationId").val(result.AllTabsComprehensiveAssessment[0].EligibilityInformationId);
                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedEligibilityInformation").show();
                        $("#statusStartEligibilityInformation").hide();
                        $("#statusInprogressEligibilityInformation").hide();
                    }
                    else {
                        $("#statusCompletedEligibilityInformation").hide();
                        $("#statusStartEligibilityInformation").hide();
                        $("#statusInprogressEligibilityInformation").show();
                    }

                }
                disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].CommunicationId != 0) {

                $("#TextBoxCommunicationId").val(result.AllTabsComprehensiveAssessment[0].CommunicationId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedCommunicationLanguage").show();
                        $("#statusStartCommunicationLanguage").hide();
                        $("#statusInprogressCommunicationLanguage").hide();
                    }
                    else {
                        $("#statusCompletedCommunicationLanguage").hide();
                        $("#statusStartCommunicationLanguage").hide();
                        $("#statusInprogressCommunicationLanguage").show();
                    }

                }
                disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].MemberProviderId != 0) {

                $("#TextBoxMemberProviderId").val(result.AllTabsComprehensiveAssessment[0].MemberProviderId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedMemberProviders").show();
                        $("#statusStartMemberProviders").hide();
                        $("#statusInprogressMemberProviders").hide();
                    }
                    else {
                        $("#statusCompletedMemberProviders").hide();
                        $("#statusStartMemberProviders").hide();
                        $("#statusInprogressMemberProviders").show();
                    }

                }

                disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].GuardianshipAndAdvocacyId != 0) {

                $("#TextBoxGuardianshipAndAdvocacyId").val(result.AllTabsComprehensiveAssessment[0].GuardianshipAndAdvocacyId);

                BindStateFormNotifications(result.AllTabsComprehensiveAssessment[0].JSONData);
                clearGuardianshipAndAdvocacy();
                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedGuardianshipAndAdvocacy").show();
                        $("#statusStartGuardianshipAndAdvocacy").hide();
                        $("#statusInprogressGuardianshipAndAdvocacy").hide();
                    }
                    else {
                        $("#statusCompletedGuardianshipAndAdvocacy").hide();
                        $("#statusStartGuardianshipAndAdvocacy").hide();
                        $("#statusInprogressGuardianshipAndAdvocacy").show();
                    }

                }
                disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].AdvancedDirectivesFuturePlanningId != 0) {

                $("#TextBoxAdvancedDirectivesFuturePlanningId").val(result.AllTabsComprehensiveAssessment[0].AdvancedDirectivesFuturePlanningId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedAdvancedDirectivesFuturePlanning").show();
                        $("#statusStartAdvancedDirectivesFuturePlanning").hide();
                        $("#statusInprogressAdvancedDirectivesFuturePlanning").hide();
                    }
                    else {
                        $("#statusCompletedAdvancedDirectivesFuturePlanning").hide();
                        $("#statusStartAdvancedDirectivesFuturePlanning").hide();
                        $("#statusInprogressAdvancedDirectivesFuturePlanning").show();
                    }

                }
                disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].IndependentLivingSkillId != 0) {

                $("#TextBoxIndependentLivingSkillId").val(result.AllTabsComprehensiveAssessment[0].IndependentLivingSkillId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedIndependentLivingSkills").show();
                        $("#statusStartIndependentLivingSkills").hide();
                        $("#statusInprogressIndependentLivingSkills").hide();
                    }
                    else {
                        $("#statusCompletedIndependentLivingSkills").hide();
                        $("#statusStartIndependentLivingSkills").hide();
                        $("#statusInprogressIndependentLivingSkills").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].SocialServiceNeedId != 0) {

                $("#TextBoxSocialServiceNeedId").val(result.AllTabsComprehensiveAssessment[0].SocialServiceNeedId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedSocialServiceNeeds").show();
                        $("#statusStartSocialServiceNeeds").hide();
                        $("#statusInprogressSocialServiceNeeds").hide();
                    }
                    else {
                        $("#statusCompletedSocialServiceNeeds").hide();
                        $("#statusStartSocialServiceNeeds").hide();
                        $("#statusInprogressSocialServiceNeeds").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].MedicalHealthId != 0) {

                $("#TextBoxMedicalHealthId").val(result.AllTabsComprehensiveAssessment[0].MedicalHealthId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedMedicalHealth").show();
                        $("#statusStartMedicalHealth").hide();
                        $("#statusInprogressMedicalHealth").hide();
                    }
                    else {
                        $("#statusCompletedMedicalHealth").hide();
                        $("#statusStartMedicalHealth").hide();
                        $("#statusInprogressMedicalHealth").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].HealthPromotionId != 0) {

                $("#TextBoxHealthPromotionId").val(result.AllTabsComprehensiveAssessment[0].HealthPromotionId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedHealthPromotion").show();
                        $("#statusStartHealthPromotion").hide();
                        $("#statusInprogressHealthPromotion").hide();
                    }
                    else {
                        $("#statusCompletedHealthPromotion").hide();
                        $("#statusStartHealthPromotion").hide();
                        $("#statusInprogressHealthPromotion").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].BehavioralHealthId != 0) {

                $("#TextBoxBehavioralHealthId").val(result.AllTabsComprehensiveAssessment[0].BehavioralHealthId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedBehavioralHealth").show();
                        $("#statusStartBehavioralHealth").hide();
                        $("#statusInprogressBehavioralHealth").hide();
                    }
                    else {
                        $("#statusCompletedBehavioralHealth").hide();
                        $("#statusStartBehavioralHealth").hide();
                        $("#statusInprogressBehavioralHealth").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].ChallengingBehaviorId != 0) {

                $("#TextBoxChallengingBehaviorId").val(result.AllTabsComprehensiveAssessment[0].ChallengingBehaviorId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedChallengingBehaviors").show();
                        $("#statusStartChallengingBehaviors").hide();
                        $("#statusInprogressChallengingBehaviors").hide();
                    }
                    else {
                        $("#statusCompletedChallengingBehaviors").hide();
                        $("#statusStartChallengingBehaviors").hide();
                        $("#statusInprogressChallengingBehaviors").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].BehavioralSupportPlanId != 0) {

                $("#TextBoxBehavioralSupportPlanId").val(result.AllTabsComprehensiveAssessment[0].BehavioralSupportPlanId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedBehavioralSupportPlan").show();
                        $("#statusStartBehavioralSupportPlan").hide();
                        $("#statusInprogressBehavioralSupportPlan").hide();
                    }
                    else {
                        $("#statusCompletedBehavioralSupportPlan").hide();
                        $("#statusStartBehavioralSupportPlan").hide();
                        $("#statusInprogressBehavioralSupportPlan").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].MedicationId != 0) {

                $("#TextBoxMedicationId").val(result.AllTabsComprehensiveAssessment[0].MedicationId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedMedications").show();
                        $("#statusStartMedications").hide();
                        $("#statusInprogressMedications").hide();
                    }
                    else {
                        $("#statusCompletedMedications").hide();
                        $("#statusStartMedications").hide();
                        $("#statusInprogressMedications").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].CommunityParticipationId != 0) {

                $("#TextBoxCommunityParticipationId").val(result.AllTabsComprehensiveAssessment[0].CommunityParticipationId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedCommunitySocial").show();
                        $("#statusStartCommunitySocial").hide();
                        $("#statusInprogressCommunitySocial").hide();
                    }
                    else {
                        $("#statusCompletedCommunitySocial").hide();
                        $("#statusStartCommunitySocial").hide();
                        $("#statusInprogressCommunitySocial").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].EducationId != 0) {

                $("#TextBoxEducationId").val(result.AllTabsComprehensiveAssessment[0].EducationId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedEducation").show();
                        $("#statusStartEducation").hide();
                        $("#statusInprogressEducation").hide();
                    }
                    else {
                        $("#statusCompletedEducation").hide();
                        $("#statusStartEducation").hide();
                        $("#statusInprogressEducation").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].TransitionPlanningId != 0) {

                $("#TextBoxTransitionPlanningId").val(result.AllTabsComprehensiveAssessment[0].TransitionPlanningId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedTransitionPlanning").show();
                        $("#statusStartTransitionPlanning").hide();
                        $("#statusInprogressTransitionPlanning").hide();
                    }
                    else {
                        $("#statusCompletedTransitionPlanning").hide();
                        $("#statusStartTransitionPlanning").hide();
                        $("#statusInprogressTransitionPlanning").show();
                    }

                } disableOnAdd(sectionName);
            }
            if (result.AllTabsComprehensiveAssessment[0].EmploymentId != 0) {

                $("#TextBoxEmploymentId").val(result.AllTabsComprehensiveAssessment[0].EmploymentId);

                if (result.AllTabsComprehensiveAssessment[0].Status != null) {
                    var status = result.AllTabsComprehensiveAssessment[0].Status;
                    if (status == "Completed") {
                        $("#statusCompletedEmployment").show();
                        $("#statusStartEmployment").hide();
                        $("#statusInprogressEmployment").hide();
                    }
                    else {
                        $("#statusCompletedEmployment").hide();
                        $("#statusStartEmployment").hide();
                        $("#statusInprogressEmployment").show();
                    }

                } disableOnAdd(sectionName);
            }
        }
    }
    else {
        showErrorMessage(result.Message);
    }
}
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

function CreateChildBtnWithPermission(editEvent, deleteEvent) {
    var notificationBtn = "";
    if (!isEmpty(editPermission) && !isEmpty(deletePermission)) {
        if (editPermission == "true" && deletePermission == "false") {
            notificationBtn = '<a href="#" class="editSubRows"  onclick="' + editEvent + '(this);event.preventDefault();">Edit </a>'
                + '<span><a href="#" class="deleteSubRows disable-click" onclick="' + deleteEvent + '(this);event.preventDefault();">Delete</a></span>';
        }
        if (editPermission == "false" && deletePermission == "true") {
            notificationBtn = '<a href="#" class="editSubRows disable-click" onclick="' + editEvent + '(this);event.preventDefault();">Edit </a>'
                + '<span><a href="#" class="deleteSubRows" onclick="' + deleteEvent + '(this); event.preventDefault();">Delete</a></span>';
        }
        if (editPermission == "true" && deletePermission == "true") {
            notificationBtn = '<a href="#" class="editSubRows" onclick="' + editEvent + '(this);event.preventDefault();">Edit </a>'
                + '<span><a href="#" class="deleteSubRows" onclick="' + deleteEvent + '(this); event.preventDefault();">Delete</a></span>';
        }
    }

    return notificationBtn;
}
function AddGuardianshipAndAdvocacy() {
    $("#AddGuardianshipAndAdvocacy").on("click", function () {
        var RadioGuardianshipProof = '';
        if (!$("#AddGuardianshipAndAdvocacy").hasClass("editRow")) {
            var data = validateMasterSectionTab('guardianshipAndAdvocacy');
            if (data == false || data == undefined) {
                return;
            }
            RadioGuardianshipProof = $('input[name=RadioGuardianshipProof]:checked').val();

            if (dataTableGuardianshipAndAdvocacysFlg) {
                newRow = $('#GuardianshipAndAdvocacy').DataTable();
                var rowExists = false;
                var valueCol = $('#GuardianshipAndAdvocacy').DataTable().column(1).data();
                var index = valueCol.length;

                var rowCount = $('#GuardianshipAndAdvocacy tr').length;
                if (rowCount > 8) {
                    showErrorMessage(" Not allowed more than 8 records");
                    return;

                }
                else {
                    var text = [{

                        "Actions": CreateChildBtnWithPermission("EditGuardianshipAndAdvocacy", "Delete"),
                        "HelpToMakeDecisionLife": $('.guardianshipAndAdvocacy #TextBoxHelpMemberMakeDecisionInLife').text(),
                        "HelpToMakeDecisions": $('.guardianshipAndAdvocacy #DropDownPersonHelpMemberMakeDecision option:selected').text(),
                        "PersonInvolvementWithMembers": $(".guardianshipAndAdvocacy #TextBoxPersonInvolvementWithMember").val(),
                        "SupportsIndividualDecision": $('.guardianshipAndAdvocacy .HelpSignApproveLifePlan:checked').parent('label').text().trim(),
                        "Guardianship": RadioGuardianshipProof != undefined ? $('.guardianshipAndAdvocacy input[name=RadioGuardianshipProof]:checked').parent('label').text().trim() : '',
                        "HelpSignApproveLifePlan": $(".guardianshipAndAdvocacy #CheckboxHelpSignApproveLifePlan").prop("checked") == true ? 1 : 0,
                        "HelpSignApproveMedical": $(".guardianshipAndAdvocacy #CheckboxHelpSignApproveMedical").prop("checked") == true ? 1 : 0,
                        "HelpSignApproveFinancial": $(".guardianshipAndAdvocacy #CheckboxHelpSignApproveFinancial").prop("checked") == true ? 1 : 0,

                        "Other": $("#CheckboxOther").prop("checked") == true ? 1 : 0,
                        "GuardianshipProof": RadioGuardianshipProof != undefined ? $(".guardianshipAndAdvocacyinput[name='RadioGuardianshipProof']:checked").val() : '',
                        "HowHelpToMakeDecision": $('.guardianshipAndAdvocacy #DropDownPersonHelpMemberMakeDecision option:selected').val(),
                        "GuardianshipAndAdvocacyTableId": $("#TextBoxGuardianshipAndAdvocacyTableId").val()

                    }];
                    var stringyfy = JSON.stringify(text);
                    var data = JSON.parse(stringyfy);
                    newRow.rows.add(data).draw(false);
                    showRecordSaved("Guardianship And Advocacy added successfully.");

                    clearGuardianshipAndAdvocacy();
                }

            }
            else {
                var rowExists = false;
                newRow = $('#GuardianshipAndAdvocacy').DataTable();
                var valueCol = $('#GuardianshipAndAdvocacy').DataTable().column(1).data();
                var index = valueCol.length;

                var rowCount = $('#GuardianshipAndAdvocacy tr').length;
                if (rowCount > 8) {
                    showErrorMessage("Not allowed more than 8 records");
                    return;
                }
                else {
                    newRow.row.add([

                        CreateChildBtnWithPermission("EditGuardianshipAndAdvocacy", "Delete"),
                        $('.guardianshipAndAdvocacy #TextBoxHelpMemberMakeDecisionInLife').text(),
                        $('.guardianshipAndAdvocacy #DropDownPersonHelpMemberMakeDecision option:selected').text(),
                        $(".guardianshipAndAdvocacy #TextBoxPersonInvolvementWithMember").val(),

                        $('.guardianshipAndAdvocacy .HelpSignApproveLifePlan:checked').parent('label').text().trim(),
                        $('.guardianshipAndAdvocacy input[name=RadioGuardianshipProof]:checked').parent('label').text().trim(),
                        $(".guardianshipAndAdvocacy #CheckboxHelpSignApproveLifePlan").prop("checked") == true ? 1 : 0,
                        $(".guardianshipAndAdvocacy #CheckboxHelpSignApproveMedical").prop("checked") == true ? 1 : 0,
                        $(".guardianshipAndAdvocacy #CheckboxHelpSignApproveFinancial").prop("checked") == true ? 1 : 0,

                        $(".guardianshipAndAdvocacy #CheckboxOther").prop("checked") == true ? 1 : 0,
                        RadioGuardianshipProof != undefined ? RadioGuardianshipProof : '',

                        $('#DropDownPersonHelpMemberMakeDecision option:selected').val(),
                        $("#TextBoxGuardianshipAndAdvocacyTableId").val()


                    ]).draw(false);
                    showRecordSaved("Added successfully.");

                    clearGuardianshipAndAdvocacy();
                }

            }

        }

    });
}
function clearGuardianshipAndAdvocacy() {

    $("#TextBoxPersonInvolvementWithMember").val("");
    $("#TextBoxHelpMemberMakeDecisionInLife").text("select");
    $("#DropDownPersonHelpMemberMakeDecision").val("");
    $(".memberMakeDecisionClass").hide();
    $(".guardianshipAndAdvocacy input[name=RadioGuardianshipProof]").prop('checked', false);
    $('.guardianshipAndAdvocacy input[name=CheckboxHelpSignApproveLifePlan]:checked').prop('checked', false);
    $('.guardianshipAndAdvocacy input[name=CheckboxHelpSignApproveMedical]:checked').prop('checked', false);
    $('.guardianshipAndAdvocacy input[name=CheckboxOther]:checked').prop('checked', false);
    $('.guardianshipAndAdvocacy input[name=CheckboxHelpSignApproveFinancial]:checked').prop('checked', false);
    if ($("#AddGuardianshipAndAdvocacy").text() == 'Edit') {
        $("#AddGuardianshipAndAdvocacy").text('Add');
    };
}
function EditGuardianshipAndAdvocacy(object) {

    var table = $('#GuardianshipAndAdvocacy').DataTable();


    currentRowGuardianshipAndAdvocacys = $(object).parents("tr");
    var PersonHelpMemberMakeDecisionText = table.row(currentRowGuardianshipAndAdvocacys).data()[2] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().HelpMemberMakeDecisionInLife : table.row(currentRowGuardianshipAndAdvocacys).data()[2];

    var HelpMemberMakeDecisionInLife = table.row(currentRowGuardianshipAndAdvocacys).data()[1] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().HelpMemberMakeDecisionInLife : table.row(currentRowGuardianshipAndAdvocacys).data()[1];
    var PersonHelpMemberMakeDecision = table.row(currentRowGuardianshipAndAdvocacys).data()[11] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().PersonHelpMemberMakeDecision : table.row(currentRowGuardianshipAndAdvocacys).data()[11];
    var PersonInvolvementWithMember = table.row(currentRowGuardianshipAndAdvocacys).data()[3] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().PersonInvolvementWithMember : table.row(currentRowGuardianshipAndAdvocacys).data()[3];
    var CheckboxHelpSignApproveLifePlan = table.row(currentRowGuardianshipAndAdvocacys).data()[6] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().HelpSignApproveLifePlan : table.row(currentRowGuardianshipAndAdvocacys).data()[6];
    var CheckboxHelpSignApproveMedical = table.row(currentRowGuardianshipAndAdvocacys).data()[7] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().HelpSignApproveMedical : table.row(currentRowGuardianshipAndAdvocacys).data()[7];
    var CheckboxHelpSignApproveFinancial = table.row(currentRowGuardianshipAndAdvocacys).data()[8] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().HelpSignApproveFinancial : table.row(currentRowGuardianshipAndAdvocacys).data()[8];
    var CheckboxOther = table.row(currentRowGuardianshipAndAdvocacys).data()[9] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().Other : table.row(currentRowGuardianshipAndAdvocacys).data()[9];
    var GuardianshipProof = table.row(currentRowGuardianshipAndAdvocacys).data()[10] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().GuardianshipProof : table.row(currentRowGuardianshipAndAdvocacys).data()[10];
    var GuardianshipAndAdvocacyTableId = table.row(currentRowGuardianshipAndAdvocacys).data()[12] == undefined ? table.row(currentRowGuardianshipAndAdvocacys).data().GuardianshipAndAdvocacyTableId : table.row(currentRowGuardianshipAndAdvocacys).data()[12];

    $(".guardianshipAndAdvocacy #TextBoxHelpMemberMakeDecisionInLife").text(HelpMemberMakeDecisionInLife);
    $(".guardianshipAndAdvocacy #DropDownPersonHelpMemberMakeDecision").val(PersonHelpMemberMakeDecision);
    $(".guardianshipAndAdvocacy #TextBoxPersonInvolvementWithMember").val(PersonInvolvementWithMember);

    CheckboxHelpSignApproveLifePlan == '1' ? $(".guardianshipAndAdvocacy input[id='CheckboxHelpSignApproveLifePlan']").prop('checked', true) : $(".guardianshipAndAdvocacy input[id='CheckboxHelpSignApproveLifePlan']").prop('checked', false);
    CheckboxHelpSignApproveMedical == '1' ? $(".guardianshipAndAdvocacy input[id='CheckboxHelpSignApproveMedical']").prop('checked', true) : $(".guardianshipAndAdvocacy input[id='CheckboxHelpSignApproveMedical']").prop('checked', false);
    CheckboxHelpSignApproveFinancial == '1' ? $(".guardianshipAndAdvocacy input[id='CheckboxHelpSignApproveFinancial']").prop('checked', true) : $(".guardianshipAndAdvocacy input[id='CheckboxHelpSignApproveFinancial']").prop('checked', false);
    CheckboxOther == '1' ? $(".guardianshipAndAdvocacy input[name='CheckboxOther']").prop('checked', true) : $(".guardianshipAndAdvocacy input[name='CheckboxOther']").prop('checked', false);
    GuardianshipProof == '' ? $(".guardianshipAndAdvocacy input[name='RadioGuardianshipProof']").prop('checked', false) : $(".guardianshipAndAdvocacy input[name='RadioGuardianshipProof'][value=" + GuardianshipProof + "]").prop('checked', true);

    $("#TextBoxGuardianshipAndAdvocacyTableId").val(GuardianshipAndAdvocacyTableId);


    if (GuardianshipProof != undefined && PersonHelpMemberMakeDecisionText == 'Legal Guardian') {
        $('.memberMakeDecisionClass').removeAttr('hidden');
        $('.memberMakeDecisionClass').show();
    }
    $("#AddGuardianshipAndAdvocacy").attr("onclick", "EditExistingRowGuardianshipAndAdvocacys();return false;");
    $("#AddGuardianshipAndAdvocacy").addClass("editRow");
    $("#AddGuardianshipAndAdvocacy").text("Edit");
    return false;
}
function EditExistingRowGuardianshipAndAdvocacys() {
    if ($("#AddGuardianshipAndAdvocacy").text() == 'Edit') {
        $("#AddGuardianshipAndAdvocacy").text('Add');
    };
    var table = $('#GuardianshipAndAdvocacy').DataTable();
    var currentata = "";
    var data = validateMasterSectionTab('guardianshipAndAdvocacy');
    if (data == false || data == undefined) {

        return;
    }
    var GuardianshipProof = '';
    if ($("input[name=RadioGuardianshipProof]:checked").val() == 1) {
        GuardianshipProof = 'Yes';
    }
    else if ($("input[name=RadioGuardianshipProof]:checked").val() == 2) {
        GuardianshipProof = 'No';
    }
    else {
        GuardianshipProof = 'Unknown'
    };
    if (dataTableGuardianshipAndAdvocacysFlg) {
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

                "Actions": CreateChildBtnWithPermission("EditGuardianshipAndAdvocacy", "Delete"),
                "HelpToMakeDecisionLife": $('#TextBoxHelpMemberMakeDecisionInLife').text(),
                "HelpToMakeDecisions": $('#DropDownPersonHelpMemberMakeDecision option:selected').text(),
                "PersonInvolvementWithMembers": $("#TextBoxPersonInvolvementWithMember").val(),
                "SupportsIndividualDecision": $('.guardianshipAndAdvocacy .HelpSignApproveLifePlan:checked').parent('label').text().trim(),
                "Guardianship": $('input[name=RadioGuardianshipProof]:checked').parent('label').text().trim(),
                "HelpSignApproveLifePlan": $("#CheckboxHelpSignApproveLifePlan").prop("checked") == true ? 1 : 0,
                "HelpSignApproveMedical": $("#CheckboxHelpSignApproveMedical").prop("checked") == true ? 1 : 0,
                "HelpSignApproveFinancial": $("#CheckboxHelpSignApproveFinancial").prop("checked") == true ? 1 : 0,

                "Other": $("#CheckboxOther").prop("checked") == true ? 1 : 0,
                "GuardianshipProof": $("input[name='RadioGuardianshipProof']:checked").val(),
                "HowHelpToMakeDecision": $('#DropDownPersonHelpMemberMakeDecision option:selected').val(),

                "GuardianshipAndAdvocacyTableId": $("#TextBoxGuardianshipAndAdvocacyTableId").val() == undefined ? '' : $("#TextBoxGuardianshipAndAdvocacyTableId").val(),

            };
            table.row(currentRowGuardianshipAndAdvocacys).data(data).draw(false);
            $("#AddGuardianshipAndAdvocacy").removeAttr("onclick");
            $("#AddGuardianshipAndAdvocacy").removeClass("editRow");
            showRecordSaved("Guardianship And Advocacy edited successfully.");
            clearGuardianshipAndAdvocacy();
        }
    }
    else {
        var valueCol = $('#GuardianshipAndAdvocacy').DataTable().column(1).data();
        var rowCount = $('#MembersFamilyConstellation tr').length;
        if (rowCount > 8) {
            showErrorMessage(" Not allowed more than 8 records");
            return;

        }
        else {
            var data1 = [


                CreateChildBtnWithPermission("EditGuardianshipAndAdvocacy", "DeleteGuardianshipAndAdvocacy"),
                $('#TextBoxHelpMemberMakeDecisionInLife').text(),
                $('#DropDownPersonHelpMemberMakeDecision option:selected').text(),
                $("#TextBoxPersonInvolvementWithMember").val(),
                $('.guardianshipAndAdvocacy .HelpSignApproveLifePlan:checked').parent('label').text().trim(),
                $('input[name=RadioGuardianshipProof]:checked').parent('label').text().trim(),
                $("#CheckboxHelpSignApproveLifePlan").prop("checked") == true ? 1 : 0,
                $("#CheckboxHelpSignApproveMedical").prop("checked") == true ? 1 : 0,
                $("#CheckboxHelpSignApproveFinancial").prop("checked") == true ? 1 : 0,
                $("#CheckboxOther").prop("checked") == true ? 1 : 0,
                $("input[name='RadioGuardianshipProof']:checked").val() == undefined ? '' : $("input[name='RadioGuardianshipProof']:checked").val(),
                $('#DropDownPersonHelpMemberMakeDecision option:selected').val(),
                $("#TextBoxGuardianshipAndAdvocacyTableId").val() == undefined ? '' : $("#TextBoxGuardianshipAndAdvocacyTableId").val(),

            ];
            table.row(currentRowGuardianshipAndAdvocacys).data(data1).draw(false);
            $("#AddGuardianshipAndAdvocacy").removeAttr("onclick");
            $("#AddGuardianshipAndAdvocacy").removeClass("editRow");
            showRecordSaved("Guardianship And Advocacy edited successfully.");
            clearGuardianshipAndAdvocacy();
        }
    }
}
function Delete(object) {

    var table = $('#GuardianshipAndAdvocacy').DataTable();
    var row = $(object).closest("tr");
    table.row(row).remove().draw();
    if ($("#AddGuardianshipAndAdvocacy").attr("onclick") != undefined) {
        $("#AddGuardianshipAndAdvocacy").removeAttr("onclick");
        $("#AddGuardianshipAndAdvocacy").removeClass("editRow");
    }
    showRecordSaved("Record deleted successfully.");
    if ($("#AddGuardianshipAndAdvocacy").text() == 'Edit') {
        $("#AddGuardianshipAndAdvocacy").text('Add');
    };
    clearGuardianshipAndAdvocacy();
    return false;
}
function GetMedicationsJson(sectionName, _class) {
    var json = [],
        item = {},
        tag;
    for (var i = 0; i < medicationsCounter; i++) {
        item = {};
        item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
        item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
        item["Status"] = sectionStatus;
        var meditaion = _class + i;
        $('.' + sectionName + ' .' + sectionName + i + ' .' + _class).each(function () {
            tag = $(this).attr('id').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
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
                else if ($(this).attr("type") == "checkbox") {
                    if ($(this).prop("checked") == true) item[tag] = true;
                    else {
                        item[tag] = false;
                    }
                }
                else {
                    item[tag] = jsonWrapperWithTimePicker(tag, this);
                }
            }
        });
        json.push(item);
    }
    return json;
}
function GetMedicalHealthAndDiagnosisJson(sectionName, _class) {
    var collection = $(".medicalHealthFields");
    collection.each(function () {
        var recordType = $(this).attr("record-type");
        if (recordType == "single" && this.classList[2] != undefined) {
            json = GenerateJSONData(this.classList[2]);
        }
        else if (recordType == "multiple") {
            jsonChildFirstTable = GetMultipleArrayOfObjects(this.classList[1]);
        }
    });
    console.log(json);
}
function isEmptyArray(json) {
    var isArray = json != undefined ? Array.isArray(json) : "";
    if (isArray && json.length > 0) {
        return json;
    }
    else {
        return null;
    }
}
function GenerateJSONData(parentSection) {
    var item = {};
    var json = [];
    var tag;
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
    item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
    item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
    item["Status"] = sectionStatus;
    json.push(item);
    return json;
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
function GetMultipleArrayOfObjects(parentClass) {
    var jsonData = [];
    $("." + parentClass + " .medicalHealth").each(function (index) {
        var item = {};
        $(this).find(".medical").each(function () {
            tag = $(this).attr('name').replace("TextBox", "").replace("Checkbox", "").replace("DropDown", "").replace("Radio", "").replace("TextBox1", "");
            if ($(this).attr("type") == "radio") {
                if ($(this).prop("checked") == true) item[tag.replace(/\d+/g, '')] = $(this).val();
                else { }
            }
            else {
                item[tag.replace(/\d+/g, '')] = jsonWrapperWithDiffCheckBox(tag, this);
            }
        });
        item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
        item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
        item["Status"] = sectionStatus;
        jsonData.push(item);
    });
    return jsonData;
}
function CountNumberOfUnknowns(element) {
    var $currentElem = $(element),
        elemType = $currentElem.prop('nodeName').toLowerCase(),
        countVal = "",
        elementId = $currentElem.attr('name');
    if (elemType == "select") {
        countVal = $currentElem.find("option:selected").text().trim();
    }
    else if (elemType == "input") {
        var inputType = $currentElem.attr('type')
        switch (inputType) {
            case "text":
                countVal = $currentElem.val();
                break;
            case "radio":
                countVal = $currentElem.parent().text().trim();
                break;
            case "checkbox":
                countVal = $currentElem.prop('checked') == true ? $currentElem.parent().text().trim() : "";
                break;
            default:
                null;
        }
    }
    validateUnknownAndCount(countVal, elementId);
}



function validateUnknownAndCount(value, elementId) {

    if ((value.toLowerCase() == "unknown") || (value.toLowerCase() == "yes" && elementId == 'RadioMemLearnAdvancedHealthProxies')) {
        countUnknown = countUnknown + 1;
        unknownCountArray.push(elementId);
    }
    else if ($.inArray(elementId, unknownCountArray) > -1) {
        countUnknown = countUnknown == 0 ? 0 : countUnknown - 1;
        unknownCountArray.pop(elementId);
    }
    // prevElementVal="";
    $("#TextBoxUnknownCount").val(countUnknown);
}
function passDataToBroswer() {
    window.external.Test('called from script code');
}
function ModifyProfessionalContact(ContactId) {

    var json = [],
        item = {};
    mode = "Select";
    item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
    item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
    item["ContactID"] = ContactId;
    json.push(item);

    $.ajax({
        type: "POST",
        data: {
            TabName: "CCO_CircleOfSupport",
            Json: JSON.stringify(json),
            ReportedBy: reportedBy,
            Mode: mode
        },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                CircleAndSupportSection(result, ContactId);
            }
            else {
                showErrorMessage(result.Message);
            }
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
    $('#exampleModalCenter').modal('show');
}
function InsertModifyCircleAndSupport(mode) {
    if (mode == 'Insert') {
        if (!validateMasterSectionTab('ProfessionalContact')) return;
    }
    var json = [],
        item = {};
    // mode="Insert";
    $('#exampleModalCenter .contactSupport').each(function () {
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
            else if ($(this).attr("type") == "checkbox") {
                if ($(this).prop("checked") == true) item[tag] = true;
                else {
                    item[tag] = false;
                }
            }
            else {
                item[tag] = jsonWrapperWithTimePicker(tag, this);
            }
        }
    });
    item["CompAssessmentId"] = $("#TextBoxCompAssessmentId").val();
    item["CompAssessmentVersioningId"] = $("#TextBoxCompAssessmentVersioningId").val();
    item["ClientId"] = clientId;
    json.push(item);

    $.ajax({
        type: "POST",
        data: {
            TabName: "CCO_CircleOfSupport",
            Json: JSON.stringify(json),
            ReportedBy: reportedBy,
            Mode: mode
        },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                CircleAndSupportSection(result);
                $('#exampleModalCenter').modal('hide');
                showRecordSaved("Added successfully.");
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}


function InsertModifyModalContent(parentModal, tabName) {
    if (!validateMasterSectionTab(sectionName)) return;
    var json = GenerateJSONData(parentModal);

    $.ajax({
        type: "POST",
        data: {
            TabName: tabName,
            Json: JSON.stringify(json),
            jsonchildfirsttable: JSON.stringify(isEmptyArray(jsonChildFirstTable)),
            ReportedBy: reportedBy
        },
        url: GetAPIEndPoints("INSERTMODIFYCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                ComprehensiveAssessmentSaved(result, sectionName);
            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}


function BindStateFormNotifications(json) {

    var table, jsonParse, otherValue, otherText = '', supportIndividualDecision = '', helpMemberMakeDecisionInLifeText = '', helpSignApproveMedicalValue, helpSignApproveMedicalText = '', helpSignApproveLifePlanValue, helpSignApproveLifePlanText = '', helpSignApproveFinancialValue, helpSignApproveFinancialText = '', guardianshipProofText;
    table = $('#GuardianshipAndAdvocacy').DataTable();
    table.clear();

    jsonParse = JSON.parse(json);
    for (i = 0; i < jsonParse.length; i++) {
        // if (jsonParse[i].HelpMemberMakeDecisionInLife != null && jsonParse[i].HelpMemberMakeDecisionInLife != undefined) {
        //     helpMemberMakeDecisionInLifeText = jsonParse[i].HelpMemberMakeDecisionInLife;

        // }
        if (jsonParse[i].GuardianshipProof != undefined || jsonParse[i].GuardianshipProof != '' || jsonParse[i].GuardianshipProof != null) {
            guardianshipProofText = $("input[name=RadioGuardianshipProof][value=" + jsonParse[i].GuardianshipProof + "]").parent('label').text().trim();

        }
        if (jsonParse[i].HelpSignApproveLifePlan == true) {
            supportIndividualDecision += $('#CheckboxHelpSignApproveLifePlan').parent('label').text().trim() + ',';
        }
        if (jsonParse[i].HelpSignApproveMedical == true) {
            supportIndividualDecision += $('#CheckboxHelpSignApproveMedical').parent('label').text().trim() + ',';
        }
        if (jsonParse[i].HelpSignApproveFinancial == true) {
            supportIndividualDecision += $('#CheckboxHelpSignApproveMedical').parent('label').text().trim() + ',';
        }
        if (jsonParse[i].Other == true) {
            supportIndividualDecision += $('#CheckboxOther').parent('label').text().trim();
        }
        helpSignApproveFinancialValue = jsonParse[i].HelpSignApproveFinancial == true ? 1 : 0;
        helpSignApproveLifePlanValue = jsonParse[i].HelpSignApproveLifePlan == true ? 1 : 0;
        helpSignApproveMedicalValue = jsonParse[i].HelpSignApproveMedical == true ? 1 : 0;
        otherValue = jsonParse[i].Other == true ? 1 : 0;


        var data = [
            jsonParse[i].Actions,
            jsonParse[i].HelpMemberMakeDecisionInLife,
            jsonParse[i].PersonHelpMemberMakeDecision == undefined ? '' : jsonParse[i].PersonHelpMemberMakeDecision,
            jsonParse[i].PersonInvolvementWithMember == undefined ? '' : jsonParse[i].PersonInvolvementWithMember,
            supportIndividualDecision,
            guardianshipProofText,
            helpSignApproveLifePlanValue,
            helpSignApproveMedicalValue,
            helpSignApproveFinancialValue,
            otherValue,
            jsonParse[i].GuardianshipProof,
            jsonParse[i].PersonHelpMemberMakeDecision,
            jsonParse[i].GuardianshipAndAdvocacyTableId,
        ];
        table.row.add(data).draw();
        supportIndividualDecision = '';
    }
}


//#region CreatePublishVersion
function CreatePublishVersion() {
    var data = {
        TabName: "PublishCCOComprehensiveAssessmentVersion", CompAssessmentId: $("#TextBoxCompAssessmentId").val(), CompAssessmentVersioningId: $("#TextBoxCompAssessmentVersioningId").val(),
        IndividualName: $("#DropDownClientId").find("option:selected").text(), ReportedBy: reportedBy

    };

    $.ajax({
        type: "POST",
        data: data,
        url: GetAPIEndPoints("HandleCCOComprehensiveAssessmentVersioning"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {

                InsertDocumentPath(result);
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function InsertDocumentPath(result) {
    var data = {
        ClientID: result.CCOComprehensiveAssessmentResponse[0].ClientId, DocumentName: result.CCOComprehensiveAssessmentResponse[0].Documentname, DocumentFileName: result.CCOComprehensiveAssessmentResponse[0].Documentname, Comments: "test"
    };
    $.ajax({
        type: "POST",
        url: Cx360URL + '/api/Client/SaveClientDocument?' + jQuery.param(data),
        headers: {
            TOKEN: token,
        },
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            if (!isEmpty(result) && result.MessageCode == "200") {
                showRecordSaved(result.Message);
                location.href = "../../../MyPage/MyPage.aspx";
            }
            else {
                showErrorMessage(result.Message);
            }

        },

        error: function (xhr) { HandleAPIError(xhr) }
    });
}

function showVersioningBtn(className) {
    $('.' + className).removeAttr('hidden');
    $('.' + className).show();
    $('#btnSaveAsNew').hide();
}

//#region SaveDraftRegion
function SaveDraft() {

    $.ajax({
        type: "POST",
        data: { TabName: "CreateNewVersionCCOComprehensiveAssessment", CompAssessmentId: $("#TextBoxCompAssessmentId").val(), CompAssessmentVersioningId: $("#TextBoxCompAssessmentVersioningId").val(), ReportedBy: reportedBy },
        url: GetAPIEndPoints("HandleCCOComprehensiveAssessmentVersioning"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
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
function NewVersioncreated(response) {
    if (response.Success == true) {
        if (response.CCOComprehensiveAssessmentResponse[0].CompAssessmentId > 0) {
            showRecordSaved("New version created successfully");
            $('#TextBoxCompAssessmentId').val(response.CCOComprehensiveAssessmentResponse[0].CompAssessmentId);
            $('#TextBoxCompAssessmentVersioningId').val(response.CCOComprehensiveAssessmentResponse[0].CompAssessmentVersioningId);
            $('#labelCCOAssessmentStatus').val(response.CCOComprehensiveAssessmentResponse[0].DocumentStatus);
            $('#labelDocumentVersion').val(response.CCOComprehensiveAssessmentResponse[0].DocumentVersion);


            $("#btnSaveAsNew").addClass("hidden");
            $("#btnPrintPDf").show();
            $("#btnPublishVersion").show();

            $('#masterSection .form-control').attr("disabled", true);
            $('.eligibilityInformation .form-control').attr("disabled", true);
            $('.communicationLanguage .form-control').attr("disabled", true);
            $('.memberProviders .form-control').attr("disabled", true);
            $('.circleOfSupport .form-control').attr("disabled", true);
            $('.guardianshipAndAdvocacy .form-control').attr("disabled", true);
            $('.advancedDirectivesFuturePlanning .form-control').attr("disabled", true);
            $('.independentLivingSkills .form-control').attr("disabled", true);
            $('.socialServiceNeeds .form-control').attr("disabled", true);
            $('.medicalHealth .form-control').attr("disabled", true);
            $('.healthPromotion .form-control').attr("disabled", true);
            $('.behavioralHealth .form-control').attr("disabled", true);
            $('.challengingBehaviors .form-control').attr("disabled", true);
            $('.behavioralSupportPlan .form-control').attr("disabled", true);
            $('.medications .form-control').attr("disabled", true);
            $('.communitySocial .form-control').attr("disabled", true);
            $('.education .form-control').attr("disabled", true);
            $('.transitionPlanning .form-control').attr("disabled", true);
            $('.employment .form-control').attr("disabled", true);

            $(".greenColor").prop("disabled", false);
            $(".redColor").prop("disabled", false);

            $('.btnCommon').text("Edit");
            $('.btnCommon').show();
            $("#btnUploadPDf").text("Edit");
            $("#btnUploadPDf").show();

            $(".addModal-2").show();
            $(".addModal-3").show();

            changeNewURLParameters(response);
        }

    }
}
function changeNewURLParameters(response) {
    var currentURL = $(location).attr("href");
    if (currentURL.indexOf('?') > -1) {
        var newURL = new window.URL(currentURL),
            changeCompAssessmentId = newURL.searchParams.set("CCOComprehensiveAssessmentId", response.CCOComprehensiveAssessmentResponse[0].CompAssessmentId),
            changeDocumentVersionId = newURL.searchParams.set("CCOAssessmentVersioningId", response.CCOComprehensiveAssessmentResponse[0].CompAssessmentVersioningId);
        history.pushState(null, 'CCO Comprehensive Assessment Template', newURL.href);
    }
}


function ShowHideButtons(status, version, test) {

    if (status == "Published" && version == true) {
        $("#btnSaveAsNew").removeClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").addClass("hidden");
        $(".btnCommon").hide();
        $("#btnUploadPDf").hide();

        setTimeout(function () {
            $(".greencolor").prop("disabled", true);
            $(".redcolor").prop("disabled", true);
        }, 2000);
        $(".form-control").prop("disabled", true);
    }
    else if (status == "Published" && version == false) {
        $("#btnSaveAsNew,  #btnPublishVersion").addClass("hidden");
        $("#btnAcknowledgeAndAgreed").addClass("hidden");
        $("#btnPrintPDf").show();
        $(".addModal-2").addClass('hidden');
        $(".addModal-3").addClass('hidden');
        $(".btnCommon").hide();
        $("#btnUploadPDf").hide();

        setTimeout(function () {
            $(".greencolor").prop("disabled", true);
            $(".redcolor").prop("disabled", true);
        }, 2000);
        $(".form-control").prop("disabled", true);
    }
    else if (status == "Draft") {
        $("#btnSaveAsNew").addClass("hidden");
        $("#btnSaveAsMajor").addClass("hidden");
        $("#btnPrintPDf").show();
        $("#btnPublishVersion").removeClass("hidden");
        $('.btnCommon').text("Edit");
        $('.btnCommon').show();
        $("#btnUploadPDf").text("Edit");
        $("#btnUploadPDf").show();

        $('#masterSection .form-control').attr("disabled", true);
        $('.eligibilityInformation .form-control').attr("disabled", true);
        $('.communicationLanguage .form-control').attr("disabled", true);
        $('.memberProviders .form-control').attr("disabled", true);
        $('.circleOfSupport .form-control').attr("disabled", true);
        $('.guardianshipAndAdvocacy .form-control').attr("disabled", true);
        $('.advancedDirectivesFuturePlanning .form-control').attr("disabled", true);
        $('.independentLivingSkills .form-control').attr("disabled", true);
        $('.socialServiceNeeds .form-control').attr("disabled", true);
        $('.medicalHealth .form-control').attr("disabled", true);
        $('.healthPromotion .form-control').attr("disabled", true);
        $('.behavioralHealth .form-control').attr("disabled", true);
        $('.challengingBehaviors .form-control').attr("disabled", true);
        $('.behavioralSupportPlan .form-control').attr("disabled", true);
        $('.medications .form-control').attr("disabled", true);
        $('.communitySocial .form-control').attr("disabled", true);
        $('.education .form-control').attr("disabled", true);
        $('.transitionPlanning .form-control').attr("disabled", true);
        $('.employment .form-control').attr("disabled", true);
        setTimeout(function () {
            $(".greencolor").prop("disabled", false);
            $(".redcolor").prop("disabled", false);
        }, 2000);
    }
}
$(function () {
    $("#btnShowPopupaddNewContact").click(function () {
        $("#exampleModalCircleSupport").modal("hide");
        $("#addNewContact").modal("show");
        $(".modal-backdrop.fade.show").removeClass("modal-backdrop");
        //$(".modal-backdrop.fade.show").addClass("hide");

    });
    $("#btnHidePopupaddNewContact").click(function () {
        $("#addNewContact").modal("hide");
        $("#exampleModalCircleSupport").modal("show");
    });
    $("#btnClosePopupaddNewContact").click(function () {
        $("#addNewContact").modal("hide");
        $("#exampleModalCircleSupport").modal("show");
    });
});
function openmodel() {
    (".modal-backdrop.fade.show").remove();
}
function openModalCircleSupport(current, Condition, id) {

    commonId = id;
    clientId = $("#DropDownClientId").val() == "" ? GetParameterValues('ClientId') : $("#DropDownClientId").val();
    $.ajax({
        type: "Get",
        url: 'https://staging-api.cx360.net/api/Incident/GetContactsandCircleofSupport?ClientID=' + clientId + '',
        headers: {
            'Token': "5nbcWSMDrRJjsdyjrACopeL67Bk6SjhFbo9jGVeCjIlKvmLiA0dlTYERs6hrhC8PCu7Tyr/YzB1XTdc3Of6w6A==",
        },
        success: function (result) {

            if (result.length > 0) {
                if (result.length > 0) {
                    $('#tblCircleOfSupport').DataTable({
                        "stateSave": true,
                        "bDestroy": true,
                        "paging": true,
                        "searching": true,
                        "lengthMenu": [[5, 10, 15, -1], [5, 10, 15, "All"]],
                        "aaData": result,
                        "columns": [{ "data": "LastName" }, { "data": "ContactType" }, { "data": "Relationship" }, { "data": "OrganizationName" }, { "data": "EffectiveFrom" }, { "data": "EffectiveTo" }]
                    });
                    jQuery('.dataTable').wrap('<div class="dataTables_scroll" />');
                }
            }

        },
        error: function (xhr) {
            showErrorMessage("Record Not Found");
        }
    });
    $('.bodyWrapper').addClass('backDropLayer');
    $("#exampleModalCircleSupport").modal("show");
}
function closeModalCircleSupport(closeModal) {

    $("#" + closeModal).modal("hide");
}

function BindCircleAndSupportTable() {
    $('#tblCircleOfSupport tbody').on('click', 'tr', function () {

        var columnName = commonId.replace('TextBox', '');
        var currentFieldData = $('#tblCircleOfSupport').DataTable().row(this).data()['LastName'];
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        }
        else {
            $('#tblCircleOfSupport').DataTable().$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        $('#' + commonId).text(currentFieldData);
        commonId = '';
        $("#exampleModalCircleSupport").modal("hide");
    });
}


function ManageCCOComprehensiveAssessment(comprehensiveAssessmentId) {

    $.ajax({
        type: "POST",
        data: { TabName: "AllCCO_ComprehensiveAssessmentDetails", ComprehensiveAssessmentId: comprehensiveAssessmentId },
        url: GetAPIEndPoints("GETCCOCOMPREHENIVEASSESSMENTDETAIL"),
        headers: {
            'Token': _commonToken,
            'Source': _companyID
        },
        success: function (result) {
            if (result.Success == true) {
                setTimeout(function () {
                    $(".loader").fadeOut("slow");
                    //var allData=JSON.parse(result.JSON);
                    fillAllCCOComprehensiveAssessmentSection(result);
                }, 8000);

            }
            else {
                showErrorMessage(result.Message);
            }

        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function fillAllCCOComprehensiveAssessmentSection(result) {

    $(".btnDisable").prop("disabled", false);
    clientId = result.CCO_CompAssessment[0].ClientId;

    IntializeDataTables();
    BindDropDowns();

    BindMedications(clientId);
    BindCircleOfSupport();
    BindDiagnosis();
    CloseErrorMeeage();
    InitalizeDateControls();
    $('.bgStart').show();
    ValidateUploadedFile();
    BindCircleAndSupportTable();

    setTimeout(function () {
        CCOComprehensiveAssessmentDetails(result);
        EligibilityInformation(result);
        Communication(result);
        MemberProvider(result);
        GuardianshipAndAdvocacy(result);
        AdvancedDirectivesFuturePlanning(result);
        IndependentLivingSkill(result);
        SocialServiceNeeds(result);
        MedicalHealth(result);
        HealthPromotion(result);
        BehavioralHealth(result);
        ChallengingBehavior(result);
        BehavioralSupportPlan(result);
        Medications(result);
        CommunitySocial(result);
        Education(result);
        TransitionPlanning(result);
        Employment(result);
        // CircleAndSupportSection(result);   
    }, 5000);

}
function CCOComprehensiveAssessmentDetails(result) {

    if (result.CCO_CompAssessment.length > 0) {
        // var data=JSON.parse(allData[0].CCO_CompAssessment);
        $("#labelCCOAssessmentStatus").val(result.CCO_CompAssessment[0].DocumentStatus);
        $("#labelDocumentVersion").val(result.CCO_CompAssessment[0].DocumentVersion);
        $("#TextBoxCompAssessmentId").val(result.CCO_CompAssessment[0].CompAssessmentId);
        $("#TextBoxCompAssessmentVersioningId").val(result.CCO_CompAssessment[0].CompAssessmentVersioningId);
        $("#TextBoxAssessmentDate").val(result.CCO_CompAssessment[0].AssessmentDate);
        // $("#DropDownClientId").select2('val', [data[0].ClientId]);
        $("#DropDownClientId").val(result.CCO_CompAssessment[0].ClientId);
        $("#TextBoxDateOfBirth").val(result.CCO_CompAssessment[0].DateOfBirth);
        $("#IndividualMiddleName").val(result.CCO_CompAssessment[0].IndividualMiddleName);
        $("#TextBoxIndividualSuffix").val(result.CCO_CompAssessment[0].IndividualSuffix);
        $("#TextBoxNickname").val(result.CCO_CompAssessment[0].Nickname);
        $("#TextBoxTABSId").val(result.CCO_CompAssessment[0].TABSId);
        $("#TextBoxMedicaidId").val(result.CCO_CompAssessment[0].MedicaidId);
        $("#TextBoxGender").val(result.CCO_CompAssessment[0].Gender);
        // $("#DropDownPreferredGender").select2('val', [result.CCO_CompAssessment[0].DropDownPreferredGender]);
        $("#DropDownPreferredGender").val(result.CCO_CompAssessment[0].PreferredGender);
        $("#TextBoxRace").val(result.CCO_CompAssessment[0].Race);
        $("#TextBoxEthnicity").val(result.CCO_CompAssessment[0].Ethnicity);
        $("#TextBoxPhoneNumber").val(result.CCO_CompAssessment[0].PhoneNumber);
        $("#TextBoxStreetAddress1").val(result.CCO_CompAssessment[0].StreetAddress1);
        $("#TextBoxStreetAddress2").val(result.CCO_CompAssessment[0].StreetAddress2);
        $("#TextBoxCity").val(result.CCO_CompAssessment[0].City);
        $("#TextBoxState").val(result.CCO_CompAssessment[0].State);
        $("#TextBoxZipCode").val(result.CCO_CompAssessment[0].ZIPCode);
        $("#DropDownLivingSituation").val(result.CCO_CompAssessment[0].LivingSituation);
        $("#TextBoxWillowbrookStatus").val(result.CCO_CompAssessment[0].WillowbrookStatus);
        $("#DropDownRepresentationStatus").val(result.CCO_CompAssessment[0].RepresentationStatus);
        $("#TextBoxExpectationsforCommunityInclusion").val(result.CCO_CompAssessment[0].ExpectationsforCommunityInclusion);
        $("#TextBoxHospitalStaffingCoverage").val(result.CCO_CompAssessment[0].HospitalStaffingCoverage);
        $("#TextBoxCABRepContact1").text(result.CCO_CompAssessment[0].CABRepContact1);
        $("#TextBoxCABRepContact2").text(result.CCO_CompAssessment[0].CABRepContact2);
        ShowHideButtons(result.CCO_CompAssessment[0].DocumentStatus, result.CCO_CompAssessment[0].LatestVersion, result.CCO_CompAssessment[0].Status);

        var hideFieldClass = 'willowbrookStatusClass';
        if ($('#TextBoxWillowbrookStatus').val().toLowerCase() == "true") {
            showFields(hideFieldClass);
        }

        if ($("#DropDownRepresentationStatus :selected").text() == "Full Representation") {
            $('.cabRepContact1').removeAttr('hidden');
            $('.cabRepContact1').show();
        }
        if ($("#DropDownRepresentationStatus :selected").text() == "Co Representation") {
            $('.cabRepContact1').removeAttr('hidden');
            $('.cabRepContact2').removeAttr('hidden');
            $('.cabRepContact1').show();
            $('.cabRepContact2').show();
        }
        disableOnAdd('masterSection');

    }
}
function EligibilityInformation(result) {

    if (result.CCO_EligibilityInformation.length > 0) {

        $("#TextBoxMCOEnrollmentDate").val(result.CCO_EligibilityInformation[0].MCOEnrollmentDate);
        $("#DropDownMCOName").val(result.CCO_EligibilityInformation[0].MCOName);
        $("#DropDownOPWDDEligibility").val(result.CCO_EligibilityInformation[0].OPWDDEligibility);
        $("#TextBoxICFEligibilityDeterminationDate").val(result.CCO_EligibilityInformation[0].ICFEligibilityDeterminationDate);
        $("#MedicaidExpirationDate").val(result.CCO_EligibilityInformation[0].ExpirationDate);
        $("#TextBoxHHConsentDate").val(result.CCO_EligibilityInformation[0].HHConsentDate);
        $("#TextBoxEligibilityInformationId").val(result.CCO_EligibilityInformation[0].EligibilityInformationId);
        if (result.CCO_EligibilityInformation[0].Status != null) {
            var status = result.CCO_EligibilityInformation[0].Status;
            if (status == "Completed") {
                $("#statusCompletedEligibilityInformation").show();
                $("#statusStartEligibilityInformation").hide();
                $("#statusInprogressEligibilityInformation").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedEligibilityInformation").hide();
                $("#statusStartEligibilityInformation").hide();
                $("#statusInprogressEligibilityInformation").show();
            }


        }
    }
    else {
        $("#statusCompletedEligibilityInformation").hide();
        $("#statusStartEligibilityInformation").show();
        $("#statusInprogressEligibilityInformation").hide();
    }
    disableOnAdd('eligibilityInformation');



}
function Communication(result) {

    if (result.CCO_Communication.length > 0) {

        $("input[name='RadioMemExpressiveCommunicationSkill'][value=" + result.CCO_Communication[0].MemExpressiveCommunicationSkill + "]").prop('checked', true);
        $("input[name='RadioMemReceptiveCommunicationSkill'][value=" + result.CCO_Communication[0].MemReceptiveCommunicationSkill + "]").prop('checked', true);
        $("#TextBoxMemPrimaryLanguage").val(result.CCO_Communication[0].MemPrimaryLanguage);
        $("#DropDownMemPrimarySpokenLanguage").val(result.CCO_Communication[0].MemPrimarySpokenLanguage);
        $("#DropDownMemPrimaryWrittenLanguage").val(result.CCO_Communication[0].MemPrimaryWrittenLanguage);
        $("input[name='RadioMemAbleToReadPrimaryLanguage'][value=" + result.CCO_Communication[0].MemAbleToReadPrimaryLanguage + "]").prop('checked', true);
        $("input[name='RadioMemMultiLingual'][value=" + result.CCO_Communication[0].MemMultiLingual + "]").prop('checked', true);
        $("#DropDownMemMultiLingualLanguages").val(result.CCO_Communication[0].MemMultiLingualLanguages);
        if (result.CCO_Communication[0].Interpreter == true) {
            $("input[name='CheckboxInterpreter']").prop('checked', true);
        }
        if (result.CCO_Communication[0].Translator == true) {
            $("input[name='CheckboxTranslator']").prop('checked', true);
        }
        if (result.CCO_Communication[0].InterpreterAndTranslator == true) {
            $("input[name='CheckboxInterpreterAndTranslator']").prop('checked', true);
        }
        if (result.CCO_Communication[0].NotApplicable == true) {
            $("input[name='CheckboxNotApplicable']").prop('checked', true);
        }
        $("input[name='RadioMemWantToImproveCommunicate'][value=" + result.CCO_Communication[0].MemWantToImproveCommunicate + "]").prop('checked', true);
        $("#TextBoxCommunicationId").val(result.CCO_Communication[0].CommunicationId);

        //show hide fields
        if ($("input[name='RadioMemMultiLingual']").prop('checked')) {
            $('.multiLingualClass').removeAttr('hidden');
        };
        if (result.CCO_Communication[0].Status != null) {
            var status = result.CCO_Communication[0].Status;
            if (status == "Completed") {
                $("#statusCompletedCommunicationLanguage").show();
                $("#statusStartCommunicationLanguage").hide();
                $("#statusInprogressCommunicationLanguage").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedCommunicationLanguage").hide();
                $("#statusStartCommunicationLanguage").hide();
                $("#statusInprogressCommunicationLanguage").show();
            }


        }

    }
    else {
        $("#statusCompletedCommunicationLanguage").hide();
        $("#statusStartCommunicationLanguage").show();
        $("#statusInprogressCommunicationLanguage").hide();
    }
    disableOnAdd('communicationLanguage');



}
function MemberProvider(result) {

    if (result.CCO_MemberProviders.length > 0) {

        //var data=JSON.parse(allData[0].CCO_MemberProviders);
        $("#TextBoxPrimaryCarePhysician").text(result.CCO_MemberProviders[0].PrimaryCarePhysician);
        $("#TextBoxDentist").text(result.CCO_MemberProviders[0].Dentist);
        $("#TextBoxPsychiatrist").text(result.CCO_MemberProviders[0].Psychiatrist);
        $("#TextBoxPsychologist").text(result.CCO_MemberProviders[0].Psychologist);
        $("#TextBoxEyeDoctor").text(result.CCO_MemberProviders[0].EyeDoctor);
        $("#TextBoxPharmacy").text(result.CCO_MemberProviders[0].Pharmacy);
        $("#TextBoxHospital").text(result.CCO_MemberProviders[0].Hospital);
        $("#TextBoxMemberProviderId").text(result.CCO_MemberProviders[0].MemberProviderId);

        if (result.CCO_MemberProviders[0].Status != null) {
            var status = result.CCO_MemberProviders[0].Status;
            if (status == "Completed") {
                $("#statusCompletedMemberProviders").show();
                $("#statusStartMemberProviders").hide();
                $("#statusInprogressMemberProviders").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedMemberProviders").hide();
                $("#statusStartMemberProviders").hide();
                $("#statusInprogressMemberProviders").show();
            }


        }
    }
    else {
        $("#statusCompletedMemberProviders").hide();
        $("#statusStartMemberProviders").show();
        $("#statusInprogressMemberProviders").hide();
    }
    disableOnAdd('memberProviders');

}
function AdvancedDirectivesFuturePlanning(result) {

    if (result.CCO_AdvancedDirectivesFuturePlanning.length > 0) {

        // var data=JSON.parse(allData[0].CCO_AdvancedDirectivesFuturePlanning);

        $("input[name='RadioMemHaveHealthCareProxy'][value=" + result.CCO_AdvancedDirectivesFuturePlanning[0].MemHaveHealthCareProxy + "]").prop('checked', true);
        $("input[name='RadioMemLearnAdvancedHealthProxies'][value=" + result.CCO_AdvancedDirectivesFuturePlanning[0].MemLearnAdvancedHealthProxies + "]").prop('checked', true);
        $("input[name='RadioMemSurrogateDesMakingCommittee'][value=" + result.CCO_AdvancedDirectivesFuturePlanning[0].MemSurrogateDesMakingCommittee + "]").prop('checked', true);
        $("input[name='RadioMemUtiCommitAproveBehavioralSupportPlan'][value=" + result.CCO_AdvancedDirectivesFuturePlanning[0].MemUtiCommitAproveBehavioralSupportPlan + "]").prop('checked', true);
        $("#TextBoxAdvancedDirectivesFuturePlanningId").val(result.CCO_AdvancedDirectivesFuturePlanning[0].AdvancedDirectivesFuturePlanningId);
        $("#TextBoxHealthCareProxyName").text(result.CCO_AdvancedDirectivesFuturePlanning[0].HealthCareProxyName);
        //show hide fields  

        if ($("input[name='RadioMemHaveHealthCareProxy'][value=1]").prop('checked')) {
            $('.healthCareProxyClass').removeAttr('hidden');
        }

        if (result.CCO_AdvancedDirectivesFuturePlanning[0].Status != null) {
            var status = result.CCO_AdvancedDirectivesFuturePlanning[0].Status;
            if (status == "Completed") {
                $("#statusCompletedAdvancedDirectivesFuturePlanning").show();
                $("#statusStartAdvancedDirectivesFuturePlanning").hide();
                $("#statusInprogressAdvancedDirectivesFuturePlanning").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedAdvancedDirectivesFuturePlanning").hide();
                $("#statusStartAdvancedDirectivesFuturePlanning").hide();
                $("#statusInprogressAdvancedDirectivesFuturePlanning").show();
            }


        }
    }
    else {
        $("#statusCompletedAdvancedDirectivesFuturePlanning").hide();
        $("#statusStartAdvancedDirectivesFuturePlanning").show();
        $("#statusInprogressAdvancedDirectivesFuturePlanning").hide();
    }
    disableOnAdd('advancedDirectivesFuturePlanning');


}
function IndependentLivingSkill(result) {

    if (result.CCO_IndependentLivingSkill.length > 0) {

        // var data=JSON.parse(allData[0].CCO_IndependentLivingSkill);

        $("#TextBoxExplainConsent").val(result.CCO_IndependentLivingSkill[0].ExplainConsent);
        $("input[name='RadioIndvCurrentLevelOfHousingStability'][value=" + result.CCO_IndependentLivingSkill[0].IndvCurrentLevelOfHousingStability + "]").prop('checked', true);
        if (result.CCO_IndependentLivingSkill[0].Pest == true) {
            $("input[name='CheckboxPest']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].Mold == true) {
            $("input[name='CheckboxMold']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].LeadPaint == true) {
            $("input[name='CheckboxLeadPaint']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].LackOfHeat == true) {
            $("input[name='CheckboxLackOfHeat']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].Oven == true) {
            $("input[name='CheckboxOven']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].SmokeDetectorMissing == true) {
            $("input[name='CheckboxSmokeDetectorMissing']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].WaterLeakes == true) {
            $("input[name='CheckboxWaterLeakes']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].NoneOfTheAbove == true) {
            $("input[name='CheckboxNoneOfTheAbove']").prop('checked', true);
        }
        $("#CheckboxPest").val(result.CCO_IndependentLivingSkill[0].ExplainConsent);
        $("input[name='RadioLevelOfPersonalHygiene'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfPersonalHygiene + "]").prop('checked', true);
        $("#TextBoxExplainPersonalHygiene").val(result.CCO_IndependentLivingSkill[0].ExplainPersonalHygiene);
        $("input[name='RadioLevelOfSupportForToiletingNeed'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSupportForToiletingNeed + "]").prop('checked', true);
        $("input[name='RadioIndvExperConstipationDiarrheaVomiting'][value=" + result.CCO_IndependentLivingSkill[0].IndvExperConstipationDiarrheaVomiting + "]").prop('checked', true);
        $("input[name='RadioIndvBowelObstructionReqHospitalization'][value=" + result.CCO_IndependentLivingSkill[0].IndvBowelObstructionReqHospitalization + "]").prop('checked', true);

        if (result.CCO_IndependentLivingSkill[0].SupportNoConcernsAtThisTime == true) {
            $("input[name='CheckboxSupportNoConcernsAtThisTime']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].SupportBowelTrackingProtocol == true) {
            $("input[name='CheckboxSupportBowelTrackingProtocol']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].SupportBowelmanagementProtocol == true) {
            $("input[name='CheckboxSupportBowelmanagementProtocol']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].SupportNoBowelTrackingManagementProtocol == true) {
            $("input[name='CheckboxSupportNoBowelTrackingManagementProtocol']").prop('checked', true);
        }
        // $("input[name='RadioSupportForConstipationConcern'][value=" + result.CCO_IndependentLivingSkill[0].SupportForConstipationConcern + "]").prop('checked', true);
        $("#TextBoxExplainSupportResultConstipationNeed").val(result.CCO_IndependentLivingSkill[0].ExplainSupportResultConstipationNeed);
        $("input[name='RadioLevelOfSuppHandFaceWash'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSuppHandFaceWash + "]").prop('checked', true);
        //  $("input[name='RadioChooseAnsSupportForDentalOralCare'][value=" + result.CCO_IndependentLivingSkill[0].ChooseAnsSupportForDentalOralCare + "]").prop('checked', true);
        $("#TextBoxExplainSupportResultDentalOralCareNeed").val(result.CCO_IndependentLivingSkill[0].ExplainSupportResultDentalOralCareNeed);
        if (result.CCO_IndependentLivingSkill[0].DentalOralCareNoConcernsatThisTime == true) {
            $("input[name='CheckboxDentalOralCareNoConcernsatThisTime']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].DentalOralHygieneSupport == true) {
            $("input[name='CheckboxDentalOralHygieneSupport']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].DentalOralPreSedation == true) {
            $("input[name='CheckboxDentalOralPreSedation']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].DentalOralDentures == true) {
            $("input[name='CheckboxDentalOralDentures']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].DentalOralMedicalImmobilization == true) {
            $("input[name='CheckboxDentalOralMedicalImmobilization']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].DentalOralOther == true) {
            $("input[name='CheckboxDentalOralOther']").prop('checked', true);
        }

        $("input[name='RadioLevelOfSuppTrimNails'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSuppTrimNails + "]").prop('checked', true);
        $("input[name='RadioLevelOfSuppSneezeCough'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSuppSneezeCough + "]").prop('checked', true);
        $("input[name='RadioLevelOfSuppPPEMask'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSuppPPEMask + "]").prop('checked', true);
        $("input[name='RadioLevelOfSuppMoveSafely'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSuppMoveSafely + "]").prop('checked', true);
        //$("input[name='RadioSuppForRiskToFall'][value=" + result.CCO_IndependentLivingSkill[0].SuppForRiskToFall + "]").prop('checked', true);
        $("#TextBoxExplainSuppForRiskToFall").val(result.CCO_IndependentLivingSkill[0].ExplainSuppForRiskToFall);

        if (result.CCO_IndependentLivingSkill[0].RiskToFallNoConcernsAtThisTime == true) {
            $("input[name='CheckboxRiskToFallNoConcernsAtThisTime']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallAdaptiveEquipment == true) {
            $("input[name='CheckboxRiskToFallAdaptiveEquipment']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallenvironmentalModifications == true) {
            $("input[name='CheckboxRiskToFallenvironmentalModifications']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallRequires == true) {
            $("input[name='CheckboxRiskToFallRequires']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallContactGuarding == true) {
            $("input[name='CheckboxRiskToFallContactGuarding']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallContactGuarding == true) {
            $("input[name='CheckboxRiskToFallContactGuarding']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallVisualSupervision == true) {
            $("input[name='CheckboxRiskToFallVisualSupervision']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RiskToFallOther == true) {
            $("input[name='CheckboxRiskToFallOther']").prop('checked', true);
        }
        $("input[name='RadioFallenInLastThreeMonths'][value=" + result.CCO_IndependentLivingSkill[0].FallenInLastThreeMonths + "]").prop('checked', true);
        $("input[name='RadioHowManyTimeMemberFallenInPast'][value=" + result.CCO_IndependentLivingSkill[0].HowManyTimeMemberFallenInPast + "]").prop('checked', true);
        $("input[name='RadioConcernForIndividualVision'][value=" + result.CCO_IndependentLivingSkill[0].ConcernForIndividualVision + "]").prop('checked', true);
        $("#TextBoxExpConcernForIndividualVision").val(result.CCO_IndependentLivingSkill[0].ExpConcernForIndividualVision);
        $("input[name='RadioConcernForIndividualHearing'][value=" + result.CCO_IndependentLivingSkill[0].ConcernForIndividualHearing + "]").prop('checked', true);
        $("#TextBoxExpConcernForIndividualHearing").val(result.CCO_IndependentLivingSkill[0].ExpConcernForIndividualHearing);
        // $("#SkinIntegrityConcernsConditions").val(result.CCO_IndependentLivingSkill[0].ExpConcernForIndividualHearing);
        if (result.CCO_IndependentLivingSkill[0].NoConcernForSkinIntegrity == true) {
            $("input[name='CheckboxNoConcernForSkinIntegrity']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqPositioningSchedule == true) {
            $("input[name='CheckboxReqPositioningSchedule']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqDailySkinInspection == true) {
            $("input[name='CheckboxReqDailySkinInspection']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqAdaptiveEquipment == true) {
            $("input[name='CheckboxReqAdaptiveEquipment']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqSkinBarrierCream == true) {
            $("input[name='CheckboxReqSkinBarrierCream']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ProvideEducationWhereAppropriate == true) {
            $("input[name='CheckboxProvideEducationWhereAppropriate']").prop('checked', true);
        }
        $("#TextBoxExplainSupportSkinIntegrity").val(result.CCO_IndependentLivingSkill[0].ExplainSupportSkinIntegrity);
        // $("#NutritionalNeeds").val(result.CCO_IndependentLivingSkill[0].ExplainSupportSkinIntegrity);
        if (result.CCO_IndependentLivingSkill[0].NoConcernForNutritionalNeed == true) {
            $("input[name='CheckboxNoConcernForNutritionalNeed']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqConsistencyFood == true) {
            $("input[name='CheckboxReqConsistencyFood']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqConsistencyFluid == true) {
            $("input[name='CheckboxReqConsistencyFluid']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqReduceCalorieDiet == true) {
            $("input[name='CheckboxReqReduceCalorieDiet']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqHighCalorieDiet == true) {
            $("input[name='CheckboxReqHighCalorieDiet']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqFiberCalciumElementToDiet == true) {
            $("input[name='CheckboxReqFiberCalciumElementToDiet']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqSweetSaltFatElementRemove == true) {
            $("input[name='CheckboxReqSweetSaltFatElementRemove']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RestrictedFluid == true) {
            $("input[name='CheckboxRestrictedFluid']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].EnteralNutrition == true) {
            $("input[name='CheckboxEnteralNutrition']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqDietarySupplement == true) {
            $("input[name='CheckboxReqDietarySupplement']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqAssitMealPreparation == true) {
            $("input[name='CheckboxReqAssitMealPreparation']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqEducation == true) {
            $("input[name='CheckboxReqEducation']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqAssitMealPlanning == true) {
            $("input[name='CheckboxReqAssitMealPlanning']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ReqSupervisionDuringMeal == true) {
            $("input[name='CheckboxReqSupervisionDuringMeal']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].AdapEquDuringMeal == true) {
            $("input[name='CheckboxAdapEquDuringMeal']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].IndvMaintAdequateDiet == true) {
            $("input[name='CheckboxIndvMaintAdequateDiet']").prop('checked', true);
        }
        $("#TextBoxExpSupptNutritionalCareNeed").val(result.CCO_IndependentLivingSkill[0].ExpSupptNutritionalCareNeed);
        $("input[name='RadioRiskForChoking'][value=" + result.CCO_IndependentLivingSkill[0].RiskForChoking + "]").prop('checked', true);
        //$("input[name='RadioSupptOnChokingAspiration'][value=" + result.CCO_IndependentLivingSkill[0].SupptOnChokingAspiration + "]").prop('checked', true);
        if (result.CCO_IndependentLivingSkill[0].ChokingAspirationNoConcernsAtThisTime == true) {
            $("input[name='CheckboxChokingAspirationNoConcernsAtThisTime']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ChokingAspirationModifiedConsistency == true) {
            $("input[name='CheckboxChokingAspirationModifiedConsistency']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ChokingAspirationConsistencyLiquids == true) {
            $("input[name='CheckboxChokingAspirationConsistencyLiquids']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ChokingAspirationAvoidRisk == true) {
            $("input[name='CheckboxChokingAspirationAvoidRisk']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ChokingAspirationSupervision == true) {
            $("input[name='CheckboxChokingAspirationSupervision']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ChokingAspirationFormalTraining == true) {
            $("input[name='CheckboxChokingAspirationFormalTraining']").prop('checked', true);
        }

        $("#TextBoxExpSupptResultChokingAspirationNeed").val(result.CCO_IndependentLivingSkill[0].ExpSupptResultChokingAspirationNeed);
        $("input[name='RadioSwallowingEvaluationNeed'][value=" + result.CCO_IndependentLivingSkill[0].SwallowingEvaluationNeed + "]").prop('checked', true);
        //$("input[name='RadioSupptThatIndvNeedOnAcidReflux'][value=" + result.CCO_IndependentLivingSkill[0].SupptThatIndvNeedOnAcidReflux + "]").prop('checked', true);
        if (result.CCO_IndependentLivingSkill[0].AcidRefluxNoConcernsAtThisTime == true) {
            $("input[name='CheckboxAcidRefluxNoConcernsAtThisTime']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].AcidRefluxRemainingMinutes == true) {
            $("input[name='CheckboxAcidRefluxRemainingMinutes']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].AcidRefluxElevateHead == true) {
            $("input[name='CheckboxAcidRefluxElevateHead']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].AcidRefluxModifiedDiet == true) {
            $("input[name='CheckboxAcidRefluxModifiedDiet']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].AcidRefluxMedicationNeeded == true) {
            $("input[name='CheckboxAcidRefluxMedicationNeeded']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].AcidRefluxEncourageWeightLoss == true) {
            $("input[name='CheckboxAcidRefluxEncourageWeightLoss']").prop('checked', true);
        }
        $("#TextBoxExpSupptResultAcidRefluxNeed").val(result.CCO_IndependentLivingSkill[0].ExpSupptResultAcidRefluxNeed);
        $("input[name='RadioSupptNeedForMealPreparation'][value=" + result.CCO_IndependentLivingSkill[0].SupptNeedForMealPreparation + "]").prop('checked', true);
        $("input[name='RadioSupptNeedForMealPlanning'][value=" + result.CCO_IndependentLivingSkill[0].SupptNeedForMealPlanning + "]").prop('checked', true);
        $("input[name='RadioIndvWorriedAboutFoodInPast'][value=" + result.CCO_IndependentLivingSkill[0].IndvWorriedAboutFoodInPast + "]").prop('checked', true);
        $("input[name='RadioIndvRanOutOfFoodInPast'][value=" + result.CCO_IndependentLivingSkill[0].IndvRanOutOfFoodInPast + "]").prop('checked', true);
        $("input[name='RadioIndvElecGasOilWaterThreatedInPast'][value=" + result.CCO_IndependentLivingSkill[0].IndvElecGasOilWaterThreatedInPast + "]").prop('checked', true);
        $("input[name='RadioLevelOfSupptForCleaning'][value=" + result.CCO_IndependentLivingSkill[0].LevelOfSupptForCleaning + "]").prop('checked', true);
        //$("input[name='RadioMoneyManagementNeedOfMember'][value=" + result.CCO_IndependentLivingSkill[0].MoneyManagementNeedOfMember + "]").prop('checked', true);
        if (result.CCO_IndependentLivingSkill[0].NeedOfMemberIndependent == true) {
            $("input[name='CheckboxNeedOfMemberIndependent']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].NeedOfMemberNeedsAssistance == true) {
            $("input[name='CheckboxNeedOfMemberNeedsAssistance']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].NeedOfMemberNeedsTotalSupport == true) {
            $("input[name='CheckboxNeedOfMemberNeedsTotalSupport']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].NeedOfMemberRiskExploitation == true) {
            $("input[name='CheckboxNeedOfMemberRiskExploitation']").prop('checked', true);
        }
        $("#TextBoxExpAssistanceForBudgeting").val(result.CCO_IndependentLivingSkill[0].ExpAssistanceForBudgeting);
        $("input[name='RadioMemLearnToManageOwnMoney'][value=" + result.CCO_IndependentLivingSkill[0].MemLearnToManageOwnMoney + "]").prop('checked', true);
        $("input[name='RadioMedicationReminderMethod'][value=" + result.CCO_IndependentLivingSkill[0].MedicationReminderMethod + "]").prop('checked', true);
        $("input[name='RadioMedicationPrescribedByProvider'][value=" + result.CCO_IndependentLivingSkill[0].MedicationPrescribedByProvider + "]").prop('checked', true);
        $("input[name='RadioIndvAbilityAdministerMedication'][value=" + result.CCO_IndependentLivingSkill[0].IndvAbilityAdministerMedication + "]").prop('checked', true);
        $("input[name='RadioIndvNeedReminderForMedication'][value=" + result.CCO_IndependentLivingSkill[0].IndvNeedReminderForMedication + "]").prop('checked', true);
        $("input[name='RadioTakingMedicationAsPrescribed'][value=" + result.CCO_IndependentLivingSkill[0].TakingMedicationAsPrescribed + "]").prop('checked', true);
        $("input[name='RadioIndvRefuseForMedication'][value=" + result.CCO_IndependentLivingSkill[0].IndvRefuseForMedication + "]").prop('checked', true);
        $("#TextBoxExpIndvRefuseForMedication").val(result.CCO_IndependentLivingSkill[0].ExpIndvRefuseForMedication);
        $("#TextBoxExpSupptMedicationAdministration").val(result.CCO_IndependentLivingSkill[0].ExpSupptMedicationAdministration);
        $("input[name='RadioIndvAbleToAccessOwnPhone'][value=" + result.CCO_IndependentLivingSkill[0].IndvAbleToAccessOwnPhone + "]").prop('checked', true);
        $("input[name='RadioIndvAbleToCallEmergency'][value=" + result.CCO_IndependentLivingSkill[0].IndvAbleToCallEmergency + "]").prop('checked', true);
        $("input[name='RadioIndvAbleToAccessInternet'][value=" + result.CCO_IndependentLivingSkill[0].IndvAbleToAccessInternet + "]").prop('checked', true);
        $("input[name='RadioIndvCallApplicableContactInPhone'][value=" + result.CCO_IndependentLivingSkill[0].IndvCallApplicableContactInPhone + "]").prop('checked', true);
        $("input[name='RadioIndvNeedTransportation'][value=" + result.CCO_IndependentLivingSkill[0].IndvNeedTransportation + "]").prop('checked', true);
        $("#TextBoxExpTransportationNeed").val(result.CCO_IndependentLivingSkill[0].ExpTransportationNeed);
        $("input[name='RadioIndvLackedForTransportationInPastMonths'][value=" + result.CCO_IndependentLivingSkill[0].IndvLackedForTransportationInPastMonths + "]").prop('checked', true);
        $("input[name='RadioIndvLearnToDrive'][value=" + result.CCO_IndependentLivingSkill[0].IndvLearnToDrive + "]").prop('checked', true);
        $("input[name='RadioIndvWantVehicleOwnership'][value=" + result.CCO_IndependentLivingSkill[0].IndvWantVehicleOwnership + "]").prop('checked', true);
        $("input[name='RadioIndvIndependentUsingTransportation'][value=" + result.CCO_IndependentLivingSkill[0].IndvIndependentUsingTransportation + "]").prop('checked', true);
        $("input[name='RadioConcernsWithBehavior'][value=" + result.CCO_IndependentLivingSkill[0].ConcernsWithBehavior + "]").prop('checked', true);
        $("#TextBoxHowIndvMentalHealth").val(result.CCO_IndependentLivingSkill[0].HowIndvMentalHealth);
        $("input[name='RadioIndvCommunicateHealthConcern'][value=" + result.CCO_IndependentLivingSkill[0].IndvCommunicateHealthConcern + "]").prop('checked', true);
        $("#TextBoxExpIndvAbilityCommHealthConcern").val(result.CCO_IndependentLivingSkill[0].ExpIndvAbilityCommHealthConcern);
        $("input[name='RadioIndvAttendAllHealthService'][value=" + result.CCO_IndependentLivingSkill[0].IndvAttendAllHealthService + "]").prop('checked', true);
        $("#TextBoxExpSupptIndvAttendAllHealthService").val(result.CCO_IndependentLivingSkill[0].ExpSupptIndvAttendAllHealthService);
        $("input[name='RadioIndvSuppToHelpADLS'][value=" + result.CCO_IndependentLivingSkill[0].IndvSuppToHelpADLS + "]").prop('checked', true);
        $("input[name='RadioIndvDifficultyRememberingThings'][value=" + result.CCO_IndependentLivingSkill[0].IndvDifficultyRememberingThings + "]").prop('checked', true);
        // $("input[id='CheckboxFollowTwoStepInstruction'][value=" + result.CCO_IndependentLivingSkill[0].IndvDifficultyRememberingThings + "]").prop('checked', true);
        if (result.CCO_IndependentLivingSkill[0].FollowTwoStepInstruction == true) {
            $("input[name='CheckboxFollowTwoStepInstruction']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].SpeakInFullSentence == true) {
            $("input[name='CheckboxSpeakInFullSentence']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].PretendPlay == true) {
            $("input[name='CheckboxPretendPlay']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].ImitateOther == true) {
            $("input[name='CheckboxImitateOther']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].DrawCircle == true) {
            $("input[name='CheckboxDrawCircle']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].RunWithoutFalling == true) {
            $("input[name='CheckboxRunWithoutFalling']").prop('checked', true);
        }
        if (result.CCO_IndependentLivingSkill[0].UpDownStepOneFootPerStep == true) {
            $("input[name='CheckboxUpDownStepOneFootPerStep']").prop('checked', true);
        }
        $("input[name='RadioIndvRecvPreschoolService'][value=" + result.CCO_IndependentLivingSkill[0].IndvRecvPreschoolService + "]").prop('checked', true);
        $("input[name='RadioIndvHaveFireSafetyNeed'][value=" + result.CCO_IndependentLivingSkill[0].IndvHaveFireSafetyNeed + "]").prop('checked', true);
        $("#TextBoxExpIndvFireSafetyConcern").val(result.CCO_IndependentLivingSkill[0].ExpIndvFireSafetyConcern);
        $("input[name='RadioIndvHaveInfoAboutFireStartStoppedEtc'][value=" + result.CCO_IndependentLivingSkill[0].IndvHaveInfoAboutFireStartStoppedEtc + "]").prop('checked', true);
        $("input[name='RadioIndvEvacuateDuringFire'][value=" + result.CCO_IndependentLivingSkill[0].IndvEvacuateDuringFire + "]").prop('checked', true);
        $("#TextBoxExpAbilityToMaintainSafetyInEmergency").val(result.CCO_IndependentLivingSkill[0].ExpAbilityToMaintainSafetyInEmergency);
        $("input[name='RadioIsBackupPlanWhenNoHCBSProvider'][value=" + result.CCO_IndependentLivingSkill[0].IsBackupPlanWhenNoHCBSProvider + "]").prop('checked', true);
        $("input[name='RadioSupervisionNeedOfTheMemberInCommunity'][value=" + result.CCO_IndependentLivingSkill[0].SupervisionNeedOfTheMemberInCommunity + "]").prop('checked', true);
        $("input[name='RadioSupervisionNeedOfTheMemberAtNight'][value=" + result.CCO_IndependentLivingSkill[0].SupervisionNeedOfTheMemberAtNight + "]").prop('checked', true);
        $("#TextBoxExpSupervisionNeed").val(result.CCO_IndependentLivingSkill[0].ExpSupervisionNeed);
        $("#TextBoxIndependentLivingSkillId").val(result.CCO_IndependentLivingSkill[0].IndependentLivingSkillId);
        $("input[name='RadioSupervisionNeedOfTheMemberAtHome'][value=" + result.CCO_IndependentLivingSkill[0].SupervisionNeedOfTheMemberAtHome + "]").prop('checked', true);


        if (result.CCO_IndependentLivingSkill[0].SupervisionNeedNoconcerns == true) {
            $("input[name='CheckboxSupervisionNeedNoconcerns']").prop('checked', true);
        } if (result.CCO_IndependentLivingSkill[0].SupervisionNeedLineOfSight == true) {
            $("input[name='CheckboxSupervisionNeedLineOfSight']").prop('checked', true);
        } if (result.CCO_IndependentLivingSkill[0].SupervisionNeed1Ratio1 == true) {
            $("input[name='CheckboxSupervisionNeed1Ratio1']").prop('checked', true);
        } if (result.CCO_IndependentLivingSkill[0].SupervisionNeedRequiresPeriodBedChecks == true) {
            $("input[name='CheckboxSupervisionNeedRequiresPeriodBedChecks']").prop('checked', true);
        } if (result.CCO_IndependentLivingSkill[0].SupervisionNeedAdaptiveEquipement == true) {
            $("input[name='CheckboxSupervisionNeedAdaptiveEquipement']").prop('checked', true);
        } if (result.CCO_IndependentLivingSkill[0].SupervisionNeedSleepChart == true) {
            $("input[name='CheckboxSupervisionNeedSleepChart']").prop('checked', true);
        } if (result.CCO_IndependentLivingSkill[0].SupervisionNeedOther == true) {
            $("input[name='CheckboxSupervisionNeedOther']").prop('checked', true);
        }

        //show hide fields

        $(".independentLivingSkills  .constipationConcerns").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.constipationConcernsClass').removeAttr('hidden');
                $('.constipationConcernsClass').show();
            }
        });

        $(".independentLivingSkills  .oralCareNeeds").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.oralCareNeedsClass').removeAttr('hidden');
                $('.oralCareNeedsClass').show();
            }
        });

        $(".independentLivingSkills  .riskForFall").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.riskForFallClass').removeAttr('hidden');
                $('.riskForFallClass').show();
            }
        });

        $(".independentLivingSkills  input[name=RadioFallenInLastThreeMonths]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.fallenInLastMonthClass').removeAttr('hidden');
                $('.fallenInLastMonthClass').show();
            }
        });


        $(".independentLivingSkills  .skinIntegrity ").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.skinIntegrityClass').removeAttr('hidden');
                $('.skinIntegrityClass').show();
            }
        });


        $(".independentLivingSkills  .nutritionalNeeds").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.nutritionalNeedsClass').removeAttr('hidden');
                $('.nutritionalNeedsClass').show();
            }
        });

        $(".independentLivingSkills  .swallowingNeeds").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.swallowingNeedsClass').removeAttr('hidden');
                $('.swallowingNeedsClass').show();
            }
        });

        $(".independentLivingSkills  input[name=RadioSupptThatIndvNeedOnAcidReflux]").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.gerdClass').removeAttr('hidden');
                $('.gerdClass').show();
            }
        });
        $(".independentLivingSkills  .budgetingMoney").each(function (index) {
            if ($(this).parent().text().trim() != 'independent' && $(this).prop('checked')) {
                $('.budgetingMoneyClass').removeAttr('hidden');
                $('.budgetingMoneyClass').show();
            }
        });

        $(".independentLivingSkills  input[name=RadioIndvRefuseForMedication]").each(function (index) {
            if ($(this).parent().text().trim() != 'Never' && $(this).prop('checked')) {
                $('.medication_s_Class').removeAttr('hidden');
                $('.medication_s_Class').show();
            }
        });
        $(".independentLivingSkills  .supervisionNeeds").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.supervisionNeedsClass').removeAttr('hidden');
                $('.supervisionNeedsClass').show();
            }
        });

        $(".independentLivingSkills .gerd").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.gerdClass').removeAttr('hidden');
                $('.gerdClass').show();
            }
        });

        $(".independentLivingSkills  input[name=RadioIndvNeedReminderForMedication]").each(function (index) {
            if ($(this).parent().text().trim() != 'Never' && $(this).prop('checked')) {
                $('.individualMedicaitonClass').removeAttr('hidden');
                $('.individualMedicaitonClass').show();
            }
        });

        $(".independentLivingSkills  input[name=RadioIndvNeedTransportation]").each(function (index) {
            if ($(this).parent().text().trim() != 'Independent' && $(this).prop('checked')) {
                $('.publicTransportationClass').removeAttr('hidden');
                $('.publicTransportationClass').show();
            }
        });
        $(".independentLivingSkills  input[name=RadioIndvCommunicateHealthConcern]").each(function (index) {
            if ($(this).parent().text().trim() == 'No' && $(this).prop('checked')) {
                $('.heathConcernsClass').removeAttr('hidden');
                $('.heathConcernsClass').show();
            }
        });
        $(".independentLivingSkills  input[name=RadioIndvAttendAllHealthService]").each(function (index) {
            if ($(this).parent().text().trim() == 'No' && $(this).prop('checked')) {
                $('.medicalAppointmentsClass').removeAttr('hidden');
                $('.medicalAppointmentsClass').show();
            }
        });
        $(".independentLivingSkills  input[name=RadioIndvHaveFireSafetyNeed]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.actualPerformanceClass').removeAttr('hidden');
                $('.actualPerformanceClass').show();
            }
        });





        if (result.CCO_IndependentLivingSkill[0].Status != null) {
            var status = result.CCO_IndependentLivingSkill[0].Status;
            if (status == "Completed") {
                $("#statusCompletedIndependentLivingSkills").show();
                $("#statusStartIndependentLivingSkills").hide();
                $("#statusInprogressIndependentLivingSkills").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedIndependentLivingSkills").hide();
                $("#statusStartIndependentLivingSkills").hide();
                $("#statusInprogressIndependentLivingSkills").show();
            }


        }
    }
    else {
        $("#statusCompletedIndependentLivingSkills").hide();
        $("#statusStartIndependentLivingSkills").show();
        $("#statusInprogressIndependentLivingSkills").hide();
    }

    disableOnAdd('independentLivingSkills');


}
function SocialServiceNeeds(result) {

    if (result.CCO_SocialServiceNeed.length > 0) {

        //var data=JSON.parse(allData[0].CCO_SocialServiceNeed);

        $("#TextBoxSocialServiceNeedId").val(result.CCO_SocialServiceNeed[0].SocialServiceNeedId);
        $("input[name='RadioIndvRepresentativePay'][value=" + result.CCO_SocialServiceNeed[0].IndvRepresentativePay + "]").prop('checked', true);
        $("#TextBoxTypeOfRepresentativePay").text(result.CCO_SocialServiceNeed[0].TypeOfRepresentativePay);
        // $("#CurrentIndividualReceiving").val(result.CCO_SocialServiceNeed[0].ExplainConsent);
        if (result.CCO_SocialServiceNeed[0].SocialSecurity == true) {
            $("input[name='CheckboxSocialSecurity']").prop('checked', true);
        }
        if (result.CCO_SocialServiceNeed[0].SSI == true) {
            $("input[name='CheckboxSSI']").prop('checked', true);
        }
        if (result.CCO_SocialServiceNeed[0].SSDI == true) {
            $("input[name='CheckboxSSDI']").prop('checked', true);
        }
        if (result.CCO_SocialServiceNeed[0].DisabledAdultChild == true) {
            $("input[name='CheckboxDisabledAdultChild']").prop('checked', true);
        }
        if (result.CCO_SocialServiceNeed[0].OtherFinancialResource == true) {
            $("input[name='CheckboxOtherFinancialResource']").prop('checked', true);
        }
        $("input[name='RadioIndvPrivateInsuranceProvider'][value=" + result.CCO_SocialServiceNeed[0].IndvPrivateInsuranceProvider + "]").prop('checked', true);
        $("#TextBoxIndvInsurerName").val(result.CCO_SocialServiceNeed[0].IndvInsurerName);
        $("#TextBoxPrivateInsurerId").val(result.CCO_SocialServiceNeed[0].PrivateInsurerId);
        // $("#EnrolledHousingAssistance").val(result.CCO_SocialServiceNeed[0].ExplainConsent);
        if (result.CCO_SocialServiceNeed[0].HUDVoucher == true) {
            $("input[name='CheckboxHUDVoucher']").prop('checked', true);
        }
        if (result.CCO_SocialServiceNeed[0].ISSHousingSubsidy == true) {
            $("input[name='CheckboxISSHousingSubsidy']").prop('checked', true);
        }
        if (result.CCO_SocialServiceNeed[0].OtherHousingAssistance == true) {
            $("input[name='CheckboxOtherHousingAssistance']").prop('checked', true);
        }
        $("input[name='RadioMemInvolCriminalJusticeSystem'][value=" + result.CCO_SocialServiceNeed[0].MemInvolCriminalJusticeSystem + "]").prop('checked', true);
        $("#TextBoxExpInvolCriminalJusticeSystem").val(result.CCO_SocialServiceNeed[0].ExpInvolCriminalJusticeSystem);
        $("input[name='RadioMemCurrOnProbation'][value=" + result.CCO_SocialServiceNeed[0].MemCurrOnProbation + "]").prop('checked', true);
        // $("input[id='DropDownProbationContact'][value=" + result.CCO_SocialServiceNeed[0].MemCurrOnProbation + "]").prop('checked', true);
        $("#DropDownProbationContact").val(result.CCO_SocialServiceNeed[0].ProbationContact);
        $("input[name='RadioMemNeedLegalAid'][value=" + result.CCO_SocialServiceNeed[0].MemNeedLegalAid + "]").prop('checked', true);
        $("input[name='RadioCrimJustSystemImpactHousing'][value=" + result.CCO_SocialServiceNeed[0].CrimJustSystemImpactHousing + "]").prop('checked', true);
        $("#TextBoxExpCrimJustSystemImpactHousing").val(result.CCO_SocialServiceNeed[0].ExpCrimJustSystemImpactHousing);
        $("input[name='RadioCrimJustSystemImpactEmployment'][value=" + result.CCO_SocialServiceNeed[0].CrimJustSystemImpactEmployment + "]").prop('checked', true);

        $("#TextBoxExpCrimJustSystemImpactEmployment").val(result.CCO_SocialServiceNeed[0].ExpCrimJustSystemImpactEmployment);
        //show hide fields
        $(".socialServiceNeeds  input[name=RadioIndvRepresentativePay]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.representativePayeeClass').removeAttr('hidden');
                $('.representativePayeeClass').show();
            }
        });
        $(".socialServiceNeeds  input[name=RadioIndvPrivateInsuranceProvider]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.privateInsuranceProviderClass').removeAttr('hidden');
                $('.privateInsuranceProviderClass').show();
            }
        });
        $(".socialServiceNeeds  input[name=RadioMemInvolCriminalJusticeSystem]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.involvementInCriminalClass').removeAttr('hidden');
                $('.involvementInCriminalClass').show();
            }
        });
        $(".socialServiceNeeds  input[name=RadioCrimJustSystemImpactHousing]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.imapctHousingClass').removeAttr('hidden');
                $('.imapctHousingClass').show();
            }
        });
        $(".socialServiceNeeds  input[name=RadioCrimJustSystemImpactEmployment]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.impactCurrentEmploymentClass').removeAttr('hidden');
                $('.impactCurrentEmploymentClass').show();
            }
        });


        $(".socialServiceNeeds  input[name=RadioMemCurrOnProbation]").each(function (index) {
            if ($(this).parent().text().trim() == 'Probation' || $(this).parent().text().trim() == 'Parole' && $(this).prop('checked')) {
                $('.paroleOrProbationClass').removeAttr('hidden');
                $('.paroleOrProbationClass').show();
            }
        });

        if (result.CCO_SocialServiceNeed[0].Status != null) {
            var status = result.CCO_SocialServiceNeed[0].Status;
            if (status == "Completed") {
                $("#statusCompletedSocialServiceNeeds").show();
                $("#statusStartSocialServiceNeeds").hide();
                $("#statusInprogressSocialServiceNeeds").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedSocialServiceNeeds").hide();
                $("#statusStartSocialServiceNeeds").hide();
                $("#statusInprogressSocialServiceNeeds").show();
            }


        }
    }
    else {
        $("#statusCompletedSocialServiceNeeds").hide();
        $("#statusStartSocialServiceNeeds").show();
        $("#statusInprogressSocialServiceNeeds").hide();
    }
    disableOnAdd('socialServiceNeeds');

}
function MedicalHealth(result) {

    if (result.CCO_MedicalHealth.length > 0) {
        //result.CCO_MedicalHealth[0].AllMemAllergies: null
        if (result.CCO_MedicalHealth[0].AlzheimerDisease == true) {
            $('input[name=CheckboxAlzheimerDisease]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].Arthritis == true) {
            $('input[name=CheckboxArthritis]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].Asthma == true) {
            $('input[name=CheckboxAsthma]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].Cancer == true) {
            $('input[name=CheckboxCancer]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].CerebralPalsy == true) {
            $('input[name=CheckboxCerebralPalsy]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].ChronicKidneyDisease == true) {
            $('input[name=CheckboxChronicKidneyDisease]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].ChronicLungDisease == true) {
            $('input[name=CheckboxChronicLungDisease]').prop('checked', true);
        }
        //result.CCO_MedicalHealth[0].CompAssessmentId: 2073
        //result.CCO_MedicalHealth[0].CompAssessmentVersioningId: 1
        $('#TextBoxExpAllMemAllergies').val(result.CCO_MedicalHealth[0].ExpAllMemAllergies);
        if (result.CCO_MedicalHealth[0].FailureToThrive == true) {
            $('input[name=CheckboxFailureToThrive]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].GERD == true) {
            $('input[name=CheckboxGERD]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].HIV == true) {
            $('input[name=CheckboxHIV]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].HeartDisease == true) {
            $('input[name=CheckboxHeartDisease]').prop('checked', true);
        }
        $('#TextBoxMedicalHealthId').val(result.CCO_MedicalHealth[0].MedicalHealthId);
        if (result.CCO_MedicalHealth[0].PICA == true) {
            $('input[name=CheckboxPICA]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].PreDiabetic == true) {
            $('input[name=CheckboxPreDiabetic]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].RecurrentUrinaryTractInfection == true) {
            $('input[name=CheckboxRecurrentUrinaryTractInfection]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].SeizureDisorder == true) {
            $('input[name=CheckboxSeizureDisorder]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].Spasticity == true) {
            $('input[name=CheckboxSpasticity]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].Stroke == true) {
            $('input[name=CheckboxStroke]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].TypeOneDiabetes == true) {
            $('input[name=CheckboxTypeOneDiabetes]').prop('checked', true);
        }
        if (result.CCO_MedicalHealth[0].TypeTwoDiabetes == true) {
            $('input[name=CheckboxTypeTwoDiabetes]').prop('checked', true);

        }
        if (result.CCO_MedicalHealth[0].Status != null) {
            var status = result.CCO_MedicalHealth[0].Status;
            if (status == "Completed") {
                $("#statusCompletedMedicalHealth").show();
                $("#statusStartMedicalHealth").hide();
                $("#statusInprogressMedicalHealth").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedMedicalHealth").hide();
                $("#statusStartMedicalHealth").hide();
                $("#statusInprogressMedicalHealth").show();
            }


        }
    }
    else {
        $("#statusCompletedMedicalHealth").hide();
        $("#statusStartMedicalHealth").show();
        $("#statusInprogressMedicalHealth").hide();
    }
    disableOnAdd('medicalHealth');
    MedicalHealthDiagnosis(result);

}
function HealthPromotion(result) {

    if (result.CCO_HealthPromotion.length > 0) {

        //var data=JSON.parse(result.CCO_HealthPromotion[0]);

        $("#TextBoxHealthPromotionId").val(result.CCO_HealthPromotion[0].HealthPromotionId);
        $("input[name='RadioMemHospitalizedInLastMonths'][value=" + result.CCO_HealthPromotion[0].MemHospitalizedInLastMonths + "]").prop('checked', true);
        $("#TextBoxMemRecentHospitalized").val(result.CCO_HealthPromotion[0].MemRecentHospitalized);
        $("#TextBoxMemLastAnnualPhysicalExam").val(result.CCO_HealthPromotion[0].MemLastAnnualPhysicalExam);
        $("#TextBoxMemLastDentalExam").val(result.CCO_HealthPromotion[0].MemLastDentalExam);
        // $("#DentalOroralCareNeeds").val(result.CCO_HealthPromotion[0].MemLastDentalExam);
        if (result.CCO_HealthPromotion[0].NoConcernsAtThisTime == true) {
            $("input[id='CheckboxNoConcernsAtThisTime']").prop('checked', true);
        }

        $("#TextBoxExpectationsForCommunity").val(result.CCO_HealthPromotion[0].ExpectationsForCommunity);
        // $("#CheckboxMemLastEyeExam").val(result.CCO_HealthPromotion[0].ExpectationsForCommunity);
        //if (result.CCO_HealthPromotion[0].MemLastEyeExam == true) {
        $("#TextBoxMemLastEyeExam").val(result.CCO_HealthPromotion[0].MemLastEyeExam);
        // }
        $("input[name='RadioMemHadColonoscopy'][value=" + result.CCO_HealthPromotion[0].MemHadColonoscopy + "]").prop('checked', true);
        $("input[name='RadioMemHospitalizedInLastMonths'][value=" + result.CCO_HealthPromotion[0].MemHospitalizedInLastMonths + "]").prop('checked', true);
        $("#TextBoxMemRecentHospitalized").val(result.CCO_HealthPromotion[0].MemRecentHospitalized);
        $("#TextBoxMemLastAnnualPhysicalExam").val(result.CCO_HealthPromotion[0].MemLastAnnualPhysicalExam);
        $("#TextBoxMemLastDentalExam").val(result.CCO_HealthPromotion[0].MemLastDentalExam);

        $("#TextBoxExpectationsForCommunity").val(result.CCO_HealthPromotion[0].ExpectationsForCommunity);
        // $("#CheckboxMemLastEyeExam").val(result.CCO_HealthPromotion[0].ExpectationsForCommunity);
        if (result.CCO_HealthPromotion[0].MemLastEyeExam == true) {
            $("input[id='CheckboxMemLastEyeExam']").prop('checked', true);
        }
        $("input[name='RadioMemHadColonoscopy'][value=" + result.CCO_HealthPromotion[0].MemHadColonoscopy + "]").prop('checked', true);
        $("#TextBoxMemRecentColonoscopy").val(result.CCO_HealthPromotion[0].MemRecentColonoscopy);
        $("input[name='RadioMemHadMammogram'][value=" + result.CCO_HealthPromotion[0].MemHadMammogram + "]").prop('checked', true);
        $("#TextBoxMemRecentMammogram").val(result.CCO_HealthPromotion[0].MemRecentMammogram);
        $("input[name='RadioMemHadCervicalCancerExam'][value=" + result.CCO_HealthPromotion[0].MemHadCervicalCancerExam + "]").prop('checked', true);
        $("#TextBoxMemRecentCervicalCancerExam").val(result.CCO_HealthPromotion[0].MemRecentCervicalCancerExam);
        $("#RadioMemHadProstateExam").val(result.CCO_HealthPromotion[0].MemHadProstateExam);
        $("#TextBoxMemRecentProstateExam").val(result.CCO_HealthPromotion[0].MemHadProstateExam);
        $("input[name='RadioMemDementiaInPastMonths'][value=" + result.CCO_HealthPromotion[0].MemDementiaInPastMonths + "]").prop('checked', true);
        $("#TextBoxMemRecentDementia").val(result.CCO_HealthPromotion[0].MemRecentDementia);
        $("input[name='RadioMemHaveSeizureDisorder'][value=" + result.CCO_HealthPromotion[0].MemHaveSeizureDisorder + "]").prop('checked', true);
        $("input[name='RadioMemNeedSupptOnSeizure'][value=" + result.CCO_HealthPromotion[0].MemNeedSupptOnSeizure + "]").prop('checked', true);
        $("#TextBoxExpMemSupptExpectedForSeizureDisorder").val(result.CCO_HealthPromotion[0].ExpMemSupptExpectedForSeizureDisorder);
        $("input[name='RadioHealthRelatedConcernsNotAddressed'][value=" + result.CCO_HealthPromotion[0].HealthRelatedConcernsNotAddressed + "]").prop('checked', true);
        $("#TextBoxExpHealthConcerns").val(result.CCO_HealthPromotion[0].ExpHealthConcerns);
        $("#TextBoxMemHeight").val(result.CCO_HealthPromotion[0].MemHeight);
        $("#TextBoxMemWeight").val(result.CCO_HealthPromotion[0].MemWeight);
        $("#DropDownBMI").val(result.CCO_HealthPromotion[0].MemWeight);
        $("input[name='RadioMemConcernAboutSleep'][value=" + result.CCO_HealthPromotion[0].MemConcernAboutSleep + "]").prop('checked', true);
        $("input[name='RadioMemAwakeDuringNight'][value=" + result.CCO_HealthPromotion[0].MemAwakeDuringNight + "]").prop('checked', true);
        $("input[name='RadioMemHadDiabeticScreening'][value=" + result.CCO_HealthPromotion[0].MemHadDiabeticScreening + "]").prop('checked', true);
        $("#TextBoxMemRecentDiabeticScreening").val(result.CCO_HealthPromotion[0].MemRecentDiabeticScreening);
        // $("input[id='CheckboxNoConcernForDiabetes'][value=" + result.CCO_HealthPromotion[0].MemHadDiabeticScreening + "]").prop('checked', true);
        if (result.CCO_HealthPromotion[0].NoConcernForDiabetes == true) {
            $("input[name='CheckboxNoConcernForDiabetes']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].RequiredMedicationForDiabetes == true) {
            $("input[name='CheckboxRequiredMedicationForDiabetes']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].AssistanceWithDiabetesMonitoring == true) {
            $("input[name='CheckboxAssistanceWithDiabetesMonitoring']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].MedicationAdministration == true) {
            $("input[name='CheckboxMedicationAdministration']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].DietaryModification == true) {
            $("input[name='CheckboxDietaryModification']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].EducationTraining == true) {
            $("input[name='CheckboxEducationTraining']").prop('checked', true);
        }
        $("#TextBoxExpSupptResultForMemDiabetes").val(result.CCO_HealthPromotion[0].ExpSupptResultForMemDiabetes);
        // $("#CheckboxNoRespiratoryConcern").val(result.CCO_HealthPromotion[0].ExpSupptResultForMemDiabetes);  
        if (result.CCO_HealthPromotion[0].NoRespiratoryConcern == true) {
            $("input[name='CheckboxNoRespiratoryConcern']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].RequiresMedicationForRespConcren == true) {
            $("input[name='CheckboxRequiresMedicationForRespConcren']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].UseCPAPMachine == true) {
            $("input[name='CheckboxUseCPAPMachine']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].UseNebulizer == true) {
            $("input[name='CheckboxUseNebulizer']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].UseOxygen == true) {
            $("input[name='CheckboxUseOxygen']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].ExerciseRestrictions == true) {
            $("input[name='CheckboxExerciseRestrictions']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].OtherTherapies == true) {
            $("input[name='CheckboxOtherTherapies']").prop('checked', true);
        }
        $("#TextBoxExpServicesRespiratoryNeed").val(result.CCO_HealthPromotion[0].ExpServicesRespiratoryNeed);
        // $("#CheckboxNoConcernsForCholesterol").val(result.CCO_HealthPromotion[0].ExpSupptResultForMemDiabetes);  
        if (result.CCO_HealthPromotion[0].NoConcernsForCholesterol == true) {
            $("input[name='CheckboxNoConcernsForCholesterol']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].ModifiedDiet == true) {
            $("input[name='CheckboxModifiedDiet']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].CholesterolLoweringMedications == true) {
            $("input[name='CheckboxCholesterolLoweringMedications']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].IncreaseExercise == true) {
            $("input[name='CheckboxIncreaseExercise']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].EncourageWeightLossForCholesterol == true) {
            $("input[name='CheckboxEncourageWeightLossForCholesterol']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].ProvideAssistanceWithMealPlanning == true) {
            $("input[name='CheckboxProvideAssistanceWithMealPlanning']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].ProvideEducationToThePerson == true) {
            $("input[name='CheckboxProvideEducationToThePerson']").prop('checked', true);
        }
        $("#TextBoxExpSupptForHighCholesterol").val(result.CCO_HealthPromotion[0].ExpServicesRespiratoryNeed);
        // $("#CheckboxNoConcernForHighBloodPressure").val(result.CCO_HealthPromotion[0].ExpSupptResultForMemDiabetes);
        if (result.CCO_HealthPromotion[0].NoConcernForHighBloodPressure == true) {
            $("input[name='CheckboxNoConcernForHighBloodPressure']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].EncourageWeightLossForHighBloodPressure == true) {
            $("input[name='CheckboxEncourageWeightLossForHighBloodPressure']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].BloodPressureMonitoringPlan == true) {
            $("input[name='CheckboxBloodPressureMonitoringPlan']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].ReduceSaltIntake == true) {
            $("input[name='CheckboxReduceSaltIntake']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].EncourageExercise == true) {
            $("input[name='CheckboxEncourageExercise']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].MedicationRequired == true) {
            $("input[name='CheckboxMedicationRequired']").prop('checked', true);
        }

        $("#TextBoxExpSupptForHighBloodPressure").val(result.CCO_HealthPromotion[0].ExpSupptForHighBloodPressure);
        $("input[name='RadioMemBloodTestForLeadPoisoning'][value=" + result.CCO_HealthPromotion[0].MemBloodTestForLeadPoisoning + "]").prop('checked', true);
        $("#TextBoxMemRecentBloodTestForLeadPoisoning").val(result.CCO_HealthPromotion[0].MemRecentBloodTestForLeadPoisoning);
        $("input[name='RadioMemSexuallyActive'][value=" + result.CCO_HealthPromotion[0].MemSexuallyActive + "]").prop('checked', true);
        //  $("input[id='CheckboxBirthControlOral'][value=" + result.CCO_HealthPromotion[0].MemSexuallyActive + "]").prop('checked', true);
        if (result.CCO_HealthPromotion[0].BirthControlOral == true) {
            $("input[name='CheckboxBirthControlOral']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].BirthControlProphylactic == true) {
            $("input[name='CheckboxBirthControlProphylactic']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].NaturalFamilyPlanning == true) {
            $("input[name='CheckboxNaturalFamilyPlanning']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].NoBirthControl == true) {
            $("input[name='CheckboxNoBirthControl']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].Unknown == true) {
            $("input[name='CheckboxUnknown']").prop('checked', true);
        }

        if (result.CCO_HealthPromotion[0].SupptOnSeizureNoConcernsAtThisTime == true) {
            $("input[name='CheckboxSupptOnSeizureNoConcernsAtThisTime']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].SupptOnSeizureMonitoringPlan == true) {
            $("input[name='CheckboxSupptOnSeizureMonitoringPlan']").prop('checked', true);
        }
        if (result.CCO_HealthPromotion[0].SupptOnSeizureRequiresSeizureProtocol == true) {
            $("input[name='CheckboxSupptOnSeizureRequiresSeizureProtocol']").prop('checked', true);
        }
        $("input[name='RadioSTIInPastMonths'][value=" + result.CCO_HealthPromotion[0].STIInPastMonths + "]").prop('checked', true);
        $("input[name='RadioMemHIVPositive'][value=" + result.CCO_HealthPromotion[0].MemHIVPositive + "]").prop('checked', true);
        $("#TextBoxMemLastHIVAppointment").val(result.CCO_HealthPromotion[0].MemLastHIVAppointment);
        $("input[name='RadioMemExerciseInWeekForThirtyMintues'][value=" + result.CCO_HealthPromotion[0].MemExerciseInWeekForThirtyMintues + "]").prop('checked', true);
        $("input[name='RadioMemInterestedIncPhysicalActivity'][value=" + result.CCO_HealthPromotion[0].MemInterestedIncPhysicalActivity + "]").prop('checked', true);

        //show hide fields
        $(".healthPromotion  input[name=RadioMemHospitalizedInLastMonths]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.twelveMonthsClass').removeAttr('hidden');
                $('.twelveMonthsClass').show();
            }
        });
        $(".healthPromotion  input[name=RadioDentalOroralCareNeeds]").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.dentalOralCareNeedsClass').removeAttr('hidden');
                $('.dentalOralCareNeedsClass').show();
            }
        });
        $(".healthPromotion  input[name=RadioMemHadProstateExam]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.memberProstateExamClass').removeAttr('hidden');
                $('.memberProstateExamClass').show();
            }
        });
        $(".healthPromotion  input[name=RadioMemHadDiabeticScreening]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.diabeticScreeningClass').removeAttr('hidden');
                $('.diabeticScreeningClass').show();
            }
        });

        $(".healthPromotion  input[name=RadioMemHIVPositive]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.HIVPositiveClass').removeAttr('hidden');
                $('.HIVPositiveClass').show();
            }
        });
        $(".healthPromotion  input[name=RadioMemSexuallyActive]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.sexuallyActiveClass').removeAttr('hidden');
                $('.sexuallyActiveClass').show();
            }
        });

        $(".healthPromotion  input[name=RadioMemBloodTestForLeadPoisoning]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.leadPoisoningClass').removeAttr('hidden');
                $('.leadPoisoningClass').show();
            }
        });
        $(".healthPromotion  input[name=RadioMemHaveSeizureDisorder]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.SeizureDisorder').removeAttr('hidden');
                $('.SeizureDisorder').show();
            }
        });
        $(".healthPromotion  input[name=CheckboxSupptOnSeizureNoConcernsAtThisTime]").each(function (index) {
            if ($(this).parent().text().trim() != 'No concerns at this time' && $(this).prop('checked')) {
                $('.memberSeizureDisorder').removeAttr('hidden');
                $('.memberSeizureDisorder').show();
            }
        });
        $(".healthPromotion  input[name=RadioHealthRelatedConcernsNotAddressed]").each(function (index) {
            if ($(this).parent().text().trim() != 'No' && $(this).prop('checked')) {
                $('.ConcernsNotAddressed').removeAttr('hidden');
                $('.ConcernsNotAddressed').show();
            }
        });
        $(".healthPromotion  .MembersNeedDiabetes").each(function (index) {
            if ($(this).prop('checked')) {
                $('.MembersNeedDiabetesClass').removeAttr('hidden');
                $('.MembersNeedDiabetesClass').show();
            }
        });

        $(".healthPromotion  .RespiratoryConcerns").each(function (index) {
            if ($(this).prop('checked')) {
                $('.RespiratoryConcernsClass').removeAttr('hidden');
                $('.RespiratoryConcernsClass').show();
            }
        });
        $(".healthPromotion  .Cholesterol").each(function (index) {
            if ($(this).prop('checked')) {
                $('.CholesterolClass').removeAttr('hidden');
                $('.CholesterolClass').show();
            }
        });
        $(".healthPromotion  .PressureOrHypertension").each(function (index) {
            if ($(this).prop('checked')) {
                $('.PressureOrHypertensionClass').removeAttr('hidden');
                $('.PressureOrHypertensionClass').show();
            }
        });

        if (result.CCO_HealthPromotion[0].Status != null) {
            var status = result.CCO_HealthPromotion[0].Status;
            if (status == "Completed") {
                $("#statusCompletedHealthPromotion").show();
                $("#statusStartHealthPromotion").hide();
                $("#statusInprogressHealthPromotion").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedHealthPromotion").hide();
                $("#statusStartHealthPromotion").hide();
                $("#statusInprogressHealthPromotion").show();
            }


        }
    }
    else {
        $("#statusCompletedHealthPromotion").hide();
        $("#statusStartHealthPromotion").show();
        $("#statusInprogressHealthPromotion").hide();
    }
    disableOnAdd('healthPromotion');


}
function BehavioralHealth(result) {

    if (result.CCO_BehavioralHealth.length > 0) {

        // var data=JSON.parse(allData[0].CCO_BehavioralHealth);

        $("#TextBoxBehavioralHealthId").val(result.CCO_BehavioralHealth[0].BehavioralHealthId);
        $("input[name='RadioMemberBeenDiagnosed'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        // $("input[id='CheckboxPrevAnxiety'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        if (result.CCO_BehavioralHealth[0].PrevAnxiety == true) {
            $("input[name='CheckboxPrevAnxiety']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevDepression == true) {
            $("input[name='CheckboxPrevDepression']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevADHD == true) {
            $("input[name='CheckboxPrevADHD']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevPanicDisorder == true) {
            $("input[name='CheckboxPrevPanicDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevPsychosis == true) {
            $("input[name='CheckboxPrevPsychosis']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevSchizophrenia == true) {
            $("input[name='CheckboxPrevSchizophrenia']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevBipolarDisorder == true) {
            $("input[name='CheckboxPrevBipolarDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevPostTraumaticStressDisorder == true) {
            $("input[name='CheckboxPrevPostTraumaticStressDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevObsessiveCompulsiveDisorder == true) {
            $("input[name='CheckboxPrevObsessiveCompulsiveDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevEatingDisorder == true) {
            $("input[name='CheckboxPrevEatingDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevImpulsiveControlDisorder == true) {
            $("input[name='CheckboxPrevImpulsiveControlDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevPersonalityDisorder == true) {
            $("input[name='CheckboxPrevPersonalityDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PrevBorderlinePersonalityDisorder == true) {
            $("input[name='CheckboxPrevBorderlinePersonalityDisorder']").prop('checked', true);
        }
        // $("input[id='CheckboxCurreAnxiety'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        if (result.CCO_BehavioralHealth[0].CurreAnxiety == true) {
            $("input[name='CheckboxCurreAnxiety']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreDepression == true) {
            $("input[name='CheckboxCurreDepression']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreADHD == true) {
            $("input[name='CheckboxCurreADHD']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurrePanicDisorder == true) {
            $("input[name='CheckboxCurrePanicDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurrePsychosis == true) {
            $("input[name='CheckboxCurrePsychosis']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreSchizophrenia == true) {
            $("input[name='CheckboxCurreSchizophrenia']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreBipolarDisorder == true) {
            $("input[name='CheckboxCurreBipolarDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurrePostTraumaticStressDisorder == true) {
            $("input[name='CheckboxCurrePostTraumaticStressDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreObsessiveCompulsiveDisorder == true) {
            $("input[name='CheckboxCurreObsessiveCompulsiveDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreEatingDisorder == true) {
            $("input[name='CheckboxCurreEatingDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreImpulsiveControlDisorder == true) {
            $("input[name='CheckboxCurreImpulsiveControlDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurrePersonalityDisorder == true) {
            $("input[name='CheckboxCurrePersonalityDisorder']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].CurreBorderlinePersonalityDisorder == true) {
            $("input[name='CheckboxCurreBorderlinePersonalityDisorder']").prop('checked', true);
        }
        //   $("input[id='DropDownDiagnosMemberAcuteChronicHealthCondition'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        $("#DropDownDiagnosMemberAcuteChronicHealthCondition").val(result.CCO_BehavioralHealth[0].DiagnosMemberAcuteChronicHealthCondition);
        $("input[name='RadioMemberBeenDiagnosed'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        $("input[name='RadioPsychiatricConditionInterfereWithMem'][value=" + result.CCO_BehavioralHealth[0].PsychiatricConditionInterfereWithMem + "]").prop('checked', true);
        //   $("input[id='DropDownSourceOfMentalHealthDiagnos'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        $("#DropDownSourceOfMentalHealthDiagnos").val(result.CCO_BehavioralHealth[0].SourceOfMentalHealthDiagnos);
        //   $("input[id='CheckboxOutpatientOneToOneTherapy'][value=" + result.CCO_BehavioralHealth[0].MemberBeenDiagnosed + "]").prop('checked', true);
        $("#CheckboxOutpatientOneToOneTherapy").val(result.CCO_BehavioralHealth[0].OutpatientOneToOneTherapy);
        $("#TextBoxMemRecentPsychiatricHospitalization").val(result.CCO_BehavioralHealth[0].MemRecentPsychiatricHospitalization);
        $("input[name='RadioMemRecvSuicidalThoughtsInPast'][value=" + result.CCO_BehavioralHealth[0].MemRecvSuicidalThoughtsInPast + "]").prop('checked', true);
        $("input[name='RadioMemMonitoredForSuicidalRisk'][value=" + result.CCO_BehavioralHealth[0].MemMonitoredForSuicidalRisk + "]").prop('checked', true);
        $("#TextBoxNatureOfSelfHarmBehavior").val(result.CCO_BehavioralHealth[0].NatureOfSelfHarmBehavior);
        $("input[name='RadioMemMonitoredForSelfHarmRisk'][value=" + result.CCO_BehavioralHealth[0].MemMonitoredForSelfHarmRisk + "]").prop('checked', true);
        $("input[name='RadioMemMedicationMonitoringPlan'][value=" + result.CCO_BehavioralHealth[0].MemMedicationMonitoringPlan + "]").prop('checked', true);
        $("input[name='RadioMedicationMonitoredByPsychiatrist'][value=" + result.CCO_BehavioralHealth[0].MedicationMonitoredByPsychiatrist + "]").prop('checked', true);
        $("input[name='RadioPscyhiatricMonitoringFrequency'][value=" + result.CCO_BehavioralHealth[0].PscyhiatricMonitoringFrequency + "]").prop('checked', true);
        $("input[name='RadioMemHistoryOfTrauma'][value=" + result.CCO_BehavioralHealth[0].MemHistoryOfTrauma + "]").prop('checked', true);
        $("input[name='RadioMemPhysicallyHurtOthers'][value=" + result.CCO_BehavioralHealth[0].MemPhysicallyHurtOthers + "]").prop('checked', true);
        $("input[name='RadioMemInsultOthers'][value=" + result.CCO_BehavioralHealth[0].MemInsultOthers + "]").prop('checked', true);
        $("input[name='RadioMemThreatenOthers'][value=" + result.CCO_BehavioralHealth[0].MemThreatenOthers + "]").prop('checked', true);
        $("input[name='RadioMemScreamCurseOthers'][value=" + result.CCO_BehavioralHealth[0].MemScreamCurseOthers + "]").prop('checked', true);
        $("input[name='RadioMemSmoke'][value=" + result.CCO_BehavioralHealth[0].MemSmoke + "]").prop('checked', true);
        $("input[name='RadioIndvDrinkAlcohol'][value=" + result.CCO_BehavioralHealth[0].IndvDrinkAlcohol + "]").prop('checked', true);
        $("input[name='RadioIndvUseRecreationalDrugs'][value=" + result.CCO_BehavioralHealth[0].IndvUseRecreationalDrugs + "]").prop('checked', true);
        $("input[name='RadioPersonBeenPrescribedPRN'][value=" + result.CCO_BehavioralHealth[0].PersonBeenPrescribedPRN + "]").prop('checked', true);
        $("#TextBoxReasonForPRNMedication").val(result.CCO_BehavioralHealth[0].ReasonForPRNMedication);
        $("input[name='RadioFrequencyForPRNGiven'][value=" + result.CCO_BehavioralHealth[0].FrequencyForPRNGiven + "]").prop('checked', true);


        if (result.CCO_BehavioralHealth[0].OutpatientOneToOneTherpay == true) {
            $("input[name='CheckboxOutpatientOneToOneTherpay']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].OutpatientGroupTherapy == true) {
            $("input[name='CheckboxOutpatientGroupTherapy']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PsychiatricMedication == true) {
            $("input[name='CheckboxPsychiatricMedication']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].FamilyTherapy == true) {
            $("input[name='CheckboxFamilyTherapy']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].ParentSupportAndTraining == true) {
            $("input[name='CheckboxParentSupportAndTraining']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PeerMentor == true) {
            $("input[name='CheckboxPeerMentor']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].PROSClinic == true) {
            $("input[name='CheckboxPROSClinic']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].AcuteInpatientTreatment == true) {
            $("input[name='CheckboxAcuteInpatientTreatment']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].LongTermInpatientTreatment == true) {
            $("input[name='CheckboxLongTermInpatientTreatment']").prop('checked', true);
        }
        if (result.CCO_BehavioralHealth[0].OtherChalleningBehaviorInPast == true) {
            $("input[name='CheckboxOtherChalleningBehaviorInPast']").prop('checked', true);
        }
        //shown hide fields
        $(".behavioralHealth  input[name=RadioMemberBeenDiagnosed]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.mentalHealthConditionClass').removeAttr('hidden');
                $('.mentalHealthConditionClass').show();
            }
        });
        $(".behavioralHealth  input[name=RadioMemRecvSuicidalThoughtsInPast]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.suicidalThoughtsBehaviorsClass').removeAttr('hidden');
                $('.suicidalThoughtsBehaviorsClass').show();
            }
        });
        $(".behavioralHealth  input[name=RadioMemMonitoredForSuicidalRisk]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.healthProfessionalSuicidalRiskClass').removeAttr('hidden');
                $('.healthProfessionalSuicidalRiskClass').show();
            }
        });
        $(".behavioralHealth  input[name=RadioMedicationMonitoredByPsychiatrist]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.monitoredByPsychiatristClass').removeAttr('hidden');
                $('.monitoredByPsychiatristClass').show();
            }
        });
        $(".behavioralHealth  input[name=RadioPersonBeenPrescribedPRN]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.psychiatricSymptomsClass').removeAttr('hidden');
                $('.psychiatricSymptomsClass').show();
            }
        });

        if (result.CCO_BehavioralHealth[0].Status != null) {
            var status = result.CCO_BehavioralHealth[0].Status;
            if (status == "Completed") {
                $(".behavioralHealth #statusCompletedBehavioralHealth").show();
                $(".behavioralHealth #statusStartBehavioralHealth").hide();
                $(".behavioralHealth #statusInprogressBehavioralHealth").hide();
            }
            else if (status == "Inprogress") {
                $(".behavioralHealth #statusCompletedBehavioralHealth").hide();
                $(".behavioralHealth #statusStartBehavioralHealth").hide();
                $(".behavioralHealth #statusInprogressBehavioralHealth").show();
            }


        }
    }
    else {
        $("#statusCompletedBehavioralHealth").hide();
        $("#statusStartBehavioralHealth").show();
        $("#statusInprogressBehavioralHealth").hide();
    }
    disableOnAdd('behavioralHealth');


}
function ChallengingBehavior(result) {

    if (result.CCO_ChallengingBehaviors.length > 0) {

        //var data=JSON.parse(allData[0].CCO_ChallengingBehaviors);

        $("#TextBoxChallengingBehaviorId").val(result.CCO_ChallengingBehaviors[0].ChallengingBehaviorId);
        $("input[name='RadioMemHasChallengingBehavior'][value=" + result.CCO_ChallengingBehaviors[0].MemHasChallengingBehavior + "]").prop('checked', true);
        // $("#CheckboxSelfHarmfulBehavior").val(result.CCO_ChallengingBehaviors[0].ChallengingBehaviorId);
        if (result.CCO_ChallengingBehaviors[0].SelfHarmfulBehavior == true) {
            $("input[name='CheckboxSelfHarmfulBehavior']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].PhysicallyHurtOther == true) {
            $("input[name='CheckboxPhysicallyHurtOther']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].HarmOther == true) {
            $("input[name='CheckboxHarmOther']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].DestructionOfProperty == true) {
            $("input[name='CheckboxDestructionOfProperty']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].DisruptiveBehavior == true) {
            $("input[name='CheckboxDisruptiveBehavior']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].UnusualBehavior == true) {
            $("input[name='CheckboxUnusualBehavior']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].Withdrawal == true) {
            $("input[name='CheckboxWithdrawal']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].SociallyOffensiveBehavior == true) {
            $("input[name='CheckboxSociallyOffensiveBehavior']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].PersistentlyUncooperative == true) {
            $("input[name='CheckboxPersistentlyUncooperative']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].ProblemWithSelfcare == true) {
            $("input[name='CheckboxProblemWithSelfcare']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].Pica == true) {
            $("input[name='CheckboxPica']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].Elopement == true) {
            $("input[name='CheckboxElopement']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].Other == true) {
            $("input[name='CheckboxOther']").prop('checked', true);
        }
        $("#TextBoxMemChallengingBehaviorManifests").val(result.CCO_ChallengingBehaviors[0].MemChallengingBehaviorManifests);
        // $("#CheckboxOutpatientOneToOneTherpay").val(result.CCO_ChallengingBehaviors[0].ChallengingBehaviorId);

        $("input[name='RadioRestrictiveEater'][value=" + result.CCO_ChallengingBehaviors[0].RestrictiveEater + "]").prop('checked', true);
        $("input[name='RadioMemShowAggressiveOnMeals'][value=" + result.CCO_ChallengingBehaviors[0].MemShowAggressiveOnMeals + "]").prop('checked', true);
        if (result.CCO_ChallengingBehaviors[0].OutpatientOneToOneTherpay == true) {
            $("input[name='CheckboxOutpatientOneToOneTherpay']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].OutpatientGroupTherapy == true) {
            $("input[name='CheckboxOutpatientGroupTherapy']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].PsychiatricMedication == true) {
            $("input[name='CheckboxPsychiatricMedication']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].FamilyTherapy == true) {
            $("input[name='CheckboxFamilyTherapy']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].ParentSupportAndTraining == true) {
            $("input[name='CheckboxParentSupportAndTraining']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].PeerMentor == true) {
            $("input[name='CheckboxPeerMentor']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].PROSClinic == true) {
            $("input[name='CheckboxPROSClinic']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].AcuteInpatientTreatment == true) {
            $("input[name='CheckboxAcuteInpatientTreatment']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].LongTermInpatientTreatment == true) {
            $("input[name='CheckboxLongTermInpatientTreatment']").prop('checked', true);
        }
        if (result.CCO_ChallengingBehaviors[0].OtherChalleningBehaviorInPast == true) {
            $("input[name='CheckboxOtherChalleningBehaviorInPast']").prop('checked', true);
        }
        // show hide fields
        $(".challengingBehaviors  input[name=RadioMemHasChallengingBehavior]").each(function (index) {
            if ($(this).parent().text().trim() != 'No Known history' && $(this).prop('checked')) {
                $('.significantChallengingClass').removeAttr('hidden');
                $('.significantChallengingClass').show();
            }
        });

        if (result.CCO_ChallengingBehaviors[0].Status != null) {
            var status = result.CCO_ChallengingBehaviors[0].Status;
            if (status == "Completed") {
                $("#statusCompletedChallengingBehaviors").show();
                $("#statusStartChallengingBehaviors").hide();
                $("#statusInprogressChallengingBehaviors").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedChallengingBehaviors").hide();
                $("#statusStartChallengingBehaviors").hide();
                $("#statusInprogressChallengingBehaviors").show();
            }


        }
    }
    else {
        $("#statusCompletedChallengingBehaviors").hide();
        $("#statusStartChallengingBehaviors").show();
        $("#statusInprogressChallengingBehaviors").hide();
    }
    disableOnAdd('challengingBehaviors');


}
function BehavioralSupportPlan(result) {

    if (result.CCO_BehavioralSupportPlan.length > 0) {

        //var data=JSON.parse(allData[0].CCO_BehavioralSupportPlan);

        $("#TextBoxBehavioralSupportPlanId").val(result.CCO_BehavioralSupportPlan[0].BehavioralSupportPlanId);
        $("input[name='RadioMemHaveBehavioralSupportPlan'][value=" + result.CCO_BehavioralSupportPlan[0].MemHaveBehavioralSupportPlan + "]").prop('checked', true);
        $("input[name='RadioMemHumanRightApproval'][value=" + result.CCO_BehavioralSupportPlan[0].MemHumanRightApproval + "]").prop('checked', true);
        $("input[name='RadioMemReqPhyInterventionInPastForSafety'][value=" + result.CCO_BehavioralSupportPlan[0].MemReqPhyInterventionInPastForSafety + "]").prop('checked', true);
        $("input[name='RadioPhyInterventionPartOfSupportPlan'][value=" + result.CCO_BehavioralSupportPlan[0].PhyInterventionPartOfSupportPlan + "]").prop('checked', true);
        $("input[name='RadioMemSupptPlanContainRestrictiveIntervention'][value=" + result.CCO_BehavioralSupportPlan[0].MemSupptPlanContainRestrictiveIntervention + "]").prop('checked', true);
        // $("input[id='CheckboxSCIPR'][value=" + result.CCO_BehavioralSupportPlan[0].MemSupptPlanContainRestrictiveIntervention + "]").prop('checked', true);
        if (result.CCO_BehavioralSupportPlan[0].SCIPR == true) {
            $("input[name='CheckboxSCIPR']").prop('checked', true);
        }
        if (result.CCO_BehavioralSupportPlan[0].Medication == true) {
            $("input[name='CheckboxMedication']").prop('checked', true);
        }
        if (result.CCO_BehavioralSupportPlan[0].RightLimitation == true) {
            $("input[name='CheckboxRightLimitation']").prop('checked', true);
        }
        if (result.CCO_BehavioralSupportPlan[0].TimeOut == true) {
            $("input[name='CheckboxTimeOut']").prop('checked', true);
        }
        if (result.CCO_BehavioralSupportPlan[0].MechanicalRestrainingDevice == true) {
            $("input[name='CheckboxMechanicalRestrainingDevice']").prop('checked', true);
        }

        // show hide fields
        $(".behavioralSupportPlan  input[name=RadioMemHaveBehavioralSupportPlan]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.behavioralSupportPlanClass').removeAttr('hidden');
                $('.behavioralSupportPlanClass').show();
            }
        });
        $(".behavioralSupportPlan  input[name=RadioMemReqPhyInterventionInPastForSafety]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.maintainSafetyClass').removeAttr('hidden');
                $('.maintainSafetyClass').show();
            }
        });
        $(".behavioralSupportPlan  input[name=RadioMemSupptPlanContainRestrictiveIntervention]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.intrusiveInterventionsClass').removeAttr('hidden');
                $('.intrusiveInterventionsClass').show();
            }
        });

        if (result.CCO_BehavioralSupportPlan[0].Status != null) {
            var status = result.CCO_BehavioralSupportPlan[0].Status;
            if (status == "Completed") {
                $("#statusCompletedBehavioralSupportPlan").show();
                $("#statusStartBehavioralSupportPlan").hide();
                $("#statusInprogressBehavioralSupportPlan").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedBehavioralSupportPlan").hide();
                $("#statusStartBehavioralSupportPlan").hide();
                $("#statusInprogressBehavioralSupportPlan").show();
            }
        }
    }
    else {
        $("#statusCompletedBehavioralSupportPlan").hide();
        $("#statusStartBehavioralSupportPlan").show();
        $("#statusInprogressBehavioralSupportPlan").hide();
    }
    disableOnAdd('behavioralSupportPlan');

}
function Medications(result) {

    if (result.JsonDataReturnForAllChildTables != null && result.JsonDataReturnForAllChildTables[0].JSONDataForMedications != null) {
        if (result.JsonDataReturnForAllChildTables[0].JSONDataForMedications.length > 0) {
            jsonParse = JSON.parse(result.JsonDataReturnForAllChildTables[0].JSONDataForMedications);

            for (i = 0; i < jsonParse.length; i++) {
                $('input[name=RadioPRNMedication' + i + '][value=' + jsonParse[i].PRNMedication + ']').prop('checked', true);
                $('input[name=RadioMedicationMonitoringPlan' + i + '][value=' + jsonParse[i].MedicationMonitoringPlan + ']').prop('checked', true);
                $('input[name=RadioPainManagementMedication' + i + '][value=' + jsonParse[i].PainManagementMedication + ']').prop('checked', true);
                $('input[name=RadioMemUnderstandMedication' + i + '][value=' + jsonParse[i].MemUnderstandMedication + ']').prop('checked', true);
                $('input[name=RadioMemFeelMedicationEffective' + i + '][value=' + jsonParse[i].MemFeelMedicationEffective + ']').prop('checked', true);

                $('input[name=TextBoxMedicationId' + i + ']').val(jsonParse[i].MedicationId);
            }
        }
        else {
            const div = document.createElement('div');
            div.innerHTML = "No Records Found";
            document.getElementById('allMadications').append(div);
        }

    }
    disableOnAdd('medications');
    $(".medications .form-control").attr('disabled', true);


}
function CommunitySocial(result) {

    if (result.CCO_CommunityParticipation.length > 0) {

        //var data=JSON.parse(allData[0].CCO_CommunityParticipation);

        $(".communitySocial #TextBoxCommunityParticipationId").val(result.CCO_CommunityParticipation[0].CommunityParticipationId);
        $(".communitySocial input[name='RadioMemCurreSelfDirectSupportService'][value=" + result.CCO_CommunityParticipation[0].MemCurreSelfDirectSupportService + "]").prop('checked', true);
        $(".communitySocial input[name='RadioMemWishSelfDirectSupportService'][value=" + result.CCO_CommunityParticipation[0].MemWishSelfDirectSupportService + "]").prop('checked', true);

        //show hide fields
        $(".communitySocial  input[name=RadioMemCurreSelfDirectSupportService]").each(function (index) {
            if ($(this).parent().text().trim() == 'No' && $(this).prop('checked')) {
                $('.communitySocial .selfDirectSupportsClass').removeAttr('hidden');
                $('.communitySocial .selfDirectSupportsClass').show();
            }
        });

        if (result.CCO_CommunityParticipation[0].Status != null) {
            var status = result.CCO_CommunityParticipation[0].Status;
            if (status == "Completed") {
                $(".communitySocial #statusCompletedCommunitySocial").show();
                $(".communitySocial #statusStartCommunitySocial").hide();
                $(".communitySocial #statusInprogressCommunitySocial").hide();
            }
            else if (status == "Inprogress") {
                $(".communitySocial #statusCompletedCommunitySocial").hide();
                $(".communitySocial #statusStartCommunitySocial").hide();
                $(".communitySocial #statusInprogressCommunitySocial").show();
            }

        }

    }
    else {
        $(".communitySocial #statusCompletedCommunitySocial").hide();
        $(".communitySocial #statusStartCommunitySocial").show();
        $(".communitySocial #statusInprogressCommunitySocial").hide();
    }
    disableOnAdd('communitySocial');

}
function Education(result) {

    if (result.CCO_Education.length > 0) {


        //var data=JSON.parse(allData[0].CCO_Education);

        $(".education #TextBoxEducationId").val(result.CCO_Education[0].EducationId);
        $(".education input[name='RadioMemCompletedEducationLevel'][value=" + result.CCO_Education[0].MemCompletedEducationLevel + "]").prop('checked', true);
        $(".education input[name='RadioMemCompletedEducationLevel'][value=" + result.CCO_Education[0].MemCompletedEducationLevel + "]").prop('checked', true);
        $(".education input[name='RadioMemCurreSchoolEducation'][value=" + result.CCO_Education[0].MemCurreSchoolEducation + "]").prop('checked', true);
        $(".education input[name='RadioCurreEducationMeetNeed'][value=" + result.CCO_Education[0].CurreEducationMeetNeed + "]").prop('checked', true);
        $(".education input[name='RadioMemPursuingAdditionalEducation'][value=" + result.CCO_Education[0].MemPursuingAdditionalEducation + "]").prop('checked', true);
        $(".education input[name='RadioChooseCurrentEducation'][value=" + result.CCO_Education[0].ChooseCurrentEducation + "]").prop('checked', true);
        $(".education #TextBoxDescribeSupptResultInEducationSetting").val(result.CCO_Education[0].DescribeSupptResultInEducationSetting);

        //show hide fields
        $(".education  input[name=RadioMemCurreSchoolEducation]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.education .educationProgramsClass').removeAttr('hidden');
                $('.education .educationProgramsClass').show();
            }
            if ($(this).parent().text().trim() == 'No' && $(this).prop('checked')) {
                // $('.education .educationProgramsClass').removeAttr('hidden');
                // $('.education .educationProgramsClass').show();
                $('.education .educationProgramsNoClass').removeAttr('hidden');
                $('.education .educationProgramsNoClass').show();

            }
        });
        if (result.CCO_Education[0].Status != null) {
            var status = result.CCO_Education[0].Status;
            if (status == "Completed") {
                $(".education #statusCompletedEducation").show();
                $(".education #statusStartEducation").hide();
                $(".education #statusInprogressEducation").hide();
            }
            else if (status == "Inprogress") {
                $(".education #statusCompletedEducation").hide();
                $(".education #statusStartEducation").hide();
                $(".education #statusInprogressEducation").show();
            }

        }


    }
    else {
        $(".education #statusCompletedEducation").hide();
        $(".education #statusStartEducation").show();
        $(".education #statusInprogressEducation").hide();
    }
    disableOnAdd('education');

}
function TransitionPlanning(result) {

    if (result.CCO_TransitionPlanning.length > 0) {

        //  var data=JSON.parse(result.CCO_TransitionPlanning[0]);

        $(".transitionPlanning #TextBoxTransitionPlanningId").val(result.CCO_TransitionPlanning[0].TransitionPlanningId);
        $(".transitionPlanning #TextBoxDescribePrevocationalSkill").val(result.CCO_TransitionPlanning[0].DescribePrevocationalSkill);
        $(".transitionPlanning input[name='RadioMemCompetitivelyEmployed'][value=" + result.CCO_TransitionPlanning[0].MemCompetitivelyEmployed + "]").prop('checked', true);
        $(".transitionPlanning input[name='RadioMemCurreReceivingServices'][value=" + result.CCO_TransitionPlanning[0].MemCurreReceivingServices + "]").prop('checked', true);
        $(".transitionPlanning #TextBoxStartDateACCESVRService").val(result.CCO_TransitionPlanning[0].StartDateACCESVRService);
        // $("input[id='CheckboxVocationalCounseling'][value=" + result.CCO_TransitionPlanning[0].MemCompetitivelyEmployed + "]").prop('checked', true);
        if (result.CCO_TransitionPlanning[0].VocationalCounseling == true) {
            $(".transitionPlanning input[name='CheckboxVocationalCounseling']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].AssessmentsAndEvaluations == true) {
            $(".transitionPlanning input[name='CheckboxAssessmentsAndEvaluations']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].RehabilitationTechnology == true) {
            $(".transitionPlanning input[name='CheckboxRehabilitationTechnology']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].SpecialTransportation == true) {
            $(".transitionPlanning input[name='CheckboxSpecialTransportation']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].AdaptiveDriverTraining == true) {
            $(".transitionPlanning input[name='CheckboxAdaptiveDriverTraining']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].WorkReadiness == true) {
            $(".transitionPlanning input[name='CheckboxWorkReadiness']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].TuitionFeesTextbooks == true) {
            $(".transitionPlanning input[name='CheckboxTuitionFeesTextbooks']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].NoteTaker == true) {
            $(".transitionPlanning input[name='CheckboxNoteTaker']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].YouthService == true) {
            $(".transitionPlanning input[name='CheckboxYouthService']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].PhysicalMentalRestoration == true) {
            $(".transitionPlanning input[name='CheckboxPhysicalMentalRestoration']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].HomeVehicleWorksite == true) {
            $(".transitionPlanning input[name='CheckboxHomeVehicleWorksite']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].JobDevelopmentPlacement == true) {
            $(".transitionPlanning input[name='CheckboxJobDevelopmentPlacement']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].WorkTryOut == true) {
            $(".transitionPlanning input[name='CheckboxWorkTryOut']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].JobCoaching == true) {
            $(".transitionPlanning input[name='CheckboxJobCoaching']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].OccupationalToolEquipment == true) {
            $(".transitionPlanning input[name='OccupationalToolEquipment']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].GoodsInventoryEquipment == true) {
            $(".transitionPlanning input[name='CheckboxGoodsInventoryEquipment']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].OccupationalBusinessLicense == true) {
            $(".transitionPlanning input[name='CheckboxOccupationalBusinessLicense']").prop('checked', true);
        }
        // $("input[id='CheckboxTicketToWork'][value=" + result.CCO_TransitionPlanning[0].MemCompetitivelyEmployed + "]").prop('checked', true);
        if (result.CCO_TransitionPlanning[0].TicketToWork == true) {
            $(".transitionPlanning input[name='CheckboxTicketToWork']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].PASS == true) {
            $(".transitionPlanning input[name='CheckboxPASS']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].WelfareToWork == true) {
            $(".transitionPlanning input[name='CheckboxWelfareToWork']").prop('checked', true);
        }
        if (result.CCO_TransitionPlanning[0].Other == true) {
            $(".transitionPlanning input[name='CheckboxOther']").prop('checked', true);
        }

        //show hide fields
        $(".transitionPlanning  input[name=RadioMemCurreReceivingServices]").each(function (index) {
            if ($(this).parent().text().trim() == 'Yes' && $(this).prop('checked')) {
                $('.transitionPlanning .accessVRClass').removeAttr('hidden');
                $('.transitionPlanning .accessVRClass').show();
            }
        });


        if (result.CCO_TransitionPlanning[0].Status != null) {
            var status = result.CCO_TransitionPlanning[0].Status;
            if (status == "Completed") {
                $(".transitionPlanning #statusCompletedTransitionPlanning").show();
                $(".transitionPlanning #statusStartTransitionPlanning").hide();
                $(".transitionPlanning #statusInprogressTransitionPlanning").hide();
            }
            else if (status == "Inprogress") {
                $(".transitionPlanning #statusCompletedTransitionPlanning").hide();
                $(".transitionPlanning #statusStartTransitionPlanning").hide();
                $(".transitionPlanning #statusInprogressTransitionPlanning").show();
            }

        }


    }
    else {
        $(".transitionPlanning #statusCompletedTransitionPlanning").hide();
        $(".transitionPlanning #statusStartTransitionPlanning").show();
        $(".transitionPlanning #statusInprogressTransitionPlanning").hide();
    }

    disableOnAdd('transitionPlanning');

}
function Employment(result) {

    if (result.CCO_Employment.length > 0) {

        // var data=JSON.parse(allData[0].CCO_Employment);

        $(".employment #TextBoxEmploymentId").val(result.CCO_Employment[0].EmploymentId);
        $(".employment input[name='RadioMemCurrentlyHCBSSupptService'][value=" + result.CCO_Employment[0].MemCurrentlyHCBSSupptService + "]").prop('checked', true);
        $(".employment input[name='RadioMemCurreEmploymentStatus'][value=" + result.CCO_Employment[0].MemCurreEmploymentStatus + "]").prop('checked', true);
        $(".employment #TextBoxAnticipatedLeftHighSchool").val(result.CCO_Employment[0].AnticipatedLeftHighSchool);
        $(".employment input[name='RadioMemWishIncCurreLevelOfEmployment'][value=" + result.CCO_Employment[0].MemWishIncCurreLevelOfEmployment + "]").prop('checked', true);
        $(".employment input[name='RadioMemSatisfiedWithCurrentEmployer'][value=" + result.CCO_Employment[0].MemSatisfiedWithCurrentEmployer + "]").prop('checked', true);
        $(".employment #TextBoxEmployerName").val(result.CCO_Employment[0].EmployerName);
        $(".employment #TextBoxEmployerLocation").val(result.CCO_Employment[0].EmployerLocation);
        $(".employment #TextBoxStartDateOfCurrentJob").val(result.CCO_Employment[0].StartDateOfCurrentJob);
        $(".employment #TextBoxTerminationDateOfRecentJob").val(result.CCO_Employment[0].TerminationDateOfRecentJob);
        $(".employment input[name='RadioReasonToChangeEmploymentStatus'][value=" + result.CCO_Employment[0].ReasonToChangeEmploymentStatus + "]").prop('checked', true);
        $(".employment #TextBoxMemHoursWorkInWeek").val(result.CCO_Employment[0].MemHoursWorkInWeek);
        $(".employment #TextBoxMemEarnInWeek").val(result.CCO_Employment[0].MemEarnInWeek);
        $(".employment #TextBoxAnticipatedLeftHighSchool").val(result.CCO_Employment[0].AnticipatedLeftHighSchool);

        $(".employment input[name='RadioMemPaycheck'][value=" + result.CCO_Employment[0].MemPaycheck + "]").prop('checked', true);
        $(".employment input[name='RadioDescMemEmploymentSetting'][value=" + result.CCO_Employment[0].DescMemEmploymentSetting + "]").prop('checked', true);
        $(".employment input[name='RadioSatisfiedCurrentEmploymentSetting'][value=" + result.CCO_Employment[0].SatisfiedCurrentEmploymentSetting + "]").prop('checked', true);
        $(".employment input[name='RadioMemWorkInIntegratedSetting'][value=" + result.CCO_Employment[0].MemWorkInIntegratedSetting + "]").prop('checked', true);

        //show hide fields
        $(".employment  input[name=RadioMemCurreEmploymentStatus]").each(function (index) {
            if (($(this).parent().text().trim() != 'Not Employed' && $(this).parent().text().trim() != 'Retired' && $(this).prop('checked'))) {
                $('.employment .memberCurrentEmploymentStatusClass').removeAttr('hidden');
                $('.employment .memberCurrentEmploymentStatusClass').show();
            }
            // if(($(this).parent().text().trim()  !='Retired' && $(this).prop('checked')))
            // {
            //     $('.employment .memberCurrentEmploymentStatusClass').removeAttr('hidden');
            //     $('.employment .memberCurrentEmploymentStatusClass').show();
            // }
        });


        if (result.CCO_Employment[0].Status != null) {
            var status = result.CCO_Employment[0].Status;
            if (status == "Completed") {
                $("#statusCompletedEmployment").show();
                $("#statusStartEmployment").hide();
                $("#statusInprogressEmployment").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedEmployment").hide();
                $("#statusStartEmployment").hide();
                $("#statusInprogressEmployment").show();
            }
        }
    }
    else {
        $("#statusCompletedEmployment").hide();
        $("#statusStartEmployment").show();
        $("#statusInprogressEmployment").hide();
    }
    disableOnAdd('employment');

}

function GuardianshipAndAdvocacy(result) {

    if (result.CCO_GuardianshipAndAdvocacy.length > 0) {
        $("#TextBoxGuardianshipAndAdvocacyId").val(result.CCO_GuardianshipAndAdvocacy[0].GuardianshipAndAdvocacyId);
        result.CCO_GuardianshipAndAdvocacy[0].NoActiveGuardian == 'Y' ? $('#CheckboxNoActiveGuardian').prop("checked", true) : $('#CheckboxNoActiveGuardian').prop("checked", false);
        result.CCO_GuardianshipAndAdvocacy[0].NotApplicableGuardian == 'Y' ? $('#CheckboxNotApplicableGuardian').prop("checked", true) : $('#CheckboxNotApplicableGuardian').prop("checked", false);
        if ($('#CheckboxNoActiveGuardian').prop("checked") || $('#CheckboxNotApplicableGuardian').prop("checked")) {
            showFields('guardianAndApplicable');
            AddGuardianshipAndAdvocacy();
            $("#GuardianshipAndAdvocacy").val("");
        }
        else {
            hideFields('guardianAndApplicable');
        }
        if (result.CCO_GuardianshipAndAdvocacy[0].Status != null) {
            var status = result.CCO_GuardianshipAndAdvocacy[0].Status;
            if (status == "Completed") {
                $("#statusCompletedGuardianshipAndAdvocacy").show();
                $("#statusStartGuardianshipAndAdvocacy").hide();
                $("#statusInprogressGuardianshipAndAdvocacy").hide();
            }
            else if (status == "Inprogress") {
                $("#statusCompletedGuardianshipAndAdvocacy").hide();
                $("#statusStartGuardianshipAndAdvocacy").hide();
                $("#statusInprogressGuardianshipAndAdvocacy").show();
            }
        }
    }
    else {
        $("#statusCompletedGuardianshipAndAdvocacy").hide();
        $("#statusStartGuardianshipAndAdvocacy").show();
        $("#statusInprogressGuardianshipAndAdvocacy").hide();
    }
    if (result.JsonDataReturnForAllChildTables != null && result.JsonDataReturnForAllChildTables[0].JSONDataForGuardianshipAndAdvocacyGrid != null) {
        if (result.JsonDataReturnForAllChildTables[0].JSONDataForGuardianshipAndAdvocacyGrid.length > 0) {
            BindStateFormNotifications(result.JsonDataReturnForAllChildTables[0].JSONDataForGuardianshipAndAdvocacyGrid);

        }
    } $(".loader").hide();
}

function MedicalHealthDiagnosis(result) {

    if (result.JsonDataReturnForAllChildTables != null && result.JsonDataReturnForAllChildTables[0].JSONDataForMedicalHealth != null) {
        if (result.JsonDataReturnForAllChildTables[0].JSONDataForMedicalHealth.length > 0) {
            jsonParse = JSON.parse(result.JsonDataReturnForAllChildTables[0].JSONDataForMedicalHealth);

            for (i = 0; i < jsonParse.length; i++) {
                $('input[name=RadioMemSymptomsGottenWorse' + i + '][value=' + jsonParse[i].MemSymptomsGottenWorse + ']').prop('checked', true);
                $('input[name=RadioMemNewSymptoms' + i + '][value=' + jsonParse[i].MemNewSymptoms + ']').prop('checked', true);
                $('input[name=RadioMemFinacTranspOtherBarriers' + i + '][value=' + jsonParse[i].MemFinacTranspOtherBarriers + ']').prop('checked', true);
                $('input[name=RadioIndvAbilityToDailyLiving' + i + '][value=' + jsonParse[i].IndvAbilityToDailyLiving + ']').prop('checked', true);
                $('input[name=TextBoxMedicalHealthDiagnosisId' + i + ']').val(jsonParse[i].MedicalHealthDiagnosisId);
            }
        }
    }
}

function CircleAndSupportSection(result, ContactId) {
    ClearFieldOfCircleAndSupprt();
    if (result.CircleAndSupportDetails != null) {
        $("input[name='TextBoxCircleofSupportId']").val(result.CircleAndSupportDetails[0].CircleofSupportId);
        $("input[name='TextBoxContactID']").val(result.CircleAndSupportDetails[0].ContactID);
        $('input[name=RadioIndividualUtilizeProvider][value=' + result.CircleAndSupportDetails[0].IndividualUtilizeProvider + ']').prop('checked', true);
        $('input[name=RadioSatisfiedWithProvider][value=' + result.CircleAndSupportDetails[0].SatisfiedWithProvider + ']').prop('checked', true);
        $('input[name=RadioChangeToNewProvider][value=' + result.CircleAndSupportDetails[0].ChangeToNewProvider + ']').prop('checked', true);

    }
    else {
        $("input[name='TextBoxContactID']").val(ContactId);

    }
}
function ClearFieldOfCircleAndSupprt() {
    $("input[name='RadioIndividualUtilizeProvider']").prop('checked', false);
    $("input[name='RadioSatisfiedWithProvider']").prop('checked', false);
    $("input[name='RadioChangeToNewProvider']").prop('checked', false);
}

function FillCCOComprehensiveAssessmentPDF() {
    tabName = 'AllCCO_ComprehensiveAssessmentPDFDetails';
    var allMedications = [];

    if (_medications != null && _medications != undefined) {
        for (let i = 0; i < _medications.length; i++) {

            item = {};
            item["MedicationListID"] = _medications[i]["Medication List ID"];
            item["MedicationBrandName"] = _medications[i]["Medication Brand Name"];
            item["MedicationGenericName"] = _medications[i]["Medication Generic Name"];
            allMedications.push(item);

        }
    }

    var data = {
        TabName: tabName, CompAssessmentId: comprehensiveAssessmentId, DocumentVersionId: assessmentVersioiningId, ReportedBy: reportedBy,
        medications: allMedications, circleOfSupports: null, activeDiagnoses: _diagnosis
    };

    fetch(GetAPIEndPoints("FillCCOComprehensiveAssessmentPDF"), {
        body: JSON.stringify(data),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Token': _commonToken
        }
    })
        .then(response => response.blob())
        .then(response => {
            const blob = new Blob([response], { type: "application/octetstream" });
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = "cco_comprehensvie_assessment_1_" + $("#TextBoxCompAssessmentId").val() + "_" + getFormattedTime() + ".pdf";
            document.body.appendChild(a);
            a.click();
        });
}

function GetTokenFromLocalStorage() {
    _companyID = sessionStorage.getItem('customerCode');
}

function calculateBMI() {
    if ($("#TextBoxMemHeight").val() == '') {
        return $("#TextBoxMemHeight").focus();
    }
    if ($("#TextBoxMemWeight").val() == '') {
        return $("#TextBoxMemWeight").focus();
    }
    var height = Number($("#TextBoxMemHeight").val());
    var heightunits = "inches";
    var weight = Number($("#TextBoxMemWeight").val());
    var weightunits = "pounds";


    if (heightunits == "inches") height /= 39.3700787;
    if (weightunits == "pounds") weight /= 2.20462;

    var BMI = weight / Math.pow(height, 2);


    $('#TextBoxBMI').val(Math.round(BMI * 100) / 100);
}