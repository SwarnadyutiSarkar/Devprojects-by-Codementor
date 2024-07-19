import android.content.Context;
import android.util.AttributeSet;
import android.view.MotionEvent;
import android.view.View;

public class SwipeView extends View {
    private OnSwipeListener onSwipeListener;

    public SwipeView(Context context) {
        super(context);
    }

    public SwipeView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public SwipeView(Context context, AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @Override
    public boolean onTouchEvent(MotionEvent event) {
        float x = event.getX();
        float y = event.getY();

        switch (event.getAction()) {
            case MotionEvent.ACTION_DOWN:
                // Start swiping
                break;
            case MotionEvent.ACTION_UP:
                // End swiping
                if (x > getWidth() / 2) {
                    onSwipeListener.onSwipeRight();
                } else {
                    onSwipeListener.onSwipeLeft();
                }
                break;
        }

        return true;
    }

    public interface OnSwipeListener {
        void onSwipeLeft();
        void onSwipeRight();
    }

    public void setOnSwipeListener(OnSwipeListener onSwipeListener) {
        this.onSwipeListener = onSwipeListener;
    }
}