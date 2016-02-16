<?php
/*
 * @author Jiavan
 * Create 2015/05/04
 * CQUTRobot 模拟登陆教务系统及抓取页面内容
 */

/*
 * 基本信息类
 * @uid char() 学号
 * @passwd char() 密码
 * @domainName char() 主页地址
 * @seesionId char() 返回的session
 * @indexPageUrl char() 登陆后的首页地址
 * @basicUrl char() 基础地址，后面抓取url的前缀地址
 */
class BasicInfo{
	public $uid;
	public $passwd;
	public $domainName;
	public $sessionCooike;
	public $indexPageUrl;
	public $basicUrl;

	function __construct($uid, $passwd, $domainName){
		$this->uid = $uid;
		$this->passwd = $passwd;
		$this->domainName = $domainName;
	}
}

/*
 * 获取curl返回结果函数
 * @param url char() 目标地址
 * @param $method char() 请求方式
 * @param data Array() POST的数据
 * @param sessionCooike char() cookie
 */
function getCurlEnity($url, $method, $data){
	$curlobj = curl_init();
	curl_setopt($curlobj, CURLOPT_URL, $url);
	curl_setopt($curlobj, CURLOPT_HEADER, 0);
	curl_setopt($curlobj, CURLOPT_RETURNTRANSFER, true);

	if($method == 'POST'){
		date_default_timezone_set('PRC');
		curl_setopt($curlobj, CURLOPT_COOKIESESSION, TRUE); 
		curl_setopt($curlobj, CURLOPT_COOKIEFILE, "cookiefile");
		curl_setopt($curlobj, CURLOPT_COOKIEJAR, "cookiefile");
		curl_setopt($curlobj, CURLOPT_COOKIE, session_name() . '=' . session_id());
 
		curl_setopt($curlobj, CURLOPT_FOLLOWLOCATION, 1);
		curl_setopt($curlobj, CURLOPT_POST, 1);
		curl_setopt($curlobj, CURLOPT_POSTFIELDS, $data);
		curl_setopt($curlobj, CURLOPT_HTTPHEADER, array("application/x-www-form-urlencoded; charset=utf-8"
			));
	}

	$enity = curl_exec($curlobj);
	curl_close($curlobj);

	return $enity; 
}

/*
 * 设置seesionid与url函数
 * @param basicInfo Object 基础信息对象
 */
function setSessionAndUrl($basicInfo){
	$indexObj = getCurlEnity($basicInfo->domainName, 'GET', '');
	//请求首页地址获取session串得到登陆地址
	preg_match_all('/<a href=\'(.*)\'\>here/', $indexObj, $matches);
	$basicInfo->indexPageUrl = $basicInfo->domainName.$matches[1][0];
	preg_match('/<a href=\'\/\((.*)\)\/default2.aspx\'\>here/', $indexObj, $matches);
	$basicInfo->sessionCookie = $matches[1];
	$basicInfo->basicUrl = 'http://jwxt.i.cqut.edu.cn/('.$basicInfo->sessionCookie.')/';
}

/*
 * 登陆函数
 * @param basicInfo Object 基础信息对象
 * 通过获取__VIEWSTATE生成post data进行模拟登陆
 */
function login($basicInfo){
	//正则表达式获取__VIEWSTATE
	$enity = getCurlEnity($basicInfo->indexPageUrl, 'GET', '');
	preg_match('/__VIEWSTATE" value="(.*)" \/\>/', $enity, $matches);
	$randCode = $matches[1];

	$data = array(
		'__VIEWSTATE'=>$randCode,
		'txtUserName'=>$basicInfo->uid,
		'TextBox2'=>$basicInfo->passwd,
		'txtSecretCode'=>'',
		'RadioButtonList1'=>'',
		'Button1'=>'',
		'lbLanguage'=>'',
		'hidPdrs'=>'',
		'hidsc'=>''
		);
	return getCurlEnity($basicInfo->indexPageUrl, 'POST', $data);
}

//实例化对象
$jiavan = new BasicInfo('your id', 'your password', 'http://jwxt.i.cqut.edu.cn');
setSessionAndUrl($jiavan);
echo login($jiavan);

