<?php
// 1. DATABASE
function endConnection() {
	return mysqli_close(getConnection());
}

function backupDB() {
	saveDB();
	$backups = scandir('../backups');
	if (count($backups) > 102) {
		unlink('../backups/'.$backups[2]);
	}
}

function saveDB() {

	$connection = getConnection();

	//get all tables
	$tables = array();
	$result = mysqli_query($connection, 'SHOW TABLES');
	while($row = mysqli_fetch_array($result)) {
		$tables[] = $row[0];
	}
	//cycle through
	foreach($tables as $table) {
		$num_fields = mysqli_num_fields(mysqli_query($connection, 'SELECT * FROM '.$table));

		$return .= 'DROP TABLE '.$table.';';
		$row2 = mysqli_fetch_array(mysqli_query($connection, 'SHOW CREATE TABLE '.$table));
		$return .= "\n\n".$row2[1].";\n\n";

		for ($i = 0; $i < $num_fields; $i++) {
			while($row = mysqli_fetch_array($result)) {
				$return.= 'INSERT INTO '.$table.' VALUES(';
				for($j=0; $j < $num_fields; $j++) {
					$row[$j] = addslashes($row[$j]);
					$row[$j] = preg_replace("\n","\\n",$row[$j]);
					if (isset($row[$j])) { $return.= '"'.$row[$j].'"' ; } else { $return.= '""'; }
					if ($j < ($num_fields-1)) { $return.= ','; }
				}
				$return.= ");\n";
			}
		}
		$return.="\n\n\n";
	}

	//save file
	$fname = 'schedx-'.time().'.sql';
	$handle = fopen('../backups/'.$fname,'w+');
	fwrite($handle,$return);
	fclose($handle);
	return $fname;
}



// 2. STAFF
function getPeople() {
	$names = [];
	$result = mysqli_query(getConnection(), "SELECT name FROM people ORDER BY name");
	while ($row = mysqli_fetch_array($result)) {
		array_push($names, $row['name']);
	}
	return $names;
}

function getPeopleIDs() {
	$ids = [];
	$result = mysqli_query(getConnection(), "SELECT id FROM people ORDER BY id");
	while ($row = mysqli_fetch_array($result)) {
		array_push($ids, $row['id']);
	}
	return $ids;
}

function formatName($name) {
	return substr($name, 0, strrpos($name, " ") + 2).".";
}

function formatNames($names) {
	for ($i = 0; $i < count($names); $i++) {
		$names[$i] = formatName($names[$i]);
	}
	return $names;
}

function getTableName($name) {
	$arrname = explode(' ', $name);
	return strtolower($arrname[0].'_'.$arrname[1]);
}

function getRealName($tabname) {
	$arrtabname = explode('_', $tabname);
	return strtolower($arrtabname[0].' '.$arrtabname[1]);
}

function getIdWorker($name) {
	return mysqli_fetch_array(mysqli_query(getConnection(), "SELECT id FROM people WHERE name = '$name'"))['id'];
}



// 3. TOTALS, HOLIDAY, SICK, HOME OFFICE
function getDailyTotal($name, $year, $month) {
	$tablemonth = strtolower($month).substr($year, -2, 2);
	$id = getIdWorker($name);
	$result = mysqli_query(getConnection(), "SELECT dailytotal FROM dailytotals WHERE tablemonth = '$tablemonth' and id_worker = $id");
	return mysqli_fetch_array($result)['dailytotal'];
}

function getLastDailyTotal($name, $year) {
	$id = getIdWorker($name);
	$result = mysqli_query(getConnection(), "SELECT dailytotal FROM dailytotals WHERE id_worker = $id and tablemonth LIKE '%".substr($year, -2, 2)."' ORDER BY id DESC LIMIT 1");
	return mysqli_fetch_array($result)['dailytotal'];
}

