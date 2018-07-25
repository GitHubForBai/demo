package com.soft.controllers.HomePageController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomePageController {

	
	//进入主界面
	@RequestMapping("homepage")
	public  String home(){
		
		
		return "HomePage";
	} 
	
	
	
	
}
