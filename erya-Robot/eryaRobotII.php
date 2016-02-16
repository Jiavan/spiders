<!-- 
author: Jiavan
mail: mail@jiavan.com
content: 前端页面

1         1
1         1       
1         1       0
1 0 0 0 0 1       1
1         1       1
1         1       1
1         1       1 这里什么都没有！

 -->
<!DOCTYPE html>
<html>
<head>
<title>EryaRobot</title>
<meta charset="utf-8"/>
<script type="text/javascript">
function loadXMLDoc()
{
	var question = document.getElementById("question").value;
	document.getElementById("content").innerHTML="找呀找呀找数据，加载中。。。耐心等待吧@_@";
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
	  xmlhttp=new XMLHttpRequest();
	  }
	else
	  {// code for IE6, IE5
	  xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	  }
	xmlhttp.onreadystatechange=function()
	  {
	  if (xmlhttp.readyState==4 && xmlhttp.status==200)
	    {
	    	document.getElementById("content").innerHTML=xmlhttp.responseText;
	    }
	  }
	xmlhttp.open("GET","eryaRobotIII.php?question="+question,true);
	xmlhttp.send();
}
</script>
<style type="text/css">
*{
	padding: 0px;
	margin: 0px;
	border: 0px;
}
body{
	background-color: #666666;
	font-family: "微软雅黑";
	color: white;
}
.continaer{
	margin: auto;
	//background-color: blue;
	width: 800px;
	padding-top: 1px;
}
#board{
	margin: 100px auto auto auto;
	width: 80%;
	height: 100px;
	//background-color: #595959;
	padding-top: 1px;
}
#question{
	width: 80%;
	height: 60px;
	background-color: #ffffff;
	border-radius: 3px;
	margin-top: 25px;
	font-size: 30px;
}
#submit{
	width: 19%;
	height: 60px;
	border-radius: 3px;
	font-size: 30px;
}
#content{
	width: 80%;
	height: 400px;
	background-color: #888888;
	margin: 10px auto;
	box-shadow: 10px 10px 100px 10px;
	border-radius: 3px;
	padding: 10px;
}
.bottom{
	margin: auto;
	text-align: center;
	margin-top: 50px;
	font-size: 10px;
}
</style>
</head>
<body>
	<div class="continaer">
		<div id="board">
			<input type="text" name="question" id="question" placeholder="输入题目关键词如：爱因斯坦"/>
			<button id="submit" onclick="loadXMLDoc()">Submit</button>
		</div>
		<div id="content">
			还没有输入查询数据噢@_@
		</div>
		<div class="bottom">
			&copy; 2015 Copyleft Jiavan.com Open source 仅供学习via甲烷@
		</div>
	</div>
</body>
</html>

