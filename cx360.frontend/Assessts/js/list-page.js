var tr, row, ComprehensiveAssessmentId;
var token = "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5";
var reportedBy;
var token,
    DocumentVersionId,
  
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
        item["ComprehensiveAssessmentId"] = row.data().ComprehensiveAssessmentId;
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
    item["ComprehensiveAssessmentId"] = -1;
    item["CompanyId"] = -1;
    json.push(item);
    table = $('#example').DataTable({
        "order": [],
        "ajax": function (data, callback, setting) {
            $.ajax({
                type: "POST",
                data: { TabName: "LifePlanMasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy, Mode: "select" },
                url: GetAPIEndPoints("GETASSESSMENTDETAIL"),
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
            { "data": "AssessmentDate" },
            { "data": "ReachedBy" },
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



