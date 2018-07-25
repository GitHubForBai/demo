package com.soft.dao;

import java.util.List;
import java.util.Map;

import com.soft.AllEntities.LoginForm;
import com.soft.AllEntities.RegistryOneCount;
import com.soft.AllEntities.system_users;

public interface Dao {
    /**所有数据层的接口**/
	
	//用户登录时进行查询判断
	public LoginForm SelectOneUser(Map map); 
	
	//注册账号(录入)
	public void InsertOneUser(RegistryOneCount user);
	
	//根据当前已经登录的用户的登录名,来查询这个用户的所有信息
	public system_users selectOneMess(String username);
	
	//根据一个用户名来查询这个用户名是否重复
	public List selectOneUsername( String username);
}