function insertDailyTotals($year, $month) {
	$tablemonth = strtolower($month).substr($year, -2, 2);
	$prevMonthNr = getMonthNr($month)-1;
	if ($prevMonthNr < 10) {
		$prevMonthNr = "0".$prevMonthNr;
	}
	$prevMonth = getMonthName($prevMonthNr);

	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT name FROM people");
	while ($row = mysqli_fetch_array($result)) {
		$prevdt = getDailyTotal($row['name'], $year, $prevMonth);
		$id = getIdWorker($row['name']);
		mysqli_query($connection, "INSERT INTO dailytotals (id_worker, tablemonth, dailytotal) VALUES ($id, '$tablemonth', '$prevdt')");
	}
	backupDB();
}

function getMonthlyTotal($name, $year, $month) {
	$dailytotal = timeToHours(getDailyTotal($name, $year, $month));
	$days = getWorkingDays($name, $year, $month);
	return $days * $dailytotal;
}

function getMonthlyTotals($name, $year) {
	$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$arrtotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");

	while ($row = mysqli_fetch_array($result)) {
		if ($row['month'] == date("F") and $year == date("Y")) {
			break;
		}
		$arrtotals[array_search($row['month'], $months)] = shortenNumber(getMonthlyTotal($name, $year, $row['month']));
	}
	return $arrtotals;
}

function getTotalDone($name, $year, $month) {
	$tablemonth = strtolower($month).substr($year, -2, 2);
	$tablename = getTableName($name);
	$hours = 0;
	$minutes = 0;
	$seconds = 0;

	$result = mysqli_query(getConnection(), "SELECT $tablename.start, $tablename.break, $tablename.end FROM $tablename INNER JOIN $tablemonth ON $tablename.date = $tablemonth.date");
	while ($row = mysqli_fetch_array($result)) {
		$sum = substractTimes(substractTimes($row['end'], $row['break']), $row['start']);
		$time = explode(':', $sum); //0-hours, 1-minutes, 2-seconds
		$hours += (int)$time[0];
		$minutes += (int)$time[1];
		$seconds += (int)$time[2];
	}
	$res = formatTime($hours, $minutes, $seconds);
	return $res;
}

function getPMNow($name, $year, $month) {
	$dailytotal = getDailyTotal($name, $year, $month);
	$totaldone = getTotalDone($name, $year, $month);
	$days = getWorkingDays($name, $year, $month);
	$arrdt = explode(':', $dailytotal);
	$shouldhours = (int)$arrdt[0] * $days;
	$shouldmins = (int)$arrdt[1] * $days;
	$shouldsecs = (int)$arrdt[2] * $days;

	$shouldtime = formatTime($shouldhours, $shouldmins, $shouldsecs);
	$plusminus = substractTimes($totaldone, $shouldtime);
	return $plusminus;
}

function getMonthlyPMs($name, $year) {
	$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$arrtotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");

	while ($row = mysqli_fetch_array($result)) {
		if ($row['month'] == date("F") and $year == date("Y")) {
			break;
		}
		$arrtotals[array_search($row['month'], $months)] = shortenNumber(timeToHours(getPMNow($name, $year, $row['month'])));
	}
	return $arrtotals;
}

function getMonthlyHOs($name, $year) {
	$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$arrtotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");

	while ($row = mysqli_fetch_array($result)) {
		if ($row['month'] == date("F") and $year == date("Y")) {
			break;
		}
		$arrtotals[array_search($row['month'], $months)] = shortenNumber(timeToHours(getHO($name, $year, $row['month'])));
	}
	return $arrtotals;
}

function getHO($name, $year, $month) {
	$tablename = getTableName($name);
	$date = $year.'-'.getMonthNr($month).'%';
	$result = mysqli_query(getConnection(), "SELECT * FROM $tablename WHERE date LIKE '$date' and home_office = '1'");

	$hohours = "00:00:00";
	while ($row = mysqli_fetch_array($result)) {
		$hohours = addTimes(substractTimes($row['end'], addTimes($row['start'], $row['break'])), $hohours);
	}
	return $hohours;
}

