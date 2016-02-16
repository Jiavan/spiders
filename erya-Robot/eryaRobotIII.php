<?php
/*
 * author: Jiavan
 * mail: mail@jiavan.com
 * content: 爬虫
 */
header("Content-Type:text/html;charset=utf-8");

function getDBHandle(){
	$mysql = mysqli_connect("localhost", "root", "", " erya");
    $mysql->query("set names utf8");
    return $mysql;
}

function getLocalData($mysql, $question){
	//data
	$sql = "SELECT * FROM record WHERE title like \"%$question%\" limit 3";
	//echo $sql."<br />";
	$result = $mysql->query($sql);

	if ($result->num_rows > 0) {
	    // 输出每行数据
	    while($row = $result->fetch_assoc()) {
	        echo $row['title']."答案: ".$row['answer']."<br /><br />--------------------------------------------------------------------------------------<br />";
	    }
        echo "本地数据";
	    return 1;
	} else {
	    return 0;
	}
}

function getDataByWeb($mysql, $question){
	//data
	$data='name='.$question;
    $curlobj = curl_init();                 // 初始化
    curl_setopt($curlobj, CURLOPT_URL, "http://jnvshen.cn/");      // 设置访问网页的URL
    curl_setopt($curlobj, CURLOPT_RETURNTRANSFER, true);           // 执行之后不直接打印出来
    curl_setopt($curlobj, CURLOPT_HEADER, 0);
    curl_setopt($curlobj, CURLOPT_POST, 1);
    curl_setopt($curlobj, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curlobj, CURLOPT_CONNECTTIMEOUT, 300);
    curl_setopt($curlobj, CURLOPT_HTTPHEADER, array("application/x-www-form-urlencoded; charset=utf-8",
            "Content-length: ".strlen($data)
            ));
    $output=curl_exec($curlobj);    // 执行
    curl_close($curlobj);                   // 关闭cURL

    $pattern = '/题目(.*?)录入）/';
    $subject = $output;
    $m1 = array();
    $out = array();
    $obj_num = 0;

    $obj_num = preg_match_all($pattern, $subject, $m1);

    if($obj_num){

            $i = 0;
            foreach ($m1[0] as $key => $value) {

                $out[$i++] = explode("答案:", $value);
            }

            //print_r($out);
            //如果存在数据就解析并存入数据库
            foreach ($out as $key => $record) {
                $title = $record[0];
                $answer = $record[1];

                $sql = "insert into record (title, answer) values(\"$title\", \"$answer\")";
                $mysql->query($sql);
                echo $title."答案: ".$answer."<br /><br />--------------------------------------------------------------------------------------<br />";
            }
    }else{
        //没有数据的操作
        //echo "没有数据";
        echo "没有查询到数据噢，可能是网络超时？或者你人品不好，要不重新提交试试嘛，再不行，怪我咯？";
    }
}

function execRobot($question){
	$mysql = getDBHandle();

	if(!getLocalData($mysql, $question)){
		getDataByWeb($mysql, $question);
	}
	mysqli_close($mysql);
}

if($_SERVER['REQUEST_METHOD'] == 'GET'){

	$question = $_GET['question'];
	execRobot($question);
}
?>