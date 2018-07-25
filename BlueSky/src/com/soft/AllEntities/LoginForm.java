package com.soft.AllEntities;

/*
 * 与users表对应
 * **/
public class LoginForm {

	private String username;
	private String password;
	
	
	public String getLogin_username() {
		return username;
	}
	public void setLogin_username(String login_username) {
		this.username = login_username;
	}
	public String getLogin_password() {
		return password;
	}
	public void setLogin_password(String login_password) {
		this.password = login_password;
	}
	@Override
	public String toString() {
		return "LoginForm [login_username=" + username
				+ ", login_password=" + password + "]";
	}
	
	
	
	
}
