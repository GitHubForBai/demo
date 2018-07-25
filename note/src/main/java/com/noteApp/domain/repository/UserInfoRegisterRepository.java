package com.noteApp.domain.repository;

public interface UserInfoRegisterRepository {

	/**
	 * 判断用户名是否出现重复
	 * @return
	 * 2018年7月17日 - 下午7:55:53
	 * List<String>
	 * @author admin
	 */
	String validateUserName(String userName);
	
}
