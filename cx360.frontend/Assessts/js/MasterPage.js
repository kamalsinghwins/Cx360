var tr, row, incidentManagementId;
var token = "6C194C7A-A3D0-4090-9B62-9EBAAA3848C5";

var reportedBy;
$(document).ready(function () {
    GetAuthToken();
});
//function GetAuthToken() {
//    debugger
//    $.ajax({
//        type: "GET",
//        url: 'https://staging-api.cx360.net/api/AuthenticateUser',
//        headers: {
//            'APIKEY': '6C194C7A-A3D0-4090-9B62-9EBAAA3848C5',
//            'CustomerCode': 'BASE72_1011',
//            'UserName': 'incident@core.com',
//            'Password': 'test@123'
//        },
//        success: function (result) {
//            GetDetailMasterPage(result);

//        },
//        error: function (xhr) { HandleAPIError(xhr) }
//    });
//}
function GetAuthToken() {
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
            GetToken(result);
        },
        error: function (xhr) { HandleAPIError(xhr) }
    });
}
function GetToken(result) {
    reportedBy = result.UserID;
}
function GetDetailMasterPage() {
    debugger;
    //token = result.Token;
    var json = [];
    var item = {};
    item["IncidentManagementId"] = -1;
    item["IncidentType"] = -1;
    json.push(item);
    table = $('#example').DataTable({
        "infoEmpty": "No records available",
        "ajax": function (data, callback, setting) {
            $.ajax({
                type: "POST",
                data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: 1 },
                url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                headers: {
                    'Token': token
                },
                success: function (response) {
                    var dataTouse = {};
                    if (response.GeneralTab != null) {
                        dataTouse.data = response.GeneralTab;

                        callback(dataTouse);
                    }
                    else {
                        callback({ "data": [] });
                    }
                }
            });
        },

        "columns": [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            { "data": "IncidentDateTime" },
            { "data": "IncidentType" },
            { "data": "Site" },
            { "data": "Location" },
            { "data": "Description" },
            {
                "className": 'center',
                "orderable": false,
                "data": null,
                "defaultContent": '<a type="button" class="btn btn-primary" onclick="incidentManagementDetails(this);">View</a>   <a type="button" class="btn btn-primary" onclick="deleteCurrentRow(this);">Delete</a>'
            }
        ]

    });
}
function incidentManagementDetails(e) {
    tr = e.closest("tr");
    row = table.row(tr);
    incidentManagementId = row.data().IncidentManagementId;
    window.open('general.html?IncidentManagementId=' + incidentManagementId + '');
}

function deleteCurrentRow(e) {
    tr = e.closest("tr");
    row = table.row(tr);
    incidentManagementId = row.data().IncidentManagementId;
    $.ajax({
        type: "POST",
        data: { TabName: "DeleteMasterRecord", IncidentManagementId: incidentManagementId, ReportedBy: reportedBy },
        url: GetAPIEndPoints("DELETEMASTERRECORD"),
        headers: {
            'TOKEN': token
        },
        success: function (response) {
            location.reload();
        }
    });
}

