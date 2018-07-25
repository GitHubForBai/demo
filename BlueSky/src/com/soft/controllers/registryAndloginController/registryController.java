package com.soft.controllers.registryAndloginController;

import javax.annotation.Resource;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.soft.AllEntities.RegistryOneCount;
import com.soft.Service.AllInterfaceForDao.AllServiceInterfaces;

import net.sf.json.JSONObject;

@Controller
public class registryController {

	//作为一个flag
	JSONObject jsono = new JSONObject();
	//注入接口
	@Resource(name="AllService")
	private AllServiceInterfaces asi;
	
	//单纯进入注册账号界面
	@RequestMapping("registry")
	public String Registry(){
		
		/**(在xml中已经配置写好  前缀文件名   后缀扩展名)  
	     */
		return "./Registry/registry";
	}
	
	//注册填写后提交的表单   >> 所有项目的内容都接收到后台实体类  >> 存库
	@RequestMapping("registry_done")
	public String Registry_done(RegistryOneCount user){
		
		//先验证包含ajax的表单
		if(jsono.get("flag").equals("yes")){
			return "./Registry/registry";
		}else{
			asi.insertOneUser(user);
			
			return "HomePage";
		}
		
		
		
	}
	
	//判断用户名是否重复
	@ResponseBody
	@RequestMapping(value="ajax_verify")
	public JSONObject verifyOneUsername(String username,String flag){
		 System.out.println("判断用户名是否重复传过来的username  " + username);
		 System.out.println("是否重复" + flag);
		 //用这个username查
		 boolean bflag = asi.selectOneUsername(username);
		 
		 if(bflag){
			 //说明查到了,那不能让注册
			 jsono.put(flag, "yes");
			 return jsono;
		 }else{
			 jsono.put(flag, "no");
			 return jsono;
		 }
		

	}
	
}
