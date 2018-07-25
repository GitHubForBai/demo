<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    <%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>

</head>
<script type="text/javascript">
  function registry_submit(){
	  var user = document.update_form.registry_username.value;
	  var pass = document.update_form.registry_password.value;
	  var pass_sure = document.update_form.sure_password.value;
	  var c_name = document.update_form.college_name.value;
	  var r_name = document.update_form.real_name.value;
	  var stu_id = document.update_form.stu_id.value;
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
	  if(stu_id == ""){
		  alert("请填写学号 !");
		  return;
	  }
	  
	  document.registry_form.submit();  //验证完成,提交表单到后台Controller
	
}
</script>
<body>

<div>

<form name="update_form" action="" method="post">
<table id="update_content">
<tr><td colspan="1" align="right">带<font color="red">*</font>的为必填项目</td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;用户名 :</td>  <td><input type="text" name="registry_username" value="${username}">(<font color="red">登录系统的用户名</font>)</td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;密&nbsp;&nbsp;码 :</td>    <td><input type="password" name="registry_password" value="${sys_u.password }"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;确认密码 :</td> <td><input type="password" name="sure_password"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;学院名称 :</td> <td><input type="text"  value="${sys_u.college_name }" name="college_name"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;真实姓名 :</td> <td><input type="text" name="real_name" value="${sys_u.real_name}"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;学&nbsp;&nbsp;号 :</td> <td><input type="text" name="stu_id" value="${sys_u.stu_id}"></td></tr>
<tr></tr>
<tr><td><font color="red">*</font>&nbsp;性&nbsp;&nbsp;别 :</td>    <td><input type="radio" name="registry_sex" checked="checked" value="男">男
                                                          <input type="radio" name="registry_sex" value="女">女  
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
<tr><td>入学时间 :</td>  <td><input type="text" name="admission_time" value="${sys_u.start_time}"></td></tr>
<tr></tr>
<tr><td>qq号码 :</td>   <td><input type="text" name="qq_number" value="${sys_u.qq_num}"></td></tr> 
<tr></tr>
<tr><td><input type="button" value="完成" onclick="registry_submit()"></td>
    <td><input type="reset" value="重置"></td>
</tr>
</table>  
</form>

</div>

</body>
</html>