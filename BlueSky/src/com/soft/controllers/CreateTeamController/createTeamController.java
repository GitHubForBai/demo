package com.soft.controllers.CreateTeamController;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class createTeamController {

	@RequestMapping("createteam")
	public String createteam(){
		/*   **/
		
		
		return "CreateTeam/createTeam";
	}
	
}
