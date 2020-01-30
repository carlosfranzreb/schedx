// JavaScript Document

/* exported checkRow, newEntry, openSettings, newMonth, createMonth, changeSick,changeComment, setOptionsOptions, getWorkers, getTableWorkers, editWorker, newWorker, deleteWorker, setOptionsMonths, changeHoliday, setHolidays, setHolidayMonths, openHolidayTable, changeHolidayTable, openHolidayEach, changeHolidayEach, openGraphOptions, openGraph, checkOffice, setGraphMonths, openOverviewOptions, setOverviewYears, setOverviewMonths, openOverviewTable, reloadPage, printTable, deleteEntry, updateDailyTotal, checkRowHO, openOverviewTableWithColors, editOverviewTableWithColors, changeOverviewCell */

function reloadPage() {

	"use strict";
	location.reload();
}

function setOptionsOptions() {

	"use strict";
	setOptionsPersons();
	setGraphPersons();
	setGraphYears();
	setOptionsYears();
	setHolidayYears(); // Holiday Option: line 1029
	setOverviewYears();
} // executed onLoad

function setOptionsPersons() {

	"use strict";

	var parameters = {
		"function" : "getPeople",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'POST',
		success:  function (response) {
			$("#selectperson").html(response);
			var arr = JSON.parse(response);
			var select = document.getElementById("selectperson");
			$("#selectperson").empty();
			select.options[0] = new Option('Select name...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setGraphPersons() {

	"use strict";

	var parameters = {
		"function" : "getPeople",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectGraphPerson");

			$("#selectGraphPerson").empty();

			select.options[0] = new Option('Select name...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			select.options[1] = new Option('Office', 'Office');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setOptionsYears() {

	"use strict";

	var parameters = {
		"function" : "getYears",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectyear");

			$("#selectyear").empty();

			select.options[0] = new Option('Select year...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setGraphYears() {

	"use strict";

	var parameters = {
		"function" : "getYears",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectGraphYear");

			$("#selectGraphYear").empty();

			select.options[0] = new Option('Select year...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setStaffYears() {

	"use strict";

	var parameters = {
		"function" : "getYears",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectStaffYear");
			$("#selectStaffYear").empty();
			select.options[0] = new Option('Select year...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
			$("#selectStaffYear").css("display", "flex");
		}
	});
}

function setOptionsMonths() {

	"use strict";

	var parameters = {
		"function" : "getMonths",
		"year": getYear()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectmonth");

			$("#selectmonth").empty();

			select.options[0] = new Option('Select month...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setStaffMonths() {

	"use strict";

	var parameters = {
		"function" : "getMonths",
		"year": $('#selectStaffYear').find(":selected").text()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectStaffMonth");
			$("#selectStaffMonth").empty();
			select.options[0] = new Option('Select month...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
			$("#selectStaffMonth").css("display", "flex");
			$("#openDTTablebtn").css("display", "flex");
		}
	});
}

function setGraphMonths() {

	"use strict";

	var parameters = {
		"function" : "getMonths",
		"year": $('#selectGraphYear').find(":selected").text()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("selectGraphMonth");

			$("#selectGraphMonth").empty();

			select.options[0] = new Option('Select month...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			select.options[1] = new Option('All', 'All');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function getName() {

	"use strict";
	var selname = document.getElementById('selectperson');
	var name =  selname.options[selname.selectedIndex].text;
	return name;
}

function getYear() {

	"use strict";
	var selyear = document.getElementById('selectyear');
	var year = selyear.options[selyear.selectedIndex].text;
	return year;
}

function getMonth() {

	"use strict";
	var selmonth = document.getElementById('selectmonth');
	var month = selmonth.options[selmonth.selectedIndex].text;
	return month;
}

function openTable() {

	"use strict";
	var name = getName();
	if (name !== null && name !== "Select name...") { name = true; } else { name = false; }
	if (name && getMonth()) {

		var parameters = {
			"function" : "openTable",
			"name" : getName(),
			"year" : getYear(),
			"month" : getMonth()
		};

		$.ajax({
			data: parameters,
			url:   'php/ajaxFunctions.php',
			type:  'post',
			success:  function (response) {
				//console.log(response);
				$("#overview").css("display", "none");
				$("#newmonth").css("display", "none");
				$("#settings").css("display", "none");
				$("#tabheaderhours").css("display", "flex");
				$("#workers").css("display", "none");
				$("#dttable").css("display", "none");
				$("#staff").css("display", "none");
				$("#graphs").css("display", "none");
				$("#setHolidays").css("display", "none");
				$("#totals").css("display", "flex");
				$("#warning").css("display", "flex");
				$("#table").css("display", "flex");
				$("#totals").css("display", "block");
				$("#table").html(response);
				getTotals();
				checkDoubleEntries();
			}
		});
	}
}

function printTable() {

	"use strict";
	var newWin= window.open("");
	var table;
	if ($("#table").css("display") === "flex") {
		table = formatTable(document.getElementById('table').children[0].cloneNode(true));
		newWin.document.write(getName());
		newWin.document.write("<br><br>");
		newWin.document.write(table.outerHTML);
		table.deleteRow(0);
		newWin.document.write("<br><br>");
		newWin.document.write("Daily Total to do: " + $("#dailytotal").val() + "<br>");
		newWin.document.write("Working days: " + $("#totaldays").val() + "<br>");
		newWin.document.write("Total done: " + $("#totaldone").val() + "<br>");
		newWin.document.write("+/- hours this month: " + $("#pmnow").val() + "<br>");
		newWin.document.write("+/- hours previous: " + $("#pmprev").val() + "<br>");
		newWin.document.write("+/- hours total: " + $("#pm").val() + "<br>");
		newWin.document.write("Holidays taken/to take: " + $("#holidaystaken").val() + "<br>");
		newWin.document.write("HO sum/in WD/WD%: " + $("#homeoffice").val() + "<br>");
		newWin.print();
		newWin.close();

	} else if ($("#overviewTable").css("display") === "flex") {
		table = formatOverviewTable(document.getElementById('overviewTable').children[0].cloneNode(true));
		newWin.document.write($("#overviewTitle").html() + "<br><br>");
		newWin.document.write(table.outerHTML);
		table.deleteRow(0);
		newWin.print();
		newWin.close();
	}
}

function formatTable(table) {

	"use strict";
	table.insertRow(0);
	table.rows[0].innerHTML = "<tr style=><th style='width:6%'>Day</th><th style='width:12.5%'>Date</th><th style='width:10%'>Start</th><th style='width:10%'>End</th><th style='width:10%'>Break</th><th style='width:10%'>Sum</th><th style='width:7%'>HO</th><th style='width:7%'>Work</th><th style='width:7%'>Holiday</th><th style='width:7%'>Sick</th><th style='width:14.5%'>Comment</th></tr>";

	for (var i = 1; i < table.rows.length; i++) { // Remove inputs
		for (var j = 2; j < 5; j++) {
			if (table.rows[i].cells[j].children.length !== 1) {
				table.rows[i].cells[j].children[0].innerHTML = table.rows[i].cells[j].children[0].value;
				table.rows[i].cells[j].children[1].innerHTML = table.rows[i].cells[j].children[1].value;
			} else {
				table.rows[i].cells[j].innerHTML = table.rows[i].cells[j].children[0].value;
			}
		}
		table.rows[i].cells[11].innerHTML = table.rows[i].cells[11].children[0].value;
	}

	for (var m = 0; m < table.rows.length; m++) {
		for (var n = 0; n < table.rows[m].cells.length; n++) {
			table.rows[m].cells[n].style.border = "0.5px solid #000";
			table.rows[m].cells[n].style.textAlign = "center";
		}
	}
	table.style.borderCollapse = "collapse";
	return table;
}

function formatOverviewTable(table) {

	"use strict";
	table.insertRow(0);
	table.rows[0].innerHTML = $("#tabHeaderOverview").children(0).html();

	for (var m = 0; m < table.rows.length; m++) {
		for (var n = 0; n < table.rows[m].cells.length; n++) {
			table.rows[m].cells[n].style.border = "0.5px solid #000";
			table.rows[m].cells[n].style.textAlign = "center";
		}
	}
	table.style.borderCollapse = "collapse";
	return table;
}

function checkDoubleEntries() {

	"use strict";

	var table = document.getElementById('table').children[0];

	for (var i = 1; i < table.rows.length; i++) { // Iterate over days
		//Modify double entries
		if (table.rows[i].cells[1].innerHTML === table.rows[i-1].cells[1].innerHTML) { // Same dates in consecutive rows

			for (var j = 0; j < 11; j++) { // Iterate over cells

				table.rows[i-1].style.height = "44px";

				if ((j > 1 && j < 5) || j === 10) { // Hours(except sum) & comment
					table.rows[i-1].cells[j].innerHTML = "<table><tr>"+table.rows[i-1].cells[j].innerHTML+"</tr><tr>"+table.rows[i].cells[j].innerHTML+"</tr></table>";
				}
			}
			table.rows[i-1].cells[5].innerHTML = "<table><tr>"+table.rows[i-1].cells[5].innerHTML+"</tr><br><tr>"+table.rows[i].cells[5].innerHTML+"</tr></table>";
			table.rows[i-1].cells[6].innerHTML = "<table><tr>"+table.rows[i-1].cells[6].innerHTML+"</tr><br><tr>"+table.rows[i].cells[6].innerHTML+"</tr></table>";
			table.rows[i-1].cells[7].innerHTML = "<table><tr>"+table.rows[i-1].cells[7].innerHTML+"</tr><br><tr>"+table.rows[i].cells[7].innerHTML+"</tr></table>";
			table.deleteRow(i);
			i--;
		}
	}

	for (i = 0; i < table.rows.length; i++) { // Change color of non-work days and holidays

		if (table.rows[i].cells[7].innerHTML === '0') { // Work
			table.rows[i].style.backgroundColor = "#F5A399";
			table.rows[i].cells[8].innerHTML = '0';

		} else if (table.rows[i].cells[9].innerHTML === '1') { // Sick
			table.rows[i].cells[7].innerHTML = '0'; // Work
			table.rows[i].style.backgroundColor = "#61E99A";

		} else if (table.rows[i].cells[9].innerHTML === '0.5') { // Half-Sick
			table.rows[i].cells[7].innerHTML = '0.5'; // Work
			table.rows[i].style.backgroundColor = "#61E99A";

		} else if (table.rows[i].cells[8].innerHTML === '1') { // Holiday
			table.rows[i].cells[7].innerHTML = '0'; // Work
			table.rows[i].style.backgroundColor = "#61A5E9";

		} else if (table.rows[i].cells[8].innerHTML === '0.5') { // Half-Holiday
			table.rows[i].cells[7].innerHTML = '0.5'; // Work
			table.rows[i].style.backgroundColor = "#61A5E9";

		} else if (table.rows[i].cells[8].innerHTML === '0.5' && table.rows[i].cells[10].innerHTML === '0.5') {
			table.rows[i].cells[7].innerHTML = '0'; // Work
			table.rows[i].style.backgroundColor = "#F5A399";

		} else if (table.rows[i].cells[8].innerHTML === '0.33') { // Public Holiday
			table.rows[i].cells[7].innerHTML = '0';
			table.rows[i].cells[8].innerHTML = '0';
			table.rows[i].style.backgroundColor = "#F5A399";
		}
	}
}

function getTotals() {

	"use strict";
	getDailyTotal();
	getTotalDone();
	getPMPrev();
	getPMNow();
	getPMTotal();
	getHolidaysTaken();
	getTotalDays();
	getMonthlyTotal();
	getHomeOffice();
}

function getTotalDone() {

	"use strict";
	//console.log('In getTotalDone');
	var name = getName();
	var year = getYear();
	var month = getMonth();
	//console.log(name, year, month);

	var parameters = {
		"function" : "getTotalDone",
		"name" : name,
		"year" : year,
		"month" : month
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log('Successful');
			$("#totaldone").val(response);
		}
	});

}

function getDailyTotal() {

	"use strict";

	var parameters = {
		"function" : "getDailyTotal",
		"name" : getName(),
		"year" : getYear(),
		"month" : getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			$("#dailytotal").val(response);
		}
	});
}

function updateDailyTotal(click) {
	"use strict";
	var parameters = {
		"function": "updateDailyTotal",
		"name": click.cells[0].innerHTML,
		"dt": click.cells[1].children[0].value,
		"tablemonth": click.id,
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
	});
}

function getPMPrev() {

	"use strict";

	var parameters = {
		"function" : "getPMPrev",
		"name" : getName(),
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			$("#pmprev").val(response);
		}
	});

}

function getPMNow() {

	"use strict";

	var parameters = {
		"function": "getPMNow",
		"name": getName(),
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#pmnow").val(response);
		}
	});
}

function getHomeOffice() {

	"use strict";
	var parameters = {
		"function": "getHomeOffice",
		"name": getName(),
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#homeoffice").val(response);
		}
	});
}

