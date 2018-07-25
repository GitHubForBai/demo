package com.soft.AllEntities;

//根据system_users表 封装的类
public class system_users {

	private String username;
	private String password;
	private String college_name;
	private String real_name;
	private String stu_id;
	private String sex;
	private String nation;
	private String start_time; //入学时间,应该是日期类型???
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
	@Override
	public String toString() {
		return "system_users [username=" + username + ", password=" + password + ", college_name=" + college_name
				+ ", real_name=" + real_name + ", stu_id=" + stu_id + ", sex=" + sex + ", nation=" + nation
				+ ", start_time=" + start_time + ", qq_num=" + qq_num + "]";
	}
	
	
	
}
