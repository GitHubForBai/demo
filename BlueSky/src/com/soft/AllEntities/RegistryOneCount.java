package com.soft.AllEntities;

import java.util.Date;

//这个类的属性名和对应的用户表的列名全都一样   !!
//这个类对应注册账号的前台的所有控件名称,便于把值取到后台,进行录入
public class RegistryOneCount {
//属性名要求和控件名一模一样,并set() get()
	
	private String username;
	private String password;
	private String college_name;
	private String real_name;
	private String stu_id;
	private String sex;
	private String nation;
	private String start_time;   //入学时间是日期类型,util下的Date
	private String qq_num;
	
	
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getCollege_name() {
		return college_name;
	}
	public void setCollege_name(String college_name) {
		this.college_name = college_name;
	}
	public String getReal_name() {
		return real_name;
	}
	public void setReal_name(String real_name) {
		this.real_name = real_name;
	}
	public String getStu_id() {
		return stu_id;
	}
	public void setStu_id(String stu_id) {
		this.stu_id = stu_id;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}


	public String getStart_time() {
		return start_time;
	}
	public void setStart_time(String start_time) {
		this.start_time = start_time;
	}
	public String getQq_num() {
		return qq_num;
	}
	public void setQq_num(String qq_num) {
		this.qq_num = qq_num;
	}
	
	
	
	
}
