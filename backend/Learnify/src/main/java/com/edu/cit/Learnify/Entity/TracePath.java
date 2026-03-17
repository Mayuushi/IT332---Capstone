package com.edu.cit.Learnify.Entity;

import java.util.ArrayList;
import java.util.List;

public class TracePath {

    private List<TracePoint> coordinates = new ArrayList<>();
    private Integer canvasWidth;
    private Integer canvasHeight;

    public TracePath() {
    }

    public TracePath(List<TracePoint> coordinates, Integer canvasWidth, Integer canvasHeight) {
        this.coordinates = coordinates;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
    }

    public List<TracePoint> getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(List<TracePoint> coordinates) {
        this.coordinates = coordinates;
    }

    public Integer getCanvasWidth() {
        return canvasWidth;
    }

    public void setCanvasWidth(Integer canvasWidth) {
        this.canvasWidth = canvasWidth;
    }

    public Integer getCanvasHeight() {
        return canvasHeight;
    }

    public void setCanvasHeight(Integer canvasHeight) {
        this.canvasHeight = canvasHeight;
    }

    public static class TracePoint {
        private double x;
        private double y;

        public TracePoint() {
        }

        public TracePoint(double x, double y) {
            this.x = x;
            this.y = y;
        }

        public double getX() {
            return x;
        }

        public void setX(double x) {
            this.x = x;
        }

        public double getY() {
            return y;
        }

        public void setY(double y) {
            this.y = y;
        }
    }
}
