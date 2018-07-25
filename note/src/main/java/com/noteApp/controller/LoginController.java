package com.noteApp.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/login")
public class LoginController {

	private static final String LOGIN_PATH = "login";
	
	/**
	 * 登录系统首页
	 * @param request
	 * @param model
	 * @return
	 * 2018年7月9日 - 下午7:41:44
	 * String
	 * @author admin
	 */
	@RequestMapping(value = "/init.action")
	public String loginPage (HttpServletRequest request, Model model) {
		return LOGIN_PATH;
	}
}
