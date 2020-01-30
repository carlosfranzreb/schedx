<?php

	require('core.php');
	switch ($_POST['function']) {

		case "getPeople":
			echo json_encode(getPeople());
			break;

		case "getYears":
			$years = [];
			$result = mysqli_query(getConnection(), "SELECT year FROM months GROUP BY year");
			while ($row = mysqli_fetch_array($result)) {
				array_push($years, $row['year']);
			}
			echo json_encode($years);
			break;

		case "getMonths":
			$months = [];
			$year = $_POST['year'];
			$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");
			while ($row = mysqli_fetch_array($result)) {
				array_push($months, $row['month']);
			}
			echo json_encode($months);
			break;

		case "openTable":
			$tablemonth = strtolower($_POST['month']).substr($_POST['year'], -2, 2);
			$tablename = getTableName($_POST['name']);
			$result = mysqli_query(getConnection(), "SELECT  $tablemonth.*, $tablename.start, $tablename.break, $tablename.end, $tablename.illness, $tablename.comment, $tablename.selfholiday, $tablename.home_office FROM $tablemonth LEFT JOIN $tablename ON $tablemonth.date = $tablename.date ORDER BY $tablemonth.id, $tablename.id");
			$string = "<table>";
			$workdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
			while ($row = mysqli_fetch_array($result)) {
				//echo $row['comment'];
				//Set sum, and others
				if ($row['start'] != 0) {
					$sum = substractTimes($row['end'], addTimes($row['start'], $row['break']));
				} else {
					$zero = '00:00:00';
					$sum = $zero;
					$row['start'] = $zero;
					$row['end'] = $zero;
					$row['break'] = $zero;
				}

				if (in_array($row['day'], $workdays)) { $workday = '1'; } else { $workday = '0'; } //Set workday
				if ($row['illness'] == null) { $sick = 0; } else { $sick = $row['illness']; } //Set sick
				if ($row['home_office'] == null) { $ho = 0; } else { $ho = $row['home_office']; } //Set HO

				//Set Holiday
				if ($row['holidays'] == '1') {
					$holiday = '0.33';
				} elseif (($row['selfholiday'] == '1') or ($row['holidays'] == '0.5' and $row['selfholiday'] == '0.5')) {
					$holiday = '1';
				} elseif ($row['holidays'] == '0.5' or $row['selfholiday'] == '0.5') {
					$holiday = '0.5';
				} else {
					$holiday = '0';
				}

				$string .= "<tr id = ".$row['date'].">
								<td style='width:6%; text-align: left;' onClick='deleteEntry(this)'>".shortenDay($row['day'])."</td>
								<td style='width:12.5%' onClick='newEntry(this)'>".$row['date']."</td>
								<td style='width:10%' onChange='checkRow(this)'><input class='invinput' value=".$row['start']."></td>
								<td style='width:10%' onChange='checkRow(this)'><input class='invinput' value=".$row['end']."></td>
								<td style='width:10%' onChange='checkRow(this)'><input class='invinput' value=".$row['break']."></td>
								<td style='width:10%'>".$sum."</td>
								<td style='width':7%'><span onClick='checkRowHO(this)'>".$ho."</span></td>
								<td style='width:7%'>".$workday."</td>
								<td style='width:7%'>".$holiday."</td>
								<td style='width:7%' onClick='changeSick(this)'>".$sick."</td>
								<td style='width:14.5%'><input onChange='changeComment(this)' class = 'invinput' value = '".$row['comment']."'></td>
							</tr>";
			}

			$string .= "</table>";
			echo $string;
			break;

		case "getDailyTotal":
			echo getDailyTotal($_POST['name'], $_POST['year'], $_POST['month']);
			break;

		case "getTotalDone":
			echo getTotalDone($_POST['name'], $_POST['year'], $_POST['month']);
			break;

		case "getPMPrev":
			$tablename = getTableName($_POST['name']);
			$pmprev = "00:00:00";
			$result = mysqli_query(getConnection(), "SELECT * FROM months ORDER BY year");
			while($row = mysqli_fetch_array($result)) {
				if ((getMonthNr($row['month']) >= getMonthNr($_POST['month']) and $row['year'] == $_POST['year']) or ($row['year'] > $_POST['year'])) { continue; }
				$pmprev = addTimes($pmprev, getPMNow($_POST['name'], $row['year'], $row['month']));
			}
			echo $pmprev;
			break;

		case "getPMNow":
			echo getPMNow($_POST['name'], $_POST['year'], $_POST['month']);
			break;

		case "getHolidaysTaken":
			$name = $_POST['name'];
			$year = $_POST['year'];
			$result = mysqli_query(getConnection(), "SELECT holidays FROM year$year WHERE name = '$name'");
			$row = mysqli_fetch_array($result);
			$totake = $row['holidays'];
			$taken = -getHolidays($name, $year, $_POST['month']);
			$totaltaken = getMonthlyHolidaysManual($name, $year, $_POST['month']);
			echo $taken.'/'.$totaltaken.'/('.($totake - $totaltaken).')';
			break;

		case "getPMTotal":
			echo addTimes($_POST['prev'], $_POST['now']);
			break;

		case "getHomeOffice":
			$tablename = getTableName($_POST['name']);
			$date = $_POST['year'].'-'.getMonthNr($_POST['month']).'%';
			$result = mysqli_query(getConnection(), "SELECT * FROM $tablename WHERE date LIKE '$date' and home_office = '1'");

			$hohours = "00:00:00";
			while ($row = mysqli_fetch_array($result)) {
				$hohours = addTimes(substractTimes($row['end'], addTimes($row['start'], $row['break'])), $hohours);
			}
			$hodays = shortenNumber(timeToHours($hohours) / timeToHours(getTotalDone($_POST['name'], $_POST['year'], $_POST['month'])));
			$workdays = getWorkingDays($_POST['name'], $_POST['year'], $_POST['month']);
			$wdshare = shortenNumber(($hodays / $workdays) * 100);

			echo $hohours.'/'.$hodays.'/'.$wdshare.'%';
			break;

		case "existingRow":
			$tablename = getTableName($_POST['name']);
			$result = mysqli_query(getConnection(), "UPDATE $tablename SET start = '".$_POST['start']."', end = '".$_POST['end']."', break = '".$_POST['pause']."', home_office = '".$_POST['ho']."' WHERE id = '".$_POST['id']."'");
			if (mysqli_connect_errno()) {
				echo false;
			}
			backupDB();
			echo true;
			break;

		case "newRow":
			echo newRow($_POST['name'], $_POST['date'], $_POST['start'], $_POST['end'], $_POST['pause'], $_POST['ho'], $_POST['year'], $_POST['month']);
			break;

		case "deleteEntry":
			$tablename = getTableName($_POST['name']);
			$connection = getConnection();
			$result = mysqli_query(getConnection(), "SELECT id FROM $tablename WHERE date = '".$_POST['date']."' ORDER BY id DESC LIMIT 1");
			$id = mysqli_fetch_array($result)['id'];

			$result2 = mysqli_query($connection, "DELETE FROM $tablename WHERE id = $id");
			if (mysqli_connect_errno()) {
				echo mysqli_connect_error;
			}
			backupDB();
			echo "Done";
			break;

		case "rowExists":
			echo json_encode(rowExists($_POST['name'], $_POST['date']));
			break;

		case "createMonth":
			$year = $_POST['year'];
			$month = $_POST['month'];
			$first = $_POST['firstday'];
			$last = $_POST['lastday'];
			$connection = getConnection();
			$tablemonth = strtolower($month).substr($year, -2, 2);

			$result = mysqli_query($connection, "SELECT * FROM months WHERE year = $year and month = '$month'");
			if (mysqli_num_rows($result) != 0) {
				echo false;
			}

			mysqli_query($connection, "CREATE TABLE $tablemonth (id int NOT NULL AUTO_INCREMENT, day varchar(20), date date, holidays BOOL DEFAULT FALSE, PRIMARY KEY (id))");
			$weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
			$monthnr = getMonthNr($month);
			$j = getWeekNr($first);

			for ($i = 1; $i <= $last; $i++) {
				if ($j == 7) { $j = 0; }
				if ($i < 10) { $day = "0".$i; } else { $day = $i; }
				$date = $year.'-'.$monthnr.'-'.$day;
				mysqli_query($connection, "INSERT INTO $tablemonth (day, date) VALUES ('".$weekdays[$j]."', '".$date."')");
				$j++;
			}

			$result = mysqli_query($connection, "SELECT * FROM months WHERE year = $year");
			if (mysqli_num_rows($result) == 0) {
				createYear($year);
			}
			$result = mysqli_query($connection, "INSERT INTO months (year, month) VALUES ($year, '$month')");
			insertDailyTotals($year, $month);
			echo true;
			break;

		case "saveSick":
			$name = $_POST['name'];
			$date = $_POST['date'];
			$check = rowExists($name, $date);
			if (count($check) == 0) {
				newRow($name, $date, '00:00:00', '00:00:00', '00:00:00', '0', '0', $_POST['year'], $_POST['month']);
			}

			$tablename = getTableName($name);
			mysqli_query(getConnection(), "UPDATE $tablename SET illness = '".$_POST['sick']."' WHERE date = '$date'");
			backupDB();
			echo true;
			break;

		case "saveHoliday":
			$name = $_POST['name'];
			$date = $_POST['date'];
			$year = $_POST['year'];
			$check = rowExists($name, $date);
			if (count($check) == 0) {
				newRow($name, $date, '00:00:00', '00:00:00', '00:00:00', '0','0', $year, $_POST['month']);
			}

			$tablename = getTableName($name);
			$result = mysqli_query(getConnection(), "UPDATE $tablename SET selfholiday = $holiday WHERE date = '$date'");
			if (!$result) {
				echo false;
			}
			backupDB();
			echo resetTakenHolidays($name, $year);
			break;

		case "saveComment":
			$name = $_POST['name'];
			$date = $_POST['date'];
			$tablename = getTableName($name);
			$check = rowExists($name, $date);
			if (count($check) == 0) {
				newRow($name, $date, '00:00:00', '00:00:00', '00:00:00', '0','0', $_POST['year'], $_POST['month']);
			}

			mysqli_query(getConnection(), "UPDATE $tablename SET comment = '".$_POST['comment']."' WHERE date = '$date'");
			if (mysqli_connect_errno()) { echo false; }
			backupDB();
			echo true;
			break;

		case "getTableWorkers":
			$result = mysqli_query(getConnection(), "SELECT * FROM people");
			$string = "<table>";
			while ($row = mysqli_fetch_array($result)) {
				$string.= "<tr onChange = 'editWorker(this)' id='".$row['id']."'><td style='width:80%'><input class = 'invinput' value = '".$row['name']."'></td><td><button class='deletebtn' onClick='deleteWorker(this)'>Delete</button></td></tr>";
			}
			echo $string."</table>";
			break;

		case "openDTTable":
			$year = $_POST['year'];
			$month = $_POST['month'];
			$tablemonth = strtolower($month).substr($year, -2, 2);
			$con = getConnection();
			$names = getPeople();
			$str = "<table>";
			for ($i = 0; $i < count($names); $i++) {
				$str .= "<tr id='$tablemonth' onChange='updateDailyTotal(this


				)'><td>".$names[$i]."</td><td><input class='invinput' value=".getDailyTotal($names[$i], $year, $month)."></td></tr>";
			}
			echo $str."</table";
			break;

		case "updateDailyTotal":
			$id = getIdWorker($_POST['name']);
			mysqli_query(getConnection(), "UPDATE dailytotals SET dailytotal = '".$_POST['dt']."' WHERE id_worker = $id AND tablemonth = '".$_POST['tablemonth']."'");
			break;

		case "editWorker":
			$id = $_POST['id'];
			$name = $_POST['name'];
			$connection = getConnection();

			$result = mysqli_query($connection, "SELECT name FROM people WHERE id = $id");
			$row = mysqli_fetch_array($result);
			$namebefore = $row['name'];
			if (mysqli_connect_errno()) {
				echo false;
			}

			mysqli_query($connection, "UPDATE people SET name = '$name' WHERE id = $id");
			if (mysqli_connect_errno()) {
				echo false;
			}

			$tablename = getTableName($name);
			$tablenamebefore = getTableName($namebefore);
			mysqli_query($connection, "RENAME TABLE $tablenamebefore TO $tablename");
			if (mysqli_connect_errno()) {
				echo false;
			}

			echo updateIntoHolidays($name, $namebefore);
			break;

		case "newWorker":
			$con = getConnection();
			mysqli_query($con, "INSERT INTO people (name) VALUES ('New worker');");
			mysqli_query($con, "CREATE TABLE new_worker (id int NOT NULL AUTO_INCREMENT, date date, start time, break time, end time, illness varchar(4), selfholiday varchar(4), home_office varchar(4), comment varchar(200), PRIMARY KEY (id))");
			insertIntoHolidays('New worker');
			break;

		case "deleteWorker":
			$name = $_POST['name'];
			$connection = getConnection();
			mysqli_query($connection, "DELETE FROM people WHERE id = ".$_POST['id']."");
			mysqli_query($connection, "DROP TABLE ".getTableName($name)."");
			deleteIntoHolidays($name);
			break;

		case "openHolidayTable":
			$tablemonth = strtolower($_POST['month']).substr($_POST['year'], -2, 2);
			$result = mysqli_query(getConnection(), "SELECT * FROM $tablemonth");

			$string = "<table>";
			while ($row = mysqli_fetch_array($result)) {
				$string .= "<tr id='".$row['date']."'><td style='width: 40%'>".$row['day']."</td><td style='width: 30%'>".$row['date']."</td><td onClick='changeHolidayTable(this)' style='width: 30%'>".$row['holidays']."</td></tr>";
			}

			echo $string."</table>";
			break;

		case "saveHolidayTable":
			$date = $_POST['id'];
			$year = substr($date, 0, 4);
			$monthNr = substr($date, 5, 2);
			$tablemonth = strtolower(getMonthName($monthNr)).substr($year, -2, 2);

			mysqli_query(getConnection(), "UPDATE $tablemonth SET holidays = ".$_POST['holiday']." WHERE date = '$date'");
			if (mysqli_connect_errno()) {
				echo false;
			}
			backupDB();
			echo true;
			break;

		case "openHolidayEach":
			$result = mysqli_query(getConnection(), "SELECT * FROM year".$_POST['year']."");
			$string = "<table>";
			while ($row = mysqli_fetch_array($result)) {
				$string .= "<tr id='$year'><td style='width: 50%'>".$row['name']."</td><td style='width: 50%'><input class='invinput' onChange='changeHolidayEach(this)' value='".$row['holidays']."'></td></tr>";
			}
			echo $string."</table>";
			break;

		case "saveHolidayEach":
			mysqli_query(getConnection(), "UPDATE year".$_POST['year']." SET holidays = ".$_POST['holidays']." WHERE name = '".$_POST['name']."'");
			if (mysqli_connect_errno()) {
				echo false;
			}
			backupDB();
			echo true;
			break;

		case "openGraph":
			$name = $_POST['name'];
			$year = $_POST['year'];
			$totals = getMonthlyTotals($name, $year);
			$pms = getMonthlyPMs($name, $year);
			$sick = getMonthlySicks($name, $year);
			$holidays = getMonthlyHolidays($name, $year);
			for ($i = 0; $i < count($totals); $i++) {
				if ($totals[$i] == -$pms[$i]) {
					$totals[$i] = 0;
					$pms[$i] = 0;
				}
			}

			array_push($totals, shortenNumber(array_sum($totals) / 8));
			array_push($pms, shortenNumber(array_sum($pms) / 8));
			array_push($sick, shortenNumber(array_sum($sick) / 8));
			array_push($holidays, shortenNumber(array_sum($holidays) / 8));

			$dt = timeToHours(getLastDailyTotal($name, $year));
			if ($dt != 0) {
				array_push($totals, shortenNumber(array_sum(array_slice($totals, 0, -1)) / $dt));
				array_push($pms, shortenNumber(array_sum(array_slice($pms, 0, -1)) / $dt));
				array_push($sick, shortenNumber(array_sum(array_slice($sick, 0, -1)) / $dt));
				array_push($holidays, shortenNumber(array_sum(array_slice($holidays, 0, -1)) / $dt));
			}

			echo json_encode([formatArray($totals), formatArray($pms), formatArray($sick), formatArray($holidays)]);
			break;

		case "openGeneralYearGraph":
			$year = $_POST['year'];
			$workers = getPeople();
			$totals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			$pms = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			$sick = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
			$holidays = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

			for ($i = 0; $i < count($workers); $i++) {
				$tmptotals = getMonthlyTotals($workers[$i], $year);
				$tmppms = getMonthlyPMs($workers[$i], $year);
				$tmpsick = getMonthlySicks($workers[$i], $year);
				$tmpholidays = getMonthlyHolidays($workers[$i], $year);
				for ($j = 0; $j < count($totals); $j++) {
					$totals[$j] += shortenNumber($tmptotals[$j]);
					$pms[$j] += shortenNumber($tmppms[$j]);
					$sick[$j] += shortenNumber($tmpsick[$j]);
					$holidays[$j] += shortenNumber($tmpholidays[$j]);
				}
			}

			for ($i = 0; $i < count($totals); $i++) {
				if ($totals[$i] == -$pms[$i]) {
					$totals[$i] = 0;
					$pms[$i] = 0;
				}
			}

			array_push($totals, shortenNumber(array_sum($totals) / 8));
			array_push($pms, shortenNumber(array_sum($pms) / 8));
			array_push($sick, shortenNumber(array_sum($sick) / 8));
			array_push($holidays, shortenNumber(array_sum($holidays) / 8));

			echo json_encode([formatArray($totals), formatArray($pms), formatArray($sick), formatArray($holidays)]);
			break;

		case "openGeneralMonthGraph":
			$year = $_POST['year'];
			$month = $_POST['month'];

			$workers = getPeople();
			$totals = [];
			$pms = [];
			$sick = [];
			$holidays = [];
			for ($i = 0; $i < count($workers); $i++) {
				$dailytotal = timeToHours(getDailyTotal($workers[$i], $year, $month));
				array_push($totals, shortenNumber(getMonthlyTotal($workers[$i], $year, $month)));
				array_push($pms, shortenNumber(timeToHours(getPMNow($workers[$i], $year, $month))));
				array_push($sick, shortenNumber(getSickDays($workers[$i], $year, $month) * $dailytotal));
				array_push($holidays, shortenNumber(getHolidays($workers[$i], $year, $month) * $dailytotal));
			}

			for ($i = 0; $i < count($totals); $i++) {
				if ($totals[$i] == -$pms[$i]) {
					$totals[$i] = 0;
					$pms[$i] = 0;
				}
			}
			$workers = formatNames($workers);
			array_push($workers, "Total(Days)");
			array_push($totals, shortenNumber(array_sum($totals) / 8));
			array_push($pms, shortenNumber(array_sum($pms) / 8));
			array_push($sick, shortenNumber(array_sum($sick) / 8));
			array_push($holidays, shortenNumber(array_sum($holidays) / 8));
			echo json_encode([$workers, formatArray($totals), formatArray($pms), formatArray($sick), formatArray($holidays)]);
			break;

		case "openOverviewTable":
			$mode = $_POST['option'];
			$workers = getPeople();
			$width = 80 / count($workers);
			$workdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
			$tablemonth = strtolower($_POST['month']).substr($_POST['year'], -2, 2);
			$connection = getConnection();

			$totals = [];
			for ($i = 0; $i < count($workers); $i++) {
				array_push($totals, 0);
			}

			$string = "<table>";
			$result = mysqli_query($connection, "SELECT * FROM $tablemonth");
			while ($row = mysqli_fetch_array($result)) { // Each day
				$string .= "<tr id = ".$row['date']."><td style='width:10%'>".$row['day']."</td><td style='width:10%'>".$row['date']."</td>";
				for ($i = 0; $i < count($workers); $i++) { // For each worker
					if (!(in_array($row['day'], $workdays)) or $row['holidays'] == '1') {
						$days = 2;
					} else {
						$tablename = getTableName($workers[$i]);
						$result2 = mysqli_query($connection, "SELECT $mode FROM $tablename WHERE date = '".$row['date']."'");
						$days = 0;
						while ($row2 = mysqli_fetch_array($result2)) {
							if ($row2[$mode] == '1') {
								$days = 1;
								$totals[$i]++;
								break;
							} else if ($row2[$mode] == '0.5') {
								$days += 0.5;
								$totals[$i] += 0.5;
								if ($days == 1) { break; }
							}
						}
					}
					$string .= "<td style='width:$width%' onClick='changeOverviewCell(this)' id='$tablename'>".$days."</td>";
				}
				$string .= "</tr>";
			}
			$string .= "<tr><td style='width:10%'>Totals</td><td style='width:10%'></td>";
			for ($i = 0; $i < count($workers); $i++) {
				$string .= "<td style='width:$width%'>".$totals[$i]."</td>";
			}
			echo $string."</tr></table>";
			break;

		case "changeOverviewCell":
			$name = $_POST['name'];
			$date = $_POST['date'];
			$check = rowExists(getRealName($name), $date);
			if (count($check) == 0) {
				$arrdate = explode('-', $date);
				newRow(getRealName($name), $date, '00:00:00', '00:00:00', '00:00:00', '0','0', $arrdate[0], getMonthName($arrdate[1]));
			}

			$result = mysqli_query(getConnection(), "UPDATE $name SET ".$_POST['mode']." = '".$_POST['change']."' WHERE date = '$date'");
			if ($result) {
				backupDB();
				echo true;
			} else {
				echo false;
			}
			break;

		case "getOverviewHeader":
			$string = "<table><tr style='background-color: #FFB100; border: none;'><th style='width:10%'>Day</th><th style='width:10%'>Date</th>";
			$workers = getPeople();
			$width = 80 / count($workers);
			for ($i = 0; $i < count($workers); $i++) {
				$name = formatName($workers[$i]);
				$string .= "<th style='width:$width%'>$name</th>";
			}
			$string .= "</tr></table>";
			echo $string;
			break;

		case "getWorkingDays":
			echo getWorkingDays($_POST['name'], $_POST['year'], $_POST['month']);
			break;

		case "getMonthlyToDo":
			$name = $_POST['name'];
			$year = $_POST['year'];
			$month = $_POST['month'];
			echo convHours(convMinutes(getDailyTotal($name, $year, $month)) * getWorkingDays($name, $year, $month));
			break;

		case "openGeneralMonthHOGraph":
			$workers = getPeople();
			$hos = [];
			for ($i = 0; $i < count($workers); $i++) {
				array_push($hos, shortenNumber(timeToHours(getHO($workers[$i], $_POST['year'], $_POST['month']))));
			}
			$workers = formatNames($workers);
			array_push($workers, "Total(Days)");
			array_push($hos, shortenNumber(array_sum($hos) / 8));
			echo json_encode([$workers, formatArray($hos)]);
			break;

		case "openHOGraph":
			$hos = getMonthlyHOs($_POST['name'], $_POST['year']);
			array_push($hos, shortenNumber(array_sum($hos) / 8));
			echo formatArray($hos);
			break;
}
?>