function getTotalDays() {

	"use strict";

	var parameters = {
		"function": "getWorkingDays",
		"name": getName(),
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#totaldays").val(response);
		}
	});
}

function getMonthlyTotal() {

	"use strict";

	var parameters = {
		"function": "getMonthlyToDo",
		"name": getName(),
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#monthlytotal").val(response);
		}
	});
}

function callbackPMPrev(callback) {

	"use strict";
	//console.log('In getPMPrev');

	var parameters = {
		"function" : "getPMPrev",
		"name" : getName(),
		"year" : getYear(),
		"month" : getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  callback
	});

}

function callbackPMNow(callback) {

	"use strict";
	//console.log('In getPMNow');
	var name = getName();
	var year = getYear();
	var month = getMonth();
	//console.log(name);

	var parameters = {
		"function": "getPMNow",
		"name": name,
		"year": year,
		"month": month
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  callback
	});
}

function getPMTotal() {

	"use strict";
	function prevcallback(prev) {
		function nowcallback(now) {
			//console.log(prev, now);

			var parameters = {
				"function": "getPMTotal",
				"prev": prev,
				"now": now
			};

			$.ajax({
				data: parameters,
				url:   'php/ajaxFunctions.php',
				type:  'post',
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
				},
				beforeSend: function() {
					//console.log('Processing...');
				},
				success:  function (response) {
					//console.log(response);
					$("#pm").val(response);
				}
			});
		}
		callbackPMNow(nowcallback);
	}
	callbackPMPrev(prevcallback);
}

