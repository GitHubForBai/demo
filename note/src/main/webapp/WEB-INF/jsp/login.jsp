<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>noteApp | 您的高效管家</title>
<!-- 引入样式表 -->
<link href="../static/css/login.css" rel="stylesheet" type="text/css"/>

</head>
<body>

	<!-- 左边一张图片填充 -->
	<div id="div_left">
		<img id="img_1" src="../static/img/LoginLeft.jpg">
	</div>

	<!-- 输入账号密码区 -->
	<div id="right_content">
		<form action="submit_form" name="form_login" method="post">
			<table id="table_right">
				<tr>
					<td colspan="1"><font color="red"></font></td>
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
					<td>
						<center>
							<img src="../static/img/login-login.png" style="cursor: pointer;" onclick="function_verify()">
						</center>
					</td>
					<td>
						<center>
							<a style="cursor: pointer; text-decoration: underline;" href="/register/init">注册</a>
						</center>
					</td>
				</tr>
			</table>
		</form>
	</div>

</body>
</html>