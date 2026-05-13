package com.edu.cit.Learnify.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(
                    "http://localhost:3000",
                    "https://your-frontend-domain.vercel.app"  // add this
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")  // Allow methods you need
                .allowedHeaders("*");  // Allow all headers
    }
}