function getHolidaysTaken() {

	"use strict";

	var parameters = {
		"function": "getHolidaysTaken",
		"name": getName(),
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#holidaystaken").val(response);
		}
	});
}

function checkRowHO(span) {

	"use strict";
	if (span.innerHTML === '0') {
		span.innerHTML = '1';
	} else {span.innerHTML = '0'; }
	return checkRow(span.parentNode);
}

function checkRow(cell) {

	"use strict";
	var date = cell.parentNode.cells[1];
	var len = getNrEntries(cell.parentNode);
	//console.log("Nr. of entries is "+len);
	for (var i = 0; i < len; i++) {

		var start = checkHour(cell.parentNode.cells[2].children[i].value);
		if (!start) {
			window.alert('Wrong "Start" hour! "' + start + '" will not be saved. Reload the page to see the saved value, or modify the hour you have just written');
		}

		var end = checkHour(cell.parentNode.cells[3].children[i].value);
		if (!end) {
			window.alert('Wrong "End" hour! "' + end + '" will not be saved. Reload the page to see the saved value, or modify the hour you have just written');
		}

		var pause = checkHour(cell.parentNode.cells[4].children[i].value);
		if (!pause) {
			window.alert('Wrong "Break" hour! "' + pause + '" will not be saved. Reload the page to see the saved value, or modify the hour you have just written');
		}
		var ho = cell.parentNode.cells[6].children[2*i].innerHTML;
		if (start && end && pause && ho) {
			//console.log('Into checkExistence with i = '+i);
			checkExistence(date.innerHTML, i, start, end, pause, ho); // Row doesn't exist and must be created
		}
	}
}

function getNrEntries(row) {

	"use strict";
	var start = row.cells[2];
	if (start.children.length === 1) { return 1; } else {return 2;}
}

function existingRow(start, end, pause, id, ho) {

	"use strict";

	var parameters = {
		"function": "existingRow",
		"name": getName(),
		"start": start,
		"end": end,
		"pause": pause,
		"id": id,
		"ho" : ho,
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			if (response) {
				console.log('Row updated');
				openTable();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}
		}
	});
}

