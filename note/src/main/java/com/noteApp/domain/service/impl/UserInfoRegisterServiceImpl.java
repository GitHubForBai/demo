package com.noteApp.domain.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.ui.Model;

import com.noteApp.common.GlobalUtil;
import com.noteApp.domain.model.UserInfoEntity;
import com.noteApp.domain.repository.UserInfoRegisterRepository;
import com.noteApp.domain.service.UserInfoRegisterService;

@Service
public class UserInfoRegisterServiceImpl implements UserInfoRegisterService{

	@Resource
	UserInfoRegisterRepository userInfoRegisterRepository;
	
	/**
	 * 验证用户信息
	 * @param userInfoEntity
	 * @return
	 * 2018年7月16日 - 下午7:05:38
	 * boolean
	 * @author admin
	 */
	@Override
	public boolean validateUserInfo(UserInfoEntity userInfoEntity, Model model, List<String> errorList) {
		
		
		return false;
	}

	
	private boolean isUserInfoEmpty(UserInfoEntity userInfoEntity, Model model) {
		boolean isIllegal = false;
		// 用户名为空
		if (GlobalUtil.isEmpty(userInfoEntity.getUserName())) {
			isIllegal = true;
			model.addAttribute("err", "");
		}
		
		// 密码为空
		
		return true;
	}

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
	@Override
	public boolean validataUserName(String userName, Model model, List<String> errorList) {
		// 检索用户名是否出现重复
		String resultUserName = userInfoRegisterRepository.validateUserName(userName);
		if (GlobalUtil.isEmpty(resultUserName)) {
			return false;
		}
		errorList.add("该用户名重复,请重新输入。");
		return true;
	}
	
	
}
