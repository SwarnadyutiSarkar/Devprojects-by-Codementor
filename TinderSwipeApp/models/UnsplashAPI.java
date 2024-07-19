import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class UnsplashAPI {
    private static final String API_URL = "https://api.unsplash.com/";
    private static final String API_KEY = "YOUR_UNSPLASH_API_KEY";

    public interface UnsplashService {
        @GET("photos/random")
        Call<List<Image>> getRandomImages(@Query("count") int count, @Header("Authorization") String apiKey);
    }

    public static void downloadImages(final ImageController imageController) {
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl(API_URL)
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        UnsplashService service = retrofit.create(UnsplashService.class);

        Call<List<Image>> call = service.getRandomImages(10, API_KEY);
        call.enqueue(new Callback<List<Image>>() {
            @Override
            public void onResponse(Call<List<Image>> call, Response<List<Image>> response) {
                List<Image> images = response.body();
                imageController.setImages(images);
            }

            @Override
            public void onFailure(Call<List<Image>> call, Throwable t) {
                // Handle error
            }
        });
    }
}