function newRow(date, start, end, pause, ho) {

	"use strict";

	var parameters = {
		"function": "newRow",
		"name": getName(),
		"date": date,
		"start": start,
		"end": end,
		"pause": pause,
		"ho" : ho,
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			console.log(response);
			if (response) {
				console.log('New row saved');
				openTable();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}
		}
	});
}

function checkHour(hour) {

	"use strict";
	if (hour.length !== 8 || hour[0] > 2 || (hour[0] == '2' && hour[1] > 4)) { // Wrong length, 24h format
		return false;
	}

	for (var i = 0; i < hour.length; i++) {

		if ([3,6].includes(i)) { // check first digits of minutes and seconds
			if (hour[i] > 6) {
				return false;
			}

		} else if ([2,5].includes(i)) { // check colons
			if (hour[i] !== ':') {
				return false;
			}
		} else {
			if (isNaN(parseInt(hour[i]))) { // if not number
				return false;
			}
		}
  }
	return hour;
}

function checkExistence(date, i, start, end, pause, ho) {

	"use strict";

	var parameters = {
		"function": "rowExists",
		"name": getName(),
		"date": date,
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);

			if (arr.length === 0) {
				return newRow(date, start, end, pause, ho);
			} else if (arr.length === 1) {
				if (i === 0) {
					return existingRow(start, end, pause, arr[0], ho);
				} else {
					return newRow(date, start, end, pause, ho);
				}
			} else { // arr = 2
				if (i === 0) {
					return existingRow(start, end, pause, arr[0], ho);
				} else {
					return existingRow(start, end, pause, arr[1], ho);
				}
			}
		}
	});
}

function newEntry(date) { //create another entry, in case someone works twice in the same day

	"use strict";

	var row = document.getElementById(date.innerHTML);
	if (row.style.height === "44px") { return; }
	row.style.height = "44px";

	for (var i = 2; i < 5; i++) { // split start, pause, end and HO cells
		row.cells[i].innerHTML = "<table><tr>"+row.cells[i].innerHTML+"</tr><tr><input class='invinput' value='00:00:00'></tr></table>";
	}
	row.cells[7].innerHTML = "<table><tr>"+row.cells[7].innerHTML+"</tr><br><tr><span>0</span></tr><table>";
	row.cells[6].innerHTML = "<table><tr>"+row.cells[6].innerHTML+"</tr><br><tr><span>0</span></tr><table>";
	row.cells[5].innerHTML = "<table><tr>"+row.cells[5].innerHTML+"</tr><br><tr>00:00:00</tr><table>";
}

function deleteEntry(day) {
	"use strict";
	var row = day.parentNode;
	if (row.cells[2].childElementCount > 1) {
		console.log('Delete 2nd entry');
		var parameters = {
			"function" : "deleteEntry",
			"date" : row.id,
			"name" : getName()
		};

		$.ajax({
			data: parameters,
			url:   'php/ajaxFunctions.php',
			type:  'post',
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(thrownError);
			},
			beforeSend: function() {
				//console.log('Processing...');
			},
			success:  function (response) {
				console.log(response);
				openTable();
			}
		});
	} else {
		window.alert('There must be at least one entry per day!');
	}
}

function openSettings() {
	"use strict";
	var pw = prompt("Password: ", "");
	if (pw === "") {
		$("#overview").css("display", "none");
		$("#newmonth").css("display", "none");
		$("#tabheaderhours").css("display", "none");
		$("#workers").css("display", "none");
		$("#graphs").css("display", "none");
		$("#setHolidays").css("display", "none");
		$("#warning").css("display", "none");
		$("#table").css("display", "none");
		$("#totals").css("display", "none");
		$("#settings").css("display", "flex");
	} else {
		window.alert("Wrong password!");
	}
}

function newMonth() {

	"use strict";
	$("#overview").css("display", "none");
	$("#tabheaderhours").css("display", "none");
	$("#workers").css("display", "none");
	$("#graphs").css("display", "none");
	$("#setHolidays").css("display", "none");
	$("#warning").css("display", "none");
	$("#table").css("display", "none");
	$("#settings").css("display", "none");
	$("#totals").css("display", "none");
	$("#newmonth").css("display", "flex");
}

function createMonth() {

	"use strict";

	var parameters = {
		"function" : "createMonth",
		"year" : $("#yearnew").val(),
		"month" : $("#monthnew").val(),
		"firstday": $("#firstday").val(),
		"lastday": $("#lastday").val()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			if (response) {
				window.alert('New Month successfully created!');
				setOptionsYears();
			} else {
				window.alert('Month has already been saved before.');
			}
		}
	});
}

function changeSick(click) {

	"use strict";

	var row = click.parentNode;

	if (row.style.backgroundColor === "rgb(245, 163, 153)" && row.cells[8].innerHTML === '0') {
		return;
	} else if (row.cells[0].innerHTML === "Sat" || row.cells[0].innerHTML === "Sun") {
		return;
	}

	var sick;
	if (row.cells[9].innerHTML === '0') {
		sick = '0.5';
	} else if (row.cells[9].innerHTML === '0.5') {
		sick = '1';
	} else {
		sick = '0';
	}
	console.log(sick);
	var parameters = {
		"function": "saveSick",
		"name": getName(),
		"sick": sick,
		"id": row.id,
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			if (response) {
				//console.log('Change in Sick saved');
				openTable();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}
		}
	});
}

