package com.soft.controllers.registryAndloginController;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.soft.Service.AllInterfaceForDao.AllServiceInterfaces;



@Controller
public class LoginController {
	
	//按名称注入
	@Resource(name="AllService")       
	private  AllServiceInterfaces asi; //声明接口,但是使用它的具体实现类中的方法
		
	//进入登录界面
    @RequestMapping("login")
	public String login(){
		return "./Login/login";
	}
    
    //填写完内容提交表单，之后返回首页，对应显示状态为已登录
    @RequestMapping("submit_form")
    public String submit_form(String login_username,String login_password,ModelMap M_map,HttpServletRequest request){
    	                        //获取前台控件的值(name对应)
    	System.out.println(login_username);
    	System.out.println(login_password);
    	
    	Map<String,String> map = new HashMap<String,String>();
    	map.put("username", login_username);
    	map.put("password", login_password);
    	boolean checkflag = asi.selectOneUser(map);
    	
    	if(checkflag){
    		request.getSession().setAttribute("username", login_username);
    		
    	    return "./HomePage";//登录成功返回首页,并显示当前登录状态
    	}else{
    		M_map.put("checkflag", checkflag); //判定失败,则把checkflag(false)放到modelmap里
    		return "./Login/login";
    	}

    }
    //退出系统 -- > 消亡session
    @RequestMapping("exit")
    public String Exit(HttpServletRequest request){
    	request.getSession().invalidate();
    	return "./HomePage";
    }
	
	
}
