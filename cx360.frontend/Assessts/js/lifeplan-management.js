var tr, row, LifePlanId;
var token = "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5";
var reportedBy;
var token,
    DocumentVersionId,
    prevLifePlanId,
    tblPrev,
    tblCurrent,
    prevVersionMsg = "",
    currentVersionMsg="";
$(document).ready(function () {
    AuthUser();

    GetDetailMasterPage();

    // Add event listener for opening and closing details
    $('#example').on('click', 'td.details-control', function (e) {
        //e.stopPropagation();
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var json = [];
        var item = {};
        item["LifePlanId"] = row.data().LifePlanId;
        item["CompanyId"] = row.data().CompanyId;
        json.push(item);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            // callAjax2(row, json);
            tr.addClass('shown');
        }
    });
});
function AuthUser() {
    $.ajax({
        type: "GET",
        url: 'https://staging-api.cx360.net/api/AuthenticateUser',
        headers: {
            'APIKEY': '6C194C7A-A3D0-4090-9B62-9EBAAA3848C5',
            'CustomerCode': 'BASE72_1011',
            'UserName': 'incident@core.com',
            'Password': 'test@123'
        },
        success: function (result) {
            reportedBy = result.UserID;


        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function GetDetailMasterPage() {

    //token = result.Token;
    var json = [];
    var item = {};
    item["LifePlanId"] = -1;
    item["CompanyId"] = -1;
    json.push(item);
    table = $('#example').DataTable({
        "order": [],
        "ajax": function (data, callback, setting) {
            $.ajax({
                type: "POST",
                data: { TabName: "LifePlanMasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy, Mode: "select" },
                url: GetAPIEndPoints("HANDLELIFEPLANDETAIL"),
                headers: {
                    'TOKEN': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
                },
                success: function (response) {
                    var dataTouse = {};
                    dataTouse.data = response.LifPlanDetailsData;
                    if (response.LifPlanDetailsData == null) {
                        dataTouse.data = [];
                    }
                    callback(dataTouse);
                }
            });
        },

        "columns": [
            //{
            //    "className": 'details-control',
            //    "orderable": false,
            //    "data": null,
            //    "defaultContent": ''
            //},
            { "data": "ClientId" },
            { "data": "EffectiveFromDate" },
            { "data": "EffectiveToDate" },
            { "data": "DocumentStatus" },
            { "data": "DocumentVersion" },
            {
                "className": 'left',
                "orderable": false,
                "data": "Actions",
                //"defaultContent": '<a type="button" class="btn btn-primary" onclick="viewCurrentRow(this);">View</a><a type="button" class="btn btn-primary" onclick="deleteCurrentRow(this);">Delete</a>'
            }
        ]

    });
}
function viewCurrentRow(e) {

    tr = e.closest("tr");
    row = table.row(tr);
    var rowIndex = tr._DT_RowIndex
    LifePlanId = row.data().LifePlanId;
    var DocumentVersionId = row.data().DocumentVersionId;
    var Status = row.data().DocumentStatus;
    window.open('life-plan-template.html?LifePlanId=' + LifePlanId + '&DocumentVersionId=' + DocumentVersionId + '');
}
function deleteCurrentRow(e) {
    tr = e.closest("tr");
    row = table.row(tr);
    LifePlanId = row.data().LifePlanId;
    $.ajax({
        type: "POST",
        data: { TabName: "GetLifePlanRecords", LifePlanId: LifePlanId, ReportedBy: reportedBy, Mode: "delete" },
        url: GetAPIEndPoints("HANDLELIFEPLANDETAIL"),
        headers: {
            'TOKEN': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (response) {


            location.reload();



        }
    });
}
function ViewAuditDetails(object) {
    tr = object.closest("tr");
    row = table.row(tr);
    LifePlanId = row.data().LifePlanId;
    var DocumentVersionId = row.data().DocumentVersionId;
    $.ajax({
        type: "POST",
        data: { TabName: "ViewAuditDetails", LifePlanId: LifePlanId, DocumentVersionId: DocumentVersionId },
        url: GetAPIEndPoints("GETMASTERAUDITRECORD"),
        headers: {
            'TOKEN': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (response) {

            BindAuditDetailMaster(response);
        }
        ,
        error: function (xhr) { HandleAPIError(xhr) }
    });


}
function BindAuditDetailMaster(result) {
    if (result.Success == true) {
        if (result.LifPlanDetailsData != null) {
            var tbl = $("#tblMasterAudit tbody");
            tbl.html("");
            for (var i = 0; i < result.LifPlanDetailsData.length; i++) {
                let base = result.LifPlanDetailsData[i];
                let tr = $("<tr/>");
                $(tr).append(createTd(base.LifePlanId));
                $(tr).append(createTd(base.DocumentVersionId));
                $(tr).append(createTd(base.EffectiveFromDate));
                $(tr).append(createTd(base.EffectiveToDate));
                $(tr).append(createTd(base.ProviderID));
                $(tr).append(createTd(base.DocumentStatus));
                $(tr).append(createTd(base.DocumentVersion));
                $(tbl).append(tr);


            }
            var prevVersionLength = $("#tblMasterAudit tbody tr:eq(0) td").length;
            prevLifePlanId = $("#tblMasterAudit tbody tr:eq(0) td:eq(0)").html();
            prevVersionMsg = $("#tblMasterAudit tbody tr:eq(0) td:eq(6)").html();
            var currentVersionLength = $("#tblMasterAudit tbody tr:eq(1)").length;
            if (currentVersionLength > 0) {
                currentVersionMsg = $("#tblMasterAudit tbody tr:eq(1) td:eq(6)").html();
                for (var i = 0; i <= prevVersionLength; i++) {
                    var prevValue = $("#tblMasterAudit tbody tr:eq(0) td:eq(" + i + ")").html();
                    var j = i;
                    for (j; j <= i; j++) {
                        var currentValue = $("#tblMasterAudit tbody tr:eq(1) td:eq(" + j + ")").html();

                        if (prevValue != currentValue) {
                            $("#tblMasterAudit tbody tr:eq(1) td:eq(" + j + ")").css("background-color", "yellow")
                        }
                    }

                }
            }
            else {
                $("#tblMasterAudit tbody tr:eq(0)").css("background-color", "yellow");
                currentVersionMsg = $("#tblMasterAudit tbody tr:eq(0) td:eq(6)").html();
                prevLifePlanId = "-1";
                prevVersionMsg = "previously does not exists for client";
            }
            Hidecolumns();
            $("#exampleModa2").modal("show");
        }
    }
    else {
        showErrorMessage(result.Message);
    }
}


function AuditLifePlanChildRecords(section) {

    $.ajax({
        type: "POST",
        data: { TabName: section, LifePlanId: LifePlanId, DocumentVersionId: DocumentVersionId, PreviousLifePlanId: prevLifePlanId },
        url: GetAPIEndPoints("GETAUDITCHILDRECORD"),
        headers: {
            'TOKEN': "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5",
        },
        success: function (response) {
            if (response.Success == true) { BindChildTables(response, section); }
            else {
                showErrorMessage(response.Message);
            }
        }
        ,
        error: function (xhr) { HandleAPIError(xhr) }
    });

}

function Hidecolumns() {
    $("#tblMasterAudit thead tr:eq(0) th:eq(0)").css("display", "none")
    $("#tblMasterAudit thead tr:eq(0) th:eq(1)").css("display", "none")

    $("#tblMasterAudit tbody tr").each(function () {
        $(this).find("td:eq(0)").css("display", "none")
        $(this).find("td:eq(1)").css("display", "none");
    });
}
function BindChildTables(response, section) {
    switch (section) {
        case "Meeting":
            BindMeetingRecords(response, section);
            break;
        case "NarrativeSummary":
            BindAssessmentNarrativeSummary(response, section);
            break;
        case "OutComeSupport":
            BindOutcomeSupport(response, section);
            break;
        case "IndividualSafety":
            BindIndividualSafety(response, section);
            break;
        case "HSBCServices":
            BindHSBCServices(response, section);
            break;
        case "FundedServices":
            BindFundedServices(response, section);
            break;

    }
}

function BindMeetingRecords(resut, section) {
   
    var resultPrevious = resut.AllTab[0].JSONDataPrevious;
    var parse = JSON.parse(resultPrevious);
     tblPrev = $("#meetingPrevious tbody");
    tblPrev.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.PlanerReviewDate));
            $(tr).append(createTd(base.MeetingReason));
            $(tr).append(createTd(base.MemberAttendance));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblPrev).append(tr);

        }
    }
    
    var resultCurrent = resut.AllTab[0].JSONDataCurrent;
    parse = JSON.parse(resultCurrent);
    tblCurrent = $("#meetingCurrent tbody");
    tblCurrent.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.PlanerReviewDate));
            $(tr).append(createTd(base.MeetingReason));
            $(tr).append(createTd(base.MemberAttendance));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblCurrent).append(tr);

        }
    }
    highlightDifferences(tblPrev, tblCurrent);
   
    $("#tblSectionMeeting").removeClass("hiddenSection");
    $("#tblSectionAssessmentSummary").addClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").addClass("hiddenSection");
    $("#tblSectionIndividualSafe").addClass("hiddenSection");
    $("#tblSectionHCBSWaiver").addClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").addClass("hiddenSection");
    showHeading(section);
}
function BindAssessmentNarrativeSummary(resut, section) {
    var resultPrevious = resut.AllTab[0].JSONDataPrevious;
    var parse = JSON.parse(resultPrevious);
    tblPrev = $("#assessmentSummaryPrevious tbody");
    tblPrev.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.MyHome));
            $(tr).append(createTd(base.MyWork));
            $(tr).append(createTd(base.MyHealthAndMedication));
            $(tr).append(createTd(base.MyRelationships));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblPrev).append(tr);

        }
    }
    var resultPrevious = resut.AllTab[0].JSONDataCurrent;
    var parse = JSON.parse(resultPrevious);
    tblCurrent = $("#assessmentSummarycurrent tbody");
    tblCurrent.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.MyHome));
            $(tr).append(createTd(base.MyWork));
            $(tr).append(createTd(base.MyHealthAndMedication));
            $(tr).append(createTd(base.MyRelationships));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblCurrent).append(tr);

        }
    }
    highlightDifferences(tblPrev, tblCurrent);
    $("#tblSectionMeeting").addClass("hiddenSection");
    $("#tblSectionAssessmentSummary").removeClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").addClass("hiddenSection");
    $("#tblSectionIndividualSafe").addClass("hiddenSection");
    $("#tblSectionHCBSWaiver").addClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").addClass("hiddenSection");
    showHeading(section);
}
function BindOutcomeSupport(resut, section) {
    var resultPrevious = resut.AllTab[0].JSONDataPrevious;
    var parse = JSON.parse(resultPrevious);
    tblPrev = $("#outcomesStrategiesPrevious tbody");
    tblPrev.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.CqlPomsGoal));
            $(tr).append(createTd(base.CcoGoal));
            $(tr).append(createTd(base.ProviderAssignedGoal));
            $(tr).append(createTd(base.ProviderLocation));
            $(tr).append(createTd(base.ServicesType));
            $(tr).append(createTd(base.Frequency));
            $(tr).append(createTd(base.Quantity));
            $(tr).append(createTd(base.TimeFrame));
            $(tr).append(createTd(base.SpecialConsiderations));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblPrev).append(tr)
        }
    }
    var resultPrevious = resut.AllTab[0].JSONDataCurrent;
    var parse = JSON.parse(resultPrevious);
    tblCurrent = $("#outcomesStrategiesCurrent tbody");
    tblCurrent.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.CqlPomsGoal));
            $(tr).append(createTd(base.CcoGoal));
            $(tr).append(createTd(base.ProviderAssignedGoal));
            $(tr).append(createTd(base.ProviderLocation));
            $(tr).append(createTd(base.ServicesType));
            $(tr).append(createTd(base.Frequency));
            $(tr).append(createTd(base.Quantity));
            $(tr).append(createTd(base.TimeFrame));
            $(tr).append(createTd(base.SpecialConsiderations));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblCurrent).append(tr)
        }
    }
    highlightDifferences(tblPrev, tblCurrent);
    $("#tblSectionMeeting").addClass("hiddenSection");
    $("#tblSectionAssessmentSummary").addClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").removeClass("hiddenSection");
    $("#tblSectionIndividualSafe").addClass("hiddenSection");
    $("#tblSectionHCBSWaiver").addClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").addClass("hiddenSection");
    showHeading(section);
}
function BindIndividualSafety(resut, section) {
    var resultPrevious = resut.AllTab[0].JSONDataPrevious;
    var parse = JSON.parse(resultPrevious);
    tblPrev = $("#individualSafePrevious tbody");
    tblPrev.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.GoalValuedOutcome));
            $(tr).append(createTd(base.ProviderAssignedGoal));
            $(tr).append(createTd(base.ProviderLocation));
            $(tr).append(createTd(base.ServicesType));
            $(tr).append(createTd(base.Frequency));
            $(tr).append(createTd(base.Quantity));
            $(tr).append(createTd(base.TimeFrame));
            $(tr).append(createTd(base.SpecialConsiderations));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblPrev).append(tr)
        }
    }
    var resultPrevious = resut.AllTab[0].JSONDataCurrent;
    var parse = JSON.parse(resultPrevious);
    tblCurrent = $("#individualSafeCurrent tbody");
    tblCurrent.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.GoalValuedOutcome));
            $(tr).append(createTd(base.ProviderAssignedGoal));
            $(tr).append(createTd(base.ProviderLocation));
            $(tr).append(createTd(base.ServicesType));
            $(tr).append(createTd(base.Frequency));
            $(tr).append(createTd(base.Quantity));
            $(tr).append(createTd(base.TimeFrame));
            $(tr).append(createTd(base.SpecialConsiderations));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblCurrent).append(tr);
        }
    }
    highlightDifferences(tblPrev, tblCurrent);
    $("#tblSectionMeeting").addClass("hiddenSection");
    $("#tblSectionAssessmentSummary").addClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").addClass("hiddenSection");
    $("#tblSectionIndividualSafe").removeClass("hiddenSection");
    $("#tblSectionHCBSWaiver").addClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").addClass("hiddenSection");
    showHeading(section);
}
function BindHSBCServices(resut, section) {
    var resultPrevious = resut.AllTab[0].JSONDataPrevious;
    var parse = JSON.parse(resultPrevious);
    tblPrev = $("#hCBSWaiverPrevious tbody");
    tblPrev.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.Code));
            $(tr).append(createTd(base.FacilityName));
            $(tr).append(createTd(base.CombinedDate));
            $(tr).append(createTd(base.Unit));
            $(tr).append(createTd(base.Comments));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblPrev).append(tr)
        }
    }
    var resultPrevious = resut.AllTab[0].JSONDataCurrent;
    var parse = JSON.parse(resultPrevious);
    tblCurrent = $("#hCBSWaiverCurrent tbody");
    tblCurrent.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.Code));
            $(tr).append(createTd(base.FacilityName));
            $(tr).append(createTd(base.CombinedDate));
            $(tr).append(createTd(base.Unit));
            $(tr).append(createTd(base.Comments));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblCurrent).append(tr)
        }
    }
    highlightDifferences(tblPrev, tblCurrent);
    $("#tblSectionMeeting").addClass("hiddenSection");
    $("#tblSectionAssessmentSummary").addClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").addClass("hiddenSection");
    $("#tblSectionIndividualSafe").addClass("hiddenSection");
    $("#tblSectionHCBSWaiver").removeClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").addClass("hiddenSection");
    showHeading(section);
}
function BindFundedServices(resut, section) {
    var resultPrevious = resut.AllTab[0].JSONDataPrevious;
    var parse = JSON.parse(resultPrevious);
    tblPrev = $("#fundalNaturalCommunityResourcesPrevious tbody");
    tblPrev.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.FirstName + " " + base.LastName));
            $(tr).append(createTd(base.Role));
            $(tr).append(createTd(base.AddressOne));
            $(tr).append(createTd(base.Phone));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblPrev).append(tr)
        }
    }
    var resultPrevious = resut.AllTab[0].JSONDataCurrent;
    var parse = JSON.parse(resultPrevious);
    tblCurrent = $("#fundalNaturalCommunityResourcesCurrent tbody");
    tblCurrent.html("");
    if (parse != null) {
        for (var i = 0; i < parse.length; i++) {
            let base = parse[i];
            let tr = $("<tr/>");
            $(tr).append(createTd(base.FirstName + " " + base.LastName));
            $(tr).append(createTd(base.Role));
            $(tr).append(createTd(base.AddressOne));
            $(tr).append(createTd(base.Phone));
            $(tr).append(createTd(base.RecordDeleted));
            $(tblCurrent).append(tr)
        }
    }
    highlightDifferences(tblPrev, tblCurrent);
    $("#tblSectionMeeting").addClass("hiddenSection");
    $("#tblSectionAssessmentSummary").addClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").addClass("hiddenSection");
    $("#tblSectionIndividualSafe").addClass("hiddenSection");
    $("#tblSectionHCBSWaiver").addClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").removeClass("hiddenSection");
    showHeading(section);
}