function getWorkingDays($name, $year, $month) {
	$tablename = getTableName($name);
	$tablemonth = strtolower($month).substr($year, -2, 2);
	$monthNr = getMonthNr($month);
	$workdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	$days = 0;

	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT day, holidays FROM $tablemonth");
	while ($row = mysqli_fetch_array($result)) {
		if (in_array($row['day'], $workdays)) {
			if ($row['holidays'] == '0') {
				$days += 1;
			} elseif ($row['holidays'] == '0.5') {
				$days += 0.5;
			}
		}
	}
	$result2 = mysqli_query($connection, "SELECT illness, selfholiday FROM $tablename WHERE date LIKE '$year-$monthNr-%'");
	while ($row = mysqli_fetch_array($result2)) {
		if ($row['illness'] == '1') {
			$days -= 1;
		} else if ($row['illness'] == '0.5') {
			$days -= 0.5;
		}
		if ($row['selfholiday'] == '1') {
			$days -= 1;
		} else if ($row['selfholiday'] == '0.5') {
			$days -= 0.5;
		}
	}
	return $days;
}

function getSickDays($name, $year, $month) {
	$days = 0;
	$tablename = getTableName($name);
	$monthNr = getMonthNr($month);
	$result = mysqli_query(getConnection(), "SELECT illness FROM $tablename WHERE date LIKE '$year-$monthNr-%'");
	while ($row = mysqli_fetch_array($result)) {
		$days -= $row['illness'];
	}
	return $days;
}

function getMonthlySicks($name, $year) {
	$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$arrtotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");

	while ($row = mysqli_fetch_array($result)) {
		if ($row['month'] == date("F") and $year == date("Y")) {
			break;
		}
		$dailytotal = timeToHours(getDailyTotal($name, $year, $row['month']));
		$arrtotals[array_search($row['month'], $months)] = shortenNumber(getSickDays($name, $year, $row['month']) * $dailytotal);
	}
	return $arrtotals;
}

function getHolidays($name, $year, $month) {
	$days = 0;
	$tablename = getTableName($name);
	$monthNr = getMonthNr($month);
	$result = mysqli_query(getConnection(), "SELECT selfholiday FROM $tablename WHERE date LIKE '$year-$monthNr-%'");
	while ($row = mysqli_fetch_array($result)) {
		$days -= $row['selfholiday'];
	}
	return $days;
}

function getMonthlyHolidays($name, $year) {
	$months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	$arrtotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");
	while ($row = mysqli_fetch_array($result)) {
		if ($row['month'] == date("F") and $year == date("Y")) {
			break;
		}
		$dailytotal = timeToHours(getDailyTotal($name, $year, $row['month']));
		$arrtotals[array_search($row['month'], $months)] = shortenNumber(getHolidays($name, $year, $row['month']) * $dailytotal);
	}
	return $arrtotals;
}

function getMonthlyHolidaysManual($name, $year, $month) {
	$total = 0;
	$result = mysqli_query(getConnection(), "SELECT month FROM months WHERE year = $year");
	while ($row = mysqli_fetch_array($result)) {
		$total += -getHolidays($name, $year, $row['month']);
		if ($row['month'] == $month) {
			break;
		}
	}
	return $total;
}

function resetTakenHolidays($name, $year) {
	$days = 0;
	$tablename = getTableName($name);
	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT selfholiday FROM $tablename WHERE date LIKE '$year%'");
	while ($row = mysqli_fetch_array($result)) {
		if ($row['selfholiday'] == '1') {
			$days += 1;
		} else if ($row['selfholiday'] == '0.5') {
			$days += 0.5;
		}
	}
	mysqli_query($connection, "UPDATE year$year SET taken = '$days' WHERE name = '$name'");
	backupDB();
	return $days;
}

function insertIntoHolidays($name) {
	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT year FROM months GROUP BY year");
	while ($row = mysqli_fetch_array($result)) {
		mysqli_query($connection, "INSERT INTO year".$row['year']." (name) VALUES ('".$name."')");
	}

	$id = getIdWorker($name);
	$result = mysqli_query($connection, "SELECT * FROM months");
	while ($row = mysqli_fetch_array($result)) {
		$tablemonth = strtolower($row['month']).substr($row['year'], -2, 2);
		$result2 = mysqli_query($connection, "INSERT INTO dailytotals (id_worker, tablemonth, dailytotal) VALUES ($id, '$tablemonth', '00:00:00')");
	}
	backupDB();
	return true;
}

