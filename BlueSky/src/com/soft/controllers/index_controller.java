package com.soft.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class index_controller {

	
/**
 * 
 *按照 功能模块划分 
 * 
 * 
 **/
	@RequestMapping("index_jsp")
	public String asd(){
		System.out.println("进入index界面");
		return "index";
	}
	
	
}