function highlightDifferences(main, another) {
    var mainRows = main.children(),
        anotherRows = another.children();
    mainRows.each(function (rowNumber, mainRow) {
        var anotherRow = anotherRows.eq(rowNumber),
            anotherCells = anotherRow.children(),
            mainCells = $(mainRow).children();
        mainCells.each(function (colNumber, cell) {
            var anotherCell = anotherCells.eq(colNumber);
            anotherCell.toggleClass("highlight", anotherCell.text() !== $(cell).text())
        });
    });
    var firstTableLenth = mainRows.length,
        secondTableLength = anotherRows.length,
        arrayFirstRows = [],
        arraySecondRows = [];
    for (var i = 0; i < firstTableLenth; i++) {
        arrayFirstRows.push(i);
    }
    for (var j = 0; j < secondTableLength; j++) {
        arraySecondRows.push(j);
    }
    var newRows = arraySecondRows.filter((rowIndex) => !arrayFirstRows.includes(rowIndex));
    $.each(newRows,function (index, val) {
        anotherRows.eq(val).css("background-color", "yellow")
     
    });
}
function ClearExistingData() {
    var tbl = $("#tblMasterAudit tbody");
    tbl.html("");
    $("#tblSectionMeeting").addClass    ("hiddenSection");
    $("#tblSectionAssessmentSummary").addClass("hiddenSection");
    $("#tblSectionOutcomesStrategies").addClass("hiddenSection");
    $("#tblSectionIndividualSafe").addClass("hiddenSection");
    $("#tblSectionHCBSWaiver").addClass("hiddenSection");
    $("#tblSectionFundalNaturalCommunityResources").addClass("hiddenSection");
}
function showHeading(section) {
    $(".prevVersion h4").text(section + " Version " + prevVersionMsg);
    $(".currentVersion h4").text(section + " Version " + currentVersionMsg);
}