function changeHoliday(click) {

	"use strict";

	var row = click.parentNode;

	if (row.style.backgroundColor === "rgb(245, 163, 153)" && row.cells[8].innerHTML === '0') {
		return;
	} else if (row.cells[0].innerHTML === "Sat" || row.cells[0].innerHTML === "Sun") {
		return;
	} else {

		var holiday;
		if (row.cells[8].innerHTML === '0') {
			holiday = '0.5';
		} else if (row.cells[9].innerHTML === '0.5') {
			holiday = '1';
		} else {
			holiday = '0';
		}
		//console.log(holiday);
		var parameters = {
			"function": "saveHoliday",
			"name": getName(),
			"holiday": holiday,
			"year": getYear(),
			"month": getMonth()
		};

		$.ajax({
			data: parameters,
			url:   'php/ajaxFunctions.php',
			type:  'post',
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(thrownError);
			},
			beforeSend: function() {
				//console.log('Processing...');
			},
			success:  function (response) {
				console.log(response);
				if (response) {
					//console.log('Change in Holiday saved');
					openTable();
				} else {
					window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
				}
			}
		});
	}
}

function changeComment(click) {

	"use strict";

	var parameters = {
		"function": "saveComment",
		"name": getName(),
		"comment": click.value,
		"date": click.parentNode.parentNode.id,
		"year": getYear(),
		"month": getMonth()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			console.log(response);
			if (response) {
				console.log('Change in Comment saved');
				openTable();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}
		}
	});
}

function openStaffOptions() {
	"use strict";
	$("#settings").css("display", "none");
	$("#staff").css("display", "flex");
}

function getTableWorkers() {
	"use strict";
	var parameters = {
		"function" : "getTableWorkers"
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			$("#staff").css("display", "none");
			$("#workers").css("display", "flex");
			$("#tableworkers").css("display", "flex").html(response);
		}
	});
}

function openDTTable() {
	"use strict";
	var year = $('#selectStaffYear').find(":selected").text();
	var month = $('#selectStaffMonth').find(":selected").text();

	var parameters = {
		"function" : "openDTTable",
		"year" : year,
		"month" : month
	}

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			$("#staff").css("display", "none");
			$("#dttable").css("display", "flex");
			$("#dttable_title").css("display", "flex").html(month + " " + year);
			$("#dttable_table").css("display", "flex").html(response);
		}
	});
}

function editWorker(row) {
	"use strict";
	//console.log(row.cells[0].children[0].value, row.id);
	var parameters = {
		"function" : "editWorker",
		"id": row.id,
		"name" : row.cells[0].children[0].value
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			if (response) {
				//console.log('Worker edited successfully');
				getTableWorkers();
				setOptionsPersons();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}

		}
	});
}

function newWorker() {
	"use strict";
	var parameters = {
		"function" : "newWorker",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function () {
			getTableWorkers();
			setOptionsPersons();
		}
	});
}

function deleteWorker(click) {
	"use strict";
	var parameters = {
		"function" : "deleteWorker",
		"id": click.parentNode.parentNode.id,
		"name": click.parentNode.parentNode.cells[0].children[0].value
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function () {
			getTableWorkers();
			setOptionsPersons();
		}
	});
}

function setHolidays() {

	"use strict";
	$("#overview").css("display", "none");
	$("#newmonth").css("display", "none");
	$("#settings").css("display", "none");
	$("#tabheaderhours").css("display", "none");
	$("#totals").css("display", "none");
	$("#warning").css("display", "none");
	$("#table").css("display", "none");
	$("#workers").css("display", "none");
	$("#graphs").css("display", "none");
	$("#chosenHoliday").css("display", "none");
	$("#holidayOptions").css("display", "none");
	$("#setHolidays").css("display", "flex");
	$("#holidayOptions").css("display", "flex");
}

function setHolidayYears() {

	"use strict";

	var parameters = {
		"function" : "getYears",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("holidayYear");

			$("#holidayYear").empty();

			select.options[0] = new Option('Select year...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setHolidayMonths() {

	"use strict";
	var selyear = document.getElementById('holidayYear');
	var year = selyear.options[selyear.selectedIndex].text;

	var parameters = {
		"function" : "getMonths",
		"year": year
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("holidayMonth");

			$("#holidayMonth").empty();

			select.options[0] = new Option('Select month...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function openHolidayTable() {

	"use strict";
	var selyear = document.getElementById('holidayYear');
	var year = selyear.options[selyear.selectedIndex].text;
	var selmonth = document.getElementById('holidayMonth');
	var month = selmonth.options[selmonth.selectedIndex].text;

	var parameters = {
		"function" : "openHolidayTable",
		"year": year,
		"month": month
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#holidayOptions").css("display", "none");
			$("#chosenHoliday").css("display", "flex");
			$("#tabheaderholiday").css("display", "flex");
			$("#tabheaderholiday3").css("display", "none");
			$("#tableholiday").css("display", "flex");
			$("#tableholiday").html(response);
			editHolidayTable();
		}
	});

}

function editHolidayTable() {

	"use strict";

	var table = document.getElementById('tableholiday').children[0];
	var weekend = ["Sat", "Sun"];
	for (var i = 0; i < table.rows.length; i++) {
		//Change color of non-work days and holidays
		if (table.rows[i].cells[2].innerHTML === '1' || $.inArray(table.rows[i].cells[0].innerHTML, weekend) >= 0) {
			table.rows[i].style.backgroundColor = "#F5A399";

		} else if (table.rows[i].cells[2].innerHTML === '0.5') {
			table.rows[i].style.backgroundColor = "#C29179";
		}
	}
}

function changeHolidayTable(click) {
	"use strict";
	var row = click.parentNode;
	var holiday;
	if (row.cells[2].innerHTML === '0') {
		holiday = 'TRUE';
	} else {
		holiday = 'FALSE';
	}

	var parameters = {
		"function": "saveHolidayTable",
		"holiday": holiday,
		"id": row.id
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			//console.log(response);
			if (response) {
				console.log('Change in Holiday Table saved');
				openHolidayTable();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}
		}
	});
}

