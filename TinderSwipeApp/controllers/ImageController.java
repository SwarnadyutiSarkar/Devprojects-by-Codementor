import android.content.Context;
import android.widget.ImageView;

import java.util.List;

public class ImageController {
    private Context context;
    private List<Image> images;
    private int currentIndex;

    public ImageController(Context context) {
        this.context = context;
    }

    public void downloadImages() {
        UnsplashAPI.downloadImages(this);
    }

    public void setImages(List<Image> images) {
        this.images = images;
        currentIndex = 0;
        displayImage();
    }

    public void likeImage() {
        // Handle like action
        displayNextImage();
    }

    public void dislikeImage() {
        // Handle dislike action
        displayNextImage();
    }

    private void displayImage() {
        ImageView imageView = (ImageView) ((Activity) context).findViewById(R.id.image_view);
        Image image = images.get(currentIndex);
        // Load image into image view
        imageView.setImageURI(Uri.parse(image.getUrl()));
    }

    private void displayNextImage() {
        currentIndex++;
        if (currentIndex >= images.size()) {
            currentIndex = 0;
        }
        displayImage();
    }
}