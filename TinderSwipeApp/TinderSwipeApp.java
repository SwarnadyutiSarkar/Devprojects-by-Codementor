import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;

public class TinderSwipeApp extends AppCompatActivity {

    private ImageController imageController;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tinder_swipe_app);

        imageController = new ImageController(this);
        imageController.downloadImages();

        SwipeView swipeView = findViewById(R.id.swipe_view);
        swipeView.setOnSwipeListener(new SwipeView.OnSwipeListener() {
            @Override
            public void onSwipeLeft() {
                imageController.dislikeImage();
            }

            @Override
            public void onSwipeRight() {
                imageController.likeImage();
            }
        });
    }
}