function openHolidayEach() {

	"use strict";

	var parameters = {
		"function" : "openHolidayEach",
		"year": $('#holidayYear').find(":selected").text()
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#holidayOptions").css("display", "none");
			$("#chosenHoliday").css("display", "flex");
			$("#tabheaderholiday").css("display", "none");
			$("#tabheaderholiday3").css("display", "flex");
			$("#tableholiday").css("display", "flex");
			$("#tableholiday").html(response);
		}
	});

}

function changeHolidayEach(click) {

	"use strict";
	var row = click.parentNode.parentNode;
	var parameters = {
		"function": "saveHolidayEach",
		"year": row.id,
		"name": row.cells[0].innerHTML,
		"holidays": row.cells[1].children[0].value,
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			if (response) {
				console.log('Change in Holiday-Each saved');
				openHolidayEach();
			} else {
				window.alert('Changes couldn\'t be saved. Contact the developer if the error persists');
			}
		}
	});
}

function openGraphOptions() {

	"use strict";
	$("#overview").css("display", "none");
	$("#newmonth").css("display", "none");
	$("#tabheaderhours").css("display", "none");
	$("#workers").css("display", "none");
	$("#setHolidays").css("display", "none");
	$("#warning").css("display", "none");
	$("#table").css("display", "none");
	$("#totals").css("display", "none");
	$("#settings").css("display", "none");
	$("#graphs").css("display", "flex");
}

function checkOffice() {

	"use strict";
	var name = $('#selectGraphPerson').find(":selected").text();
	if (name === 'Office') {
		$('#goGraph').css('top', '50%');
		$('#selectGraphMonth').css('display', 'flex');
	}
}

function openGraph() {

	"use strict";
	$("#graphOptions").css("display", "none");
	$("#graph").css("display", "flex");
	var mode = $('#selectGraphMode').find(":selected").text();
	var name = $('#selectGraphPerson').find(":selected").text();
	var year = $('#selectGraphYear').find(":selected").text();

	if (mode === 'Home Office') {
		return openHOGraph(name, year);
	}

	var chart = document.getElementById('graph');
	var myChart = echarts.init(chart);

	if (name !== 'Office') {

		var parameters = {
			"function" : "openGraph",
			"name" : name,
			"year" : year
		};

		$.ajax({
			data: parameters,
			url:   'php/ajaxFunctions.php',
			type:  'post',
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(thrownError);
			},
			beforeSend: function() {
				//console.log('Processing...');
			},
			success:  function (response) {
				console.log(response);
				var data = JSON.parse(response);
				console.log(data);
				var option = {
					grid: {
						backgroundColor: '#fff',
						show: true
					},
					title: {
						text: name+' '+year
					},
					tooltip: { },
					legend: {
						data: [ 'Working', '+/-', 'Illness', 'Holiday' ],
					},
					xAxis: {
						type: 'category',
						data: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Total(9h)", "Total(WD)"],
						name: 'Month',
						axisLabel: {
							interval: 0,
							rotate: 30,
							backgroundColor: '#fff'
						}
					},
					yAxis: {
						type: 'value',
						name: 'Hours'
					},
					series: [{
						name: 'Working',
						type: 'bar',
						color: '#FFB100',
						data: data[0],
						stack: 'first',
						label: {
							show: true
						}
					},
					{
						name: '+/-',
						type: 'bar',
						color: '#B27C00',
						data: data[1],
						stack: 'first',
						label: {
							show: true
						}
					},
					{
						name: 'Illness',
						type: 'bar',
						color: '#2DE90A',
						data: data[2],
						stack: 'second',
						label: {
							show: true
						}
					},
					{
						name: 'Holiday',
						type: 'bar',
						color: '#4A6CB2',
						data: data[3],
						stack: 'second',
						label: {
							show: true
						}
					}]
				};
				myChart.setOption(option);
			}
		});
	} else {
		var month = $('#selectGraphMonth').find(":selected").text();
		if (month !== 'All') {
			var parameters = {
				"function" : "openGeneralMonthGraph",
				"year" : year,
				"month" : month
			};

			$.ajax({
				data: parameters,
				url:   'php/ajaxFunctions.php',
				type:  'post',
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
				},
				beforeSend: function() {
					//console.log('Processing...');
				},
				success:  function (response) {
					console.log(response);
					var data = JSON.parse(response);
					console.log(data);

					var option = {
						grid: {
							backgroundColor: '#fff',
							show: true
						},
						title: {
							text: month+' '+year
						},
						tooltip: { },
						legend: {
							data: [ 'Working', '+/-', 'Illness', 'Holiday' ],
						},
						xAxis: {
							type: 'category',
							data: data[0],
							name: 'Workers',
							axisLabel: {
								interval: 0,
								rotate: 30,
								backgroundColor: '#fff'
							}
						},
						yAxis: {
							type: 'value',
							name: 'Hours'
						},
						series: [{
							name: 'Working',
							type: 'bar',
							color: '#FFB100',
							data: data[1],
							stack: 'first',
							label: {
								show: true
							}
						},
						{
							name: '+/-',
							type: 'bar',
							color: '#B27C00',
							data: data[2],
							stack: 'first',
							label: {
								show: true
							}
						},
						{
							name: 'Illness',
							type: 'bar',
							color: '#2DE90A',
							data: data[3],
							stack: 'second',
							label: {
								show: true
							}
						},
						{
							name: 'Holiday',
							type: 'bar',
							color: '#4A6CB2',
							data: data[4],
							stack: 'second',
							label: {
								show: true
							}
						}]
					};
					myChart.setOption(option);
				}
			});
		} else {
			var parameters = {
				"function" : "openGeneralYearGraph",
				"year" : year
			};

			$.ajax({
				data: parameters,
				url:   'php/ajaxFunctions.php',
				type:  'post',
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
				},
				beforeSend: function() {
					//console.log('Processing...');
				},
				success:  function (response) {
					//console.log(response);
					var data = JSON.parse(response);
					//console.log(data);

					var option = {
						grid: {
							backgroundColor: '#fff',
							show: true
						},
						title: {
							text: name+' '+year
						},
						tooltip: { },
						legend: {
							data: [ 'Working', '+/-', 'Illness', 'Holiday' ],
						},
						xAxis: {
							type: 'category',
							data: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Total(Days)"],
							name: 'Month',
							axisLabel: {
								interval: 0,
								rotate: 30,
								backgroundColor: '#fff'
							}},
						yAxis: {
							type: 'value',
							name: 'Hours'
						},
						series: [{
							name: 'Working',
							type: 'bar',
							color: '#FFB100',
							data: data[0],
							stack: 'first',
							label: {
								show: true
							}
						},
						{
							name: '+/-',
							type: 'bar',
							color: '#B27C00',
							data: data[1],
							stack: 'first',
							label: {
								show: true
							}
						},
						{
							name: 'Illness',
							type: 'bar',
							color: '#2DE90A',
							data: data[2],
							stack: 'second',
							label: {
								show: true
							}
						},
						{
							name: 'Holiday',
							type: 'bar',
							color: '#4A6CB2',
							data: data[3],
							stack: 'second',
							label: {
								show: true
							}
						}]
					};
					myChart.setOption(option);
				}
			});
		}
	}
}