function updateIntoHolidays($name, $namebefore) {
	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT year FROM months GROUP BY year");
	while ($row = mysqli_fetch_array($result)) {

		$result2 = mysqli_query($connection, "SELECT id FROM year".$row['year']." WHERE name = '$namebefore'");
		$row2 = mysqli_fetch_array($result2);
		$id = $row2['id'];

		mysqli_query($connection, "UPDATE year".$row['year']." SET name = '$name' WHERE id = $id");
	}
	backupDB();
	return true;
}

function deleteIntoHolidays($name) {
	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT year FROM months GROUP BY year");

	while ($row = mysqli_fetch_array($result)) {
		mysqli_query($connection, "DELETE FROM year".$row['year']." WHERE name = '$name'");
	}
	backupDB();
	return true;
}



// 4. TABLES
function newRow($name, $date, $start, $end, $pause, $ho, $year, $month) {
	$tablename = getTableName($name);
	mysqli_query(getConnection(), "INSERT INTO $tablename (date, start, end, break, home_office) VALUES ('$date', '$start', '$end', '$pause', '$ho')");
	backupDB();
	return true;
}

function rowExists($name, $date) {
	$tablename = getTableName($name);
	$result = mysqli_query(getConnection(), "SELECT id FROM $tablename WHERE date = '$date' ORDER BY id");

	$arrid = [];
	while ($row = mysqli_fetch_array($result)) {
		array_push($arrid, $row['id']);
	}
	return $arrid;
}

function openOverviewTableWithColors($year, $month, $mode, $sumhalf, $sumfull) {
	/*
	Holiday for all or weekend: 1, red
	Half-holiday for all; 1.5, pink
	Self-Holiday: 2, blue,
	Half-selfHoliday: 2.5, turquoise
	Sick: 3, green
	Half-Sick: 3.5, light green
	*/
	$workers = getPeople();
	$width = 75 / count($workers);
	$workdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
	$monthNr = getMonthNr($month);
	$string = "<table>";
	$tablemonth = strtolower($month).substr($year, -2, 2);
	$connection = getConnection();
	$result = mysqli_query($connection, "SELECT * FROM $tablemonth");
	$j = 0;

	while ($row = mysqli_fetch_array($result)) {
		$string .= "<tr id = ".$row['date']."><td style='width:10%'>".$row['day']."</td><td style='width:15%'>".$row['date']."</td>";
		for ($i = 0; $i < count($workers); $i++) {
			$days = 0;
			if (!(in_array($row['day'], $workdays)) or $row['holidays'] == '1') {
				$days = 1;
			} else {
				$tablename = getTableName($workers[$i]);
				$result2 = mysqli_query($connection, "SELECT $mode FROM $tablename WHERE date = '".$row['date']."'");
				while ($row2 = mysqli_fetch_array($result2)) {
					if ($row['holidays'] == '0.5') {
						$days += 1.5;
					}
					if ($row2[$mode] == '1') {
						$days += $sumfull;
					} else if ($row2[$mode] == '0.5') {
						$days += $sumhalf;
					}
					break;
				}
			}
			$string .= "<td style='width:$width%'>".$days."</td>";
		}
		$string .= "</tr>";
		$j++;
	}
	return $string."</table>";
}



// 5. TIME, DATE
function timeToHours($time) {
	$a = explode(':', $time);
	return $a[0] + $a[1] / 60 + 0.1*($a[2] / 60);
}

function addTimes($var1, $var2) {
	return convHours(convMinutes($var1) + convMinutes($var2));
}

function substractTimes($var1, $var2) {
	return convHours(convMinutes($var1) - convMinutes($var2));
}

