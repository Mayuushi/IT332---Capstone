package com.edu.cit.Learnify.DTO;

import java.time.LocalDateTime;

public class BadgeDTO {
    private String id;
    private String name;
    private String description;
    private String imageUrl;
    private LocalDateTime earnedAt;
    private boolean isNew;

    // Constructors, Getters and Setters
    public BadgeDTO(String id, String name, String description, String imageUrl,
                    LocalDateTime earnedAt, boolean isNew) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
        this.earnedAt = earnedAt;
        this.isNew = isNew;
    }

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

    public LocalDateTime getEarnedAt() {
        return earnedAt;
    }

    public void setEarnedAt(LocalDateTime earnedAt) {
        this.earnedAt = earnedAt;
    }

    public boolean isNew() {
        return isNew;
    }

    public void setNew(boolean isNew) {
        this.isNew = isNew;
    }
}

