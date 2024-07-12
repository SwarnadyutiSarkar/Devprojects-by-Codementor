package com.example.moodloggingapp;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;

public class MoodEntryAdapter extends RecyclerView.Adapter<MoodEntryAdapter.ViewHolder> {
    private Context context;
    private ArrayList<MoodEntry> moodEntries;

    public MoodEntryAdapter(Context context, ArrayList<MoodEntry> moodEntries) {
        this.context = context;
        this.moodEntries = moodEntries;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.mood_entry_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        MoodEntry entry = moodEntries.get(position);
        holder.moodTextView.setText(entry.getMood());
        holder.peopleTextView.setText(entry.getPeople());
        holder.activityTextView.setText(entry.getActivity());
        holder.timestampTextView.setText(entry.getTimestamp());
    }

    @Override
    public int getItemCount() {
        return moodEntries.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        TextView moodTextView, peopleTextView, activityTextView, timestampTextView;

        public ViewHolder(@NonNull View itemView) {
            super(itemView);
            moodTextView = itemView.findViewById(R.id.moodTextView);
            peopleTextView = itemView.findViewById(R.id.peopleTextView);
            activityTextView = itemView.findViewById(R.id.activityTextView);
            timestampTextView = itemView.findViewById(R.id.timestampTextView);
        }
    }
}
