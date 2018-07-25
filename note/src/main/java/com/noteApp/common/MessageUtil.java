package com.noteApp.common;

import java.util.Locale;

import org.springframework.context.MessageSource;

public class MessageUtil {
	
	
	private static MessageSource msgSource;
	
	public static  String getMessage(String key, String[] params) {
		String value = msgSource.getMessage(key, (Object[]) params, Locale.getDefault());
		return value;
	}

}
