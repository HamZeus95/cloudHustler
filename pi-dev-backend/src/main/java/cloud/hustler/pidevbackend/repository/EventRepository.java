package cloud.hustler.pidevbackend.repository;

import cloud.hustler.pidevbackend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    List<Event> findByStartDate(LocalDate startDate);
    @Modifying
    @Query("UPDATE Event e SET e.nbrParticipants = e.nbrParticipants + 1 WHERE e.uuid_event = :eventId")
    void incrementParticipants(@Param("eventId") String eventId);
}
