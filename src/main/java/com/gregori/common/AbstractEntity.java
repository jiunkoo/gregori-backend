package com.gregori.common;

import lombok.Getter;

import java.time.ZonedDateTime;

@Getter
public class AbstractEntity {

    private ZonedDateTime createdAt;
    private ZonedDateTime updatedAt;

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
