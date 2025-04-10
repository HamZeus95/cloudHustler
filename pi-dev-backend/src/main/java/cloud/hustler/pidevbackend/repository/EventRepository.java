package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByStartDate(LocalDate startDate);
}