function openHOGraph(name, year) {

	"use strict";

	var chart = document.getElementById('graph');
	var myChart = echarts.init(chart);


	if (name !== 'Office') {

		var parameters = {
			"function" : "openHOGraph",
			"name" : name,
			"year" : year
		};

		$.ajax({
			data: parameters,
			url:   'php/ajaxFunctions.php',
			type:  'post',
			error: function (xhr, ajaxOptions, thrownError) {
				console.log(xhr.status);
				console.log(thrownError);
			},
			beforeSend: function() {
				//console.log('Processing...');
			},
			success:  function (response) {
				var data = JSON.parse(response);
				//console.log(data);
				var option = {
					grid: {
						backgroundColor: '#fff',
						show: true
					},
					title: {
						text: name+' '+year
					},
					tooltip: { },
					legend: {
						data: [ 'Home Office' ],
					},
					xAxis: {
						type: 'category',
						data: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Total(Days)"],
						name: 'Month',
							axisLabel: {
								interval: 0,
								rotate: 30,
								backgroundColor: '#fff'
							}},
					yAxis: {
						type: 'value',
						name: 'Hours'
					},
					series: [{
						name: 'Home Office',
						type: 'bar',
						color: '#FFB100',
						data: data,
						label: {
							show: true
						}
					}]
				};
				myChart.setOption(option);
			}
		});
	} else {
		var month = $('#selectGraphMonth').find(":selected").text();
		if (month !== 'All') {
			var parameters = {
				"function" : "openGeneralMonthHOGraph",
				"year" : year,
				"month" : month
			};

			$.ajax({
				data: parameters,
				url:   'php/ajaxFunctions.php',
				type:  'post',
				error: function (xhr, ajaxOptions, thrownError) {
					console.log(xhr.status);
					console.log(thrownError);
				},
				beforeSend: function() {
					//console.log('Processing...');
				},
				success:  function (response) {
					var data = JSON.parse(response);
					//console.log(data);

					var option = {
						grid: {
							backgroundColor: '#fff',
							show: true
						},
						title: {
							text: month+' '+year
						},
						tooltip: { },
						legend: {
							data: [ 'Home Office' ],
						},
						xAxis: {
							type: 'category',
							data: data[0],
							name: 'Workers',
							axisLabel: {
								interval: 0,
								rotate: 30,
								backgroundColor: '#fff'
							}},
						yAxis: {
							type: 'value',
							name: 'Hours'
						},
						series: [{
							name: 'Home Office',
							type: 'bar',
							color: '#FFB100',
							data: data[1],
							label: {
								show: true
							}
						}]
					};
					myChart.setOption(option);
				}
			});

		} else {
			window.alert("Choose a month!");
			$("#graphOptions").css("display", "flex");
			$("#graph").css("display", "none");
			return;
		}
	}
}

function openOverviewOptions() {

	"use strict";
	$("#overview").css("display", "flex");
	$("#settings").css("display", "none");
}

function setOverviewYears() {

	"use strict";

	var parameters = {
		"function" : "getYears",
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("overviewYear");

			$("#overviewYear").empty();

			select.options[0] = new Option('Select year...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function setOverviewMonths() {

	"use strict";
	var selyear = document.getElementById('overviewYear');
	var year = selyear.options[selyear.selectedIndex].text;

	var parameters = {
		"function" : "getMonths",
		"year": year
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			var arr = JSON.parse(response);
			var select = document.getElementById("overviewMonth");

			$("#overviewMonth").empty();

			select.options[0] = new Option('Select month...', null);
			select.options[0].disabled = true;
			select.options[0].classList.add('placeholder');
			for (var i = 0; i < arr.length; i++) {
				select.options[select.options.length] = new Option(arr[i], arr[i]);
			}
		}
	});
}

