<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!-- 消除多余的空格 -->
<%@ page trimDirectiveWhitespaces="true"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>登录界面</title>
<script type="text/javascript">
	function function_verify() {
		var username = document.form_login.login_username.value;
		var password = document.form_login.login_password.value;
		if (username == "") {
			alert("请输入用户名！");
			document.form_login.login_username.focus();//光标聚焦到用户名输入框
			return;
		}
		if (password == "") {
			alert("请输入密码！");
			document.form_login.login_password.focus();//光标聚焦到密码输入框                                          
			return;
		}
		document.form_login.submit(); //验证完成,提交表单到后台Controller

	}
</script>
<!-- 引入样式表 -->
<link href="css/login.css" rel="stylesheet" type="text/css" />
</head>
<body>

	<%
		String mess = "&nbsp;&nbsp;"; // ^_^
		if (request.getAttribute("checkflag") != null) { //当里面有值(值为false)时说明判定失败
			mess = "用户名或密码错误 !"; //提示报错信息
		}
	%>


	<!-- 头部分 -->
	<div id="login_head_div">
		<div id="left_head">
			<h3>
				<font color="#4E6DE4">博学明德 经世致用</font>
			</h3>
		</div>
		<table id="table_right_head">
			<tr>
				<td><a href="homepage"
					style="text-decoration: underline; cursor: pointer;">返回首页</a></td>
			</tr>
			<tr>
				<td>没有账号？赶紧<a href="registry"
					style="text-decoration: underline; cursor: pointer;">注册</a></td>
			</tr>
		</table>
	</div>


	<!-- 左边一张图片填充 -->
	<div id="div_left">
		<img id="img_1" src="img/LoginLeft.jpg">
	</div>

	<!-- 输入账号密码区 -->
	<div id="right_content">
		<form action="submit_form" name="form_login" method="post">
			<table id="table_right">
				<tr>
					<td colspan="1"><font color="red"><%=mess%></font></td>
				</tr>
				<tr>
					<td>用户名 :&nbsp;&nbsp;<input type="text" name="login_username"
						maxlength="100" id="text_username"></td>
				</tr>
				<tr>
					<td>密&nbsp;码 :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<input
						type="password" name="login_password" id="text_password"></td>
				</tr>
				<tr>
					<td><center>
							<img src="img/login-login.png" style="cursor: pointer;"
								onclick="function_verify()">
						</center></td>
				</tr>
			</table>
		</form>
	</div>

</body>
</html>