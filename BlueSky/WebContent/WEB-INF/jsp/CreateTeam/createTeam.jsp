<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!-- 消除多余的空格 -->
<%@ page trimDirectiveWhitespaces="true" %>    
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>申请创建社团</title>
<!-- 引入jQuery -->
<script type="text/javascript" src="js/jquery-1.11.1.js"></script>
<script type="text/javascript">
function submit_application(){
	var name = document.createTeam_form.teamName.value;
	var type = document.createTeam_form.teamType.value;
	var g_teacher = document.createTeam_form.guideTeacher.value;
	var principal = document.createTeam_form.principal.value;
	var m_A_area = document.createTeam_form.mainActiveArea.value;
	var t_D = document.createTeam_form.teamDeclaration.value;
	
	if( name == ""){
		alert("请必须填写社团名称");
		return;
	}
	if( type == "default"){
		alert("请必须选择社团类别");
		return;
	}
	if( g_teacher == ""){
		alert("请必须填写指导教师");
		return;
	}
	if( principal == ""){
		alert("请必须填写社团负责人");
		return;
	}
	if( m_A_area == ""){
		alert("请必须填写社团主要活动地区");
		return;
	}
	if( t_D == ""){
		alert("请必须填写社团宣言");
		return;
	}
	alert("您的社团申请已经提交,请您耐心等候审核 !");
	document.createTeam_form.submit();  //验证完成,提交表单到后台 首页的Controller
}


</script>

</head>
<!-- 引入common的样式表 -->
<link href="css/common.css" rel="stylesheet" type="text/css"/>
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


<!-- 引入common.jsp -->
<jsp:include page="/WEB-INF/jsp/common.jsp" flush="true">
<jsp:param value="" name=""/>
</jsp:include>

<div style="position: absolute; top: 130px; left: 30%; width: 300px;height: 600px;">

<form name="createTeam_form" method="post" action="homepage">

<table>

<tr><td colspan="1"><font color="red">*</font>所有项必填<font color="red">*</font></td></tr>
<tr></tr>
<tr></tr>
<tr></tr>

<tr><td>社团名称 :</td>
<td><input type="text" name="teamName">
</td></tr>

<tr></tr>
<tr></tr>

<tr><td>社团类别 :</td>
<td><select name="teamType">
<option selected="selected" value="default">-----请选择-----</option>
<option value="政治理论类">政治理论类</option>
<option value="学术科创类">学术科创类</option>
<option value="文化艺术类">文化艺术类</option>
<option value="体育健身类">体育健身类</option>
<option value="公益志愿类">公益志愿类</option>
<option value="实践促进类">实践促进类</option>
<option value="合作交流类">合作交流类</option>
<option value="地域文化类">地域文化类</option>
</select>
</td></tr>

<tr></tr>
<tr></tr>

<tr><td>指导老师 :</td><td><input type="text" name="guideTeacher"></td></tr>

<tr></tr>
<tr></tr>

<tr><td>社团负责人 :</td><td><input type="text" name="principal" value="白国强" readonly="readonly"></td></tr>

<tr></tr>
<tr></tr>

<tr><td>主要活动地点 :</td> <td><input type="text" name="mainActiveArea"></td></tr>

<tr></tr>
<tr></tr>

<tr><td>社团宣言 :</td>  <td><textarea rows="5" cols="17" name="teamDeclaration"></textarea></td></tr>

<tr></tr>
<tr></tr>

<tr><td><input type="button" value="提交申请" onclick="submit_application()"></td>
<td><input type="reset" value="重置"></td></tr>

</table>

</form>

</div>


</body>
</html>