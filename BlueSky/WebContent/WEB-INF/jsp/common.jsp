<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page trimDirectiveWhitespaces="true" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<!-- 引入jQuery -->

<!-- 共通部分 -->
<div id="common_div1">
<table id="common.table" align="center" style="top:77px">
<tr>
<td class="word_css"><a class="head_menu" href="homepage" style="color: white" target="_parent">平台首页</a></td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td class="word_css"><a class="head_menu" style="color: white">社团风采</a></td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td class="word_css"><a class="head_menu" style="color: white">资料下载</a></td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td class="word_css"><a class="head_menu" style="color: white">网站公告</a></td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td class="word_css"><a class="head_menu" style="color: white">新闻中心</a></td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td class="word_css"><a class="head_menu" style="color: white">网站声明</a></td>
<td>&nbsp;&nbsp;&nbsp;</td>
<td class="word_css"><a class="head_menu">我听你说</a></td>
</tr>
</table>
</div>

<!-- 学校logo -->
<div id="head_div">
<div id="div_icon">
<h2><a style="cursor: pointer;text-decoration: none;" href="homepage">辽宁科技大学</a></h2>
</div>

<!-- 登录,注册,宗旨 -->
<div id="div_login">
<table id="common.table.right">
<tr><td>
<a style="cursor: pointer; text-decoration: underline;" href="login">登录</a>&nbsp;&nbsp;|&nbsp;&nbsp;
<a style="cursor: pointer; text-decoration: underline;" href="registry">注册</a>&nbsp;&nbsp;|&nbsp;&nbsp;
<a style="cursor: pointer; text-decoration: underline;">管理员登录</a></td></tr>

<tr><td>
<strong><span style="font-size:14px;color:#C72828;">
服务·指导·监督
</span></strong>
</td></tr>
</table>
</div>
</div>


<!-- 用户已经登录,显示登录状态 -->
<div id="div_logined">
<table id="common.table.right_logined">
<tr><td>欢迎您,&nbsp;${sessionScope.username } &nbsp; <a href="exit" style="cursor: pointer;">退出</a>
</td></tr>
<tr><td>
<strong><span style="font-size:14px;color:#C72828;">
服务·指导·监督
</span></strong>
</td></tr>
</table>
</div>
