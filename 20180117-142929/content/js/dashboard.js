/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7051282051282052, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AT_ITEM_LIST"], "isController": false}, {"data": [0.75, 500, 1500, "AT_GET_USER_INFO"], "isController": false}, {"data": [0.75, 500, 1500, "AT_WAREHOUSE_LIST"], "isController": false}, {"data": [0.25, 500, 1500, "AT_UPDATE_INFO_LIGHT"], "isController": false}, {"data": [1.0, 500, 1500, "AT_FRIEND_DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "CAL_MAX_PAGE"], "isController": false}, {"data": [0.75, 500, 1500, "AT_RAID_LIST"], "isController": false}, {"data": [0.25, 500, 1500, "AT_GET_PERMIT_PLACE"], "isController": false}, {"data": [0.5, 500, 1500, "AT_GET_EXCHANGE_LIST"], "isController": false}, {"data": [0.75, 500, 1500, "AT_FRIEND_GET"], "isController": false}, {"data": [0.5, 500, 1500, "AT_GET_REINFORCEMENT"], "isController": false}, {"data": [1.0, 500, 1500, "AT_MISSION_SUBMISSION_CLEAR_LIST"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "AT_UNIT_LIST"], "isController": false}, {"data": [1.0, 500, 1500, "AT_GET_STEP_MISSION_REWARD"], "isController": false}, {"data": [1.0, 500, 1500, "AT_MISSION_CLEAR_LIST"], "isController": false}, {"data": [0.75, 500, 1500, "AT_INITIALIZE"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39, 0, 0.0, 606.1282051282052, 1, 1683, 1408.0, 1579.0, 1683.0, 2.422360248447205, 106.54581958462732, 1.3445627911490683], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["AT_ITEM_LIST", 2, 0, 0.0, 246.0, 234, 258, 258.0, 258.0, 258.0, 5.797101449275362, 5.717844202898551, 3.2778532608695654], "isController": false}, {"data": ["AT_GET_USER_INFO", 2, 0, 0.0, 521.5, 499, 544, 544.0, 544.0, 544.0, 3.1695721077654517, 30.183674227416798, 1.8045513074484945], "isController": false}, {"data": ["AT_WAREHOUSE_LIST", 2, 0, 0.0, 425.0, 222, 628, 628.0, 628.0, 628.0, 0.26720106880427524, 1.8984583750835002, 0.1523881095524382], "isController": false}, {"data": ["AT_UPDATE_INFO_LIGHT", 2, 0, 0.0, 1493.5, 1408, 1579, 1579.0, 1579.0, 1579.0, 0.2261931689662972, 5.840930537491517, 0.12966346697579734], "isController": false}, {"data": ["AT_FRIEND_DELETE", 2, 0, 0.0, 250.5, 239, 262, 262.0, 262.0, 262.0, 2.6455026455026456, 5.164413855820106, 1.7593625992063493], "isController": false}, {"data": ["CAL_MAX_PAGE", 2, 0, 0.0, 2.0, 1, 3, 3.0, 3.0, 3.0, 1.658374792703151, 0.0, 0.0], "isController": false}, {"data": ["AT_RAID_LIST", 2, 0, 0.0, 463.5, 412, 515, 515.0, 515.0, 515.0, 0.2516039753428104, 0.3831800776827274, 0.142264357151843], "isController": false}, {"data": ["AT_GET_PERMIT_PLACE", 2, 0, 0.0, 1570.0, 1457, 1683, 1683.0, 1683.0, 1683.0, 0.8964589870013447, 24.222777061855673, 0.5130126624831914], "isController": false}, {"data": ["AT_GET_EXCHANGE_LIST", 2, 0, 0.0, 851.5, 681, 1022, 1022.0, 1022.0, 1022.0, 0.23369946249123627, 84.11138061609022, 0.1339663910960505], "isController": false}, {"data": ["AT_FRIEND_GET", 2, 0, 0.0, 509.0, 297, 721, 721.0, 721.0, 721.0, 2.403846153846154, 4.6856219951923075, 1.3615534855769231], "isController": false}, {"data": ["AT_GET_REINFORCEMENT", 2, 0, 0.0, 534.5, 534, 535, 535.0, 535.0, 535.0, 1.529051987767584, 8.685284069189603, 0.8765171062691132], "isController": false}, {"data": ["AT_MISSION_SUBMISSION_CLEAR_LIST", 2, 0, 0.0, 233.5, 227, 240, 240.0, 240.0, 240.0, 2.5380710659898473, 9.155893083756345, 1.4846724302030456], "isController": false}, {"data": ["AT_UNIT_LIST", 9, 0, 0.0, 745.1111111111111, 332, 1081, 1081.0, 1081.0, 1081.0, 1.2520868113522536, 102.48512603471063, 0.7544312134808013], "isController": false}, {"data": ["AT_GET_STEP_MISSION_REWARD", 2, 0, 0.0, 379.5, 354, 405, 405.0, 405.0, 405.0, 0.24154589371980675, 8.78304744112319, 0.13987960446859904], "isController": false}, {"data": ["AT_MISSION_CLEAR_LIST", 2, 0, 0.0, 453.0, 419, 487, 487.0, 487.0, 487.0, 2.042900919305414, 12.85591164453524, 1.1730720122574054], "isController": false}, {"data": ["AT_INITIALIZE", 2, 0, 0.0, 533.5, 376, 691, 691.0, 691.0, 691.0, 2.34192037470726, 3.80676412470726, 1.358496779859485], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 39, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
