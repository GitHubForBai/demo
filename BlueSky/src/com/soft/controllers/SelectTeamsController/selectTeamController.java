package com.soft.controllers.SelectTeamsController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class selectTeamController {

	//点击查询社团  ----  所有身份均可访问
	@RequestMapping("selectteam")
	public String select_team(){
		
		
		return "selectTeam/SelectTeam";
	}
	
	
}
