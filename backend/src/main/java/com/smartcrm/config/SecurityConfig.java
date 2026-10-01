package com.smartcrm.config;

import com.smartcrm.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter
    ) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

            // JWT authentication does not need CSRF tokens
            .csrf(csrf -> csrf.disable())

            // CORS
            .cors(cors ->
                    cors.configurationSource(corsConfigurationSource())
            )

            // No server-side sessions
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )

            .authorizeHttpRequests(auth -> auth

                    // =========================
                    // PUBLIC
                    // =========================

                    .requestMatchers("/api/auth/**")
                    .permitAll()


                    // =========================
                    // ADMIN ONLY
                    // =========================

                    .requestMatchers("/api/users/**")
                    .hasRole("ADMIN")


                    // =========================
                    // CUSTOMER MANAGEMENT
                    // =========================

                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/customers/**"
                    )
                    .hasRole("ADMIN")

                    .requestMatchers("/api/customers/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // LEAD MANAGEMENT
                    // =========================

                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/leads/**"
                    )
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER"
                    )

                    .requestMatchers("/api/leads/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // ACTIVITIES
                    // =========================

                    .requestMatchers("/api/activities/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // DASHBOARD
                    // =========================

                    .requestMatchers("/api/dashboard/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // ANALYTICS
                    // =========================

                    .requestMatchers("/api/analytics/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // AI COPILOT
                    // =========================

                    .requestMatchers("/api/ai/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // DOCUMENTS
                    // =========================

                    // Only ADMIN can delete documents
                    .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/documents/**"
                    )
                    .hasRole("ADMIN")

                    // All CRM roles can view/upload documents
                    .requestMatchers("/api/documents/**")
                    .hasAnyRole(
                            "ADMIN",
                            "SALES_MANAGER",
                            "SALES_REPRESENTATIVE"
                    )


                    // =========================
                    // EVERYTHING ELSE
                    // =========================

                    .anyRequest().authenticated()
            )

            // JWT filter
            .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }
}