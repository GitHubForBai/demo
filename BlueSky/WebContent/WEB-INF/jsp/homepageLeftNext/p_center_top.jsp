<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
<!-- 引入common的样式表 -->
<link href="css/common.css" rel="stylesheet" type="text/css"/>
<!-- 引入jQuery -->
<script type="text/javascript" src="js/jquery-1.11.1.js"></script>
</head>
<body>

<!-- 引入common.jsp -->
<jsp:include page="/WEB-INF/jsp/common.jsp" flush="true">
<jsp:param value="" name=""/>
</jsp:include>
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

</body>
</html>