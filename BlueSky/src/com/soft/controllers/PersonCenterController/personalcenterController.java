package com.soft.controllers.PersonCenterController;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;

import com.soft.AllEntities.system_users;
import com.soft.Service.AllInterfaceForDao.AllServiceInterfaces;

@Controller
public class personalcenterController {

	@Resource(name="AllService")     
	private AllServiceInterfaces asi;//按名称注入,名称是这个接口的具体实现类
	
	    //进入个人中心(框架)链接
	     @RequestMapping("personalCenter")
	     public String personCenter(){//ssm
	    	 
	    	 return "homepageLeftNext/personCenterFrameset";
	     }
	     //个人中心的top部分
	     @RequestMapping("pCenterTop")
	     public String top(){
	    	 
	    	 return "homepageLeftNext/p_center_top";
	     }
	     //left
	     @RequestMapping("pCenterLeft")
	     public String left(){
	    	 
	    	 return "homepageLeftNext/p_center_left";
	     }
	     //right
	     @RequestMapping("pCenterRight")
	     public String right(){
	    	 
	    	 return "homepageLeftNext/p_center_right";
	     }
	     
	     //个人信息列表
	     @RequestMapping("messListInRight")
	     public String p_MessList(HttpSession session,ModelMap M_map){
	    	 
	    	 //把用户注册时填写的所有信息(在一个实体类里全部传过去    --> input的value 然后再return界面 )
	    	 //根据用户的登录名,查询出这个用户的所有信息,在界面显示出来方便更改
	    	String username =  (String)session.getAttribute("username");
	    	system_users sys_u =  asi.selectOneUserMess(username);
	    	 M_map.addAttribute("sys_u", sys_u); //这个方法传值才ok !!!
	    	 return "homepageLeftNext/MessListInRight";
	     }
	     
	     /**修改完所有信息后接收修改结果，录库(update)
	      * updatePersonMess()方法
	      * **/
	     @RequestMapping("")
	     public String updatePersonMess(){
	    	 
	    	 return "";
	     }
	     
	     //我加入的社团
	     @RequestMapping("ijoinedteam")
	     public String Team_joined(){
	    	 //同理先查询该用户的所有社团---加入的
	    	 return "homepageLeftNext/IJoinedTeams";
	     }
	     //我管理的社团
	     @RequestMapping("imanageteam")
	     public String Team_manage(){
	    	 //同理先查询该用户的所有社团---管理的
	    	 return "homepageLeftNext/IManageTeam";
	     }
	
}
