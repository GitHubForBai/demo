<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>个人中心</title>
</head>

<!-- 去掉body,横割,无边框 -->
<frameset rows="25%,*" border="0">
<!-- 上半  top.jsp        *src要写注解的值!!!*-->
<frame src="pCenterTop" name="top">
<!-- 竖割 -->
<frameset cols="30%,*" border="0">
<!-- 左右两边 -->
<frame src="pCenterLeft" name="left">
<frame src="pCenterRight" name="right">
</frameset>
</frameset>

</html>