function openOverviewTableWithColors() {

	"use strict";
	getOverviewHeader();
	var opt;
	var sumhalf;
	var sumfull;
	if ($('#overviewOption').find(":selected").text() === "Sick days") {
		opt = "illness";
		sumhalf = 3.5;
		sumfull = 3;
	} else {
		opt = "selfholiday";
		sumhalf = 2.5;
		sumfull = 2;
	}
	var parameters = {
		"function" : "openOverviewTable",
		"year": $('#overviewYear').find(":selected").text(),
		"month": $('#overviewMonth').find(":selected").text(),
		"option": opt,
		"sumhalf": sumhalf,
		"sumfull": sumfull
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#overviewOptions").css("display", "none");
			$("#overviewTable").css("display", "flex");
			$("#overviewTable").html(response);
			editOverviewTable();
		}
	});
}

function openOverviewTable() {

	"use strict";
	getOverviewHeader();
	var opt;
	if ($('#overviewOption').find(":selected").text() === "Sick days") {
		opt = "illness";
	} else {
		opt = "selfholiday";
	}
	var parameters = {
		"function" : "openOverviewTable",
		"year": $('#overviewYear').find(":selected").text(),
		"month": $('#overviewMonth').find(":selected").text(),
		"option": opt,
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		success:  function (response) {
			console.log(response);
			$("#overviewOptions").css("display", "none");
			$("#overviewTable").css("display", "flex");
			$("#overviewTable").html(response);
			$("#overviewTitle").html($('#overviewOption').find(":selected").text());
			$("#overviewTitle").css("display", "flex");
			editOverviewTable();
		}
	});
}

function getOverviewHeader() {

	"use strict";
	var parameters = {
		"function" : "getOverviewHeader"
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			//console.log(response);
			$("#tabHeaderOverview").css("display", "flex");
			$("#tabHeaderOverview").html(response);
		}
	});
}

function editOverviewTableWithColors() {

	"use strict";
	var table = document.getElementById('overviewTable').children[0];
	var length = table.rows.length;
	var workers = table.rows[0].cells.length;
	for (var i = 0; i < length; i++) {
		for (var j = 2; j < workers; j++) {
			var cell = table.rows[i].cells[j];
			if (cell.innerHTML === '1') { // Holiday for all
				cell.style.backgroundColor = "#FF6676";
			} else if (cell.innerHTML === '1.5') { // Half-Holiday for all
				cell.style.backgroundColor = "#E952AC";
			} else if (cell.innerHTML === '2') { // Self-Holiday
				cell.style.backgroundColor = "#61A5E9";
			} else if (cell.innerHTML === '2.5') { // Half-Self-Holiday
				cell.style.backgroundColor = "#6ADCFF";
			} else if (cell.innerHTML === '3') { // Sick
				cell.style.backgroundColor = "#61E99A";
			} else if (cell.innerHTML === '3.5') { // Half-Sick
				cell.style.backgroundColor = "#CFFF6B";
			}else if (cell.innerHTML === '4') { // Half-Holiday for all + Half-Self-Holiday
				cell.style.backgroundColor = "#BF9243";
			}else if (cell.innerHTML === '5') { // Half-Holiday for all + Half-Sick
				cell.style.backgroundColor = "#7F612D";
			}else if (cell.innerHTML === '6') { // Half-Self-Holiday + Half-Sick
				cell.style.backgroundColor = "#FFC359";
			}
			cell.innerHTML = '';
		}
	}
}

function editOverviewTable() {

	"use strict";
	var table = document.getElementById('overviewTable').children[0];
	var length = table.rows.length;
	var workers = table.rows[0].cells.length;
	for (var i = 0; i < length-1; i++) {
		for (var j = 2; j < workers; j++) {
			var cell = table.rows[i].cells[j];
			if (cell.innerHTML === '2') { // Holiday for all
				cell.style.backgroundColor = "#f5a399";
				cell.innerHTML = '';
			} else if (cell.innerHTML === '1' || cell.innerHTML === '0.5') { // Holiday for all
				cell.style.backgroundColor = "#E9CFAF";
			}
		}
	}
	table.rows[length-1].style.backgroundColor = "#FFB100";
}

function changeOverviewCell(cell) {

	"use strict";
	var change;
	if (cell.innerHTML === '1') {
		change = '0';
	} else if (cell.innerHTML === '0') {
		change = '0.5';
	} else if (cell.innerHTML === '0.5') {
		change = '1';
	}

	var opt;
	if ($('#overviewOption').find(":selected").text() === "Sick days") { opt = "illness";
	} else { opt = "selfholiday"; }

	var parameters = {
		"function" : "changeOverviewCell",
		"date" : cell.parentNode.id,
		"name" : cell.id,
		"change" : change,
		"mode" : opt
	};

	$.ajax({
		data: parameters,
		url:   'php/ajaxFunctions.php',
		type:  'post',
		error: function (xhr, ajaxOptions, thrownError) {
			console.log(xhr.status);
			console.log(thrownError);
		},
		beforeSend: function() {
			//console.log('Processing...');
		},
		success:  function (response) {
			console.log(response);
			if (response) {
				openOverviewTable();
			} else {
				window.alert('Changes couldn\'t be saved');
			}
		}
	});
}