function convMinutes($var) {
	$a = explode(':', $var);
	if ($a[0][0] == '-') {
	    return -(-$a[0]*60 + $a[1] + $a[2]/60);
	} else {
		return $a[0]*60 + $a[1] + $a[2]/60;
	}
}

function convHours($var) {
	if ($var < 0) {
		$h = ceil($var / 60);
		$m = -ceil($var - $h * 60);
		$s = -ceil(($var * 60 + $m * 60 - $h * 3600) * 60);
		if ($s == -0) { $s = 0; }
		if ($m == -0) { $m = 0; }
		return formatAddTime($h,$m,$s);
	} else {
		$h = floor($var / 60);
		$m = floor($var - $h * 60);
		$s = floor(($var * 60 - $m * 60 - $h * 3600) * 60);
		return formatAddTime($h, $m, $s);
	}
}

function formatAddTime($h, $m, $s) {
	if ($s < 10) { $s = '0'.$s; }
	if ($m < 10) { $m = '0'.$m; }

	if (strval($h)[0] == "-" and $h == 0) {
		$h = "-00";
	} elseif ($h == 0) {
	    $h = "00";
	} elseif ($h < 10 and $h > 0) {
		$h = '0'.$h;
	} elseif (($h > -10 and $h <= 0)) {
		$h = '-0'.substr($h, 1);
	}
	return $h.':'.$m.':'.$s;
}

function formatTime($h, $m, $s){
	//check and corect (negative) minutes and seconds
	$tmp = floor($s/60);
	$m += $tmp;
	$s -= $tmp*60;

	$tmp = floor($m/60);
	$h += $tmp;
	$m -= $tmp*60;

	//Add zeros if minutes, seconds or hours under 10
	if ($s < 10) {
		$s = '0'.$s;
	}
	if ($m < 10) {
		$m = '0'.$m;
	}
	//check if hours are negative
	if ($h < 10 and $h >= 0) {
		$h = '0'.$h;

	} elseif ($h > -10 and $h < 0) {
		$h = '-0'.substr($h, -1);
	}

	return $h.':'.$m.':'.$s;
}

function createYear($year) {
	$con = getConnection();
	mysqli_query($con, "CREATE TABLE year$year (id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(ID), name VARCHAR(50), holidays FLOAT(5,1) DEFAULT 0,taken FLOAT(5,1) DEFAULT 0);");
	$res = mysqli_query($con, "SELECT name FROM people");
	while ($row = mysqli_fetch_array($res)) {
		mysqli_query($con, "INSERT INTO year$year (name) VALUES ('".$row['name']."')");
	}
}

function getWeekNr($day) {
	$days = array("Monday" => 0, "Tuesday" => 1, "Wednesday" => 2, "Thursday" => 3, "Friday" => 4, "Saturday" => 5, "Sunday" => 6);
	return $days[$day];
}

function getMonthNr($month) {
	$months = array("January" => '01', "February" => '02', "March" => '03', "April" => '04', "May" => '05', "June" => '06', "July" => '07', "August" => '08', "September" => '09', "October" => '10', "November" => '11', "December" => '12');
	return $months[$month];
}

function getMonthName($monthNr) {
	$months = array("01" => 'January', "02" => 'February', "03" => 'March', "04" => 'April', "05" => 'May', "06" => 'June', "07" => 'July', "08" => 'August', "09" => 'September', "10" => 'October', "11" => 'November', "12" => 'December');
	return $months[$monthNr];
}

function shortenDay($day) {
	$days = ["Monday" => "Mon", "Tuesday" => "Tue", "Wednesday" => "Wed", "Thursday" => "Thur", "Friday" => "Fri", "Saturday" => "Sat", "Sunday" => "Sun"];
	return $days[$day];
}



// 6. FORMATTING
function shortenNumber($number) {
	return round($number, 2);
}

function formatArray($arr) {
	for ($i = 0; $i < count($arr); $i++) {
		if ($arr[$i] == 0) {
			$arr[$i] = "";
		}
	}
	return $arr;
}
?>
