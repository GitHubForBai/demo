package com.noteApp.domain.service;

import java.util.List;

import org.springframework.ui.Model;

import com.noteApp.domain.model.UserInfoEntity;


public interface UserInfoRegisterService {

	/**
	 * 验证用户信息
	 * @param userInfoEntity
	 * @return
	 * 2018年7月16日 - 下午7:05:38
	 * boolean
	 * @author admin
	 */
	boolean validateUserInfo(UserInfoEntity userInfoEntity, Model model, List<String> errorList);
	
	/**
	 * 判断用户名是否出现重复
	 * @param userName
	 * @param model
	 * @param errorList
	 * @return
	 * 2018年7月17日 - 下午7:53:37
	 * boolean
	 * @author admin
	 */
	boolean validataUserName(String userName, Model model, List<String> errorList);
}
