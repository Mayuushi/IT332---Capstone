package com.edu.cit.Learnify.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "badges")
public class Badge {
    @Id
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private String criteria; // Description of how to earn this badge
    private int requiredPoints; // Points needed to earn this badge (if applicable)
    private String category; // E.g., "Learning Progress", "Achievement", "Engagement"

    // Constructors
    public Badge() {}

    public Badge(String name, String description, String imageUrl,
                 String criteria, int requiredPoints, String category) {
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.criteria = criteria;
        this.requiredPoints = requiredPoints;
        this.category = category;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCriteria() {
        return criteria;
    }

    public void setCriteria(String criteria) {
        this.criteria = criteria;
    }

    public int getRequiredPoints() {
        return requiredPoints;
    }

    public void setRequiredPoints(int requiredPoints) {
        this.requiredPoints = requiredPoints;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}

