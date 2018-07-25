<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
   <!-- 消除多余的空格 -->
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>首页</title>

<!-- 引入common的样式表 -->
<link href="css/common.css" rel="stylesheet" type="text/css"/>
<!-- 引入jQuery -->
<script type="text/javascript" src="js/jquery-1.11.1.js"></script>

<script language="javascript" type="text/javascript">
	var img = new Array("img/ad-01.jpg","img/ad-02.jpg","img/ad-03.jpg","img/ad-04.jpg","img/ad-05.jpg");
	var num=1;
	function  tt(){
		document.getElementById("img01").src=img[num];
		//--------------判断下面圆点的改变---------------------
		if(num==0){
		document.getElementById("i4").src="img/white.png";
		document.getElementById("i"+num).src="img/black.png";
		}else{
		document.getElementById("i"+(num-1)).src="img/white.png";
		document.getElementById("i"+num).src="img/black.png";
		}
		//--------------数组下表的自增和还原-------------------
		if(num==4){
		num=0;
		}else{
		num++;
		}
		setTimeout("tt()",1500);
	}
	function f1_validate(){    //根据是否登录系统,判定权限,决定是否有权访问一些界面
		<% if(request.getSession().getAttribute("username") == null){ %>
			alert("请您先登录系统 !");
			return;
		<%}else{%>
			window.open("personalCenter","_parent");//在新窗口打开personalCenter(注解的值)对应的界面
			<%}%>  
	}
	
	function f2_validate(){
		<% if(request.getSession().getAttribute("username") == null){ %>
		alert("请您先登录系统 !");
		return;
	<%}else{%>
		window.open("createteam","_parent");//在新窗口打开createteam(注解的值)对应的界面
		<%}%>
	}
</script>


</head>
<body>
<%  //根据后台的情况判定显示/隐藏哪个div
  if(request.getSession().getAttribute("username") != null){
	  String username = (String) request.getSession().getAttribute("username");
%>
	  <script type="text/javascript">
	  $(document).ready(function(){
		 $("#div_login").hide();
		 $("#div_logined").show();
	  });
	  //document.getElementById("div_login").style.display = "none";
	  //document.getElementById("div_logined").style.display = "";
	  </script>
<% }
  else{
%>
	  <script type="text/javascript">
	  $(document).ready(function(){
			 $("#div_login").show();
			 $("#div_logined").hide();
		  });
	  //document.getElementById("div_login").style.display = "";
	  //document.getElementById("div_logined").style.display = "none";
	  </script> 
	 <%	  
     }
     %> 
 

<!-- 引入common.jsp  -->
<jsp:include page="/WEB-INF/jsp/common.jsp" flush="true">
<jsp:param value="" name=""/>
</jsp:include>


<!-- 滚动图片 -->
<table cellpadding="0" cellspacing="0" align="center" style="position: absolute;top:111px;left: 350px;">
<tr>
<td><img  src="img/ad-01.jpg" id="img01"></td>
</tr>
</table>
<!-- 下方圆点 -->
<table width="200" border="0" cellspacing="0" cellpadding="0" align="center" style="position: absolute;top: 488px;left: 550px;">
<tr>
<td><img src="img/black.png" id="i0"></td>
<td><img src="img/white.png" id="i1"></td>
<td><img src="img/white.png" id="i2"></td>
<td><img src="img/white.png" id="i3"></td>
<td><img src="img/white.png" id="i4"></td>
</tr>
</table>

<!-- 左侧菜单栏的button框 -->
<div id="homepage_left_menu">
<table align="center">
<tr><td><img src="img/button_blue.png"></td></tr>
<tr><td><img src="img/button_green.png"></td></tr>
<tr><td><img src="img/button_yellow.png"></td></tr>
<tr><td><img src="img/button_blue.png"></td></tr>
<tr><td><img src="img/button_green.png"></td></tr>
</table>	
</div>

<!-- 左侧菜单栏的button名 -->
<div id="left_button_name">
<table id="left_table">
<!-- +++++++++有些button若不登录无法进入++++++++ -->
<tr id="button_01"><td style="cursor: pointer;" onclick="f1_validate()"><font color="white">个人中心</font></td></tr>
<tr id="button_02"><td style="cursor: pointer;" onclick="f2_validate()"><font color="white">创建社团</font></td></tr>
<tr id="button_03"><td style="cursor: pointer;"><a href="selectteam" style="text-decoration: none;"><font color="white">查询社团</font></a></td></tr>
<tr id="button_04"><td style="cursor: pointer;"><a href="" style="text-decoration: none;"><font color="white">十佳社团</font></a></td></tr>
<tr id="button_05"><td style="cursor: pointer;"><a href="" style="text-decoration: none;"><font color="white">通知公告</font></a></td></tr>
</table>
</div>

<!-- 右侧每日推送 -->
<div id="right_div">
<div id="everyday_news">
<img src="img/everyday_news.png">
</div>
<table id="news_title">
<tr><td><center><b> <a href="r_1">【社团动态】动漫社行进在路上</a> </b></center></td></tr>
<tr><td><center><b><a href="r_2"> 【校园好声音】圆满落幕 青春再现 </a></b></center></td></tr>
<tr><td><center><b><a href="r_3"> 团委举办辩论知识讲座</a> </b></center></td></tr>
<tr><td><center><b><a href="r_4"> 6月13日学生社团活动动态</a></b></center></td></tr>
<tr><td><center><b><a href="r_5">|90后玩转社团招新！ </a></b></center></td></tr>
<tr><td><center><b><a href="r_6">新闻 6 </a></b></center></td></tr>

</table>
</div>






<!-- body end -->
</body>
<script language="javascript" type="text/javascript">
setTimeout("tt()",1500);
</script>
</html>