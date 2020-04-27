<!DOCTYPE html>
<html lang="ko">
<head>
	<meta charset="utf-8">
	<title>main.html</title>

	<style>
	#div_root{
	margin:auto;
	width:1100px;
	}

	#div_logo{
	width: 1100px;
	height: 52px;
	position: absolute;
	left: 100px;
	top: 20px;
	background-color:#000000;
	text-align:left;
	}

	#div_menu{
	width : 500px;
	height: 50px;
	position: absolute;
	left: 700px;
	top: 20px;
	background-color:#333;
	text-align:center;

	}

	#div_RealTimeStockPrice{
	width: 500px;
	height: 350px;
	position: absolute;
	left: 100px;
	top: 100px;
	background-color:#fc5151;
	text-align:center;
	}

	#div_PredictStockPrice{
	width: 500px;
	height: 350px;
	position: absolute;
	left: 700px;
	top: 100px;
	background-color:#fc5151;
	text-align:center;
	}

	#div_PredictRate{
	width: 230px;
	height: 350px;
	position: absolute;
	left: 100px;
	top: 500px;
	background-color:#5157fc;
	text-align:center;
	}

	#div_jump{
	width: 230px;
	height: 350px;
	position: absolute;
	left: 370px;
	top: 500px;
	background-color:#5157fc;
	text-align:center;
	}

	#div_RecommendBoard{
	width: 500px;
	height: 350px;
	position: absolute;
	left: 700px;
	top: 500px;
	background-color:#5157fc;
	text-align:center;
	}

	ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    background-color: #000;
	}
	ul:after{
		content:'';
		display: block;
		clear:both;
	}
	li {
		float: right;
	}
	li a {
		display: block;
		color: white;
		text-align: center;
		padding: 14px 16px;
		text-decoration: none;
	}
	li a:hover:not(.active) {
		background-color: #333;
	}
	.active {
		background-color: #4CAF50;
	}
	
	table.type09 {
    border-collapse: collapse;
    text-align: left;
    line-height: 1.5;
	

	}
	table.type09 thead th {
		padding: 5px;
		font-weight: bold;
		vertical-align: top;
		color: #369;
		border-bottom: 3px solid #036;
		background: #ededed;
	}

	table.type09 td {
		width: 100px;
		padding: 1px;
		vertical-align: top;
		border-bottom: 1px solid #ccc;
		background: #f3f6f7;
	}
	</style>
</head>

<body>
	<div id="div_root">
	<div id="div_logo"> 
		<a href="main.php">
		<img src ="logo.jpeg" height="50">
		</a>
	</div>
	<div id="div_menu">
		<ul>
		  <li><a href="RecommendBoard.html">추천게시판</a></li>
		  <li><a href="board.html">자유게시판</a></li>
		  <li><a href="#contact">예측 정보</a></li>
		  <li><a class="active" href="main.php">Home</a></li>
		</ul>
	</div>
	<div id="div_RealTimeStockPrice">상위 실시간 주가
		
 		<table class="type09" width = "500">
			<thead>
			<tr>
				<th scope="cols">종목명</th>
				<th scope="cols">현재가</th>
				<th scope="cols">시가총액</th>
				<th scope="cols">거래량</th>
			</tr>
			</thead>
			<tbody>
			<?php
			
			$conn = mysqli_connect('localhost', 'admin', '3946', 'mydb');
		
			
			$query = "select name, current, aggregate, tran from stock where date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') order by aggregate DESC limit 10";
			$result = mysqli_query($conn, $query);
			while($row = mysqli_fetch_array($result)){
			echo '<tr>';
			echo '<td scope="row">' .$row['name']. '</td>';
			echo '<td>' .$row['current']. '</td>';
			echo '<td>' .$row['aggregate']. '</td>';
			echo '<td>' .$row['tran']. '</td>';
			echo '</tr>';
			}
			?>
			
			</tbody>
		</table>
	</div>
	<div id="div_PredictStockPrice">상위 예측 주가</div>
	<div id="div_PredictRate">예측률</div>
	<div id="div_jump">급등 종목
		<table class="type09" width = 250>
			<thead>
			<tr>
				<th scope="cols" width = 150>종목명</th>
				<th scope="cols">등락률</th>
			</tr>
			</thead>
			<tbody>
			<?php
			
			$conn = mysqli_connect('localhost', 'admin', '3946', 'mydb');
		
			
			$query = "select name, updown from stock where date_format(day, '%Y-%m-%d') = date_format(now(), '%Y-%m-%d') and updown >= 5 order by updown DESC limit 10";
			$result = mysqli_query($conn, $query);
			while($row = mysqli_fetch_array($result)){
			echo '<tr>';
			echo '<td scope="row">' .iconv_substr($row['name'], 0, 8). '</td>';
			echo '<td> +' .$row['updown']. '% </td>';
			echo '</tr>';
			}
			?>
			
			</tbody>
		</table>
	</div>
	<div id="div_RecommendBoard">상위 추천게시판</div>
</body>
</html>
