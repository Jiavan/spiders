<?php
header("Content-Type:text/html;charset=utf-8");
//开始执行时间
$start = time();
/*
 * 获取字库函数
 * 返回结果为汉字库数组
 */
function getFont(){
        $file = fopen("font.txt", "r");
        $content = fread($file, filesize("font.txt"));

        return explode("\n", $content);
}

/*
 * 爬虫执行函数
 */
function eryaRobot(){
        $mysql = mysqli_connect("localhost", "root", "", " erya");
        $mysql->query("set names utf8");
        $fontArray = getFont();
        for ($chmark = 0; $chmark < sizeof($fontArray); $chmark++) {

                $data='name='.$chmark;
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

                        //如果存在数据就解析并存入数据库
                        foreach ($out as $key => $record) {
                                $title = $record[0];
                                $answer = $record[1];

                                $sql = "insert into record (title, answer) values(\"$title\", \"$answer\")";
                                $mysql->query($sql);
                                print_r($record);
                                //echo "ok";
                        }
                }else{

                        //没有数据的操作
                        //echo "没有数据";
                }
                //print_r($out);
        }
}

eryaRobot();
$end = time();//脚本结束

echo "<br />Time:---".($end - $start)."s---<br />";
?>
