package com.soft.controllers.EverydayNews;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomePageRight {

	@RequestMapping("r_1")
	public String right_1(){
		return "./homeRight/right_news_1";
	}
	@RequestMapping("r_2")
	public String right_2(){
		return "./homeRight/right_news_2";
	}
	@RequestMapping("r_3")
	public String right_3(){
		return "./homeRight/right_news_3";
	}
	@RequestMapping("r_4")
	public String right_4(){
		return "./homeRight/right_news_4";
	}
	@RequestMapping("r_5")
	public String right_5(){
		return "./homeRight/right_news_5";
	}
	@RequestMapping("r_6")
	public String right_6(){
		return "./homeRight/right_news_6";
	}
}
