<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>用户注册 | noteApp</title>

<script type="text/javascript" charset="utf-8" src="../static/js/jquery-3.3.1.min.js"></script>
<script>
    // 调用ajax，认证用户名是否已经存在 
	function validateUserName () {
		var currentUserName = $("#userName").val();
		if (currentUserName == "" || currentUserName == null || currentUserName == "undefined") {
			return;
		}
		var action = "/register/validataUserName?userName=" + currentUserName;
		$.ajax({
			url: action,
			type: "POST",
			enctype: 'multipart/form-data',
			processData: false,
			contentType: false,
			cache: false,
			success: function (backData) {
				if (backData) {
					var validateResult = backData.isRepeat;
					if (validateResult != "" && validateResult != null && validateResult == "1") {
						var errorMessage = backData.errorList[0];
						alert(errorMessage);
						return;
					}
				} else {
					return;
				}
			},
			error: function () {
				var msg = $(backData.responseText);
				alert(meg);
			},
		});
	}
    
	// 确认两次密码输入是否一致
	function validatePassword () {
		var pw1 = $("#pw1").val();
		var pw2 = $("#pw2").val();
		if (pw1 == "" || pw1 == null || pw1 == "undefined" 
				|| pw2 == "" || pw2 == null || pw2 == "undefined") {
			alert("请将信息填写完整。");
			return;
		}
		
		if (pw1 != pw2) {
			alert("两次输入密码不一致,请重新输入。");
			return;
		} else {
			$("#registerForm").submit();
		}
	}

</script>

</head>
<body>
	<div>
		<form id="registerForm" action="/register/doRegister" method="post">
			<div>
				用户名: <input type="text" id="userName" name="userName" onblur="validateUserName();"/>
			</div>
			<br/>
			<br/>
			<div>
				密&nbsp;&nbsp;&nbsp;码: <input  type="text" name="userpassword" id="pw1"/>
			</div>
			<br/>
			<br/>
			<div>
				确认密码: <input  type="text" name="userpassword" id="pw2" onblur=""/>
			</div>
			<br/>
			<br/>
			<div>
				<a href="#" onclick="validatePassword();">
					注册
				</a>
			</div>
		</form>
	</div>


	<br/>
	<div><h2>抱歉，美工还在赶来的路上，咱先对付看着，苦了您呐</h2></div>


</body>
</html>