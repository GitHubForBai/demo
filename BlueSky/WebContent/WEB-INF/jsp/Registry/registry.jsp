<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>普通会员注册</title>
<script type="text/javascript" src="js/jquery-1.11.1.min.js"></script> 
<script type="text/javascript">
  function registry_submit(){
	  var user = document.registry_form.username.value;
	  var pass = document.registry_form.password.value;
	  var pass_sure = document.registry_form.sure_password.value;
	  var c_name = document.registry_form.college_name.value;
	  var r_name = document.registry_form.real_name.value;
	  var s_id = document.registry_form.stu_id.value;
	  
	  
	  if(user == ""){
		  alert("请填写用户名 !");
		  return;
	  }
	  if(pass == ""){
		  alert("请填写密码 !");
		  return;
	  }
	  if(pass != pass_sure){
		  alert("两次输入密码不一致 !");
		  return;
	  }
	  if(c_name == ""){
		  alert("请填写学院名称 !");
		  return;
	  }
	  if(r_name == ""){
		  alert("请填写真实姓名 !");
		  return;
	  }
	  if(s_id == ""){
		  alert("请填写学号 !");
		  return;
	  }
	  alert("注册完成,赶快登录吧 !");
	  document.registry_form.submit();  //验证完成,提交表单到后台Controller
	
}
</script>
<script>
//判断这个用户名是否重复,要提示重名消息
function validate_username(){
	var user = document.registry_form.username.value;
	//alert(user); 

	$.ajax({
		type:"post",
        url:"${pageContext.request.contextPath}/ajax_verify",
	    data:{username:user,flag:"flag" },
	    cache:false,
	    async:false,
	    dataType:"json",
	    success:function(data,textStatus,jqXHR){
	    	if(data.flag == "no"){ 
	    		//alert("没查到");
	    		$("#div_verify").hide();
	    	}else{
	    
	     		//alert("查到了");
	    		$("#div_verify").show();
	    	}
	    },
	    error:function(XMLHttpRequest,textStatus,errorThrown){
	    	alert("系统错误! 请返回首页!");
	    },
	}); 
	
}
</script>

<!-- 引入样式表 -->
<link href="css/registry.css" rel="stylesheet" type="text/css"/>

</head>
<body>
<!-- 头部分 -->
<div id="registry_div">
	<div id="div_school_motto">
	<h3><font color="#4E6DE4">博学明德  经世致用</font></h3>
	</div>
	<table id="tale_top_right">
	<tr><td><a href="homepage" style="text-decoration: underline; cursor: pointer;">返回首页</a></td></tr>
	<tr><td>已有账号？点击<a href="login" style="text-decoration: underline; cursor: pointer;">登录</a></td></tr>
	</table>
</div>

<!-- 提示用户名已被注册消息 -->
<!-- 开始注册内容 -->
<form name="registry_form" action="registry_done" method="post">
<table id="registry_content">
<tr><td colspan="1" align="right">带<font color="red">*</font>的为必填项目</td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;用户名 :</td>  <td><input type="text" name="username" onblur="validate_username()"></td><td><div id="div_verify" style="display:none; "><font color="red">用户名已被注册,请重新输入</font></div></td></tr>  
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;密&nbsp;&nbsp;码 :</td>    <td><input type="password" name="password"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;确认密码 :</td> <td><input type="password" name="sure_password"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;学院名称 :</td> <td><input type="text" name="college_name"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;真实姓名 :</td> <td><input type="text" name="real_name"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;学&nbsp;&nbsp;号 :</td> <td><input type="text" name="stu_id"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;性&nbsp;&nbsp;别 :</td>    <td><input type="radio" name="sex" checked="checked" value="男">男
                                                          <input type="radio" name="sex" value="女">女  
                                                     </td></tr>
<tr></tr>
<tr><td>民&nbsp;&nbsp;族 :</td>     
        <td>
        <select name="nation">											
        <option value="汉族" selected>汉族</option>
        <option value="满族">满族</option>
        <option value="藏族">藏族</option>
        <option value="蒙族">蒙族</option>
        <option value="朝鲜族">朝鲜族</option>
        </select>
        </td>
        </tr>
        <tr></tr>
<tr><td>入学时间 :</td>  <td><input type="text" name="start_time"></td></tr>
<tr></tr>
<tr><td>qq号码 :</td>   <td><input type="text" name="qq_num"></td></tr> 
<tr></tr>
<tr><td><input type="button" value="注册" onclick="registry_submit()"></td>
    <td><input type="reset" value="重置"></td>
</tr>
</table>  
</form>
</body>
</html>