package sennse.component;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import sennse.services.SennseTargetGeneratorService;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Component
public class ImageDetective {
    private static final String IMAGE_FOLDER = "/app/uploads/Images"; // must match app.upload.dir

    @Autowired
    private SennseTargetGeneratorService sennseTargetGeneratorService;

    @Value("${app.upload.dir}")
    private String uploadDir;

    @PostConstruct
    public void init() {
        new Thread(this::watch).start();
    }

    private void watch() {
        try {
            Path path = Paths.get(IMAGE_FOLDER);
            Files.createDirectories(path); // ensure folder exists
            WatchService watchService = FileSystems.getDefault().newWatchService();
            path.register(watchService, StandardWatchEventKinds.ENTRY_CREATE);

            System.out.println("Watching for new images in " + path.toAbsolutePath());

            while (true) {
                WatchKey key = watchService.take();

                for (WatchEvent<?> event : key.pollEvents()) {
                    WatchEvent.Kind<?> kind = event.kind();

                    if (kind == StandardWatchEventKinds.ENTRY_CREATE) {
                        Path newFile = (Path) event.context();
                        System.out.println("New image uploaded: " + newFile.getFileName());

                        // Wait briefly to ensure file is fully written
                        Thread.sleep(5);

                        // ⬇️ Run your script to display all images
                        List<String> listImages = listAllImages();
                        System.out.println("Image List: " + listImages);

                        this.sennseTargetGeneratorService.getImagesTarget(listImages);
                    }
                }

                key.reset();
            }

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<String> listAllImages() {
        List<String> imagesList = new ArrayList<>();
        try (Stream<Path> files = Files.list(Paths.get(IMAGE_FOLDER))) {
            files.filter(Files::isRegularFile)
                    .forEach(file -> {
                        System.out.println(uploadDir + file.getFileName());
                        imagesList.add(uploadDir + file.getFileName());
                    });
        } catch (IOException e) {
            e.printStackTrace();
        }
        return imagesList;
    }

}
