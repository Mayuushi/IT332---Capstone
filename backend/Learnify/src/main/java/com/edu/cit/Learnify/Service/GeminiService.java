package com.edu.cit.Learnify.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);

    @Value("${groq.api.key}")
    private String apiKey;

    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String GROQ_MODEL = "llama-3.3-70b-versatile";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Random random = new Random();

    private static final List<String> QUESTION_STYLES = List.of(
        "Use a fun analogy comparing the nervous system to a computer or city.",
        "Frame the question as a mystery the student must solve.",
        "Ask about a real-life scenario (e.g., touching something hot, riding a bike).",
        "Ask about what happens when something goes wrong (e.g., an injury or reflex).",
        "Focus on a surprising or little-known fact.",
        "Ask a 'what would happen if...' hypothetical question.",
        "Ask the student to identify which part of the nervous system does a specific job."
    );

    private static final Map<String, String> ENEMY_TOPICS = Map.of(
        "synapse_slime",  "neurons, synapses, and how nerve signals travel",
        "reflex_rex",     "reflexes, the spinal cord, and automatic responses",
        "brain_boss",     "parts of the brain: cerebrum, cerebellum, and brainstem",
        "sense_specter",  "the five senses and how sensory information reaches the brain",
        "nerve_ninja",    "the central nervous system and peripheral nervous system"
    );

    // ── Fallback question bank ───────────────────────────────────────────────
    private static final List<GeminiQuestion> FALLBACK_QUESTIONS = new ArrayList<>();
    static {
        FALLBACK_QUESTIONS.add(make(
            "Which part of the brain controls balance and coordination? 🧠",
            List.of("A) Cerebrum", "B) Cerebellum", "C) Brainstem", "D) Spinal Cord"),
            "B) Cerebellum",
            "The cerebellum sits at the back of your brain and keeps you from falling over!",
            "The cerebellum has more neurons than any other part of the brain!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "What do neurons use to send messages to each other? ⚡",
            List.of("A) Blood cells", "B) Electrical and chemical signals", "C) Oxygen", "D) Bones"),
            "B) Electrical and chemical signals",
            "Neurons pass messages using tiny electrical sparks and special chemicals called neurotransmitters!",
            "Your brain sends signals faster than a race car — up to 270 mph!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "What happens when you touch something hot without thinking? 🔥",
            List.of("A) Your brain decides to move", "B) A reflex arc pulls your hand away", "C) Your heart speeds up", "D) You fall asleep"),
            "B) A reflex arc pulls your hand away",
            "A reflex arc bypasses the brain and goes straight through the spinal cord so you react super fast!",
            "Reflexes can happen in as little as 50 milliseconds — that's 20 times faster than a blink!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "Which part of the nervous system controls your heartbeat automatically? 💓",
            List.of("A) Central nervous system", "B) Somatic nervous system", "C) Autonomic nervous system", "D) Cerebral cortex"),
            "C) Autonomic nervous system",
            "The autonomic nervous system runs your heartbeat, breathing, and digestion automatically — 24/7!",
            "Even when you sleep, your autonomic nervous system keeps all your vital functions running!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "What is the job of the brainstem? 🌿",
            List.of("A) Solving math problems", "B) Storing memories", "C) Controlling breathing and heart rate", "D) Seeing colors"),
            "C) Controlling breathing and heart rate",
            "The brainstem is like the body's autopilot — it handles things you never have to think about!",
            "The brainstem is the oldest part of the brain in terms of evolution — all vertebrates have one!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "How many neurons does the human brain contain? 🤯",
            List.of("A) About 1,000", "B) About 1 million", "C) About 86 billion", "D) About 1 trillion"),
            "C) About 86 billion",
            "Your brain holds roughly 86 billion neurons, all working together to make you YOU!",
            "If you lined up all your neurons end to end, they would stretch nearly 600 miles!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "Which sense bypasses the thalamus and goes straight to the brain's emotion center? 👃",
            List.of("A) Vision", "B) Hearing", "C) Smell", "D) Touch"),
            "C) Smell",
            "Smell has a direct pathway to the brain's emotion and memory centres — unlike any other sense!",
            "That's why a familiar scent can instantly bring back a vivid memory!"
        ));
        FALLBACK_QUESTIONS.add(make(
            "What covers and protects neurons like insulation on a wire? ⚡",
            List.of("A) Cartilage", "B) Myelin sheath", "C) Plasma membrane", "D) Dendrite coating"),
            "B) Myelin sheath",
            "The myelin sheath is a fatty layer that wraps around axons and speeds up nerve signals!",
            "Signals travel up to 100 times faster in myelinated nerves than in unmyelinated ones!"
        ));
    }

    private static GeminiQuestion make(String question, List<String> options,
                                       String correct, String explanation, String funFact) {
        GeminiQuestion q = new GeminiQuestion();
        q.setQuestion(question);
        q.setOptions(options);
        q.setCorrect(correct);
        q.setExplanation(explanation);
        q.setFunFact(funFact);
        return q;
    }

    private int lastFallbackIndex = -1;

    // ── Generate question ────────────────────────────────────────────────────
    public GeminiQuestion generateQuestion(String enemyType) {
        String topic = ENEMY_TOPICS.getOrDefault(enemyType, "the human nervous system");
        String styleHint = QUESTION_STYLES.get(random.nextInt(QUESTION_STYLES.size()));
        String uniqueTag = UUID.randomUUID().toString().substring(0, 8);

        String prompt = String.format("""
            You are a fun science teacher for children aged 8-12.
            Generate ONE unique multiple-choice question about "%s" for a turn-based educational game.

            Style guidance (follow this to make the question feel fresh): %s

            Rules:
            - Language must be simple, fun, and exciting (use emojis sparingly)
            - Four answer choices labeled A, B, C, D
            - Only one correct answer
            - Include a short fun explanation (1 sentence)
            - Include a cool fun fact (1 sentence)
            - Do NOT reuse common textbook phrasing — be creative!

            Unique request ID (ignore this, it just ensures a fresh response): %s

            Return ONLY valid JSON — no markdown, no extra text:
            {
              "question": "...",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "correct": "A) ...",
              "explanation": "...",
              "funFact": "..."
            }
            """, topic, styleHint, uniqueTag);

        String rawResponse = callGroq(prompt);
        return parseQuestion(rawResponse);
    }

    // ── Generate feedback ────────────────────────────────────────────────────
    public String generateFeedback(boolean correct, String question, String correctAnswer, String playerName) {
        String prompt = String.format("""
            A child named %s is playing a nervous system quiz game.
            Question: "%s"
            Correct answer: "%s"
            Did they get it right? %s

            Write ONE short, encouraging sentence (max 20 words) as feedback.
            If wrong, be kind and hint at what to remember.
            If correct, celebrate enthusiastically!
            Return ONLY the feedback sentence, nothing else.
            """, playerName, question, correctAnswer, correct ? "YES" : "NO");

        String response = callGroq(prompt);
        if (response == null || response.isBlank()) {
            return correct
                ? "Amazing job, " + playerName + "! Your brain is on fire! 🔥"
                : "Good try! Remember: " + correctAnswer + " — you've got this! 💪";
        }
        return response.trim().replaceAll("^[\"']|[\"']$", "");
    }

    // ── Call Groq API (OpenAI-compatible format) ─────────────────────────────
    private String callGroq(String prompt) {
        try {
            ObjectNode requestBody = objectMapper.createObjectNode();
            requestBody.put("model", GROQ_MODEL);
            requestBody.put("temperature", 1.2);
            requestBody.put("max_tokens", 600);

            ArrayNode messages = requestBody.putArray("messages");
            ObjectNode message = messages.addObject();
            message.put("role", "user");
            message.put("content", prompt);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);  // Groq uses Bearer token auth

            HttpEntity<String> entity = new HttpEntity<>(objectMapper.writeValueAsString(requestBody), headers);
            ResponseEntity<String> response = restTemplate.postForEntity(GROQ_URL, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                return root.path("choices")
                           .get(0)
                           .path("message")
                           .path("content")
                           .asText("");
            }
        } catch (Exception e) {
            log.error("Groq API call failed: {}", e.getMessage());
        }
        return "";
    }

    // ── Parse response ───────────────────────────────────────────────────────
    private GeminiQuestion parseQuestion(String rawJson) {
        if (rawJson == null || rawJson.isBlank()) {
            return fallbackQuestion();
        }

        String cleaned = rawJson.trim()
                .replaceAll("```json\\s*", "")
                .replaceAll("```\\s*", "")
                .trim();

        try {
            JsonNode node = objectMapper.readTree(cleaned);
            GeminiQuestion q = new GeminiQuestion();
            q.setQuestion(node.path("question").asText(""));

            if (q.getQuestion().isBlank()) return fallbackQuestion();

            List<String> options = new ArrayList<>();
            node.path("options").forEach(opt -> options.add(opt.asText()));
            if (options.isEmpty()) return fallbackQuestion();

            q.setOptions(options);
            q.setCorrect(node.path("correct").asText(options.get(0)));
            q.setExplanation(node.path("explanation").asText("The brain controls everything your body does!"));
            q.setFunFact(node.path("funFact").asText("Your brain uses about 20% of your body's energy!"));
            return q;
        } catch (Exception e) {
            log.warn("Could not parse Groq response, using fallback. Raw: {}", rawJson);
            return fallbackQuestion();
        }
    }

    // Never repeats the same fallback twice in a row
    private GeminiQuestion fallbackQuestion() {
        int index;
        do {
            index = random.nextInt(FALLBACK_QUESTIONS.size());
        } while (index == lastFallbackIndex && FALLBACK_QUESTIONS.size() > 1);
        lastFallbackIndex = index;
        log.warn("Using fallback question #{}", index);
        return FALLBACK_QUESTIONS.get(index);
    }

    // ── Inner DTO ────────────────────────────────────────────────────────────
    public static class GeminiQuestion {
        private String question;
        private List<String> options;
        private String correct;
        private String explanation;
        private String funFact;

        public String       getQuestion()    { return question; }
        public List<String> getOptions()     { return options; }
        public String       getCorrect()     { return correct; }
        public String       getExplanation() { return explanation; }
        public String       getFunFact()     { return funFact; }

        public void setQuestion(String question)       { this.question = question; }
        public void setOptions(List<String> options)   { this.options = options; }
        public void setCorrect(String correct)         { this.correct = correct; }
        public void setExplanation(String explanation) { this.explanation = explanation; }
        public void setFunFact(String funFact)         { this.funFact = funFact; }
    }
}