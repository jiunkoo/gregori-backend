package com.gregori.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {
	@Bean
	public OpenAPI gregoriOpenAPI() {
		Server localServer = new Server();
		localServer.setUrl("http://localhost:8080");
		localServer.setDescription("로컬 개발 서버");

		Contact contact = new Contact();
		contact.setName("GREGORI API Support");

		Info info = new Info()
			.title("GREGORI API")
			.version("1.0.0")
			.description("GREGORI 종합 쇼핑몰 REST API 명세서")
			.contact(contact);

		return new OpenAPI()
			.info(info)
			.servers(List.of(localServer));
	}
}

