package com.example.moodloggingapp;

public class MoodEntry {
    private String mood;
    private String people;
    private String activity;
    private String timestamp;

    public MoodEntry(String mood, String people, String activity, String timestamp) {
        this.mood = mood;
        this.people = people;
        this.activity = activity;
        this.timestamp = timestamp;
    }

    public String getMood() { return mood; }
    public String getPeople() { return people; }
    public String getActivity() { return activity; }
    public String getTimestamp() { return timestamp; }
}
