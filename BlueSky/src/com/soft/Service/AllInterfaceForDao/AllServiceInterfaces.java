package com.soft.Service.AllInterfaceForDao;

import java.util.Map;

import com.soft.AllEntities.RegistryOneCount;
import com.soft.AllEntities.system_users;

public interface AllServiceInterfaces {

	//判断用户是否可以登录
	public boolean selectOneUser(Map map);
	
	//用户注册账号
	public void insertOneUser(RegistryOneCount user);

	//根据这个用户的用户名,来查询这个用户的所有信息
	public system_users selectOneUserMess(String username);
	
	//根据想要注册的username查,判断重不重复,可不可以注册
	public boolean selectOneUsername(String username); 
	
	
}
