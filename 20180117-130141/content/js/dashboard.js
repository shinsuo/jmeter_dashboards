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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6538461538461539, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AT_ITEM_LIST"], "isController": false}, {"data": [0.5, 500, 1500, "AT_GET_USER_INFO"], "isController": false}, {"data": [0.75, 500, 1500, "AT_WAREHOUSE_LIST"], "isController": false}, {"data": [0.0, 500, 1500, "AT_UPDATE_INFO_LIGHT"], "isController": false}, {"data": [1.0, 500, 1500, "AT_FRIEND_DELETE"], "isController": false}, {"data": [1.0, 500, 1500, "CAL_MAX_PAGE"], "isController": false}, {"data": [0.75, 500, 1500, "AT_RAID_LIST"], "isController": false}, {"data": [0.0, 500, 1500, "AT_GET_PERMIT_PLACE"], "isController": false}, {"data": [0.5, 500, 1500, "AT_GET_EXCHANGE_LIST"], "isController": false}, {"data": [1.0, 500, 1500, "AT_FRIEND_GET"], "isController": false}, {"data": [0.5, 500, 1500, "AT_GET_REINFORCEMENT"], "isController": false}, {"data": [1.0, 500, 1500, "AT_MISSION_SUBMISSION_CLEAR_LIST"], "isController": false}, {"data": [0.5555555555555556, 500, 1500, "AT_UNIT_LIST"], "isController": false}, {"data": [0.75, 500, 1500, "AT_GET_STEP_MISSION_REWARD"], "isController": false}, {"data": [0.75, 500, 1500, "AT_MISSION_CLEAR_LIST"], "isController": false}, {"data": [0.75, 500, 1500, "AT_INITIALIZE"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 39, 0, 0.0, 678.6666666666666, 2, 2033, 1692.0, 1987.0, 2033.0, 2.218808670421574, 97.43345796353188, 1.2315788210445466], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["AT_ITEM_LIST", 2, 0, 0.0, 365.5, 273, 458, 458.0, 458.0, 458.0, 3.289473684210526, 2.0751953125, 1.8599660773026316], "isController": false}, {"data": ["AT_GET_USER_INFO", 2, 0, 0.0, 626.0, 583, 669, 669.0, 669.0, 669.0, 2.7247956403269753, 27.82005705040872, 1.5513240803814714], "isController": false}, {"data": ["AT_WAREHOUSE_LIST", 2, 0, 0.0, 687.5, 316, 1059, 1059.0, 1059.0, 1059.0, 0.27359781121751026, 1.8466516330369358, 0.15603625170998633], "isController": false}, {"data": ["AT_UPDATE_INFO_LIGHT", 2, 0, 0.0, 1998.5, 1964, 2033, 2033.0, 2033.0, 2033.0, 0.2215575495735017, 6.138810132103689, 0.12700613437465383], "isController": false}, {"data": ["AT_FRIEND_DELETE", 2, 0, 0.0, 380.0, 316, 444, 444.0, 444.0, 444.0, 3.527336860670194, 5.632027116402117, 2.345816798941799], "isController": false}, {"data": ["CAL_MAX_PAGE", 2, 0, 0.0, 2.5, 2, 3, 3.0, 3.0, 3.0, 1.8501387604070305, 0.0, 0.0], "isController": false}, {"data": ["AT_RAID_LIST", 2, 0, 0.0, 495.0, 471, 519, 519.0, 519.0, 519.0, 0.26546323334218214, 0.3096638986594107, 0.1501007930714096], "isController": false}, {"data": ["AT_GET_PERMIT_PLACE", 2, 0, 0.0, 1839.5, 1692, 1987, 1987.0, 1987.0, 1987.0, 0.8200082000820008, 23.41387671689217, 0.46926250512505124], "isController": false}, {"data": ["AT_GET_EXCHANGE_LIST", 2, 0, 0.0, 767.0, 575, 959, 959.0, 959.0, 959.0, 0.2508466072996363, 90.19184866110623, 0.14379585789539698], "isController": false}, {"data": ["AT_FRIEND_GET", 2, 0, 0.0, 302.5, 270, 335, 335.0, 335.0, 335.0, 3.3003300330033003, 5.25990099009901, 1.8693275577557755], "isController": false}, {"data": ["AT_GET_REINFORCEMENT", 2, 0, 0.0, 586.0, 570, 602, 602.0, 602.0, 602.0, 1.5197568389057752, 8.108585438829786, 0.8711887348024315], "isController": false}, {"data": ["AT_MISSION_SUBMISSION_CLEAR_LIST", 2, 0, 0.0, 294.0, 277, 311, 311.0, 311.0, 311.0, 2.7472527472527473, 8.933937156593407, 1.6070355425824177], "isController": false}, {"data": ["AT_UNIT_LIST", 9, 0, 0.0, 697.6666666666665, 392, 818, 818.0, 818.0, 818.0, 1.3548095739876562, 110.41286410507301, 0.8163256905765468], "isController": false}, {"data": ["AT_GET_STEP_MISSION_REWARD", 2, 0, 0.0, 698.5, 376, 1021, 1021.0, 1021.0, 1021.0, 0.2375014843842774, 8.55132908057238, 0.1375374807030044], "isController": false}, {"data": ["AT_MISSION_CLEAR_LIST", 2, 0, 0.0, 373.5, 227, 520, 520.0, 520.0, 520.0, 3.105590062111801, 18.437924592391305, 1.7832880434782608], "isController": false}, {"data": ["AT_INITIALIZE", 2, 0, 0.0, 678.5, 489, 868, 868.0, 868.0, 868.0, 2.070393374741201, 2.6294400232919255, 1.2009899068322982], "isController": false}]}, function(index, item){
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
