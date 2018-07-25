package com.noteApp.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.noteApp.domain.model.UserInfoEntity;
import com.noteApp.domain.service.UserInfoRegisterService;

@Controller
@RequestMapping(value = "/register")
public class RegisterController {
	
	@Resource
	UserInfoRegisterService userInfoRegisterService;
	/**
	 * 普通用户注册页面
	 */
	private static final String REGISTER_URL = "register";
	
	/**
	 * 访问注册页面
	 * @param model
	 * @param request
	 * @param response
	 * @return
	 * 2018年7月16日 - 下午6:30:06
	 * String
	 * @author admin
	 */
	@RequestMapping(value = "/init")
	public String pageInit(Model model, HttpServletRequest request, HttpServletResponse response) {
		return REGISTER_URL;
	}
	
	/**
	 * 提交登录操作
	 * @param userInfoEntity
	 * @param model
	 * @param request
	 * @param response
	 * @return
	 * 2018年7月16日 - 下午7:02:44
	 * String
	 * @author admin
	 */
	@RequestMapping(value = "/doRegister")
	public String registerAction(UserInfoEntity userInfoEntity
							   , Model model
							   , HttpServletRequest request
							   , HttpServletResponse response) {
		
		
		
		return "";
	}
	/**
	 * 使用ajax判断用户名是否出现重复
	 * @param request
	 * @param userName
	 * @return
	 * 2018年7月17日 - 下午7:52:34
	 * Map<String,Object>
	 * @author admin
	 */
	@ResponseBody
	@RequestMapping(value = "/validataUserName")
	public Map<String, Object> validataUserName (@RequestParam("userName")String userName
											   , HttpServletRequest request
											   , Model model ) {
		Map<String, Object> backMap = new HashMap<>();
		List<String> errorList = new ArrayList<>();
		boolean isRepeat = userInfoRegisterService.validataUserName(userName, model, errorList);
		if (isRepeat) {
			if (errorList != null && errorList.size() > 0) {
				backMap.put("isRepeat", "1");
				backMap.put("errorList", errorList);
			}
		}
		return backMap;
	}
	
	
}
