package com.soft.Service;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.soft.AllEntities.LoginForm;
import com.soft.AllEntities.RegistryOneCount;
import com.soft.AllEntities.system_users;
import com.soft.Service.AllInterfaceForDao.AllServiceInterfaces;
import com.soft.dao.Dao;

@Service("AllService")
public class AllService implements AllServiceInterfaces {

	 @Autowired
     private  Dao dao;//注入dao层
	
	 //查询这个账号密码对不对
	public boolean selectOneUser(Map map) {
		System.out.println(map);
		LoginForm loginform; //接受方法返回值
		boolean bflag = true;
		loginform = dao.SelectOneUser(map); 

		if(loginform == null){
			bflag = false;
		}
		System.out.println(loginform);
		System.out.println(bflag);
		return bflag;
	}

	//注册用户
	public void insertOneUser(RegistryOneCount user) {
		// TODO Auto-generated method stub
		dao.InsertOneUser(user);
		
	}

	@Override
	public system_users selectOneUserMess(String username) {
		// TODO Auto-generated method stub
		system_users ss =  dao.selectOneMess(username);
	//	System.out.println(ss);
		return ss;
	}

	@Override
	public boolean selectOneUsername(String username) {
	 List<Map> userCount = dao.selectOneUsername(username);

	 if(userCount.size() == 0){
			return false; // 
		}else{
			return true;   // 
		}
		
	
	}

	
	
	 
	
	
}
