package com.soft.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class index_controller {

	
/**
 * 
 *���� ����ģ�黮�� 
 * 
 * 
 **/
	@RequestMapping("index_jsp")
	public String asd(){
		System.out.println("����index����");
		return "index";
	}
	
	
}