$url = $jiavan->basicUrl.'/xscj_gc.aspx?xh='.$jiavan->uid.'&type=1';
$data = array(
	'__VIEWSTATE'=>'dDwxODI2NTc3MzMwO3Q8cDxsPHhoOz47bDwxMTMwMzA5MDEwNjs+PjtsPGk8MT47PjtsPHQ8O2w8aTwxPjtpPDM+O2k8NT47aTw3PjtpPDk+O2k8MTE+O2k8MTM+O2k8MTY+O2k8MjY+O2k8Mjc+O2k8Mjg+O2k8MzU+O2k8Mzc+O2k8Mzk+O2k8NDE+O2k8NDU+Oz47bDx0PHA8cDxsPFRleHQ7PjtsPOWtpuWPt++8mjExMzAzMDkwMTA2Oz4+Oz47Oz47dDxwPHA8bDxUZXh0Oz47bDzlp5PlkI3vvJrotL7mraPmnYM7Pj47Pjs7Pjt0PHA8cDxsPFRleHQ7PjtsPOWtpumZou+8muiuoeeul+acuuenkeWtpuS4juW3peeoi+WtpumZojs+Pjs+Ozs+O3Q8cDxwPGw8VGV4dDs+O2w85LiT5Lia77yaOz4+Oz47Oz47dDxwPHA8bDxUZXh0Oz47bDznvZHnu5zlt6XnqIs7Pj47Pjs7Pjt0PHA8cDxsPFRleHQ7PjtsPOihjOaUv+ePre+8mjExMzAzMDkwMTs+Pjs+Ozs+O3Q8cDxwPGw8VGV4dDs+O2w8MjAxMzAzMDI7Pj47Pjs7Pjt0PHQ8O3Q8aTwxNj47QDxcZTsyMDAxLTIwMDI7MjAwMi0yMDAzOzIwMDMtMjAwNDsyMDA0LTIwMDU7MjAwNS0yMDA2OzIwMDYtMjAwNzsyMDA3LTIwMDg7MjAwOC0yMDA5OzIwMDktMjAxMDsyMDEwLTIwMTE7MjAxMS0yMDEyOzIwMTItMjAxMzsyMDEzLTIwMTQ7MjAxNC0yMDE1OzIwMTUtMjAxNjs+O0A8XGU7MjAwMS0yMDAyOzIwMDItMjAwMzsyMDAzLTIwMDQ7MjAwNC0yMDA1OzIwMDUtMjAwNjsyMDA2LTIwMDc7MjAwNy0yMDA4OzIwMDgtMjAwOTsyMDA5LTIwMTA7MjAxMC0yMDExOzIwMTEtMjAxMjsyMDEyLTIwMTM7MjAxMy0yMDE0OzIwMTQtMjAxNTsyMDE1LTIwMTY7Pj47Pjs7Pjt0PHA8O3A8bDxvbmNsaWNrOz47bDx3aW5kb3cucHJpbnQoKVw7Oz4+Pjs7Pjt0PHA8O3A8bDxvbmNsaWNrOz47bDx3aW5kb3cuY2xvc2UoKVw7Oz4+Pjs7Pjt0PHA8cDxsPFZpc2libGU7PjtsPG88dD47Pj47Pjs7Pjt0PEAwPDs7Ozs7Ozs7Ozs+Ozs+O3Q8QDA8Ozs7Ozs7Ozs7Oz47Oz47dDxAMDw7Ozs7Ozs7Ozs7Pjs7Pjt0PDtsPGk8MD47aTwxPjtpPDI+O2k8ND47PjtsPHQ8O2w8aTwwPjtpPDE+Oz47bDx0PDtsPGk8MD47aTwxPjs+O2w8dDxAMDw7Ozs7Ozs7Ozs7Pjs7Pjt0PEAwPDs7Ozs7Ozs7Ozs+Ozs+Oz4+O3Q8O2w8aTwwPjtpPDE+Oz47bDx0PEAwPDs7Ozs7Ozs7Ozs+Ozs+O3Q8QDA8Ozs7Ozs7Ozs7Oz47Oz47Pj47Pj47dDw7bDxpPDA+Oz47bDx0PDtsPGk8MD47PjtsPHQ8QDA8Ozs7Ozs7Ozs7Oz47Oz47Pj47Pj47dDw7bDxpPDA+O2k8MT47PjtsPHQ8O2w8aTwwPjs+O2w8dDxAMDxwPHA8bDxWaXNpYmxlOz47bDxvPGY+Oz4+Oz47Ozs7Ozs7Ozs7Pjs7Pjs+Pjt0PDtsPGk8MD47PjtsPHQ8QDA8cDxwPGw8VmlzaWJsZTs+O2w8bzxmPjs+Pjs+Ozs7Ozs7Ozs7Oz47Oz47Pj47Pj47dDw7bDxpPDA+Oz47bDx0PDtsPGk8MD47PjtsPHQ8cDxwPGw8VGV4dDs+O2w8SEhYWTs+Pjs+Ozs+Oz4+Oz4+Oz4+O3Q8QDA8Ozs7Ozs7Ozs7Oz47Oz47Pj47Pj47PgLuhwKW6DmWXUNcNNmDbAxvg6ez',
	'ddlXN'=>'',
	'ddlXQ'=>'',
	'Button1'=>''
	);
echo getCurlEnity($url, 'POST', $data);

$url = $jiavan->basicUrl.'/xskbcx.aspx?xh='.$jiavan->uid.'&type=1';
echo getCurlEnity($url, 'GET', '');

var_dump($jiavan);
?>