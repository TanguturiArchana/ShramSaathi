package com.osi.shramsaathi.service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Service;


@Service
public class TranslationService {

    private final HttpClient client = HttpClient.newHttpClient();

    public String translate(String text, String targetLang) {
        if (text == null || text.isBlank() || "en".equalsIgnoreCase(targetLang)) {
            return text;
        }

        try {
            String url = "https://translate.googleapis.com/translate_a/single"
                + "?client=gtx"
                + "&sl=auto"
                + "&tl=" + targetLang
                + "&dt=t"
                + "&q=" + URLEncoder.encode(text, StandardCharsets.UTF_8);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .GET()
                    .build();

            HttpResponse<String> response =
                    client.send(request, HttpResponse.BodyHandlers.ofString());

            // quick parse
            return response.body().split("\"")[1];
        } catch (Exception e) {
            return text; // fallback safe
        }
    }
}
