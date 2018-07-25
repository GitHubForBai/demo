package com.noteApp.common;

public class GlobalUtil {
	
	/**
	 * 判断一个字符串是否为空
	 * @param str
	 * @return
	 * 2018年7月16日 - 下午7:14:43
	 * boolean
	 * @author admin
	 */
	public static boolean isEmpty(String str) {
		return str == null || str.length() == 0  ? true : false;
	}

}