$(document).ready(function () {
    GetDetailMasterPage();

    // Add event listener for opening and closing details
    $('#example').on('click', 'td.details-control', function (e) {
        debugger;
        //e.stopPropagation();
        var tr = $(this).closest('tr');
        var row = table.row(tr);
        var json = [];
        var item = {};
        item["IncidentManagementId"] = row.data().IncidentManagementId;
        item["IncidentType"] = row.data().IncidentType;
        json.push(item);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            callAjax2(row, json);
            tr.addClass('shown');
        }
    });

    function callAjax2(row, json) {
        if (row.data().IncidentType == 79311) {
            var table2 = $('#exampleInjury').clone().attr('id', "tableSecondLevel").dataTable({

                "bJQueryUI": true,
                "ajax": function (data, callback, setting) {
                    $.ajax({
                        type: "POST",
                        data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy },
                        url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                        headers: {
                            'TOKEN': token,
                        },
                        success: function (response) {
                            var dataTouse = {};
                          

                            if (response.GeneralTab != null) {
                                dataTouse.data = response.GeneralTab;

                                callback(dataTouse);
                            }
                            else {
                                callback({ "data": [] });
                            }
                        }
                    });
                },
                "columns": [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    { "data": "TimeOfInjury" },
                    // { "data": "InjuryWas" },
                    { "data": "InjuryLocation" },
                    { "data": "InjuryCause" },
                    { "data": "InjurySeverity" },
                    { "data": "InjuryColor" }
                ]
            });

            table2.removeClass("childtable_hidden");

            var child = row.child(table2);
            var table_td = $(table2).closest('tr td');
            table_td.addClass("nestedtable");
            table2.addClass("secondlevel");
            child.show();

            table2.on({
                click: function (e) {
                    debugger;
                    var index = $(this).index();
                    e.stopPropagation();

                    var nestedTable;
                    var tr;
                    var row;
                    // nested table exist
                    var nestedExist = $(this).parent().hasClass('shown');
                    var x = nestedExist.length;
                    if (x) {
                        $('coucou').DataTable().destroy();

                        return;

                    } else {
                        nestedTable = $(this).closest('table.childtable');
                        tr = $(this).closest('tr');
                        row = $(nestedTable).DataTable().row(tr);
                        var incidentInjuryId = row.data().IncidentInjuryId;
                        var incidentManagementId = row.data().IncidentManagementId;
                        var json = [];
                        var item = {};
                        item["IncidentInjuryId"] = incidentInjuryId;
                        item["IncidentManagementId"] = incidentManagementId;
                        json.push(item);

                    }
                    if (row.child.isShown()) {
                        row.child.hide();
                        tr.removeClass('shown');

                    } else {
                        callAjax3(row, json);
                        tr.addClass('shown');
                    }
                }
            }, 'td.details-control');
        }
        else if (row.data().IncidentType == 79312) {
            var table2 = $('#exampleMedication').clone().attr('id', "tableSecondLevel").dataTable({
                "ajax": function (data, callback, setting) {
                    $.ajax({
                        type: "POST",
                        data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy },
                        url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                        headers: {
                            'TOKEN': token,
                        },
                        success: function (response) {
                            var dataTouse = {};
                            dataTouse.data = response.GeneralTab;
                            callback(dataTouse);
                        }
                    });
                },
                headers: 'true',
                "columns": [
                    {
                        "className": 'details-control',
                        "orderable": false,
                        "data": null,
                        "defaultContent": ''
                    },
                    { "data": "TimeOfMedicationError" },
                    { "data": "CauseOfMedError" },
                    { "data": "SeverityOfMedError" },
                    { "data": "MedicalAttentionNeeded" }
                ]
            });

            table2.removeClass("childtable_hidden");

            var child = row.child(table2);
            var table_td = $(table2).closest('tr td');
            table_td.addClass("nestedtable");
            table2.addClass("secondlevel");
            child.show();

            table2.on({
                click: function (e) {
                    debugger;
                    var index = $(this).index();
                    e.stopPropagation();

                    var nestedTable;
                    var tr;
                    var row;
                    // nested table exist
                    var nestedExist = $(this).parent().hasClass('shown');
                    var x = nestedExist.length;
                    if (x) {
                        $('coucou').DataTable().destroy();

                        return;

                    } else {
                        // we must create a nested table
                        nestedTable = $(this).closest('table.childtable');
                        tr = $(this).closest('tr');
                        row = $(nestedTable).DataTable().row(tr);
                        var incidentManagementId = row.data().IncidentManagementId;
                        var incidentMedicationErrorId = row.data().IncidentMedicationErrorId;
                        var json = [];
                        var item = {};
                        item["IncidentManagementId"] = incidentManagementId;
                        item["IncidentMedicationErrorId"] = incidentMedicationErrorId;
                        json.push(item);

                    }
                    if (row.child.isShown()) {
                        // This row is already open - close it
                        row.child.hide();
                        tr.removeClass('shown');

                    } else {
                        // Open this row
                        callAjax3(row, json);
                        tr.addClass('shown');
                    }


                }
            }, 'td.details-control');

        }
        else if (row.data().IncidentType == 79313) {
            var table2 = $('#exampleIncidentDeath').clone().attr('id', "tableSecondLevel").dataTable({
                "ajax": function (data, callback, setting) {
                    $.ajax({
                        type: "POST",
                        data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy},
                        url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                        headers: {
                            'TOKEN': token,
                        },
                        success: function (response) {
                            var dataTouse = {};
                            dataTouse.data = response.GeneralTab;
                            callback(dataTouse);
                        }
                    });
                },
                "columns": [
                    { "data": "TimeOfDeath" },
                    { "data": "CauseOfDeath" },
                    { "data": "Description" }
                ]
            });

            table2.removeClass("childtable_hidden");

            var child = row.child(table2);
            var table_td = $(table2).closest('tr td');
            table_td.addClass("nestedtable");
            table2.addClass("secondlevel");
            child.show();
        }
        else if (row.data().IncidentType == 79619) {
            var table2 = $('#exampleIncidentOthers').clone().attr('id', "tableSecondLevel").dataTable({
                "ajax": function (data, callback, setting) {
                    $.ajax({
                        type: "POST",
                        data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy },
                        url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                        headers: {
                            'TOKEN': token,
                        },
                        success: function (response) {
                            var dataTouse = {};
                            dataTouse.data = response.GeneralTab;
                            callback(dataTouse);
                        }
                    });
                },
                "columns": [
                    { "data": "TimeOfEvent" },
                    { "data": "Description" }
                ]
            });
            table2.removeClass("childtable_hidden");
            var child = row.child(table2);
            var table_td = $(table2).closest('tr td');
            table_td.addClass("nestedtable");
            table2.addClass("secondlevel");
            child.show();
        }
    }

    function callAjax3(row, json) {
        if (row.data().IncidentMedicationErrorId > 0) {
            var table3 = $('#exampleMedicationSubFields').clone().attr('id', "tableThirdLevel").dataTable({
                "ajax": function (data, callback, setting) {
                    $.ajax({
                        type: "POST",
                        data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy },
                        url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                        headers: {
                            'TOKEN': token,
                        },
                        success: function (response) {
                            var dataTouse = {};
                            dataTouse.data = response.GeneralTab;
                            callback(dataTouse);
                        }
                    });
                },
                "columns": [

                    { "data": "Medication" },
                    { "data": "Description" }
                ]

            });

            table3.removeClass("childtable_hidden");

            var child = row.child(table3);
            var table_td = $(table3).closest('tr td');
            table_td.addClass("nestedtable");
            table3.addClass("thirdlevel");
            child.show();
        }
        if (row.data().IncidentInjuryId > 0) {
            var table3 = $('#exampleIncidentBodyPart').clone().attr('id', "tableThirdLevel").dataTable({
                "ajax": function (data, callback, setting) {
                    $.ajax({
                        type: "POST",
                        data: { TabName: "MasterPage", Json: JSON.stringify(json[0]), ReportedBy: reportedBy },
                        url: GetAPIEndPoints("GETINCIDENTMANAGEMENT"),
                        headers: {
                            'TOKEN': token,
                        },
                        success: function (response) {
                            var dataTouse = {};
                            dataTouse.data = response.GeneralTab;
                            callback(dataTouse);
                        }
                    });
                },
                "columns": [
                  
                    { "data": "FrontBody" },
                    { "data": "BackBody" },
                    { "data": "InjuryType" },
                    { "data": "Description" },
                ]

            });

            table3.attr('id', "coucou");
            table3.removeClass("childtable_hidden");

            var child = row.child(table3);
            var table_td = $(table3).closest('tr td');


            table_td.addClass("nestedtable");
            table3.removeClass("secondlevel");
            table3.addClass("thirdlevel");
            child.show();
        }
    }

});