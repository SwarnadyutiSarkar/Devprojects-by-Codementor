package com.example.moodloggingapp;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Spinner;

import androidx.appcompat.app.AppCompatActivity;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MoodEntryActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_mood_entry);

        EditText peopleEditText = findViewById(R.id.peopleEditText);
        Spinner moodSpinner = findViewById(R.id.moodSpinner);
        Spinner activitySpinner = findViewById(R.id.activitySpinner);
        Button saveButton = findViewById(R.id.saveButton);

        saveButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String mood = moodSpinner.getSelectedItem().toString();
                String people = peopleEditText.getText().toString();
                String activity = activitySpinner.getSelectedItem().toString();
                String timestamp = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.getDefault()).format(new Date());

                MoodEntry newEntry = new MoodEntry(mood, people, activity, timestamp);
                // Save the entry and go back to the main activity
                // (This example assumes a simple in-memory list in MainActivity)
                MainActivity.moodEntries.add(newEntry);
                MainActivity.adapter.notifyDataSetChanged();
                finish();
            }
        });
    }
}
